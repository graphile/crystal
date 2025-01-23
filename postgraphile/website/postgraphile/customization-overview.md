---
title: Customization Overview
---

PostGraphile offers a variety of options, in both JavaScript and SQL, for
customizing your API. Of course the main thing is to ensure that you have
suitable database objects in place (tables, columns, types, constraints,
functions, views, indexes, etc.) - PostGraphile should work fine with many
different shapes of database, but we do expect you to not shy away from
leveraging the powerful features your database offers.

For customization on top of these, you have three primary tools at your
disposal:

- annotations of these objects (e.g. via [database "smart comments"](./smart-comments) or
  [postgraphile.tags.json5](./smart-tags-file))
- configuration (via presets)
- extension (via plugins)

This page provides an overview of those topics.

## Database objects

PostGraphile encourages you to focus on the design of your database, and will
do its best to automatically extract a best practices GraphQL API from your
well designed database schema. When designing your database schema it's
critical that you use best practices: primary keys, unique and foreign key
constraints, indexes, and so on.

When you add new entities to your database, assuming that the revevant
permissions are `GRANT`-ed, PostGraphile will generate related fields and types
automatically.

### Tables, views, materialized views and constraints

PostGraphile will build some of the following for tables, views, and
materialized views that it finds in your database:

- root query fields to fetch all rows,
- root query fields to fetch individual rows using the primary key and any unique
  constraints you've defined,
- fields on both the referencing and referenced types that reflect the foreign
  key constraints you defined in the database, and
- mutation fields to create, update, and delete these records.

Which of these are added to your schema will be dependent on the permissions
(`GRANT`s) that you have defined in the database, the constraints you've
defined on the tables, the indexes (primarily this impacts reverse
relationships), and your configuration options including your global default
behavior (e.g. whether you prefer connections (default) or lists).

You can override these default decisions on a global, per table, or per
constraint basis using the [behavior](./behavior) system, e.g. via [smart
tags](./smart-tags) on the relevant entities, or your
`preset.schema.defaultBehavior` configuration setting.

:::tip Add "virtual" constraints to views

