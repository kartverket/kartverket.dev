---
name: fix-vulnerabilities-and-bump-dependencies
description: Fetches open Dependabot and code scanning alerts for kartverket/kartverket.dev via the GitHub CLI, fixes them, proactively bumps all outdated dependencies (skipping packages newer than 5 days), verifies the app still builds and starts, and opens a pull request with changelog links and package age for each bumped dependency.
tools: ["read", "edit", "search", "shell", "create"]
---

Fix open vulnerability alerts and bump all outdated dependencies in `kartverket/kartverket.dev` (a Backstage monorepo using Yarn workspaces), verify the app still builds and starts, and open a pull request.

---

## Step 1 — Fetch open alerts

Use `gh api` with `--paginate` to fetch open alerts from both endpoints. If an endpoint returns 404 or "not enabled", note it and skip it.

- **Dependabot:** `gh api repos/kartverket/kartverket.dev/dependabot/alerts --paginate` — extract number, severity, package name/ecosystem, vulnerable range, patched version, and manifest path.
- **Code scanning:** `gh api repos/kartverket/kartverket.dev/code-scanning/alerts --paginate` — extract number, rule ID, severity, description, file path, start line, and message.

---

## Step 2 — Prioritise

Work through alerts in severity order: **critical → high → medium → low**.

For Dependabot alerts, only fix packages that have a `patched_version` value.

---

## Step 3 — Audit dependencies and existing resolutions

Before fixing anything, do a quick housekeeping pass:

- **Unused dependencies:** Check each package in `dependencies` and `devDependencies` across all `package.json` files. If a package is not imported anywhere in the codebase and has no clear purpose (e.g. a CLI tool or Backstage plugin listed in config), flag it for removal and remove it with `yarn remove <package>` in the relevant workspace.
- **Stale or unnecessary resolutions:** Review any existing `resolutions` in the root `package.json`. For each entry:
  - If the resolution is no longer needed (the parent package now naturally resolves to a safe version), remove it.
  - If the pinned version is outdated but still needed, upgrade it to the latest compatible patched version.

Run `yarn install` after any changes in this step.

---

## Step 4 — Create a branch

```bash
git checkout -b fix/vulnerability-remediation
```

---

## Step 5 — Fix Dependabot alerts

### 5a. Try a Backstage bulk upgrade first

Many alerts stem from outdated Backstage packages. A bulk upgrade often resolves them all at once and keeps the packages mutually compatible:

```bash
yarn backstage-cli versions:bump
yarn install
```

Re-run the Dependabot query from Step 1. Only move on to individual package fixes for alerts that are **still open** after the bulk upgrade.

### 5b. Fix remaining alerts individually

For each remaining alert, prefer fixing in this order:

1. **Remove the package** — if it is unused (identified in Step 3), removing it resolves the alert without any version pinning.
2. **Upgrade the direct dependency** — if the vulnerable package is a direct dependency, upgrade it with `yarn up <package>@<patched_version>` (or update the version in the relevant `package.json` and run `yarn install`).
3. **Resolutions (last resort)** — only use a `resolutions` entry in the root `package.json` if the vulnerable package is a transitive dependency that cannot be upgraded any other way:

```json
"resolutions": {
  "<package>": "<patched_version>"
}
```

Run `yarn install` after adding a resolution.

> **Compatibility warning:** Forcing a package to a newer version via resolutions may introduce incompatibilities with other packages in the monorepo. After applying resolutions, verify that all interdependent packages use mutually compatible versions. If a version conflict cannot be cleanly resolved, document the original alert as outstanding.

### 5c. Bump all remaining outdated dependencies

After addressing vulnerability alerts, proactively upgrade all remaining outdated packages to their latest compatible versions.

**First, apply the 5-day cooldown filter.** For each outdated package, check when the target version was published and skip it if it is newer than 5 days:

```bash
# Get publish date for a specific version
npm view <package>@<target-version> time --json 2>/dev/null | grep '"<target-version>"'

# Or for the latest tag
npm view <package> time.modified
```

Skip any package whose target version was published less than 5 days ago. Note it under **Outstanding issues** in the PR body with its publish date, so it can be picked up on the next run.

**For packages that pass the cooldown**, collect the following metadata before bumping (used later in the PR description):

```bash
# Publish date of the target version
npm view <package>@<target-version> time --json | grep '"<target-version>"'

# Changelog / repository URL
npm view <package> repository.url
```

