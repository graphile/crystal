FROM node
LABEL description="A GraphQL API created by reflection over a PostgreSQL schmea https://github.com/postgraphql/postgraphql"

RUN npm install
RUN scripts/build
RUN npm pack
RUN npm install -g postgraphql-*.tgz
EXPOSE 5000
ENTRYPOINT ["postgraphql", "-n", "0.0.0.0"]
