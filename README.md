# SakuraReader 🌸

Cloudflare Pages × GitHub CI/CD · React 19 / Vite / TypeScript / Tailwind CSS 4 / EPUB.js

## Features
- EPUB 2/3 ZIP/container/OPF/spine validation before rendering
- EPUB.js reading and navigation
- Local-first IndexedDB books + saved CFI positions
- SakuraUI: seven semantic themes, mobile/tablet/desktop layouts
- Keyboard next/previous page and font-size settings

> EPUB files are not uploaded to Cloudflare. Browser storage is per-device; cross-device syncing is not implemented. DRM-protected books are not supported. EPUB security checks are preliminary, not an isolated sandbox.

## Development
```bash
npm install
npm run dev
npm run build
```

## Deployment
Cloudflare Pages project: `sakura-reader-git` (GitHub-integrated).
Source: `yanyu03/SakuraReader`, production branch `main`.
Build: `npm run build`; output `dist`; Node 22.
Every push to main triggers GitHub Actions validation and Cloudflare Pages production deployment. Pull requests create preview deployments.
Do not point `read.250221.xyz` away from the existing Worker before a successful Pages build and public browser smoke test.
