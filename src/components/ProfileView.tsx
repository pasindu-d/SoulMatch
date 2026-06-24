import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, UserCheck, Eye, Compass, Heart, Bookmark, Edit, HelpCircle, AlertCircle, Trash2, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import { UserProfile, COMPATIBILITY_QUESTIONS } from '../types';

interface ProfileViewProps {
  onProfileUpdated: () => void;
}

export default function ProfileView({ onProfileUpdated }: ProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Edit controls
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [location, setLocation] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState<any>('Long-term partnership');
  const [interestsText, setInterestsText] = useState('');

  // AI assistant writing
  const [isSuggestingBio, setIsSuggestingBio] = useState(false);
  const [aiBioResult, setAiBioResult] = useState('');

  // Questionnaire Category Tab
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const fetchProfileSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.currentUser) {
        setProfile(data.currentUser);
        setAnswers(data.answers || {});
        // Pre-fill the states
        setBio(data.currentUser.bio || '');
        setOccupation(data.currentUser.occupation || '');
        setLocation(data.currentUser.location || '');
        setRelationshipGoal(data.currentUser.relationship_goal || 'Long-term partnership');
        setInterestsText(data.currentUser.interests ? data.currentUser.interests.join(", ") : "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileSession();
  }, []);

  const handleUpdateProfile = async (customBio?: string, customPhotos?: string[], customPrimaryPhoto?: string) => {
    const list = interestsText.split(",").map(i => i.trim()).filter(i => i.length > 0);
    const body: Partial<UserProfile> = {
      bio: customBio || bio,
      occupation,
      location,
      relationship_goal: relationshipGoal,
      interests: list
    };

    if (customPhotos) {
      body.photos = customPhotos;
    }
    if (customPrimaryPhoto) {
      body.photo_url = customPrimaryPhoto;
    }

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.currentUser);
        onProfileUpdated();
        alert("Profile metrics successfully persisted!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuggestBio = async () => {
    setIsSuggestingBio(true);
    setAiBioResult('');
    const list = interestsText.split(",").map(i => i.trim()).filter(i => i.length > 0);
    try {
      const res = await fetch('/api/profile/suggest-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupation,
          interests: list,
          goal: relationshipGoal
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiBioResult(data.bio);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggestingBio(false);
    }
  };

  const handleApplyAIBio = () => {
    setBio(aiBioResult);
    setAiBioResult('');
    handleUpdateProfile(aiBioResult);
  };

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      const res = await fetch('/api/compatibility/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer })
      });
      const data = await res.json();
      if (data.success) {
        setAnswers(data.answers);
        setProfile(data.currentUser);
        onProfileUpdated();
        // advance index
        if (activeQuestionIndex < COMPATIBILITY_QUESTIONS.length - 1) {
          setActiveQuestionIndex(activeQuestionIndex + 1);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyNow = async () => {
    try {
      const res = await fetch('/api/profile/verify-id', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchProfileSession();
        onProfileUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmFirst = window.confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.");
    if (!confirmFirst) return;

    const confirmSecond = window.confirm("This will erase all your matches, chats, and profile data from our system. Confirm final deletion:");
    if (!confirmSecond) return;

    setLoading(true);
    try {
      // 1. Delete from Firebase Authentication (if user exists)
      try {
        const { auth, signOut } = await import("../firebase");
        const { deleteUser } = await import("firebase/auth");
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          await deleteUser(firebaseUser);
        } else {
          await signOut(auth);
        }
      } catch (fbErr: any) {
        console.warn("Could not delete from Firebase Auth (it might require recent login or cookies are blocked). Signing out instead...", fbErr);
        if (fbErr.code === "auth/requires-recent-login") {
          alert("For security reasons, please log out and log back in before deleting your account.");
          setLoading(false);
          return;
        }
      }

      // 2. Delete from our databases (via API)
      const res = await fetch("/api/profile/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Your account and all associated data have been completely deleted.");
        window.location.href = "/";
      } else {
        alert(data.error || "Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during account deletion.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl">
        <div className="w-8 h-8 rounded-full border-3 border-brand-500 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  const activeQuestion = COMPATIBILITY_QUESTIONS[activeQuestionIndex];

  return (
    <div id="profile_layout_container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
      
      {/* 1. LEFT COLUMN: PROFILE CARD SUMMARY */}
      <aside className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl space-y-5 shadow-sm">
        
        {/* Photo with verification overlapping labels */}
        <div className="relative rounded-2xl overflow-hidden aspect-square max-h-72 bg-slate-100">
          <img 
            referrerPolicy="no-referrer" 
            src={profile.photo_url} 
            alt={profile.full_name} 
            className="w-full h-full object-cover"
          />
          {profile.verification_status === 'verified' ? (
            <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified
            </span>
          ) : (
            <button 
              onClick={handleVerifyNow}
              className="absolute bottom-3 left-3 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded shadow-md flex items-center gap-0.5"
            >
              Verify Profile Now
            </button>
          )}

          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 rounded py-1">
            Quality Score: {profile.profile_completion}%
          </div>
        </div>

        {/* Name and location meta */}
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-xl text-slate-800 leading-none">
            {profile.full_name}, {profile.age}
          </h3>
          <p className="text-xs text-slate-400 font-medium">{profile.location}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/60 text-xs text-slate-500 space-y-1.5">
          <p className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Self-Assessment Traits</p>
          <p><strong>Goal:</strong> {profile.relationship_goal}</p>
          <p><strong>Style:</strong> {profile.communication_style || 'Not declared'}</p>
          <p><strong>Role:</strong> <span className="text-indigo-600 font-bold uppercase">{profile.personality_type || 'Unknown Analyzer'}</span></p>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 space-y-2 text-left">
          <p className="font-extrabold text-[10px] text-red-550 uppercase tracking-widest flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Danger Zone
          </p>
          <p className="text-[11px] text-slate-500 leading-normal">
            Deleting your account is permanent. It will immediately and completely erase your profile, matches, messages, and all other data from our database.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleDeleteAccount}
            className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl transition duration-150 shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete My Account
          </button>
        </div>

      </aside>

      {/* 2. RIGHT COLUMN: MAIN FORM EDIT & QUESTIONS */}
      <main className="lg:col-span-8 space-y-6">
        
        {/* EDIT BIO AND DETAILS */}
        <section className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <Edit className="w-4 h-4 text-brand-500" />
            <h3 className="font-display font-bold text-slate-800">Edit Profile & Values</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Occupation</label>
              <input
                id="edit_occupation"
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">General Location</label>
              <input
                id="edit_location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">My Target Relationship Goal</label>
            <select
              id="edit_goal"
              value={relationshipGoal}
              onChange={(e) => setRelationshipGoal(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs bg-white font-medium text-slate-700"
            >
              <option value="Marriage/Life Partner">Marriage/Life Partner</option>
              <option value="Long-term partnership">Long-term partnership</option>
              <option value="Casual dating">Casual dating</option>
              <option value="New friends">New friends</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Interests (Comma Separated)</label>
            <input
              id="edit_interests"
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Bio write area with Gemini generator shortcut */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase">Personal Biography</label>
              <button
                type="button"
                onClick={handleSuggestBio}
                disabled={isSuggestingBio}
                className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3 text-brand-500 animate-pulse" />
                Rewrite with Gemini Bio Writer
              </button>
            </div>

            <textarea
              id="edit_bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell about your weekend rituals, hobbies and what makes you smile..."
              className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl outline-none focus:ring-1 focus:ring-brand-500"
            />

            {isSuggestingBio && (
              <p className="text-[10px] text-slate-400 animate-pulse font-mono">
                Generating personalized storytelling draft using gemini-3.5-flash...
              </p>
            )}

            {aiBioResult && (
              <div className="p-3 bg-gradient-to-r from-orange-50 to-brand-50 border border-brand-100 rounded-xl space-y-2.5 animate-fade-in text-xs">
                <p className="text-slate-700 italic font-medium">"{aiBioResult}"</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyAIBio}
                    className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-[10px] uppercase font-bold rounded-lg"
                  >
                    Apply Bio
                  </button>
                  <button
                    onClick={() => setAiBioResult('')}
                    className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[10px] uppercase rounded-lg"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            type="button"
            onClick={() => handleUpdateProfile()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
          >
            Save Basic Updates
          </button>

        </section>

        {/* SHOWCASE PHOTO GALLERY MANAGER (MAX 5 IMAGES CONSTRAINT) */}
        <section id="showcase_photo_manager" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-brand-500" />
              <div>
                <h3 className="font-display font-extrabold text-slate-800 text-sm">Showcase Photo Gallery</h3>
                <p className="text-[10px] text-slate-450 font-medium">Manage up to 5 pictures to display on your match profile card.</p>
              </div>
            </div>
            
            {/* Storage optimization counter */}
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              (profile.photos || []).length >= 5 
                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                : 'bg-brand-50 text-brand-600 border border-brand-100'
            }`}>
              Storage slots: {(profile.photos || []).length} / 5 Used
            </span>
          </div>

          {/* Current showcase grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(profile.photos || []).map((imgUrl, i) => {
              const isPrimary = profile.photo_url === imgUrl;
              return (
                <div key={`${imgUrl}-${i}`} className="group relative rounded-xl overflow-hidden aspect-square bg-slate-50 border border-slate-205 shadow-xs flex flex-col justify-end">
                  <img src={imgUrl} alt="Showcase upload" className="absolute inset-0 w-full h-full object-cover" />
                  
                  {isPrimary && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-extrabold uppercase rounded shadow-xs z-10">
                      Primary
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition duration-150 flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                    {!isPrimary ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateProfile(undefined, undefined, imgUrl)}
                        className="w-full py-1 bg-white hover:bg-neutral-50 text-slate-900 text-[9px] font-extrabold rounded-lg shadow-sm cursor-pointer"
                      >
                        Set Primary
                      </button>
                    ) : (
                      <span className="text-[8px] font-black text-rose-300 uppercase tracking-wider mb-1">Primary Active</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const updatedPhotos = (profile.photos || []).filter(p => p !== imgUrl);
                        // If we deleted the primary photo, default to the first available or placeholder
                        const updatedPrimary = isPrimary 
                          ? (updatedPhotos[0] || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400') 
                          : profile.photo_url;
                        handleUpdateProfile(undefined, updatedPhotos, updatedPrimary);
                      }}
                      className="w-full py-1 bg-red-650 hover:bg-red-700 text-white text-[9px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty placeholders */}
            {Array.from({ length: Math.max(0, 5 - (profile.photos || []).length) }).map((_, idx) => (
              <div key={`placeholder-${idx}`} className="border-2 border-dashed border-slate-100 rounded-xl aspect-square flex flex-col items-center justify-center text-slate-350 bg-slate-50/50">
                <ImageIcon className="w-5 h-5 opacity-30 text-slate-400" />
                <span className="text-[9px] mt-1 font-bold">Empty Slot</span>
              </div>
            ))}
          </div>

          {/* Add picture inputs */}
          {(profile.photos || []).length < 5 ? (
            <div className="bg-slate-55 p-4 rounded-2xl border border-slate-100 space-y-4 text-xs">
              
              {/* File Uploader via FileReader (Base64 conversion) */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Upload Local Showcase Image</label>
                <div className="flex items-center justify-center border border-dashed border-slate-200 p-4 rounded-xl bg-white hover:bg-slate-50 transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    name="profileShowcaseFile"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      // Max 4MB size constraint
                      if (file.size > 4 * 1024 * 1024) {
                        alert("File exceeds maximum premium size of 4MB. Highlight optimal JPEG selection.");
                        return;
                      }
                      
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64Url = event.target?.result as string;
                        if (base64Url) {
                          const currentPhotos = profile.photos || [];
                          if (currentPhotos.length >= 5) {
                            alert("Maximum of 5 photos permitted.");
                            return;
                          }
                          const updated = [...currentPhotos, base64Url];
                          const updatedPrimary = currentPhotos.length === 0 ? base64Url : profile.photo_url;
                          handleUpdateProfile(undefined, updated, updatedPrimary);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  />
                  <div className="text-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <p className="text-[10px] text-slate-400 font-extrabold">Drag & Drop or Choose Image file</p>
                    <p className="text-[9px] text-slate-350">Optimal: JPEG/PNG up to 4MB size bounds</p>
                  </div>
                </div>
              </div>

              {/* Paste URL Option */}
              <div className="space-y-1.5 text-left pt-2 border-t border-slate-50">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Alternatively: Add Direct Image Link</label>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem('directUrlInput') as HTMLInputElement;
                    const value = input?.value?.trim();
                    if (!value) return;
                    
                    const currentPhotos = profile.photos || [];
                    if (currentPhotos.length >= 5) {
                      alert("Maximum of 5 photos allowed.");
                      return;
                    }
                    const updated = [...currentPhotos, value];
                    const updatedPrimary = currentPhotos.length === 0 ? value : profile.photo_url;
                    handleUpdateProfile(undefined, updated, updatedPrimary);
                    input.value = '';
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="directUrlInput"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="flex-1 p-2.5 bg-white border border-slate-205 rounded-xl text-xs font-medium focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Image
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs font-semibold">
              🔒 Max database safety achieved (5 / 5 showcase images filled). Delete a picture above to free up slot capacity.
            </div>
          )}
        </section>

        {/* COMPATIBILITY QUESTIONNAIRE */}
        <section className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="font-display font-bold text-slate-800">Advanced Match Assessments</h3>
          </div>

          <p className="text-xs text-slate-400">
            Answering compatibility criteria raises your matches frequency. We map these answers instantly across all discovered users profiles.
          </p>

          {activeQuestion ? (
            <div className="p-5 bg-emerald-50/20 border border-emerald-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Category: {activeQuestion.category.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-405 font-semibold">Q {activeQuestionIndex + 1} of {COMPATIBILITY_QUESTIONS.length}</span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-800 leading-snug">
                {activeQuestion.text}
              </h4>

              <div className="space-y-2">
                {activeQuestion.options.map((option) => {
                  const isChecked = answers[activeQuestion.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerQuestion(activeQuestion.id, option)}
                      className={`w-full p-3 rounded-xl text-left text-xs font-semibold leading-relaxed transition ${
                        isChecked 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Navigate indices */}
              <div className="flex gap-2 justify-end pt-1">
                {activeQuestionIndex > 0 && (
                  <button
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Previous Assessment
                  </button>
                )}
                {activeQuestionIndex < COMPATIBILITY_QUESTIONS.length - 1 && (
                  <button
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 ml-4"
                  >
                    Next Assessment
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold text-center">
              ✓ All compatibility metrics fully filled out! You are set.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
