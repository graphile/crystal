FROM node:alpine
LABEL description="A GraphQL API created by reflection over a PostgreSQL schmea https://github.com/postgraphql/postgraphql"

# alpine linux standard doesn't include bash, and postgraphql scripts have #! bash
RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir -p /postgraphql
WORKDIR /postgraphql

COPY . /postgraphql

RUN npm install
RUN scripts/build
RUN npm pack
RUN npm install -g postgraphql-*.tgz

RUN rm -rf /postgraphql
EXPOSE 5000
ENTRYPOINT ["postgraphql", "-n", "0.0.0.0"]
