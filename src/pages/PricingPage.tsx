import React, { useState } from "react";
import { motion } from "framer-motion";
import AntiGravityWrapper from "../components/ui/AntiGravityWrapper";
import "./PricingPage.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
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

interface Plan {
  name: string;
  price: { monthly: string; yearly: string };
  desc: string;
  features: string[];
  featured: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: { monthly: "$29", yearly: "$24" },
    desc: "For individuals and small teams starting their sustainability journey.",
    features: [
      "Carbon footprint calculator",
      "Basic analytics dashboard",
      "Monthly emissions reports",
      "Email support",
      "Up to 5 team members",
    ],
    featured: false,
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: { monthly: "$99", yearly: "$79" },
    desc: "For growing organizations serious about reducing their impact.",
    features: [
      "Everything in Starter",
      "AI-powered recommendations",
      "Real-time monitoring",
      "Compliance reporting (TCFD, CDP)",
      "Priority support",
      "Up to 50 team members",
      "API access",
    ],
    featured: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    desc: "For large organizations with complex sustainability needs.",
    features: [
      "Everything in Professional",
      "Scope 1–3 ecosystem mapping",
      "Dedicated success manager",
      "SSO & advanced security",
      "Custom integrations",
      "Unlimited team members",
      "SLA guarantee",
    ],
    featured: false,
    cta: "Contact Sales",
  },
];

const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="pricing-page">
      {/* Hero */}
      <motion.section
        className="pricing-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="pricing-hero__label" variants={itemVariants}>
          PRICING
        </motion.p>
        <motion.h1 className="pricing-hero__title text-headline-lg" variants={itemVariants}>
          Simple, <span className="text-gradient">transparent</span> pricing
        </motion.h1>
        <motion.p className="pricing-hero__subtitle" variants={itemVariants}>
          Start free. Scale as you grow. No hidden fees. Cancel anytime.
        </motion.p>

        {/* Toggle */}
        <motion.div className="pricing-toggle" variants={itemVariants}>
          <span className={`pricing-toggle__label ${!isYearly ? "pricing-toggle__label--active" : ""}`}>
            Monthly
          </span>
          <button
            className={`pricing-toggle__switch ${isYearly ? "pricing-toggle__switch--yearly" : ""}`}
            onClick={() => setIsYearly(!isYearly)}
            id="pricing-toggle"
            aria-label="Toggle yearly pricing"
          >
            <span className="pricing-toggle__thumb" />
          </button>
          <span className={`pricing-toggle__label ${isYearly ? "pricing-toggle__label--active" : ""}`}>
            Yearly
            <span className="pricing-toggle__badge">Save 20%</span>
          </span>
        </motion.div>
      </motion.section>

      {/* Plans Grid */}
      <motion.section
        className="pricing-plans"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="pricing-plans__grid">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} variants={itemVariants}>
              <AntiGravityWrapper>
                <div
                  className={`plan-card ${plan.featured ? "plan-card--featured" : ""} glass-card`}
                  id={`plan-card-${i}`}
                >
                  {plan.featured && (
                    <div className="plan-card__badge">Most Popular</div>
                  )}
                  <h3 className="plan-card__name">{plan.name}</h3>
                  <div className="plan-card__price">
                    <span className="plan-card__amount">
                      {isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly !== "Custom" && (
                      <span className="plan-card__period">/mo</span>
                    )}
                  </div>
                  <p className="plan-card__desc">{plan.desc}</p>
                  <ul className="plan-card__features">
                    {plan.features.map((f) => (
                      <li key={f} className="plan-card__feature">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#62df7d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`plan-card__cta ${plan.featured ? "plan-card__cta--primary btn-glow" : ""}`}
                    id={`plan-cta-${i}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </AntiGravityWrapper>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ-like trust */}
      <motion.section
        className="pricing-trust"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pricing-trust__grid">
          <div className="pricing-trust__item">
            <h4>14-day free trial</h4>
            <p>No credit card required. Full access to Professional features.</p>
          </div>
          <div className="pricing-trust__item">
            <h4>Cancel anytime</h4>
            <p>No long-term contracts. Downgrade or cancel with one click.</p>
          </div>
          <div className="pricing-trust__item">
            <h4>SOC 2 Certified</h4>
            <p>Enterprise-grade security. Your data is encrypted at rest and in transit.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PricingPage;
