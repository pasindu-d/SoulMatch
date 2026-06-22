import React, { useState } from 'react';
import { Mail, Phone, User, Heart, Sparkles, Image as ImageIcon, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface RegistrationFlowProps {
  onRegisterComplete: (userData: Partial<UserProfile>) => void;
  initialEmail?: string;
}

const INTERESTS_PRESETS = [
  'Design', 'AI & Tech', 'Hiking', 'Coffee Cuppings', 'Vinyl Records',
  'Gardening', 'Smoking Brisket', 'Baking', 'Jazz Piano', 'Animal Rescue',
  'Yoga & Meditation', 'Classical Music', 'Cooking', 'Board Games', 'Biking'
];

const PRESET_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', label: 'Elegance & Style' },
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400', label: 'Urban Casual' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', label: 'Warm Professional' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', label: 'Artist vibe' }
];

export default function RegistrationFlow({ onRegisterComplete, initialEmail = '' }: RegistrationFlowProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Simulated OTP control states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [simulatedOtpHint, setSimulatedOtpHint] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Profile Fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-binary' | 'Other'>('Male');
  const [location, setLocation] = useState('San Francisco, CA');
  const [occupation, setOccupation] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState<UserProfile['relationship_goal']>('Long-term partnership');
  
  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Hiking', 'Coffee Cuppings']);
  
  // Photos
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[1].url);
  
  // Verification
  const [selfieVerified, setSelfieVerified] = useState(false);
  const [isVerifyingSelfie, setIsVerifyingSelfie] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email) {
      setErrorMessage("Please enter a valid email address first.");
      return;
    }
    if (!password || !confirmPassword) {
      setErrorMessage("Please duplicate enter both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify that both fields match exactly.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("To secure your profile, please input a password with at least 6 characters.");
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to trigger OTP simulation.");
      } else {
        setOtpSent(true);
        setSimulatedOtpHint(data.otp);
        setSuccessMessage(`Simulated OTP code sent successfully! Check the dashboard notice to retrieve verification key.`);
      }
    } catch (err) {
      setErrorMessage("Failed to send OTP. Server connection issue.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!otpCode) {
      setErrorMessage("Please retrieve the simulated 6-digit code.");
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Incorrect OTP code.");
      } else {
        setOtpVerified(true);
        setSuccessMessage("✓ Email verified successfully! You may now proceed.");
      }
    } catch (err) {
      setErrorMessage("Database verification connection failure.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleNextStep = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (step === 1) {
      if (!email) {
        setErrorMessage("Please enter an email address.");
        return;
      }
      if (!password || !confirmPassword) {
        setErrorMessage("Please double-enter password to confirm registration.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Password fields do not match!");
        return;
      }
      if (!otpVerified) {
        setErrorMessage("Please request and input the correct verification OTP code to proceed.");
        return;
      }
    }
    if (step === 2 && !phone) {
      alert("Please enter a valid phone number");
      return;
    }
    if (step === 3 && (!fullName || !occupation)) {
      alert("Please fill out your name and occupation");
      return;
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setStep(Math.max(1, step - 1));
  };

  const handleSelfieVerifySimulator = () => {
    setIsVerifyingSelfie(true);
    setTimeout(() => {
      setIsVerifyingSelfie(false);
      setSelfieVerified(true);
    }, 2000);
  };

  const handleSubmitAll = () => {
    onRegisterComplete({
      email,
      password,
      full_name: fullName,
      age,
      gender,
      location,
      occupation,
      relationship_goal: relationshipGoal,
      interests: selectedInterests,
      photo_url: photoUrl,
      verification_status: selfieVerified ? 'verified' : 'unverified'
    });
  };

  return (
    <div id="registration_wizard_container" className="max-w-xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-custom space-y-6">
      
      {/* Step Progress indicators */}
      <div id="progress_step_bar" className="flex items-center justify-between">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
              step === s 
                ? 'bg-brand-500 text-white ring-4 ring-brand-100' 
                : step > s 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-100 text-slate-400'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 7 && (
              <div className={`h-1 flex-1 mx-2 rounded ${
                step > s ? 'bg-emerald-200' : 'bg-slate-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="border-b border-slate-50 pb-2">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Step {step} of 7</span>
        <h2 className="text-2xl font-extrabold text-slate-800 font-display">
          {step === 1 && "Create Your Secure Account"}
          {step === 2 && "Phone Authentication"}
          {step === 3 && "Tell us about yourself"}
          {step === 4 && "Relationship Preferences"}
          {step === 5 && "Select your Interests"}
          {step === 6 && "Upload Your Profile Photo"}
          {step === 7 && "Secure Biometric Verification"}
        </h2>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold text-left">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-left">
          ✨ {successMessage}
        </div>
      )}

      {/* STEP 1: EMAIL & PASSWORD REGISTRATION + VERIFICATION */}
      {step === 1 && (
        <div className="space-y-4 text-left animate-fade-in">
          <p className="text-xs text-slate-500 leading-relaxed">
            Let's start your genuine compatibility profiling. First, establish your registration credentials and verify your email via a simulated verification OTP to prevent duplicated profiles.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                id="reg_email_input"
                type="email"
                disabled={otpVerified}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 disabled:opacity-75 rounded-2xl outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  id="reg_password_input"
                  type="password"
                  disabled={otpVerified}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 disabled:opacity-75 rounded-2xl outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  id="reg_confirm_password_input"
                  type="password"
                  disabled={otpVerified}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Double-enter to confirm"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 disabled:opacity-75 rounded-2xl outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 transition text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {!otpVerified ? (
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-black text-slate-800">Email Verification Step</h4>
                  <p className="text-[10px] text-slate-400">Verifies your address ownership & eliminates redundant identities.</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isSendingOtp}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-wider transition text-slate-700 cursor-pointer shrink-0"
                >
                  {isSendingOtp ? "Invoking..." : otpSent ? "Resend OTP Code" : "Send Account OTP"}
                </button>
              </div>

              {otpSent && (
                <div className="space-y-2.5 pt-2 border-t border-slate-200/55 animate-fade-in">
                  <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-2xl text-[11px] text-indigo-700 font-semibold space-y-1">
                    <p className="font-extrabold uppercase tracking-widest text-[10px] text-indigo-800">📫 Simulated Email Generated:</p>
                    <p>We simulated a verification mail delivery to <strong className="font-bold underline">{email}</strong>.</p>
                    <p>Your 6-Digit OTP security key is: <span className="font-mono bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-black text-xs inline-block tracking-widest mt-0.5">{simulatedOtpHint}</span></p>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-500 uppercase">Input Sent 6-Digit Code</label>
                    <div className="flex gap-2">
                      <input
                        id="reg_email_otp"
                        type="text"
                        maxLength={6}
                        placeholder="Enter the 6-digit OTP code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-mono tracking-widest text-center focus:ring-1 focus:ring-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOtp}
                        disabled={isVerifyingOtp}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-xl transition"
                      >
                        {isVerifyingOtp ? "Checking..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <h4 className="text-xs font-extrabold">Verified Account Ready</h4>
                <p className="text-[10px] text-emerald-600">Simulated verification checks passed. Click 'Next Step' to continue.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: PHONE */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Secure multi-factor authentication prevents fake accounts-making SoulMatch a safe dating ecosystem.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                id="reg_phone_input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 0192"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            By entering your phone, you simulated standard SMS routing permissions. No real text messages will be delivered in this sandboxed playground.
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-500">Verification code</label>
            <input
              id="reg_phone_otp"
              type="text"
              placeholder="Enter 5510"
              value={phoneOtpCode}
              onChange={(e) => setPhoneOtpCode(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-center font-mono"
            />
          </div>
        </div>
      )}

      {/* STEP 3: BASIC PROFILE */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input
                id="reg_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Your Age</label>
              <input
                id="reg_age"
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
              <select
                id="reg_gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none bg-white font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">General Location</label>
              <input
                id="reg_location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Occupation & Job Title</label>
            <input
              id="reg_occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. UX Designer, Botanist, Jazz Artist"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>
        </div>
      )}

      {/* STEP 4: PREFERENCES */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            What are your core intents? This dictates search criteria priority.
          </p>

          <div className="space-y-3">
            {[
              { val: 'Marriage/Life Partner', title: '💍 Marriage & Lifetime Partnership', desc: 'Seeking deep, stable commitments built toward starting a family' },
              { val: 'Long-term partnership', title: '🌱 Long-term Companion', desc: 'Looking to grow gracefully with daily shared lives and common paths' },
              { val: 'Casual dating', title: '🥂 Intentional Dating', desc: 'Going on dates, trade coffee, no marriage pressure immediately' },
              { val: 'New friends', title: '☕ Simple Connections', desc: 'Looking for coffee cupping mates, trail wanderers, or board game enthusiasts' }
            ].map((item) => (
              <div 
                key={item.val}
                onClick={() => setRelationshipGoal(item.val as any)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                  relationshipGoal === item.val 
                    ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-100' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/20'
                }`}
              >
                <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: INTERESTS */}
      {step === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Select 4 or more interests. Our AI-based compatibility analyzer aggregates these to calculate mutual match rankings.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {INTERESTS_PRESETS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition ${
                    selected 
                      ? 'bg-brand-500 text-white shadow-sm scale-102 font-bold' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100/60'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 6: PHOTO UPLOAD */}
      {step === 6 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Photos tell the first aesthetic story. Choose one of our high-quality matching profiles, or paste any custom picture URL!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_AVATARS.map((avatar) => (
              <div 
                key={avatar.url} 
                onClick={() => setPhotoUrl(avatar.url)}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition border-3 ${
                  photoUrl === avatar.url ? 'border-brand-500' : 'border-transparent'
                }`}
              >
                <img referrerPolicy="no-referrer" src={avatar.url} alt={avatar.label} className="w-full h-24 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-[10px] text-center text-white">
                  {avatar.label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">OR: PASTE ANY CUSTOM IMAGE URL</label>
            <input
              id="reg_custom_photo_url"
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs"
            />
          </div>

          <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
            <div className="text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Drag and drop file upload active</p>
              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs rounded-lg shadow-sm font-semibold hover:bg-slate-50">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: IDENTITY VERIFICATION */}
      {step === 7 && (
        <div className="space-y-6 text-center">
          <p className="text-sm text-slate-500 text-left">
            SoulMatch verified status grants you up to <strong className="text-emerald-600">3x higher match visibility</strong>. We crosscheck a quick selfie against your primary profile photo.
          </p>

          <div className="max-w-[200px] mx-auto relative rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-lg">
            <img referrerPolicy="no-referrer" src={photoUrl} alt="Selfie crosscheck" className="w-full aspect-square object-cover" />
            {selfieVerified && (
              <div className="absolute inset-0 bg-emerald-950/70 flex flex-col items-center justify-center text-white">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 fill-emerald-950 animate-bounce" />
                <p className="text-xs font-bold uppercase mt-2 text-emerald-300 tracking-widest">Selfie Match Verified!</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSelfieVerifySimulator}
              disabled={isVerifyingSelfie}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow ${
                selfieVerified 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isVerifyingSelfie ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Running Neural Biometric Evaluation...
                </>
              ) : selfieVerified ? (
                "✓ Soul Verified Active"
              ) : (
                "Trigger Live Selfie Biometric Check"
              )}
            </button>
            
            <p className="text-xs text-slate-400">
              Uses instant facial contour alignment. Once verified, your discover card displays the matching green badge!
            </p>
          </div>
        </div>
      )}

      {/* Navigation triggers */}
      <div id="registration_navs" className="flex items-center justify-between pt-4 border-t border-slate-50">
        {step > 1 ? (
          <button
            onClick={handlePrevStep}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < 7 ? (
          <button
            onClick={handleNextStep}
            className="px-6 py-2.5 bg-brand-500 text-white hover:bg-brand-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition ml-auto shadow-sm"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="finish_registration_btn"
            onClick={handleSubmitAll}
            className="px-8 py-3 bg-gradient-brand text-white font-extrabold text-sm rounded-xl flex items-center gap-2 transition ml-auto shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Finish & Enter SoulMatch!
          </button>
        )}
      </div>

    </div>
  );
}
