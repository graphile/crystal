FROM node
LABEL description="A simple container for running postgraphql postgraphq://github.com/postgraphql/postgraphql.git"

WORKDIR /
RUN git clone https://github.com/postgraphql/postgraphql.git
WORKDIR /postgraphql
RUN npm install
RUN scripts/build
RUN npm pack
RUN npm install -g postgraphql-*.tgz
EXPOSE 5000
ENTRYPOINT ["postgraphql", "-n", "0.0.0.0"]
