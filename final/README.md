# HIP.md Intake Form

A standalone web form for generating `HIP.md` — the Human Interface Protocol calibration file.

No server. No database. No build step. Pure HTML/CSS/JS.

This page is meant for manual generation. For the agent-led drop-in path, download the bootstrap `HIP.md`, place it at a repo root, and ask the agent to follow it. A local intake server can be launched from the repo using `npx create-hip --serve`, which serves the form on `localhost` and allows the agent or browser to save the final `HIP.md` back into the repo.

Agents must use the HTML intake for the manual/bootstrap path. They should not ask the human to answer the calibration questions in chat unless the human explicitly rejects the browser flow after it is offered.

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

1. Asks the core calibration questions for role, fluency, autonomy, boundaries, and definition of done
2. Optional section for explanation depth, risk tolerance, decision style, feedback style
3. Captures the feedback in the browser and shows a visual confirmation
4. Generates a `HIP.md` file with syntax highlighting
5. Download `.md` directly or copy to clipboard

## Adding to a repo

After downloading a finalized `HIP.md`, move it to your repo root alongside `AGENTS.md` or `CLAUDE.md`. For agent-led calibration, use the bootstrap download instead.

## License

MIT — Teambotics
