---
title: "Overview"
sidebar_position: 1
hide_table_of_contents: true
---

Graphile Engine is a library for constructing high-performance pluggable GraphQL APIs. In versions later than 4.x, Graphile Engine was rewritten and split into two parts: the _engine_ became the basis for [Gra*fast*](https://grafast.org) and the remaining project renamed Graphile Build.

## Graphile Engine for pluggable GraphQL APIs

Using Graphile Engine's plugin architecture you can rapidly generate high-performance extensible GraphQL schemas by combining plugins and leveraging advanced look-ahead features.

##### Build your schema with plugins

```js
buildSchema(plugins);
```

```graphql
type Person {
  /* highlight-next-line */
  # @deprecated Use 'name' instead
  # The person's first name
  firstName: String

  #...
```

##### Transform your schema with ease

```js
buildSchema([...plugins, DeprecateFromCommentPlugin]);
```

```graphql
type Person {
  # The person's first name
  /* highlight-start */
  firstName: String @deprecated(
    reason: "Use 'name' instead")
  /* highlight-end */

  #...
```

## Graphile Engine for GraphQL performance

Say Goodbye to the N+1 problem; fewer round-trips means higher performance.

By using our [look-ahead feature](/graphile-build/look-ahead) your code can
know what's coming and make sure it requests the correct fields ahead of time,
leading to fewer round-trips and higher performance.

[PostGraphile 4.0](https://postgraphile.org) uses this functionality to serve even deeply
nested requests with just one SQL query. Result: significantly reduced query
latency and massive performance increase.

## Automatically build GraphQL objects and fields through database introspection

The core `graphile-build` library treats GraphQL as a first-class target, and
out of the box does not discriminate between your datastore. By using plugins to
introspect your datastore you can automatically build your GraphQL objects and
eliminate the development work required to keep your codebase and database
schema in sync.

[`graphile-build-pg`](../graphile-build-pg) is a collection of plugins which adds extensive support for
the popular PostgreSQL database system by performing introspection of your
database schema and **automatically** building the relevant GraphQL objects and
fields based on the tables, columns, functions, relations that it finds. This is
the core of [PostGraphile 4.0](https://postgraphile.org).

You can build plugins for anything that Node.js can communicate with.

## Straightforward integration

If you're already building with the reference implementation of GraphQL from
Facebook then adding hooks is fairly straightforward:

##### `graphql`

```js
const MyType =
/* highlight-next-line */
  new GraphQLObjectType({
    name: 'MyType',
    fields: {
      // ...
```

##### `graphile-build`

```js
const MyType =
/* highlight-next-line */
  newWithHooks(GraphQLObjectType, {
    name: 'MyType',
    fields: {
      // ...
```

## Fully GraphQL compatible

Graphile uses the <a href="http://graphql.org/graphql-js/">reference GraphQL
implementation</a> under the hood, so you know it's spec compliant.

This also means you can mix it into existing GraphQL APIs, or mix existing
GraphQL object types into it (so long as they use the reference GraphQL
implementation too).

## Automatically update your running GraphQL schema without the need to restart

For example: when your underlying data structure changes your Graphile Build
plugins can [trigger a rebuild](./schema-builder#registerwatcherwatcher-unwatcher) event and you'll automatically be supplied with a
fresh new GraphQL schema to replace the out-of-date one - no need to restart
your server!

## Quick to start

```js
import { buildSchema, defaultPreset } from "graphile-build";
import { printSchema } from "graphql";

const preset = {
  extends: [
    defaultPreset,
    // Add more presets here!
  ],
};

const schema = await buildSchema(preset);
console.log(printSchema(schema));
```
