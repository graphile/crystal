---
layout: page
path: /postgraphile/customization-summary/
title: Customization Summary
---

PostGraphile offers a variety of options, in both Javascript and SQL, for
customizing your API. There are three primary tools at your disposal:

- your database objects (constraints, functions, tables, views, etc.)
- your database comments ("smart comments")
- Javascript logic, via plug-ins

This page provides an overview of those options.

## Your PostgreSQL Database Objects

### Tables, Views, and Custom Query Functions

The primary way to create and maintain your API is to work with the underlying
database objects. When you do, PostGraphile will generate root-level fields for
the object itself, and nested fields for their columns/results, automatically.
Learn more about using [Custom Query functions](custom-queries),
[tables](tables) or [views](views) to customize your API.

### Constraints

You can create child-less accessor fields (eg. `postsById`) by adding
`UNIQUE` or `PRIMARY KEY` constraints to a table. [Learn more about table
constraints](tables).

`FOREIGN KEY` constraints create relationship fields for both tables involved.
[Learn more about relations](relations).

### "Computed Column" and "Custom Query" Functions

While "custom query" database functions create root-level query fields, similar
to tables and views, "computed column" functions can instead add new fields to
existing root-level types. Learn more about [computed columns](computed-columns)
and [custom queries](custom-queries).

## "Smart Tag" Annotations

Smart tags can be provided as PostgreSQL comments, JSON tag files, or through
plug-ins, and they tell PostGraphile how to treat a database object.

### Hiding or Renaming Fields

A `@name` "smart tag" (ie. PostgreSQL comment) can be used to rename any
function, table, or view. An `@omit` tag can similarly be used to hide any
field from the API, while a `@resultFieldName` tag can be used to rename the
result of a mutation. [Learn more about smart tags](smart-tags).

### Giving Views "Constraints"

Views (which can't have constraits) can add constraint-like fields by using
`@foreignKey`, `@primaryKey` or `@unique` smart tags. [Learn more about smart
tags](smart-tags).

### Adding GraphiQL Documentation

You can change the documentation of a field (as displayed in the GraphiQL
interface) through specialized PostgreSQL comments. [Learn more about smart
comments](smart-comments).

## Configuration (Plug-ins)

### Schema Plug-ins Allow Broad API Customization

Schema plug-ins are the primary means of extending PostGraphile through
Javascript/Typescript. Learn more about [Schema Plug-ins](extending).

### Server Plug-Ins

Server plug-ins, which are still experimental, allow even more advanced
customization. Learn about [Server Plug=ins](plugins).

<!--
### Schema Plug-ins Allow Broad API Customization

You can use Javascript logic and type definitions to alter any part of your API,
both to modify or ommit PostGraphile-generated fields, or to create your own, by
using a schema plug-in. [Learn more about makeExtendSchemaPlugin](makeExtendSchemaPlugin).

### Resolver Plug-Ins Change What Fields Return

By generating a resolver plug-in you can modify what specific API fields return,
after the query results are returned, but before they are exposeed. This lets
you hide fields, rename them, reformat their values, etc.
[Learn more about the makeWrapResolversPlugin](make-wrap-resolvers-plugin).

### Add Inflectors Plug-Ins Allow Complex Renaming

You can use a plug-in and Javascript logic to do more complex renaming of fields
(both root and nested). [Learn more about the Make Add Inflectors
plug-in](make-add-inflectors-plugin)

### The Simplify Inflection Plug-in Simplifies Your Whole API

By default, PostGrahile's generated field names are verbose. You can simplify
all fields in your API, turning (for instance) `User.postsByAuthorId` into
`User.posts`, by including a plug-in.
[Learn More about the Simplify Inflection plug-in](https://github.com/graphile/pg-simplify-inflector).

### Excluding Default Plug-Ins

Rarely, you may wish to exclude a class of fields (for instance, removing all
computed columns) by removing built-in PostGraphile plugins (eg. the
`PgComputedColumnsPlugin`). [Learn more about removing default
plug-ins](extending-raw#removing-things-from-the-schema).

### Custom Javascript Plug-in

You can also write completely custom Javaascript plug-ins, for instance if you
want to remove a more complex set of fields from your API.
[Learn more about removing fields with custom plug-ins](extending-raw#removing-things-from-the-schema).
 -->

<!-- Use makeAddPgTableConditionPlugin
Use @omit's filter to choose which things get filtering
Use @filterable on functions to enable filtering
Use Matt's filter plugin
Create custom query / computed column database functions
Use plugins such as pg-omit-archived
etc -->

## Mutation Fields

#### TODO
