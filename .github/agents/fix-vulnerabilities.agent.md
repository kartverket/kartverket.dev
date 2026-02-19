---
name: fix-vulnerabilities
description: Fetches open Dependabot and code scanning alerts for kartverket/kartverket.dev via the GitHub CLI, fixes them in the codebase, and opens a pull request with the changes.
tools: ["read", "edit", "search", "shell", "create"]
---

Fix open vulnerability alerts in `kartverket/kartverket.dev` (a Backstage monorepo using Yarn workspaces), verify the app still builds and starts, and open a pull request.

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

## Step 3 — Create a branch

```bash
git checkout -b fix/vulnerability-remediation
```

---

## Step 4 — Fix Dependabot alerts

### 4a. Try a Backstage bulk upgrade first

Many alerts stem from outdated Backstage packages. A bulk upgrade often resolves them all at once and keeps the packages mutually compatible:

```bash
yarn backstage-cli versions:bump
yarn install
```

Re-run the Dependabot query from Step 1. Only move on to individual package pins for alerts that are **still open** after the bulk upgrade.

### 4b. Fix remaining alerts individually

For each remaining alert, add a `resolutions` entry in the root `package.json` and run `yarn install`:

```json
"resolutions": {
  "<package>": "<patched_version>"
}
```

For direct dependencies you can also use:

```bash
yarn up <package>@<patched_version>
```

> **Compatibility warning:** Forcing a package to a newer version via resolutions may introduce incompatibilities with other packages in the monorepo. After applying resolutions, verify that all interdependent packages use mutually compatible versions. If a version conflict cannot be cleanly resolved, document the original alert as outstanding.

---

## Step 5 — Fix code scanning alerts

For each alert, read the flagged file at the reported line and apply the minimal fix (e.g. sanitise input, remove hardcoded credential reference, fix prototype pollution). Do not refactor unrelated code.

Code scanning alerts may originate from different scanners (e.g. CodeQL for code-level issues, Trivy/defsec for infrastructure and container misconfigurations). Tailor the fix to the scanner's finding — code-level alerts require source changes, while infrastructure alerts may require config file changes.

---

## Step 6 — Verify

Run type-check, lint, and format:

```bash
yarn tsc --noEmit
yarn lint:all
yarn run prettier:format
```

Fix any errors your changes introduced. Ignore pre-existing unrelated failures.

---

## Step 7 — Run the app

Start the app and confirm it boots without errors:

```bash
yarn dev
```

Watch the output for startup errors or crashes. If the app fails to start:

1. Use `git diff` and the error message to identify which change caused the failure.
2. Fix the error if possible (e.g. add a missing peer dependency pin, fix a broken import).
3. If it cannot be cleanly fixed, revert the specific offending change (`git checkout -- <file>`) and document it under **Outstanding issues** in the PR body.

---

## Step 8 — Commit

```bash
git add <changed files>
git commit -m "fix: remediate vulnerability alerts

- <one bullet per fix, e.g.: bump <package> <old-version> → <new-version> (CVE-XXXX-XXXX)>

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Step 9 — Open a pull request

Use `gh pr create` targeting `main` with a title of `fix: remediate Dependabot and code scanning alerts`. The PR body should include:

- **Summary** — brief description of what was fixed
- **Changes** — one bullet per fix
- **Testing** — confirm `yarn tsc --noEmit`, `yarn lint:all`, and `yarn dev` all pass
- **Dependabot alerts fixed** — linked list of resolved alerts
- **Code scanning alerts fixed** — linked list of resolved alerts
- **Outstanding issues** — alerts that could not be safely fixed, and why

---

## Rules

### Linking to alerts

Always use full URLs — never `#NNN`, which GitHub autolinks to issues and PRs.

- Dependabot: `https://github.com/kartverket/kartverket.dev/security/dependabot/<number>`
- Code scanning: `https://github.com/kartverket/kartverket.dev/security/code-scanning/<number>`

### Other rules

- **Never commit secrets.** If a code scanning alert involves an exposed secret, remove the reference without printing or logging the value.
- **Minimal changes only.** Only touch files directly related to a vulnerability.
- **Document what you can't fix.** If an alert has no patched version, requires a breaking change, or would break the app, add it to the "Outstanding issues" section of the PR body with a clear explanation.
- **Always keep the PR up to date.** After every commit to the branch (additional fixes, reverts, Backstage bumps, etc.), update the PR body via `gh pr edit` to accurately reflect what is currently fixed and what is still outstanding. Never leave the PR body describing a previous state of the branch.
- **Check the working tree first.** If there are uncommitted changes when you start, stop and ask the user how to proceed.
