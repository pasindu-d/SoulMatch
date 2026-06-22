var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json());
var PORT = 3e3;
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
  try {
    ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    console.log("Gemini SDK successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini SDK:", err);
  }
}
var usersDb = [
  {
    user_id: "user_alice",
    email: "alice@soulmatch.com",
    full_name: "Alice Chang",
    age: 26,
    gender: "Female",
    location: "San Francisco, CA",
    religion: "Non-religious",
    education: "BFA in Communications & Graphic Design",
    occupation: "Creative Brand Designer",
    relationship_goal: "Marriage/Life Partner",
    bio: "Looking for a kind, creative soul who loves coffee cuppings, record stores, and random coastal hikes. I design brand systems by day and paint ceramics by night.",
    interests: ["Design", "Ceramics", "Vinyl Records", "Coffee Cuppings", "Hiking", "Indie Rock"],
    profile_completion: 90,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    ],
    personality_type: "Adventurous Harmonizer",
    relationship_values: ["Creative Expression", "Honesty", "Intellectual Growth"],
    lifestyle_habits: ["Active", "Social drinker", "Early bird"],
    communication_style: "Direct & vocal"
  },
  {
    user_id: "user_liam",
    email: "liam@soulmatch.com",
    full_name: "Liam Peterson",
    age: 29,
    gender: "Male",
    location: "Oakland, CA",
    religion: "Spiritual",
    education: "MS in Computer Science",
    occupation: "Machine Learning Engineer",
    relationship_goal: "Long-term partnership",
    bio: "Tech enthusiast but outdoor lover at heart. I enjoy building micro-controllers for gardening and smoking brisket. Looking for someone genuine to build a warm life together.",
    interests: ["AI & Tech", "Gardening", "Smoking Brisket", "Biking", "Indie Rock", "Board Games"],
    profile_completion: 95,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
    ],
    personality_type: "Analytical Dreamer",
    relationship_values: ["Honesty", "Shared Growth", "Independence"],
    lifestyle_habits: ["Active", "Veggie Friendly", "Night owl"],
    communication_style: "Reflective"
  },
  {
    user_id: "user_chloe",
    email: "chloe@soulmatch.com",
    full_name: "Chloe Ross",
    age: 27,
    gender: "Female",
    location: "Walnut Creek, CA",
    religion: "Other",
    education: "PhD in Plant Biology",
    occupation: "Conservation Botanist",
    relationship_goal: "Marriage/Life Partner",
    bio: "I study endangered redwoods and keep far too many succulents. Let\u2019s trade favorite weekend recipes and go botanizing in the East Bay hills!",
    interests: ["Plants & Gardening", "Endangered Species", "Baking", "Hiking", "Cooking", "Classical Music"],
    profile_completion: 85,
    verification_status: "unverified",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"],
    personality_type: "Empathetic Creator",
    relationship_values: ["Loyalty", "Ecology", "Kindness"],
    lifestyle_habits: ["Early bird", "Active", "Non-smoker"],
    communication_style: "Quiet & warm"
  },
  {
    user_id: "user_marcus",
    email: "marcus@soulmatch.com",
    full_name: "Marcus Vance",
    age: 31,
    gender: "Male",
    location: "San Jose, CA",
    religion: "Christian",
    education: "MD in Pediatrics",
    occupation: "Pediatric Physician",
    relationship_goal: "Marriage/Life Partner",
    bio: "Dedicated to helping kids be healthy. When I\u2019m off-duty, I play jazz piano, run half-marathons, and volunteer at local animal shelters. Tell me your favorite jazz standard!",
    interests: ["Jazz Piano", "Fitness", "Running", "Animal Rescue", "Cooking", "Volunteering"],
    profile_completion: 100,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400"
    ],
    personality_type: "Caring Stabilizer",
    relationship_values: ["Family", "Loyalty", "Community Service"],
    lifestyle_habits: ["Early bird", "Active", "Non-smoker"],
    communication_style: "Direct & vocal"
  },
  {
    user_id: "user_elena",
    email: "elena@soulmatch.com",
    full_name: "Elena Rostova",
    age: 28,
    gender: "Female",
    location: "San Francisco, CA",
    religion: "Spiritual",
    education: "BA in Philosophy & Dance",
    occupation: "Integrative Vinyasa Instructor",
    relationship_goal: "Long-term partnership",
    bio: "Deeply curious about human consciousness, breathwork, and alignment. I love tea rituals, ambient synthesizers, and dancing till the sun comes up. Let\u2019s connect on a deeper wavelength.",
    interests: ["Yoga & Meditation", "Dance", "Synthesizers", "Philosophy", "Tea Ceremonies", "Ambient Electronic"],
    profile_completion: 90,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"],
    personality_type: "Mystical Grounder",
    relationship_values: ["Intellectual Growth", "Emotional Depth", "Self-care"],
    lifestyle_habits: ["Social drinker", "Veggie Friendly", "Night owl"],
    communication_style: "Emotional & deep"
  },
  {
    user_id: "current_user",
    email: "alex@soulmatch.com",
    full_name: "Alex Mercer",
    age: 27,
    gender: "Non-binary",
    location: "San Francisco, CA",
    religion: "Spiritual",
    education: "BS in UX Design",
    occupation: "Product Designer",
    relationship_goal: "Long-term partnership",
    bio: "Hey! I love designing intuitive software, attending craft breweries, collecting retro board games, and going on city bouldering trips. Looking for a genuine connection to share adventures!",
    interests: ["Design", "Hiking", "Board Games", "Vinyl Records", "Coffee Cuppings"],
    profile_completion: 75,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"],
    personality_type: "Inquisitive Creator",
    relationship_values: ["Creative Expression", "Honesty", "Shared Growth"],
    lifestyle_habits: ["Social drinker", "Active", "Non-smoker"],
    communication_style: "Direct & vocal"
  }
];
var currentUserSession = null;
var currentSubscription = null;
var matchesProgressDb = [
  // pre-liked or pre-matched options
  {
    match_id: "match_alice",
    user_a: "current_user",
    user_b: "user_alice",
    compatibility_score: 87,
    status: "matched",
    created_at: new Date(Date.now() - 36e5 * 24).toISOString()
  },
  {
    match_id: "match_liam",
    user_a: "current_user",
    user_b: "user_liam",
    compatibility_score: 92,
    status: "matched",
    created_at: new Date(Date.now() - 36e5 * 4).toISOString()
  }
];
var messagesDb = [
  {
    message_id: "msg_1",
    sender_id: "user_alice",
    receiver_id: "current_user",
    message_text: "Hey Alex! Love your board games interest. Do you play Settlers of Catan or secret roles stuff?",
    timestamp: new Date(Date.now() - 36e5 * 2).toISOString(),
    read: true
  },
  {
    message_id: "msg_2",
    sender_id: "current_user",
    receiver_id: "user_alice",
    message_text: "Hey Alice! Yes! I am a huge enthusiast of Catan, and I have the 5-6 player expansion too. Are you competitive? \u{1F604}",
    timestamp: new Date(Date.now() - 36e5 * 1.8).toISOString(),
    read: true
  },
  {
    message_id: "msg_3",
    sender_id: "user_alice",
    receiver_id: "current_user",
    message_text: "Incredibly competitive! We might have to test that theory on our first coffee date! \u2615",
    timestamp: new Date(Date.now() - 36e5 * 1.5).toISOString(),
    read: false
  },
  {
    message_id: "msg_4",
    sender_id: "user_liam",
    receiver_id: "current_user",
    message_text: "Hey! Your UX design bio looks stellar. Have you checked out any design workshops in SF recently?",
    timestamp: new Date(Date.now() - 36e5 * 3).toISOString(),
    read: true
  }
];
var reportsDb = [];
var questionnaireAnswers = {
  "q1": "Exploring outdoors, hiking, or traveling",
  "q2": "Direct, open, and immediate conversation",
  "q5": "Ambiverted: high situational flexibility"
};
function calculateBaseCompatibility(userA, userB) {
  let score = 50;
  const shared = userA.interests.filter((i) => userB.interests.includes(i));
  score += shared.length * 8;
  if (userA.relationship_goal === userB.relationship_goal) {
    score += 15;
  } else if ((userA.relationship_goal.includes("Long-term") || userA.relationship_goal.includes("Marriage")) && (userB.relationship_goal.includes("Long-term") || userB.relationship_goal.includes("Marriage"))) {
    score += 10;
  }
  const valuesA = userA.relationship_values || [];
  const valuesB = userB.relationship_values || [];
  const sharedValues = valuesA.filter((v) => valuesB.includes(v));
  score += sharedValues.length * 6;
  return Math.min(99, Math.max(45, score));
}
app.get("/api/session", (req, res) => {
  res.json({
    currentUser: currentUserSession,
    subscription: currentSubscription,
    matches: matchesProgressDb,
    messages: messagesDb,
    reports: reportsDb,
    answers: questionnaireAnswers
  });
});
app.post("/api/session/reset", (req, res) => {
  currentUserSession = {
    user_id: "current_user",
    full_name: "Alex Mercer",
    age: 27,
    gender: "Non-binary",
    location: "San Francisco, CA",
    religion: "Spiritual",
    education: "BS in UX Design",
    occupation: "Product Designer",
    relationship_goal: "Long-term partnership",
    bio: "Hey! I love designing intuitive software, attending craft breweries, collecting retro board games, and going on city bouldering trips. Looking for a genuine connection to share adventures!",
    interests: ["Design", "Hiking", "Board Games", "Vinyl Records", "Coffee Cuppings"],
    profile_completion: 75,
    verification_status: "verified",
    photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"],
    personality_type: "Inquisitive Creator",
    relationship_values: ["Creative Expression", "Honesty", "Shared Growth"],
    lifestyle_habits: ["Social drinker", "Active", "Non-smoker"],
    communication_style: "Direct & vocal"
  };
  currentSubscription = {
    subscription_id: "sub_current",
    user_id: "current_user",
    plan: "free",
    expiry_date: "2027-01-01"
  };
  matchesProgressDb = [
    {
      match_id: "match_alice",
      user_a: "current_user",
      user_b: "user_alice",
      compatibility_score: 87,
      status: "matched",
      created_at: new Date(Date.now() - 36e5 * 24).toISOString()
    },
    {
      match_id: "match_liam",
      user_a: "current_user",
      user_b: "user_liam",
      compatibility_score: 92,
      status: "matched",
      created_at: new Date(Date.now() - 36e5 * 4).toISOString()
    }
  ];
  messagesDb = [
    {
      message_id: "msg_1",
      sender_id: "user_alice",
      receiver_id: "current_user",
      message_text: "Hey Alex! Love your board games interest. Do you play Settlers of Catan or secret roles stuff?",
      timestamp: new Date(Date.now() - 36e5 * 2).toISOString(),
      read: true
    },
    {
      message_id: "msg_2",
      sender_id: "current_user",
      receiver_id: "user_alice",
      message_text: "Hey Alice! Yes! I am a huge enthusiast of Catan, and I have the 5-6 player expansion too. Are you competitive? \u{1F604}",
      timestamp: new Date(Date.now() - 36e5 * 1.8).toISOString(),
      read: true
    },
    {
      message_id: "msg_3",
      sender_id: "user_alice",
      receiver_id: "current_user",
      message_text: "Incredibly competitive! We might have to test that theory on our first coffee date! \u2615",
      timestamp: new Date(Date.now() - 36e5 * 1.5).toISOString(),
      read: false
    },
    {
      message_id: "msg_4",
      sender_id: "user_liam",
      receiver_id: "current_user",
      message_text: "Hey! Your UX design bio looks stellar. Have you checked out any design workshops in SF recently?",
      timestamp: new Date(Date.now() - 36e5 * 3).toISOString(),
      read: true
    }
  ];
  questionnaireAnswers = {
    "q1": "Exploring outdoors, hiking, or traveling",
    "q2": "Direct, open, and immediate conversation",
    "q5": "Ambiverted: high situational flexibility"
  };
  reportsDb = [];
  res.json({ success: true });
});
var activeOtps = /* @__PURE__ */ new Map();
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const user = usersDb.find((u) => u.email?.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: "No profile found with this email. Please register first, or type a preset email like alice@soulmatch.com to demo!" });
  }
  const expectedPassword = user.password || "password123";
  if (password !== expectedPassword) {
    return res.status(401).json({ error: "Invalid password. Note: preset demo accounts (e.g. alice@soulmatch.com) utilize 'password123'." });
  }
  currentUserSession = user;
  currentSubscription = {
    subscription_id: "sub_" + user.user_id,
    user_id: user.user_id,
    plan: "free",
    expiry_date: "2028-01-01"
  };
  res.json({ success: true, currentUser: currentUserSession, subscription: currentSubscription });
});
app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required to register." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const duplicated = usersDb.some((u) => u.email?.toLowerCase() === cleanEmail);
  if (duplicated) {
    return res.status(400).json({ error: "An account with this email address already exist. Please sign in instead." });
  }
  const otpCode = Math.floor(1e5 + Math.random() * 9e5).toString();
  activeOtps.set(cleanEmail, otpCode);
  console.log(`[SOULMATCH TELEMETRY] Sent simulated email verification OTP code: ${otpCode} to: ${cleanEmail}`);
  res.json({
    success: true,
    otp: otpCode,
    message: "Verifying email simulation initialized successfully. Retrieve your 6-digit code!"
  });
});
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP code are required to verify." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const validOtp = activeOtps.get(cleanEmail);
  if (!validOtp || validOtp !== otp.trim()) {
    return res.status(400).json({ error: "Invalid verification code. Please input the correct simulated 6-digit code." });
  }
  res.json({ success: true, message: "Email code validated successfully!" });
});
app.post("/api/auth/logout", (req, res) => {
  currentUserSession = null;
  currentSubscription = null;
  res.json({ success: true });
});
app.post("/api/register", (req, res) => {
  const { full_name, email, password, age, gender, location, relationship_goal, interests, primary_photo } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email address is required to register." });
  }
  if (!password) {
    return res.status(400).json({ error: "Password setting is required to protect your new profile." });
  }
  const cleanEmail = email.trim().toLowerCase();
  const existingUser = usersDb.find((u) => u.email?.toLowerCase() === cleanEmail);
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email address already exists. Please login instead." });
  }
  const newId = "user_" + Date.now();
  const newUser = {
    user_id: newId,
    email: cleanEmail,
    password,
    full_name: full_name || "New Soul",
    age: Number(age) || 27,
    gender: gender || "Non-binary",
    location: location || "San Francisco, CA",
    religion: "Spiritual",
    education: "Undergraduate Degree",
    occupation: "Creative Specialist",
    relationship_goal: relationship_goal || "Long-term partnership",
    bio: `Hey, I am ${full_name || "Alex"}. New to SoulMatch but happy to be here. Reaching out with interests in ${interests ? interests.join(", ") : "meaningful chats"}.`,
    interests: interests || ["Hiking", "Coffee Cuppings"],
    profile_completion: 40,
    verification_status: "unverified",
    photo_url: primary_photo || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    photos: [primary_photo || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400"],
    personality_type: "Adventurous Dreamer",
    relationship_values: ["Honesty", "Shared Growth"],
    lifestyle_habits: ["Active"],
    communication_style: "Direct & vocal"
  };
  usersDb.push(newUser);
  currentUserSession = newUser;
  activeOtps.delete(cleanEmail);
  currentSubscription = {
    subscription_id: "sub_" + newUser.user_id,
    user_id: newUser.user_id,
    plan: "free",
    expiry_date: "2028-01-01"
  };
  res.json({ success: true, currentUser: currentUserSession, subscription: currentSubscription });
});
app.post("/api/profile/update", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "Not authenticated. Please log in first." });
  }
  const updates = req.body;
  currentUserSession = {
    ...currentUserSession,
    ...updates
  };
  const idx = usersDb.findIndex((u) => u.user_id === currentUserSession?.user_id);
  if (idx !== -1) {
    usersDb[idx] = {
      ...usersDb[idx],
      ...updates
    };
  }
  let count = 5;
  if (currentUserSession.bio) count++;
  if (currentUserSession.personality_type) count++;
  if (currentUserSession.interests.length > 0) count++;
  if (currentUserSession.communication_style) count++;
  if (currentUserSession.lifestyle_habits && currentUserSession.lifestyle_habits.length > 0) count++;
  currentUserSession.profile_completion = Math.min(100, Math.floor(count / 10 * 100));
  if (idx !== -1) {
    usersDb[idx].profile_completion = currentUserSession.profile_completion;
  }
  res.json({ success: true, currentUser: currentUserSession });
});
app.post("/api/compatibility/submit", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "Not logged in." });
  }
  const { questionId, answer } = req.body;
  questionnaireAnswers[questionId] = answer;
  if (Object.keys(questionnaireAnswers).length >= 4) {
    currentUserSession.personality_type = "Interactive Harmonizer";
    currentUserSession.lifestyle_habits = ["Balanced planner", "Curious mind"];
  }
  const idx = usersDb.findIndex((u) => u.user_id === currentUserSession?.user_id);
  if (idx !== -1) {
    usersDb[idx] = {
      ...usersDb[idx],
      personality_type: currentUserSession.personality_type,
      lifestyle_habits: currentUserSession.lifestyle_habits
    };
  }
  res.json({ success: true, answers: questionnaireAnswers, currentUser: currentUserSession });
});
app.post("/api/profile/suggest-bio", async (req, res) => {
  const { interests, occupation, goal } = req.body;
  const prompt = `Write a charming, authentic, and high-fidelity dating profile biography (approx. 3-4 sentences) for a ${occupation || "Creative professional"} whose relationship goal is "${goal || "finding a life partner"}".
Their active interests include: ${interests ? interests.join(", ") : "reading, cooking, photography"}.
Make the tone warm, welcoming, deeply human, smart, and free from typical AI clich\xE9 sentence structures (like 'dynamic companion', 'looking for adventure', 'fluent in sarcasm'). Offer a beautiful hook about their interests. Output only the bio prose directly, no extra introductory words.`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ success: true, bio: response.text?.trim() });
    } catch (err) {
      console.error("Gemini bio generate error:", err);
      res.json({
        success: true,
        bio: `Hey, I work as a ${occupation || "Creative Specialist"}. I deeply value ${goal || "finding a lifetime partner"}. You'll usually find me pursuing my favorite interests of ${interests ? interests.slice(0, 3).join(" and ") : "quality discussion"}. Let's chat and grab a warm cup of coffee!`
      });
    }
  } else {
    res.json({
      success: true,
      bio: `Hi there! As a ${occupation || "Product Designer"}, I enjoy creating beautiful solutions and sharing smiles. I am focused on a genuine relationship aiming for ${goal || "a long-term partnership"}. Let\u2019s connect if you also enjoy ${interests ? interests.slice(0, 3).join(" and ") : "thoughtful conversations"} and weekend explorations!`
    });
  }
});
app.post("/api/profile/verify-id", (req, res) => {
  if (!currentUserSession) {
    return res.status(401).json({ error: "Please log in first." });
  }
  currentUserSession.verification_status = "verified";
  const idx = usersDb.findIndex((u) => u.user_id === currentUserSession?.user_id);
  if (idx !== -1) {
    usersDb[idx].verification_status = "verified";
  }
  res.json({ success: true, status: "verified" });
});
app.get("/api/discover", (req, res) => {
  if (!currentUserSession) {
    return res.json({ success: true, recommended: [] });
  }
  const { genderPreference, minAge, maxAge, verOnly } = req.query;
  let candidates = usersDb.filter((u) => u.user_id !== currentUserSession.user_id);
  if (genderPreference && genderPreference !== "All") {
    candidates = candidates.filter((u) => u.gender === genderPreference);
  }
  if (minAge) {
    candidates = candidates.filter((u) => u.age >= Number(minAge));
  }
  if (maxAge) {
    candidates = candidates.filter((u) => u.age <= Number(maxAge));
  }
  if (verOnly === "true") {
    candidates = candidates.filter((u) => u.verification_status === "verified");
  }
  const recommended = candidates.map((user) => {
    const score = calculateBaseCompatibility(currentUserSession, user);
    let category = "Potential Match";
    if (score >= 90) category = "Excellent Match";
    else if (score >= 80) category = "Very Good Match";
    else if (score >= 70) category = "Good Match";
    return {
      ...user,
      compatibility_score: score,
      compatibility_category: category,
      // Check if swiped before or already matched
      current_status: matchesProgressDb.find((m) => m.user_b === user.user_id)?.status || "none"
    };
  });
  recommended.sort((a, b) => b.compatibility_score - a.compatibility_score);
  res.json({ success: true, recommended });
});
app.post("/api/match/action", (req, res) => {
  const { targetId, action } = req.body;
  const existingIndex = matchesProgressDb.findIndex((m) => m.user_b === targetId);
  const matchedUser = usersDb.find((u) => u.user_id === targetId);
  if (!matchedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  const score = calculateBaseCompatibility(currentUserSession, matchedUser);
  let status = action === "like" ? "like" : "pass";
  if (action === "like") {
    status = "matched";
    messagesDb.push({
      message_id: "msg_auto_" + Date.now(),
      sender_id: targetId,
      receiver_id: "current_user",
      message_text: `Hey, we matched! ${score}% compatibility? Sounds like we have lots to talk about! Looking forward to chat.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    });
  }
  const newProgress = {
    match_id: "match_" + targetId,
    user_a: "current_user",
    user_b: targetId,
    compatibility_score: score,
    status,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (existingIndex > -1) {
    matchesProgressDb[existingIndex] = newProgress;
  } else {
    matchesProgressDb.push(newProgress);
  }
  res.json({
    success: true,
    progress: newProgress,
    isMatchSuccess: status === "matched",
    matchedUser
  });
});
app.post("/api/match/advisor", async (req, res) => {
  const { matchUserId } = req.body;
  const matchUser = usersDb.find((u) => u.user_id === matchUserId);
  if (!matchUser) {
    return res.status(404).json({ error: "Match user details not found" });
  }
  const baseScore = calculateBaseCompatibility(currentUserSession, matchUser);
  const prompt = `You are SoulMatch AI Match Advisor, a sophisticated, warm, and highly supportive relationship compatibilities counselor.
Analyze the connection between:
User A (CurrentUser): Age ${currentUserSession.age}, Location ${currentUserSession.location}, Goal: ${currentUserSession.relationship_goal}, Bio: "${currentUserSession.bio}", Interests: ${currentUserSession.interests.join(", ")}.
User B (Match): Full Name ${matchUser.full_name}, Age ${matchUser.age}, Occupation ${matchUser.occupation}, Goal: ${matchUser.relationship_goal}, Bio: "${matchUser.bio}", Interests: ${matchUser.interests.join(", ")}.

The base compatibility calculated is ${baseScore}%. This match is categorized as having excellent common themes.
Provide a gorgeous compatibility report in neat JSON format with these exact properties:
- scoreExplanation: 2-3 sentences explaining exactly why they connect (interests, occupation, values, location).
- greenFlags: an array of 3 highly specific positive signs/strengths for their pairing.
- keyStrengths: brief summary of their emotional or mental alignment.
- conversationSparkers: an array of 2 beautiful dating ideas or conversational icebreaker questions custom to their shared interests.

Ensure the response is strictly JSON so it can be parsed. Do not wrap in markdown \`\`\`json block. Just raw JSON.`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, report: parsed });
    } catch (err) {
      console.error("Gemini advisor error:", err);
      res.json({
        success: true,
        report: {
          scoreExplanation: `You and ${matchUser.full_name} hold a lovely alignment in design and outdoor recreation. Your mutual focus on quality connections and community brings a high level of potential security.`,
          greenFlags: [
            "Shared values in creative pursuits and hiking outdoors.",
            "Complementary communication attitudes that focus on warmth.",
            "Similar developmental goals for long-term integration."
          ],
          keyStrengths: "Great synchronization of professional aspirations and social bouldering activities.",
          conversationSparkers: [
            `Ask ${matchUser.full_name} about their top trail in the East Bay or favorite ceramics color palette!`,
            `Discuss how you both balance demanding creative careers with quiet weekend tea dates.`
          ]
        }
      });
    }
  } else {
    res.json({
      success: true,
      report: {
        scoreExplanation: `You and ${matchUser.full_name} share a marvelous connection at ${baseScore}%. Your interests in coffee, outdoor exploration, and general artistic pursuits align closely, giving you both a fantastic conversational launchpad.`,
        greenFlags: [
          `Strong resonance on creative workspace habits and values.`,
          `Both value a structured, thoughtful communicative foundation.`,
          `Complementary relationship plans centered around growth.`
        ],
        keyStrengths: "Shared creative curiosity and love for hands-on sensory hobbies like records and kitchen bakes.",
        conversationSparkers: [
          `Invite ${matchUser.full_name} to trade stories from your favorite local coffee roasters!`,
          `Compare notes on your favorite indie bands of the previous year.`
        ]
      }
    });
  }
});
app.post("/api/chat/send", (req, res) => {
  const { receiverId, text, isVoice, voiceDuration, isImage, imageUrl } = req.body;
  const newMessage = {
    message_id: "msg_" + Date.now(),
    sender_id: "current_user",
    receiver_id: receiverId,
    message_text: text || "",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    is_voice: !!isVoice,
    voice_duration: voiceDuration || 0,
    is_image: !!isImage,
    image_url: imageUrl || "",
    read: false
  };
  messagesDb.push(newMessage);
  setTimeout(() => {
    const replyingUser = usersDb.find((u) => u.user_id === receiverId);
    const replyText = text ? `That sounds wonderful! Tell me more about that. \u{1F604}` : `Thanks for sending that over! Really neat!`;
    messagesDb.push({
      message_id: "msg_reply_" + Date.now(),
      sender_id: receiverId,
      receiver_id: "current_user",
      message_text: replyText,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    });
  }, 3500);
  res.json({ success: true, message: newMessage });
});
app.post("/api/chat/icebreaker", async (req, res) => {
  const { matchUserId } = req.body;
  const matchUser = usersDb.find((u) => u.user_id === matchUserId);
  if (!matchUser) {
    return res.status(404).json({ error: "Match user details not found" });
  }
  const prompt = `Create a playful, witty, and personalized opening icebreaker question (maximum 2 sentences) written by Alex for their dating match ${matchUser.full_name}.
Alex likes: ${currentUserSession.interests.join(", ")}.
${matchUser.full_name} likes: ${matchUser.interests.join(", ")}.
Avoid generic openers like 'How is your Sunday going?'. Craft something smart that references their shared interests, for example design, board games, or records. Output only the prompt message directly, no quotations, no header words.`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ success: true, icebreaker: response.text?.trim() });
    } catch (err) {
      console.error("Gemini icebreaker error:", err);
      res.json({ success: true, icebreaker: `Hey ${matchUser.full_name}! I saw we both love graphic creative patterns and music records. What is your go-to espresso order or record to spin on a cozy Sunday morning? \u2615\u{1F4BF}` });
    }
  } else {
    res.json({
      success: true,
      icebreaker: `Hey ${matchUser.full_name}! I noticed we both share a quiet passion for craft aesthetics and hiking paths. If we could pack a backpack for any national park tomorrow, where would we head first? \u{1F5FA}\uFE0F\u{1F392}`
    });
  }
});
app.post("/api/chat/scan-safety", async (req, res) => {
  const { matchUserId } = req.body;
  const conversation = messagesDb.filter(
    (m) => m.sender_id === "current_user" && m.receiver_id === matchUserId || m.sender_id === matchUserId && m.receiver_id === "current_user"
  );
  const dialogText = conversation.map((m) => `${m.sender_id === "current_user" ? "Me" : "Match"}: ${m.message_text}`).join("\n");
  const prompt = `You are a sophisticated Real-Time AI Safety Monitor for the SoulMatch dating app.
Scan the following ongoing dating chat dialog for signs of phishing, financial scams, crypto scams, request for money, offline meetup dangers, or hostile behavior/harassment.
---
${dialogText || "Match: Let's meetup later at a very remote dark alleyway without anyone knowing."}
---

Provide a security assessment in strict JSON with these properties:
- isSafe: boolean indicating if the conversation appears safe and respectful.
- safetyScore: a score from 0 to 100 representing confidence in security.
- flaggedTriggerWords: string array of suspicious keywords detected (return empty if safe).
- warningAdvice: a short helpful direct safety prompt for the user (e.g. 'Never share banking info').

Format only as raw JSON. Do not wrap in markdown tags.`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const result = JSON.parse(response.text || "{}");
      res.json({ success: true, assessment: result });
    } catch (err) {
      console.error("Gemini Safety Scan error:", err);
      res.json({
        success: true,
        assessment: { isSafe: true, safetyScore: 98, flaggedTriggerWords: [], warningAdvice: "Keep chat within our secure platform until you meet in a well-lit public space!" }
      });
    }
  } else {
    const lowerDialog = dialogText.toLowerCase();
    const warns = [];
    let isSafe = true;
    let score = 95;
    if (lowerDialog.includes("money") || lowerDialog.includes("cash") || lowerDialog.includes("wire") || lowerDialog.includes("bitcoin") || lowerDialog.includes("crypto")) {
      warns.push("financial keywords");
      isSafe = false;
      score = 45;
    }
    if (lowerDialog.includes("whatsapp") || lowerDialog.includes("telegram") || lowerDialog.includes("phone number")) {
      warns.push("off-platform transport request");
      score = 75;
    }
    res.json({
      success: true,
      assessment: {
        isSafe,
        safetyScore: score,
        flaggedTriggerWords: warns,
        warningAdvice: isSafe ? "This conversation looks pristine and respectful. Keep chatting safely!" : "Warning: A user requested financial tokens or off-platform communication. Keep your conversation safe on SoulMatch."
      }
    });
  }
});
app.post("/api/subscribe", (req, res) => {
  const { plan } = req.body;
  currentSubscription = {
    subscription_id: "sub_" + Date.now(),
    user_id: "current_user",
    plan: plan || "premium",
    expiry_date: new Date(Date.now() + 36e5 * 24 * 365).toLocaleDateString()
  };
  res.json({ success: true, subscription: currentSubscription });
});
app.post("/api/report", (req, res) => {
  const { reportedUserId, reason } = req.body;
  const newReport = {
    report_id: "rep_" + Date.now(),
    reporter_id: "current_user",
    reported_user_id: reportedUserId,
    reason: reason || "Inappropriate chats",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    status: "pending"
  };
  reportsDb.push(newReport);
  res.json({ success: true, report: newReport });
});
app.get("/api/admin/stats", (req, res) => {
  const totalUsersCount = usersDb.length;
  const reportedCount = reportsDb.length;
  const premiumCount = currentSubscription.plan === "premium" ? 1 : 0;
  res.json({
    totalUsers: totalUsersCount + 42,
    // pad some mock values for realism
    premiumUsers: premiumCount + 15,
    pendingVerifications: usersDb.filter((u) => u.verification_status === "pending").length + 3,
    reports: reportsDb,
    revenue: (premiumCount + 15) * 19.99,
    userProfiles: usersDb
  });
});
var googleDriveConfig = {
  accessToken: "",
  folderId: "1bjvxP9yTh4lGJLgZd9y9U-XqpaHEdeyr",
  lastSyncTime: null,
  syncStatus: "disconnected",
  // 'disconnected' | 'connected' | 'syncing' | 'error'
  lastError: null
};
app.get("/api/drive/status", async (req, res) => {
  const token = req.query.token || googleDriveConfig.accessToken;
  const folderId = req.query.folderId || googleDriveConfig.folderId;
  if (!token) {
    return res.json({
      connected: false,
      folderId,
      files: [],
      lastSyncTime: googleDriveConfig.lastSyncTime,
      syncStatus: "disconnected",
      lastError: googleDriveConfig.lastError
    });
  }
  try {
    const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&orderBy=modifiedTime+desc`;
    const response = await fetch(listUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google API returned ${response.status}: ${errText}`);
    }
    const data = await response.json();
    googleDriveConfig.accessToken = token;
    googleDriveConfig.syncStatus = "connected";
    googleDriveConfig.lastError = null;
    res.json({
      connected: true,
      folderId,
      files: data.files || [],
      lastSyncTime: googleDriveConfig.lastSyncTime,
      syncStatus: "connected",
      lastError: null
    });
  } catch (err) {
    console.error("Drive Listing Error:", err);
    googleDriveConfig.syncStatus = "error";
    googleDriveConfig.lastError = err.message || "Failed to load Google Drive files";
    res.json({
      connected: false,
      folderId,
      files: [],
      lastSyncTime: googleDriveConfig.lastSyncTime,
      syncStatus: "error",
      lastError: googleDriveConfig.lastError
    });
  }
});
app.post("/api/drive/set-token", (req, res) => {
  const { token, folderId } = req.body;
  if (token) {
    googleDriveConfig.accessToken = token;
    googleDriveConfig.syncStatus = "connected";
    googleDriveConfig.lastError = null;
  }
  if (folderId) {
    googleDriveConfig.folderId = folderId;
  }
  res.json({ success: true, config: googleDriveConfig });
});
app.post("/api/drive/sync-push", async (req, res) => {
  const token = req.body.token || googleDriveConfig.accessToken;
  const folderId = req.body.folderId || googleDriveConfig.folderId;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Google Drive access token is required." });
  }
  try {
    googleDriveConfig.syncStatus = "syncing";
    const dbPayload = {
      usersDb,
      matchesProgressDb,
      messagesDb,
      reportsDb,
      questionnaireAnswers,
      currentSubscription,
      backupTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name='soulmatch_db_backup.json'+and+trashed=false&fields=files(id,name)`;
    const searchResponse = await fetch(listUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    let fileId = "";
    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      if (searchResult.files && searchResult.files.length > 0) {
        fileId = searchResult.files[0].id;
      }
    }
    let writeResponse;
    if (fileId) {
      writeResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dbPayload)
      });
    } else {
      const createResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: "soulmatch_db_backup.json",
          parents: [folderId],
          mimeType: "application/json"
        })
      });
      if (!createResponse.ok) {
        const errText = await createResponse.text();
        throw new Error(`Failed to create file resource: ${errText}`);
      }
      const createdFile = await createResponse.json();
      fileId = createdFile.id;
      writeResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dbPayload)
      });
    }
    if (!writeResponse.ok) {
      const errText = await writeResponse.text();
      throw new Error(`Failed to upload DB content to Drive: ${errText}`);
    }
    for (const u of usersDb) {
      const userFileName = `user_${u.user_id}_profile.json`;
      const searchUserUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name='${userFileName}'+and+trashed=false&fields=files(id,name)`;
      const userSearchResponse = await fetch(searchUserUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      let userFileId = "";
      if (userSearchResponse.ok) {
        const userSearchResult = await userSearchResponse.json();
        if (userSearchResult.files && userSearchResult.files.length > 0) {
          userFileId = userSearchResult.files[0].id;
        }
      }
      if (userFileId) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${userFileId}?uploadType=media`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(u)
        });
      } else {
        const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: userFileName,
            parents: [folderId],
            mimeType: "application/json"
          })
        });
        if (createRes.ok) {
          const createdUserFile = await createRes.json();
          await fetch(`https://www.googleapis.com/upload/drive/v3/files/${createdUserFile.id}?uploadType=media`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(u)
          });
        }
      }
    }
    googleDriveConfig.lastSyncTime = (/* @__PURE__ */ new Date()).toISOString();
    googleDriveConfig.syncStatus = "connected";
    googleDriveConfig.lastError = null;
    res.json({
      success: true,
      lastSyncTime: googleDriveConfig.lastSyncTime,
      message: "Database arrays serialized and backed up successfully to Google Drive folder!"
    });
  } catch (err) {
    console.error("Push Sync Error:", err);
    googleDriveConfig.syncStatus = "error";
    googleDriveConfig.lastError = err.message || "Failed during push-synchronization";
    res.status(500).json({ error: googleDriveConfig.lastError });
  }
});
app.post("/api/drive/sync-pull", async (req, res) => {
  const token = req.body.token || googleDriveConfig.accessToken;
  const folderId = req.body.folderId || googleDriveConfig.folderId;
  const fileId = req.body.fileId;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Google Drive access token is required." });
  }
  try {
    googleDriveConfig.syncStatus = "syncing";
    let targetFileId = fileId;
    if (!targetFileId) {
      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name='soulmatch_db_backup.json'+and+trashed=false&fields=files(id,name)`;
      const searchResponse = await fetch(listUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!searchResponse.ok) {
        throw new Error("Could not querying Google Drive search API");
      }
      const searchResult = await searchResponse.json();
      if (!searchResult.files || searchResult.files.length === 0) {
        throw new Error("No database file 'soulmatch_db_backup.json' found inside specified Google Drive folder. Please write a backup first.");
      }
      targetFileId = searchResult.files[0].id;
    }
    const contentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${targetFileId}?alt=media`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!contentResponse.ok) {
      const errText = await contentResponse.text();
      throw new Error(`Failed to retrieve file contents from Drive: ${errText}`);
    }
    const backupData = await contentResponse.json();
    if (backupData.usersDb && Array.isArray(backupData.usersDb)) {
      usersDb = backupData.usersDb;
    }
    if (backupData.matchesProgressDb && Array.isArray(backupData.matchesProgressDb)) {
      matchesProgressDb = backupData.matchesProgressDb;
    }
    if (backupData.messagesDb && Array.isArray(backupData.messagesDb)) {
      messagesDb = backupData.messagesDb;
    }
    if (backupData.reportsDb && Array.isArray(backupData.reportsDb)) {
      reportsDb = backupData.reportsDb;
    }
    if (backupData.questionnaireAnswers) {
      questionnaireAnswers = backupData.questionnaireAnswers;
    }
    if (backupData.currentSubscription) {
      currentSubscription = backupData.currentSubscription;
    }
    googleDriveConfig.lastSyncTime = (/* @__PURE__ */ new Date()).toISOString();
    googleDriveConfig.syncStatus = "connected";
    googleDriveConfig.lastError = null;
    res.json({
      success: true,
      lastSyncTime: googleDriveConfig.lastSyncTime,
      message: "RAM updated successfully with latest custom records from Google Drive backup!"
    });
  } catch (err) {
    console.error("Pull Sync Error:", err);
    googleDriveConfig.syncStatus = "error";
    googleDriveConfig.lastError = err.message || "Failed during pull-synchronization";
    res.status(500).json({ error: googleDriveConfig.lastError });
  }
});
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.trim() === "") {
    return res.json({ url: "" });
  }
  const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive",
    access_type: "offline",
    prompt: "consent"
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl });
});
app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${req.protocol}://${req.get("host")}/auth/callback`;
  if (!code || !clientId || !clientSecret) {
    return res.send(`
      <html>
        <body style="font-family: system-ui, -apple-system, sans-serif; padding: 32px; text-align: center; color: #334155; bg: #fafbfc;">
          <div style="max-width: 480px; margin: 40px auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <h2 style="color: #ef4444; font-weight: 800; font-size: 20px; margin-bottom: 12px;">OAuth Setup Action Needed</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin-bottom: 24px;">
              Credentials are missing. Please configure <strong>OAUTH_CLIENT_ID</strong> and <strong>OAUTH_CLIENT_SECRET</strong> environment keys in your settings first!
            </p>
            <button onclick="window.close()" style="background: #1e293b; color: white; padding: 10px 24px; font-weight: 700; font-size: 13px; border: none; border-radius: 10px; cursor: pointer;">Close Popup</button>
          </div>
        </body>
      </html>
    `);
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
      })
    });
    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Google API returned exchange failure: ${errText}`);
    }
    const tokenData = await tokenResponse.json();
    googleDriveConfig.accessToken = tokenData.access_token;
    googleDriveConfig.syncStatus = "connected";
    googleDriveConfig.lastError = null;
    res.send(`
      <html>
        <body style="font-family: system-ui, -apple-system, sans-serif; padding: 32px; text-align: center; color: #1e293b; bg: #fafbfc;">
          <div style="max-width: 480px; margin: 40px auto; background: white; padding: 40px 32px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05);">
            <div style="width: 48px; height: 48px; background: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; font-weight: bold;">\u2713</div>
            <h2 style="color: #16a34a; font-weight: 800; font-size: 22px; margin-bottom: 12px;">Connected to Google Drive!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
              Your database state is successfully integrated with Google Cloud. You can now synchronize files directly.
            </p>
            <p style="color: #94a3b8; font-size: 12px;">This auth screen will close down automatically...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: "${tokenData.access_token}" }, '*');
                setTimeout(() => { window.close(); }, 1800);
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Token Exchange Error:", err);
    res.send(`
      <html>
        <body style="font-family: system-ui, -apple-system, sans-serif; padding: 32px; text-align: center; color: #334155;">
          <div style="max-width: 480px; margin: 40px auto; background: white; padding: 32px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <h2 style="color: #ef4444; font-weight: 800; font-size: 20px; margin-bottom: 12px;">Exchange Failed</h2>
            <pre style="background: #f8fafc; color: #ef4444; padding: 16px; border-radius: 10px; font-family: monospace; font-size: 11px; text-align: left; overflow-x: auto; margin-bottom: 24px;">${err.message}</pre>
            <button onclick="window.close()" style="background: #1e293b; color: white; padding: 10px 24px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer;">Close Popup</button>
          </div>
        </body>
      </html>
    `);
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SoulMatch full-stack backend running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
