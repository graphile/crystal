---
title: Naming conflict
---

You're probably here because you just received an error like:

```
Error: A naming conflict has occurred - two entities have tried to define the same key 'task'.
  The first entity was:
    Adding 'task' attribute field to GraphQL type 'Subtask' (representing PgCodec 'subtask')
  The second entity was:
    Adding field to GraphQL type 'Subtask' for singular relation 'taskByMyTask'
  Details: https://err.red/pnc
```

This happens when PostGraphile tries to add an entry to an object, where that
object already has an entry with that name. There is a very large number of
circumstances under which this can happen since the `build.extend` method is
used to avoid conflicts throughout the PostGraphile schema building process:
when creating codecs, resources or relations; when adding attributes; when
defining GraphQL fields, arguments or enum values; and much more.

Fortunately we try and give you more details about how the error has come
about by detailing the key (`'task'` above) that has conflicted, and where the
first and second conflicting entities originated from.

When reading about the entities, you should keep in mind that codec/PgCodec,
resource/PgResource, and relation/PgCodecRelation relate to the concepts
described in the [registry documentation](../registry.md).

A common situation where this would occur is where you have two different
things (e.g. a column and a relationship) that are trying to be assigned to the
same field name in the GraphQL schema. This is particularly common when using
`@graphile/simplify-inflection` because it deliberately shortens the names of
relations for better ergonomics (e.g. `userByAuthorId` might become simply
`author`), at the risk of causing more conflicts - this is the main reason this
preset isn't enabled by default.

Another common situation is where you have two things of the same type (e.g.
two columns) whose names are made the same after inflection (e.g. columns named
`thing_2name`, `thing2_name`, `thing2name` and `thing2Name` would all transform
to a GraphQL field called `thing2Name` in the default inflectors).

To resolve the issue, you should either:

1. use a [smart tag](../smart-tags.md) to assign a different name or field name to one or both of the entities, or
2. use a custom inflector to change the way the names are generated for the entities, or
3. do something else suitable for the situation.

If you really are not sure what to do, please come ask us in the
#help-and-support channel on our Discord at https://discord.gg/graphile - we
might even add the solution to this page for future users!
