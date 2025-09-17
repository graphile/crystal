import { pgSelect, TYPES } from "@dataplan/pg";
import { makePgService } from "@dataplan/pg/adaptors/pg";
import { connection, constant, grafast, grafastGraphql, lambda } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import { GraphQLScalarType, printSchema } from "grafast/graphql";
import { buildSchema, QueryPlugin } from "graphile-build";
import pg, { type Pool } from "pg";
import { makeSchema } from "postgraphile";
import PostGraphileAmberPreset from "postgraphile/presets/amber";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.js";
import { EXPORTABLE, extendSchema, gql } from "../src/index.js";

let pgPool: Pool | null = null;
let connectionString = "";
let databaseName = "";

beforeAll(async () => {
  ({ connectionString, databaseName } = await createTestDatabase());
  pgPool = new pg.Pool({
    connectionString,
  });
  pgPool.on("connect", (client) => {
    client.on("error", () => {});
    client.query(`set TimeZone to '+04:00'`).catch(() => {});
  });
  pgPool.on("error", (e) => {
    console.error("Pool error:", e);
  });
});

afterAll(async () => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
    await dropTestDatabase(databaseName);
  }
});

const ExtendPlugin = extendSchema({
  typeDefs: gql`
    scalar Scalar1
    scalar Scalar2
    extend type Query {
      scalar1: Scalar1
      scalar2: Scalar2
    }
  `,
  objects: {
    Query: {
      plans: {
        scalar1() {
          return constant("hello world");
        },
        scalar2() {
          return constant("hello world");
        },
      },
    },
  },
  scalars: {
    Scalar1: new GraphQLScalarType({
      name: "SomethingElse",
      serialize: EXPORTABLE(
        () =>
          function serialize() {
            return 1;
          },
        [],
      ),
      parseLiteral: EXPORTABLE(
        () =>
          function parseLiteral() {
            return 1;
          },
        [],
      ),
      parseValue: EXPORTABLE(
        () =>
          function parseValue() {
            return 1;
          },
        [],
      ),
    }),
    Scalar2: {
      serialize: EXPORTABLE(
        () =>
          function serialize() {
            return 2;
          },
        [],
      ),
      parseLiteral: EXPORTABLE(
        () =>
          function parseLiteral() {
            return 2;
          },
        [],
      ),
      parseValue: EXPORTABLE(
        () =>
          function parseValue() {
            return 2;
          },
        [],
      ),
    },
  },
});

it("supports scalars", async () => {
  const schema = buildSchema(
    {
      plugins: [QueryPlugin, ExtendPlugin],
    },
    {} as any,
  );
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

it("infers scope", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      extendSchema({
        typeDefs: gql`
          extend type User {
            favouritePets: PetConnection
          }
        `,
      }),
    ],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema } = await makeSchema(preset);
  expect(printSchema(schema)).toMatchSnapshot();
  const t = schema.getType("User") as GraphQLObjectType;
  const f = t.getFields().favouritePets;
  expect(f.args.length).toBeGreaterThan(5);
});

it("enables overriding scope", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      extendSchema({
        typeDefs: gql`
          extend type User {
            favouritePets: PetConnection
          }
        `,
        objects: {
          User: {
            plans: {
              favouritePets: {
                scope: {
                  pgTypeResource: undefined,
                  isPgFieldConnection: undefined,
                },
              },
            },
          },
        },
      }),
    ],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema } = await makeSchema(preset);
  expect(printSchema(schema)).toMatchSnapshot();
  const t = schema.getType("User") as GraphQLObjectType;
  const f = t.getFields().favouritePets;
  expect(f.args.length).toBe(0);
});

it("supports unary steps in loadOne", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      extendSchema((build) => {
        const { loadOne } = build.grafast;
        const { main } = build.input.pgRegistry.pgExecutors;
        return {
          typeDefs: gql`
            extend type User {
              uppercaseName: String
            }
          `,
          objects: {
            User: {
              plans: {
                uppercaseName($user) {
                  const $name = $user.get("name");
                  const $executorContext = main.context();
                  return loadOne($name, {
                    load: async (names, { shared: executorContext }) => {
                      const { withPgClient, pgSettings } = executorContext;
                      const { rows } = await withPgClient(
                        pgSettings,
                        (client) =>
                          client.query<{ i: string; upper_name: string }>({
                            text: "select (i - 1)::text as i, upper(name) as upper_name from json_array_elements_text($1::json) with ordinality as el(name, i)",
                            values: [JSON.stringify(names)],
                          }),
                      );
                      return names.map(
                        (_, i) =>
                          rows.find((r) => r.i === String(i))?.upper_name,
                      );
                    },

                    shared: $executorContext,
                  });
                },
              },
            },
          },
        };
      }),
    ],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema, resolvedPreset } = await makeSchema(preset);
  const result = await grafast({
    schema,
    resolvedPreset,
    requestContext: {},
    source: /* GraphQL */ `
      {
        allUsers(first: 3) {
          nodes {
            name
            uppercaseName
          }
        }
      }
    `,
  });
  expect(result).toEqual({
    data: {
      allUsers: {
        nodes: [
          {
            name: "Alice",
            uppercaseName: "ALICE",
          },
          {
            name: "Bob",
            uppercaseName: "BOB",
          },
          {
            name: "Caroline",
            uppercaseName: "CAROLINE",
          },
        ],
      },
    },
  });
});

