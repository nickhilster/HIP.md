# HIP.md Specification

**Version:** 1.0.0-draft  
**Status:** Working Draft  
**Repository:** nickhilster/spec

---

## 1. Purpose

HIP.md (Human Interface Protocol) is a repo-local markdown file that tells an AI agent how to collaborate with the human directing the work in this repository.

It is not a personality profile. It is a working agreement — scoped to this repo, this role, this intent.

---

## 2. File Locations

| File | Repo root | Tracked in git |
|------|-----------|----------------|
| `HIP.md` | Required | Yes (default) |
| `HIP.private.md` | Optional | No — must be gitignored |

If `HIP.private.md` exists, its sections extend `HIP.md`. In case of field conflict, `HIP.private.md` takes precedence. Agents must read both when present.

Agents must never commit `HIP.private.md` or include its contents in diffs, summaries, or PR descriptions.

---

## 3. Format

HIP.md is a UTF-8 encoded Markdown file. Sections are delimited by H2 headings (`## Section Name`). Agents parse sections by heading; unknown sections must be silently ignored to preserve forward compatibility.

Fields within sections use the inline key-value form:

```
Field name: value
```

Or a bullet list form:

```
- item
```

Both forms may coexist within a single file.

---

## 4. Version Declaration

HIP.md files should declare their spec version in an HTML comment on line 1:

```md
<!-- hip-version: 1.0 -->
```

Agents encountering an undeclared or unknown version must fall back to best-effort parsing.

---

## 5. Schema

### 5.1 `## Human Operating Mode` (Required)

The primary calibration section. Contains key-value fields describing the human's operational context in this repo.

#### Fields

| Field | Required | Type |
|-------|----------|------|
| `Role in this repo` | Yes | Enum |
| `Technical fluency` | Yes | Text or Structured |
| `Primary intent` | Yes | Enum |
| `Autonomy level` | Yes | Enum |
| `Explanation depth` | Yes | Enum |
| `Risk tolerance` | Yes | Enum |
| `Decision style` | No | Enum |
| `Feedback style` | No | Enum |

#### Valid Values

**Role in this repo**
- `Main developer`
- `Technical founder`
- `Non-technical founder`
- `Designer-builder`
- `Product manager`
- `Student / learner`
- `Maintainer`
- `Researcher`
- `Domain expert`
- `Operator directing implementation`

**Primary intent**
- `Ship a feature`
- `Debug a problem`
- `Learn the stack`
- `Prototype quickly`
- `Refactor safely`
- `Document the system`
- `Prepare a demo`
- `Maintain production code`
- `Explore an idea`

**Autonomy level**
- `Ask before every meaningful change` — agent asks before any edit with side effects
- `Small safe edits only` — agent makes low-risk local edits; asks for anything bigger
- `Make changes, pause before structural decisions` — agent acts freely on implementation; pauses for architecture, dependencies, schema
- `Act autonomously, summarize afterward` — agent acts and reports; human reviews the summary
- `Pair programmer` — agent proposes, human confirms, both iterate
- `Delegated implementation partner` — agent owns execution; human sets direction only

**Explanation depth**
- `Step by step` — explain each action and decision
- `Brief summaries` — summarize what changed and why
- `Tradeoffs and risks only` — skip obvious steps; surface decisions and hazards
- `Risks only` — flag problems; stay quiet otherwise
- `Only when asked` — no unsolicited explanation
- `Teach as we go` — explain concepts while executing; assume the human is learning
- `Result first, reasoning on request` — lead with the output; explain only if asked

**Risk tolerance**
- `Conservative` — preserve what works; prefer no-change over uncertain improvement
- `Balanced` — improve carefully; validate before committing
- `Prototype` — move fast; correctness matters more than polish
- `Experimental` — try bold approaches; failure is acceptable
- `Production-safe` — no change to production systems without explicit approval

**Decision style**
- `One clear recommendation` — agent picks a path and explains it briefly
- `Tradeoffs then recommendation` — agent surfaces tradeoffs, then recommends
- `Options, human decides` — agent lists options without choosing
- `Optimize for speed`
- `Optimize for maintainability`
- `Optimize for simplicity`
- `Optimize for learning`

**Feedback style**
- `Direct` — say what is wrong, clearly
- `Gentle` — soften corrections; maintain confidence
- `Challenge weak assumptions` — push back on unclear or risky decisions
- `Warn on serious issues only` — flag only high-impact concerns
- `Senior reviewer` — hold to production standards; don't soften feedback
- `Patient teacher` — frame corrections as learning opportunities
- `Execution partner` — focus on getting it done; minimize friction

---

### 5.2 `## Approval Required Before` (Required)

A bullet list of zero or more protected system areas. The agent must not modify any listed area without explicit human approval in the current session.

