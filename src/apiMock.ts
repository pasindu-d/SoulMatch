import { UserProfile, Subscription, MatchProgress, Message } from './types';

// Predefined seed users matching server.ts exactly
const SEED_USERS: UserProfile[] = [
  {
    user_id: 'user_alice',
    email: 'alice@soulmatch.com',
    full_name: 'Alice Chang',
    age: 26,
    gender: 'Female',
    location: 'San Francisco, CA',
    religion: 'Buddhism',
    education: 'MFA in Interactive Arts',
    occupation: 'Creative Director',
    relationship_goal: 'Long-term partnership',
    bio: 'Finding poetry in the digital age. I create immersive projection mapping, collect modular synths, and spend my Saturdays scouting local coffee cuppings. Let\'s build something sincere.',
    interests: ['Coffee Cuppings', 'Synthesizers', 'Modern Art', 'Hiking', 'Meditation', 'Cooking'],
    profile_completion: 100,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'],
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
    lifestyle_habits: ['Social drinker', 'Veggie Friendly', 'Night owl'],
    communication_style: 'Emotional & deep'
  },
  {
    user_id: 'user_liam',
    email: 'liam@soulmatch.com',
    full_name: 'Liam Peterson',
    age: 29,
    gender: 'Male',
    location: 'Oakland, CA',
    religion: 'Agnostic',
    education: 'MS in Computer Science',
    occupation: 'Machine Learning Research Engineer',
    relationship_goal: 'Long-term partnership',
    bio: 'Let\'s talk about generative models, coffee beans, and high-altitude hiking. I spend my weekends running trails in Redwood Regional Park, coding up toy models, and playing board games.',
    interests: ['Design', 'Hiking', 'Board Games', 'Vinyl Records', 'Coffee Cuppings'],
    profile_completion: 85,
    verification_status: 'verified',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'],
    personality_type: 'Inquisitive Creator',
    relationship_values: ['Creative Expression', 'Honesty', 'Shared Growth'],
    lifestyle_habits: ['Social drinker', 'Active', 'Non-smoker'],
    communication_style: 'Direct & vocal'
  }
];

// LocalStorage helpers to simulate database tables
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage save failed", err);
  }
};

// Seeding standard databases
const getLocalUsers = (): UserProfile[] => getStorageItem('sm_users', SEED_USERS);
const saveLocalUsers = (users: UserProfile[]) => setStorageItem('sm_users', users);

const getLocalSession = (): UserProfile | null => getStorageItem('sm_current_user', null);
const saveLocalSession = (user: UserProfile | null) => setStorageItem('sm_current_user', user);

const getLocalSubscription = (): Subscription | null => getStorageItem('sm_subscription', null);
const saveLocalSubscription = (sub: Subscription | null) => setStorageItem('sm_subscription', sub);

const getLocalMatches = (): MatchProgress[] => getStorageItem('sm_matches', [
  {
    match_id: 'match_alice',
    user_a: 'current_user',
    user_b: 'user_alice',
    compatibility_score: 87,
    status: 'matched',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    match_id: 'match_liam',
    user_a: 'current_user',
    user_b: 'user_liam',
    compatibility_score: 92,
    status: 'matched',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
]);
const saveLocalMatches = (matches: MatchProgress[]) => setStorageItem('sm_matches', matches);

const getLocalMessages = (): Message[] => getStorageItem('sm_messages', [
  {
    message_id: 'msg_1',
    sender_id: 'user_alice',
    receiver_id: 'current_user',
    message_text: "Hey Alex! Love your board games interest. Do you play Settlers of Catan or secret roles stuff?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: true
  },
  {
    message_id: 'msg_2',
    sender_id: 'current_user',
    receiver_id: 'user_alice',
    message_text: "Hey Alice! Yes! I am a huge enthusiast of Catan, and I have the 5-6 player expansion too. Are you competitive? 😄",
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    read: true
  },
  {
    message_id: 'msg_3',
    sender_id: 'user_alice',
    receiver_id: 'current_user',
    message_text: "Incredibly competitive! We might have to test that theory on our first coffee date! ☕",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    read: false
  },
  {
    message_id: 'msg_4',
    sender_id: 'user_liam',
    receiver_id: 'current_user',
    message_text: "Hey! Your UX design bio looks stellar. Have you checked out any design workshops in SF recently?",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: true
  }
]);
const saveLocalMessages = (messages: Message[]) => setStorageItem('sm_messages', messages);

const getLocalAnswers = (): Record<string, string> => getStorageItem('sm_answers', {
  'q1': 'Exploring outdoors, hiking, or traveling',
  'q2': 'Direct, open, and immediate conversation',
  'q5': 'Ambiverted: high situational flexibility'
});
const saveLocalAnswers = (ans: Record<string, string>) => setStorageItem('sm_answers', ans);

// Compatibility calculation matching backend
function calculateCompatibility(userA: UserProfile, userB: UserProfile): number {
  let score = 55;
  const shared = userA.interests.filter(i => userB.interests.includes(i));
  score += shared.length * 8;

  if (userA.location === userB.location) score += 5;
  if (userA.relationship_goal === userB.relationship_goal) score += 10;
  if (userA.communication_style === userB.communication_style) score += 5;

  return Math.min(99, score);
}

// Global Interceptor setup
export function initApiMock() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async function (input, init) {
    const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
    
    if (urlStr.includes('/api/')) {
      try {
        const response = await originalFetch(input, init);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            // It is indeed HTML. Route to local virtual DB.
            return await handleMockRequest(urlStr, init);
          }
          return response;
        } else {
          // If status is 404, 500 etc.
          return await handleMockRequest(urlStr, init);
        }
      } catch (err) {
        // Network errors or offline fallbacks
        return await handleMockRequest(urlStr, init);
      }
    }

    return originalFetch(input, init);
  };
}

