---
sidebar_position: 2
---

# Resources

A resource represents entities in the database from which you can extract data,
for example tables, views, materialized views and functions (or arbitrary SQL
expressions).

Table-like resources have no parameters (parameters is undefined); you use
`.get()` or `.find()` to get records from them.

Function-like resources have parameters (parameters is an array); use
`.execute()` to get the result of executing the function, passing any required
arguments.

## PgResourceOptions

Resources are not constructed directly, instead a resource configuration object
is passed (optionally via the registry builder) to `makeRegistry` which then
builds the final resources including their relations.

The `makePgResourceOptions` function is a TypeScript Identity Function (i.e. it
just returns the input, but is used to ensure that the type conforms according
to TypeScript) so usage of it is entirely optional.

```ts
const forumsResourceOptions = makePgResourceOptions({
  name: "forums",
  executor,
  codec: forumsCodec,
  from: sql`forums`,
  uniques: [{ attributes: ["id"], isPrimary: true }],
});
```

## PgResource

Once a resource has been built (from the result of a call to `makeRegistry()` -
see [registry](./index.md)), you can use the various helper methods:

- `get(spec)` - call this from a plan resolver; gets a step representing a single row from this table-like resource matching the given spec
- `find(spec)` - call this from a plan resolver; gets a step representing a list of rows from this table-like resource matching the given spec
- `execute(args)` - call this from a plan resolver; gets a step representing the result of calling the database function this resource represents, passing the given arguments
- `getRelations()` - gets the map of relation definitions available on this resource (by looking up its codec in the registry)
- `getRelation(name)` - gets the named relation definition

You can also use resources as parameters to various of the @dataplan/pg steps.
