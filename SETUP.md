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
frontend/
  src/
    components/      # Shared UI, authentication, and common components
    context/         # Authentication context
    data/            # Course, certification, and statistics data
    pages/           # Public and role-specific Admin, Employee, and Partner pages
    services/        # API client and authentication service
    App.jsx
    index.css
    main.jsx
  public/            # Static icons and assets
  vite.config.js
  package.json

backend/
  src/
    controllers/      # Request handlers by feature
    data/             # JSON data used by the API
    db/               # JSON-backed data access
    middlewares/      # Authentication, validation, and error handling
    models/            # Course and user data access
    routes/            # API route handlers
    utils/             # Shared application utilities
    app.js             # API setup and route dispatch
    index.js           # REST API server entry point
  package.json

package.json          # Root workspace scripts
```

## Connecting to Backend

The frontend data currently lives in `frontend/src/data/*.js`, and the backend API
is available at `http://localhost:5000` when started with `npm run dev:backend`.
The backend reads its JSON collections from `backend/src/data/`.

The `statistics.js`, `courses.js`, and `certifications.js` files are clearly
commented for backend integration.
