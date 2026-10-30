# WCT Tasks

Volunteer task hub for the Wolcott Community Trust Old Schoolhouse project. One static page (`index.html`): pick a task, sign up to lead or help, follow the steps, request a helper, and log status. Everyone sees the same tasks, owners, helpers, statuses, and updates.

## Saving data in a Google Sheet

Tasks and sign-ups live in a Google Sheet through a small Apps Script (`apps-script/Code.gs`). Follow `SHEET_SETUP.md`, then set `SHEET_API_URL` in Vercel and redeploy. Volunteer emails and phone numbers stay in the sheet and are never sent to the page.

Without `SHEET_API_URL` the page runs in preview mode with sample tasks saved only in the visitor's browser.

## Run locally

    npm run build            # writes dist/index.html
    SHEET_API_URL="https://script.google.com/macros/s/.../exec" npm run build

Open `dist/index.html` in a browser. There are no dependencies to install.

## Deploy on Vercel

No framework. `npm run build` fills in the sheet address and writes `dist/`, which is Vercel's default output directory.
