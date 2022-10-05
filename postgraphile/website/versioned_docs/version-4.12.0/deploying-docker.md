---
layout: page
path: /postgraphile/deploying-docker/
title: Deploying with Docker
---

PostGraphile has an official Docker image which is suitable to use if you don't
need custom plugins and are deploying PostGraphile as standalone:

https://hub.docker.com/r/graphile/postgraphile/

Our Docker images are versioned:

- `graphile/postgraphile:4` will give you the latest stable in the "v4.x.x" line
  (no alphas, betas, rcs); **this is the recommended version to use**
- Every new versioned git tag will be available using the exact same tag; e.g.
  `v5.6.7-alpha.8` would become `graphile/postgraphile:v5.6.7-alpha.8`
- Every new `vX.Y.Z` git tag (i.e. no alpha/beta/rc) will automatically release
  `graphile/postgraphile:X-Y` and `graphile/postgraphile:X-Y-Z`
- `graphile/postgraphile:latest` will give you the latest _stable_ (but beware
  of major version bumps!)
- `graphile/postgraphile:next` will give you the equivalent of what's on
  `master` right now (i.e. pre-release/bleeding edge/nightly)

From time to time `graphile/postgraphile:4` may lag behind where it should be
because it's the only manual step in the above. If this happens, give Benjie a
poke over Discord and he'll push the latest v4.x.y tag to the `v4` branch via
`git push origin v4.x.y:v4`.

A request was made for clarification on why there are Docker versions with dots
and other Docker versions with dashes; hopefully this clears things up:

- `X` and `X-Y` are the versions that you should use, they will be updated over
  time with compatible bug fixes.
- `X-Y-Z` for completeness, and may include alpha/beta/etc versions of that
  specific release in future
- `vX.Y.Z-foo.A` or whatever are the explicit git tags which will only ever
  build once and will not be kept up to date as the project advances. Use these
  if you need to pin an explicit version... explicitly.

### Custom Dockerfile

Should you want to deploy a more custom app then a custom Dockerfile is likely
in order. To reduce the size of your final image, we recommend using a
multi-stage build.

There's a few critical things to keep in mind:

- PostGraphile CLI listens, by default, on `localhost`; you may need to override
  this, e.g. with `--host 0.0.0.0`
- PostGraphile needs to be able to connect to your database; ensure that Docker
  is networked such that this is possible

To speed up builds, we recommend you pay attention to your `.dockerignore` file;
here's an example to get you started:

```
# .dockerignore
.env
.git
.github
.next
.vscode
node_modules

*Dockerfile*
*docker-compose*

**/dist
**/__tests__
```

The content of your `Dockerfile` will vary greatly depending on your repository
setup, but here's an example for inspiration:

```Dockerfile
# Dockerfile

# Global args, set before the first FROM, shared by all stages
ARG NODE_ENV="production"

################################################################################
# Build stage 1 - `yarn build`

FROM node:12-alpine as builder
# Import our shared args
ARG NODE_ENV

# Cache node_modules for as long as possible
COPY package.json yarn.lock /app/
WORKDIR /app/
RUN yarn install --frozen-lockfile --production=false --no-progress

# Copy over the server source code
COPY server/ /app/server/

# Finally run the build script
RUN yarn run build

################################################################################
# Build stage 2 - COPY the relevant things (multiple steps)

FROM node:12-alpine as clean
# Import our shared args
ARG NODE_ENV

# Copy over selectively just the tings we need, try and avoid the rest
COPY --from=builder /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/server/dist/ /app/server/dist/

################################################################################
# Build stage FINAL - COPY everything, once, and then do a clean `yarn install`

FROM node:12-alpine
# Import our shared args
ARG NODE_ENV

EXPOSE 5000
WORKDIR /app/
# Copy everything from stage 2, it's already been filtered
COPY --from=clean /app/ /app/

# Install yarn ASAP because it's the slowest
RUN yarn install --frozen-lockfile --production=true --no-progress

LABEL description="My PostGraphile-powered server"

# You might want to disable GRAPHILE_TURBO if you have issues
ENV GRAPHILE_TURBO=1
ENV NODE_ENV=$NODE_ENV
ENTRYPOINT yarn start
```
