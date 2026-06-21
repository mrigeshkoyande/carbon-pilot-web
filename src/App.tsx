import React from "react";
import { BrowserRouter } from "react-router-dom";
import VideoBackground from "./components/VideoBackground";
import Navbar from "./components/Navbar";
import { AppRoutes } from "./routes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Full-screen 3D Video Background */}
      <VideoBackground />

      {/* UI Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        
        {/* Centralized Routing logic */}
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default App;
