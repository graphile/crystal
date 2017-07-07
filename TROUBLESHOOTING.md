# Troubleshooting

When troubleshooting, you may see unexpected behaviors or receive an error message. This section provide links/instructions for identifying the cause of some problems and how to resolve them. 

To report or discuss details, [use the issues](https://github.com/postgraphql/postgraphql/issues). Pull requests to update this file with more troubleshooting tips are welcome.


## Installing by npm

The basic installation procedure is described at  [section Usage](README.md#usage).

### "EACCES: permission denied" on `npm install -g postgraphql`

See  [this tutorial of "Installing global node modules"](https://github.com/nodeschool/discussions/wiki/Installing-global-node-modules-(Linux-and-Mac)).  
Details at [issue #495](https://github.com/postgraphql/postgraphql/issues/495).

## Using the command line `postgraphql`

See [usage](README.md#usage)

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
