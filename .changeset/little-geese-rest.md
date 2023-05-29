---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

**Overhaul behavior system**

Previously the behavior system worked during the schema building process, inside
the various schema hooks. So looking at the behavior of a `relation` might have
looked like:

```ts
GraphQLObjectType_fields_field(field, build, context) {
  const relation = context.scope.pgRelationOrWhatever;

  // Establish a default behavior, e.g. you might give it different default behavior
  // depending on if the remote table is in the same schema or not
  const defaultBehavior = someCondition(relation) ? "behavior_if_true" : "behavior_if_false";

  // Now establish the user-specified behavior for the entity, inheriting from all the
  // relevant places.
  const behavior = getBehavior([
    relation.remoteResource.codec.extensions,
    relation.remoteResource.extensions,
    relation.extensions
  ]);

  // Finally check this behavior string against `behavior_to_test`, being sure to apply
  // the "schema-time smart defaulting" that we established in `defaultBehavior` above.
  if (build.behavior.matches(behavior, "behavior_to_test", defaultBehavior)) {
    doTheThing();
  }
```

This meant that each plugin might treat the behavior of the entity different -
for example `postgraphile-plugin-connection-filter` might have a different
`someCondition()` under which the "filter" behavior would apply by default,
whereas the built in `condition` plugin might have a different one.

Moreover, each place needs to know to call `getBehavior` with the same list of
extension sources in the same order, otherwise subtle (or not so subtle)
differences in the schema would occur.

And finally, because each entity doesn't have an established behavior, you can't
ask "what's the final behavior for this entity" because it's dynamic, depending
on which plugin is viewing it.

This update fixes all of this; now each entity has a single behavior that's
established once. Each plugin can register `entityBehaviors` for the various
behavior entity types (or global behaviors which apply to all entity types if
that makes more sense). So the hook code equivalent to the above would now be
more like:

```ts
GraphQLObjectType_fields_field(field, build, context) {
  const relation = context.scope.pgRelationOrWhatever;
  // Do the thing if the relation has the given behavior. Simples.
  if (build.behavior.pgCodecRelationMatches(relation, "behavior_to_test")) {
    doTheThing();
  }
```

This code is much more to the point, much easier for plugin authors to
implement, and also a lot easier to debug since everything has a single
established behavior now (except `refs`, which aren't really an entity in their
own right, but a combination of entities...).

These changes haven't changed any of the schemas in the test suite, but they may
impact you. This could be a breaking change - so be sure to do a schema diff
before/after this.
