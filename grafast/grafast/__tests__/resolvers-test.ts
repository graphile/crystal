/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { expect } from "chai";
import { resolvePreset } from "graphile-config";
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

import { grafast, GrafastExecutionArgs } from "../dist/index.js";

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
    resolvedPreset: resolvePreset({}),
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

describe("has correct resolveInfo.rootValue", async () => {
  let rootValues: [string, any][] = [];
  const Item = new GraphQLObjectType({
    name: "Item",
    fields: {
      value: {
        type: GraphQLString,
        resolve(source, _args, _context, info) {
          rootValues.push([info.fieldName, info.rootValue]);
          return source.value;
        },
      },
    },
  });
  const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
      rootValueKind: {
        type: GraphQLString,
        resolve(_source, _args, _context, info) {
          rootValues.push([info.fieldName, info.rootValue]);
          return info.rootValue === null ? "null" : typeof info.rootValue;
        },
      },
      items: {
        type: new GraphQLList(Item),
        resolve(_source, _args, _context, info) {
          rootValues.push([info.fieldName, info.rootValue]);
          return [{ value: "a" }, { value: "b" }];
        },
      },
    },
  });
  const schema = new GraphQLSchema({ query: Query });

  const runTest = async (extraArgs: Partial<GrafastExecutionArgs>) => {
    const source = /* GraphQL */ `
      query Q {
        rootValueKind
        items {
          value
        }
      }
    `;

    rootValues = [];
    const result = (await grafast({
      schema,
      source,
      ...extraArgs,
    })) as ExecutionResult;
    expect(result.errors).not.to.exist;
    expect(rootValues).to.eql([
      ["rootValueKind", extraArgs.rootValue],
      ["items", extraArgs.rootValue],
      ["value", extraArgs.rootValue],
      ["value", extraArgs.rootValue],
    ]);
  };

  it("rootValue: unset", () => runTest({}));
  it("rootValue: undefined", () => runTest({ rootValue: undefined }));
  it("rootValue: null", () => runTest({ rootValue: null }));
  it("rootValue: symbol", () => runTest({ rootValue: Symbol("rootValue") }));
});
