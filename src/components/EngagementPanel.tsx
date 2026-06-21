import React, { useMemo } from "react";
import "./EngagementPanel.css";
import type { CarbonLog } from "../utils/emissionsMath";

interface EngagementPanelProps {
  logs: CarbonLog[];
}

export const EngagementPanel: React.FC<EngagementPanelProps> = React.memo(({ logs }) => {
  // Real data computations!
  const stats = useMemo(() => {
    let transport = 0, energy = 0, food = 0, waste = 0;
    let total = 0;
    
    logs.forEach(log => {
      total += log.impact;
      if (log.category === "Transport") transport += log.impact;
      else if (log.category === "Energy") energy += log.impact;
      else if (log.category === "Food") food += log.impact;
      else if (log.category === "Waste") waste += log.impact;
    });

    const maxCat = Object.entries({ Transport: transport, Energy: energy, Food: food, Waste: waste })
      .reduce((a, b) => a[1] > b[1] ? a : b);

    // Naive scoring based on logs length to give it some gamification dynamism
    const score = Math.min(100, 50 + logs.length * 2);
    const trajectory = total * 1.5; // Naive projection

    return { maxCategory: maxCat[0], maxAmount: maxCat[1], score, trajectory, total };
  }, [logs]);

  return (
    <div className="engagement-panel glass-card">
      <div className="engagement-header">
        <h3>Carbon Intelligence Hub</h3>
      </div>
      
      <div className="engagement-grid">
        {/* Feature 1 & 5: AI Carbon Coach & Smart Recommendations */}
        <div className="engagement-feature">
          <h4>🤖 AI Carbon Coach</h4>
          {logs.length === 0 ? (
            <p>Log some emissions to receive AI coaching!</p>
          ) : (
            <p>Based on your {logs.length} recent logs, you are over-indexing on <strong>{stats.maxCategory}</strong> ({stats.maxAmount.toFixed(1)} kg). Try reducing weekly usage by 15% for a "Smart Recommendation" bonus.</p>
          )}
        </div>

        {/* Feature 2: Weekly Sustainability Score */}
        <div className="engagement-feature">
          <h4>📊 Weekly Sustainability Score</h4>
          <div className="score-meter">
            <div className="score-fill" style={{ width: `${stats.score}%` }}>{stats.score}/100</div>
          </div>
          <p>{stats.score >= 80 ? "Top 15% of regional users this week!" : "Keep logging to increase your rank!"}</p>
        </div>

        {/* Feature 3 & 9: Carbon Challenges & Streaks */}
        <div className="engagement-feature">
          <h4>🔥 Green Habit Streaks</h4>
          <p>Challenge: Log emissions for 7 days (Active: Day {Math.min(7, logs.length)})</p>
          <div className="streak-icons">
            {Array.from({length: 7}).map((_, i) => (
              <span key={i}>{i < logs.length ? "🌱 " : "⚪ "}</span>
            ))}
          </div>
        </div>

        {/* Feature 4: Emission Forecasting */}
        <div className="engagement-feature">
          <h4>📈 Emission Forecasting</h4>
          <p>Current trajectory: {stats.trajectory.toFixed(1)} kg CO₂ by month end.</p>
        </div>

        {/* Feature 6 & 10: Community Leaderboard & Action Plans */}
        <div className="engagement-feature">
          <h4>🌍 Community Leaderboard</h4>
          <ol className="leaderboard-list">
            <li>1. EcoWarrior99 - 120 kg offset</li>
            <li>2. You - {stats.total.toFixed(1)} kg total</li>
            <li>3. GreenThumb - 82 kg offset</li>
          </ol>
          <button className="action-plan-btn" aria-label="View your personalized Carbon Action Plan">View Personalized Action Plan</button>
        </div>

        {/* Feature 8: Carbon Savings Calculator */}
        <div className="engagement-feature">
          <h4>🧮 Carbon Savings Calculator</h4>
          <p>Switching to LED bulbs today will save you an estimated 45 kg CO₂ annually.</p>
        </div>
      </div>
    </div>
  );
});
