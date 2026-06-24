import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, Image as ImageIcon, Sparkles, ShieldCheck, 
  Video, PhoneCall, AlertTriangle, AlertCircle, Info, Smile, CheckCheck 
} from 'lucide-react';
import { Message, UserProfile } from '../types';

interface ChatViewProps {
  selectedUserId?: string;
  onClearSelectedUser?: () => void;
}

const SHARABLE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400', label: '🎧 Recording setup' },
  { url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=400', label: '🌲 Local hiking trail' },
  { url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=400', label: '🌵 Gorgeous succulents' }
];

export default function ChatView({ selectedUserId, onClearSelectedUser }: ChatViewProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(selectedUserId || null);
  const [conversations, setConversations] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // AI Icebreaker
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(false);

  // Security Assessment Alerts
  const [isScanningSafety, setIsScanningSafety] = useState(false);
  const [safetyReport, setSafetyReport] = useState<any | null>(null);

  // Video Call overlay simulation
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  let timerRef = useRef<any>(null);

  // Voice Recording Simulator State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  let voiceTimerRef = useRef<any>(null);

  // Image Share Dropdown Toggle
  const [showImageShare, setShowImageShare] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchRoomSession = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.currentUser) {
        // Resolve all active match users
        const matchedRelations = data.matches.filter((m: any) => m.status === 'matched');
        
        const channelsListPromises = matchedRelations.map(async (m: any) => {
          const detailRes = await fetch('/api/discover');
          const detailData = await detailRes.json();
          const user = detailData.recommended.find((u: any) => u.user_id === m.user_b);
          
          if (user) {
            // Find last message
            const dialog = data.messages.filter((msg: Message) => 
              (msg.sender_id === 'current_user' && msg.receiver_id === user.user_id) ||
              (msg.sender_id === user.user_id && msg.receiver_id === 'current_user')
            );
            const lastMsg = dialog.length > 0 ? dialog[dialog.length - 1] : null;

            return {
              ...user,
              lastMessageText: lastMsg ? lastMsg.message_text : "No messages yet",
              lastMessageTime: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
            };
          }
          return null;
        });

        const resolved = (await Promise.all(channelsListPromises)).filter(c => c !== null);
        setChannels(resolved);

        // Fetch dialogue for active user
        if (activeUserId) {
          const activeDialog = data.messages.filter((msg: Message) => 
            (msg.sender_id === 'current_user' && msg.receiver_id === activeUserId) ||
            (msg.sender_id === activeUserId && msg.receiver_id === 'current_user')
          );
          setConversations(activeDialog);
        } else if (resolved.length > 0) {
          setActiveUserId(resolved[0].user_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoomSession();
    // poll every 5 seconds to load simulated partner replies dynamically
    const handle = setInterval(() => {
      fetchRoomSession();
    }, 4500);
    return () => clearInterval(handle);
  }, [activeUserId]);

  useEffect(() => {
    if (selectedUserId) {
      setActiveUserId(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const handleSendMessage = async (textOver?: string, imagePayload?: { check: boolean, url: string }) => {
    const messageContent = textOver || inputText;
    if (!messageContent && !imagePayload) return;
    if (!activeUserId) return;

    try {
      const payload: any = {
        receiverId: activeUserId,
        text: messageContent
      };
      if (imagePayload?.check) {
        payload.isImage = true;
        payload.imageUrl = imagePayload.url;
        payload.text = "[Shared a photo]";
      }

      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setInputText('');
        fetchRoomSession();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulated Voice Notes Recording
  const handleStartRecording = () => {
    setIsVoiceRecording(true);
    setVoiceTimer(0);
    voiceTimerRef.current = setInterval(() => {
      setVoiceTimer(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecordingAndSend = async () => {
    clearInterval(voiceTimerRef.current);
    setIsVoiceRecording(false);
    if (!activeUserId) return;

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeUserId,
          text: `[Audio message: ${voiceTimer} seconds]`,
          isVoice: true,
          voiceDuration: voiceTimer
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchRoomSession();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate customized AI Icebreaker using Gemini
  const handleGenerateAI_Icebreaker = async () => {
    if (!activeUserId) return;
    setIsGeneratingIcebreaker(true);
    try {
      const res = await fetch('/api/chat/icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchUserId: activeUserId })
      });
      const data = await res.json();
      if (data.success) {
        setInputText(data.icebreaker);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingIcebreaker(false);
    }
  };

  // Run Real-Time Safety Assessment
  const handleRunSafetyScan = async () => {
    if (!activeUserId) return;
    setIsScanningSafety(true);
    setSafetyReport(null);
    try {
      const res = await fetch('/api/chat/scan-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchUserId: activeUserId })
      });
      const data = await res.json();
      if (data.success) {
        setSafetyReport(data.assessment);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningSafety(false);
    }
  };

  // Video Call simulation triggers
  const handleStartCall = () => {
    setIsVideoCalling(true);
    setCallTimer(0);
    timerRef.current = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
  };

  const handleEndCall = () => {
    clearInterval(timerRef.current);
    setIsVideoCalling(false);
  };

  const activeChannel = channels.find(c => c.user_id === activeUserId);

  return (
    <div id="unified_chat_experience" className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-custom h-[620px] grid grid-cols-1 md:grid-cols-12 items-stretch animate-fade-in text-left">
      
      {/* 1. LEFT RAIL: CONVERSATION LIST */}
      <aside className="md:col-span-4 border-r border-slate-50 flex flex-col items-stretch overflow-y-auto">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <h3 className="font-display font-extrabold text-slate-800">Your Conversations</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Real-time indicators active</p>
        </div>

        <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
          {channels.length > 0 ? (
            channels.map((channel) => {
              const active = channel.user_id === activeUserId;
              return (
                <div
                  key={channel.user_id}
                  onClick={() => {
                    setActiveUserId(channel.user_id);
                    setSafetyReport(null);
                  }}
                  className={`p-4 flex items-center gap-3.5 cursor-pointer transition ${
                    active ? 'bg-brand-50/70 border-l-4 border-brand-500' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="relative">
                    <img 
                      referrerPolicy="no-referrer" 
                      src={channel.photo_url} 
                      alt={channel.full_name} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                        {channel.full_name}
                        {channel.verification_status === 'verified' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-medium font-mono">{channel.lastMessageTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate leading-snug">
                      {channel.lastMessageText}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-450 space-y-2">
              <Smile className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs">No active chats. Start swipe matching above to unlock conversations!</p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. RIGHT CHAT BOARD */}
      <main className="md:col-span-8 flex flex-col justify-between items-stretch bg-slate-50/20">
        
        {activeChannel ? (
          <>
            {/* Chat header area */}
            <header className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  referrerPolicy="no-referrer" 
                  src={activeChannel.photo_url} 
                  alt={activeChannel.full_name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {activeChannel.full_name}
                    {activeChannel.verification_status === 'verified' && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-emerald-600 font-medium tracking-wide">● Active on matching node</p>
                </div>
              </div>

              {/* Advanced Call, Advisor & Safety Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartCall}
                  className="p-2 hover:bg-slate-50 text-slate-600 rounded-xl transition border border-slate-100"
                  title="Simulate Video Call"
                >
                  <Video className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={handleGenerateAI_Icebreaker}
                  disabled={isGeneratingIcebreaker}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition border border-brand-100"
                  title="Generate Icebreaker Line"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  AI Icebreaker
                </button>

                <button
                  onClick={handleRunSafetyScan}
                  disabled={isScanningSafety}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition border border-rose-100"
                  title="Verify security metrics"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Safety Scan
                </button>
              </div>
            </header>

            {/* Safety report overlay warning alertbox */}
            {safetyReport && (
              <div className={`p-3.5 m-4 rounded-2xl flex items-start gap-2.5 shadow-sm text-xs border ${
                safetyReport.isSafe 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-rose-50 border-rose-150 text-rose-800 animate-pulse'
              }`}>
                {safetyReport.isSafe ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase text-[10px] tracking-wider">
                      {safetyReport.isSafe ? "AI Safety Guard Active" : "CRITICAL SECURITY WARNING"}
                    </span>
                    <span className="font-mono text-[9px] bg-white px-1 py-0.2 rounded">Conf: {safetyReport.safetyScore}%</span>
                  </div>
                  <p className="leading-relaxed font-sans">{safetyReport.warningAdvice}</p>
                  {safetyReport.flaggedTriggerWords?.length > 0 && (
                    <p className="text-[10px] font-mono font-medium text-rose-700">Flagged words: {safetyReport.flaggedTriggerWords.join(', ')}</p>
                  )}
                  <button 
                    onClick={() => setSafetyReport(null)}
                    className="text-[10px] underline font-bold mt-1 text-slate-500 hover:text-slate-700 block"
                  >
                    Dismiss alert
                  </button>
                </div>
              </div>
            )}

            {/* Bubble list scrollboard */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations.map((msg) => {
                const isMe = msg.sender_id === 'current_user';
                return (
                  <div 
                    key={msg.message_id}
                    className={`flex flex-col max-w-[70%] space-y-1 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-gradient-brand text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.is_voice ? (
                        <div className="flex items-center gap-2">
                          <Mic className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[10px] tracking-wider">Voice Note ({msg.voice_duration}s)</span>
                          <div className="flex gap-0.5 items-center">
                            <span className="w-1 h-3 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <span className="w-1.5 h-4 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-1 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                        </div>
                      ) : msg.is_image ? (
                        <div className="space-y-2">
                          <img referrerPolicy="no-referrer" src={msg.image_url} alt="Shared attachment" className="rounded-xl max-w-[200px] h-36 object-cover border border-slate-50" />
                          <p className="text-[10px] italic opacity-85">{msg.message_text}</p>
                        </div>
                      ) : (
                        msg.message_text
                      )}
                    </div>

                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Interactive footer controller panel (Mute controls or image selectors) */}
            {showImageShare && (
              <div className="p-3 bg-white border-t border-slate-100 grid grid-cols-3 gap-2 animate-fade-in">
                {SHARABLE_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => {
                      handleSendMessage(`Beautiful view of ${img.label}!`, { check: true, url: img.url });
                      setShowImageShare(false);
                    }}
                    className="p-1 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left flex flex-col"
                  >
                    <img referrerPolicy="no-referrer" src={img.url} alt={img.label} className="w-full h-16 object-cover rounded-lg" />
                    <span className="text-[9px] font-bold text-slate-600 mt-1 truncate block px-1">{img.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Chat entry form inputs */}
            <footer className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowImageShare(!showImageShare)}
                className="p-3 text-slate-400 hover:text-brand-500 rounded-full hover:bg-slate-50 transition"
                title="Send Photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {isVoiceRecording ? (
                <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl py-2 px-4 flex items-center justify-between text-rose-700 text-xs font-bold font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    Recording: {voiceTimer} seconds
                  </div>
                  <button
                    onClick={handleStopRecordingAndSend}
                    className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition"
                  >
                    Finish Note
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex-1 flex items-center gap-2"
                >
                  <input
                    id="message_entry_box"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a thoughtful message, try 'crypto' to test safety scanner..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-100 text-xs text-slate-700"
                  />

                  <button
                    type="button"
                    onMouseDown={handleStartRecording}
                    className="p-3 text-slate-400 hover:text-emerald-500 rounded-full hover:bg-slate-50 transition"
                    title="Hold to record voice"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <button
                    type="submit"
                    className="p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow transition"
                  >
                    <Send className="w-4 h-4 fill-white" />
                  </button>
                </form>
              )}
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-450 space-y-3">
            <Smile className="w-12 h-12 text-slate-200" />
            <h4 className="font-display font-bold text-slate-700">Unified Soul Chat Center</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Select or generate a genuine connection from the left rails sidebar to commence messaging dynamically.
            </p>
          </div>
        )}

      </main>

      {/* FULL-SCREEN VIDEO CALL OVERLAY SIMULATION */}
      {isVideoCalling && activeChannel && (
        <div className="fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between items-center text-white font-sans animate-fade-in">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Encrypted SoulMatch Stream</span>
            <h3 className="text-2xl font-extrabold font-display leading-none">{activeChannel.full_name}</h3>
            <p className="text-xs font-mono opacity-85">Duration: {Math.floor(callTimer / 60)}:{(callTimer % 60).toString().padStart(2, '0')}</p>
          </div>

          {/* Double camera layouts */}
          <div className="relative w-full max-w-xl aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            
            {/* The main picture matches as partner view */}
            <img 
              referrerPolicy="no-referrer" 
              src={activeChannel.photo_url} 
              alt="Partner stream" 
              className="w-full h-full object-cover"
            />
            
            {/* Selfie mini overlay camera */}
            <div className="absolute bottom-4 right-4 w-32 aspect-square rounded-2xl overflow-hidden border-2 border-white/85 shadow-lg bg-slate-900 bg-gradient-brand">
              <div className="relative w-full h-full flex items-center justify-center text-xs font-bold text-white/50 bg-brand-500/10">
                <span>Selfie Feed</span>
                <span className="absolute bottom-1 right-2 text-[9px] uppercase font-bold text-emerald-400 font-mono animate-pulse">● Rec</span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-4 text-center">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur text-[10px] rounded-full uppercase tracking-widest font-bold text-slate-300">
                Partner Webcam Connected
              </span>
            </div>

          </div>

          {/* Action Call Controller Buttons */}
          <div className="flex items-center gap-6 pb-6">
            <button
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition ${
                isCallMuted ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {isCallMuted ? "Unmute" : "Mute"}
            </button>

            <button
              onClick={handleEndCall}
              className="px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 font-extrabold text-sm uppercase tracking-wide transition shadow-lg"
            >
              Hang Up Call
            </button>
            
            <span className="text-[10px] font-bold text-slate-500 max-w-[120px] leading-snug">
              Simulation Mode Active
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
