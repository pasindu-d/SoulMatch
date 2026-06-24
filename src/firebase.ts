import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// ⚠️ REPLACE THESE with your actual Firebase config values from Step 1
const firebaseConfig = {
  apiKey: "AIzaSyDlTSozif7Lt06mvX335o6Gbq4Kkw1UZmU",
  authDomain: "soulmatch-d86d7.firebaseapp.com",
  databaseURL: "https://soulmatch-d86d7-default-rtdb.firebaseio.com",
  projectId: "soulmatch-d86d7",
  storageBucket: "soulmatch-d86d7.firebasestorage.app",
  messagingSenderId: "251935405651",
  appId: "1:251935405651:web:61cafdfbfc008a7b7438a6",
  measurementId: "G-MCRW5Z34V6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
export type { User };