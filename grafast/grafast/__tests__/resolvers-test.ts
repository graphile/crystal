/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import {
  graphql,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
} from "graphql";
import { it } from "mocha";

import { grafast } from "../dist/index.js";

const makeSchema = () => {
  const A = new GraphQLObjectType({
    name: "A",
    fields: {
      a: {
        type: GraphQLInt,
      },
    },
  });
  const B = new GraphQLObjectType({
    name: "B",
    fields: {
      b: {
        type: GraphQLString,
      },
    },
  });
  const PolyType = new GraphQLUnionType({
    name: "PolyType",
    types: () => [A, B],
    resolveType(obj) {
      return "a" in obj ? "A" : "B";
    },
  });
  const T = new GraphQLObjectType({
    name: "T",
    fields: () => {
      return {
        polyField: {
          type: new GraphQLList(PolyType),
        },
      };
    },
  });
  const Query = new GraphQLObjectType({
    name: "Query",
    fields: () => {
      return {
        fieldWithResolver: {
          type: T,
          resolve() {
            return { polyField: [{ a: 1 }, { b: "two" }, { a: 3 }] };
          },
        },
      };
    },
  });
  return new GraphQLSchema({
    query: Query,
  });
};

it("Resolves the same in Grafast as GraphQL.js", async () => {
  const schema = makeSchema();
  const source = /* GraphQL */ `
    query Q {
      fieldWithResolver {
        polyField {
          ... on A {
            a
          }
          ... on B {
            b
          }
        }
      }
    }
  `;
  const variableValues = {};
  const executionArgs = {
    schema,
    source,
    variableValues,
    contextValue: {},
    resolvedPreset: {},
    requestContext: {},
  };

  const graphqlResult = (await graphql(executionArgs)) as ExecutionResult;
  expect(graphqlResult.errors).not.to.exist;
  expect(graphqlResult.data).to.deep.equal({
    fieldWithResolver: {
      polyField: [{ a: 1 }, { b: "two" }, { a: 3 }],
    },
  });

  const grafastResult = (await grafast(executionArgs)) as ExecutionResult;
  expect(grafastResult).to.deep.equal(graphqlResult);
});
