# Command Line Interface

The easiest way to get up and running with PostGraphQL is to use the Command Line Interface.

Just install PostGraphQL globally with npm:

```bash
npm install -g postgraphql
```

…and you will have the `postgraphql` command ready to use!

The usage of the `postgraphql` binary is as follows. To pull up this documentation on your machine simply run `postgraphql --help`.

```

  Usage: postgraphql [options...]

  A GraphQL schema created by reflection over a PostgreSQL schema 🐘

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -c, --connection <string>        the Postgres connection. if not provided it will be inferred from your environment
    -s, --schema <string>            a Postgres schema to be introspected. Use commas to define multiple schemas
    -w, --watch                      watches the Postgres schema for changes and reruns introspection if a change was detected
    -n, --host <string>              the hostname to be used. Defaults to `localhost`
    -p, --port <number>              the port to be used. Defaults to 5000
    -m, --max-pool-size <number>     the maximum number of clients to keep in the Postgres pool. defaults to 10
    -r, --default-role <string>      the default Postgres role to use when a request is made. supercedes the role used to connect to the database
    -q, --graphql <path>             the route to mount the GraphQL server on. defaults to `/graphql`
    -i, --graphiql <path>            the route to mount the GraphiQL interface on. defaults to `/graphiql`
    -b, --disable-graphiql           disables the GraphiQL interface. overrides the GraphiQL route option
    -e, --secret <string>            the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled
    -t, --token <identifier>         the Postgres identifier for a composite type that will be used to create tokens
    -o, --cors                       enable generous CORS settings. this is disabled by default, if possible use a proxy instead
    -a, --classic-ids                use classic global id field name. required to support Relay 1
    -j, --dynamic-json               enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default
    -M, --disable-default-mutations  disable default mutations, mutation will only be possible through Postgres functions
    -l, --size-limit                 set the maximum size of JSON bodies that can be parsed (default 100kB)
    --export-schema-json [path]      enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten
    --export-schema-graphql [path]   enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten
    --show-error-stack [setting]     show JavaScript error stacks in the GraphQL result errors

  Get Started:

    $ postgraphql --demo
    $ postgraphql --schema my_schema

```
