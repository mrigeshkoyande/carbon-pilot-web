/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import type { User } from "firebase/auth";

// For a React SPA, these keys are public by design. Hardcoding them here 
// prevents Docker/.env deployment nightmares during the hackathon.
const firebaseConfig = {
  apiKey: "AIzaSyBXkINx5kSSTrmjxmxYGwWi8GjmEuf0hXI",
  authDomain: "carbon-pilot.firebaseapp.com",
  projectId: "carbon-pilot",
  storageBucket: "carbon-pilot.firebasestorage.app",
  messagingSenderId: "479774053604",
  appId: "1:479774053604:web:4b246197b305a9874748f1",
  measurementId: "G-LV2TR2B8XC"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check (using a placeholder site key for Enterprise compliance)
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6Ld_placeholder_site_key_for_app_check'),
    isTokenAutoRefreshEnabled: true
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
import { GoogleAuthProvider } from "firebase/auth";
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

export { auth, db, googleProvider, analytics };
export type { User };
