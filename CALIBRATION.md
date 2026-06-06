# HIP.md First-Run Calibration

This document defines the canonical first-run calibration flow for HIP.md.
Implementations may vary the UI, but they should preserve the same prompt order, use structured choices, allow review before write, and avoid collecting anything outside repo collaboration needs.

## Canonical Flow

### Preflight

If `HIP.md` already exists, ask:

```txt
HIP.md already exists. Overwrite it?
```

If the human declines or cancels, exit without writing.

### Prompt Sequence

| Step | Prompt | Input type | Writes to |
|------|--------|------------|-----------|
| 1 | `What is your relationship to this repo?` | Select | `Role in this repo` |
| 2 | `How would you describe your overall technical fluency here?` | Select | `Technical fluency` |
| 3 | `What are you primarily trying to do here?` | Select | `Primary intent` |
| 4 | `How much autonomy should the agent take?` | Select | `Autonomy level` |
| 5 | `How much explanation do you want?` | Select | `Explanation depth` |
| 6 | `What risk mode is this project in?` | Select | `Risk tolerance` |
| 7 | `What should the agent avoid touching without your explicit approval? (select all that apply)` | Multi-select | `Approval Required Before` |
| 8 | `What does "done" mean to you? (select all that apply)` | Multi-select | `Definition of Done` |
| 9 | `Write HIP.md with these settings?` | Confirm | Write or restart |

### Review Step

Before step 9, show a review summary containing the selected values for:

- `Role in this repo`
- `Technical fluency`
- `Primary intent`
- `Autonomy level`
- `Explanation depth`
- `Risk tolerance`
- `Approval Required Before`
- `Definition of Done`

Also show the current reference defaults:

- `Decision style: One clear recommendation`
- `Feedback style: Direct`

If the human declines the final confirmation, restart the calibration so answers can be corrected before any file is written.

## Value Sets

The structured choices for role, intent, autonomy, explanation depth, and risk tolerance should use the valid values defined in [SPEC.md](SPEC.md).

The reference CLI currently offers the following multi-select values.

### Approval Required Before

- `authentication`
- `database schema`
- `environment variables`
- `deployment configuration`
- `payment flows`
- `legal or policy text`
- `security rules`
- `migrations`
- `design system`
- `public copy`
- `generated files`

If none are selected, write `(none specified)`.

### Definition of Done

- `the change is usable or clearly ready for testing`
- `tests pass`
- `feature works locally`
- `UI is previewed`
- `deployed successfully`
- `risks are stated`
- `files changed are summarized`
- `next steps are clear`
- `I can explain the change to someone else`

At least one definition-of-done item must be selected.

## Behavioral Rules

- Use structured choices only, not open-ended questions.
- If the human cancels at any point, exit without writing files.
- Generate a `HIP.md` that conforms to [SPEC.md](SPEC.md).
- After writing `HIP.md`, the tool may offer to patch existing agent instruction files such as `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, and `copilot-instructions.md`.
- The flow must not request secrets, credentials, or private information unrelated to repo collaboration.