```md
## Approval Required Before

- authentication
- database schema
- environment variables
- deployment configuration
- payment flows
- legal or policy text
- security rules
- migrations
- design system
- public copy
- generated files
```

An empty section (or the literal text `(none specified)`) is valid and signals no additional gates beyond agent-platform defaults.

---

### 5.3 `## Definition of Done` (Required)

A bullet list describing what "done" means for completed work in this repo. Agents must not declare a task complete until all listed conditions are met, or must explicitly note which conditions remain.

```md
## Definition of Done

Work is not done until:

- the change is usable or clearly ready for testing
- risks are stated
- files changed are summarized
- next steps are clear
```

---

### 5.4 `## Update Rule` (Required)

A brief statement describing when and how HIP.md should be revised.

Minimum compliant value:

```md
## Update Rule

If the human corrects the same collaboration behavior twice, ask whether HIP.md should be updated.
```

---

### 5.5 `## Technical Fluency` (Optional)

A structured table for per-domain fluency when the inline text in `Human Operating Mode` is insufficient.

```md
## Technical Fluency

| Domain | Level |
|--------|-------|
| Code | High |
| Git | Medium |
| Terminal | Medium |
| Debugging | High |
| Deployment | Low |
| Architecture | High |
| Database | Medium |
| Dependencies | Medium |
```

Valid levels: `High`, `Medium`, `Low`, `Not applicable`

When this section is present, agents should prefer it over any fluency text in `Human Operating Mode`.

---

### 5.6 `## Review Workflow` (Optional)

Describes how the agent should check and present completed work.

```md
## Review Workflow

- show a plan before starting
- show diffs after changes
- run tests before reporting done
- ask for approval before the next phase
- produce a checklist for manual QA
```

---

### 5.7 `## Notes` (Optional)

Free-form additional context. Unstructured. Agents may read this section but must not treat its contents as structured fields.

---

## 6. Conflict Resolution

When multiple instruction files exist, apply this priority order (highest first):

1. Explicit user instruction in the current session
2. Safety and privacy requirements (always override)
3. Legal obligations and production constraints
4. Agent-platform instruction file (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, etc.) — governs repo behavior
5. `HIP.md` — governs human collaboration behavior
6. Agent platform defaults

HIP.md may not override tests, security rules, legal constraints, or production system safeguards.

---

## 7. Privacy Requirements

Implementations must not solicit, store, or infer:

- Medical, psychological, or health information
- Trauma history
- Political affiliation or religion
- Home address, government ID, or private family details
- Passwords, API keys, tokens, or secrets
- Private employer information unrelated to this repo
- Demographic attributes inferred from writing style or grammar

HIP.md must contain only information that directly improves agent collaboration in this repository.

---

## 8. Agent Compliance Requirements

An agent claiming HIP.md compliance must:

1. Read `HIP.md` at session start if present at repo root
2. Read `HIP.private.md` if present; merge with `HIP.md`; `HIP.private.md` wins on conflict
3. Apply `Autonomy level` to all actions taken in the session
4. Treat every entry in `Approval Required Before` as a hard gate — no exceptions without explicit in-session approval
5. Apply `Definition of Done` before declaring any task complete
6. Apply `Explanation depth` to all responses
7. Apply `Risk tolerance` when choosing between implementation options
8. When the human corrects the same agent behavior twice in a session, ask whether HIP.md should be updated

---

## 9. First-Run Calibration

When no `HIP.md` exists, a compliant agent or tool may offer to run calibration. Calibration must:

- Use structured choices (not open-ended questions)
- Allow the human to correct answers before writing the file
- Produce a file that conforms to this spec
- Not require any tool or package installation to trigger

The reference calibration CLI is defined at `nickhilster/create-hip`.
The canonical first-run prompt sequence for the reference implementation is documented in `CALIBRATION.md`.

---

## 10. Minimal Valid Example

```md
<!-- hip-version: 1.0 -->
# HIP.md — Human Interface Protocol

## Human Operating Mode

Role in this repo: Main developer
Technical fluency: High overall; comfortable with code, Git, and debugging; lighter on deployment
Primary intent: Ship a feature
Autonomy level: Make changes, pause before structural decisions
Explanation depth: Brief summaries
Risk tolerance: Balanced
Decision style: One clear recommendation
Feedback style: Direct

## Approval Required Before

- database schema
- environment variables
- deployment configuration

## Definition of Done

Work is not done until:

- the change is usable or clearly ready for testing
- tests pass
- risks are stated
- next steps are clear

## Update Rule

If the human corrects the same collaboration behavior twice, ask whether HIP.md should be updated.
```

---

## 11. Changelog

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0-draft | 2026-05-28 | Initial working draft |
