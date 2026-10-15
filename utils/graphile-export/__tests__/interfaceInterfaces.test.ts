import { mkdtemp, rm, writeFile } from "node:fs/promises";

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema,
} from "grafast/graphql";

import { exportSchemaAsString } from "../src/index.ts";

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

it("exports an interface that implements an interface declared after it", async () => {
  const dir = await mkdtemp(`${__dirname}/tmp-`);
  const file = `${dir}/schema.js`;
  try {
    const { code } = await exportSchemaAsString(schema, { mode: "graphql-js" });
    await writeFile(file, code);
    const { schema: imported } = await import(file);
    expect(printSchema(imported)).toEqual(printSchema(schema));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
