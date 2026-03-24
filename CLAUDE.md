# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `frontend/` directory:

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

There are no tests configured in this project.

## Architecture

This is a React Native mobile app built with **Expo** (SDK 54) and **expo-router** for file-based routing.

**Styling:** NativeWind v4 (Tailwind CSS for React Native). All styling uses `className` props with Tailwind utility classes. The `global.css` import is required in each screen file to activate NativeWind. Tailwind config is in `frontend/tailwind.config.js`.

**Routing:** expo-router stack navigator (`frontend/app/_layout.tsx`). All headers are hidden globally. Routes:
- `/` → `app/index.tsx` — main feed (Roommates / Apartments tabs)
- `/roommate/[id]` — roommate detail page
- `/apartment/[id]` — apartment detail page
- `/chat` — messaging hub (Messages / Matches tabs)
- `/conversation/[id]` — individual conversation
- `/settings`, `/profile`

**Data layer:** Static mock data lives in `frontend/data/`:
- `roommates.ts` — `Roommate` type + `ROOMMATES` array
- `apartments.ts` — `Apartment` type + `APARTMENTS` array
- `messages.ts` — `Conversation` type + `CONVERSATIONS` array

The main feed (`index.tsx`) attempts to fetch live data from an API (URLs currently set to placeholder `"x"`), falling back to the static arrays when the fetch fails.

**Bottom navigation bar** is manually rendered as an absolute-positioned `View` at the bottom of each screen — there is no shared navigation component yet. Active icon color is `#111827` (dark), inactive is `#9ca3af` (gray).

**Image assets** are stored in `frontend/assets/images/` and referenced via `require()` in the data files.