async function handleMockRequest(url: string, init?: RequestInit): Promise<Response> {
  const method = init?.method?.toUpperCase() || 'GET';
  const body = init?.body ? JSON.parse(init.body as string) : {};
  const urlObj = new URL(url, window.location.origin);
  const path = urlObj.pathname;

  let responseData: any = { success: false };
  let status = 200;

  console.log(`[SOULMATCH INTERCEPT] Mock API ${method} ${path}`, body);

  if (path === '/api/session') {
    const currentUser = getLocalSession();
    const subscription = getLocalSubscription();
    const matches = getLocalMatches();
    responseData = {
      success: true,
      currentUser,
      subscription,
      matches
    };
  } 
  else if (path === '/api/auth/firebase-sync') {
    const { email, displayName, photoURL } = body;
    if (!email) {
      status = 400;
      responseData = { error: "Email is required to sync session." };
    } else {
      const cleanEmail = email.trim().toLowerCase();
      const users = getLocalUsers();
      let user = users.find(u => u.email?.toLowerCase() === cleanEmail);

      if (!user) {
        // Auto register
        user = {
          user_id: 'user_' + Date.now(),
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
          profile_completion: 15, // Let them go to Registration Flow to complete it!
          verification_status: 'verified', // Verified because Google is authenticated
          photo_url: photoURL || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
          photos: [photoURL || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'],
          personality_type: 'Adventurous Dreamer',
          relationship_values: ['Honesty', 'Shared Growth'],
          lifestyle_habits: ['Active'],
          communication_style: 'Direct & vocal'
        };
        users.push(user);
        saveLocalUsers(users);
      }

      saveLocalSession(user);
      const sub = {
        subscription_id: 'sub_' + user.user_id,
        user_id: user.user_id,
        plan: 'free' as const,
        expiry_date: '2028-01-01'
      };
      saveLocalSubscription(sub);

      responseData = {
        success: true,
        currentUser: user,
        subscription: sub
      };
    }
  } 
  else if (path === '/api/auth/login') {
    const { email } = body;
    const users = getLocalUsers();
    const cleanEmail = email?.trim().toLowerCase();
    const user = users.find(u => u.email?.toLowerCase() === cleanEmail);

    if (user) {
      saveLocalSession(user);
      const sub = {
        subscription_id: 'sub_' + user.user_id,
        user_id: user.user_id,
        plan: 'free' as const,
        expiry_date: '2028-01-01'
      };
      saveLocalSubscription(sub);
      responseData = { success: true, currentUser: user, subscription: sub };
    } else {
      status = 404;
      responseData = { error: "No profile found with this email. Click the Continue with Google button!" };
    }
  } 
  else if (path === '/api/auth/logout') {
    saveLocalSession(null);
    saveLocalSubscription(null);
    responseData = { success: true };
  } 
  else if (path === '/api/register') {
    const { full_name, email, age, gender, location, relationship_goal, interests, primary_photo } = body;
    const currentUser = getLocalSession();
    const users = getLocalUsers();

    const activeUser = currentUser || {
      user_id: 'user_' + Date.now(),
      email: (email || 'guest@example.com').trim().toLowerCase(),
      interests: []
    } as any;

    const updatedUser: UserProfile = {
      ...activeUser,
      full_name: full_name || activeUser.full_name || 'New Soul',
      age: Number(age) || activeUser.age || 27,
      gender: gender || activeUser.gender || 'Non-binary',
      location: location || activeUser.location || 'San Francisco, CA',
      relationship_goal: relationship_goal || activeUser.relationship_goal || 'Long-term partnership',
      interests: interests || activeUser.interests || [],
      profile_completion: 60,
      bio: `Hey, I am ${full_name || 'New Soul'}. Excited to discover genuine compatibility.`,
      photo_url: primary_photo || activeUser.photo_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
      photos: [primary_photo || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400'],
      verification_status: 'verified'
    };

    // Replace or push in users
    const userIndex = users.findIndex(u => u.user_id === updatedUser.user_id || u.email?.toLowerCase() === updatedUser.email?.toLowerCase());
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }

    saveLocalUsers(users);
    saveLocalSession(updatedUser);

    const sub = {
      subscription_id: 'sub_' + updatedUser.user_id,
      user_id: updatedUser.user_id,
      plan: 'free' as const,
      expiry_date: '2028-01-01'
    };
    saveLocalSubscription(sub);

    responseData = { success: true, currentUser: updatedUser, subscription: sub };
  } 
  else if (path === '/api/profile/update') {
    const currentUser = getLocalSession();
    if (!currentUser) {
      status = 401;
      responseData = { error: "Not logged in" };
    } else {
      const updated = { ...currentUser, ...body };
      
      let count = 5;
      if (updated.bio) count++;
      if (updated.personality_type) count++;
      if (updated.interests && updated.interests.length > 0) count++;
      if (updated.communication_style) count++;
      if (updated.lifestyle_habits && updated.lifestyle_habits.length > 0) count++;
      updated.profile_completion = Math.min(100, Math.floor((count / 10) * 100));

      const users = getLocalUsers();
      const idx = users.findIndex(u => u.user_id === updated.user_id);
      if (idx > -1) {
        users[idx] = updated;
        saveLocalUsers(users);
      }
      saveLocalSession(updated);
      responseData = { success: true, currentUser: updated };
    }
  } 
  else if (path === '/api/compatibility/submit') {
    const currentUser = getLocalSession();
    if (!currentUser) {
      status = 401;
      responseData = { error: "Not logged in" };
    } else {
      const { questionId, answer } = body;
      const currentAnswers = getLocalAnswers();
      currentAnswers[questionId] = answer;
      saveLocalAnswers(currentAnswers);

      if (Object.keys(currentAnswers).length >= 4) {
        currentUser.personality_type = "Interactive Harmonizer";
        currentUser.lifestyle_habits = ['Balanced planner', 'Curious mind'];
      }

      const users = getLocalUsers();
      const idx = users.findIndex(u => u.user_id === currentUser.user_id);
      if (idx > -1) {
        users[idx] = currentUser;
        saveLocalUsers(users);
      }
      saveLocalSession(currentUser);

      responseData = { success: true, answers: currentAnswers, currentUser };
    }
  }
  else if (path === '/api/profile/suggest-bio') {
    const { interests, occupation, goal } = body;
    responseData = {
      success: true,
      bio: `Hey, I work as a ${occupation || "Creative Specialist"}. I deeply value ${goal || "finding a lifetime partner"}. You'll usually find me pursuing my favorite interests of ${interests ? interests.slice(0,3).join(" and ") : "quality discussion"}. Let's chat and grab a warm cup of coffee!`
    };
  }
  else if (path === '/api/profile/verify-id') {
    const currentUser = getLocalSession();
    if (currentUser) {
      currentUser.verification_status = 'verified';
      const users = getLocalUsers();
      const idx = users.findIndex(u => u.user_id === currentUser.user_id);
      if (idx > -1) {
        users[idx].verification_status = 'verified';
        saveLocalUsers(users);
      }
      saveLocalSession(currentUser);
      responseData = { success: true, status: 'verified' };
    } else {
      status = 401;
      responseData = { error: "Not logged in" };
    }
  }
  else if (path === '/api/discover') {
    const currentUser = getLocalSession();
    if (!currentUser) {
      responseData = { success: true, recommended: [] };
    } else {
      const users = getLocalUsers();
      const matches = getLocalMatches();
      const params = urlObj.searchParams;
      const genderPreference = params.get('genderPreference');
      const minAge = Number(params.get('minAge') || '0');
      const maxAge = Number(params.get('maxAge') || '100');
      const verOnly = params.get('verOnly') === 'true';

      let candidates = users.filter(u => u.user_id !== currentUser.user_id);
      if (genderPreference && genderPreference !== 'All') {
        candidates = candidates.filter(u => u.gender === genderPreference);
      }
      if (minAge) {
        candidates = candidates.filter(u => u.age >= minAge);
      }
      if (maxAge) {
        candidates = candidates.filter(u => u.age <= maxAge);
      }
      if (verOnly) {
        candidates = candidates.filter(u => u.verification_status === 'verified');
      }

      const recommended = candidates.map(user => {
        const score = calculateCompatibility(currentUser, user);
        let category = "Potential Match";
        if (score >= 90) category = "Excellent Match";
        else if (score >= 80) category = "Very Good Match";
        else if (score >= 70) category = "Good Match";

        return {
          ...user,
          compatibility_score: score,
          compatibility_category: category,
          current_status: matches.find(m => m.user_b === user.user_id)?.status || 'none'
        };
      });

      recommended.sort((a, b) => b.compatibility_score - a.compatibility_score);
      responseData = { success: true, recommended };
    }
  }
  else if (path === '/api/match/action') {
    const { targetId, action } = body;
    const currentUser = getLocalSession();
    const users = getLocalUsers();
    const matches = getLocalMatches();
    const messages = getLocalMessages();

    const matchedUser = users.find(u => u.user_id === targetId);
    if (!matchedUser) {
      status = 404;
      responseData = { error: "User not found" };
    } else {
      const score = calculateCompatibility(currentUser || {} as any, matchedUser);
      let progressStatus: 'like' | 'pass' | 'matched' = action === 'like' ? 'matched' : 'pass';

      if (action === 'like') {
        messages.push({
          message_id: 'msg_auto_' + Date.now(),
          sender_id: targetId,
          receiver_id: currentUser?.user_id || 'current_user',
          message_text: `Hey, we matched! ${score}% compatibility? Sounds like we have lots to talk about! Looking forward to chatting.`,
          timestamp: new Date().toISOString(),
          read: false
        });
        saveLocalMessages(messages);
      }

      const newMatch: MatchProgress = {
        match_id: 'match_' + targetId,
        user_a: currentUser?.user_id || 'current_user',
        user_b: targetId,
        compatibility_score: score,
        status: progressStatus,
        created_at: new Date().toISOString()
      };

      const existingIndex = matches.findIndex(m => m.user_b === targetId);
      if (existingIndex > -1) {
        matches[existingIndex] = newMatch;
      } else {
        matches.push(newMatch);
      }
      saveLocalMatches(matches);

      responseData = { success: true, matches };
    }
  }
  else if (path === '/api/chat/messages') {
    const currentUser = getLocalSession();
    const messages = getLocalMessages();
    const currentId = currentUser?.user_id || 'current_user';

    if (method === 'GET') {
      const userMessages = messages.filter(m => m.sender_id === currentId || m.receiver_id === currentId);
      responseData = { success: true, messages: userMessages };
    } else if (method === 'POST') {
      const { receiverId, messageText } = body;
      const newMessage: Message = {
        message_id: 'msg_' + Date.now(),
        sender_id: currentId,
        receiver_id: receiverId,
        message_text: messageText,
        timestamp: new Date().toISOString(),
        read: false
      };
      messages.push(newMessage);
      saveLocalMessages(messages);
      responseData = { success: true, message: newMessage };
    }
  }
  else if (path === '/api/subscription/upgrade') {
    const currentUser = getLocalSession();
    if (currentUser) {
      const sub = {
        subscription_id: 'sub_' + currentUser.user_id,
        user_id: currentUser.user_id,
        plan: body.plan || 'premium',
        expiry_date: '2028-12-31'
      };
      saveLocalSubscription(sub);
      responseData = { success: true, subscription: sub };
    } else {
      status = 401;
      responseData = { error: "Not logged in" };
    }
  }
  else if (path === '/api/session/reset') {
    localStorage.removeItem('sm_users');
    localStorage.removeItem('sm_current_user');
    localStorage.removeItem('sm_subscription');
    localStorage.removeItem('sm_matches');
    localStorage.removeItem('sm_messages');
    localStorage.removeItem('sm_answers');
    responseData = { success: true };
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
