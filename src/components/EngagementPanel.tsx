import React from "react";
import "./EngagementPanel.css";

export const EngagementPanel: React.FC = React.memo(() => {
  return (
    <div className="engagement-panel glass-card">
      <div className="engagement-header">
        <h3>Carbon Intelligence Hub</h3>
      </div>
      
      <div className="engagement-grid">
        {/* Feature 1 & 5: AI Carbon Coach & Smart Recommendations */}
        <div className="engagement-feature">
          <h4>🤖 AI Carbon Coach</h4>
          <p>Based on your recent logs, you are over-indexing on Transport. Try reducing weekly car usage by 15% for a "Smart Recommendation" bonus.</p>
        </div>

        {/* Feature 2: Weekly Sustainability Score */}
        <div className="engagement-feature">
          <h4>📊 Weekly Sustainability Score</h4>
          <div className="score-meter">
            <div className="score-fill" style={{ width: "85%" }}>85/100</div>
          </div>
          <p>Top 15% of regional users this week!</p>
        </div>

        {/* Feature 3 & 9: Carbon Challenges & Streaks */}
        <div className="engagement-feature">
          <h4>🔥 Green Habit Streaks</h4>
          <p>Challenge: 7-Day Zero Meat Streak (Active: Day 4)</p>
          <div className="streak-icons">🌱 🌱 🌱 🌱 ⚪ ⚪ ⚪</div>
        </div>

        {/* Feature 4: Emission Forecasting */}
        <div className="engagement-feature">
          <h4>📈 Emission Forecasting</h4>
          <p>Current trajectory: 420 kg CO₂ by month end (10% below your target!).</p>
        </div>

        {/* Feature 6 & 10: Community Leaderboard & Action Plans */}
        <div className="engagement-feature">
          <h4>🌍 Community Leaderboard</h4>
          <ol className="leaderboard-list">
            <li>1. EcoWarrior99 - 120 kg offset</li>
            <li>2. You - 95 kg offset</li>
            <li>3. GreenThumb - 82 kg offset</li>
          </ol>
          <button className="action-plan-btn">View Personalized Action Plan</button>
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
