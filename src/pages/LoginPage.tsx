import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  auth,
  googleProvider,
  getErrorMessage
} from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    if (!email) {
      setError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__glow-1" />
      <div className="login-page__glow-2" />

      <motion.div
        className="login-container glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="login-header">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="rgba(98,223,125,0.1)" stroke="#62df7d" strokeWidth="1.5" />
              <path d="M16 6 C10 12, 10 20, 16 26 C22 20, 22 12, 16 6Z" fill="#62df7d" opacity="0.9" />
              <path d="M16 10 C13 14, 13 18, 16 22 C19 18, 19 14, 16 10Z" fill="#94de2d" opacity="0.7" />
            </svg>
          </div>
          <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
          <p className="login-subtitle">
            {isSignUp
              ? "Join CarbonPilot and start tracking your offset goals."
              : "Access your personalized sustainability command center."}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="login-tabs">
          <button
            className={`login-tab ${!isSignUp ? "login-tab--active" : ""}`}
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${isSignUp ? "login-tab--active" : ""}`}
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="error-icon">✕</div>
              <div className="error-text">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-label-wrapper">
              <label htmlFor="password">Password</label>
              {!isSignUp && (
                <span className="forgot-password" onClick={() => setError("Password reset is simulated. Try logging in directly.")}>
                  Forgot?
                </span>
              )}
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {isSignUp && (
            <motion.div
              className="form-group"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </motion.div>
          )}

          <button
            type="submit"
            className="login-submit-btn btn-glow"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="google-signin-btn glass-card"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.564-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.247-3.123C18.435 1.637 15.617 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.746-.08-1.32-.176-1.77H12.24z"
            />
          </svg>
          Google Cloud Identity
        </button>

      </motion.div>
    </div>
  );
};

export default LoginPage;
