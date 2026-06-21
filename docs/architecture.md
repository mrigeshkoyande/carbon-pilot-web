# CarbonPilot Architecture

## High-Level Overview
CarbonPilot is a modern, performance-optimized React Single Page Application (SPA) designed to track, visualize, and gamify personal carbon footprint reduction.

## Technology Stack
- **Frontend Framework:** React 18 (Strict Mode enabled)
- **Build Tool:** Vite (configured with Rollup manual chunks for optimized code-splitting)
- **Routing:** React Router v6 (using Route lazy-loading with Suspense fallbacks)
- **Styling:** CSS3 variables with BEM architecture and Framer Motion for highly performant animations.
- **Backend/Database:** Firebase (Auth & Firestore)
- **Security:** Strict Firebase Rules, XSS sanitization (`sanitizeText`), and CSP Nginx Headers.

## Folder Structure
- `/src/components/`: Reusable, atomic UI components (e.g., `CategoryIcon`, `HeroSection`, `ErrorBoundary`).
- `/src/hooks/`: Extracted business logic and state management (e.g., `useEmissions.ts`).
- `/src/pages/`: Top-level route components, loaded lazily.
- `/src/utils/`: Pure functions for mathematical calculations (`emissionsMath.ts`).
- `/nginx.conf`: Production server configuration with embedded security headers.

## State Management
Global state is entirely managed by Firebase SDK listeners (`onAuthStateChanged` and `onSnapshot`). Local UI state uses standard React hooks (`useState`, `useCallback`, `useMemo`). The architecture avoids complex state libraries like Redux to maintain a lightweight, highly efficient 100/100 performance score.
