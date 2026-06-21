import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AntiGravityWrapper from "./ui/AntiGravityWrapper";
import "./HeroSection.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const trustMetrics = [
  { value: "2.4M+", label: "Tons Offset" },
  { value: "98%", label: "Accuracy AI" },
  { value: "50k+", label: "Active Users" },
];

const HeroSection: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <main className="hero">
        <motion.div
          className="hero__container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Cinematic Headline */}
          <motion.h1 className="hero__headline text-display-xl" variants={itemVariants}>
            Understand Your Impact.
            <br />
            <span className="text-gradient">Shape a Sustainable Future.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p className="hero__subhead" variants={itemVariants}>
            Track your carbon footprint, discover smarter habits, and reduce
            emissions through personalized AI-powered guidance. Orchestrating
            the Net Zero transition starts here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="hero__ctas" variants={itemVariants}>
            <AntiGravityWrapper>
              <button
                className="hero__cta-primary btn-glow"
                id="hero-start-assessment"
                onClick={() => navigate("/platform")}
                aria-label="Start your free carbon assessment"
              >
                Start Free Assessment
                <svg
                  className="hero__cta-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </AntiGravityWrapper>

            <AntiGravityWrapper>
              <button
                className="hero__cta-secondary glass-card"
                id="hero-watch-demo"
                onClick={() => setShowDemo(true)}
              >
                <svg
                  className="hero__cta-icon hero__cta-icon--play"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                Watch Demo
              </button>
            </AntiGravityWrapper>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div className="hero__trust" variants={itemVariants}>
            {trustMetrics.map((metric) => (
              <div className="hero__trust-item" key={metric.label}>
                <div className="hero__trust-value">{metric.value}</div>
                <div className="hero__trust-label">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              className="video-modal"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="video-modal__close"
                onClick={() => setShowDemo(false)}
                aria-label="Close demo video"
              >
                ✕
              </button>
              <video autoPlay controls playsInline>
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4"
                  type="video/mp4"
                />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
