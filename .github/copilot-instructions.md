# Copilot Instructions for Kartverket.dev

## Build, Test, and Lint Commands

- **Install dependencies:**
  - `yarn install` (from repo root)
- **Start development (full app):**
  - `yarn dev` (from repo root)
- **Start frontend only:**
  - `yarn start` (from `packages/app`)
- **Start backend only:**
  - `yarn start-backend` (from repo root) or `yarn start` (from `packages/backend`)
- **Build all packages:**
  - `yarn build:all` (from repo root)
- **Build backend:**
  - `yarn build:backend` (from repo root)
- **Lint (changed files):**
  - `yarn lint` (from repo root)
- **Lint (all files):**
  - `yarn lint:all` (from repo root)
- **Format with Prettier:**
  - `yarn prettier:check` (check), `yarn prettier:format` (write)
- **Test a single package:**
  - `yarn workspace <package> test` (e.g., `yarn workspace @internal/plugin-function-kind-common test`)
- **Test all packages:**
  - Run `yarn test` in each package directory (most plugins/packages have a `test` script)

## High-Level Architecture

- **Monorepo managed by Yarn workspaces and Lerna**
  - Main code in `packages/` (frontend: `app`, backend: `backend`)
  - Plugins in `plugins/` (custom Backstage plugins, both frontend and backend)
- **Backstage-based developer portal**
  - Uses Backstage for service catalog, documentation, and plugin system
  - Configuration via `app-config.*.yaml` files (local, production, etc.)
- **Database**
  - Local: SQLite (see `app-config.local.yaml`)
  - Production: PostgreSQL (see `app-config.production.yaml` and `docker-compose.yaml`)
- **Authentication**
  - Microsoft, Google, and GitHub OAuth supported (see `app-config.local.yaml`)
- **CI/CD**
  - GitHub Actions workflows in `.github/workflows/`
- **Documentation**
  - TechDocs/MkDocs for service documentation (`mkdocs.yml`, `docs/`)

## Key Conventions

- **Plugin Development**
  - Create new plugins with `yarn new` from the repo root
  - Each plugin/package has its own README and scripts
  - Plugins can be run in isolation via `yarn start` in their directory
- **Configuration**
  - Local secrets and tokens go in `app-config.local.yaml` (never commit real secrets)
  - Use `mise` or `nvm` for Node version management (Node 22 required)
- **Catalog Onboarding**
  - Add new services/components to the catalog via templates or by editing `catalog-info.yaml`
  - See `/docs/getting-started/using-the-catalog.md` for onboarding
- **Proxy Endpoints**
  - Add proxy endpoints for local APIs in `app-config.yaml` under `proxy.endpoints`
- **Testing**
  - Most packages/plugins use `backstage-cli package test` for tests
  - Use Jest for unit/integration tests (see devDependencies)

---

For more details, see the main `README.md`, `CONTRIBUTING.md`, and each package/plugin's README.
