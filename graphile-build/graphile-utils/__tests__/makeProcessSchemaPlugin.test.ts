/* eslint-disable graphile-export/export-methods  */
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "grafast/graphql";
import {
  buildSchema,
  // defaultPlugins,
  CommonTypesPlugin,
  MutationPayloadQueryPlugin,
  MutationPlugin,
  QueryPlugin,
  QueryQueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";

import { makeProcessSchemaPlugin } from "../src/index.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      optionKey?: string;
    }
  }
}

const makeSchemaWithSpy = (spy: (schema: GraphQLSchema) => GraphQLSchema) =>
  buildSchema(
    {
      plugins: [
        CommonTypesPlugin,
        QueryPlugin,
        MutationPlugin,
        SubscriptionPlugin,
        MutationPayloadQueryPlugin,
        QueryQueryPlugin,
        makeProcessSchemaPlugin(spy),
      ],
      schema: {
        optionKey: "optionValue",
      },
    },
    {},
    {},
  );

const makeSpy = (fn?: (schema: GraphQLSchema) => GraphQLSchema) =>
  jest.fn(fn || ((schema) => schema));

it("Gets passed the final schema", async () => {
  let spySchema: GraphQLSchema;
  const spy = makeSpy((_schema: GraphQLSchema) => {
    spySchema = _schema;
    return _schema;
  });
  const schema = makeSchemaWithSpy(spy);
  expect(spySchema).toBeTruthy();
  expect(spySchema).toEqual(schema);
});

const simpleSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
});

it("Can replace the schema", async () => {
  let spySchema: GraphQLSchema;
  const spy = makeSpy((_schema) => {
    spySchema = _schema;
    return simpleSchema;
  });
  const schema = makeSchemaWithSpy(spy);
  expect(spySchema).toBeTruthy();
  expect(spySchema).not.toEqual(schema);
  expect(schema).toEqual(simpleSchema);
});

it("Can tweak the schema", async () => {
  let spySchema: GraphQLSchema;
  const spy = makeSpy((_schema) => {
    _schema.getQueryType().description = "MODIFIED DESCRIPTION";
    spySchema = _schema;
    return _schema;
  });
  const schema = makeSchemaWithSpy(spy);
  expect(spySchema).toBeTruthy();
  expect(spySchema).toEqual(schema);
  expect(schema).toMatchInlineSnapshot(`
    """MODIFIED DESCRIPTION"""
    type Query {
      """
      Exposes the root query type nested one level down. This is helpful for Relay 1
      which can only query top level fields if they are in a particular form.
      """
      query: Query!
    }
  `);
});
