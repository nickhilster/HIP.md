# HIP.md — Human Interface Protocol

## A lightweight calibration protocol for human-agent collaboration in software workspaces

### Version

v0.1 — Working whitepaper draft

---

## Executive Summary

AI coding agents are becoming increasingly capable of reading repositories, writing code, editing files, running tests, summarizing diffs, and proposing architecture. Yet most agentic workspaces still have a missing layer: the agent may understand the codebase, but not the human directing the work.

A repo can tell an agent what commands to run. It can tell the agent how tests work. It can tell the agent what style guide to follow. It can tell the agent which files matter.

But it usually does not tell the agent how to collaborate with the human.

That gap matters.

A senior engineer, a non-technical founder, a designer-builder, a student, a product manager, and a domain expert may all use the same agent inside the same kind of repo. They may ask for similar outcomes, but they do not need the same collaboration style. Some want terse diffs. Some want careful explanations. Some want the agent to move fast. Some want approval before every meaningful change. Some are learning. Some are shipping. Some are protecting production.

HIP.md, the Human Interface Protocol, proposes a simple open-source pattern for this missing layer.

HIP.md is not a personality profile. It is not a biography. It is not a private diary. It is not a way for agents to psychoanalyze users.

HIP.md is a lightweight calibration protocol that helps an agent understand the human interface of a repo: the human’s role in the work, technical fluency, autonomy expectations, risk tolerance, explanation preferences, review workflow, and definition of done.

The core principle is simple:

> Before an agent acts on the codebase, it should understand the human directing the work.

Not personally. Operationally.

HIP.md gives agents a consent-based way to ask, classify lightly, adapt, and update over time.

---

## 1. The Problem: Agents Are Repo-Aware but Human-Blind

Modern AI coding agents are increasingly good at reading technical context. They can inspect files, infer framework choices, detect package managers, follow project conventions, and generate implementation plans.

The surrounding ecosystem is also maturing. Agent instruction files, project memory files, and LLM-friendly documentation standards all help machines understand technical environments more reliably.

This is useful. But it is incomplete.

Most agent context files answer questions like:

- What is this project?
- How do you install dependencies?
- How do you run tests?
- What coding conventions should be followed?
- Which files should be avoided?
- How should pull requests be written?

They usually do not answer questions like:

- Who is directing this work?
- How technical is this human in this specific repo?
- Is the human trying to learn, ship, explore, debug, or maintain?
- Should the agent ask before acting?
- Should the agent explain every step, summarize tradeoffs, or stay quiet unless there is risk?
- What kind of feedback does the human actually want?
- What does “done” mean to this human?

Without this layer, the agent guesses.

Sometimes it guesses correctly. Often it does not.

A highly capable agent can still frustrate a human by over-explaining obvious details, under-explaining risky changes, asking too many questions, acting too autonomously, failing to ask before touching critical systems, or declaring work complete before the human can actually use it.

These are not only technical failures. They are interface failures.

The human-agent interface is under-specified.

HIP.md exists to specify it.

---

## 2. The Core Idea

HIP.md stands for Human Interface Protocol.

It is a repo-local calibration protocol that helps an AI agent learn how to collaborate with the human directing the work.

The key phrase is “in this work.”

A human should not be reduced to a single static profile. The same person may be a senior operator in one project, a learner in another, a non-technical stakeholder in another, and a domain expert in another.

HIP.md does not ask, “Who are you as a person?”

It asks:

> What role are you playing in this repo, and how should an agent work with you here?

This distinction keeps HIP practical, respectful, and privacy-minimal.

The goal is not to know everything about the human. The goal is to know enough to collaborate well.

---

## 3. Why “Human Interface”?

Software people already understand interfaces.

An API defines how systems communicate.
A CLI defines how humans operate software.
A UI defines how users interact with tools.
A README defines how humans understand a project.
An agent instruction file defines how agents should behave inside a repo.

But the human directing the agent also has an interface.

That interface includes:

- how they communicate
- how much technical context they have
- how much autonomy they grant
- how they make decisions
- how they handle risk
- how they prefer feedback
- what “done” means to them

HIP.md treats that interface as first-class project context.

This does not make the human less human. It does the opposite. It stops the agent from flattening every human into the same assumed user.

A human is not just a prompt source.
A human is the holder of intent, context, taste, judgment, responsibility, and lived experience.

