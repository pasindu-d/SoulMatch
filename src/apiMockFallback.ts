import { UserProfile, MatchProgress, Message, Subscription, UserReport } from "./types";

// In-Memory/LocalStorage Local Database fallback
const STORAGE_PREFIX = "soulmatch_fallback_";

const INITIAL_USERS: (UserProfile & { email?: string })[] = [
  {
    user_id: 'user_alice',
    email: 'alice@soulmatch.com',
    full_name: 'Alice Chang',
    age: 26,
    gender: 'Female',
    location: 'San Francisco, CA',
    religion: 'Non-religious',
    education: 'BFA in Communications & Graphic Design',
    occupation: 'Creative Brand Designer',
    relationship_goal: 'Marriage/Life Partner',
    bio: 'Looking for a kind, creative soul who loves coffee cuppings, record stores, and random coastal hikes. I design brand systems by day and paint ceramics by night.',
    interests: ['Design', 'Ceramics', 'Vinyl Records', 'Coffee Cuppings', 'Hiking', 'Indie Rock'],
    profile_completion: 90,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    ],
    personality_type: 'Adventurous Harmonizer',
    relationship_values: ['Creative Expression', 'Honesty', 'Intellectual Growth'],
    lifestyle_habits: ['Active', 'Social drinker', 'Early bird'],
    communication_style: 'Direct & vocal'
  },
  {
    user_id: 'user_liam',
    email: 'liam@soulmatch.com',
    full_name: 'Liam Peterson',
    age: 29,
    gender: 'Male',
    location: 'Oakland, CA',
    religion: 'Spiritual',
    education: 'MS in Computer Science',
    occupation: 'Machine Learning Engineer',
    relationship_goal: 'Long-term partnership',
    bio: 'Tech enthusiast but outdoor lover at heart. I enjoy building micro-controllers for gardening and smoking brisket. Looking for someone genuine to build a warm life together.',
    interests: ['AI & Tech', 'Gardening', 'Smoking Brisket', 'Biking', 'Indie Rock', 'Board Games'],
    profile_completion: 95,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
    ],
    personality_type: 'Analytical Dreamer',
    relationship_values: ['Honesty', 'Shared Growth', 'Independence'],
    lifestyle_habits: ['Active', 'Veggie Friendly', 'Night owl'],
    communication_style: 'Reflective'
  },
  {
    user_id: 'user_chloe',
    email: 'chloe@soulmatch.com',
    full_name: 'Chloe Ross',
    age: 27,
    gender: 'Female',
    location: 'Walnut Creek, CA',
    religion: 'Other',
    education: 'PhD in Plant Biology',
    occupation: 'Conservation Botanist',
    relationship_goal: 'Marriage/Life Partner',
    bio: 'I study endangered redwoods and keep far too many succulents. Let’s trade favorite weekend recipes and go botanizing in the East Bay hills!',
    interests: ['Plants & Gardening', 'Endangered Species', 'Baking', 'Hiking', 'Cooking', 'Classical Music'],
    profile_completion: 85,
    verification_status: 'unverified',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400'],
    personality_type: 'Empathetic Creator',
    relationship_values: ['Loyalty', 'Ecology', 'Kindness'],
    lifestyle_habits: ['Early bird', 'Active', 'Non-smoker'],
    communication_style: 'Quiet & warm'
  },
  {
    user_id: 'user_marcus',
    email: 'marcus@soulmatch.com',
    full_name: 'Marcus Vance',
    age: 31,
    gender: 'Male',
    location: 'San Jose, CA',
    religion: 'Christian',
    education: 'MD in Pediatrics',
    occupation: 'Pediatric Physician',
    relationship_goal: 'Marriage/Life Partner',
    bio: 'Dedicated to helping kids be healthy. When I’m off-duty, I play jazz piano, run half-marathons, and volunteer at local animal shelters. Tell me your favorite jazz standard!',
    interests: ['Jazz Piano', 'Fitness', 'Running', 'Animal Rescue', 'Cooking', 'Volunteering'],
    profile_completion: 100,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400'
    ],
    personality_type: 'Caring Stabilizer',
    relationship_values: ['Family', 'Loyalty', 'Community Service'],
    lifestyle_habits: ['Early bird', 'Active', 'Non-smoker'],
    communication_style: 'Direct & vocal'
  },
  {
    user_id: 'user_elena',
    email: 'elena@soulmatch.com',
    full_name: 'Elena Rostova',
    age: 28,
    gender: 'Female',
    location: 'San Francisco, CA',
    religion: 'Spiritual',
    education: 'BA in Philosophy & Dance',
    occupation: 'Integrative Vinyasa Instructor',
    relationship_goal: 'Long-term partnership',
    bio: 'Deeply curious about human consciousness, breathwork, and alignment. I love tea rituals, ambient synthesizers, and dancing till the sun comes up. Let’s connect on a deeper wavelength.',
    interests: ['Yoga & Meditation', 'Dance', 'Synthesizers', 'Philosophy', 'Tea Ceremonies', 'Ambient Electronic'],
    profile_completion: 90,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'],
    personality_type: 'Mystical Grounder',
    relationship_values: ['Intellectual Growth', 'Emotional Depth', 'Self-care'],
    lifestyle_habits: ['Active', 'Sober curious', 'Early bird'],
    communication_style: 'Reflective'
  }
];

