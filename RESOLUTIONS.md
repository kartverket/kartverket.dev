# Yarn Resolutions

This document explains each entry in the `resolutions` field of the root
`package.json`. Resolutions force specific versions of transitive dependencies
and should be reviewed regularly — remove an entry as soon as the upstream
parent ships a version that pulls in a safe dependency on its own.

## Type / UI resolutions (non-security)

| Resolution | Reason |
| --- | --- |
| `@types/react@18.3.12` | Pin React 18 types across the monorepo to avoid duplicate/conflicting type trees. |
| `@types/react-dom@18.3.7` | Same reason as above for `react-dom`. |
| `@mui/material@7.3.10` | Pin a single MUI major across all consumers to prevent duplicate MUI copies. |

## Security resolutions

Each entry below addresses one or more GitHub advisories flagged by
`actions/dependency-review-action` on the repo. React Router 6.x is
**intentionally not** resolved — Backstage has not migrated to React Router v7
yet, so we accept those moderate advisories until Backstage upgrades.

### `swagger-ui-react@^5.32.14`

- **Pulled in by:** `@backstage/plugin-api-docs` (transitively pins `5.31.0`)
- **Fixes (via bump):**
  - `dompurify` 3.2.6 → 3.4.14 — 15+ moderate/low XSS advisories
    (e.g. [GHSA-55q2-fjhq-7xh7](https://github.com/advisories/GHSA-55q2-fjhq-7xh7),
    [GHSA-cmwh-pvxp-8882](https://github.com/advisories/GHSA-cmwh-pvxp-8882))
  - `immutable` 3.8.4 → 4.3.9 — high-severity DoS
    ([GHSA-v56q-mh7h-f735](https://github.com/advisories/GHSA-v56q-mh7h-f735),
    [GHSA-xvcm-6775-5m9r](https://github.com/advisories/GHSA-xvcm-6775-5m9r))
  - `lodash` 4.17.23 → 4.18.1 (from swagger's side)
- **Remove when:** `@backstage/plugin-api-docs` ships with `swagger-ui-react ^5.32.0` or later.

### `fast-xml-parser@^5.7.1`

- **Pulled in by:** `@aws-sdk/xml-builder@3.969.0` (5.2.5), `@google-cloud/storage@7.18.0`
  and `openapi-sampler@1.6.2` (4.5.7)
- **Fixes:**
  - Critical: [GHSA-m7jm-9gc2-mpf2](https://github.com/advisories/GHSA-m7jm-9gc2-mpf2)
    (entity encoding bypass via regex injection)
  - Highs: [GHSA-37qj-frw5-hhjh](https://github.com/advisories/GHSA-37qj-frw5-hhjh),
    [GHSA-jmr7-xgp7-cmfj](https://github.com/advisories/GHSA-jmr7-xgp7-cmfj),
    [GHSA-8gc5-j5rx-235r](https://github.com/advisories/GHSA-8gc5-j5rx-235r)
  - Moderate: [GHSA-gh4j-gqv2-49f6](https://github.com/advisories/GHSA-gh4j-gqv2-49f6)
    (XMLBuilder comment/CDATA injection — requires `>= 5.7.0`)
- **Note:** `@google-cloud/storage@8.0.1` upstream uses `fast-xml-parser ^5.3.4`,
  which is still vulnerable to GHSA-gh4j, so the resolution remains necessary
  even after that upstream bump.
- **Remove when:** all consuming parents (AWS SDK, `@google-cloud/storage`,
  `openapi-sampler`) declare `fast-xml-parser >= 5.7.0`.

### `undici@^7.29.0`

- **Pulled in by:** `@module-federation/dts-plugin@2.5.0` (pinned to exact `7.24.7`)
- **Fixes:** 4 high-severity + 6 moderate advisories, notably
  [GHSA-vmh5-mc38-953g](https://github.com/advisories/GHSA-vmh5-mc38-953g)
  (TLS cert validation bypass via SOCKS5 ProxyAgent),
  [GHSA-4cwx-7wf7-3272](https://github.com/advisories/GHSA-4cwx-7wf7-3272)
  (cross-user info disclosure).
- **Remove when:** `@module-federation/dts-plugin` releases a version that no
  longer pins undici to an exact vulnerable version.

### `lodash@^4.18.1`

- **Pulled in by:** `@stoplight/spectral-functions@1.10.1` (pinned via `~4.17.21`)
- **Fixes:**
  - High: [GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc)
    (`_.template` code injection)
  - Moderate: [GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh)
    (`_.unset` / `_.omit` prototype pollution)
- **Remove when:** all Backstage / Stoplight parents declare `lodash ^4.18.0`
  (most Backstage packages already do; Stoplight is the remaining holdout).

### `prismjs@^1.30.0`

- **Pulled in by:** `refractor@3.6.0` (via older `react-syntax-highlighter@15.6.6`)
- **Fixes:** [GHSA-x7hr-w5r2-h6wg](https://github.com/advisories/GHSA-x7hr-w5r2-h6wg)
  (DOM clobbering).
- **Remove when:** all consumers use `react-syntax-highlighter@16.x`
  (which uses `refractor@5` and no longer pulls the old prismjs).

### `dompurify@^3.4.14`

- **Pulled in by:** `swagger-ui-react@5.31.0` (exact pin `=3.2.6`)
- **Fixes:** 15+ moderate/low XSS advisories including
  [GHSA-r47g-fvhr-h676](https://github.com/advisories/GHSA-r47g-fvhr-h676),
  [GHSA-hpcv-96wg-7vj8](https://github.com/advisories/GHSA-hpcv-96wg-7vj8),
  [GHSA-76mc-f452-cxcm](https://github.com/advisories/GHSA-76mc-f452-cxcm).
- **Note:** Kept as a defense-in-depth safety net alongside the
  `swagger-ui-react` bump; can likely be removed together with it once
  `plugin-api-docs` moves to swagger-ui-react 5.32+.

## Maintenance

- **Review cadence:** during weekly dependency review (or after any Dependabot
  alert closes) check whether each resolution is still required.
- **How to check:** for a given resolution, run
  `yarn why <package>` and confirm every listed parent declares a safe range.
  If all parents are safe, remove the resolution, run `yarn install`, and
  verify the dependency-review workflow still passes.
- **Do not add** resolutions for React Router 6.x — we stay on v6 until
  Backstage migrates.
