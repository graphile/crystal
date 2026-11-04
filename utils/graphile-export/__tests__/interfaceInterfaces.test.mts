import * as assert from "node:assert/strict";
import { test } from "node:test";

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema,
} from "grafast/graphql";

import { exportSchemaAsString } from "../dist/index.js";
import { runModule } from "./helpers.mts";

// `Outer` is declared first and its field refers to `Inner`, so `Inner` is
// declared while `Outer` is still being declared. `Inner` implements `Outer`.
const Outer: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: "Outer",
  fields: () => ({ inner: { type: Inner } }),
});
const Inner: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: "Inner",
  interfaces: () => [Outer],
  fields: () => ({ inner: { type: Inner } }),
});
const Leaf = new GraphQLObjectType({
  name: "Leaf",
  interfaces: () => [Inner, Outer],
  fields: () => ({ inner: { type: Inner } }),
});
const Query = new GraphQLObjectType({
  name: "Query",
  fields: { outer: { type: Outer }, text: { type: GraphQLString } },
});
const schema = new GraphQLSchema({ query: Query, types: [Outer, Inner, Leaf] });

test("exports an interface that implements an interface declared after it", async () => {
  const { code } = await exportSchemaAsString(schema, { mode: "graphql-js" });
  const { schema: imported } = await runModule<{ schema: GraphQLSchema }>(
    code,
    "schema.mjs",
  );
  assert.equal(printSchema(imported), printSchema(schema));
});
