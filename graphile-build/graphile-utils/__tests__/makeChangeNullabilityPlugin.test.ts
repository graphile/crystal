/* eslint-disable graphile-export/export-methods  */
import type { GraphQLType } from "grafast/graphql";
import {
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  isListType,
  isNonNullType,
} from "grafast/graphql";
import {
  buildSchema,
  CommonTypesPlugin,
  MutationPlugin,
  QueryPlugin,
  SubscriptionPlugin,
} from "graphile-build";

import type { NullabilitySpecString } from "../src/index.js";
import { changeNullability, extendSchema, gql } from "../src/index.js";

const makeSchema = (plugins: GraphileConfig.Plugin[]) =>
  buildSchema(
    {
      plugins: [
        QueryPlugin,
        MutationPlugin,
        SubscriptionPlugin,
        CommonTypesPlugin,
        extendSchema((_build) => ({
          typeDefs: gql`
            interface EchoCapable {
              echo(message: [[String]!]): [[String]!]
            }
            extend type Query implements EchoCapable {
              echo(message: [[String]!]): [[String]!]
              echo2(in: MyInput): [[String]!]
              # NOT NULL to NULL
              echo3(in: MyInput): [[String]!]!
            }
            input MyInput {
              message: [[String]!]
            }
          `,
          objects: {
            Query: {
              plans: {
                echo(_, fieldArgs) {
                  return fieldArgs.getRaw("message");
                },
                echo2(_, fieldArgs) {
                  return fieldArgs.getRaw(["in", "message"]);
                },
              },
            },
          },
        })),
        ...plugins,
      ],
    },
    {} as GraphileBuild.BuildInput,
    {},
  );

function getNullability(type: GraphQLType): readonly boolean[] {
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
      changeNullability({
        Query: {
          echo: {
            type: spec,
            args: {
              message: spec,
            },
          },
          echo2: spec,
          echo3: spec,
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
        const arg = field.args.find((a) => a.name === "message")!;
        const argNullability = getNullability(arg.type);
        expect(argNullability).toEqual(expectation);
      }
      {
        const field = Query.getFields().echo2;
        const nullability = getNullability(field.type);
        expect(nullability).toEqual(expectation);
      }
      {
        const field = Query.getFields().echo3;
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
      const arg = field.args.find((a) => a.name === "message")!;
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

describe("errors", () => {
  it("handles outputs helpful messages", async () => {
    let error;
    try {
      makeSchema([
        changeNullability({
          NxType: {
            field1: "",
            field2: "!",
            field3: {},
            field4: {
              type: "",
            },
            field5: {
              type: "!",
            },
            field6: {
              args: {
                arg1: "",
                arg2: "!",
              },
            },
          },
          Query: {
            field1: "",
            field2: "!",
            field3: {},
            field4: {
              type: "",
            },
            field5: {
              type: "!",
            },
            field6: {
              args: {
                arg1: "",
                arg2: "!",
              },
            },
            echo: {
              args: {
                nxArg: "!",
              },
            },
          },
          EchoCapable: {
            nxField1: "",
            nxField2: "!",
            nxField3: {},
            nxField4: {
              type: "",
            },
            nxField5: {
              type: "!",
            },
            nxField6: {
              args: {
                arg1: "",
                arg2: "!",
              },
            },
            echo: {
              args: {
                nxArg: "!",
              },
            },
          },
          MyInput: {
            nxField: "!",
          },
        }),
      ]);
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(error.message).toMatchInlineSnapshot(`
      "The following entries in your changeNullability(...) didn't match anything in your GraphQL schema; please check your spelling:
      - NxType.field1 (type 'NxType' does not exist)
      - NxType.field2 (type 'NxType' does not exist)
      - NxType.field4 (type 'NxType' does not exist)
      - NxType.field5 (type 'NxType' does not exist)
      - NxType.field6(arg1:) (type 'NxType' does not exist)
      - NxType.field6(arg2:) (type 'NxType' does not exist)
      - Query.field1 (type='Query' has no field 'field1')
      - Query.field2 (type='Query' has no field 'field2')
      - Query.field4 (type='Query' has no field 'field4')
      - Query.field5 (type='Query' has no field 'field5')
      - Query.field6(arg1:) (type='Query' has no field 'field6')
      - Query.field6(arg2:) (type='Query' has no field 'field6')
      - Query.echo(nxArg:) (type='Query',field='echo' has no argument named 'nxArg')
      - EchoCapable.nxField1 (type='EchoCapable' has no field 'nxField1')
      - EchoCapable.nxField2 (type='EchoCapable' has no field 'nxField2')
      - EchoCapable.nxField4 (type='EchoCapable' has no field 'nxField4')
      - EchoCapable.nxField5 (type='EchoCapable' has no field 'nxField5')
      - EchoCapable.nxField6(arg1:) (type='EchoCapable' has no field 'nxField6')
      - EchoCapable.nxField6(arg2:) (type='EchoCapable' has no field 'nxField6')
      - EchoCapable.echo(nxArg:) (type='EchoCapable',field='echo' has no argument named 'nxArg')
      - MyInput.nxField (inputType='MyInput' has no field 'nxField')"
    `);
  });
});
