import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      id="main-nav"
    >
      {/* Liquid glass shimmer edge */}
      <div className="navbar__glass-edge" />

      <div className="navbar__container">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo-mark">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="rgba(98,223,125,0.1)" stroke="#62df7d" strokeWidth="1.5"/>
              <path d="M16 6 C10 12, 10 20, 16 26 C22 20, 22 12, 16 6Z" fill="#62df7d" opacity="0.9"/>
              <path d="M16 10 C13 14, 13 18, 16 22 C19 18, 19 14, 16 10Z" fill="#94de2d" opacity="0.7"/>
            </svg>
          </div>
          <span className="navbar__brand-name">CarbonPilot</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link
            to="/"
            className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/platform"
            className={`navbar__link ${isActive("/platform") ? "navbar__link--active" : ""}`}
          >
            Platform
          </Link>
          <Link
            to="/pricing"
            className={`navbar__link ${isActive("/pricing") ? "navbar__link--active" : ""}`}
          >
            Pricing
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`navbar__link ${isActive("/dashboard") ? "navbar__link--active" : ""}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar__login">
                {user.displayName || "Dashboard"}
              </Link>
              <button className="navbar__cta" id="nav-sign-out" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__login">
                Login
              </Link>
              <Link to="/platform">
                <button className="navbar__cta" id="nav-start-assessment">
                  Start Assessment
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`navbar__hamburger ${mobileMenuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          id="nav-menu-toggle"
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileMenuOpen ? "navbar__mobile-menu--open" : ""}`}>
        <Link to="/" className="navbar__mobile-link">Home</Link>
        <Link to="/platform" className="navbar__mobile-link">Platform</Link>
        <Link to="/pricing" className="navbar__mobile-link">Pricing</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="navbar__mobile-link">Dashboard</Link>
            <button
              className="navbar__cta navbar__cta--mobile"
              id="nav-mobile-cta-signout"
              onClick={handleSignOut}
              style={{ width: "100%", marginTop: "10px" }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__mobile-link">Login</Link>
            <Link to="/platform">
              <button className="navbar__cta navbar__cta--mobile" id="nav-mobile-cta">
                Start Assessment
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