const INITIAL_MATCHES: MatchProgress[] = [
  {
    match_id: 'match_alice_liq',
    user_a: 'current_user',
    user_b: 'user_alice',
    compatibility_score: 94,
    status: 'matched',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    message_id: 'msg_1',
    sender_id: 'user_alice',
    receiver_id: 'current_user',
    message_text: 'Hey there! I see we share an absolute fascination for vinyl record stores and ceramic design. Have you been to the new cafe in Oakland?',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    read: true
  },
  {
    message_id: 'msg_2',
    sender_id: 'current_user',
    receiver_id: 'user_alice',
    message_text: "Oh absolutely! I spend way too much time hunting for deep cuts there. Let's trade recommendations sometime!",
    timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    read: true
  }
];

// Helper to interact with local storage
function loadData<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveData<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

// Local State
let usersDb = loadData<(UserProfile & { email?: string })[]>("usersDb", INITIAL_USERS);
let matchesProgressDb = loadData<MatchProgress[]>("matchesProgressDb", INITIAL_MATCHES);
let messagesDb = loadData<Message[]>("messagesDb", INITIAL_MESSAGES);
let reportsDb = loadData<UserReport[]>("reportsDb", []);
let currentUserSession = loadData<(UserProfile & { email?: string }) | null>("currentUserSession", null);
let questionnaireAnswers = loadData<Record<string, string>>("questionnaireAnswers", {
  'q1': 'Sincere, quiet, shared aesthetic growth',
  'q2': 'Mutual exploration and artistic pursuits',
  'q3': 'No pressure, deep organic connections over time',
  'q4': 'Direct communication with reflective pauses',
  'q5': 'Ambiverted: high situational flexibility'
});

function calculateBaseCompatibility(userA: UserProfile | null, userB: UserProfile): number {
  if (!userA) return 75;
  let score = 55;
  
  // common interests
  const aInterests = userA.interests || [];
  const bInterests = userB.interests || [];
  const shared = aInterests.filter(i => bInterests.includes(i));
  score += shared.length * 6;

  if (userA.location === userB.location) score += 10;
  if (userA.relationship_goal === userB.relationship_goal) score += 15;
  if (userA.communication_style === userB.communication_style) score += 8;

  return Math.min(98, Math.max(35, score));
}