The agent may have access to more indexed knowledge. The human carries situated judgment.

HIP.md is the bridge between those two forms of intelligence.

---

## 4. What HIP.md Is Not

HIP.md should stay narrow.

It is not:

- a biography
- a personality test
- a medical or psychological profile
- a therapy intake form
- a diary
- a place for secrets
- a replacement for task instructions
- a replacement for repo instructions
- a system for ranking humans by technical ability
- a way for agents to infer private personal information

HIP.md should not collect sensitive personal data by default.

It should avoid information about health, trauma, religion, politics, home address, family details, private employer information, passwords, keys, tokens, or anything unrelated to the work.

The protocol should be operational, not intrusive.

A good HIP.md helps the agent answer:

> How should I work with this human in this repo?

It should not attempt to answer:

> Who is this human in full?

That boundary matters.

---

## 5. The Seven Principles of HIP.md

### 1. Ask, don’t assume

The agent should not infer the human’s technical ability, role, preference, or intention from writing style, confidence, grammar, job title, or repo ownership.

It should ask directly and lightly.

### 2. Calibrate to the work, not the whole person

HIP.md describes the human’s relationship to this project. It does not define the human across all contexts.

### 3. Multiple choice first, nuance second

Open-ended onboarding creates friction. HIP should start with structured choices and allow clarification afterward.

The human should not have to write an essay just to make an agent useful.

### 4. Autonomy must be explicit

The agent should know what it can do without asking and where it must stop for approval.

This is especially important around architecture, dependencies, auth, data, deployment, migrations, payments, legal copy, and production systems.

### 5. “Done” must be defined

Agents often treat “done” as “files changed.” Humans often mean “usable, tested, explained, deployed, reviewed, or ready to hand off.”

HIP should make this explicit.

### 6. Privacy must be minimal

HIP should only collect information that improves collaboration. If a detail does not help the agent work better in the repo, it probably does not belong.

### 7. Correction should improve the protocol

When the human repeatedly corrects the same agent behavior, the agent should ask whether HIP.md should be updated.

The file should evolve, but only with human awareness.

---

## 6. The Calibration Dimensions

HIP.md can begin with a short first-run calibration. The goal is not to create a long profile. The goal is to create a compact working agreement.

A strong HIP calibration should cover the following dimensions.

### 1. Relationship to the repo

What role is the human playing here?

Possible answers:

- main developer
- technical founder
- non-technical founder
- designer-builder
- product manager
- student or learner
- maintainer
- researcher
- client or stakeholder
- domain expert
- operator directing implementation

This determines how the agent frames help.

### 2. Technical fluency

Technical ability is not one thing.

HIP should break it into practical areas:

- code fluency
- Git fluency
- terminal fluency
- debugging fluency
- deployment fluency
- architecture fluency
- database fluency
- package/dependency fluency

A human may understand product architecture but not terminal commands. Another may write code comfortably but dislike deployment tasks. Another may understand the business domain deeply but not the stack.

HIP should capture this without judgment.

### 3. Primary intent

Why is the human using the agent here?

Possible answers:

- ship a feature
- debug a problem
- learn the stack
- prototype quickly
- refactor safely
- document the system
- prepare a demo
- maintain production code
- explore an idea
- create investor/client/stakeholder-facing material

Intent changes behavior.

A learning session should not feel like delegated implementation. A production maintenance task should not feel like a wild prototype sprint.

### 4. Autonomy level

How much can the agent do before asking?

Possible answers:

- ask before every meaningful change
- make small safe edits only
- make changes but pause before structural decisions
- act autonomously and summarize afterward
- operate like a pair programmer
- operate like a delegated implementation partner

This is one of HIP’s most important settings.

### 5. Explanation depth

How much explanation does the human want?

Possible answers:

- explain step by step
- explain briefly
- explain only tradeoffs
- explain only risks
- explain only when asked
- teach me as we go
- give me the result first, then the reasoning

This prevents both patronizing over-explanation and dangerous under-explanation.

### 6. Risk tolerance

What mode is the project in?

Possible answers:

- conservative: preserve what works
- balanced: improve carefully
- prototype: move fast, polish later
- experimental: try bold changes
- production-safe: no risky changes without approval

Risk tolerance should be repo-specific and may change over time.

### 7. Decision style

How should the agent present decisions?

Possible answers:

- give one clear recommendation
- show tradeoffs and choose a path
- offer options and let the human choose
- optimize for speed
- optimize for maintainability
- optimize for user experience
- optimize for cost
- optimize for simplicity
- optimize for learning

This helps the agent avoid generic option dumps.

### 8. Feedback style

How should the agent challenge the human?

Possible answers:

- be direct
- be gentle
- challenge weak assumptions
- warn only on serious issues
- act like a senior reviewer
- act like a patient teacher
- act like an execution partner

The right feedback style depends on the human’s purpose and state of work.

### 9. Implementation boundaries

What should the agent avoid touching without approval?

Examples:

- authentication
- payments
- database schema
- production data
- environment variables
- deployment configuration
- analytics
- legal or policy text
- security rules
- design system
- public copy
- generated files
- migrations

This prevents accidental damage.

### 10. Review workflow

How should the work be checked?

Possible answers:

- show a plan first
- show diffs after changes
- run tests
- provide manual QA steps
- explain changed files
- create a PR summary
- ask for approval before the next phase
- produce a checklist

This turns collaboration into a loop instead of a black box.

### 11. Definition of done

What does completion mean?

Possible answers:

- code changed
- code compiles
- tests pass
- feature works locally
- UI is previewed
- deployed successfully
- documented
- risks are listed
- manual QA steps are provided
- next steps are clear
- human can explain the change to someone else

This is one of the highest-leverage parts of HIP.

### 12. Update triggers

When should HIP.md be revised?

Possible triggers:

- the human corrects the same behavior twice
- the project shifts from prototype to production
- the human gains technical fluency
- the agent oversteps autonomy
- the agent asks too many unnecessary questions
- the agent under-explains risk
- the definition of done changes
- a new collaborator joins

HIP should evolve only when it improves future collaboration.

---

## 7. The First-Run Experience

HIP should begin as a short calibration conversation.

The agent might say:

> I do not know your operating mode in this repo yet. Before I start, I’ll ask a few short questions so I can collaborate properly. Pick the closest answer. You can correct anything afterward.

Then the agent asks a small set of structured questions:

1. What is your relationship to this repo?
2. How technical are you across code, Git, terminal, and deployment?
3. What are you trying to do here: ship, learn, prototype, debug, maintain, or explore?
4. How much autonomy should I take?
5. How much explanation do you want?
6. What risk mode are we in?
7. What should I avoid touching without approval?
8. What does “done” usually mean to you?

After the answers, the agent summarizes:

> I will treat you as a designer-builder with medium technical fluency, strong product ownership, medium autonomy, concise explanations, prototype-friendly risk tolerance, and approval required before deployment, auth, database, or payment changes.

The human can then correct it:

> More technical than that.

Or:

> Less autonomy. Ask before changing architecture.

Or:

> Explain deployment steps more clearly.

Those corrections are not failures. They are the calibration working.

---

## 8. The Generated Output

The output should be compact.

A good HIP.md should not become a giant personality essay. It should be short enough that an agent can read it every session without crowding out task context.

A generated profile might look like this:

```md
# HIP.md — Human Interface Protocol

## Human Operating Mode

Role in this repo: Designer-builder / product operator
Technical fluency: Medium-high overall; stronger in product, UX, systems thinking, and AI workflows; lighter in low-level implementation details
Primary intent: Build and ship usable prototypes while preserving strategic clarity
Autonomy level: Medium-high; proceed on safe implementation tasks, pause before structural changes
Explanation depth: Concise by default; explain risks, tradeoffs, deployment steps, and architectural decisions
Risk tolerance: Prototype-fast, but protect working branches and deployable states
Decision style: Recommend a path, explain tradeoffs briefly, avoid vague option dumps
Feedback style: Direct, practical, and grounded

## Approval Required Before

- changing auth
- changing database schema
- installing major dependencies
- touching deployment config
- deleting files
- modifying payment/legal/security-related flows

## Definition of Done

Work is not done until:

- the change is usable or clearly ready for testing
- risks are stated
- files changed are summarized
- next steps are clear
- the human can understand what changed and why

## Update Rule

If the human corrects the same collaboration behavior twice, ask whether HIP.md should be updated.
```

This is enough.

The file should be useful, not exhaustive.

---

## 9. How HIP.md Fits Beside Existing Files

HIP.md is not meant to replace existing project files.

It is meant to sit beside them.

A typical repo might contain:

