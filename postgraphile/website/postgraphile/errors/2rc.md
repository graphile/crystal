---
title: Two resources conflicted
---

You're probably here because you just received an error like:

`Error: Attempted to add a second resource named 'foo' (first represented function accepting 0 parameters and returning SQL type '"bool"', second represents table/view/etc called '"public"."foo"')
  Details: https://err.red/p2rc`

This happens when PostGraphile is building the
[resources](../registry.md#resources) for your schema, and the inflection rules
tell it to assign them both the same name

Remember: a resource represents somewhere that you can pull data from in your
database, for example a table or a function.

This might happen if:

- you have a table and a function with the same (or similar) names
- you have tables with the same (or similar) names in multiple schemas
- you have "interesting" inflection rules :wink:

The error itself should hopefully hint at which entities are clashing. To resolve the issue, you should either:

1. rename one of the database entities, or
2. use a [smart tag](../smart-tags.md) to assign a different name to one of the resources, or
3. use a custom inflector to give one of the entities a different name.

Generally the smart tag is the recommended approach for one-off issues, however
if this is a systemic issue (for example you use a lot of schemas, and the
schemas frequently have a lot of table names in common) then it may be wise to
change your inflectors to make the resource names more unique - for example
factoring the schema name into the name of the resource.
