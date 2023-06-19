---
title: "Custom plugins"
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Migrating custom plugins

If you've written some PostGraphile V4 plugins by hand (not using one of the
`make...Plugin` helpers) then this migration guide is for you. We'll step you
through some of the key changes.

## TypeScript

It is **very strongly recommended** that you write plugins in TypeScript. There
are two main reasons for this:

1. A lot of work has gone into making the plugin and configuration system
   strongly typed so that you gain auto-complete and documentation on every
   option, this should make your plugin authoring experience much easier than
   in V4.
2. Since the plugin and configuration system is strongly typed, if you do not
   extend these types when you're writing your plugin, users that use
   TypeScript will not be able to supply your configuration options easily.

Since your plugin will likely add attributes to various shared object types, we
use declaration merging heavily. Declaration merging allows you to add
additional attributes to existing TypeScript interfaces. You should familiarize yourself
with [declaration merging in the TypeScript
documentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
if you are not already familiar.

To avoid problems that come from having multiple versions of the same module
thanks to the many and varied package managers (and versions thereof) all
having their own ideas about which modules should be installed where, we merge
into globally scoped namespaces. The main roots for these namespaces that
you'll work with are `GraphileConfig` and `GraphileBuild`.

## No look-ahead

Graphile Build no longer has a look-ahead engine, instead it uses Gra*fast*
plans.

That means all of the APIs that related to "data generators" and the
`QueryBuilder` and similar no longer exist:

- 🚮 `QueryBuilder`
- 🚮 `getDataFromParsedResolveInfoFragment`
- 🚮 `addDataGenerator`
- 🚮 `addArgDataGenerator`
- 🚮 `queryFromResolveData`
- 🚮 `selectGraphQLResultFromTable`

Similarly you should no longer use resolvers since Gra*fast* plan resolvers
replace both of these needs.

The good news is that Gra*fast* plan resolvers are typically much (much)
shorter and easier to read, write and understand compared to the chaotic mess
that was V4's look-ahead system. We'll look at this a bit more in
[Plans](#plans) below.

## Type registration

In V4 you could define types in an ad-hoc manner as and when you needed them,
but this caused havoc at runtime because it meant that sometimes a type didn't
already exist when you needed it - they were very dependent on ordering. This
was particularly obvious when using `makeExtendSchemaPlugin` and trying to use
auto-generated types that may or may not exist yet. Worse still, I saw
community plugins building types if that type didn't already exist &mdash; but
there was no guarantee that the type that already existed was the one the
plugin needed!

In V5, all types must be registered by name during the `init` hook. The types
still are not created until they are needed, but their names and spec
generation functions must be registered ahead of time. This means that when
building fields and arguments you can always reference a type by its name
(using `build.getTypeByName('TypeNameHere')`).

So `build.newWithHooks` no longer exists, instead you use the registration methods:

- `build.registerObjectType(typeName, scope, stepValidation, specCallback, origin)`
- `build.registerInterfaceType(typeName, scope, specCallback, reason)`
- `build.registerUnionType(typeName, scope, specCallback, reason)`
- `build.registerScalarType(typeName, scope, specCallback, reason)`
- `build.registerEnumType(typeName, scope, specCallback, reason)`
- `build.registerInputObjectType(typeName, scope, specCallback, reason)`

Note that `registerObjectType` is the odd one out here since it accepts the
additional `stepValidation` option; this can be null or to a function that
checks that the given step is of a suitable type for the type's plan resolvers
to support.

### Example

```ts
const MyPlugin: GraphileConfig.Plugin = {
  name: "MyPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      init(_, build) {
        const typeName = inflection.myInflector("MyInflectorInput");

        build.registerObjectType(
          typeName,
          {
            /* add scope data here */
          },
          optionalStepValidationFunctionHere,
          () => ({
            // Here's the spec for the type
            description: "...",
            fields: {
              //...
            },
          }),
          `Here you'd put a helpful phrase detailing why this type is being registered; useful when two types try and register with the same name`,
        );

        return _;
      },
    },
  },
};
```

## Plugins and presets

In PostGraphile V4 there were two types of plugins:

- schema plugins (functions) interacted with Graphile Engine (graphile-build
  and graphile-build-pg) and were responsible to changes to your GraphQL schema
- server plugins (objects) interacted with PostGraphile and it's server/CLI and
  were responsible to changes to how the HTTP requests were handled and other
  "high level" concerns (including such concerns as which additional schema
  plugins to load!)

In V5 there is only one type of plugin, a Graphile Config plugin. In addition
to plugins, there are also presets.

### Presets

Presets are a collection of plugins, configuration options, and other presets
that get merged together recursively to build the users ultimate configuration.
A preset is an object with the following base properties (all optional):

- `extends` - a list of presets that this preset extends
- `plugins` - a list of plugin objects that this preset makes use of
- `disablePlugins` - a list of plugin _names_ (strings) that should be disabled (skipped)

In addition to these common properties, Graphile Config presets have additional
optional fields to influence various different "scopes". For more details, see
[configuration](../config).

In V4 we had a plugin helper called `makePluginByCombiningPlugins`; in V5
that's better served by using a preset that simply lists the underlying plugins
to be combined.

:::info

Critically, a preset must not have a `name` property; this property helps to
distinguish between presets and plugins.

:::

### Plugins

Graphile Config plugins are objects with the following properties:

- `name` (required) - a unique name for this plugin
- `version` (required) a semver-formatted version string
- `description` - a short description of the plugin for use in documentation
- `experimental` - set this true if the plugin is experimental (no current effect)
- `provides` - a list of "features" (arbitrary strings) that the plugin provides; the plugin name is automatically included in this list
- `after` - a list of "features" that need to be established before this plugin runs
- `before` - a list of "features" that must not be processed until after this plugin runs

In addition to these common properties, Graphile Config plugins have additional
optional fields to influence various different "scopes".

V4 "schema" plugins are now primarily concerned with these scopes:

- `inflection` - naming things
- `gather` - gathering the data necessary to build the schema, and outputting a registry
- `schema` - assigning behaviors to entries in the registry and then building a GraphQL schema based on these

Server plugins are likely more concerned with these scopes:

- `grafserv` - handing HTTP requessts
- `grafast` - handling the GraphQL request (e.g. manipulating the context, etc)

:::info

Currently the `postgraphile` CLI does not accept many options - it is intended
that users will provide options via the `graphile.config.ts` (or similar)
file - so there is no plugin interface for adding CLI flags.

:::

#### plugin.inflection

In V4, "inflection" was one of the hooks that were called whilst building a
schema. In V5, inflection has been promoted to its own phase, primarily because
"naming things" is a global concern that applies to both the `gather` and
`schema` phases (see below). Inflectors are also now defined in a declarative
(i.e. object properties) way, rather than an imperative (i.e. function calls)
way - this allows the system to inspect plugins without executing them.

##### .add

Used to add inflectors; when doing so you should also add their type
definitions. Note that the type definitions only include the arguments that you
call the inflector with, the inflector implementation has an extra initial
argument (`options`) that the system automatically passes.

Defining connection and list fields should now use the `this.listField(...)`
and `this.connectionField(...)` inflectors respectively as part of their
implementation, this will ensure that the fields are consistently named across
the schema.

The inflectors available have changed a little, use the TypeScript
auto-completion to see what inflectors are available.

```ts
// Declare the type
declare global {
  namespace GraphileBuild {
    interface Inflection {
      /** Field name for a Connection field returning all rows from the resource. */
      allRowsConnection(this: Inflection, resource: PgResource): string;
    }
  }
}

