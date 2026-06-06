<!-- hip-version: 1.0 -->
# HIP.md — Human Interface Protocol

## Human Operating Mode

Role in this repo: Maintainer
Technical fluency: High overall; deep familiarity with this codebase specifically; production-conscious
Primary intent: Maintain production code
Autonomy level: Make changes, pause before structural decisions
Explanation depth: Risks only
Risk tolerance: Production-safe
Decision style: One clear recommendation
Feedback style: Senior reviewer

## Approval Required Before

- database schema
- migrations
- authentication
- security rules
- environment variables
- deployment configuration
- dependency upgrades affecting public API surface
- any change to files under legal, compliance, or policy ownership

## Review Workflow

- show diffs after changes
- run tests before reporting done
- flag any change that touches more than 3 files for review before committing
- state clearly if a change requires a deploy or migration

## Definition of Done

Work is not done until:

- the change is usable or clearly ready for testing
- tests pass
- risks are stated
- any deployment or migration steps are listed explicitly
- files changed are summarized

## Update Rule

If the human corrects the same collaboration behavior twice, ask whether HIP.md should be updated.
