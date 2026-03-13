---
name: upgrade
description: Upgrade project dependencies and config to match the latest create-vue scaffold
disable-model-invocation: true
argument-hint: "[all | deps | config | docs | verify | renovate]"
---

# Dependency & Config Upgrade

Upgrade this project's dependencies and tooling config to align with the latest create-vue scaffold. Work on a dedicated branch (e.g. `chore/fix-dependencies`).

## Fresh scaffold reference

The user provides a fresh create-vue scaffold as the reference baseline. If no scaffold path has been provided, **ask the user to create one** before proceeding.

## Current project state

!`cat package.json`

!`cat .nvmrc`

!`cat tsconfig.app.json`

!`cat tsconfig.node.json`

!`cat tsconfig.vitest.json`

!`cat vitest.config.ts`

!`cat eslint.config.ts`

!`cat .github/workflows/build.yaml`

## Scope

If `$ARGUMENTS` is provided, only run the matching phase:
- **deps** — Phase 1 only
- **config** — Phase 2 only
- **verify** — Phase 3 only
- **docs** — Phase 4 only
- **renovate** — Phase 5 only
- **all** or no argument — run all phases

## Phase 1: Dependency updates

1. Compare our `package.json` dependencies and devDependencies against the fresh scaffold provided by the user.
2. Identify outdated or mismatched packages. Propose updates but **do not auto-install** — present a summary table and wait for confirmation.
3. After approval, run `npm install` and confirm `npm ls` has no peer dependency issues.

## Phase 2: Config alignment

Do a fresh file-by-file comparison of each config file against the scaffold. Don't assume which fields will differ — let the diff speak for itself. Common files to compare:

- **tsconfig.app.json**
- **tsconfig.node.json**
- **tsconfig.vitest.json**
- **vitest.config.ts** — keep project-specific settings that the scaffold doesn't have but we need (e.g. `passWithNoTests` for a project with no test files).
- **.nvmrc** / `engines` — keep in sync with the Node version we're targeting.
- **.github/workflows/build.yaml** — check for stale hardcoded values and action version bumps.
- **eslint.config.ts** — compare against scaffold, keep project-specific plugins (e.g. oxlint).

Present a diff summary before applying changes.

## Phase 3: Verification

Run all checks and confirm they pass:

```bash
npm run type-check
npm run build
npm run lint
npm run test:unit
```

If a check fails, fix the issue and re-run. If stuck after two attempts, stop and ask the user.

## Phase 4: Documentation

After verification passes, check if `CLAUDE.md` has any statements now outdated by our changes and propose fixes. This includes but is not limited to:
- Node version in Prerequisites
- Lint pipeline description
- Build / verify commands

Also check this skill file itself — if any commands or file references changed, update them here too.

## Phase 5: Renovate PR cleanup

Check open Renovate PRs on GitHub (`https://github.com/brogli/blood-pressure-measure/pulls`) and identify which ones are now superseded by our changes. List them so the user can close them.

## Guidelines

- Always enter plan mode before starting work. Present the plan, get approval, then execute.
- Do not commit — leave that to the user.
- When in doubt about a change, ask. Especially for major version bumps.
- Keep project-specific deviations and document why they differ from the scaffold.
- For any autonomous decision (not directly backed by the scaffold), verify with credible online sources (official docs, release notes, GitHub issues) before proposing.
