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

# ---- Builder ----
FROM node:22-bookworm-slim AS build

ENV PYTHON=/usr/bin/python3
ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"

# Install isolate-vm dependencies, these are needed by the @backstage/plugin-scaffolder-backend.
# If sqlite3 is not needed anymore, remove libsqlite3-dev and better-sqlite3.
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Use the least-privileged user even during build
RUN groupmod -g 150 node && usermod -u 150 -g 150 node
RUN corepack enable
RUN mkdir -p /home/node/.cache && chown -R node:node /home/node/.cache
USER node
WORKDIR /app

# Copy files needed by Yarn
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node backstage.json .
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# ---- Runtime ----
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app
COPY --from=build --chown=nonroot:nonroot /app /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"

CMD ["packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml", "--config", "app-config.runtime.yaml"]