```txt
README.md        → explains the project
AGENTS.md        → explains how agents should work in the repo
HIP.md           → explains how agents should collaborate with the human operator
CONTRIBUTING.md  → explains how humans contribute
```

The distinction matters.

README.md tells a human what the project is.
AGENTS.md tells an agent how the project works.
HIP.md tells an agent how the human works with the agent.

If there is conflict:

1. explicit user instruction comes first
2. safety and privacy come first
3. project constraints come before style preferences
4. AGENTS.md governs repo behavior
5. HIP.md governs human collaboration behavior

HIP.md should not override tests, security rules, legal obligations, or production constraints.

It should shape collaboration, not rewrite reality.

---

## 10. Privacy and Safety Boundaries

HIP.md must be designed with restraint.

The agent should not ask for more personal context than needed. It should not infer sensitive traits. It should not turn the human into a psychological object.

Good HIP fields:

- role in this repo
- technical comfort
- autonomy preference
- explanation preference
- risk tolerance
- review workflow
- definition of done
- approval boundaries

Bad HIP fields:

- medical history
- trauma history
- private family details
- home address
- political affiliation
- religion
- private employer secrets
- passwords
- API keys
- personal identity details unrelated to the work

Optional private local context can exist, but it should be separate and ignored by default.

For example:

```txt
HIP.md           → safe repo-level collaboration protocol
HIP.private.md   → optional local-only context, gitignored
```

The default should be safe enough for open-source use.

---

## 11. Why This Matters

The future of software work will not only be agent-to-code. It will be human-to-agent-to-code.

That middle layer matters.

If the agent misunderstands the human, the work suffers even if the code is technically valid.

A human may ask for a feature but really need a prototype.
A human may ask for a fix but need an explanation.
A human may ask for speed but still need approval gates.
A human may ask for help but not want to surrender control.
A human may be non-technical but still carry the most important context in the room.

HIP.md gives that context a place to live.

It says:

> The human is not noise around the repo. The human is part of the system.

Not as an object to optimize away.
As the source of direction.

The agent can execute. The human carries judgment.
The agent can retrieve. The human carries meaning.
The agent can generate. The human carries responsibility.

Better collaboration begins when both sides are understood correctly.

---

## 12. Adoption Path

HIP.md should start small.

### Phase 1: Gist

Publish a simple open-source gist containing:

- the concept
- the first-run calibration prompt
- the core dimensions
- a sample generated HIP.md
- guidance for adding it beside AGENTS.md

### Phase 2: Repo Template

Create a minimal repo template:

```txt
HIP.md
AGENTS.md snippet
examples/
  designer-builder.md
  non-technical-founder.md
  senior-engineer.md
  learner.md
  maintainer.md
```

### Phase 3: Agent Command

Define a command agents can run:

```txt
/init-hip
```

The command starts the calibration flow and generates HIP.md.

### Phase 4: Tooling

Optional future tooling could include:

- a CLI wizard
- VS Code extension support
- GitHub template integration
- agent-specific adapters
- team-level HIP profiles
- project mode presets

But the protocol should not depend on tooling.

The first version should work as a single markdown file.

---

## 13. The Human Layer

HIP.md is a technical proposal, but it is also a human one.

The most important thing it protects is not productivity. It is dignity.

A non-technical founder should not be treated as ignorant.
A senior engineer should not be buried in beginner explanations.
A designer should not be forced to pretend they are a backend developer to direct product work.
A student should not be rushed past the learning they came for.
A maintainer should not have to repeatedly remind the agent not to break production.
A domain expert should not be dismissed because they do not speak in code.

Human-agent collaboration should not require every human to become the same kind of user.

HIP.md gives the agent a way to ask:

> How should I meet you where you are in this work?

That is the human interface.

---

## 14. Closing Thesis

AI agents do not only need better access to code.
They need better alignment with the humans directing them.

Project context tells an agent what to work on.
Human context tells an agent how to work with care.

HIP.md is a small file with a larger purpose:

> Make the human legible to the agent without reducing the human to data.

The goal is not to make agents more obedient.
The goal is to make collaboration more precise, respectful, and useful.

Before the agent acts, it should calibrate.
Before it assumes, it should ask.
Before it optimizes the work, it should understand the human interface.

That is HIP.md.

Human Interface Protocol.

A simple bridge between human judgment and machine execution.