// Implement the inflector
export const PgAllRowsPlugin: GraphileConfig.Plugin = {
  name: "PgAllRowsPlugin",
  version: "0.0.0",

  inflection: {
    add: {
      allRowsConnection(
        options, // Additional argument, automatically passed by the system
        resource, // This is the argument you defined in the types above
      ) {
        return this.connectionField(
          this.camelCase(
            `all-${this.pluralize(this._singularizedResourceName(resource))}`,
          ),
        );
      },
      // ...
    },
  },
  // ...
};
```

##### .replace

Should you wish to replace an inflector, you may use this hook instead. It
works similarly to `add` above, with the following two differences:

1. The type declaration is not required (since it already exists, right?)
2. an additional first argument is prepended onto the arguments list: `prev`;
   this is the previous implementation of the inflector, for your inflector to
   call should it need to.

##### .ignoreReplaceIfNotExists

You can "replace" an inflector that doesn't exist, but a) you'll get a warning,
and b) the `prev` function will be null or undefined.

Alternatively, include the name of the inflector in `ignoreReplaceIfNotExists`
(array of strings), and if the inflector didn't previously exist then it will
continue to not exist (and we won't warn you about it). This also means that
the `prev` argument is guaranteed to exist at runtime.

```ts
export const PgAllThePeoplePlugin: GraphileConfig.Plugin = {
  name: "PgAllThePeoplePlugin",
  version: "0.0.0",

  inflection: {
    replace: {
      allRowsConnection(prev, options, resource) {
        return resource.name === "people" ? `allThePeople` : prev!(resource);
      },
      ignoreReplaceIfNotExists: ["allRowsConnection"],
    },
  },
};
```

#### plugin.gather

In V5 we've broken the schema build process into two parts:

- `gather` is where data is gathered from external sources (databases, APIs,
  the file system, etc) and converted into an "input" to feed into the schema
  phase. Critically, `gather` is asynchronous.
- `schema` is where the GraphQL schema is produced from the gathered "input".
  Critically, `schema` is synchronous.

If your plugin did anything asynchronous (extremely unlikely) then that work
would now be done during the `gather` phase. If this is the case, please reach
out to Benjie for additional documentation!

#### plugin.schema

Configures the behavior system and implements the schema hooks

##### .globalBehavior and .entityBehavior

The '@omit' and '@simpleCollections' smart tags have been replaced with the
behavior system in V5. Though the V4 preset adds compatibility with the V4
@omit system (by converting the @omit tags to behaviors), your plugins _should
not_ use the data from @omit - they should use the behavior data exclusively.

For more information on behavior, see [Behavior](../behavior).

##### .hooks

If you were writing a schema plugin, this is where the bulk of your replacement
will go.

This is where your schema hooks get registered now. A simple first change is
that we've moved from a procedural style to a declarative style. Further, we've
replaced all the `:` in the hook names with `_` to avoid needing quote marks
and to make them easier to copy/paste (since it's more likely that word
selection in an editor will select the whole string). The three arguments are
still essentially the same as they were.

For example, a V4 plugin that looks like:

```ts
const ExamplePlugin: Plugin = (builder) => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    // ...
    return fields;
  });
};
```

would look like this in V5:

```ts
const ExamplePlugin: GraphileConfig.Plugin = {
  name: "ExamplePlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        //...
        return fields;
      },
    },
  },
};
```

<!--
const {
  graphql: { GraphQLBoolean },
} = build;
const {
  scope: { isRootQuery },
} = context;
if (!isRootQuery) return fields;
return build.extend(
  fields,
  {
    true: {
      type: GraphQLBoolean,
      resolve() {
        return true;
      },
    },
  },
  "Adding Query.true field",
);
-->

If your plugin adds capabilities to `GraphileBuild.Build` then it must register
them with TypeScript via declaration merging. For example to add a `flibble`
property to `GraphileBuild.Build`, you might do:

```ts
// Ensure that the types are imported for TypeScript
import "graphile-build";
import "graphile-config";

