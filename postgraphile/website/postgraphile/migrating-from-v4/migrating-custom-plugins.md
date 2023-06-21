---
title: "Custom plugins"
toc_min_heading_level: 2
toc_max_heading_level: 4
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

Many of the types need to be converted, here's a few:

- `import("graphile-build").Build` -> `GraphileBuild.Build`
- `import("graphile-build").Plugin` -> `GraphileConfig.Plugin` (the `inflection`, `gather` and `schema` scopes therein)
- `import("postgraphile").PostGraphilePlugin` -> `GraphileConfig.Plugin` (the `grafast` and `grafserv` scopes therein)
- `import("postgraphile").PostGraphileOptions` -> `GraphileConfig.Preset` (split across the various scopes therein)

## No look-ahead

Graphile Build no longer has a look-ahead engine, instead it uses Gra*fast*
plans. (You should familiarize yourself with [Gra*fast*'s documentation](https://grafast.org/grafast/).)

That means all of the APIs that related to "data generators" and the
`QueryBuilder` and similar no longer exist:

- 🚮 `QueryBuilder`
- 🚮 `getDataFromParsedResolveInfoFragment`
- 🚮 `addDataGenerator`
- 🚮 `addArgDataGenerator`
- 🚮 `queryFromResolveData`
- 🚮 `selectGraphQLResultFromTable`

Similarly you should no longer use resolvers since Gra*fast* plan resolvers
replace both of these needs. (You _can_ use traditional resolvers with
Gra*fast*, but they lose many of the benefits of plan resolvers. Further, a
Gra*fast* plan that does not use any traditional resolvers is considered
"pure", so your plugin should aim to not "taint" your users' schemas.)

The good news is that Gra*fast* plan resolvers are typically much (much)
shorter and easier to read, write and understand compared to the chaotic mess
that was V4's look-ahead system. We'll look at this a bit more in
[Plans](#plans) below.

## Type registration

In V4 you could define types in an ad-hoc manner as and when you needed them
using the `newWithHooks()` function, but this caused havoc at runtime because
it meant that sometimes a type didn't already exist when you needed it &mdash; they
were very dependent on ordering. This was particularly obvious when using
`makeExtendSchemaPlugin` and trying to use auto-generated types that may or may
not exist yet. Worse still, plugins that built types only if a type with that
name didn't already exist could get tricked into using an incompatible type!

In V5, all types must be registered by name during the `init` hook. The types
still are not created until they are needed (and may not be created at all),
but their names and spec generation functions must be registered ahead of time.
This means that when building fields and arguments you can always reference a
type by its name (using `build.getTypeByName('TypeNameHere')`).

Instead of `build.newWithHooks` you should use the registration methods (note
that instead of passing the constructor as you did in `build.newWithHooks`, you
choose the correctly named function):

- `build.registerObjectType(typeName, scope, specCallback, origin)`
- `build.registerInterfaceType(typeName, scope, specCallback, origin)`
- `build.registerUnionType(typeName, scope, specCallback, origin)`
- `build.registerScalarType(typeName, scope, specCallback, origin)`
- `build.registerEnumType(typeName, scope, specCallback, origin)`
- `build.registerInputObjectType(typeName, scope, specCallback, origin)`

They each take 4 arguments:

- `typeName` is the (unique) name of the type (this would typically come from
  an inflector)
- `scope` is an object with any `GraphileBuild.Scope` data relevant to this
  hook, useful for other plugins to register hooks against the type
- `specCallback` is a callback function that takes no arguments and returns the
  spec object. Spec objects are similar to the ones that would be used with
  GraphQL.js constructors, except they have an extra couple of optional
  convenience properties specific to Gra*fast*.
- `origin` is a string describing where this type came from / why it exists -
  it's particularly handy when two types try and register the same name

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
          () => ({
            // Here's the spec for the type
            description: "...",
            fields: {
              //...
            },

            // If this type requires a particular step class, optionally
            // specify it here:
            //
            //     assertStep: ObjectStep,
            //
            // Or if you prefer, you can make `assertStep` a callback that
            // throws an error if the step passed is incompatible:
            //
            //     assertStep($step: ExecutableStep): asserts $step is ObjectStep {
            //       if (!($step instanceof ObjectStep)) {
            //         throw new Error(`Expected ObjectStep, instead received '${$step}'`);
            //       }
            //     },
          }),
          `Here you'd put a helpful phrase detailing why this type is being registered; useful when two types try and register with the same name`,
        );

        return _;
      },
    },
  },
};
```

## Introspection

In V5 we've split the schema build process into two parts:

- `gather` is where data is gathered from external sources (databases, APIs,
  the file system, etc) and converted into an "input" to feed into the schema
  phase. Critically, `gather` is asynchronous.
- `schema` is where the GraphQL schema is produced from the gathered "input".
  Critically, `schema` is synchronous.

Introspection data is only available in the `gather` phase, from there it's
converted into abstractions (resources, codecs, relations and behaviors) which
are used during the `schema` phase. Further the introspection system has been
replaced by a standalone module `pg-introspection` which is strongly typed - it
actually embeds parts of the TypeScript documentation so that when you hover
over its various properties in your editor it will tell you how Postgres
describes those fields!

As such `pgIntrospectionResultsByKind` is no more, and anything that you had
that relied on introspection results will need to be mapped to using the
abstractions. Typically this results in your code being a bit simpler, but there
are somethings you should pay particular attention to:

- In V4 you'd often look at the foreign key constraints on a table and go
  "forwards" and "backwards" from them. In V5 the abstraction for these is a
  relation, which only represents one direction. A "backwards" relation is one
  that has the "isReferencee" property set. The backward and forward relations
  can have different smart tags.
- Whereas in V4 you'd think in terms of "classes" (tables, views, etc) and
  "procs" (functions), in V5 these are all abstracted as "resources" (functions
  are resources that accept `parameters`, table-likes are resources that
  don't); and importantly every resource has a `codec` that describes what it
  returns. Sometimes you should focus on `codec` (e.g. when it doesn't matter
  if the row has come from a table or function) whereas others you should focus
  on the resource (when you need to actually _get_ the row).
- Changes to behaviors (@omit/etc) should be done during the `gather` phase if
  they require fetching additional data (e.g. from files, databases, APIs,
  etc), or using the behavior system otherwise.

## Presets

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

## Plugins

In PostGraphile V4 there were two types of plugins:

- schema plugins (functions) interacted with Graphile Engine (graphile-build
  and graphile-build-pg) and were responsible to changes to your GraphQL schema
- server plugins (objects) interacted with PostGraphile and it's server/CLI and
  were responsible to changes to how the HTTP requests were handled and other
  "high level" concerns (including such concerns as which additional schema
  plugins to load!)

In V5 there is only one type of plugin, a Graphile Config plugin. Graphile
Config plugins are objects with the following properties:

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

### plugin.inflection

In V4, "inflection" was one of the hooks that were called whilst building a
schema. In V5, inflection has been promoted to its own phase, primarily because
"naming things" is a global concern that applies to both the `gather` and
`schema` phases (see below). Inflectors are also now defined in a declarative
(i.e. object properties) way, rather than an imperative (i.e. function calls)
way - this allows the system to inspect plugins without executing them.

#### .add

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

##### Example

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

#### .replace

Should you wish to replace an inflector, you may use this hook instead. It
works similarly to `add` above, with the following two differences:

1. The type declaration is not required (since it already exists, right?)
2. an additional first argument is prepended onto the arguments list: `prev`;
   this is the previous implementation of the inflector, for your inflector to
   call should it need to.

#### .ignoreReplaceIfNotExists

You can "replace" an inflector that doesn't exist, but a) you'll get a warning,
and b) the `prev` function will be null or undefined.

Alternatively, include the name of the inflector in `ignoreReplaceIfNotExists`
(array of strings), and if the inflector didn't previously exist then it will
continue to not exist (and we won't warn you about it). This also means that
the `prev` argument is guaranteed to exist at runtime.

##### Example

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

### plugin.gather

If your plugin did anything asynchronous (extremely unlikely) then that work
would now be done during the `gather` phase. If this is the case, please reach
out to Benjie for additional documentation!

### plugin.schema

Configures the behavior system and implements the schema hooks

#### .globalBehavior and .entityBehavior

The '@omit' and '@simpleCollections' smart tags have been replaced with the
behavior system in V5. Though the V4 preset adds compatibility with the V4
@omit system (by converting the @omit tags to behaviors), your plugins _should
not_ use the data from @omit - they should use the behavior data exclusively.

For more information on behavior, see [Behavior](../behavior).

#### .hooks

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

### Extending build

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

### Extending scopes

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

### Adding configuration options

If your plugin requires the user to pass configuration options, most likely
they should be in the `preset.schema` scope which should be retrieved via
`build.options`. When doing so, we also need to add to the declaration-merged
types so that TypeScript understands the presence of the new option:

```ts
declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      /**
       * The default option to use for the 'includeArchived' argument. Defaults to
       * 'INHERIT' where feasible and 'NO' otherwise.
       */
      pgArchivedDefault?: "INHERIT" | "NO" | "YES" | "EXCLUSIVELY";
    }
  }
}
```

Note also that tools like `graphile config options` will look at these
TypeScript definitions and use them to provide documentation to the user - as
such you should be sure to add a `/** ... */` comment describing the feature,
as we have above.

## Plans

As we read earlier, there's no look-ahead system in PostGraphile V5; instead we
use Gra*fast*'s planning system.

Where you used to use `addArgDataGenerator` you should now give your argument
an `applyPlan` and set `autoApplyAfterParentPlan: true` so that the plan is
automatically applied (without the parent field having to call
`fieldArgs.apply($target, 'argName')`).

Typically where you'd use a `QueryBuilder` (`queryBuilder`) in V4, you'll be
dealing with a `PgSelectStep` (`$pgSelect`) in V5. Note that these are
significantly different things, but they do have some parallels:

- `QueryBuilder.getTableAlias()` -> `$pgSelect.alias`
- `QueryBuilder.where(fragment)` -> `$pgSelect.where(fragment)`
- `QueryBuilder.orderBy(...)` -> `$pgSelect.orderBy(...)` (arguments differ, see TypeScript for details)

Note that it's common to be dealing with a `PgSelectSingleStep`
(`$pgSelectSingle`) when you're looking at a single record rather than the
collection. In this case should you need to get back to the collection (e.g. to
get the alias) you can do `$pgSelectSingle.getClassStep()`.

Should you have code that uses `queryBuilder.parentQueryBuilder` there's no
direct parallel. Instead, you should use the parent step and get what you need
from there, and then embed that value into your query using a placeholder:

```ts
// V4
const parentAlias = queryBuilder.parentQueryBuilder.getTableAlias();
queryBuilder.where(sql.fragment`${parentAlias}.archived_at is not true`);

