# HIP.md — Human Interface Protocol

A lightweight calibration protocol that tells an AI agent how to collaborate with the human directing the work.

## The problem

A repo can tell an agent what commands to run, how tests work, and what style guide to follow. It usually cannot tell the agent who is directing the work, how much autonomy to take, what counts as done, or when to stop and ask.

HIP.md fills that gap.

## What it is

`HIP.md` is a small Markdown file placed at the root of a repo. An agent reads it at the start of every session. It captures:

- the human's **role** in this specific project
- their **technical fluency**
- the current **primary intent** (ship, learn, prototype, maintain, debug…)
- how much **autonomy** the agent may take
- how much **explanation** is wanted
- the project's **risk mode**
- which areas require **explicit approval** before the agent touches them
- what **done** means

It is not a biography or personality test — it is an operational collaboration contract for one repo.

## Quick start

### CLI (recommended)

```bash
npx create-hip
```

Run from the root of any repo. Asks eight short calibration questions, shows a review step, writes `HIP.md`.

Non-interactive:

```bash
npx create-hip --defaults              # minimal HIP, no prompts
npx create-hip --preset learner        # built-in preset
npx create-hip --preset senior-engineer
npx create-hip --list-presets          # list all presets
npx create-hip --bootstrap             # write a bootstrap HIP for agent-led calibration
npx create-hip --validate              # validate an existing HIP.md
```

### Bootstrap drop-in (agent-led)

```bash
npx create-hip --bootstrap
```

Writes a `HIP.md` bootstrap file at the repo root. When an AI agent finds it, it will run a localhost intake, inspect the repo, and replace the bootstrap file with a finalized repo-specific `HIP.md`.

### Web form

Open `final/index.html` in any browser or deploy it (zero build step — plain HTML). Fill in the calibration questions and download the generated `HIP.md`.

### Copy a preset

Copy any file from [`packages/create-hip/examples/`](packages/create-hip/examples/) to your repo root, rename it `HIP.md`, and edit any fields that don't fit.

## How agents should use HIP.md

Read `HIP.md` at the start of every session before touching any files. If `HIP.private.md` also exists at the repo root, read it and let it override any conflicting fields.

Treat the file as the collaboration contract for this session:

- **Autonomy level** — what you may do without asking
- **Approval Required Before** — what you must stop and confirm
- **Explanation depth** — how much commentary to include
- **Definition of Done** — what "finished" means for this human

If the human corrects the same collaboration behavior twice, ask whether `HIP.md` should be updated.

## Repo structure

```text
README.md                        ← this file
SPEC.md                          ← canonical HIP.md format specification
CALIBRATION.md                   ← first-run calibration flow reference
hip_md_whitepaper_v_0_1.md       ← full design rationale and adoption path
HIP.md                           ← this repo's own collaboration settings

packages/
  create-hip/                    ← Node CLI: npx create-hip
    src/
    examples/                    ← five ready-made HIP presets

final/                           ← standalone static web form (no build step)
  index.html
```

## Spec and docs

- [SPEC.md](SPEC.md) — normative format and field reference
- [CALIBRATION.md](CALIBRATION.md) — canonical first-run calibration flow
- [hip_md_whitepaper_v_0_1.md](hip_md_whitepaper_v_0_1.md) — design rationale, principles, adoption path

## License

MIT