// Extend the global GraphileBuild.Build type to add our 'flibble' attribute:
declare global {
  namespace GraphileBuild {
    interface Build {
      flibble: bool;
    }
  }
}

// And here's the plugin that actually adds the attribute at runtime:
export const FlibblePlugin: GraphileConfig.Plugin = {
  name: "FlibblePlugin",
  version: "0.0.0",
  schema: {
    hooks: {
      build(build) {
        build.flibble = true;
        return build;
      },
    },
  },
};
```

Similarly all of the scopes and contexts are typed within each hook by
camelcasing the hook name and prepending `Scope` or `Context`. For example, the
scope in the `GraphQLObjectType_fields_field` hook is now
`ScopeObjectFieldsField`. If you need to add additional entries to any of these
you should do so via declaration merging, and you should ensure that the
property is optional:

```ts
declare global {
  namespace GraphileBuild {
    interface ScopeObjectFieldsField {
      isRootNodeField?: boolean;
    }
  }
}
```

## Plans

As we read earlier, there's no loog-ahead system in PostGraphile V5; instead we
use Gra*fast*'s planning system. This is much more straightforward in most
cases; let's take a look at some examples:

[TODO]

## Examples

Here are some conversions that have taken place on some of the community plugins:

- [pg-many-to-many](https://github.com/graphile-contrib/pg-many-to-many/compare/1eaa63adc0eaf54a1e862b6d76540a6315787479...9989331f1a082a7f140ae28e946780fd4ba7b808)
- [postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter/compare/fcd5e920c50604063c5db9bc28c557bd69bcfdcc...c222f763645446af8111825d9af8128816e30510)
