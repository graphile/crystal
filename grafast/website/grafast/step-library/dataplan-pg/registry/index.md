---
sidebar_position: 1
---

# Registry

The registry contains all of the [codecs](./codecs),
[resources](./resources) and [relations](./relations) that you want
`@dataplan/pg` to know about.

Though writing the registry by hand gives you full control over how your
database is represented, it's more common to auto-generate it - this gives you
a fully type safe registry in moments. Of course, you can auto-generate your
first version of it, and then take over maintenance from that point on should
you wish.

(TODO: detail autogeneration.)

## makeRegistryBuilder()

We recommend that you use the registry builder to build the registry, this
enables you to use a comfortable "builder" syntax and maintain types
throughout.

```ts
import { makeRegistryBuilder } from "@dataplan/pg";
```

The registry builder has the following main methods:

### RegistryBuilder.addCodec(codec)

Adds a codec to the builder.

For more details on codecs, see [codecs](./codecs).

### RegistryBuilder.addResource(resourceOptions)

Add resource options to the registry builder. Note that the building of the
registry itself is what produces the resource that you use at runtime, so
you're just passing the resource options here.

For more details on resources, see [resources](./resources).

### RegistryBuilder.addRelation(codec, name, resourceOptions, details)

Adds a relationship named `name` between `codec` and the resource represented
by `resourceOptions`. `details` contains the breakdown of the relationship:

- `localAttributes` - the attributes of `codec` that do the referencing in this relation
- `remoteAttributes` - the attributes of `resourceOptions.codec` that are referenced by this relation
- `isUnique` - true if this relation can return at most one result, otherwise false. Always true on the referencing side.
- `isReferencee` - true if this relation was defined on the table represented by `resourceOptions.codec` rather than the table represented by `codec`

For more details on relations, see [relations](./relations).

### RegistryBuilder.getRegistryConfig()

Returns the registry config, to feed into `makeRegistry`.

## makeRegistry(registryConfig)

Returns a new registry by building all the resources and relations in
`registryConfig`.

## PgRegistry

The PgRegistry produced by `makeRegistry` will have three properties:

### Registry.pgCodecs

An object map of all the codecs in your registry (the keys are the names of the
codecs).

### Registry.pgResources

An object map of all the resources in your registry (the keys are the names of
the resources).

### Registry.pgRelations

An object map from the codec name to the relations for that codec, where the
relations are represented as an object map from the relation name to the
relation details.

It's rare that you'd need to use this directly.