Views and materialized views don't natively support constraints, so
PostGraphile provides a system whereby you can add ["virtual
constraints"](./smart-tags#virtual-constraints) to your view/materialized view
so that it acts as if it had primary keys, unique constraints, and foreign key
constraints.

:::

Learn more about using [tables](./tables) and [views](./views) to customize your
API, and about how foreign key constraints are used to form
[relations](./relations) between types in your GraphQL schema.

### Functions

When you add a function to the database, by default PostGraphile uses
heuristics to figure out how that function should be exposed in your schema. If
your function is `volatile` (the default for a `CREATE FUNCTION` statement)
then PostGraphile will assume that it changes data and will add it as a
mutation (this is known as a "custom mutation" function). If you mark your
function as `STABLE` or `IMMUTABLE` when you define it in the database,
PostGraphile will add it to the query operation, either as a top-level field
(aka a "custom query" function) or, if it matches a specific set of criteria,
as a field on a table type (known as a "computed column" function).

:::info "Computed column" functions are a misnomer

"Computed column" functions were originally intended to enable adding of
scalars to types based on other attributes of the type, but they grew into so
much more and can now return entire collections of related records... However
the name "computed column" has stuck, and a suitable replacement has not yet
surfaced (the closest being "custom field"). This may be addressed at a later
time, but for now you should keep in mind that computed column functions are
not limited to the simple scalars you might expect from a 'column'.

:::

Learn more about using ["custom query" functions](./custom-queries), ["computed
column" functions](./computed-columns) and ["custom mutation"
functions](./custom-mutations) to customize your API.

## Annotations

Annotations come in the form of "descriptions" and "smart tags". Descriptions are
added to the resulting GraphQL types/fields/arguments/etc as documentation (you
will be able to read this in GraphiQL, for example). "Smart tags" are simple
values that influence the way that PostGraphile and any plugins you are using
handle the given database objects to which they are applied. Smart tags are
formed of a name which by convention we always prefix with an `@`, and a value
which is either the boolean `true`, a string, or a list of these.

For example, a `@name` "smart tag" can be used to rename any function, table,
or view; an `@omit` tag can similarly be used to hide any field from the API;
while a `@resultFieldName` tag can be used to rename the result of a mutation.
Views (which can't have constraits) can add constraint-like fields by using
`@foreignKey`, `@primaryKey` or `@unique` smart tags; these enable the views to
function like more fully-featured tables.

<!-- TODO: check that `resultFieldName` is still in use in V5. -->

Annotations can be provided through a combination of sources including
PostgreSQL comments, JSON tags files, and plugins.

Learn more about [smart tags](./smart-tags) and [virtual constraint smart
tags](./smart-tags#virtual-constraints).

### Adding documentation

You can change the description of a type or field in your GraphQL schema
through annotations. Descriptions are visible in GraphiQL's documentation panel
and may also be visible in your editor and various other locations. By default,
PostGraphile will extract all the smart tags from each database `COMMENT` and
use the remainder of the comment for the description of the resource. You can
also provide descriptions through the `postgraphile.tags.json5` file or through
plugins.

```sql
COMMENT ON TABLE users IS $$
@name people
Represents the people that can log in to our application.
$$;
```

Learn more about adding descriptions through ["smart
comments"](./smart-comments) and [postgraphile.tags.json5](./smart-tags-file).

<!-- TODO: we don't actually have a page on adding descriptions to things? -->

## Configuration

PostGraphile is highly configurable and extensible, enabling you to customize
it easily to fit your tastes and expand its capability to fit your needs. The
starting point for this is your PostGraphile configuration, typically stored
into a `graphile.config.ts` (or `.js`, `.mts`, `.cjs`, ...) file. This file
defines your configuration "preset", and can outline other presets to extend
from, plugins to add, and the configuration options to set for these.

Learn more about [configuring PostGraphile](./config).

The configuration options that are available to you in this file will be
dependent on the plugins and presets that it uses, for available options see
the documentation of the plugins and presets you are using. You may also wish
to use TypeScript to explore the options available, or try out the
sponsors-only `graphile config options` command which attempts to use the
TypeScript language server to determine which options are available to you.

### Presets

Presets combine other presets, plugins, and options together into a convenient
JS object that can be easily shared. PostGraphile offers a number of built in
presets (and this will likely grow over time) so that you can choose your base
behavior, these include:

- `postgraphile/presets/amber` - the base preset containing most of
  PostGraphile's functionality; you'll need this!
- `postgraphile/presets/v4` - a preset that eases the transition from
  PostGraphile V4 to V5 by converting V4's configuration options to V5's
  equivalents, and also amends the defaults used in the Amber preset and adds
  some additional plugins so that V5 acts much more like V4
- `postgraphile/presets/relay` - a preset for people who want a beautiful
  Relay-centric GraphQL schema; in particular this turns off things like primary
  keys and tries to make it so the system uses [GraphQL global object
  identifiers](./node-id) everywhere

As mentioned above, your `graphile.config.ts` (or similar) file itself defines
a preset.

## Extension

The basic building block of PostGraphile is a plugin: a simple JavaScript
object with a name and the ability to hook into various parts of the
PostGraphile, Grafast, Grafserv and other project lifecycles. Plugins are
incredibly powerful, in fact almost all of the core functionality of
PostGraphile is implemented through plugins, and there's a rich ecosystem of
third party plugins that people have built to extend PostGraphile to their
taste.

### Plugin factories

Though some plugins (such as [inflection
plugins](./extending#inflection-example)) are straightforward, when it comes to
extending and augmenting the GraphQL schema you may want to use one of our
[plugin factories](./extending#writing-plugins) which abstract away the
boilerplate so that you cah achieve your goals more rapidly.

`makeExtendSchemaPlugin` is the main factory you'll want for adding fields and
types to your GraphQL schema; it allows you to use GraphQL SDL to describe your
types (e.g. `extend type Query { random: Int }`) along with Grafast plans (or
even traditional GraphQL resolvers) to provide the execution logic for these
new fields.

If you want to augment something that PostGraphile already does, for example to
perform an action after a mutation completes, or automatically filter out
certain results from a record set, then `makeWrapPlansPlugin` is worth
investigating.

If the nullability in your schema is coming out wrong,
`makeChangeNullabilityPlugin` lets you change the "nullability" of a field,
e.g. marking it as nullable or non-nullable

There are many others; but if they don't fit your needs then you can read more
about writing your own [schema plugins](./extending).

## General guidance

### Storing data

If you need to store data, then your first choice will generally be a table.
Adding a table, assuming it has the correct permissions, will automatically add
fields in the relevant places, and you can gain more fields in the ways
detailed above (foreign key constraints, unique/primary key constraints,
additional columns, functions, plugins, etc).

### Deriving data

If you are deriving data from data that you already have stored then you have
more choices: view, database function, or schema extension. In general, you
should pick whichever you prefer, but be aware of the following:

- Views cannot accept parameters and require annotations to make them behave
  more table-like; only use these where table-like behavior is desired (for
  example when building a versionless facade to some underlying mutable database
  resource)
- Functions can accept parameters but have significant performance overhead if
  implemented poorly, so ensure you're familiar with [inlining of PostgreSQL
  functions](https://wiki.postgresql.org/wiki/Inlining_of_SQL_functions) and
  prefer writing your functions in `LANGUAGE sql`. Procedural programming
  constructs such as `IF` and `LOOP` should generally be avoided in favour of
  declarative SQL constructs. Functions can also not be `INSERT`-ed into,
  `UPDATE`-d or `DELETE`-d, though you can expose additional functions that
  perform this functionality.
- Schema extensions are more powerful than views and functions and give you
  stronger control over performance (e.g. forcing inlining, or even moving
  calculations to JS rather than computing in the database), but to master them
  you need familiarity with JS, SQL, and the Grafast planning system. Also, since
  they are not in the database, they can only be used by consumers of GraphQL.

### Functions vs plugins

For simple scalars (e.g. deriving `fullName` by concatenating `first_name` and
`last_name`) it commonly makes sense to use a database function. Otherwise, we
recommend that you start with whatever you are most comfortable with. If you
start to face performance issues or you discover the need for functionality
that's not compatible with your chosen pattern then you should switch to
writing a plugin, and you should be able to do this in a way that does not
break your schema. Note that both view and function support are achieved via
plugins, so anything they can do can also be achieved via a plugin.

## Common tasks

### Adding a query root field

Options for creating new root-level query fields include:

- create a database table, view or materialized view
- create a [custom query function](./custom-queries)
- use a [plugin](./extending), e.g. via [`makeExtendSchemaPlugin`](./make-extend-schema-plugin)

### Adding a field to a table-like type

(Table-like types are GraphQL types that represent database tables, views,
materialized views, or even composite types. Some of the suggestions will only
work with certain subsets of these types though.)

- add a column to store data
- add a foreign key constraint (or, for a view, an `@foreignKey` ["virtual
  constraints"](./smart-tags#virtual-constraints)) to create a relationship
  between types
- create a [computed column function](./computed-columns) (which can return
  scalars, records, or even sets of records)
- use a [plugin](./extending), e.g. via
  [`makeExtendSchemaPlugin`](./make-extend-schema-plugin)

### Adding a field to a function-derived type

We generally recommend against using "anonymous" types in your database - it's better for
functions to `returns setof named_type` than `returns table(...)` - but should you
choose to use anonymous types anyway, adding a field to these can be achieved by:

- alter the function to return additional values
- use a [plugin](./extending), e.g. via
  [`makeExtendSchemaPlugin`](./make-extend-schema-plugin)

### Adding a mutation field

Options for adding new mutations include:

- add new tables to create CRUD mutations for altering their data
- add a [custom mutation](./custom-mutations) function
- use a [plugin](./extending), e.g. via
  [`makeExtendSchemaPlugin`](./make-extend-schema-plugin)

### Renaming a field

To rename any field, you can either rename the database object that it is based
on, annotate it with a `@name` [smart tag](smart-tags) or similar, or use an
[inflection plugin](./inflection).

### Removing fields

In general it's better to prevent a field being added in the first place than
to remove it after it has been added to the schema. To avoid a field being
added to the schema, either remove the corresponding object from your database,
revoke the permissions granted on it, or add a `@behavior -*` [smart
tag](smart-tags). (Note you can also remove specific behaviors (e.g. `@behavior
-update`).)

Should this not work, you can also [explicitly delete fields from your
schema](./extending-raw/#removing-things-from-the-schema).

### Adding documentation

Database tables, views, materialized views, constraints and more can be
commented on using the `COMMENT` SQL command. Note that each time you issue
this command on a given entity it will overwrite the previous comments, so care
must be exercised.

You can also use the [smart tags](./smart-tags) system to load descriptions
from a file or plugin to apply to database-derived GraphQL entities.

You can also use a [plugin](./extending) to set descriptions, which is
generally useful if you need to set a lot of similar descriptions across your
schema. Most entities have a `description` field that you can overwrite via a
graphile-build plugin hook.

## Thanks

This page exists thanks to the significant effort invested by [Jeremy
Walker](https://github.com/machineghost), including much back and forth and
iteration. We thank Jeremy for his work on this!
