---
title: Deploying with Docker
---

:::warning

This documentation has not yet been tested with PostGraphile V5. Please get in
touch if you have used it!

:::

PostGraphile has an official Docker image which is suitable to use if you don't
need custom plugins and are deploying PostGraphile as standalone:

https://hub.docker.com/r/graphile/postgraphile/

Our Docker images are versioned:

- `graphile/postgraphile:5` will give you the latest stable in the "v5.x.x" line
  (no alphas, betas, rcs); **this is the recommended version to use**
- Every new versioned git tag will be available using the exact same tag; e.g.
  `v5.6.7-alpha.8` would become `graphile/postgraphile:v5.6.7-alpha.8`
- Every new `vX.Y.Z` git tag (i.e. no alpha/beta/rc) will automatically release
  `graphile/postgraphile:X-Y` and `graphile/postgraphile:X-Y-Z`
- `graphile/postgraphile:latest` will give you the latest _stable_ (but beware
  of major version bumps!)
- `graphile/postgraphile:next` will give you the equivalent of what's on
  `master` right now (i.e. pre-release/bleeding edge/nightly)

From time to time `graphile/postgraphile:5` may lag behind where it should be
because it's the only manual step in the above. If this happens, give Benjie a
poke over Discord and he'll push the latest v5.x.y tag to the `v5` branch via
`git push origin v5.x.y:v5`.

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
  this, e.g. with `preset.grafserv.host = "0.0.0.0"`
- PostGraphile needs to be able to connect to your database; ensure that Docker
  is networked such that this is possible

To speed up builds, we recommend you pay attention to your `.dockerignore` file;
here's an example to get you started:

```ignore
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
setup, but here's an example for inspiration, using Yarn v4:

```dockerfile
# Dockerfile

# Global args, set before the first FROM, shared by all stages
ARG NODE_ENV="production"
ARG GRAPHILE_ENV="production"

################################################################################
# Build stage 1 - `yarn build`

FROM node:24-alpine AS builder
# Import our shared args
ARG NODE_ENV
ARG GRAPHILE_ENV

# Cache node_modules for as long as possible
COPY .yarn/ /app/.yarn/
COPY .yarnrc.yml package.json yarn.lock tsconfig.json /app/
WORKDIR /app/
RUN ["corepack", "enable"]
RUN ["yarn", "install", "--immutable"]

# Copy over the server source code
COPY src/ /app/src/

# Finally run the build script
RUN ["yarn", "run", "build"]

################################################################################
# Build stage 2 - COPY the relevant things (multiple steps)

FROM node:24-alpine AS clean
# Import our shared args
ARG NODE_ENV
ARG GRAPHILE_ENV

# Copy over selectively just the tings we need, try and avoid the rest
COPY --from=builder /app/.yarnrc.yml /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/.yarn/releases/ /app/.yarn/releases/
COPY --from=builder /app/dist/ /app/dist/

################################################################################
# Build stage FINAL - COPY everything, once, and then do a clean `yarn install`

FROM node:24-alpine
# Import our shared args
ARG NODE_ENV
ARG GRAPHILE_ENV

EXPOSE 5678
WORKDIR /app/
# Copy everything from stage 2, it's already been filtered
COPY --from=clean /app/ /app/

# Install yarn ASAP because it's the slowest
RUN ["corepack", "enable"]
RUN ["yarn", "workspaces", "focus", "-A", "--production"]

LABEL description="My PostGraphile-powered server"

ENV HOST="0.0.0.0"
ENV NODE_ENV=$NODE_ENV
ENV GRAPHILE_ENV=$GRAPHILE_ENV
ENTRYPOINT ["yarn", "start:production"]
```

Build via:

```
docker build -t mypostgraphileproject .
```

This builds the Docker image from the `Dockerfile` in the current directory, and tags it as `mypostgraphileproject`.

Run via:

```
docker run \
  --rm \
  -it \
  -p 5678:5678 \
  -e DATABASE_URL="postgres://username:password@host:port/db" \
  mypostgraphileproject
```

- `--rm` removes the container automatically when it exits
- `-it` runs the container interactively with TTY attached, useful for logs and Ctrl-C
- `-p 5678:5678` publishes port 5678 from the container to port 5678 on the host
- `-e DATABASE_URL=…` sets the database connection string at runtime
- `mypostgraphileproject` is the image to run (named via `-t` in the
  `docker build` command above

See it working in [benjie/ouch](https://github.com/benjie.ouch).

:::tip[Connecting to database on host machine]

Use the docker argument `--add-host=host.docker.internal:host-gateway` and the
connection string `postgres://username:password@host.docker.internal/mydb` to
connect to the `mydb` db on the host machine. For this to work, you'll also need
to ensure your `listen_address` is set correctly:

```ini title='postgresql.conf'
# ...
listen_address = 'localhost,172.17.0.1'
port = 5432
# ...
```

And you may need to restart PostgreSQL after you've started the Docker daemon so
that the port binds correctly.

:::
