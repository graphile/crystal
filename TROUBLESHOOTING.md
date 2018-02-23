# Troubleshooting

To report or discuss details, [use the issues](https://github.com/graphile/postgraphile/issues). Pull requests to update this file with more troubleshooting tips are welcome.

## Installation

The basic installation procedure is described at [section Usage](README.md#usage).

### "EACCES: permission denied" on `npm install -g postgraphile`

See [this tutorial of "Installing global node modules"](<https://github.com/nodeschool/discussions/wiki/Installing-global-node-modules-(Linux-and-Mac)>).  
Details at [issue #495](https://github.com/graphile/postgraphile/issues/495).

## Using the command line `postgraphile`

See [usage](README.md#usage)

### "error: password authentication failed for user"

Please check your connection string (provided via the `-c` option) is valid. Example:

```
postgraphile -c postgres://postgres:postgres@localhost:5432/issn
```

If you believe the connection string to be valid, you can check it with the `psql` command line utility:

```
psql postgres://postgres:postgres@localhost:5432/issn
```

(Note this works with `postgres://` and `postgresql://` schemas, but not `pg://`)

If this is failing then your issue lies outside of PostGraphile - check your postgresql roles and grants.

Details at [issue #482](https://github.com/graphile/postgraphile/issues/482) and [issue #495](https://github.com/graphile/postgraphile/issues/495).

## Generated Schema

### Stored procedure / function not appearing

Check the following:

* return a named type (e.g. a scalar, table name or domain) - we don't currently support anonymous types
* query procedures must not return `VOID` (mutations can, however)
* mark it as `STABLE` if it's a query, or `VOLATILE` if it's a mutation
* it should be defined in one of the Postgres schemas you've told PostGraphile to introspect (via `postgraphile --schema`)

```sql
create function MY_SCHEMA.my_function() returns INTEGER as $$
  select 1;
$$ language sql STABLE;
```

Details at [issue #529](https://github.com/graphile/postgraphile/issues/529).
