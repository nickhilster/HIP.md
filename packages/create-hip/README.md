# create-hip

Generate a `HIP.md` file for any repository in a short guided calibration flow.

`HIP.md` is the Human Interface Protocol: a small repo-local Markdown contract that tells an AI agent how to collaborate with the human directing the work.

## Usage

```bash
npx create-hip
```

Run the command from the root of the repo you want to calibrate.

The CLI will:

1. Ask a short sequence of structured collaboration questions.
2. Show a review step so answers can be corrected before writing.
3. Generate `HIP.md` in the current repo.
4. Optionally patch `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, or `copilot-instructions.md` if they already exist.

## Non-Interactive Modes

Generate the default minimal HIP without prompts:

```bash
npx create-hip --defaults
```

Generate from a built-in preset:

```bash
npx create-hip --preset learner
```

List preset names:

```bash
npx create-hip --list-presets
```

Validate an existing `HIP.md` and sibling `HIP.private.md`:

```bash
npx create-hip --validate
```

Generate a local-only private template and patch `.gitignore`:

```bash
npx create-hip --defaults --private --patch-gitignore
```

The package also exports reusable library functions for parsing, validating, merging, and rendering HIP files.

## Requirements

- Node.js 18+

## Links

- Spec: `nickhilster/spec`
- Calibration flow: `nickhilster/spec/CALIBRATION.md`
