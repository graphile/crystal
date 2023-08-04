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

## PgExecutor

A PgExecutor ("executor") represents a PostgreSQL database connection. It is
used by the various step classes (via their resources) in order to issue SQL
queries to the database. It's rare that you would ever call any of its methods
directly.

Each resource has exactly one executor, and the same executor may be shared
across multiple resources. It's very common for all of your resources to share
a single executor, but multiple executors can co-exist in the same schema
happily.

Query inlining cannot cross executor boundaries (since each executor represents
a separate database, it would not make sense to inline a query in one database
into another database - the query would likely throw an error when the tables
could not be found).

PgExecutor is also responsible for things like caching.

See the SQL queries that are being executed with the
`DEBUG="@dataplan/pg:PgExecutor:verbose"` envvar. (Or replace `:verbose` with
`:explain` if you want to see even more information.)

A PgExecutor is constructed with an options object containing two properties:

- `name` - a name for the executor, must be unique
- `context` - a callback function to be called at planning time that should
  return an object step containing the `withPgClient` and (optionally)
  `pgSettings` entries. See [adaptors](../adaptors) for more details on these.

### Example

```ts
const executor = new PgExecutor({
  name: "default",
  context() {
    return object({
      withPgClient: context().get("withPgClient"),
      // pgSettings: context().get("pgSettings"),
    });
  },
});
```

## PgResourceOptions

Resources are not constructed directly, instead a resource configuration object
is passed (optionally via the registry builder) to `makeRegistry` which then
builds the final resources including their relations.

The `makePgResourceOptions` function is a TypeScript Identity Function (i.e. it
just returns the input, but is used to ensure that the type conforms according
to TypeScript) so usage of it is entirely optional.

The resource options have the following properties (all are optional unless noted):

- `name` (required) - the name to use for this resource, must be unique
- `executor` (required) - the executor to use when retrieving this resource (unless you are connecting to multiple databases, you'll probably use the same executor for every resource)
- `codec` (required) - the type that this resource will return
- `from` (required) - either an SQL fragment (for table-like resources) or a callback function that returns an SQL fragment (for function-like resources) that gives the database `FROM` for this resource
- `uniques` - for table-like resources, a list of the unique constraints on the table (e.g. indicating primary key/etc)
- `parameters` - required for function-like resources, forbidden for table-like resources; a list of specifications for the parameters that the function accepts
- `isUnique` - for function-like resources, true if this resource will return at most one row
- `isMutation` - for function-like resources, true if calling this function may have side effects (i.e. the database function is `VOLATILE` (default))

### Example

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

### `resource.get(spec)`

Call this from a plan resolver; gets a step representing a single row from this
table-like resource matching the given spec

### `resource.find(spec)`

Call this from a plan resolver; gets a step representing a list of rows from
this table-like resource matching the given spec

### `resource.execute(args)`

Call this from a plan resolver; gets a step representing the result of calling
the database function this resource represents, passing the given arguments

### `resource.getRelations()`

Gets the map of relation definitions available on this resource (by looking up
its codec in the registry)

### `resource.getRelation(name)`

Gets the named relation definition
