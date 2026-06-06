# HIP.md Intake Form

A standalone web form for generating `HIP.md` — the Human Interface Protocol calibration file.

No server. No database. No build step. Pure HTML/CSS/JS.

## Deploy to Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

That's it. Vercel auto-detects the static file. Your form is live at the URL it prints.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to Settings → Pages
3. Set source to `main` branch, `/ (root)`
4. Your form is live at `https://<username>.github.io/<repo>`

## Run locally

```bash
open index.html
```

Or with a local server:

```bash
npx serve .
# → http://localhost:3000
```

## What it does

1. Asks 5 required calibration questions (role, fluency, autonomy, boundaries, definition of done)
2. Optional section for explanation depth, risk tolerance, decision style, feedback style
3. Generates a `HIP.md` file with syntax highlighting
4. Download `.md` directly or copy to clipboard

## Adding to a repo

After downloading, move `HIP.md` to your repo root alongside `AGENTS.md` or `CLAUDE.md`.

## License

MIT — Teambotics
