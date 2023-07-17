/* eslint-disable graphile-export/export-methods  */
import {
  buildSchema,
  CommonTypesPlugin,
  MutationPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";
import type { GraphQLType } from "grafast/graphql";
import {
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isListType,
  isNonNullType,
} from "grafast/graphql";

import type { NullabilitySpecString } from "../src/index.js";
import {
  gql,
  makeChangeNullabilityPlugin,
  makeExtendSchemaPlugin,
} from "../src/index.js";

const makeSchema = (plugins: GraphileConfig.Plugin[]) =>
  buildSchema(
    {
      plugins: [
        QueryPlugin,
        MutationPlugin,
        SubscriptionPlugin,
        CommonTypesPlugin,
        makeExtendSchemaPlugin((_build) => ({
          typeDefs: gql`
            interface EchoCapable {
              echo(message: [[String]!]): [[String]!]
            }
            extend type Query implements EchoCapable {
              echo(message: [[String]!]): [[String]!]
              echo2(in: MyInput): [[String]!]
            }
            input MyInput {
              message: [[String]!]
            }
          `,
          plans: {
            Query: {
              echo(_, args) {
                return args.get("message");
              },
              echo2(_, args) {
                return args.get(["in", "message"]);
              },
            },
          },
        })),
        ...plugins,
      ],
    },
    {},
    {},
  );

function getNullability(type: GraphQLType) {
  if (isNonNullType(type)) {
    const nullableType = type.ofType;
    if (isListType(nullableType)) {
      return [...getNullability(nullableType.ofType), false];
    } else {
      return [false];
    }
  } else {
    const nullableType = type;
    if (isListType(nullableType)) {
      return [...getNullability(nullableType.ofType), true];
    } else {
      return [true];
    }
  }
}

describe("object, interface and input", () => {
  const wrappers: Array<[NullabilitySpecString, boolean[]]> = [
    ["", [true, false, true]],
    ["!", [true, false, false]],
    ["[]", [true, true, true]],
    ["[]!", [true, true, false]],
    ["[!]!", [true, false, false]],
    ["[[]!]!", [true, false, false]],
    ["[[!]!]!", [false, false, false]],
  ];
  it.each(wrappers)("handles '%s' correctly", async (spec, expectation) => {
    const schema = makeSchema([
      makeChangeNullabilityPlugin({
        Query: {
          echo: {
            type: spec,
            args: {
              message: spec,
            },
          },
          echo2: spec,
        },
        EchoCapable: {
          echo: {
            type: spec,
            args: {
              message: spec,
            },
          },
        },
        MyInput: {
          message: spec,
        },
      }),
    ]);

    {
      const Query = schema.getType("Query") as GraphQLObjectType;
      expect(Query).toBeInstanceOf(GraphQLObjectType);
      {
        const field = Query.getFields().echo;
        const nullability = getNullability(field.type);
        expect(nullability).toEqual(expectation);
        const arg = field.args.find((a) => a.name === "message");
        const argNullability = getNullability(arg.type);
        expect(argNullability).toEqual(expectation);
      }
      {
        const field = Query.getFields().echo2;
        const nullability = getNullability(field.type);
        expect(nullability).toEqual(expectation);
      }
    }

    {
      const EchoCapable = schema.getType("EchoCapable") as GraphQLInterfaceType;
      expect(EchoCapable).toBeInstanceOf(GraphQLInterfaceType);
      const field = EchoCapable.getFields().echo;
      const nullability = getNullability(field.type);
      expect(nullability).toEqual(expectation);
      const arg = field.args.find((a) => a.name === "message");
      const argNullability = getNullability(arg.type);
      expect(argNullability).toEqual(expectation);
    }

    {
      const MyInput = schema.getType("MyInput") as GraphQLInputObjectType;
      expect(MyInput).toBeInstanceOf(GraphQLInputObjectType);
      const field = MyInput.getFields().message;
      const nullability = getNullability(field.type);
      expect(nullability).toEqual(expectation);
    }
  });
});
