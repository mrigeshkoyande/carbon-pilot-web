import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AntiGravityWrapper from "../components/ui/AntiGravityWrapper";
import "./PlatformPage.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#62df7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Real-Time Tracking",
    desc: "Monitor your carbon emissions in real-time with our AI-powered sensors and integrations across your entire supply chain.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94de2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Predictive Analytics",
    desc: "Leverage machine learning models to forecast emissions and identify reduction opportunities before they arise.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#62df7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "Ecosystem Mapping",
    desc: "Visualize your entire carbon ecosystem — from Scope 1 to Scope 3 — with interactive 3D data maps.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94de2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    title: "Compliance Dashboard",
    desc: "Stay ahead of regulations with automated compliance reporting for EU Taxonomy, TCFD, and CDP frameworks.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#62df7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Team Collaboration",
    desc: "Empower every stakeholder with role-based dashboards, shared goals, and real-time progress tracking.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94de2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Enterprise Security",
    desc: "SOC 2 Type II certified. End-to-end encryption, SSO, and audit logs to protect your sustainability data.",
  },
];

const PlatformPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="platform-page">
      {/* Hero */}
      <motion.section
        className="platform-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="platform-hero__label" variants={itemVariants}>
          THE PLATFORM
        </motion.p>
        <motion.h1 className="platform-hero__title text-headline-lg" variants={itemVariants}>
          Built for the <span className="text-gradient">Net Zero</span> Economy
        </motion.h1>
        <motion.p className="platform-hero__subtitle" variants={itemVariants}>
          A unified command center for carbon intelligence — from tracking to reduction to reporting.
        </motion.p>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="platform-features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="platform-features__grid">
          {features.map((feat, i) => (
            <motion.div key={feat.title} variants={itemVariants}>
              <AntiGravityWrapper>
                <div className="feature-card glass-card" id={`feature-card-${i}`}>
                  <div className="feature-card__icon">{feat.icon}</div>
                  <h3 className="feature-card__title">{feat.title}</h3>
                  <p className="feature-card__desc">{feat.desc}</p>
                </div>
              </AntiGravityWrapper>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="platform-cta-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="platform-cta-section__title text-headline-lg">
          Ready to <span className="text-gradient">decarbonize</span>?
        </h2>
        <p className="platform-cta-section__desc">
          Join 50,000+ organizations already using CarbonPilot to accelerate their sustainability journey.
        </p>
        <button
          className="platform-cta-section__btn btn-glow"
          onClick={() => navigate("/pricing")}
        >
          View Plans & Pricing
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </motion.section>
    </div>
  );
};

export default PlatformPage;
