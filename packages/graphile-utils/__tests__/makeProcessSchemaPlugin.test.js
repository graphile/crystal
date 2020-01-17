import { makeProcessSchemaPlugin } from "../";
import {
  buildSchema,
  // defaultPlugins,
  StandardTypesPlugin,
  QueryPlugin,
  MutationPlugin,
  SubscriptionPlugin,
  MutationPayloadQueryPlugin,
} from "graphile-build";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const makeSchemaWithSpy = spy =>
  buildSchema(
    [
      StandardTypesPlugin,
      QueryPlugin,
      MutationPlugin,
      SubscriptionPlugin,
      MutationPayloadQueryPlugin,
      makeProcessSchemaPlugin(spy),
    ],
    {
      optionKey: "optionValue",
    }
  );

const makeSpy = fn => jest.fn(fn || (schema => schema));

it("Gets passed the final schema", async () => {
  let spySchema;
  const spy = makeSpy(_schema => {
    spySchema = _schema;
    return _schema;
  });
  const schema = await makeSchemaWithSpy(spy);
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
  let spySchema;
  const spy = makeSpy(_schema => {
    spySchema = _schema;
    return simpleSchema;
  });
  const schema = await makeSchemaWithSpy(spy);
  expect(spySchema).toBeTruthy();
  expect(spySchema).not.toEqual(schema);
  expect(schema).toEqual(simpleSchema);
});

it("Can tweak the schema", async () => {
  let spySchema;
  const spy = makeSpy(_schema => {
    _schema.getQueryType().description = "MODIFIED DESCRIPTION";
    spySchema = _schema;
    return _schema;
  });
  const schema = await makeSchemaWithSpy(spy);
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
