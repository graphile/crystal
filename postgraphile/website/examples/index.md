---
title: PostGraphile Example Gallery
sidebar_position: 1
---

# Example queries and mutations

_If you are new to GraphQL then we recommend you read through the official
introduction to GraphQL [here](https://graphql.org/learn/) before continuing
through the PostGraphile documentation._

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults. You can use this via the
following commands:

```
yarn add postgraphile @graphile-contrib/pg-simplify-inflector
yarn postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector
```
