# Troubleshooting

When troubleshooting, you may see unexpected behaviors or receive an error message. This section provide links/instructions for identifying the cause of some problems and how to resolve them. 

To report or discuss details, [use the issues](https://github.com/postgraphql/postgraphql/issues). Pull requests to update this file with more troubleshooting tips are welcome.


## Installing by npm

The basic installation procedure is described at  [section Usage](README.md#usage).

### "EACCES: permission denied" on `npm install -g postgraphql`

See  [this tutorial of "Installing global node modules"](https://github.com/nodeschool/discussions/wiki/Installing-global-node-modules-(Linux-and-Mac)).  
Details at [issue #495](https://github.com/postgraphql/postgraphql/issues/495).

----

## Using the command line `postgraphql`

The main command  is `postgraphql`, described at [section Usage](README.md#usage).

### "error: password authentication failed for user"

Please check your connection string (provided via the `-c` option) is valid. Example: 

```
postgraphql -c postgres://postgres:postgres@localhost:5432/issn
```

If you believe the connection string to be valid, you can check it with the `psql` command line utility:

```
psql postgres://postgres:postgres@localhost:5432/issn
```

(Note this works with `postgres://` and `postgresql://` schemas, but not `pg://`)

If this is failing then your issue lies outside of PostGraphQL - check your postgresql roles and grants.

Details at [issue #482](https://github.com/postgraphql/postgraphql/issues/482) and [issue #495](https://github.com/postgraphql/postgraphql/issues/495).


----

## Quering 

Using GraphQL queries and/or indirect use of SQL. All described by [GraphQL datatype  guide](https://facebook.github.io/graphql), [PostgreSQL datatype guide](https://www.postgresql.org/docs/current/static/datatype.html) and the [Postgres Schema Design Tutorial](https://github.com/postgraphql/postgraphql/blob/master/examples/forum/TUTORIAL.md).

### GraphQL-PostgreSQL type mapping, where it?

When you looking for a mapping between the GraphQLTypes and PostgreSQL basic column types, there are no explicit documentation, you must to dig it from each guide (of a map side)... Here a sample your dream: 

SQL     | GraphQL       | Notes
---     | ---           | ---
text    | String | exact
integer | Int    | exact for int4
boolean | Boolean| exact
[float](https://www.postgresql.org/docs/current/static/datatype-numeric.html)   | [Float](https://facebook.github.io/graphql/#sec-Float)  | exact for float8
JSON | JSON | exact
... | ...| ...

The "GraphQL side" supports less default datatypes. However, it is possible to develop custom GraphQL types using the generic types available in GraphQL. Check out [Deep Dive into GraphQL Type System](https://github.com/mugli/learning-graphql/blob/master/7.%20Deep%20Dive%20into%20GraphQL%20Type%20System.md) or examples at [graphql-custom-types](https://github.com/stylesuxx/graphql-custom-types).

Details at [stackoverflow #40808347](https://stackoverflow.com/q/40808347).