// V5
const $archivedAt = $parent.get("archived_at");
const archivedAtFrag = $pgSelect.placeholder($archivedAt);
$pgSelect.where(sql`${archivedAtFrag} is not true`);
```

:::info

`applyPlan` on an argument accepts 4 arguments, the first is the parent step
(`$parent`), which is the step that the field itself was called on. The second
is the target step (`$pgSelect`), which is typically the result of the fields'
plan resolver. Note that input objects' `applyPlan`s only have the latter 3
arguments - they do not have access to the parent step unless their parent
input object or argument `applyPlan` explicitly pass them down.

:::

:::tip

In general, unlike in V4, you should not assume too much about how the SQL will
be generated. It's better to use simple methods like
`$record.get('column_name')` to retrieve attributes and then embed these values
using `$pgSelect.placeholder(...)` than it is to make assumptions about the
shape of the request and try and be clever and use aliases/etc. Normally
`@dataplan/pg` will be able to figure out the best way to address your needs,
and will inline things as necessary/optimal.

:::

## Examples

Here are some conversions that have taken place on some of the community plugins:

- [pg-many-to-many](https://github.com/graphile-contrib/pg-many-to-many/compare/1eaa63adc0eaf54a1e862b6d76540a6315787479...9989331f1a082a7f140ae28e946780fd4ba7b808)
- [postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter/compare/fcd5e920c50604063c5db9bc28c557bd69bcfdcc...c222f763645446af8111825d9af8128816e30510)
- [@graphile-contrib/pg-omit-archived](https://github.com/graphile-contrib/pg-omit-archived/compare/c3a3ac458e8cf328d67cc393dfefcc9784d1875e...a445527c18cac2497ccb53e0a1b119aee0514ca7?w=1)
