# WCT Tasks

Volunteer task board for the Wolcott Community Trust Old Schoolhouse project.

## Run locally

    npm install
    npm run dev

## Build

    npm run build

The site is built with Vite, React and Tailwind. The dashboard lives in `src/App.tsx`; task text is in the `INITIAL_TASKS` list at the top of that file.

## Deploy on Vercel

Import this repository at vercel.com/new. Vercel detects Vite automatically (build command `npm run build`, output directory `dist`).

## Saving volunteer sign-ups

Sign-ups and updates are saved in a Google Sheet. See `SHEET_SETUP.md` for the setup steps. Until `VITE_SHEET_API_URL` is set, the site runs in preview mode and nothing is saved.
