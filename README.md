# Pretty Meisie

React + TypeScript beauty catalogue for Pretty Meisie. Products are sourced from the Mooiste Meisie Nov–Dec 2026 PDF, sell prices include a 15% markup, and checkout opens WhatsApp to Chanese Van Der Berg (`0613438441`).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Netlify

Config is in [`netlify.toml`](netlify.toml):

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node:** 22

### Option A — Netlify UI

1. Push this repo to GitHub/GitLab/Bitbucket
2. In Netlify: **Add new site → Import an existing project**
3. Select the repo (settings are read from `netlify.toml`)
4. Deploy

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```