it("supports arbitrary sql queries, does not dedup unrelated queries", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      extendSchema((build) => {
        const { users } = build.input.pgRegistry.pgResources;
        const { sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              one: UserConnection
              two: UserConnection
            }
          `,
          objects: {
            User: {
              plans: {
                one($user) {
                  const $one = pgSelect({
                    identifiers: [],
                    name: "one",
                    resource: users,
                    args: [
                      {
                        step: $user.get("id"),
                        pgCodec: TYPES.int,
                        name: "user_id",
                      },
                    ],
                    from: (userIdArg) => {
                      const usersTblId = sql.identifier(Symbol());
                      return sql`(select * from ${
                        users!.codec.sqlType
                      } as ${usersTblId} where id != ${
                        userIdArg.placeholder
                      } order by ${usersTblId}.id limit 1)`;
                    },
                  });
                  $one.setOrderIsUnique();
                  return connection($one);
                },
                two($user) {
                  const $two = pgSelect({
                    identifiers: [],
                    name: "two",
                    resource: users,
                    args: [
                      {
                        step: $user.get("id"),
                        pgCodec: TYPES.int,
                        name: "user_id",
                      },
                    ],
                    from: (userIdArg) => {
                      const usersTblId = sql.identifier(Symbol());
                      return sql`(select * from ${
                        users!.codec.sqlType
                      } as ${usersTblId} where id != ${
                        userIdArg.placeholder
                      } order by ${usersTblId}.id limit 1 offset 1)`;
                    },
                  });
                  $two.setOrderIsUnique();
                  return connection($two);
                },
              },
            },
          },
        };
      }),
    ],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  const { schema, resolvedPreset } = await makeSchema(preset);
  const result = await grafast({
    schema,
    resolvedPreset,
    requestContext: {},
    source: /* GraphQL */ `
      {
        allUsers(first: 1) {
          nodes {
            name
            one(orderBy: NATURAL) {
              nodes {
                name
              }
            }
            two(orderBy: NATURAL) {
              nodes {
                name
              }
            }
          }
        }
      }
    `,
  });
  expect(result).toEqual({
    data: {
      allUsers: {
        nodes: [
          {
            name: "Alice",
            one: {
              nodes: [
                {
                  name: "Bob",
                },
              ],
            },
            two: {
              nodes: [
                {
                  name: "Caroline",
                },
              ],
            },
          },
        ],
      },
    },
  });
});

it("scope", async () => {
  const scopes: Record<string, any> = Object.create(null);
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      {
        name: "TestPlugin",
        schema: {
          hooks: {
            GraphQLObjectType(config, build, context) {
              if (config.name === "Object") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
            GraphQLObjectType_fields_field(config, build, context) {
              if (context.Self.name === "Object") {
                scopes[`${context.Self.name}.${context.scope.fieldName}`] =
                  context.scope;
              }
              return config;
            },
            GraphQLInterfaceType(config, build, context) {
              if (config.name === "Interface") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
            GraphQLInterfaceType_fields_field(config, build, context) {
              if (context.Self.name === "Interface") {
                scopes[`${context.Self.name}.${context.scope.fieldName}`] =
                  context.scope;
              }
              return config;
            },
            GraphQLUnionType(config, build, context) {
              if (config.name === "Union") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
            GraphQLInputObjectType(config, build, context) {
              if (config.name === "InputObject") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
            GraphQLInputObjectType_fields_field(config, build, context) {
              if (context.Self.name === "InputObject") {
                scopes[`${context.Self.name}.${context.scope.fieldName}`] =
                  context.scope;
              }
              return config;
            },
            GraphQLEnumType(config, build, context) {
              if (config.name === "Enum") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
            GraphQLEnumType_values_value(config, build, context) {
              if (context.Self.name === "Enum") {
                scopes[`${context.Self.name}.${context.scope.valueName}`] =
                  context.scope;
              }
              return config;
            },
            GraphQLScalarType(config, build, context) {
              if (config.name === "Scalar") {
                scopes[config.name] = context.scope;
              }
              return config;
            },
          },
        },
      },
      extendSchema(() => {
        return {
          typeDefs: gql`
            extend type Query {
              object: Object
              interface: Interface
              union: Union
              inputObject(inputObject: InputObject): Int
              enum: Enum
              scalar: Scalar
            }
            type Object {
              field: Int
            }
            interface Interface {
              field: Int
            }
            union Union = Object
            input InputObject {
              field: Int
            }
            enum Enum {
              VALUE
            }
            scalar Scalar
          `,
          objects: {
            Object: {
              scope: {
                test1: 1,
              } as any,
              plans: {
                field: {
                  scope: {
                    test2: 2,
                  } as any,
                },
              },
            },
          },
          interfaces: {
            Interface: {
              scope: {
                test3: 3,
              } as any,
              fields: {
                field: {
                  scope: {
                    test4: 4,
                  } as any,
                },
              },
            },
          },
          unions: {
            Union: {
              scope: {
                test5: 5,
              } as any,
            },
          },
          inputObjects: {
            InputObject: {
              scope: {
                test6: 6,
              } as any,
              plans: {
                field: {
                  scope: {
                    test7: 7,
                  } as any,
                },
              },
            },
          },
          enums: {
            Enum: {
              scope: {
                test8: 8,
              } as any,
              values: {
                VALUE: {
                  scope: {
                    test9: 9,
                  } as any,
                },
              },
            },
          },
          scalars: {
            Scalar: {
              scope: {
                test10: 10,
              } as any,
            },
          },
        };
      }),
    ],
    pgServices: [
      makePgService({
        pool: pgPool!,
        schemas: ["graphile_utils"],
      }),
    ],
  };
  await makeSchema(preset);
  expect(scopes).toMatchObject({
    Object: {
      test1: 1,
    },
    "Object.field": {
      test1: 1,
      test2: 2,
    },
    Interface: {
      test3: 3,
    },
    "Interface.field": {
      test3: 3,
      test4: 4,
    },
    Union: {
      test5: 5,
    },
    InputObject: {
      test6: 6,
    },
    "InputObject.field": {
      test6: 6,
      test7: 7,
    },
    Enum: {
      test8: 8,
    },

    // TODO: can't support this until the minimum version of GraphQL.js
    // includes https://github.com/graphql/graphql-js/pull/4122
    //
    // "Enum.VALUE": {
    //   test8: 8,
    //   test9: 9,
    // },

    Scalar: {
      test10: 10,
    },
  });
});

it("exposes types even if they're not directly referenced", async () => {
  const preset: GraphileConfig.Preset = {
    extends: [PostGraphileAmberPreset],
    plugins: [
      extendSchema((_build) => ({
        typeDefs: gql`
          interface Named {
            name: String!
          }
          type A implements Named {
            name: String!
            a: Int!
          }
          type B implements Named {
            name(suffix: String): String!
            b: Int!
          }
          type C {
            c: Int!
          }
          # A child type that has no explicit references
          type D implements Named {
            name: String!
            d: Int!
          }
          union ABC = A | B | C
          extend type Query {
            abc: [ABC!]
            named: [Named!]
          }
          extend interface Named {
            nameLanguage: String
          }
          extend type A {
            nameLanguage: String
          }
          extend type B {
            nameLanguage: String
          }
          extend type D {
            nameLanguage: String
          }
        `,
        objects: {
          Query: {
            plans: {
              abc: () =>
                constant([
                  { name: "A-one", a: 1, nameLanguage: "en" },
                  { name: "B-two", b: 2, nameLanguage: "en" },
                  { c: 3 },
                ]),
              named: () =>
                constant([
                  { name: "A-one", a: 1, nameLanguage: "en" },
                  { name: "B-two", b: 2, nameLanguage: "en" },
                  { name: "D-three", d: 3, nameLanguage: "en" },
                ]),
            },
          },
        },
        unions: {
          ABC: {
            planType: EXPORTABLE(
              (lambda) =>
                function planType($specifier) {
                  const $__typename = lambda($specifier, (obj: any) => {
                    if (obj.a != null) return "A";
                    if (obj.b != null) return "B";
                    if (obj.c != null) return "C";
                    return null;
                  });
                  return { $__typename };
                },
              [lambda],
            ),
          },
        },
        interfaces: {
          Named: {
            planType: EXPORTABLE(
              (lambda) =>
                function planType($specifier) {
                  const $__typename = lambda($specifier, (obj: any) => {
                    if (obj.a != null) return "A";
                    if (obj.b != null) return "B";
                    if (obj.d != null) return "D";
                    return null;
                  });
                  return { $__typename };
                },
              [lambda],
            ),
          },
        },
      })),
    ],
  };
  const { schema, resolvedPreset } = await makeSchema(preset);
  expect(schema).toMatchSnapshot();
  const result = await grafastGraphql({
    resolvedPreset,
    requestContext: {},
    schema,
    source: `
      query {
        abc {
          __typename
          ... on A {
            name
            nameLanguage
            a
          }
          ... on B {
            name
            nameLanguage
            b
          }
          ... on C {
            c
          }
        }
        named {
          __typename
          name
          nameLanguage
          ... on A {
            a
          }
          ... on B {
            b
          }
          ... on D {
            d
          }
        }
      }
    `,
  });
  if (!("data" in result)) throw new Error(`Invalid result type`);
  const { data, errors } = result;
  expect(errors).toBeFalsy();
  expect(data).toMatchSnapshot();
});
