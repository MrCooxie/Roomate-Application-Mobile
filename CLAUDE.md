# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (React Native / Expo)

```bash
cd frontend

# Start dev server (choose platform)
npm run start        # interactive — choose platform after
npm run android      # Android emulator/device
npm run ios          # iOS simulator
npm run web          # browser

# Lint
npm run lint
```

### Backend (Flask)

```bash
cd backend

# Install dependencies (first time)
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Run server (port 5000)
python app.py
```

There are no tests configured in this project.

## Architecture

### Frontend

React Native mobile app built with **Expo** (SDK 54) and **expo-router** for file-based routing.

**Styling:** NativeWind v4 (Tailwind CSS for React Native). All styling uses `className` props with Tailwind utility classes. The `global.css` import is required in each screen file to activate NativeWind. Tailwind config is in `frontend/tailwind.config.js`. Brand color: `#8EC19D`.

**Routing:** expo-router stack navigator (`frontend/app/_layout.tsx`). All headers are hidden globally. Routes:
- `/` → `app/index.tsx` — main feed (Roommates / Apartments tabs)
- `/roommate/[id]` — roommate detail page
- `/apartment/[id]` — apartment detail page
- `/chat` — messaging hub (Messages / Matches tabs)
- `/conversation/[id]` — individual conversation
- `/settings` — settings with logout
- `/profile` — user profile (fetched from API)

**State management:** React Context providers in `frontend/context/`:
- `auth.tsx` — User authentication state with AsyncStorage persistence. Provides `user`, `login()`, `logout()`. `isLoggedIn` derived from `!!user`.
- `data.tsx` — Roommates/apartments data. Fetches from API with user_id for compatibility. Falls back to mock data.
- `quiz.tsx` — Multi-step registration quiz state. `submit()` returns registration result for auto-login.

**Mock data** lives in `frontend/data/` and is used as fallback when API is unreachable.

**Bottom navigation bar** is rendered via `components/NavBar.tsx` and wrapped by `components/ScreenLayout.tsx`.

**Image assets** are stored in `frontend/assets/images/`.

### Backend

Flask API server with Airtable as the database.

**Structure:**
- `backend/app.py` — Entry point, runs on `0.0.0.0:5000`
- `backend/app/__init__.py` — Flask app factory, CORS, blueprint registration
- `backend/app/config.py` — Config with Airtable credentials (env vars with hardcoded fallbacks)
- `backend/app/routes/` — API route blueprints
- `backend/app/services/` — Business logic (AirtableService, AuthService)

**API Endpoints** (all prefixed with `/api`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/login` | Login with email/password, returns user data + airtable_id |
| POST | `/register` | Create user account, returns airtable_id + user data |
| POST/GET | `/roommates` | Get roommates list. POST body `{user_id}` for compatibility calculation |
| GET | `/apartments` | Get apartment listings |
| GET | `/profile/<record_id>` | Get user profile by Airtable record ID |

### Database (Airtable)

Base ID: `apptrJWQiYgjwrNUS`

**Tables:**
- **Users** — firstName, lastName, email, password, username, id, age, school, city, userInterests (linked to Interests), profile picture, apartmentPreferences
- **Interests** — label, icon (attachment), Users (linked back to Users)
- **Housing** — id, address, description, priceValue, beds, image, maxTenants, sqft, Owners (linked)
- **Owners** — Name, id, Housing (linked), Age, Email, Profile Picture, City

### Auth Flow

1. **Registration:** Quiz screens collect data → `POST /api/register` → creates user in Airtable with password → returns airtable_id → frontend auto-logs in
2. **Login:** `POST /api/login` with email/password → validates against Airtable → returns airtable_id + user data → stored in AsyncStorage
3. **Logout:** Clears user from state + AsyncStorage

The `airtable_id` (Airtable record ID like `rec...`) is used as the user identifier for API calls (roommates compatibility, profile fetch).

### Compatibility Calculation

Uses **Jaccard similarity** on interest sets: `shared_interests / total_unique_interests * 100`. Calculated server-side when fetching roommates with a `user_id`. Bounded 0-100%.

## Configuration

- **Frontend API URL:** `frontend/config.ts` — must match the backend server IP/port
- **Airtable credentials:** `backend/app/config.py` — reads from env vars `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` with hardcoded fallbacks

## Known Limitations

- Passwords stored as plaintext in Airtable (no hashing)
- No JWT/session tokens — auth is stateless, user data stored client-side
- Chat/messaging is 100% mock data (no API integration)
- Profile pictures must be uploaded directly in Airtable
- No image upload from the app
- Apple/Google OAuth buttons are UI-only (not functional)
