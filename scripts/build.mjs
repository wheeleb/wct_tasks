// Static site: copy index.html into dist/, filling in the Google Sheet web app address.
// Reads SHEET_API_URL (or the older VITE_SHEET_API_URL) from the build environment.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const url = (process.env.SHEET_API_URL || process.env.VITE_SHEET_API_URL || '').trim();
if (url && !/^https:\/\/[^\s'"<>]+$/.test(url)) {
  console.error('SHEET_API_URL must be an https:// address.');
  process.exit(1);
}
const html = readFileSync('index.html', 'utf8');
if (!html.includes("'__SHEET_API_URL__'")) {
  console.error('Placeholder __SHEET_API_URL__ not found in index.html');
  process.exit(1);
}
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html.replace("'__SHEET_API_URL__'", JSON.stringify(url)));
console.log(url ? 'Built dist/index.html (Google Sheet connected)' : 'Built dist/index.html (preview mode, no SHEET_API_URL set)');
