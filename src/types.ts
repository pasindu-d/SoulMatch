export type UserRole = 'guest' | 'member' | 'premium' | 'admin';

export interface UserProfile {
  user_id: string;
  email?: string;
  full_name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  location: string;
  religion: string;
  education: string;
  occupation: string;
  relationship_goal: 'Marriage/Life Partner' | 'Long-term partnership' | 'Casual dating' | 'New friends';
  bio: string;
  interests: string[];
  profile_completion: number; // 0 to 100
  verification_status: 'unverified' | 'pending' | 'verified';
  photo_url: string; // primary photo
  photos: string[]; // additional photo URLs
  password?: string;
  personality_type?: string; // e.g. "Adventurous Harmonizer", "Introspective Thinker"
  relationship_values?: string[]; // e.g. "Family", "Career", "Adventure", "Honesty"
  lifestyle_habits?: string[]; // e.g. "Active", "Smoker", "Veggie", "Night owl"
  communication_style?: string; // e.g. "Direct & vocal", "Text-heavy", "Quality time"
  incognito_mode?: boolean;
}

export interface MatchProgress {
  match_id: string;
  user_a: string; // sender ID
  user_b: string; // receiver ID
  compatibility_score: number; // 0 to 100
  status: 'like' | 'pass' | 'matched';
  created_at: string;
}

export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  timestamp: string;
  is_voice?: boolean;
  voice_duration?: number; // message second duration
  is_image?: boolean;
  image_url?: string;
  reactions?: string[];
  read?: boolean;
}

export interface Subscription {
  subscription_id: string;
  user_id: string;
  plan: 'free' | 'premium';
  expiry_date: string;
}

export interface UserReport {
  report_id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface CompatibilityQuestion {
  id: string;
  text: string;
  category: 'personality' | 'lifestyle' | 'goals' ;
  options: string[];
}

export const COMPATIBILITY_QUESTIONS: CompatibilityQuestion[] = [
  {
    id: 'q1',
    text: 'How do you prefer to spend your typical weekend?',
    category: 'lifestyle',
    options: [
      'Exploring outdoors, hiking, or traveling',
      'Cozying up at home with books, movies, or hobbies',
      'Socializing at parties, dinners, or events',
      'Catching up on work or personal projects'
    ]
  },
  {
    id: 'q2',
    text: 'What is your primary communication style in a relationship?',
    category: 'personality',
    options: [
      'Direct, open, and immediate conversation',
      'Reflective, thinking things through before talking',
      'Expressive and highly emotional',
      'Practical, solution-focused, and calm'
    ]
  },
  {
    id: 'q3',
    text: 'What are your ultimate thoughts on family and children?',
    category: 'goals',
    options: [
      'Definitely want children/family in the future',
      'Do not want children, prefer a life of independence',
      'Open to options depending on my partner',
      'Already have children, focused on raising them'
    ]
  },
  {
    id: 'q4',
    text: 'How do you typically manage finances and budgeting?',
    category: 'lifestyle',
    options: [
      'Careful planning and investing for the long-term',
      'Splashing on fine experiences, food, and travels',
      'Balanced approach with some safety margin',
      'Independent finances entirely'
    ]
  },
  {
    id: 'q5',
    text: 'Which trait matches your social interaction energy level?',
    category: 'personality',
    options: [
      'Extroverted: energized by gatherings and group chats',
      'Introverted: recharge through deep personal space',
      'Ambiverted: high situational flexibility',
      'Quiet observer: like small, quiet groups'
    ]
  }
];

export interface MemberSession {
  currentUser: UserProfile;
  role: UserRole;
  matches: MatchProgress[];
  messages: Message[];
  reports: UserReport[];
  subscription: Subscription;
  answers: Record<string, string>; // questionId -> selectedOption
}
