FROM node:12-alpine as builder

WORKDIR /postgraphile/

# Add yarn ASAP because it's the slowest
ADD package.json yarn.lock /postgraphile/
RUN yarn install --frozen-lockfile --production=false

# Now for PostGraphiQL's yarn
ADD postgraphiql/ /postgraphile/postgraphiql/
WORKDIR /postgraphile/postgraphiql/
RUN yarn install --frozen-lockfile --production=false
WORKDIR /postgraphile/

# Copy everything else we need; this stuff will likely change
ADD tsconfig.json tslint.json /postgraphile/
ADD index.js cli.js /postgraphile/
ADD *.md /postgraphile/
ADD src/ /postgraphile/src/
ADD assets/ /postgraphile/assets/
ADD typings/ /postgraphile/typings/
ADD scripts/ /postgraphile/scripts/

# Finally run the build script
RUN ./scripts/build

########################################

FROM node:12-alpine
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://graphile.org/postgraphile"

EXPOSE 5000
ENV GRAPHILE_TURBO=1
WORKDIR /postgraphile/
ENTRYPOINT ["./cli.js"]

# Again, install yarn ASAP because it's the slowest
ADD package.json yarn.lock /postgraphile/
RUN yarn install --frozen-lockfile --production=true

ADD *.md /postgraphile/
ADD index.js cli.js /postgraphile/
COPY docker/.postgraphilerc.js /postgraphile/
COPY --from=builder /postgraphile/build/ /postgraphile/build/
COPY --from=builder /postgraphile/build-turbo/ /postgraphile/build-turbo/
COPY --from=builder /postgraphile/sponsors.json /postgraphile/
