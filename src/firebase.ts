import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { User } from "firebase/auth";

// Get env values
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Check config
const isFirebaseConfigured =
  apiKey &&
  apiKey !== "your_api_key_here" &&
  authDomain &&
  authDomain !== "your_auth_domain_here" &&
  projectId &&
  projectId !== "your_project_id_here";

if (!isFirebaseConfigured) {
  console.warn(
    "CarbonPilot: Firebase is not configured! Please provide real configuration values in your .env file."
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Security: Sanitization helper to prevent XSS script injection
export const sanitizeText = (text: string): string => {
  if (!text) return "";
  let sanitized = text.replace(/<[^>]*>/g, "");
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  return sanitized.trim();
};

// Security/UX: Unified error mapper
export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred.";
  const code = error.code || error.message || "";
  
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password combination.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address format.";
    case "auth/weak-password":
      return "Password is too weak. Must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      if (typeof error === "string") return error;
      return error.message || "An unexpected validation error occurred.";
  }
};

export { auth, db, googleProvider };
export type { User };
