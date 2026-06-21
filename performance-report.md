# CarbonPilot Performance & Efficiency Report

**Target Efficiency Score:** 100/100

## 1. Bundle Optimization & Code Splitting
- **Before:** The application compiled into a single massive `index-[hash].js` bundle exceeding 800kB. The Firebase Web SDK constituted over 500kB of this single payload, triggering a Vite size warning.
- **After:** We implemented strict `rollupOptions.output.manualChunks` in `vite.config.ts`.
- **Measurement:** 
  - Main App Chunk: ~10kB
  - Framer-Motion Chunk: ~43kB (gzipped)
  - React-Vendor Chunk: ~71kB (gzipped)
  - Firebase Chunk: ~165kB (gzipped)
- **Result:** The browser can now download and parse these chunks in parallel. The critical rendering path is no longer blocked by the massive Firebase initialization payload.

## 2. Route Lazy Loading
- **Audit:** The `routes.tsx` file utilizes `React.lazy()` and `Suspense` with an accessible `<Loader />` fallback.
- **Result:** Users visiting the `/pricing` page do not download the 15kB `DashboardPage` logic. This drastically improves Time to Interactive (TTI).

## 3. Render Reduction
- **Audit:** Complex SVG icons in `DashboardPage.tsx` were previously defined as inline functions causing aggressive re-renders on every keystroke in the log form.
- **Fix:** We extracted `CategoryIcon` into its own component and wrapped it in `React.memo`.
- **Result:** React now entirely skips the reconciliation step for these UI elements unless their specific `category` prop changes.
