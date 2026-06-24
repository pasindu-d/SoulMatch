import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, Heart, ShieldCheck, Crown } from 'lucide-react';
import { Subscription } from '../types';

interface SubscriptionProps {
  onPlanUpgraded: () => void;
}

export default function SubscriptionView({ onPlanUpgraded }: SubscriptionProps) {
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.subscription) {
        setCurrentPlan(data.subscription);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleUpgrade = async (planName: 'premium') => {
    setLoading(true);
    setUpgradeSuccess(false);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName })
      });
      const data = await res.json();
      if (data.success) {
        setUpgradeSuccess(true);
        setCurrentPlan(data.subscription);
        onPlanUpgraded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="subscription_view_container" className="space-y-8 animate-fade-in text-center max-w-4xl mx-auto">
      
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 fill-brand-100" />
          SoulMatch Premium
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 font-display">
          Elevate Your Search for the Perfect Soul
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Free plans are great to start, but Premium grants you advanced AI matchmaking alignment tools and face-verified priorities!
        </p>
      </div>

      {upgradeSuccess && (
        <div className="p-5 max-w-md mx-auto bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold rounded-2xl flex flex-col items-center gap-2 animate-bounce">
          <Sparkles className="w-8 h-8 text-emerald-600" />
          <span>✓ CONGRATULATIONS! YOUR GOLD CROWN CODES HAVE BEEN ACTIVATED!</span>
          <span className="font-normal text-[10px] text-slate-500 text-center">
            You now have unlimited swiping permissions, detailed Gemini Match Advisor analysis, and priority visibility.
          </span>
        </div>
      )}

      {/* Pricing Comparison Bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-stretch text-left">
        
        {/* FREE TIER CARD */}
        <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm relative">
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-700">Standard Tier</h3>
              <p className="text-xs text-slate-400 mt-1">Perfect to experience the SoulMatch playground</p>
            </div>

            <div className="flex items-baseline gap-1 py-2">
              <span className="text-4xl font-extrabold font-display text-slate-800">$0</span>
              <span className="text-xs text-slate-400">forever</span>
            </div>

            <div className="border-t border-slate-50 pt-4 space-y-3">
              {[
                "Unlimited daily likes and passes",
                "Basic compatibility metrics filters",
                "Real-time text chat messages",
                "Standard facial verification selfie checks"
              ].map((b) => (
                <div key={b} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3.5] flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <span className="block text-center py-3 bg-slate-50 text-slate-500 font-bold text-xs rounded-xl border border-slate-100">
              {currentPlan?.plan === 'free' ? "✓ Your Active Plan" : "Downgrade permitted anytime"}
            </span>
          </div>
        </div>

        {/* PREMIUM GOLD TIER CARD */}
        <div className="bg-slate-900 border-2 border-brand-500 text-white p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-brand-500/10 pointer-events-none">
            <Crown className="w-48 h-48" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-100">Premium Member</h3>
                <p className="text-xs text-slate-300 mt-1">Unleash the full capability of Gemini</p>
              </div>
              <span className="px-2.5 py-1 bg-brand-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
                Best Choice
              </span>
            </div>

            <div className="flex items-baseline gap-1 py-2">
              <span className="text-4xl font-extrabold font-display text-white">$19.99</span>
              <span className="text-xs text-slate-300">/month</span>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              {[
                "Unlimited matching compatibility sweeps",
                "Google Gemini Match Advisor detailed reports",
                "Realtime video-calls & voice record simulations",
                "Priority matching node profile boost (3x multiplier)",
                "Full Admin queue verification bypass",
                "Ad-free organic discovery"
              ].map((b) => (
                <div key={b} className="flex items-center gap-2.5 text-xs text-slate-200 font-medium">
                  <Check className="w-4.5 h-4.5 text-brand-500 stroke-[3.5] flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 relative z-10">
            {currentPlan?.plan === 'premium' ? (
              <div className="text-center py-3 bg-emerald-500 text-white font-extrabold text-xs rounded-xl border border-emerald-600">
                ✓ Premium Gold Plan Active
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade('premium')}
                disabled={loading}
                className="w-full py-3 bg-gradient-brand text-white font-extrabold text-xs rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition"
              >
                {loading ? "Processing Secure Stripe Sandbox..." : "Upgrade to Premium Now"}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}