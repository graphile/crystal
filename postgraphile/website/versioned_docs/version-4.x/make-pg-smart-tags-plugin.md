---
title: makePgSmartTagsPlugin
---

# makePgSmartTagsPlugin (graphile-utils v4.5.0+)

Smart Tags enable you to customize how (or if) your PostgreSQL resources are
represented in your PostGraphile GraphQL schema. Before reading this page, you
should familiarize yourself with [Smart Tags](./smart-tags) so that you know
when and why you would use them.

`makePgSmartTagsPlugin` and `makeJSONPgSmartTagsPlugin` are plugin generators
that allows you to easily apply smart tags to various PostgreSQL entities.

- `makePgSmartTagsFromFilePlugin` is the highest level function, and loads smart
  tags from a JSON5 file.
- `makeJSONPgSmartTagsPlugin` is like `makePgSmartTagsFromFilePlugin`, except it
  allows you to specify the configuration object in code rather than via a JSON5
  file.
- `makePgSmartTagsPlugin` is the lowest level plugin, it allows you to apply
  smart tags to PostgreSQL entities that match your specified rules.

We recommend the [postgraphile.tags.json5 file](./smart-tags-file) to most
users; but the below plugin generators can be helpful if you have more advanced
needs.

### makePgSmartTagsFromFilePlugin

Unlike most other plugin generators, this plugin comes from
`postgraphile/plugins`. The reason it's not in `graphile-utils` is because it
needs to access the file-system.

```ts
const { makePgSmartTagsFromFilePlugin } = require("postgraphile/plugins");
```

Usage example:

```ts
const SmartTagsPlugin = makePgSmartTagsFromFilePlugin(
  // JSON and JSONC are also JSON5 compatible, so you can use these extensions if you prefer:
  "/path/to/my/tags.file.json5",
);

// ...

app.use(
  postgraphile(process.env.DATABASE_URL, "app_public", {
    //...
    appendPlugins: [SmartTagsPlugin],
  }),
);
```

This plugin powers the automatic
[postgraphile.tags.json5 file](./smart-tags-file) support in PostGraphile CLI,
and can be used as above for library users. You can even use it multiple times
to merge smart tags from multiple files should you wish.

### makeJSONPgSmartTagsPlugin

```ts
const { makeJSONPgSmartTagsPlugin } = require("graphile-utils");
```

```ts
function makeJSONPgSmartTagsPlugin(
  json: JSONPgSmartTags | null,
  subscribeToJSONUpdatesCallback?: SubscribeToJSONPgSmartTagsUpdatesCallback | null,
): Plugin;

type JSONPgSmartTags = {
  version: 1;
  config: {
    [kind in PgSmartTagSupportedKinds]?: {
      [identifier: string]: {
        tags?: PgSmartTagTags;
        description?: string;
        attribute?: {
          [attributeName: string]: {
            tags?: PgSmartTagTags;
            description?: string;
          };
        };
        constraint?: {
          [constraintName: string]: {
            tags?: PgSmartTagTags;
            description?: string;
          };
        };
      };
    };
  };
};

type SubscribeToJSONPgSmartTagsUpdatesCallback = (
  cb: UpdateJSONPgSmartTagsCallback | null,
) => void | Promise<void>;
```

This plugin generator takes a `JSONPgSmartTags` object, and adds the relevant
tags to the relevant entities referenced. It is what powers
makePgSmartTagsFromFilePlugin above, but you can also use it in your own
PostGraphile schema plugins.

An example of an empty `JSONPgSmartTags` object would be:

```json5
{
  version: 1,
  config: {
    class: {},
    attribute: {},
    constraint: {},
    procedure: {},
  },
}
```

A more in-depth example of this configuration file, with comments, is available
in [the postgraphile.tags.json5 file documentation](./smart-tags-file).

Within the config object, we can add entries for each supported "kind" of
PostgreSQL entity. The supported entities include:

