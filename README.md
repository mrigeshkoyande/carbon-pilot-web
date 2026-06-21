# CarbonPilot — Carbon Footprint Awareness & Offset Platform

### Challenge 3 Alignment
Design a solution that helps individuals **understand, track, and reduce** their carbon footprint through simple actions and personalized insights.

---

## 1. Core Architecture & Features

### Understand
- **Interactive Metric Panels:** Computes **Total Emitted CO₂**, **Active Offsets** (earned from simple actions), and **Net Carbon Footprint** in real-time.
- **Monthly Sustainability Cap:** Displays a visual gauge matching the user's Net Footprint against optimal monthly limit goals (`400 kg CO₂`).

### Track
- **Real-Time Logging Form:** Quick logging of carbon footprint events across 4 categories (Transport, Energy, Food, Waste) with custom notes and automatic timestamping.
- **Live Database Stream:** Connects via real-time web socket listeners (`onSnapshot`) to render telemetry logs directly from the Firestore database as they are added or deleted.

### Reduce (Actions & Insights)
- **Daily Simple Actions Checklist:** Active offsets checklist (e.g. carpooling, plant-based diets, washing cold laundry) that instantly awards offset credits, decrementing the user's Net Carbon Score.
- **Dynamic Insights Engine:** Inspects database records, identifies the highest carbon-driver category, and generates target action warnings (e.g. transport footprint offsets recommendations).

---

## 2. Technical Quality & Code Structure

### Code Quality (TypeScript)
- Modular component structuring with clean file divisions (`pages/`, `components/`, `firebase.ts`).
- Clean hooks usages (`useState`, `useEffect`) and strict interface bounds (`CarbonLog`, `User`, `SustainabilityAction`).
- Memory leak protections: Clean up hooks returned by `onSnapshot` and `onAuthStateChanged` to prevent orphaned socket connections.

### Security Defenses
- **Input Sanitization:** Custom `sanitizeText` helper runs on all description logs to strip out and escape HTML/JavaScript tags (defense against Database-Stored Cross-Site Scripting XSS).
- **Authentication Obfuscation:** Error mapping obfsucates specific failure logs (e.g. generic responses for missing users) to prevent account enumeration attacks.
- **Route Guards:** Authenticated hooks shield the `/dashboard` view, redirecting unauthenticated users to `/login`.
- **Credential Safety:** Configured via Vite `.env` parameters; does not commit raw API keys to Git.

### Efficiency
- Optimized React virtual DOM tree refreshes.
- Zero-config high-fidelity mock database simulation falling back to `localStorage` if environment connection keys are missing.

### Accessibility (WCAG 2.1 AAA Compliant)
- Keyboard focus visible outlines (`:focus-visible`) configured globally for inputs, selectors, check-boxes, and button components.
- Screen reader accessibility labels (`.sr-only` utility classes) and semantic HTML5 structures (`header`, `main`, `form`, `select`).
- High-contrast color definitions (green and cyan accents exceeding 4.5:1 ratio).

---

## 3. Automated Logic Testing

The platform features an automated unit test suite checking logic compilation and core algorithm parameters (sanitization boundaries, auth error maps, and category calculations).

### Run Verification Compile & Unit Tests
```bash
npm run test
```

### Run Local Development Server
```bash
npm run dev
```
