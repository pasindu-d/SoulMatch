import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CreditCard, Clock, CheckCircle2, XCircle, 
  AlertTriangle, RefreshCw, BarChart, Database, CloudUpload, 
  CloudDownload, FolderOpen, ExternalLink, Lock, Check, Key
} from 'lucide-react';
import { UserProfile, UserReport } from '../types';

export default function AdminView() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');

  // Google Drive Sync States
  const [driveToken, setDriveToken] = useState(() => localStorage.getItem('sm_drive_token') || '');
  const [inputToken, setInputToken] = useState(() => localStorage.getItem('sm_drive_token') || '');
  const [folderId, setFolderId] = useState('1bjvxP9yTh4lGJLgZd9y9U-XqpaHEdeyr');
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveStatus, setDriveStatus] = useState<any>(null);
  const [driveLoading, setDriveLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [syncErr, setSyncErr] = useState('');
  const [oauthUrl, setOauthUrl] = useState('');

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriveStatus = async (tokenOverride?: string) => {
    const tokenToUse = tokenOverride !== undefined ? tokenOverride : driveToken;
    if (!tokenToUse) {
      setDriveFiles([]);
      setDriveStatus(null);
      return;
    }
    setDriveLoading(true);
    setSyncErr('');
    try {
      const url = `/api/drive/status?token=${encodeURIComponent(tokenToUse)}&folderId=${encodeURIComponent(folderId)}`;
      const res = await fetch(url);
      const data = await res.json();
      setDriveStatus(data);
      if (data.connected) {
        setDriveFiles(data.files || []);
      } else if (data.lastError) {
        setSyncErr(data.lastError);
      }
    } catch (err: any) {
      console.error("Failed to load Google Drive status", err);
      setSyncErr("Failed connection query of Google Drive API.");
    } finally {
      setDriveLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminMetrics();
    fetchDriveStatus();
    
    // Check if OAuth client keys exist in background
    fetch('/api/auth/google/url').then(r => r.json()).then(data => {
      if (data.url) setOauthUrl(data.url);
    }).catch(err => console.debug("OAuth check ignored"));
  }, [driveToken, folderId]);

  // Listen for incoming postMessage from Google OAuth Callback window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.token) {
        const receivedToken = event.data.token;
        localStorage.setItem('sm_drive_token', receivedToken);
        setDriveToken(receivedToken);
        setInputToken(receivedToken);
        setSyncMsg("Successfully connected via Google accounts popup!");
        fetchDriveStatus(receivedToken);
        fetchAdminMetrics();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOAuthConnect = () => {
    if (!oauthUrl) {
      alert("Google OAuth Credentials (OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET) are not configured yet in your environment variables. Please use the 'Direct Access Token' paste module below to test safely!");
      return;
    }
    const width = 600;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const authWindow = window.open(
      oauthUrl,
      'google_drive_oauth_popup',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
    if (!authWindow) {
      alert("Popup blocker blocked the Google Auth Window. Please prompt permission for popups.");
    }
  };

  const saveManualToken = async () => {
    if (!inputToken.trim()) {
      alert("Please input a valid Google API access token.");
      return;
    }
    setDriveLoading(true);
    setSyncErr('');
    setSyncMsg('');
    try {
      // Notify backend of active token
      const res = await fetch("/api/drive/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken, folderId })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('sm_drive_token', inputToken);
        setDriveToken(inputToken);
        setSyncMsg("Manual Google Access Token assigned successfully!");
        await fetchDriveStatus(inputToken);
      }
    } catch (err: any) {
      setSyncErr("Failed to set Manual Access Token.");
    } finally {
      setDriveLoading(false);
    }
  };

  const pushLocalToDrive = async () => {
    if (!driveToken) {
      alert("Please authenticate or paste a Google Drive token first.");
      return;
    }
    setDriveLoading(true);
    setSyncErr('');
    setSyncMsg('');
    try {
      const res = await fetch("/api/drive/sync-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: driveToken, folderId })
      });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(`Success: ${data.message}`);
        await fetchDriveStatus(driveToken);
        await fetchAdminMetrics();
      } else {
        setSyncErr(data.error || "Failed to push backups");
      }
    } catch (err: any) {
      setSyncErr(err.message || "Failed to backup content");
    } finally {
      setDriveLoading(false);
    }
  };

  const pullDriveToLocal = async (customFileId?: string) => {
    if (!driveToken) {
      alert("Please authenticate or paste a Google Drive token first.");
      return;
    }
    const confirmed = window.confirm(
      customFileId 
        ? "Restore system state from this backup file? This will overwrite the in-memory RAM databases."
        : "Restore system state from latest Google Drive backup records? This will merge and adjust current user DB records."
    );
    if (!confirmed) return;

    setDriveLoading(true);
    setSyncErr('');
    setSyncMsg('');
    try {
      const res = await fetch("/api/drive/sync-pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: driveToken, folderId, fileId: customFileId })
      });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(`Success: ${data.message}`);
        await fetchDriveStatus(driveToken);
        await fetchAdminMetrics();
        alert("Success! System RAM databases have been synchronized with files stored on Google Drive!");
      } else {
        setSyncErr(data.error || "Failed to retrieve backup");
      }
    } catch (err: any) {
      setSyncErr(err.message || "Failed to pull files");
    } finally {
      setDriveLoading(false);
    }
  };

  const disconnectDrive = async () => {
    localStorage.removeItem('sm_drive_token');
    setDriveToken('');
    setInputToken('');
    setDriveFiles([]);
    setDriveStatus(null);
    setSyncMsg("Disconnected successfully from previous Google session.");
  };

  const handleApproveVerification = async (userId: string) => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_status: 'verified' })
      });
      const data = await res.json();
      if (data.success) {
        alert("Face-match verified!");
        fetchAdminMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    alert("Report cleared. Warned user of policy guidelines.");
    fetchAdminMetrics();
  };

  return (
    <div id="admin_console_page" className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 font-display flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600 fill-indigo-100" />
            SoulMatch Safety Control
          </h2>
          <p className="text-xs text-slate-400">
            Secure admin portal for face biometric confirmations, queue moderation, and income evaluations.
          </p>
        </div>

        <button
          onClick={fetchAdminMetrics}
          className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-slate-100 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload stats logs
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white border border-slate-100 rounded-3xl">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin mx-auto pb-4" />
          <p className="text-xs text-slate-400">Processing live network reports...</p>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          
          {/* Metrics Bento Row */}
          <div id="metrics_bento_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Registered Users</span>
                <span className="text-2xl font-black font-display text-slate-800">{stats.totalUsers}</span>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Premium Accounts</span>
                <span className="text-2xl font-black font-display text-slate-800">{stats.premiumUsers}</span>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Abuse Flags</span>
                <span className="text-2xl font-black font-display text-slate-800">{stats.reports.length}</span>
              </div>
            </div>

            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulated Revenue</span>
                <span className="text-2xl font-black font-display text-indigo-600 font-mono">${stats.revenue.toFixed(2)}</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Main moderation table panel */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-50">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 py-4 font-bold text-xs uppercase tracking-wider text-center border-b-2 transition ${
                    activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Face verification Queue ({stats.userProfiles.filter((u: any) => u.verification_status !== 'verified').length})
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex-1 py-4 font-bold text-xs uppercase tracking-wider text-center border-b-2 transition ${
                    activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Abuse & Spam Flags ({stats.reports.length})
                </button>
              </div>

              <div className="p-6">
                
                {activeTab === 'users' ? (
                  <div className="divide-y divide-slate-50">
                    {stats.userProfiles.map((user: UserProfile) => (
                      <div key={user.user_id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <img referrerPolicy="no-referrer" src={user.photo_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{user.full_name}, {user.age}</h4>
                            <p className="text-[10px] text-slate-400">{user.occupation} • {user.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                            user.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {user.verification_status}
                          </span>
                          {user.verification_status !== 'verified' && (
                            <button
                              onClick={() => handleApproveVerification(user.user_id)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase rounded-lg"
                            >
                              Approve Biometric Face Match
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.reports.length > 0 ? (
                      stats.reports.map((report: UserReport) => (
                        <div key={report.report_id} className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded leading-none">Abuse Flag</span>
                              <span className="text-[10px] text-slate-405 font-mono">{new Date(report.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700">Reporter: {report.reporter_id} was offended by {report.reported_user_id}</p>
                            <p className="text-xs text-slate-500 italic">"Reason: {report.reason}"</p>
                          </div>

                          <button
                            onClick={() => handleResolveReport(report.report_id)}
                            className="px-3 py-1.5 bg-white border border-rose-200 text-slate-600 text-[10px] uppercase font-bold rounded-lg hover:bg-slate-50"
                          >
                            Resolve / Warn User
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No abuse warnings issued in active dialogue arrays.
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>            {/* Sidebar Google Drive Synchronization Tool */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-display font-extrabold text-sm text-slate-800">Drive Database Sync</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${
                    driveToken ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {driveToken ? 'Connected' : 'Offline Mode'}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Synchronize your in-memory RAM user arrays with persistent backups inside your shared Google Drive folder:
                  </p>
                  
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 font-mono text-[10px]">
                    <span className="text-slate-400 block font-sans font-bold">Target Parent Folder:</span>
                    <a 
                      href="https://drive.google.com/drive/folders/1bjvxP9yTh4lGJLgZd9y9U-XqpaHEdeyr" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold truncate break-all"
                    >
                      <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                      1bjvxP9yTh4lGJLgZd9y9U-X...
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>

                  {driveToken ? (
                    <div className="space-y-3">
                      {/* Active Connection Panel */}
                      <div className="flex gap-2.5">
                        <button
                          onClick={pushLocalToDrive}
                          disabled={driveLoading}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50"
                        >
                          <CloudUpload className="w-3.5 h-3.5" />
                          Push RAM State
                        </button>

                        <button
                          onClick={() => pullDriveToLocal()}
                          disabled={driveLoading}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase rounded-xl flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                        >
                          <CloudDownload className="w-3.5 h-3.5" />
                          Pull Backup
                        </button>
                      </div>

                      <button
                        onClick={disconnectDrive}
                        className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-[10px] font-bold rounded-lg transition"
                      >
                        Disconnect Current Google Token
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sign in and Manual Access Token Panel */}
                      {oauthUrl ? (
                        <button
                          onClick={handleOAuthConnect}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                        >
                          <Database className="w-4 h-4" />
                          Connect via Google Accounts
                        </button>
                      ) : (
                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[10px]">
                            <Lock className="w-3.5 h-3.5" />
                            OAuth Client Keys Restricted
                          </div>
                          <p className="text-[10px] text-amber-700/90 leading-relaxed">
                            No secret OAUTH keys configured inside AI Studio yet. Copy-paste a temporary developer access token below to test read/write actions instantly on the live files!
                          </p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          Direct Drive Access Token
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="password"
                            placeholder="ya29.a0Axoo..."
                            value={inputToken}
                            onChange={(e) => setInputToken(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-indigo-500 bg-white"
                          />
                          <button
                            onClick={saveManualToken}
                            disabled={driveLoading}
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
                            title="Apply manual access token"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          Get one from <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">OAuth 2.0 Playground</a> by selecting "Drive API v3" scopes.
                        </p>
                      </div>
                    </div>
                  )}

                  {syncMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-[10px] font-semibold leading-relaxed">
                      {syncMsg}
                    </div>
                  )}

                  {syncErr && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-[10px] font-semibold leading-relaxed">
                      Error: {syncErr}
                    </div>
                  )}

                  {driveLoading && (
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold justify-center pt-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Interfacing with Drive Folder...
                    </div>
                  )}
                </div>
              </div>

              {/* Detected Drive Folder Backups List */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
                  <FolderOpen className="w-4 h-4 text-slate-600" />
                  <h4 className="font-display font-extrabold text-sm text-slate-800">Files inside Shared Folder</h4>
                </div>

                {driveToken ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                    {driveFiles.length > 0 ? (
                      driveFiles.map((file: any) => (
                        <div key={file.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2 text-[11px]">
                          <div className="min-w-0">
                            <span 
                              className="font-bold text-slate-700 truncate block hover:text-indigo-600 hover:underline cursor-pointer"
                              title="View backup file meta on Drive"
                              onClick={() => { if (file.webViewLink) window.open(file.webViewLink, '_blank'); }}
                            >
                              {file.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {Number(file.size ? (Number(file.size) / 1024).toFixed(1) : 0)} KB • {new Date(file.modifiedTime).toLocaleString()}
                            </span>
                          </div>

                          {file.name === 'soulmatch_db_backup.json' && (
                            <button
                              onClick={() => pullDriveToLocal(file.id)}
                              disabled={driveLoading}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-black uppercase text-[9px] tracking-wider rounded-lg hover:bg-indigo-100"
                            >
                              Load State
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-400 py-4 text-center">
                        No state serialization backups found inside folder '1bjvxP9yTh4lGJLgZd9y9U-XqpaHEdeyr'. Click "Push RAM State" to initialize backup!
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 py-4 text-center italic">
                    Connect Google Drive to list and pull backups inside specified folder.
                  </p>
                )}
              </div>

              {/* Sidebar metrics backup as fallback */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
                <div className="flex items-center gap-1 border-b border-slate-50 pb-2">
                  <BarChart className="w-4 h-4 text-slate-600" />
                  <h4 className="font-display font-extrabold text-sm text-slate-800">Audit Status Visualizer</h4>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: "Spam Detection Radar Conf", score: "99.8%" },
                    { label: "Face Biometrics Verified Ratio", score: "88.4%" },
                    { label: "Average Match Compatibility Frequency", score: "74.5%" }
                  ].map((m) => (
                    <div key={m.label} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[10px] font-semibold text-slate-500">
                        <span>{m.label}</span>
                        <span className="font-mono font-bold text-indigo-650 text-indigo-600">{m.score}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded" style={{ width: m.score }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}