---
title: Registry
---

As you know: PostGraphile builds a GraphQL schema for you by introspecting your
database. What you may not know is that it does this through multiple phases
using the [Graphile Build](https://build.graphile.org/graphile-build/) library.
In the `gather` phase, PostGraphile introspects your database, and builds up a
"registry" of all of the "codecs", "resources" and "relations" that it finds.
Then during the `schema` phase, it inspects this registry and uses it to decide
what your GraphQL schema should contain.

When you're just getting started with PostGraphile, it's not very important to
understand the registry, you can get away with these basic concepts to help you
to understand error messages:

- A `codec` represents a database type (a scalar, composite, list, domain or range type)
- A `resource` represents something in the database from which you can pull data (a table, view, materialized view or function)
- A `relation` is a uni-directional link from a codec (e.g. a table _type_) to a resource (e.g. a table itself)

However, once you want to start writing your own plans, for example via
[`makeExtendSchemaPlugin`](./make-extend-schema-plugin.md), understanding the
registry becomes more important.

## Codecs

A "codec" describes a type in your PostgreSQL database. There are built-in
codecs for the basic scalars:

```ts
import { TYPES } from "postgraphile/@dataplan/pg";

const { int, bool, text /* ... */ } = TYPES;
```

PostGraphile will automatically generate codecs for all of the types in your
database, whether they are scalar, composite (including the underlying type
that each of your tables/views/etc have), list, domain, or range types.

PostGraphile automatically names these types after their name in the database
via an inflector. For example, composite types use the `classCodecName`
inflector.

You can read more about codecs (including how to make your own, and what the
built-in scalar codecs are) in the `@dataplan/pg` documentation:
https://grafast.org/grafast/step-library/dataplan-pg/registry/codecs

## Resources

A "resource" represents something that you can pull data from in your database.
Most commonly this is a table, but it also includes views, materialized views
and functions. You can even build resources for custom SQL expressions should
you wish.

PostGraphile automatically builds resources for you based on all your tables,
views, materialized views and functions.

There are two main classes of resources. "Table-like" resources don't accept
any parameters, you can get resources from them directly using
[`resource.find(spec)`](https://grafast.org/grafast/step-library/dataplan-pg/registry/resources#resourcefindspec)
or
[`resource.get(spec)`](https://grafast.org/grafast/step-library/dataplan-pg/registry/resources#resourcegetspec).
"Function-like" resources require a list of parameters (even an empty list),
and for these you would use
[`resource.execute(args)`](https://grafast.org/grafast/step-library/dataplan-pg/registry/resources#resourcefindspec).

You can read more about resources in the `@dataplan/pg` documentation:
https://grafast.org/grafast/step-library/dataplan-pg/registry/resources

## Relations

A "relation" is a uni-directional (one way) relationship from a codec (i.e.
type) to a table-like resource (i.e. table). Assuming you have some data for
the given codec (whether you got that data from a table, function, or even read
it from a file), a relation describes how to get from that to the related
records (or record) in the given resource.

In general, foreign key constraints will register _two_ relations, one for the
referring table (the table on which the foreign key is defined) to the
referenced table (this is the "forward" relation, and is always unique) and one
from the referenced table back to the referring table (this is the "backward"
or "referencee" relation, and may or may not be unique depending on the unique
constraints on the referring table).

You can read more about relations in the `@dataplan/pg` documentation:
https://grafast.org/grafast/step-library/dataplan-pg/registry/relations

## Registry

The registry is the container for codecs, resources, and relations. When you're
writing a plugin, if you have a reference to the `build` object then you can
access the registry via `build.input.pgRegistry`. It contains the properties
`pgCodecs`, `pgResources` and `pgRelations`. If you had a `users` table then,
depending on the inflectors you're using, it's codec might be
`build.input.pgRegistry.pgCodecs.users`, its resource
`build.input.pgRegistry.pgResources.users` and its relations a keyed object
(hash/map/record) stored at `build.input.pgRegistry.pgRelations.users`.

You can read more about the registry in the `@dataplan/pg` documentation:
https://grafast.org/grafast/step-library/dataplan-pg/registry/
