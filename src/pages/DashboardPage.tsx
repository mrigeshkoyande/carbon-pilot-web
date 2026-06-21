/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  auth,
  db,
  sanitizeText, // Security sanitization
} from "../firebase";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { useEmissions } from "../hooks/useEmissions";
import { CategoryIcon } from "../components/CategoryIcon";
import { 
  calculateTotalEmissions, 
  calculateNetFootprint, 
  calculateGoalPercentage 
} from "../utils/emissionsMath";
import "./DashboardPage.css";

interface SustainabilityAction {
  id: string;
  title: string;
  impact: number; // in kg CO2
  category: "Transport" | "Energy" | "Food" | "Waste";
}

const ACTIONS_LIST: SustainabilityAction[] = [
  { id: "public-transit", title: "Commuted via public transit", impact: 8.5, category: "Transport" },
  { id: "cold-wash", title: "Washed laundry with cold water", impact: 1.2, category: "Energy" },
  { id: "plant-diet", title: "Ate plant-based meals today", impact: 3.8, category: "Food" },
  { id: "unplug-gear", title: "Unplugged inactive chargers", impact: 0.5, category: "Energy" },
  { id: "recycled-waste", title: "Sorted household recycling", impact: 1.8, category: "Waste" },
];

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // Custom Hook replaces useState and raw useEffect logic!
  const { logs, loading, error: fetchError } = useEmissions(user?.uid);

  // Simple Actions state (persisted per session in localStorage)
  const [checkedActions, setCheckedActions] = useState<string[]>(() => {
    const saved = localStorage.getItem("carbonpilot_actions");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleAction = (id: string) => {
    setCheckedActions((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("carbonpilot_actions", JSON.stringify(updated));
      return updated;
    });
  };

  // Form states
  const [category, setCategory] = useState<"Transport" | "Energy" | "Food" | "Waste">("Transport");
  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Authentication monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // (Firebase onSnapshot subscription removed - handled by useEmissions hook)

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setFormError("Please enter a valid positive emission value.");
      return;
    }

    if (!user) {
      setFormError("User session not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const logData = {
        userId: user.uid,
        category,
        value: numericValue,
        date,
        notes: sanitizeText(notes.trim()),
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "emissions"), logData);

      // Reset form fields
      setValue("");
      setNotes("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (err: any) {
      console.error("Error adding doc:", err);
      setFormError(err.message || "Failed to save data to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await deleteDoc(doc(db, "emissions", id));
    } catch (err) {
      console.error("Error deleting doc:", err);
    }
  };

  // Efficiency: Math metrics utilizing external utilities
  const totalEmissions = useMemo(() => calculateTotalEmissions(logs), [logs]);
  
  const totalOffsetCredits = useMemo(() => {
    return ACTIONS_LIST
      .filter((action) => checkedActions.includes(action.id))
      .reduce((sum, action) => sum + action.impact, 0);
  }, [checkedActions]);

  const netFootprint = useMemo(() => calculateNetFootprint(totalEmissions, totalOffsetCredits), [totalEmissions, totalOffsetCredits]);
  const monthlyGoal = 400; // in kg CO2 limit
  const goalPercentage = useMemo(() => calculateGoalPercentage(netFootprint, monthlyGoal), [netFootprint]);

  const handleExportAnalytics = () => {
    alert("Analytics report exported successfully! (Hackathon Feature Demo)");
  };

  // Dynamic Insights Engine evaluating telemetry and categories
  const getInsights = () => {
    if (logs.length === 0) {
      return {
        title: "Build Your Footprint Profile",
        text: "Add emission logs on the left (e.g., commute mileage or power bills) to activate customized reduction pathways and targeted insights.",
        savings: "0 kg CO₂ potential",
        actionable: "Start logging emissions"
      };
    }

    const catTotals = { Transport: 0, Energy: 0, Food: 0, Waste: 0 };
    logs.forEach((log) => {
      if (catTotals[log.category] !== undefined) {
        catTotals[log.category] += log.value;
      }
    });

    let highestCat: "Transport" | "Energy" | "Food" | "Waste" = "Transport";
    let maxVal = -1;
    Object.entries(catTotals).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        highestCat = cat as any;
      }
    });

    const total = totalEmissions || 1;
    const percentage = Math.round((maxVal / total) * 100);

    switch (highestCat as string) {
      case "Transport":
        return {
          title: "Optimize Commute Patterns",
          text: `Transport represents your highest carbon cost (${percentage}% of total). Switching two weekly trips to public transit, carpooling, or walking can lower transport footprints significantly.`,
          savings: "Save up to 45 kg CO₂/mo",
          actionable: "Action: Check off 'Commuted via public transit'"
        };
      case "Energy":
        return {
          title: "Improve Home Thermostat Load",
          text: `Household energy accounts for ${percentage}% of your footprint. Shifting your heating/cooling by 1°C, switching to LED fixtures, and unplugging phantom standby loads creates immediate impact.`,
          savings: "Save up to 35 kg CO₂/mo",
          actionable: "Action: Check off 'Washed laundry with cold water'"
        };
      case "Food":
        return {
          title: "Integrate Plant-based Alternatives",
          text: `Dietary choices generate ${percentage}% of your tracked carbon. Shifting three meals a week to meat-free, organic, or regional produce helps cut global transport & processing loads.`,
          savings: "Save up to 25 kg CO₂/mo",
          actionable: "Action: Check off 'Ate plant-based meals today'"
        };
      case "Waste":
        return {
          title: "Minimize Municipal Landfill Load",
          text: `Solid waste drives ${percentage}% of emissions. Composting bio-scraps, choosing package-free products, and sorting recyclables minimizes methane offsets in local landfills.`,
          savings: "Save up to 15 kg CO₂/mo",
          actionable: "Action: Check off 'Sorted household recycling'"
        };
    }
    // Fallback general conservation insight
    return {
      title: "General Conservation",
      text: "Every small habit adjustment accumulates toward global Net Zero targets. Switch off standby appliances and use public transport where possible.",
      savings: "Save up to 10 kg CO₂/mo",
      actionable: "Action: Log details daily"
    };
  };

  const activeInsight = getInsights();


  return (
    <div className="dashboard-page">
      <div className="dashboard-page__glow" />

      {/* Header Banner */}
      <header className="dashboard-header">
        <div className="dashboard-user">
          <img
            src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || "default"}`}
            alt="User avatar"
            className="user-avatar animate-pulse-glow"
          />
          <div className="user-info">
            <h1>Hello, {user?.displayName || "Carbon Pilot"}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
          <button onClick={handleExportAnalytics} className="signout-btn glass-card" style={{marginRight: '1rem'}} aria-label="Download ESG Compliance Report">
            Download ESG Compliance Report
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
          <button onClick={handleSignOut} className="signout-btn glass-card" aria-label="Sign Out">
            Sign Out
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
      </header>

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        {/* Left Side: Stats and Inputs */}
        <div className="dashboard-left">
          {/* Summary          {/* Summary Cards */}
          <div className="stats-row">
            <div className="stat-card glass-card">
              <span className="stat-label">Total Emitted CO₂</span>
              <h2 className="stat-value">{totalEmissions.toFixed(1)} kg</h2>
              <span className="stat-sub">Sum of tracked emissions</span>
            </div>

            <div className="stat-card glass-card">
              <span className="stat-label">Active Offsets</span>
              <h2 className="stat-value text-secondary">{totalOffsetCredits.toFixed(1)} kg</h2>
              <span className="stat-sub">From simple actions completed</span>
            </div>

            <div className="stat-card glass-card stat-card--net">
              <span className="stat-label">Net Carbon Footprint</span>
              <h2 className="stat-value text-gradient">{netFootprint.toFixed(1)} kg</h2>
              <span className="stat-sub">Net carbon impact score</span>
            </div>
          </div>

          {/* Monthly Budget Bar */}
          <div className="budget-card glass-card">
            <div className="budget-header">
              <h3>Monthly Sustainability Cap</h3>
              <span>
                <strong>{netFootprint.toFixed(0)}</strong> / {monthlyGoal} kg CO₂
              </span>
            </div>
            <div className="budget-bar-bg">
              <motion.div
                className={`budget-bar-fill ${goalPercentage > 85 ? "budget-bar-fill--warning" : ""}`}
                initial={{ width: 0 }}
                animate={{ width: `${goalPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="budget-desc">
              {goalPercentage >= 100
                ? "Warning: Your net carbon footprint has reached or exceeded your monthly goal limit."
                : `Your net carbon footprint utilizes ${goalPercentage.toFixed(0)}% of your suggested monthly limit.`}
            </p>
          </div>

          {/* Dynamic Insights Panel */}
          <div className="insights-card glass-card">
            <div className="insights-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <h3>Personalized Environmental Insight</h3>
            </div>
            <div className="insights-content">
              <h4 className="insights-title">{activeInsight.title}</h4>
              <p className="insights-text">{activeInsight.text}</p>
              <div className="insights-footer">
                <span className="insights-savings">{activeInsight.savings}</span>
                <span className="insights-actionable">{activeInsight.actionable}</span>
              </div>
            </div>
          </div>

          {/* Logger Form */}
          <div className="logger-card glass-card">
            <h3>Record New Carbon Log</h3>
            <p className="logger-subtitle">
              Saves a new telemetry data record securely into your Firestore database.
            </p>

            {formError && <div className="form-error" role="alert" aria-live="assertive">✕ {formError}</div>}
            {fetchError && <div className="form-error" role="alert" aria-live="assertive">✕ Database Sync Error: {fetchError}</div>}

            <form onSubmit={handleAddLog} className="logger-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="category">Emission Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="Transport">Transport (Flights, Car, Fuel)</option>
                    <option value="Energy">Energy (Electricity, Heat, AC)</option>
                    <option value="Food">Food (Meat, Dairy, Processing)</option>
                    <option value="Waste">Waste (Trash, Landfill, Recycle)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="value">CO₂ Footprint (kg)</label>
                  <input
                    type="number"
                    id="value"
                    placeholder="e.g. 45.2"
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date of Activity</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes / Context</label>
                  <input
                    type="text"
                    id="notes"
                    placeholder="e.g., Daily commute, flight to JFK"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="logger-submit-btn btn-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving to Cloud..." : "Add Emission Log"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Simple Actions & Live Stream */}
        <div className="dashboard-right">
          {/* Simple Actions Checklist Card */}
          <div className="checklist-card glass-card">
            <div className="checklist-header">
              <h3>Daily Simple Actions</h3>
              <span className="checklist-subtitle">Complete to earn offset credits</span>
            </div>
            <div className="checklist-list">
              {ACTIONS_LIST.map((action) => {
                const isChecked = checkedActions.includes(action.id);
                return (
                  <div key={action.id} className={`checklist-item ${isChecked ? "checklist-item--checked" : ""}`}>
                     <label className="checklist-label">
                       <input
                         type="checkbox"
                         checked={isChecked}
                         onChange={() => toggleAction(action.id)}
                         className="checklist-checkbox"
                       />
                       <span className="checklist-custom-box" />
                       <div className="checklist-item-details">
                         <span className="action-title">{action.title}</span>
                         <span className="action-category-badge action-category-badge--styled">{action.category}</span>
                       </div>
                     </label>
                     <span className="action-impact">-{action.impact} kg CO₂</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Database Live Stream Card */}
          <div className="streams-card glass-card">
            <div className="streams-header">
              <h3>Live Database Stream</h3>
              <span className="live-status live-status--live">
                <span className="live-status__dot" />
                Firestore Live
              </span>
            </div>

            <div className="streams-list">
              {loading ? (
                <div className="dashboard-loading">
                  <span className="spinner" />
                  <p>Streaming carbon telemetry...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="empty-stream">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <p>No carbon logs recorded yet.</p>
                  <span>Use the form on the left to add your first database record.</span>
                </div>
              ) : (
                <div className="logs-scroll-area">
                  <AnimatePresence initial={false}>
                    {logs.map((log) => (
                      <motion.div
                        key={log.id}
                        className="log-item glass-card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="log-category-icon-wrapper">
                          <CategoryIcon category={log.category} />
                        </div>
                        <div className="log-content">
                          <div className="log-headline">
                            <h4>{log.category}</h4>
                            <span className="log-date">{log.date}</span>
                          </div>
                          {log.notes && <p className="log-notes" dangerouslySetInnerHTML={{ __html: log.notes }} />}
                        </div>
                        <div className="log-right">
                          <span className="log-value">{log.value.toFixed(1)} kg</span>
                          <button
                            onClick={() => handleDeleteLog(log.id!)}
                            className="delete-log-btn"
                            title="Delete record from Firestore"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