- `class` - for tables, views, materialized views, compound types and other
  table-like entities; things you'd find in the
  [`pg_class` PostgreSQL system table](https://www.postgresql.org/docs/current/catalog-pg-class.html).
- `attribute` - for columns/attributes of a `class`; things you'd find in the
  [`pg_attribute` PostgreSQL system table](https://www.postgresql.org/docs/current/catalog-pg-attribute.html).
- `constraint` - for constraints; things you'd find in the
  [`pg_constraint` PostgreSQL system table](https://www.postgresql.org/docs/current/catalog-pg-constraint.html).
- `procedure` - for functions and procedures; things you'd find in the
  [`pg_proc` PostgreSQL system table](https://www.postgresql.org/docs/current/catalog-pg-proc.html)

The value for each of these kinds would be another object, keyed by the
identifier of the PostgreSQL entity, then containing the configuration for that
entity type. Identifiers for each entity type differ:

- `class` - `schema_name.table_name`
- `attribute` - `schema_name.table_name.column_name`
- `constraint` - `schema_name.table_name.constraint_name`
- `procedure` - `schema_name.function_name` (NOTE: since PostGraphile doesn't
  support function overloading, function parameters are not factored into the
  identifier.)

For each identifier, you may present the fully qualified form as shown above, or
you may drop the left most segments, e.g. a column `id` in table `users` in
schema `app_public` could be specified as `app_public.users.id` or `users.id` or
just `id`.

Where the form used is not fully qualified, the configuration will be applied to
all entities that match. For example if you wanted to omit create/update on all
`created_at`/`updated_at` columns across all your tables, the configuration
might look like:

```json5
{
  version: 1,
  config: {
    attribute: {
      created_at: { tags: { omit: "create,update" } },
      updated_at: { tags: { omit: "create,update" } },
    },
  },
}
```

The configuration object for each matched entity accepts the following
parameters (all optional):

- `tags` - a map of all the tags you wish to apply; these will be merged with
  the tags applied through other means (overwriting tags of the same name). See
  the Smart Tags documentation for more information about what tags are
  available, and what values they can have.
- `description` - a description to apply to this resource, equivalent to using
  `COMMENT ON` on the underlying PostgreSQL entity (except that Smart Comment
  parsing does not take place).

For the `class` entity type, the following convenience attributes are also
available to enable you to keep tables, columns and constraints configured in
the same location. When used, the column/constraint identifiers must **not** be
fully qualified, since the table identifier will be automatically prepended for
you.

- `attribute` - for columns
- `constraint` - for constraints

To have this plugin work in watch mode, a `subscribeToJSONUpdatesCallback`
method can be passed as a second argument. If/when Graphile Engine enters watch
mode (e.g. via `postgraphile --watch`), this callback will be called, and it
will be passed a callback function that in turn must be called when a change
takes place. When watch mode is exited, the function will be called again
without a callback, and whatever was in place for watching must be released. An
example implementation of this can be found in `makePgSmartTagsFromFilePlugin`
in PostGraphile itself, which monitors a JSON5 file for changes and triggers the
schema to refresh when this file changes. See:
https://github.com/graphile/postgraphile/blob/9de271ecdddcd13fd42f8eac6777f0057ee8f7e7/src/plugins.ts#L23-L47

### makePgSmartTagsPlugin

```ts
const { makePgSmartTagsPlugin } = require("graphile-utils");
```

```ts
function makePgSmartTagsPlugin(
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
  subscribeToUpdatesCallback?: SubscribeToPgSmartTagUpdatesCallback | null,
): Plugin;

interface PgSmartTagRule<T extends PgEntity = PgEntity> {
  kind: PgEntityKind;
  match: string | PgSmartTagFilterFunction<T>;
  tags?: PgSmartTagTags;
  description?: string;
}

type PgSmartTagFilterFunction<T> = (input: T, build: Build) => boolean;

type UpdatePgSmartTagRulesCallback = (
  ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null,
) => void;

type SubscribeToPgSmartTagUpdatesCallback = (
  cb: UpdatePgSmartTagRulesCallback | null,
) => void | Promise<void>;
```

This is a more versatile, but higher effort plugin generator that powers
`makeJSONPgSmartTagsPlugin`. Rather than passing a configuration object, a list
of rules (or a single rule) is passed.

Rules must specify a `kind` (`class`, `attribute`, `constraint` or `procedure`)
and a `match` which could be the identifier (following the same rules as for
`makeJSONPgSmartTagsPlugin`) or a matcher function. The matcher function makes
this plugin generator incredibly powerful, for example it could be used to apply
tags to all PostgreSQL entities that match a particular criteria that does not
need to relate to the entity's name. The matcher function is passed the Graphile
Engine representation of the entity type (see
[PgIntrospectionPlugin](https://github.com/graphile/graphile-engine/blob/49c99ced8a186a42d4f3f20c66cd3761f61cd4c3/packages/graphile-build-pg/src/plugins/PgIntrospectionPlugin.d.ts#L22-L145)
for these definitions) and the `Build` object, and must return a boolean to say
whether this entity should be matched or not.

Like with `makeJSONPgSmartTagsPlugin`, the rule may also optionally supply the
`tags` Smart Tags object to be merged, and a `description` to overwrite the
previous description.

The plugin also supports a `subscribeToUpdatesCallback` to enable watch mode,
which works in the same way as `subscribeToJSONUpdatesCallback` from
`makeJSONPgSmartTagsPlugin`.

### Source code

Please refer to
https://github.com/graphile/graphile-engine/blob/master/packages/graphile-utils/src/makePgSmartTagsPlugin.ts,
https://github.com/graphile/postgraphile/blob/9de271ecdddcd13fd42f8eac6777f0057ee8f7e7/src/plugins.ts#L23-L47
and https://github.com/graphile/graphile-engine/pull/541
