import React from "react";
import AntiGravityWrapper from "./ui/AntiGravityWrapper";
import "./HeroBadge.css";

/**
 * Props for the HeroBadge component.
 * @interface HeroBadgeProps
 * @property {string} text - The display text rendered inside the badge.
 */
interface HeroBadgeProps {
  text: string;
}

/**
 * A reusable, stylized badge component commonly used in Hero sections to highlight key features or status.
 * @component
 * @param {HeroBadgeProps} props - The component props.
 * @returns {JSX.Element} A React functional component.
 */
const HeroBadge: React.FC<HeroBadgeProps> = ({ text }) => {
  return (
    <AntiGravityWrapper className="hero-badge__wrapper">
      <div className="hero-badge" id="hero-badge">
        <span className="hero-badge__dot" />
        <span className="hero-badge__text">{text}</span>
      </div>
    </AntiGravityWrapper>
  );
};

export default HeroBadge;
