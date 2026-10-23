
# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using `yarn build-image`

# --- Builder: install prod deps and unpack the bundle
FROM dhi.io/node:26-alpine3.24-dev@sha256:393f63498dc3739e4a1cc9e618261927d74663ab023b96b38d29c57199702dc6 AS build

RUN corepack enable

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
# If sqlite3 is not needed anymore, remove libsqlite3-dev and better-sqlite3.
RUN apk add --no-cache python3 make g++ gzip sqlite-dev

RUN mkdir -p /home/node/.cache

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# Copy files needed by Yarn
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY backstage.json ./

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV=production

# Required by Backstage Scaffolder on Node 20+
ENV NODE_OPTIONS="--no-node-snapshot"

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.cache,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus -A --production && yarn cache clean

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# --- Runtime
FROM dhi.io/node:26-alpine3.24@sha256:7414bc798500cef3c2300e34a5582a775fc46d29569527dd62a216c15b12c60f

ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"
WORKDIR /app

COPY packages/backend/src/instrumentation.js ./
COPY --from=build /app /app

ENTRYPOINT ["node"]
CMD ["--require","./instrumentation.js","packages/backend","--config","app-config.yaml","--config","app-config.production.yaml", "--config","app-config.runtime.yaml"]
