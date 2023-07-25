---
title: "Graphile Build"
sidebar_position: 1
---

Graphile Build is a toolkit for auto-generating flexible and extensible GraphQL
APIs from arbitrary data sources.

The plugin system enables adding and removing of entire classes of features
easily (and enables your users to write their own or community extensions). The
behavior system gives users fine grained control over which features are
enabled for the various entities in their system. The integration with
[Gra*fast*](https://grafast.org) means that the generated schemas can typically
out-perform even hand-rolled schemas using traditional techniques such as
resolvers and DataLoader.

An example of a system build with Graphile Build is
[PostGraphile](https://postgraphile.org), which automatically builds a high performance,
highly customizeable, and best practices GraphQL API from your PostgreSQL
database.

## Automatically build GraphQL objects and fields through database introspection

The core `graphile-build` library treats GraphQL as a first-class target, but
does not know anything about databases or other data stores. By writing plugins
to introspect your datastore you can automatically build your GraphQL objects
and eliminate the development work required to keep your codebase and datastore
schema in sync.

`graphile-build-pg` is a collection of plugins which adds extensive support for
the popular PostgreSQL database system by performing introspection of your
database schema and **automatically** building the relevant GraphQL objects and
fields based on the tables, columns, functions, relations that it finds. This is
the core of [PostGraphile](https://postgraphile.org/).

But Graphile Build isn't limited to PostgreSQL, you can build `graphile-build`
plugins for anything that Node.js can communicate with.

## Automatically update your running GraphQL schema without the need to restart

For example: when your underlying data structure changes your Graphile Build
plugins can trigger a rebuild event and you'll automatically be supplied with a
fresh new GraphQL schema to replace the out-of-date one - no need to restart
your server!

## Quick to start

```js
import { buildSchema, defaultPreset } from "graphile-build";
import { printSchema } from "graphql/utilities";

const preset = {
  extends: [
    defaultPreset,
    // Add more presets here!
  ],
};

const schema = await buildSchema(preset);
console.log(printSchema(schema));
```