Derive the changelog URL from the repository URL:
- GitHub repos: `https://github.com/<owner>/<repo>/blob/HEAD/CHANGELOG.md` (fall back to the releases page: `https://github.com/<owner>/<repo>/releases`)
- Otherwise link to the npm page: `https://www.npmjs.com/package/<package>?activeTab=versions`

**Then bump all eligible packages:**

```bash
yarn up '*'
yarn install
```

For each workspace that has its own `package.json`, repeat:

```bash
yarn workspace <workspace-name> up '*'
```

Verify the upgrade didn't break anything:

```bash
yarn tsc --noEmit && yarn lint:all
```

If verification fails:

1. Use `git diff package.json yarn.lock` to identify which packages changed.
2. Revert each failing package individually to its pre-bump version:
   ```bash
   yarn up <package>@<previous-version>
   yarn install
   ```
3. Re-run `yarn tsc --noEmit && yarn lint:all` after each revert until clean.
4. Document reverted packages under **Outstanding issues** in the PR body with the reason.

---

## Step 6 — Fix code scanning alerts

For each alert, read the flagged file at the reported line and apply the minimal fix (e.g. sanitise input, remove hardcoded credential reference, fix prototype pollution). Do not refactor unrelated code.

Code scanning alerts may originate from different scanners (e.g. CodeQL for code-level issues, Trivy/defsec for infrastructure and container misconfigurations). Tailor the fix to the scanner's finding — code-level alerts require source changes, while infrastructure alerts may require config file changes.

---

## Step 7 — Verify

Run type-check, lint, and format:

```bash
yarn tsc --noEmit
yarn lint:all
yarn run prettier:format
```

Fix any errors your changes introduced. Ignore pre-existing unrelated failures.

---

## Step 8 — Run the app

Start the app and confirm it boots without errors:

```bash
yarn dev
```

Watch the output for startup errors or crashes. If the app fails to start:

1. Use `git diff` and the error message to identify which change caused the failure.
2. Fix the error if possible (e.g. add a missing peer dependency pin, fix a broken import).
3. If it cannot be cleanly fixed, revert the specific offending change (`git checkout -- <file>`) and document it under **Outstanding issues** in the PR body.

---

## Step 9 — Commit

```bash
git add <changed files>
git commit -m "fix: remediate vulnerability alerts

- <one bullet per fix, e.g.: bump <package> <old-version> → <new-version> (CVE-XXXX-XXXX)>

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Step 10 — Open a pull request

Use `gh pr create` targeting `main` with a title of `fix: remediate Dependabot and code scanning alerts`. The PR body should include:

- **Summary** — brief description of what was fixed
- **Changes** — one bullet per fix; for dependency bumps include:
  - old version → new version
  - how old the new version was at time of bump (e.g. "published 12 days ago")
  - a link to the changelog or releases page (derived in Step 5c)
- **Testing** — confirm `yarn tsc --noEmit`, `yarn lint:all`, and `yarn dev` all pass
- **Dependabot alerts fixed** — linked list of resolved alerts
- **Code scanning alerts fixed** — linked list of resolved alerts
- **Outstanding issues** — alerts and skipped bumps that could not be safely applied, with reasons (include cooldown-skipped packages with their publish date)

---

## Rules

### Linking to alerts

Always use full URLs — never `#NNN`, which GitHub autolinks to issues and PRs.

- Dependabot: `https://github.com/kartverket/kartverket.dev/security/dependabot/<number>`
- Code scanning: `https://github.com/kartverket/kartverket.dev/security/code-scanning/<number>`

### Other rules

- **Never commit secrets.** If a code scanning alert involves an exposed secret, remove the reference without printing or logging the value.
- **Do not introduce worse vulnerabilities.** Before committing any dependency change, verify it does not introduce a new vulnerability of equal or higher severity than the one being fixed. If it does, revert the change and document the original alert as outstanding instead.
- **Minimal changes only.** Only touch files directly related to a vulnerability.
- **Document what you can't fix.** If an alert has no patched version, requires a breaking change, or would break the app, add it to the "Outstanding issues" section of the PR body with a clear explanation.
- **Always keep the PR up to date.** After every commit to the branch (additional fixes, reverts, Backstage bumps, etc.), update the PR body via `gh pr edit` to accurately reflect what is currently fixed and what is still outstanding. Never leave the PR body describing a previous state of the branch.
- **Roll back broken bumps individually.** When a dependency upgrade causes a build or lint failure, revert only the offending package to its previous version (`yarn up <package>@<previous-version>`). Never revert the entire lock file unless all individual reverts still leave the build broken.
- **Check the working tree first.** If there are uncommitted changes when you start, stop and ask the user how to proceed.
