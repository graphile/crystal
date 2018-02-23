FROM node:alpine
LABEL description="A GraphQL API created by reflection over a PostgreSQL schmea https://github.com/graphile/postgraphile"

# alpine linux standard doesn't include bash, and postgraphile scripts have #! bash
COPY . /postgraphile
WORKDIR /postgraphile


# Temporary pin of graphql to less than 0.12 in package.json
RUN sed -i 's/\"graphql\": \">=0.6 <0.13\"/\"graphql\": \">=0.6 <0.12\"/g' package.json

RUN apk add --update bash && rm -rf /var/cache/apk/* && \
    npm install && \
    scripts/build && \
    npm pack && \
    npm install -g postgraphile-*.tgz && \
    rm -rf /postgraphile

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]
