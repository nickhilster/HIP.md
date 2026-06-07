# nickhilster/spec

**How to use**

This product runs best inside the repository where it is dropped. Open `final/index.html` or deploy the `final/` static site from this repo, answer the calibration prompts, and download a ready-to-commit `HIP.md` file.

Once downloaded, keep `HIP.md` at the repo root alongside `AGENTS.md`, `CLAUDE.md`, or your other agent guidance docs. The page includes a built-in "How to use" popup for repeat onboarding and repo-local usage guidance.

HIP.md is a small repo-local Markdown contract that tells an AI agent how to work with the human directing the repository. It captures collaboration settings such as autonomy, explanation depth, approval gates, and definition of done in a format agents can parse at repo root.

## 30-Second Install

From the root of any repo:

```bash
npx create-hip
```

Then:

1. Answer the short structured calibration prompts.
2. Review the generated settings and confirm the write.
3. Commit `HIP.md`.
4. If prompted, let the CLI add the `HIP.md` reference block to `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, or `copilot-instructions.md`.

That is enough to make a repo HIP-aware without editor extensions, local scaffolding, or manual template copying.

The reference tooling now also supports reusable parsing and validation logic, built-in starter presets, non-interactive generation, and `HIP.private.md` templates for local-only collaboration context.

## What This Repo Contains

- [SPEC.md](SPEC.md) is the normative HIP.md format and compliance spec.
- [CALIBRATION.md](CALIBRATION.md) defines the canonical first-run prompt sequence.
- [hip_md_whitepaper_v_0_1.md](hip_md_whitepaper_v_0_1.md) explains the motivation, scope, and adoption path.

## What HIP.md Gives an Agent

A generated `HIP.md` tells the agent:

- who the human is in this repo
- what they are trying to do
- how much autonomy to take
- what must be approved first
- what counts as done
- when to ask whether the collaboration contract should be updated

## Status

This repo is the working draft of the HIP.md spec. The reference calibration CLI is published separately as `create-hip`.
