import { constant, grafast } from "grafast";
import { GraphQLScalarType } from "grafast/graphql";
import { buildSchema, QueryPlugin } from "graphile-build";
import { makeExtendSchemaPlugin, gql } from "../src";

const ExtendPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    scalar Scalar1
    scalar Scalar2
    extend type Query {
      scalar1: Scalar1
      scalar2: Scalar2
    }
  `,
  plans: {
    Query: {
      scalar1() {
        return constant("hello world");
      },
      scalar2() {
        return constant("hello world");
      },
    },
    Scalar1: new GraphQLScalarType({
      name: "SomethingElse",
      serialize() {
        return 1;
      },
      parseLiteral() {
        return 1;
      },
      parseValue() {
        return 1;
      },
    }),
    Scalar2: {
      serialize() {
        return 2;
      },
      parseLiteral() {
        return 2;
      },
      parseValue() {
        return 2;
      },
    },
  },
});

it("supports scalars", async () => {
  const schema = buildSchema({
    plugins: [QueryPlugin, ExtendPlugin],
  });
  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      {
        scalar1
        scalar2
      }
    `,
  });
  expect(result).toEqual({
    data: {
      scalar1: 1,
      scalar2: 2,
    },
  });
});
