# Examples

Many of these example can run against any database, but if you want you can use
the `pagila` example database for Postgres (see below).

Assuming you are running `yarn watch` at the root of the repository (as noted in
the [root README](../../../../README.md)), you should be able to run these
examples with `node dist/examples/<NAME-OF-EXAMPLE>.js`

## config(.ts)

Configure you database here! You only really need to worry about the top two
lines unless you want to switch out your PostgreSQL client for an alternative or
change the schema configuration or whatever.

## fastify-helix-envelop

This file contains an example of a Fastify server running GraphQL Helix with
Envelop bindings to Grafast. It's a great place to start as it gives you
GraphiQL at the root URL that you can use to explore the GraphQL schema, and
even has a URL for viewing the Grafast plan graph for the query.

## schema-export

This file contains an example of building and then exporting a GraphQL schema;
it's pretty straightforward and follows the same initial
preset/inflection/gathering/schema process as fastify-helix-envelop does, but
then exports the schema.

## Pagila example database (optional)

Clone down `pagila`:

```
git clone git@github.com:devrimgunduz/pagila.git
```

Created a database for it:

```
createdb pagila
```

And now populate the database:

```
psql pagila -Xv ON_ERROR_STOP=1 -f pagila-schema.sql -f pagila-data.sql
```

And finally, a temporary patch is needed to the data due to incompatible naming
of two enum values; connect to the pagila DB and run the following statements:

```
alter type mpaa_rating rename value 'PG-13' TO 'PG13';
alter type mpaa_rating rename value 'NC-17' TO 'NC17';
```

(In future we'll probably handle that automatically, but we're not there yet.)
