/* eslint-disable graphile-export/export-methods  */
import {
  buildSchema,
  CommonTypesPlugin,
  MutationPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";
import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  isListType,
  isNonNullType,
} from "graphql";

import { gql, makeChangeNullabilityPlugin, makeExtendSchemaPlugin } from "../";

const makeSchema = (plugins) =>
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

function getNullability(type) {
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

describe("object and interface", () => {
  const wrappers = [
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
        },
        EchoCapable: {
          echo: {
            type: spec,
            args: {
              message: spec,
            },
          },
        },
      }),
    ]);

    {
      /** @type {GraphQLObjectType} */
      const Query = schema.getType("Query");
      expect(Query).toBeInstanceOf(GraphQLObjectType);
      const field = Query.getFields().echo;
      const nullability = getNullability(field.type);
      expect(nullability).toEqual(expectation);
    }

    {
      /** @type {GraphQLInterfaceType} */
      const EchoCapable = schema.getType("EchoCapable");
      expect(EchoCapable).toBeInstanceOf(GraphQLInterfaceType);
      const field = EchoCapable.getFields().echo;
      const nullability = getNullability(field.type);
      expect(nullability).toEqual(expectation);
    }
  });
});
