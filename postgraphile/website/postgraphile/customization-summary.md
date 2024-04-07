---
layout: page
path: /postgraphile/customization-summary/
title: Customization summary
---

PostGraphile offers a variety of options, in both JavaScript and SQL, for
customizing your API. There are three primary tools at your disposal:

- your database objects (constraints, functions, tables, views, indexes, etc.)
- annotations of these objects (e.g. via [database "smart comments"](./smart-comments) or
  [postgraphile.tags.json5](./smart-tags-file))
- configuration (including plugins and presets)

This page provides an overview of those options.

## Database Objects

PostGraphile encourages you to focus on the design of your database, and will
do its best to automatically extract a best practices GraphQL API from your
well designed database schema. When designing your database schema it's
critical that you use best practices: primary keys, unique and foreign key
constraints, indexes, and so on.

When you add new entities to your database, assuming that the revevant
permissions are `GRANT`-ed, PostGraphile will generate related fields and types
automatically.

### Tables, Views, Materialized Views and Constraints

When you add a table, view or materialized view to your database, PostGraphile
will automatically build a root field to fetch all rows from it, root fields to
fetch individual rows using the primary key and any unique constraints you've
defined, and fields on both the referencing and referenced types that reflect
the foreign key constraints you defined in the database.

Note that views and materialized views don't natively support constraints, so
PostGraphile provides a system whereby you can add ["virtual
constraints"](./smart-tags#virtual-constraints) to your view/materialized view
so that it acts as if it had primary keys, unique constraints, and foreign key
constraints.

Learn more about using [tables](./tables) and [views](./views) to customize your
API, and about how foreign key constraints are used to form
[relations](./relations) between types in your GraphQL schema.

### Functions

When you add a function to the database, PostGraphile uses heuristics to figure
out how that function should be exposed in your schema. If your function is
`volatile` (the default for a `CREATE FUNCTION` statement) then PostGraphile
will assume that it changes data and will add it as a mutation (this is known
as a "custom mutation" function). If you mark your function as `STABLE` or
`IMMUTABLE` when you define it in the database, PostGraphile will add it to the
query operation, either as a top-level field (aka a "custom query" function)
or, if it matches a specific set of criteria, as a field on a table type (known
as a "computed column" function).

:::tip "Computed column" functions should have been called "custom field" functions

The term 'computed column' is a legacy misnomer, these fields can return
complex types, arrays, and event "sets" (which will be exposed as GraphQL
connections) - they are not limited to the simple scalars you might expect from
a 'column'.

:::

Learn more about using [Custom Query functions](./custom-queries), [computed
column functions](./computed-columns) and [custom mutation
functions](./custom-mutations) to customize your API.

## Annotations

Annotations come in the form of "descriptions" and "smart tags". Descriptions are
added to the resulting GraphQL types/fields/arguments/etc as documentation (you
will be able to read this in GraphiQL, for example). "Smart tags" are simple
values that influence the way that PostGraphile and any plugins you are using
handle the given database objects to which they are applied. Smart tags are
formed of a name which by convention we always prefix with an `@`, and a value
which is either the boolean `true`, a string, or a list of these.

Annotations can be provided through a combination of sources including
PostgreSQL comments, JSON tags files, and plugins.

### Hiding or Renaming Fields

A `@name` "smart tag" can be used to rename any function, table, or view. An
`@omit` tag can similarly be used to hide any field from the API, while a
`@resultFieldName` tag can be used to rename the result of a mutation. [Learn
more about smart tags](smart-tags).

<!-- TODO: check that `resultFieldName` is still in use in V5. -->

### Virtual Constraints

Views (which can't have constraits) can add constraint-like fields by using
`@foreignKey`, `@primaryKey` or `@unique` smart tags. These enable the views to
function like more fully-featured tables. [Learn more about virtual constraint
smart tags](./smart-tags#virtual-constraints).

### Adding Documentation

You can change the description of a type or field in your GraphQL schema
through annotations. Descriptions are visible in GraphiQL's documentation panel
and may also be visible in your editor and various other locations. By default,
PostGraphile will extract all the smart tags from each database comment and use
the remainder of the comment for the description of the resource. You can also
provide descriptions through the `postgraphile.tags.json5` file or through
plugins.

Learn more about adding descriptions through ["smart
comments"](./smart-comments) and [postgraphile.tags.json5](./smart-tags-file).

<!-- TODO: we don't actually have a page on adding descriptions to things? -->

## Configuration

PostGraphile is highly configurable and extensible, enabling you to customize
it easily to fit your tastes and expand its capability to fit your needs. The
starting point for this is your PostGraphile configuration, typically stored
into a `graphile.config.ts` (or `.js`, `.mts`, `.cjs`, ...) file. This file
details your base preset(s) and plugin(s), and configuration options for them.

Learn more about [configuring PostGraphile](./config).

### Presets

Presets combine other presets, plugins and options together into a convenient
JS object that can be easily shared. PostGraphile offers a number of built in
presets (and this will likely grow over time) so that you can choose your base
behavior, currently these are:

- `postgraphile/presets/amber` - the base preset containing most of PostGraphile's functionality; you'll need this!
- `postgraphile/presets/v4` - a preset that eases the transition from PostGraphile V4 to V5 by converting V4's configuration options to V5's equivalents, and also amends the defaults used in the Amber preset and adds some additional plugins so that V5 acts much more like V4
- `postgraphile/presets/relay` - a preset for people who want a beautiful Relay-centric GraphQL schema; in particular this turns off things like primary keys and tries to make it so the system uses [GraphQL global object identifiers](,/node-id) everywhere

The configuration for PostGraphile mentioned above is in itself a preset.

### Plugins

The basic building block of PostGraphile is a plugin: a simple JavaScript
object with a name and the ability to hook into various parts of the
PostGraphile lifecycle. Plugins are incredibly powerful, in fact almost all of
the core functionality of PostGraphile is implemented through plugins, and
there's a rich ecosystem of third party plugins that people have built to
extend PostGraphile to their taste.

#### Schema plugins

Though some plugins (such as [inflection plugins](./extending#inflection-example)) are
very easy to write, when it comes to extending and augmenting the GraphQL
schema you'll likely want to use one of our plugin factories which abstract
away the boilerplate so that you cah achieve your goals more rapidly:

- `makeExtendSchemaPlugin` - enables you to add your own GraphQL types, fields, resolvers and plans to the schema using GraphQL SDL and plain JavaScript/TypeScript
- `makeWrapPlansPlugin` - enables you to augment the behavior of existing (e.g. autogenerated) plans, for example automatically filtering out certain results from a record set
- `makeChangeNullabilityPlugin` - lets you change the "nullability" of a field, e.g. marking it as nullable or non-nullable
- etc

Alternatively, read more about writing your own [schema plugins](./extending).

## Common Tasks

### Adding New Root-Level Query Fields

Options for creating new root-level query fields include:

- create a database table (best for fields with new data)
- create a database view (best for fields of derived data)
- create a [custom query function](./custom-queries) (best when additional SQL logic is needed)
- use a [schema plugin](./extending), eg. [make-extend-schema-plugin](make-extend-schema-plugin) (best when Javascript logic is needed)

### Adding New Query Sub-Fields

Options for adding new sub-fields vary depending on their root-level field:

#### Table-based Root-Level Fields

- alter the table to add columns (best for fields with new data)
- alter the table to add new constraints (best for relationship fields)
- add [computed column functions](./computed-columns) (best for derived data)

#### View-based Root-Level Fields

- alter the view to add columns (best for derived data)
- add ["virtual constraints"](./smart-tags#virtual-constraints) (best for relationship fields)

#### Function-based Root-Level Fields

- alter the function to return additional values

All root-level query fields can also add new sub-fields by using a
[schema plugin](./extending), eg.
[make-extend-schema-plugin](make-extend-schema-plugin) (best when Javascript
logic is needed).

### Adding New Mutations

Options for adding new mutations include:

- add new tables to create mutations for altering their data
- add a [custom mutation](custom-mutations) function (best for for SQL-only logic)
- use a [schema plugin](./extending), eg. [make-extend-schema-plugin](make-extend-schema-plugin) (best when Javascript logic is needed)

### Renaming Fields (Query or Mutation)

To rename any field, simply rename the database object that it is based on. To
rename that field in the API _without_ renaming it in the database, add a
`@name` [smart tag](smart-tags).

### Removing Fields (Query or Mutation)

To remove any query field mutation entirely, simply remove the corresponding
object from your database. To prevent a field from appearing in the API
_without_ removing it from the database, add an `@omit` [smart tag](smart-tags).

### Adding Documentation (Query or Mutation)

Any type of field can have its API documentation (eg. for GraphiQL) customized
by adding [smart comments](smart-comments).
