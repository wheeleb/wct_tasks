// Static site: copy index.html into dist/ so Vercel's default "npm run build" + "dist" settings work.
import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
copyFileSync('index.html', 'dist/index.html');
console.log('Built dist/index.html');
