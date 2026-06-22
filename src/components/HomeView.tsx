import React from 'react';
import { Heart, ShieldCheck, Sparkles, UserPlus, Users, MessageSquare, Zap, Eye, Compass } from 'lucide-react';
import { UserProfile, Subscription } from '../types';

interface HomeViewProps {
  currentUser: UserProfile;
  subscription: Subscription;
  onNavigate: (view: string) => void;
  matchesCount: number;
}

export default function HomeView({ currentUser, subscription, onNavigate, matchesCount }: HomeViewProps) {
  // If the user hasn't registered (e.g. simulated as guest, or wants to explore):
  const isGuest = currentUser.user_id === 'current_user' && currentUser.profile_completion < 10;

  return (
    <div id="home_view_container" className="space-y-10 animate-fade-in">
      {/* Hero Welcome banner */}
      <section id="hero_section" className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-custom">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15">
          <Heart className="w-96 h-96 text-brand-500 fill-brand-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3 mx-0.5 text-yellow-300 fill-yellow-300" />
            AI-Engine Active
          </span>
          
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
            Find the soul who <span className="text-brand-500">completes</span> your story.
          </h1>
          
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Welcome to <strong className="text-white">SoulMatch</strong>. We combine conversational intelligence, personality analysis, and rigorous lifestyle assessments to help you discover authentic partnership.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="discover_nav_btn"
              onClick={() => onNavigate('discover')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-brand hover:opacity-90 font-semibold tracking-wide text-white transition-all shadow-md hover:translate-y-[-1px]"
            >
              Start Swiping Now
            </button>
            <button
              id="questionnaire_nav_btn"
              onClick={() => onNavigate('profile')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center gap-2 transition"
            >
              Analyze Your Personality
            </button>
          </div>
        </div>
      </section>

      {/* Key Metrics Quick Dashboard Cards */}
      <section id="stats_cards_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onNavigate('discover')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand-100 transition shadow-sm cursor-pointer hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Discover Feed</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-brand-500">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-800">Browse</h3>
          <p className="text-xs text-slate-400 mt-1">Unlock AI smart predictions</p>
        </div>

        <div 
          onClick={() => onNavigate('matches')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand-100 transition shadow-sm cursor-pointer hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Mutual Matches</span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
              <Heart className="w-5 h-5 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-800">{matchesCount} Active</h3>
          <p className="text-xs text-slate-400 mt-1">People who liked you back</p>
        </div>

        <div 
          onClick={() => onNavigate('subscription')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand-100 transition shadow-sm cursor-pointer hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Account Tier</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-500">
              <Zap className="w-5 h-5 fill-indigo-500 text-indigo-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-display text-indigo-600 uppercase">{subscription.plan}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {subscription.plan === 'premium' ? "Unlimited match indicators" : "Basic subscription active"}
          </p>
        </div>

        <div 
          onClick={() => onNavigate('profile')}
          className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-brand-100 transition shadow-sm cursor-pointer hover:translate-y-[-2px]"
        >
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Profile Quality</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-800">{currentUser.profile_completion}%</h3>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">
            {currentUser.verification_status === 'verified' ? "✓ Identity Verified" : "Verification pending"}
          </p>
        </div>
      </section>

      {/* Feature Showcases - Why SoulMatch */}
      <section id="why_soulmatch_section" className="space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-800">
            Engineered for Real Relationships
          </h2>
          <p className="text-sm text-slate-500">
            Ditch the endless surface swipes. Experience dating backed by science and advanced evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
              <Sparkles className="w-6 h-6 fill-rose-50 text-brand-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display">AI Compatibility Scoring</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our backend matches you based on core life values, communication dynamics, career trajectories, and lifestyle habits.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display">Biometric Photo Verification</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every profile undergoes strict biometric selfie verification. No catfishers, no bot accounts—just verified people.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-display">Safety Monitor Integration</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              A gentle AI safety shield monitors chats in real time to prevent harassment, scammers, and unsafe off-platform requests.
            </p>
          </div>
        </div>
      </section>

      {/* Meet your premium advisor section */}
      <section id="dashboard_cta" className="p-8 bg-gradient-to-r from-brand-50 to-orange-50 border border-brand-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500 fill-brand-100 animate-pulse" />
            Need help writing an eye-catching bio?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl">
            Let our premium AI Assistant construct the perfect, deeply authentic bio for you. Update your interests in your profile and click "Generate with Gemini" to get started!
          </p>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="px-5 py-3 rounded-xl bg-white border border-brand-200 hover:border-brand-300 text-brand-600 font-semibold text-sm transition"
        >
          Try AI Profile Writer
        </button>
      </section>
    </div>
  );
}
