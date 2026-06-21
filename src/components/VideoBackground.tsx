import React from "react";
import "./VideoBackground.css";

interface VideoBackgroundProps {
  variant?: "hero" | "subtle";
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ variant = "hero" }) => {
  return (
    <div className={`video-background video-background--${variant}`}>
      {/* 3D Video Layer */}
      <video
        className="video-background__video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient Overlay Mask */}
      <div className="video-background__mask" />

      {/* Radial Glow Effect */}
      <div className="video-background__glow" />
    </div>
  );
};

export default VideoBackground;
