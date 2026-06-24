import React, { useState, useEffect } from 'react';
import { Heart, X, Search, Sparkles, ShieldCheck, Check, Info, Compass, HelpCircle, UserX, AlertTriangle, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface DiscoverViewProps {
  onNavigate: (view: string) => void;
  onMutualMatch: (user: UserProfile) => void;
}

export default function DiscoverView({ onNavigate, onMutualMatch }: DiscoverViewProps) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [genderPreference, setGenderPreference] = useState<string>('All');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(38);
  const [verOnly, setVerOnly] = useState<boolean>(false);
  
  // AI Advisor State
  const [isRequestingAdvisor, setIsRequestingAdvisor] = useState(false);
  const [advisorReport, setAdvisorReport] = useState<any | null>(null);

  // Report State
  const [isReportingUser, setIsReportingUser] = useState(false);
  const [reportReason, setReportReason] = useState('Off-topic or inappropriate language');
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    setAdvisorReport(null);
    try {
      const url = `/api/discover?genderPreference=${genderPreference}&minAge=${minAge}&maxAge=${maxAge}&verOnly=${verOnly}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        // filter out already matched or swiped ones
        const active = data.recommended.filter((u: any) => u.current_status !== 'matched' && u.current_status !== 'pass');
        setCandidates(active);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Error retrieving recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [genderPreference, minAge, maxAge, verOnly]);

  const activeCandidate = candidates[currentIndex];

  const handleSwipeAction = async (action: 'like' | 'pass') => {
    if (!activeCandidate) return;
    
    setSwipeDirection(action === 'like' ? 'right' : 'left');
    setAdvisorReport(null);

    try {
      const res = await fetch('/api/match/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: activeCandidate.user_id, action })
      });
      const data = await res.json();
      
      if (data.isMatchSuccess && action === 'like') {
        // Trigger matching celebration modal overlay!
        onMutualMatch(data.matchedUser);
      }
    } catch (err) {
      console.error(err);
    }

    // wait for swipe animation to complete
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 450);
  };

  const handleRequestAdvisor = async () => {
    if (!activeCandidate) return;
    setIsRequestingAdvisor(true);
    setAdvisorReport(null);
    try {
      const res = await fetch('/api/match/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchUserId: activeCandidate.user_id })
      });
      const data = await res.json();
      if (data.success) {
        setAdvisorReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequestingAdvisor(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!activeCandidate) return;
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportedUserId: activeCandidate.user_id, reason: reportReason })
      });
      const data = await res.json();
      if (data.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReportingUser(false);
          setReportSuccess(false);
          setCurrentIndex(prev => prev + 1); // skip reported user
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="discover_layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* LEFT SIDE: ADVANCED FILTER PANEL */}
      <aside id="search_filters_sidebar" className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Search className="w-5 h-5 text-brand-500" />
          <h3 className="font-display font-bold text-slate-800">Advanced Match Filters</h3>
        </div>

        {/* Gender Preference Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Show Genders</label>
          <div className="grid grid-cols-3 gap-2">
            {['All', 'Male', 'Female'].map((pref) => (
              <button
                key={pref}
                onClick={() => setGenderPreference(pref)}
                className={`py-2 text-xs font-bold rounded-xl transition ${
                  genderPreference === pref 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Age Bounds Range Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Age range</span>
            <span className="text-brand-500 normal-case font-extrabold">{minAge} - {maxAge} years</span>
          </div>
          <div className="flex gap-4 items-center">
            <input
              id="min_age_picker"
              type="range"
              min="18"
              max="45"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <input
              id="max_age_picker"
              type="range"
              min="22"
              max="60"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>

        {/* Verified User Toggles */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-700">Verified Bios Only</h4>
            <p className="text-[10px] text-slate-400">Restricts to facial biometric validated users</p>
          </div>
          <input
            id="ver_only_toggle"
            type="checkbox"
            checked={verOnly}
            onChange={(e) => setVerOnly(e.target.checked)}
            className="w-4.5 h-4.5 accent-emerald-500 cursor-pointer rounded-md"
          />
        </div>

        {/* Reset / Search stats button */}
        <button
          onClick={fetchCandidates}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-Scan compatibility radar
        </button>
      </aside>

      {/* RIGHT SIDE: INTERACTIVE CARDS & AI ADVISOR */}
      <main id="tinder_swiping_deck" className="lg:col-span-8 space-y-6">
        
        {loading ? (
          <div className="p-20 text-center bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Recalculating proximity matrices...</p>
          </div>
        ) : activeCandidate ? (
          <div className="space-y-6">
            
            {/* The Main Dating Profile Card */}
            <div 
              className={`relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-custom transition-all duration-300 ${
                swipeDirection === 'left' ? 'scale-95 opacity-60 animate-swipe-left' : ''
              } ${
                swipeDirection === 'right' ? 'scale-95 opacity-60 animate-swipe-right' : ''
              }`}
            >
              
              {/* Photo Area with Floating labels */}
              <div id="card_photo_frame" className="relative h-96 sm:h-[420px] bg-slate-150">
                <img 
                  referrerPolicy="no-referrer" 
                  src={activeCandidate.photo_url} 
                  alt={activeCandidate.full_name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/25" />

                {/* Verification & Proximity badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {activeCandidate.verification_status === 'verified' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" /> Soul Verified
                    </span>
                  )}
                  <span className="inline-flex items-center bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-3 py-1.5 rounded-full">
                    {activeCandidate.location}
                  </span>
                </div>

                {/* Score badge */}
                <div className="absolute top-4 right-4 text-right">
                  <div className="bg-gradient-brand text-white font-extrabold text-sm px-4 py-2 rounded-2xl shadow-lg inline-flex flex-col items-center">
                    <span className="text-[22px] font-display font-black leading-none">{activeCandidate.compatibility_score}%</span>
                    <span className="text-[9px] uppercase tracking-widest mt-0.5 opacity-90">{activeCandidate.compatibility_category}</span>
                  </div>
                </div>

                {/* Name and Quick Meta in white text on image base */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
                  <h2 className="text-3xl font-extrabold font-display leading-none flex items-center gap-2">
                    {activeCandidate.full_name}, <span className="opacity-95">{activeCandidate.age}</span>
                  </h2>
                  <p className="text-sm text-slate-200 font-medium">
                    {activeCandidate.occupation} • {activeCandidate.education}
                  </p>
                </div>

              </div>

              {/* Bio & Interests Details Area */}
              <div id="card_profile_details" className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Personal Bio</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{activeCandidate.bio}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Interests</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCandidate.interests.map((it: string) => (
                      <span key={it} className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100 text-xs font-semibold">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Swipe Actions Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleSwipeAction('pass')}
                    className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition shadow-md hover:scale-105 active:scale-95"
                    title="Skip candidate"
                  >
                    <X className="w-6 h-6 stroke-[3]" />
                  </button>

                  <button
                    onClick={handleRequestAdvisor}
                    className="px-6 py-3 bg-gradient-brand text-white hover:opacity-95 font-bold text-xs rounded-2xl flex items-center gap-2 transition shadow-md hover:translate-y-[-1px]"
                  >
                    <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                    Ask Soul AI Advisor
                  </button>

                  <button
                    onClick={() => handleSwipeAction('like')}
                    className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 hover:bg-emerald-100 flex items-center justify-center transition shadow-md hover:scale-105 active:scale-95"
                    title="Send a Like"
                  >
                    <Heart className="w-6 h-6 fill-emerald-500 stroke-[3]" />
                  </button>
                </div>

                {/* Additional moderation reporting triggers */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => setIsReportingUser(true)}
                    className="text-[10px] uppercase tracking-wider text-slate-400 hover:text-rose-500 font-bold transition flex items-center gap-1"
                  >
                    <UserX className="w-3.5 h-3.5" /> Report or Block User
                  </button>
                  <p className="text-[10px] text-slate-400 italic">ID: {activeCandidate.user_id}</p>
                </div>

              </div>

            </div>

            {/* AI Advisor Compatibility Explanation Box */}
            {isRequestingAdvisor && (
              <div className="p-6 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 border border-emerald-100 rounded-3xl space-y-4 text-center">
                <div className="w-8 h-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  Soul Advisor is analyzing profiles, common subculture values, and interest frequencies...
                </p>
              </div>
            )}

            {advisorReport && (
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 space-y-5 shadow-lg animate-fade-in text-left">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                  <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                  <h4 className="font-display font-bold text-sm uppercase tracking-widest text-brand-100">AI Compatibility Analytics Report</h4>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Score Evaluation</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{advisorReport.scoreExplanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">✓ Alignment Strengths</span>
                    <ul className="space-y-1">
                      {advisorReport.greenFlags?.map((flag: string, i: number) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
                          <span className="text-emerald-400 font-bold">&#9670;</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-100">🗣️ Suggested Icebreakers</span>
                    <ul className="space-y-1">
                      {advisorReport.conversationSparkers?.map((spark: string, i: number) => (
                        <li key={i} className="text-[11px] text-slate-300 italic flex items-start gap-1">
                          <span className="text-brand-500 font-bold">&quot;</span> {spark}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Powering safe dating via Gemini Flash</span>
                  <span className="font-mono text-emerald-400">Alignment: {activeCandidate.compatibility_score}%</span>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="p-16 text-center bg-white border border-slate-100 rounded-3xl space-y-6 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 rounded-full pulse-circle" />
              <Compass className="w-10 h-10 text-brand-500 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-slate-800 font-display">No more profiles in this search radius</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tweak your search filters on the left panel (e.g. increase age boundaries or untoggle Verified Only status) to allow our radar to explore more potential high-match souls!
              </p>
            </div>

            <button
              onClick={() => {
                setGenderPreference('All');
                setMinAge(18);
                setMaxAge(45);
                setVerOnly(false);
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

        {/* REPORT USER DIALOG MODAL */}
        {isReportingUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-xl space-y-4 animate-fade-in text-left">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle className="w-5 h-5 fill-rose-100" />
                <h4 className="font-display font-extrabold">Report Inappropriate Account</h4>
              </div>
              
              <p className="text-xs text-slate-500">
                We maintain zero-tolerance for bad behavior, scamming, harassment, or copycat profiles. Tell us the reason for your manual flag.
              </p>

              {reportSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 font-semibold rounded-xl text-xs text-center">
                  ✓ Report successfully cataloged. Advancing...
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Reason for Alert</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Off-topic or inappropriate language">Off-topic or inappropriate language</option>
                    <option value="Asking for money / scamming traits">Asking for money / scamming traits</option>
                    <option value="Harassment or hostile communication">Harassment or hostile communication</option>
                    <option value="Suspected fake profile / stolen photos">Suspected fake profile / stolen photos</option>
                  </select>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setIsReportingUser(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReport}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      File Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
