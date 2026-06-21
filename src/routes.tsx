import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";

// Efficiency: Lazy-loaded routes for code-splitting
const HeroSection = lazy(() => import("./components/HeroSection"));
const PlatformPage = lazy(() => import("./pages/PlatformPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

// Accessible Loading Fallback
export const Loader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "var(--color-primary)" }}>
    <p role="status" aria-live="polite">Loading...</p>
  </div>
);

const HomePage: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <HeroSection />
    <Footer />
  </Suspense>
);

const PlatformRoute: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <PlatformPage />
    <Footer />
  </Suspense>
);

const PricingRoute: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <PricingPage />
    <Footer />
  </Suspense>
);

const LoginRoute: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <LoginPage />
    <Footer />
  </Suspense>
);

const DashboardRoute: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <DashboardPage />
    <Footer />
  </Suspense>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/platform" element={<PlatformRoute />} />
      <Route path="/pricing" element={<PricingRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
    </Routes>
  );
};
