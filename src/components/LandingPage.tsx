import React, { useState } from 'react';
import { 
  Heart, Sparkles, Compass, ShieldCheck, Mail, ArrowRight, 
  UserCheck, Lock, CheckCircle2, UserPlus, Info, Moon, User, 
  Flower, Star, Shield, ArrowUpRight, Check 
} from 'lucide-react';

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
  const [emailInput, setEmailInput] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setErrorMsg("Please enter an email address.");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your password.");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Login failed. Please check your credentials.");
      } else {
        setSuccessMsg(`Welcome back, ${data.currentUser.full_name}! Decrypting compatibility matches...`);
        setTimeout(() => {
          onLoginSuccess(loginEmail);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with local database.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setErrorMsg("Please enter your email to proceed.");
      return;
    }
    onStartRegistration(emailInput);
  };

  const handleQuickDemoLogin = async (presetEmail: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: presetEmail, password: 'password123' })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Entering sandbox as ${data.currentUser.full_name}...`);
        setTimeout(() => {
          onLoginSuccess(presetEmail);
        }, 1000);
      } else {
        setErrorMsg(data.error || "Preset login mismatch.");
      }
    } catch (err) {
      setErrorMsg("Server simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="soulmatch_landing_portal" className="relative w-full space-y-12 animate-fade-in text-slate-850">
      
      {/* BACKGROUND GRAPHIC LAYER: High transparent calm images representing genuine relationships */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[48px] pointer-events-none">
        
        {/* Soft, meaningful background coupling & relationship image (highly transparent, overlayed elegantly) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-[0.14] mix-blend-multiply blur-[0.5px] transition-all duration-1000"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1800")' }}
        />
        
        {/* Gentle supplementary natural landscape background image to ground the calm feeling */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[600px] bg-cover bg-center opacity-[0.08] mix-blend-color-burn"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1800")' }}
        />

        {/* Ambient colored gradient pools for dreamy warmth */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[130px]" />
        <div className="absolute bottom-1/4 right-[5%] w-[600px] h-[600px] rounded-full bg-rose-50/50 blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-50/40 blur-[120px]" />
      </div>

      {/* Main Hero & Card Component Grid with custom calming high-transparency layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white/45 backdrop-blur-2xl border border-white/50 p-6 sm:p-10 lg:p-14 rounded-[40px] shadow-sm relative overflow-hidden">
        
        {/* Fine-line blueprint overlay pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.25] -z-10 pointer-events-none" />

        {/* Left Side: Pitch and Branding */}
        <div className="lg:col-span-7 space-y-8 relative z-10 text-left">
          
          {/* Aesthetic Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 border border-emerald-100/90 text-emerald-800 rounded-full text-[11px] font-black tracking-wider uppercase">
            <Flower className="w-3.5 h-3.5 animate-spin-slow text-emerald-600" /> 
            Soul-Deep Resonance Dating
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 leading-[1.08]">
              Soft matches.<br />
              Deep values.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                Zero synthetic noise.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Welcome to a pristine space optimized for serious, mindful daters. SoulMatch sweeps away addictive swiping mechanics to prioritize verified identity parameters, genuine connection ratios, and comprehensive life synchronicity values.
            </p>
          </div>

          {/* Social Proof Star Ratings - CURVED GLASS BADGE WITH 4.8 STARS */}
          <div className="inline-flex items-center gap-4 p-4 rounded-3xl bg-white/80 border border-slate-100 shadow-sm backdrop-blur-sm max-w-lg">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80" alt="Conscious Member" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80" alt="Conscious Member" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80" alt="Conscious Member" referrerPolicy="no-referrer" />
            </div>
            
            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <div className="relative">
                    <Star className="w-4 h-4 text-slate-200" />
                    <div className="absolute inset-0 overflow-hidden w-[80%]">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900">4.8 / 5 Rating</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-none">
                Over 12,000 deep connections established this month
              </p>
            </div>
          </div>

          {/* Aesthetic mini-metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/75 border border-slate-100/70 shadow-2xs max-w-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-teal-50 text-teal-600 shrink-0">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Mindful Values Sync</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Match based on routine lifestyle factors and authentic long-term views.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/75 border border-slate-100/70 shadow-2xs max-w-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Authentic Safe Harbor</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Enforce verified profile details with secure sign-up paths to neutralize bots.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: High-transparency overlay Glassmorphism card */}
        <div className="lg:col-span-5 bg-white/75 backdrop-blur-3xl border border-white/60 p-6 sm:p-8 rounded-[32px] relative z-10 shadow-xl shadow-slate-100/40 space-y-6">
          
          <div className="flex bg-slate-150/80 p-1.5 bg-slate-100/90 rounded-2xl">
            <button
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                activeTab === 'register' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Log In
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] text-rose-750 text-rose-600 font-bold text-left flex items-start gap-2 animate-shake">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] text-emerald-800 font-bold text-left animate-pulse flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Email Onboarding</label>
                <p className="text-[10px] text-slate-450 font-bold">Start your real matchmaking journey here.</p>
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="landing_register_email"
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-600 transition text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest transition duration-150 shadow-md shadow-indigo-50/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                Initiate Setup <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Registered Email</label>
                <p className="text-[10px] text-slate-450 font-bold">Log into your secure matchroom session.</p>
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="landing_login_email"
                  type="email"
                  required
                  placeholder="alex@soulmatch.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-600 transition text-sm font-semibold"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Security Password</label>
                  <span className="text-[9px] text-slate-400 font-mono">Demo: <strong>password123</strong></span>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  id="landing_login_password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-600 transition text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition shadow-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {loading ? "Decrypting profile..." : "Verify & Sign In"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Curated Sandbox Entities: To test compatibility grids */}
      <div className="space-y-5 bg-white/60 backdrop-blur-md border border-slate-150 border-slate-100 rounded-[36px] p-6 sm:p-10 text-left relative overflow-hidden">
        
        {/* Transparent image blend to enrich the theme below */}
        <div 
          className="absolute right-0 top-0 w-80 h-full bg-cover bg-center opacity-[0.06] blur-[0.5px] pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600")' }}
        />

        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            <span className="p-1 px-1.5 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-black uppercase tracking-wider">Sandbox</span>
            Aesthetic Matchroom Profiles
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Select an onboarding pre-made profile to instantly evaluate core life values sync and matches without entering details:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {PRESET_DEMO_USERS.map((user) => (
            <div 
              key={user.email}
              onClick={() => handleQuickDemoLogin(user.email)}
              className="flex items-center gap-3.5 p-3.5 bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl shadow-xs hover:shadow-md transition duration-200 cursor-pointer group text-left relative"
            >
              <div className="relative">
                <img src={user.img} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 group-hover:border-emerald-500 transition" referrerPolicy="no-referrer" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-slate-800 truncate leading-none mb-1 group-hover:text-emerald-700 transition">{user.name}</h4>
                <p className="text-[10px] text-slate-400 mb-1 leading-none font-bold">{user.role}</p>
                <span className="text-[9px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded truncate inline-block">
                  {user.email}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Grid Value Propositions displaying peaceful values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        
        <div className="bg-white/50 backdrop-blur-md border border-slate-100 p-6 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Philosophical Synchronicities</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">
            Skip superficial loops. Build depth by matching routine values, communications flow parameters, and shared lifestyle criteria seamlessly.
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-md border border-slate-100 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Automated Safe Harbor</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">
            Our background AI contextual analyzer flags suspicious messaging patterns or malicious actors immediately, keeping your inbox safe.
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-md border border-slate-100 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-sm">Zero Swiping Gimmicks</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-bold">
            A premium interface designed to respect your pacing. Complete transparency and real local database memory for instantaneous actions.
          </p>
        </div>

      </div>

    </div>
  );
}
