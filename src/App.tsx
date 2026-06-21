import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoBackground from "./components/VideoBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import PlatformPage from "./pages/PlatformPage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const HomePage: React.FC = () => (
  <>
    <HeroSection />
    <Footer />
  </>
);

const PlatformRoute: React.FC = () => (
  <>
    <PlatformPage />
    <Footer />
  </>
);

const PricingRoute: React.FC = () => (
  <>
    <PricingPage />
    <Footer />
  </>
);

const LoginRoute: React.FC = () => (
  <>
    <LoginPage />
    <Footer />
  </>
);

const DashboardRoute: React.FC = () => (
  <>
    <DashboardPage />
    <Footer />
  </>
);

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

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/platform" element={<PlatformRoute />} />
          <Route path="/pricing" element={<PricingRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
