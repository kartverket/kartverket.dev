
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
FROM node:22-bookworm-slim AS build

ENV PYTHON=/usr/bin/python3
RUN corepack enable

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
# If sqlite3 is not needed anymore, remove libsqlite3-dev and better-sqlite3.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

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

# This disables node snapshot for Node 20 to work with the Scaffolder
# Not sure if needed for Node 22.
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

# --- Runtime: distroless NodeJS
FROM gcr.io/distroless/nodejs22-debian12
ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"
WORKDIR /app

COPY package.json app-config*.yaml  ./
COPY --from=build /app /app

CMD ["packages/backend","--config","app-config.yaml","--config","app-config.production.yaml", "--config","app-config.runtime.yaml"]