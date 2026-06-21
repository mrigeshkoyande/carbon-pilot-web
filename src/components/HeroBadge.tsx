import React from "react";
import AntiGravityWrapper from "./ui/AntiGravityWrapper";
import "./HeroBadge.css";

const HeroBadge: React.FC = () => {
  return (
    <AntiGravityWrapper className="hero-badge__wrapper">
      <div className="hero-badge" id="hero-badge">
        <span className="hero-badge__dot" />
        <span className="hero-badge__text">Introducing CarbonPilot v1.0</span>
      </div>
    </AntiGravityWrapper>
  );
};

export default HeroBadge;
