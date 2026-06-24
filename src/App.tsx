import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, MessageSquare, User, Compass, 
  Crown, ShieldCheck, Zap, LogOut, Check, Menu, X, Undo2 
} from 'lucide-react';
import { UserProfile, Subscription } from './types';
import HomeView from './components/HomeView';
import RegistrationFlow from './components/RegistrationFlow';
import DiscoverView from './components/DiscoverView';
import MatchesView from './components/MatchesView';
import ChatView from './components/ChatView';
import ProfileView from './components/ProfileView';
import SubscriptionView from './components/SubscriptionView';
import AdminView from './components/AdminView';
import LandingPage from './components/LandingPage';

export default function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [initialRegisterEmail, setInitialRegisterEmail] = useState<string>('');
  
  // Selection bridging for redirecting matches list grid straight into active chats!
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | undefined>(undefined);

  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Celebration state when swiping mutual matches is successful
  const [celebrationMatch, setCelebrationMatch] = useState<UserProfile | null>(null);

  const fetchSessionData = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
        setSubscription(data.subscription);
        
        // Count active matched
        const count = data.matches.filter((m: any) => m.status === 'matched').length;
        setMatchesCount(count);
      } else {
        setCurrentUser(null);
        setSubscription(null);
      }
    } catch (err) {
      console.error("Session fetch failed", err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, [activeView]);

  const handleRegisterComplete = async (fields: Partial<UserProfile>) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          email: currentUser?.email || initialRegisterEmail || fields.email || `guest_${Date.now()}@example.com`
        })
      });
      const data = await res.json();
      if (data.success) {
        setInitialRegisterEmail('');
        await fetchSessionData();
        setActiveView('home');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(null);
        setSubscription(null);
        setActiveView('home');
        setMobileMenuOpen(false);
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleResetSession = async () => {
    if (!confirm("Reset database parameters inside Express session for evaluation?")) return;
    try {
      const res = await fetch("/api/session/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(null);
        setSubscription(null);
        await fetchSessionData();
        setActiveView('home');
        alert("Session state has been completely reset back to defaults!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If session is still loading
  if (!isLoaded) {
    return (
      <div id="app_startup_loading" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 translate-y-[-10px] w-12 h-12 bg-brand-500/10 rounded-full animate-ping" />
          <Heart className="w-12 h-12 text-brand-500 fill-brand-500 animate-pulse relative z-10" />
        </div>
        <h3 className="font-display font-bold text-slate-800">Booting SoulMatch Radar...</h3>
        <p className="text-xs text-slate-400">Restructuring multi-factor sockets and face contour models</p>
      </div>
    );
  }

  // Calculate registration status
  const isRegistered = currentUser ? currentUser.profile_completion >= 20 : false;

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between" id="soulmatch_root_container">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo brand and subtitle */}
          <div 
            onClick={() => {
              if (isRegistered) {
                setActiveView('home');
              }
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 bg-gradient-brand text-white rounded-2xl shadow-md">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                SoulMatch
                <span className="text-[9px] font-black tracking-widest text-[#fa5252] bg-brand-50 px-2 py-0.5 rounded-full uppercase">AI ACTIVE</span>
              </h1>
              <p className="text-[10px] text-slate-405 font-medium">Platform compatibility radar</p>
            </div>
          </div>

          {/* Nav Items - Desk view */}
          {isRegistered && (
            <nav className="hidden md:flex items-center gap-1.5">
              {[
                { view: 'home', label: 'Dashboard', icon: Sparkles },
                { view: 'discover', label: 'Discover Matches', icon: Compass },
                { view: 'matches', label: `Matches (${matchesCount})`, icon: Heart },
                { view: 'chat', label: 'Messages', icon: MessageSquare },
                { view: 'profile', label: 'Edit Profile', icon: User },
                { view: 'subscription', label: 'Premium', icon: Crown },
                { view: 'admin', label: 'Safety Hub', icon: ShieldCheck }
              ].map((item) => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    id={`nav_${item.view}`}
                    onClick={() => {
                      if (item.view === 'chat') {
                        // reset bridges choice
                        setSelectedChatUserId(undefined);
                      }
                      setActiveView(item.view);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Quick profile indicators on top-right */}
          <div className="flex items-center gap-3">
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                {isRegistered ? (
                  <>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.full_name}</p>
                      <span className="text-[9px] font-black uppercase text-brand-600 mt-0.5 inline-block">
                        {subscription?.plan} Subscriber
                      </span>
                    </div>
                    
                    <img 
                      referrerPolicy="no-referrer" 
                      src={currentUser.photo_url} 
                      alt={currentUser.full_name} 
                      onClick={() => setActiveView('profile')}
                      className="w-10 h-10 rounded-full object-cover border-2 border-brand-500 shadow-sm cursor-pointer hover:opacity-90"
                    />
                  </>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded bg-amber-100/40">Onboarding Mode</span>
                )}

                <button 
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 text-slate-500 hover:text-slate-850"
                  title="Log Out of Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setActiveView('home'); }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold shadow"
              >
                Welcome Guest
              </button>
            )}

            {/* Mobile menu trigger */}
            {isRegistered && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

          </div>

        </div>

        {/* MOBILE DROPDOWN LINKS */}
        {mobileMenuOpen && isRegistered && (
          <div className="md:hidden border-t border-slate-50 bg-white p-4 space-y-2 text-left animate-fade-in shadow-lg">
            {[
              { view: 'home', label: 'Dashboard', icon: Sparkles },
              { view: 'discover', label: 'Discover Matches', icon: Compass },
              { view: 'matches', label: `Mutual Matches (${matchesCount})`, icon: Heart },
              { view: 'chat', label: 'Messages', icon: MessageSquare },
              { view: 'profile', label: 'Edit Profile', icon: User },
              { view: 'subscription', label: 'Premium upgrade', icon: Crown },
              { view: 'admin', label: 'Moderator Safety Hub', icon: ShieldCheck }
            ].map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    if (item.view === 'chat') {
                      setSelectedChatUserId(undefined);
                    }
                    setActiveView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {!currentUser ? (
          <LandingPage 
            onLoginSuccess={async (email) => {
              await fetchSessionData();
              setActiveView('home');
            }}
            onStartRegistration={(email) => {
              setInitialRegisterEmail(email);
              setActiveView('registration');
            }}
          />
        ) : !isRegistered ? (
          <div className="space-y-4">
            <div className="text-center space-y-2 max-w-sm mx-auto pb-4">
              <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-wider">SoulMatch Playground</span>
              <h2 className="text-2xl font-extrabold font-display text-slate-800">Quick Profile Registration Required</h2>
              <p className="text-xs text-slate-400 mb-2">Initialize your values and photos to active the AI matching advisor matrix!</p>
            </div>
            <RegistrationFlow onRegisterComplete={handleRegisterComplete} initialEmail={initialRegisterEmail} currentUser={currentUser} />
          </div>
        ) : (
          <>
            {activeView === 'home' && subscription &&  (
              <HomeView 
                currentUser={currentUser} 
                subscription={subscription} 
                onNavigate={setActiveView}
                matchesCount={matchesCount}
              />
            )}

            {activeView === 'registration' && (
              <RegistrationFlow onRegisterComplete={handleRegisterComplete} currentUser={currentUser} />
            )}

            {activeView === 'discover' && (
              <DiscoverView 
                onNavigate={setActiveView} 
                onMutualMatch={(matchedPartner) => {
                  setCelebrationMatch(matchedPartner);
                  fetchSessionData();
                }}
              />
            )}

            {activeView === 'matches' && (
              <MatchesView 
                onNavigate={setActiveView} 
                onSelectChatUser={(userId) => {
                  setSelectedChatUserId(userId);
                  setActiveView('chat');
                }}
              />
            )}

            {activeView === 'chat' && (
              <ChatView 
                selectedUserId={selectedChatUserId} 
                onClearSelectedUser={() => setSelectedChatUserId(undefined)}
              />
            )}

            {activeView === 'profile' && (
              <ProfileView onProfileUpdated={fetchSessionData} />
            )}

            {activeView === 'subscription' && (
              <SubscriptionView onPlanUpgraded={fetchSessionData} />
            )}

            {activeView === 'admin' && (
              <AdminView />
            )}
          </>
        )}

      </main>

      {/* MUTUAL MATCH CELEBRATION MODAL POPUP */}
      {celebrationMatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 text-center text-white font-sans animate-fade-in">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Visual background rings */}
            <div className="absolute top-0 right-0 translate-x-20 -translate-y-20 w-48 h-48 rounded-full border-2 border-brand-500/10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -translate-x-20 translate-y-20 w-48 h-48 rounded-full border-2 border-brand-500/10 pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Heart className="w-8 h-8 fill-white" />
              </div>

              <span className="text-[10px] uppercase font-black tracking-widest text-[#fa5252] animate-pulse">Soul Match Matrix Active</span>
              <h3 className="text-3xl font-black font-display tracking-tight leading-none text-brand-100">It's a Mutual Match!</h3>
              <p className="text-xs text-slate-350 leading-relaxed max-w-sm mx-auto">
                You and <strong className="text-white">{celebrationMatch.full_name}</strong> both expressed compatibility likes for each other.
              </p>
            </div>

            {/* Side-by-side profile pictures */}
            <div className="flex items-center justify-center -space-x-4 relative z-10">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl scale-102">
                <img referrerPolicy="no-referrer" src={currentUser.photo_url} alt="My portrait" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-black text-lg flex items-center justify-center z-20 border-3 border-slate-900">
                ❤
              </div>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl scale-102">
                <img referrerPolicy="no-referrer" src={celebrationMatch.photo_url} alt="Partner portrait" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 relative z-10">
              <button
                onClick={() => {
                  setSelectedChatUserId(celebrationMatch.user_id);
                  setCelebrationMatch(null);
                  setActiveView('chat');
                }}
                className="py-3.5 rounded-xl bg-gradient-brand text-white font-extrabold text-xs uppercase tracking-wide transition shadow hover:scale-[1.01]"
              >
                Send a Smart AI Opening Message
              </button>

              <button
                onClick={() => setCelebrationMatch(null)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-755 text-xs text-slate-300 transition"
              >
                Keep Swiping on Feed
              </button>
            </div>

            <span className="block text-[9px] text-slate-500 uppercase tracking-widest">Powered securely by Google Gemini</span>
          </div>
        </div>
      )}

      {/* Footer Area with Reset state triggers */}
      <footer className="py-6 border-t border-slate-50 bg-white text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 SoulMatch Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-300">|</span>
            <button
              onClick={handleResetSession}
              className="hover:text-brand-500 font-bold transition flex items-center gap-1"
              title="Reset Sandbox database back to defaults"
            >
              <Undo2 className="w-3.5 h-3.5" /> Reset Playground Data State
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
