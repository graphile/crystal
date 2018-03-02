# graphile-build-pg

`graphile-build-pg` is a collection of plugins for `graphile-build` that allow
you to extend your GraphQL schema with high-performance types and fields based
on resources found in your PostgreSQL database schema.

The plugins here-in do not exhibit the N+1 query problem common in many
database-based GraphQL APIs thanks to graphile-build's advanced
[look-ahead](https://www.graphile.org/graphile-build/look-ahead/) features,
they're more efficient, even, than `DataLoader`-based solutions.

An example of an application built on `graphile-build-pg` is [PostGraphile
v4+](https://github.com/graphile/postgraphile) which allows you to run just
one command to instantly get a fully working and secure GraphQL API up and
running based on your PostgreSQL database schema.

**It is recommended that you use PostGraphile directly unless you really want to
get low level access to this library.**

If you prefer to use the plugins yourself it's advised that you use the
`defaultPlugins` export from `graphile-build-pg` and then create a new array
based on that into which you may insert or remove specific plugins. This is
because it is ordered in a way to ensure the plugins work correctly (and we may
still split up or restructure the plugins within it).

### `defaultPlugins`

An array of graphql-build plugins in the correct order to generate a
well-thought-out GraphQL object tree based on your PostgreSQL schema. This is
the array that `postgraphile-core` uses.

### `inflections`

This is a list of inflection engines, we currently have the following:

* `defaultInflection` - a sensible default
* `postGraphileInflection` - as above, but enums get converted to `CONSTANT_CASE`
* `postGraphileClassicIdsInflection` - as above, but `id` attributes get renamed to `rowId` to prevent conflicts with `id` from the Relay Global Unique Object Specification.

### Manual usage

```js
import { defaultPlugins, getBuilder } from "graphile-build";
import {
  defaultPlugins as pgDefaultPlugins,
  inflections: {
    defaultInflection,
  },
} from "graphile-build-pg";

async function getSchema(pgConfig = process.env.DATABASE_URL, pgSchemas = ['public'], additionalPlugins = []) {
  return getBuilder(
    [
      ...defaultPlugins,
      ...pgDefaultPlugins,
      ...additionalPlugins
    ],
    {
      pgConfig,
      pgSchemas,
      pgExtendedTypes: true,
      pgInflection: defaultInflection,
    }
  );
}
```
