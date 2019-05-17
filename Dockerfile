FROM node:12-alpine as builder

WORKDIR /postgraphile/

# Add yarn ASAP because it's the slowest
COPY package.json yarn.lock /postgraphile/
RUN yarn install --frozen-lockfile --production=false

# Now for PostGraphiQL's yarn
COPY postgraphiql/ /postgraphile/postgraphiql/
WORKDIR /postgraphile/postgraphiql/
RUN yarn install --frozen-lockfile --production=false
WORKDIR /postgraphile/

# Copy everything else we need; this stuff will likely change
COPY tsconfig.json tslint.json /postgraphile/
COPY index.js cli.js /postgraphile/
COPY *.md /postgraphile/
COPY src/ /postgraphile/src/
COPY assets/ /postgraphile/assets/
COPY typings/ /postgraphile/typings/
COPY scripts/ /postgraphile/scripts/

# Finally run the build script
RUN ./scripts/build

########################################

FROM node:12-alpine as clean

# Again, install yarn ASAP because it's the slowest
COPY package.json yarn.lock /postgraphile/

COPY *.md /postgraphile/
COPY index.js cli.js /postgraphile/
COPY docker/.postgraphilerc.js /postgraphile/
COPY --from=builder /postgraphile/build/ /postgraphile/build/
COPY --from=builder /postgraphile/build-turbo/ /postgraphile/build-turbo/
COPY --from=builder /postgraphile/sponsors.json /postgraphile/

########################################

FROM node:12-alpine
LABEL description="Instant extensible high-performance GraphQL API for your PostgreSQL database https://graphile.org/postgraphile"

EXPOSE 5000
ENV GRAPHILE_TURBO=1
WORKDIR /postgraphile/
ENTRYPOINT ["./cli.js"]

COPY --from=clean /postgraphile/ /postgraphile/
RUN yarn install --frozen-lockfile --production=true