export async function handleClientSideFallback(urlStr: string, init?: RequestInit): Promise<Response> {
  const url = new URL(urlStr, window.location.origin);
  const path = url.pathname;
  const method = init?.method?.toUpperCase() || "GET";
  const body = init?.body ? JSON.parse(init.body as string) : {};

  console.log(`[API MOCK FALLBACK] Intercepted ${method} ${path}`, body);

  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: { "Content-Type": "application/json" }
    });
  };

  // Helper to persist current user
  const syncCurrentUser = (user: (UserProfile & { email?: string }) | null) => {
    currentUserSession = user;
    saveData("currentUserSession", user);
    if (user) {
      const idx = usersDb.findIndex(u => u.user_id === user.user_id);
      if (idx !== -1) {
        usersDb[idx] = user;
      } else {
        usersDb.push(user);
      }
      saveData("usersDb", usersDb);
    }
  };

  if (path === "/api/session") {
    if (method === "GET") {
      return jsonResponse({
        currentUser: currentUserSession,
        subscription: currentUserSession ? {
          subscription_id: 'sub_' + currentUserSession.user_id,
          user_id: currentUserSession.user_id,
          plan: 'free',
          expiry_date: '2028-01-01'
        } : null,
        matches: matchesProgressDb,
        messages: messagesDb,
        reports: reportsDb,
        answers: questionnaireAnswers
      });
    }
    if (method === "POST") { // Session reset / logouts
      return jsonResponse({ error: "Method not supported" }, 400);
    }
  }

  if (path === "/api/auth/firebase-sync") {
    const { email, displayName, photoURL } = body;
    if (!email) {
      return jsonResponse({ error: "Email is required to sync session." }, 400);
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = usersDb.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      const newId = 'user_' + Date.now();
      user = {
        user_id: newId,
        email: cleanEmail,
        full_name: displayName || 'New Soul',
        age: 27,
        gender: 'Non-binary',
        location: 'San Francisco, CA',
        religion: 'Spiritual',
        education: 'Undergraduate Degree',
        occupation: 'Creative Specialist',
        relationship_goal: 'Long-term partnership',
        bio: `Hey! I am ${displayName || 'New Soul'}. Excited to join SoulMatch!`,
        interests: ['Hiking', 'Coffee Cuppings'],
        profile_completion: 10,
        verification_status: 'unverified',
        photo_url: photoURL || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
        photos: [photoURL || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'],
        personality_type: 'Adventurous Dreamer',
        relationship_values: ['Honesty', 'Shared Growth'],
        lifestyle_habits: ['Active'],
        communication_style: 'Direct & vocal'
      };
      usersDb.push(user);
      saveData("usersDb", usersDb);
    }

    syncCurrentUser(user);
    return jsonResponse({
      success: true,
      currentUser: user,
      subscription: {
        subscription_id: 'sub_' + user.user_id,
        user_id: user.user_id,
        plan: 'free',
        expiry_date: '2028-01-01'
      }
    });
  }

  if (path === "/api/auth/login") {
    const { email } = body;
    const cleanEmail = email?.trim().toLowerCase();
    let user = usersDb.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      // Auto-register on fallback mode for simplicity
      const newId = 'user_' + Date.now();
      user = {
        user_id: newId,
        email: cleanEmail,
        full_name: email.split('@')[0],
        age: 25,
        gender: 'Female',
        location: 'San Francisco, CA',
        religion: 'Non-religious',
        education: 'Undergraduate Degree',
        occupation: 'Creative Specialist',
        relationship_goal: 'Long-term partnership',
        bio: 'Hey! Glad to be here.',
        interests: ['Hiking'],
        profile_completion: 20,
        verification_status: 'unverified',
        photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        photos: []
      };
      usersDb.push(user);
      saveData("usersDb", usersDb);
    }

    syncCurrentUser(user);
    return jsonResponse({
      success: true,
      currentUser: user,
      subscription: {
        subscription_id: 'sub_' + user.user_id,
        user_id: user.user_id,
        plan: 'free',
        expiry_date: '2028-01-01'
      }
    });
  }

  if (path === "/api/register") {
    const fields = body;
    const email = currentUserSession?.email || fields.email || `guest_${Date.now()}@example.com`;
    const cleanEmail = email.trim().toLowerCase();
    let user = usersDb.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      user = {
        user_id: 'user_' + Date.now(),
        email: cleanEmail,
        full_name: fields.fullName || 'New User',
        age: Number(fields.age) || 24,
        gender: fields.gender || 'Female',
        location: fields.location || 'San Francisco, CA',
        religion: fields.religion || 'Non-religious',
        education: fields.education || 'Undergraduate Degree',
        occupation: fields.occupation || '',
        relationship_goal: fields.relationshipGoal || 'Long-term partnership',
        bio: fields.bio || 'Hey! Excited to join SoulMatch.',
        interests: fields.interests || ['Hiking'],
        photo_url: fields.photoUrl || '',
        photos: fields.photoUrl ? [fields.photoUrl] : [],
        profile_completion: 25,
        verification_status: 'unverified'
      };
      usersDb.push(user);
    } else {
      Object.assign(user, {
        full_name: fields.fullName || user.full_name,
        age: Number(fields.age) || user.age,
        gender: fields.gender || user.gender,
        location: fields.location || user.location,
        occupation: fields.occupation || user.occupation,
        relationship_goal: fields.relationshipGoal || user.relationship_goal,
        interests: fields.interests || user.interests,
        photo_url: fields.photoUrl || user.photo_url,
        photos: fields.photoUrl ? [fields.photoUrl] : user.photos,
        profile_completion: Math.max(user.profile_completion, 25)
      });
    }

    syncCurrentUser(user);
    return jsonResponse({ success: true, currentUser: user });
  }

  if (path === "/api/auth/logout") {
    currentUserSession = null;
    localStorage.removeItem(STORAGE_PREFIX + "currentUserSession");
    return jsonResponse({ success: true });
  }

  if (path === "/api/session/reset") {
    localStorage.removeItem(STORAGE_PREFIX + "currentUserSession");
    localStorage.removeItem(STORAGE_PREFIX + "usersDb");
    localStorage.removeItem(STORAGE_PREFIX + "matchesProgressDb");
    localStorage.removeItem(STORAGE_PREFIX + "messagesDb");
    localStorage.removeItem(STORAGE_PREFIX + "questionnaireAnswers");
    currentUserSession = null;
    usersDb = INITIAL_USERS;
    matchesProgressDb = INITIAL_MATCHES;
    messagesDb = INITIAL_MESSAGES;
    questionnaireAnswers = {
      'q1': 'Sincere, quiet, shared aesthetic growth',
      'q2': 'Mutual exploration and artistic pursuits',
      'q3': 'No pressure, deep organic connections over time',
      'q4': 'Direct communication with reflective pauses',
      'q5': 'Ambiverted: high situational flexibility'
    };
    return jsonResponse({ success: true });
  }

  if (path === "/api/profile/update") {
    if (!currentUserSession) {
      return jsonResponse({ error: "Not authenticated" }, 401);
    }
    const updates = body;
    Object.assign(currentUserSession, updates);

    // Calculate completion
    let count = 5;
    if (currentUserSession.bio) count++;
    if (currentUserSession.personality_type) count++;
    if (currentUserSession.interests && currentUserSession.interests.length > 0) count++;
    if (currentUserSession.communication_style) count++;
    if (currentUserSession.lifestyle_habits && currentUserSession.lifestyle_habits.length > 0) count++;
    currentUserSession.profile_completion = Math.min(100, Math.floor((count / 10) * 100));

    syncCurrentUser(currentUserSession);
    return jsonResponse({ success: true, currentUser: currentUserSession });
  }

  if (path === "/api/profile/delete") {
    if (!currentUserSession) {
      return jsonResponse({ error: "Not authenticated" }, 401);
    }
    const userId = currentUserSession.user_id;

    // Remove user
    usersDb = usersDb.filter(u => u.user_id !== userId);
    saveData("usersDb", usersDb);

    // Remove matches
    matchesProgressDb = matchesProgressDb.filter(m => m.user_a !== userId && m.user_b !== userId);
    saveData("matchesProgressDb", matchesProgressDb);

    // Remove messages
    messagesDb = messagesDb.filter(msg => msg.sender_id !== userId && msg.receiver_id !== userId);
    saveData("messagesDb", messagesDb);

    // Remove reports
    reportsDb = reportsDb.filter(r => r.reporter_id !== userId && r.reported_user_id !== userId);
    saveData("reportsDb", reportsDb);

    // Reset current user session
    currentUserSession = null;
    localStorage.removeItem(STORAGE_PREFIX + "currentUserSession");

    return jsonResponse({ success: true, message: "Account successfully deleted." });
  }

  if (path === "/api/compatibility/submit") {
    if (!currentUserSession) {
      return jsonResponse({ error: "Not logged in" }, 401);
    }
    const { questionId, answer } = body;
    questionnaireAnswers[questionId] = answer;
    saveData("questionnaireAnswers", questionnaireAnswers);

    if (Object.keys(questionnaireAnswers).length >= 4) {
      currentUserSession.personality_type = "Interactive Harmonizer";
      currentUserSession.lifestyle_habits = ['Balanced planner', 'Curious mind'];
    }

    syncCurrentUser(currentUserSession);
    return jsonResponse({ success: true, answers: questionnaireAnswers, currentUser: currentUserSession });
  }

  if (path === "/api/profile/verify-id") {
    if (!currentUserSession) {
      return jsonResponse({ error: "Not logged in" }, 401);
    }
    currentUserSession.verification_status = 'verified';
    syncCurrentUser(currentUserSession);
    return jsonResponse({ success: true, status: 'verified' });
  }

  if (path === "/api/discover") {
    const genderPreference = url.searchParams.get("genderPreference");
    const minAge = Number(url.searchParams.get("minAge")) || 18;
    const maxAge = Number(url.searchParams.get("maxAge")) || 99;
    const verOnly = url.searchParams.get("verOnly") === "true";

    let candidates = usersDb.filter(u => u.user_id !== currentUserSession?.user_id);

    if (genderPreference && genderPreference !== 'All') {
      candidates = candidates.filter(u => u.gender === genderPreference);
    }
    candidates = candidates.filter(u => u.age >= minAge && u.age <= maxAge);
    if (verOnly) {
      candidates = candidates.filter(u => u.verification_status === 'verified');
    }

    const recommended = candidates.map(candidate => {
      const score = calculateBaseCompatibility(currentUserSession, candidate);
      let category = "Potential Match";
      if (score >= 90) category = "Soul Resonance (Superb Match)";
      else if (score >= 80) category = "High Values Alignment";
      else if (score >= 70) category = "Warm Common Interests";

      return {
        ...candidate,
        compatibility_score: score,
        compatibility_category: category
      };
    });

    return jsonResponse({ success: true, recommended });
  }

  if (path === "/api/match/action") {
    const { targetId, action } = body;
    const matchedUser = usersDb.find(u => u.user_id === targetId);
    if (!matchedUser) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    const score = calculateBaseCompatibility(currentUserSession, matchedUser);
    let status: 'like' | 'pass' | 'matched' = action === 'like' ? 'like' : 'pass';

    if (action === 'like') {
      status = 'matched';
      messagesDb.push({
        message_id: 'msg_auto_' + Date.now(),
        sender_id: targetId,
        receiver_id: currentUserSession?.user_id || 'current_user',
        message_text: `Hey, we matched! ${score}% compatibility? Sounds like we have lots to talk about! Looking forward to chat.`,
        timestamp: new Date().toISOString(),
        read: false
      });
      saveData("messagesDb", messagesDb);
    }

    const newProgress: MatchProgress = {
      match_id: 'match_' + targetId,
      user_a: currentUserSession?.user_id || 'current_user',
      user_b: targetId,
      compatibility_score: score,
      status: status,
      created_at: new Date().toISOString()
    };

    const existingIdx = matchesProgressDb.findIndex(m => m.user_b === targetId);
    if (existingIdx > -1) {
      matchesProgressDb[existingIdx] = newProgress;
    } else {
      matchesProgressDb.push(newProgress);
    }
    saveData("matchesProgressDb", matchesProgressDb);

    return jsonResponse({
      success: true,
      progress: newProgress,
      isMatchSuccess: status === 'matched',
      matchedUser
    });
  }

  if (path === "/api/chat/send") {
    const { receiverId, text, isVoice, voiceDuration, isImage, imageUrl } = body;
    const newMessage: Message = {
      message_id: 'msg_' + Date.now(),
      sender_id: currentUserSession?.user_id || 'current_user',
      receiver_id: receiverId,
      message_text: text || '',
      timestamp: new Date().toISOString(),
      is_voice: !!isVoice,
      voice_duration: voiceDuration || 0,
      is_image: !!isImage,
      image_url: imageUrl || '',
      read: false
    };

    messagesDb.push(newMessage);
    saveData("messagesDb", messagesDb);

    // Auto reply
    setTimeout(() => {
      messagesDb.push({
        message_id: 'msg_reply_' + Date.now(),
        sender_id: receiverId,
        receiver_id: currentUserSession?.user_id || 'current_user',
        message_text: text ? `That sounds wonderful! Tell me more about that. 😄 (Fallback Simulation)` : `Thanks for sending that over! Really neat!`,
        timestamp: new Date().toISOString(),
        read: false
      });
      saveData("messagesDb", messagesDb);
    }, 3000);

    return jsonResponse({ success: true, message: newMessage });
  }

  if (path === "/api/chat/icebreaker") {
    const { matchUserId } = body;
    const matchUser = usersDb.find(u => u.user_id === matchUserId);
    return jsonResponse({
      success: true,
      icebreaker: `Hey ${matchUser?.full_name || 'there'}! I noticed we both share a quiet passion for craft aesthetics and hiking paths. If we could pack a backpack for any national park tomorrow, where would we head first? 🗺️🎒`
    });
  }

  if (path === "/api/chat/scan-safety") {
    return jsonResponse({
      success: true,
      assessment: {
        isSafe: true,
        safetyScore: 98,
        flaggedTriggerWords: [],
        warningAdvice: "Keep chat within our secure platform until you meet in a well-lit public space! (Fallback Mode)"
      }
    });
  }

  if (path === "/api/match/advisor") {
    const { matchUserId } = body;
    const matchUser = usersDb.find(u => u.user_id === matchUserId);
    const baseScore = calculateBaseCompatibility(currentUserSession, matchUser || {} as any);
    return jsonResponse({
      success: true,
      report: {
        scoreExplanation: `You and ${matchUser?.full_name || 'this match'} share a marvelous connection at ${baseScore}%. Your interests in coffee, outdoor exploration, and general artistic pursuits align closely, giving you both a fantastic conversational launchpad.`,
        greenFlags: [
          `Strong resonance on creative workspace habits and values.`,
          `Both value a structured, thoughtful communicative foundation.`,
          `Complementary relationship plans centered around growth.`
        ],
        keyStrengths: "Shared creative curiosity and love for hands-on sensory hobbies like records and kitchen bakes.",
        conversationSparkers: [
          `Invite ${matchUser?.full_name || 'them'} to trade stories from your favorite local coffee roasters!`,
          `Compare notes on your favorite indie bands of the previous year.`
        ]
      }
    });
  }

  if (path === "/api/admin/stats" || path === "/api/admin/metrics") {
    return jsonResponse({
      success: true,
      totalUsers: usersDb.length,
      verifiedUsers: usersDb.filter(u => u.verification_status === "verified").length,
      totalMatches: matchesProgressDb.filter(m => m.status === "matched").length,
      activeChats: 2,
      signupsTimeline: [
        { name: "Mon", count: 4 },
        { name: "Tue", count: 5 },
        { name: "Wed", count: usersDb.length }
      ],
      radarCategoryBreakdown: [
        { name: "Designers", value: 3 },
        { name: "ML Engineers", value: 2 },
        { name: "Yogis", value: 1 }
      ]
    });
  }

  if (path === "/api/profile/suggest-bio") {
    return jsonResponse({
      success: true,
      bio: "An adventurous, creative soul who values deep alignment. Love ceramic arts, finding cozy record shops, and heading into the redwood trails for quiet reflection. Let's make an authentic connection!"
    });
  }

  if (path === "/api/auth/send-otp") {
    return jsonResponse({ success: true, hint: "123456" });
  }

  if (path === "/api/auth/verify-otp") {
    return jsonResponse({ success: true });
  }

  if (path === "/api/subscribe") {
    return jsonResponse({ success: true });
  }

  if (path === "/api/drive/status") {
    return jsonResponse({ syncStatus: "connected", lastSyncTime: new Date().toISOString(), lastError: null });
  }

  if (path === "/api/drive/set-token") {
    return jsonResponse({ success: true });
  }

  if (path === "/api/drive/sync-push" || path === "/api/drive/sync-pull") {
    return jsonResponse({ success: true });
  }

  if (path === "/api/auth/google/url") {
    return jsonResponse({ url: "" });
  }

  return jsonResponse({ error: "Endpoint fallback not implemented" }, 404);
}
