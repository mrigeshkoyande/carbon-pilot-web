# CarbonPilot Web Platform

<div align="center">
  <img src="public/favicon.svg" alt="CarbonPilot Logo" width="120" />
</div>

<br />

**CarbonPilot** is a modern, responsive, and highly interactive web application designed to help individuals and organizations track, analyze, and offset their carbon emissions in real-time. 

Built with cutting-edge frontend technologies and a serverless backend, CarbonPilot aims to simplify the path to a Net Zero future through personalized insights and gamified sustainability metrics.

---

## 🚀 Tech Stack

### Frontend Architecture
- **Framework**: React 18
- **Language**: TypeScript for end-to-end type safety
- **Build Tool**: Vite (Lightning-fast HMR and optimized production builds)
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion (Declarative physics-based animations)
- **Styling**: Custom CSS architecture with BEM-inspired methodologies and modern CSS variables (Glassmorphism & Gradients).

### Backend & Database (Serverless)
- **Authentication**: Firebase Auth (Email/Password & Google OAuth capabilities)
- **Database**: Firebase Firestore (Real-time NoSQL document database)
- **Security**: Firestore Security Rules strictly locking reads/writes to authenticated users' own data.

### Deployment & CI/CD
- **Containerization**: Docker multi-stage builds
- **Web Server**: Nginx (Configured for SPA routing and static caching)
- **Cloud Hosting**: Google Cloud Run (GCR)
- **CI/CD**: GitHub Actions (`deploy.yml` pipeline securely injects secrets and pushes to GCR on `main` branch merges)

---

## 📂 Codebase Structure

The application is modularized into distinct directories for scalability and maintainability:

```text
carbon-pilot-web/
├── .github/                # GitHub Issue/PR Templates & Actions CI/CD workflows
├── public/                 # Static assets (Favicons, manifest, static SVGs)
├── src/                    # Primary application source code
│   ├── assets/             # Images and local media
│   ├── components/         # Reusable, stateless UI components
│   │   ├── ui/             # Micro-components (e.g., AntiGravityWrapper)
│   │   ├── Navbar.tsx      # Global navigation header
│   │   ├── HeroSection.tsx # Animated landing page hero
│   │   └── ...
│   ├── pages/              # Stateful route views
│   │   ├── DashboardPage   # Core logged-in user telemetry and logging UI
│   │   ├── LoginPage       # Authentication and registration flow
│   │   ├── PlatformPage    # Feature showcase page
│   │   └── PricingPage     # Subscription tiers
│   ├── App.tsx             # Root React Router provider
│   ├── main.tsx            # React DOM mounting and strict mode
│   └── firebase.ts         # Centralized Firebase initialization and exports
├── Dockerfile              # Multi-stage production container configuration
├── nginx.conf              # SPA-optimized web server routing
└── package.json            # NPM dependencies and project scripts
```

---

## 🧠 Core Features

1. **Dynamic Emissions Logging**: Users can log daily emission activities (Transport, Energy, Food, Waste) with exact values and contextual notes.
2. **Real-time Synchronization**: Data instantly syncs across devices using Firestore `onSnapshot` listeners.
3. **Personalized Insights Engine**: The dashboard evaluates telemetry data to determine the user's highest carbon impact category and provides actionable, dynamically generated pathways to reduce their footprint.
4. **Monthly Sustainability Cap**: Visual progress bars track net carbon footprints against dynamically recommended monthly targets.
5. **Cinematic UI**: Extensive use of Framer Motion for scroll reveals, staggered entry animations, and interactive hover states (AntiGravity wrappers).

---

## 🛠 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Firebase Project](https://console.firebase.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mrigeshkoyande/carbon-pilot-web.git
   cd carbon-pilot-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the `.env.example` file to a new file named `.env`.
   - Fill in your Firebase configuration keys from the Firebase Console.
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   ...
   ```

4. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

---

## 📦 Docker & Production

To test the production container locally using Docker:

1. **Build the image:**
   ```bash
   docker build -t carbon-pilot-web .
   ```
2. **Run the container:**
   ```bash
   docker run -p 8080:8080 carbon-pilot-web
   ```
   *The app will be served via Nginx at `http://localhost:8080`.*

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting Pull Requests to us. 

*If you encounter a bug or have a feature request, please use the provided GitHub Issue templates.*
