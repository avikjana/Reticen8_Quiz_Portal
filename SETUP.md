# Reticen8 Academy — Setup Guide

## Quick Start

```bash
cd Reticen8_Quiz_Portal
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## If `npm install` fails (network restricted environment)

The project requires these packages — install them in order if needed:

```bash
# Core
npm install react react-dom react-router-dom framer-motion lucide-react

# Dev tools
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

## Project Structure

```
src/
  components/       # Reusable UI components
    Navbar.jsx      # Sticky responsive navigation
    AnnouncementBar.jsx
    HeroSection.jsx # Main hero with image composition
    StatisticsSection.jsx  # Animated counters
    LearningPaths.jsx      # Course cards section
    CourseCard.jsx         # Individual course card
    CertificationSection.jsx
    CertificationCard.jsx
    PracticalLearning.jsx
    FeatureGrid.jsx
    PartnerSection.jsx
    CTASection.jsx
    Footer.jsx

  pages/
    Home.jsx         # Main homepage assembly

  data/
    courses.js       # Learning path data (backend-configurable)
    certifications.js # Certification program data
    statistics.js    # Platform statistics

  index.css          # Tailwind CSS v4 + custom theme
  main.jsx
  App.jsx

vite.config.js
package.json
index.html
```

## Connecting to Backend

All data is currently in `src/data/*.js` files.
Replace with API calls (e.g., `fetch('/api/courses')`) when backend is ready.

The `statistics.js`, `courses.js`, and `certifications.js` files are clearly
commented for backend integration.
