# WCT Tasks

Volunteer task hub for the Wolcott Community Trust. A single static page (`index.html`): pick a task, follow the steps, request a helper, and log status. Progress is saved in the visitor's browser (localStorage).

## Run locally

Open `index.html` in a browser, or run `npx serve .`.

## Deploy on Vercel

No framework needed. `npm run build` copies `index.html` to `dist/`, which matches Vercel's default output directory.

## Editing tasks

Sample tasks live in the `seed()` function in the `<script>` block of `index.html`.
