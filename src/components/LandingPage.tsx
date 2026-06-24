import React, { useState } from 'react';
import { 
  Heart, Sparkles, Compass, ShieldCheck, Mail, ArrowRight, 
  Lock, CheckCircle2, Info, Flower, Star, ArrowUpRight, Eye, EyeOff
} from 'lucide-react';
import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup
} from '../firebase';

interface LandingPageProps {
  onLoginSuccess: (userEmail: string) => Promise<void>;
  onStartRegistration: (email: string) => void;
}

const PRESET_DEMO_USERS = [
  { name: 'Alex Mercer', email: 'alex@soulmatch.com', role: 'Product Designer', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
  { name: 'Alice Chang', email: 'alice@soulmatch.com', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { name: 'Liam Peterson', email: 'liam@soulmatch.com', role: 'ML Engineer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { name: 'Elena Rostova', email: 'elena@soulmatch.com', role: 'Vinyasa Instructor', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' }
];

export default function LandingPage({ onLoginSuccess, onStartRegistration }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  
  // Register fields
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ── REGISTER ──────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regEmail) { setErrorMsg('Please enter your email.'); return; }
    if (regPassword.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    if (regPassword !== regConfirm) { setErrorMsg('Passwords do not match.'); return; }

    setLoading(true);
    try {
      // 1. Create account in Firebase
      const result = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      
      // 2. Send verification email (Firebase sends it for free)
      await sendEmailVerification(result.user);
      
      // 3. Sign them out — they must verify email before logging in
      await auth.signOut();
      
      setVerificationSent(true);
      setSuccessMsg(`Verification email sent to ${regEmail}! Check your inbox (and spam folder) and click the link to verify your account. Then come back and log in.`);
    } catch (err: any) {
      // Firebase gives friendly error codes
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please log in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else {
        setErrorMsg(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail) { setErrorMsg('Please enter your email.'); return; }
    if (!loginPassword) { setErrorMsg('Please enter your password.'); return; }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        await auth.signOut();
        setErrorMsg('Your email is not verified yet. Please check your inbox and click the verification link first.');
        return;
      }

      setSuccessMsg(`Welcome back! Loading your matches...`);
      setTimeout(() => onLoginSuccess(loginEmail), 1000);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Incorrect email or password. Please try again.');
      } else {
        setErrorMsg(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── GOOGLE SIGN IN ────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      setSuccessMsg(`Welcome, ${result.user.displayName || email}! Loading your profile...`);
      setTimeout(() => onLoginSuccess(email), 1000);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign-in was cancelled.');
      } else {
        setErrorMsg(err.message || 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── DEMO LOGIN (existing preset accounts) ─────────────────
  const handleQuickDemoLogin = async (presetEmail: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: presetEmail, password: 'password123' })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Entering as ${data.currentUser.full_name}...`);
        setTimeout(() => onLoginSuccess(presetEmail), 1000);
      } else {
        setErrorMsg(data.error || 'Demo login failed.');
      }
    } catch {
      // If no backend (Vercel static), just pass the email through
      setSuccessMsg(`Entering demo mode...`);
      setTimeout(() => onLoginSuccess(presetEmail), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="soulmatch_landing_portal" className="relative w-full space-y-12 animate-fade-in text-slate-850">
      
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[48px] pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-[0.14] mix-blend-multiply blur-[0.5px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1800")' }} />
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[130px]" />
        <div className="absolute bottom-1/4 right-[5%] w-[600px] h-[600px] rounded-full bg-rose-50/50 blur-[150px]" />
      </div>

      {/* Hero + Auth Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white/45 backdrop-blur-2xl border border-white/50 p-6 sm:p-10 lg:p-14 rounded-[40px] shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.25] -z-10 pointer-events-none" />

        {/* Left: Pitch */}
        <div className="lg:col-span-7 space-y-8 relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 border border-emerald-100/90 text-emerald-800 rounded-full text-[11px] font-black tracking-wider uppercase">
            <Flower className="w-3.5 h-3.5 text-emerald-600" />
            Soul-Deep Resonance Dating
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.08]">
              Soft matches.<br />Deep values.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                Zero synthetic noise.
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              SoulMatch sweeps away addictive swiping mechanics to prioritize verified identity, genuine connection ratios, and comprehensive life synchronicity values.
            </p>
          </div>
          <div className="inline-flex items-center gap-4 p-4 rounded-3xl bg-white/80 border border-slate-100 shadow-sm backdrop-blur-sm">
            <div className="flex -space-x-2">
              {['1544005313-94ddf0286df2','1506794778202-cad84cf45f1d','1494790108377-be9c29b29330'].map(id => (
                <img key={id} className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=80`} alt="" referrerPolicy="no-referrer" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                <Star className="w-4 h-4 text-slate-200" />
                <span className="text-xs font-black text-slate-900">4.8 / 5</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Over 12,000 deep connections this month</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/75 border border-slate-100/70">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-teal-50 text-teal-600 shrink-0">
                <Compass className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Mindful Values Sync</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Match on lifestyle factors and authentic long-term views.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/75 border border-slate-100/70">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Authentic Safe Harbor</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Verified profile details to neutralize bots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="lg:col-span-5 bg-white/75 backdrop-blur-3xl border border-white/60 p-6 sm:p-8 rounded-[32px] relative z-10 shadow-xl space-y-5">
          
          {/* Tab switcher */}
          <div className="flex bg-slate-100/90 p-1.5 rounded-2xl">
            <button onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider cursor-pointer ${activeTab === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              Sign Up
            </button>
            <button onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider cursor-pointer ${activeTab === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              Log In
            </button>
          </div>

          {/* Error / Success banners */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-600 font-bold flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google button (works for both tabs) */}
          <button onClick={handleGoogleSignIn} disabled={loading}
            className="w-full py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-3 transition shadow-sm hover:shadow disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">or with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* ── REGISTER FORM ── */}
          {activeTab === 'register' && !verificationSent && (
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input type="email" required placeholder="your@email.com" value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition text-sm font-semibold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input type={showRegPass ? 'text' : 'password'} required placeholder="Create a password" value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition text-sm font-semibold" />
                  <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input type={showRegPass ? 'text' : 'password'} required placeholder="Repeat your password" value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition text-sm font-semibold" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                {loading ? 'Creating account...' : <><span>Create Account & Send Verification</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* ── VERIFICATION SENT STATE ── */}
          {activeTab === 'register' && verificationSent && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-800">Check your email!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We sent a verification link to <strong className="text-slate-700">{regEmail}</strong>. Click it to verify your account, then come back here to log in.
              </p>
              <p className="text-[10px] text-slate-400">Don't see it? Check your spam/junk folder.</p>
              <button onClick={() => { setVerificationSent(false); setActiveTab('login'); setSuccessMsg(''); setErrorMsg(''); }}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs transition hover:bg-slate-800">
                Go to Login →
              </button>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input type="email" required placeholder="your@email.com" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition text-sm font-semibold" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                  <span className="text-[9px] text-slate-400 font-mono">Demo accounts: <strong>password123</strong></span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input type={showLoginPass ? 'text' : 'password'} required placeholder="••••••••" value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition text-sm font-semibold" />
                  <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition shadow-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-2">
                {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Demo sandbox users */}
      <div className="space-y-5 bg-white/60 backdrop-blur-md border border-slate-100 rounded-[36px] p-6 sm:p-10 text-left relative overflow-hidden">
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-1 px-1.5 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-black uppercase">Sandbox</span>
            Try a Demo Profile
          </h3>
          <p className="text-xs text-slate-500 font-bold">Click any profile to instantly explore the app without signing up:</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_DEMO_USERS.map((user) => (
            <div key={user.email} onClick={() => handleQuickDemoLogin(user.email)}
              className="flex items-center gap-3.5 p-3.5 bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl shadow-xs hover:shadow-md transition cursor-pointer group text-left relative">
              <div className="relative">
                <img src={user.img} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 group-hover:border-emerald-500 transition" referrerPolicy="no-referrer" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-800 truncate leading-none mb-1 group-hover:text-emerald-700">{user.name}</h4>
                <p className="text-[10px] text-slate-400 mb-1 font-bold">{user.role}</p>
                <span className="text-[9px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded inline-block">{user.email}</span>
              </div>
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {[
          { icon: <Compass className="w-5 h-5" />, color: 'teal', title: 'Philosophical Synchronicities', desc: 'Build depth by matching routine values, communication flow, and shared lifestyle criteria.' },
          { icon: <ShieldCheck className="w-5 h-5" />, color: 'indigo', title: 'Automated Safe Harbor', desc: 'Our AI flags suspicious messaging patterns or malicious actors immediately.' },
          { icon: <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />, color: 'rose', title: 'Zero Swiping Gimmicks', desc: 'A premium interface designed to respect your pacing with real local database memory.' }
        ].map((p, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-md border border-slate-100 p-6 rounded-2xl space-y-3">
            <div className={`w-10 h-10 rounded-xl bg-${p.color}-50 text-${p.color}-700 flex items-center justify-center`}>{p.icon}</div>
            <h4 className="font-extrabold text-slate-900 text-sm">{p.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
