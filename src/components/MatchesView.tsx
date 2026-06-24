import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, ShieldCheck, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { UserProfile, MatchProgress } from '../types';

interface MatchesViewProps {
  onNavigate: (view: string) => void;
  onSelectChatUser: (userId: string) => void;
}

export default function MatchesView({ onNavigate, onSelectChatUser }: MatchesViewProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.success || data.currentUser) {
        const matchedRelations = data.matches.filter((m: MatchProgress) => m.status === 'matched');
        
        // Fetch full match user profiles from data
        const list = matchedRelations.map((m: MatchProgress) => {
          // find the details of the opposite user
          const matchUser = data.reports.some((r: any) => r.reported_user_id === m.user_b) 
            ? null // filtered out if reported/blocked for security
            : m.user_b;

          return {
            relation: m,
            userId: m.user_b
          };
        });

        // Resolve details for each user
        // In-memory demo retrieval: Query actual user details
        const detailRes = await fetch(`/api/discover`);
        const detailData = await detailRes.json();
        
        const resolved = matchedRelations.map((m: MatchProgress) => {
          const found = detailData.recommended.find((u: any) => u.user_id === m.user_b);
          if (found) {
            return {
              ...found,
              compatibility_score: m.compatibility_score,
              created_at: m.created_at
            };
          }
          return null;
        }).filter((u: any) => u !== null);
        
        setMatches(resolved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleStartChat = (userId: string) => {
    onSelectChatUser(userId);
    onNavigate('chat');
  };

  const handleUnmatch = async (userId: string) => {
    if (!confirm("Are you sure you want to unmatch this user? This will delete your conversation history.")) return;
    try {
      const res = await fetch('/api/match/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: userId, action: 'pass' })
      });
      const data = await res.json();
      if (data.success) {
        fetchMatches(); // reload
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="matches_grid_container" className="space-y-6 animate-fade-in text-left">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-800 font-display">Mutual Connections</h2>
        <p className="text-xs text-slate-500">
          Souls who shared mutual like indications with you. Start chats or check their AI Advice.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl">
          <div className="w-8 h-8 rounded-full border-3 border-brand-500 border-t-transparent animate-spin mx-auto pb-4" />
          <p className="text-xs text-slate-400 font-bold uppercase">Loading mutual alignment metrics...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((user) => (
            <div 
              key={user.user_id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:border-brand-200 shadow-card-hover hover:translate-y-[-2px] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo frame with overlapping percentage indicator */}
                <div className="relative h-48 bg-slate-100">
                  <img 
                    referrerPolicy="no-referrer" 
                    src={user.photo_url} 
                    alt={user.full_name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  
                  {user.verification_status === 'verified' && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-md flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}

                  <span className="absolute top-3 right-3 bg-gradient-brand text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow">
                    {user.compatibility_score}% Match
                  </span>

                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-display font-extrabold text-lg leading-none">
                      {user.full_name}, {user.age}
                    </h3>
                    <p className="text-[11px] text-slate-200 font-medium mt-0.5">{user.occupation}</p>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {user.interests.slice(0, 3).map((it: string) => (
                      <span key={it} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100/60 font-semibold">
                        {it}
                      </span>
                    ))}
                    {user.interests.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center pl-1">
                        +{user.interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat action shortcuts */}
              <div className="p-5 pt-0 flex items-center gap-2 border-t border-slate-50 mt-auto">
                <button
                  onClick={() => handleStartChat(user.user_id)}
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                >
                  <MessageSquare className="w-4 h-4" /> Start Conversation
                </button>
                <button
                  onClick={() => handleUnmatch(user.user_id)}
                  className="p-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-xl transition border border-slate-100"
                  title="Unmatch user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white border border-slate-100 rounded-3xl space-y-4">
          <Heart className="w-12 h-12 text-slate-200 mx-auto fill-slate-50" />
          <h3 className="text-lg font-bold text-slate-700 font-display">No matches generated yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Likes can trigger rapid mutual matches. Browse the Discover feed, swipe right on profiles you align with, and start conversations here instantly!
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
          >
            Go to Discover Feed
          </button>
        </div>
      )}

    </div>
  );
}
