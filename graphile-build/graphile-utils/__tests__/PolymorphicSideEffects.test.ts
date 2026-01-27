// See https://github.com/benjie/ouch-my-finger/pull/21
import { makePgService } from "@dataplan/pg/adaptors/pg";
import { grafast } from "grafast";
import { makeSchema } from "graphile-build";
import type { Pool } from "pg";
import pg from "pg";
import { sideEffect } from "postgraphile/grafast";
import { GraphQLError } from "postgraphile/graphql";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import {
  createTestDatabase,
  dropTestDatabase,
} from "../../../grafast/dataplan-pg/__tests__/sharedHelpers.ts";
import { extendSchema, gql } from "../src/index.ts";

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
  }
  await dropTestDatabase(databaseName);
});

/**
 * WARNING: Side effects should NOT be used outside of mutation fields.
 *
 * According to the GraphQL spec: "the resolution of fields other than
 * top-level mutation fields must always be side effect-free and idempotent"
 * (https://spec.graphql.org/draft/#sel-GANRNDABiEBuHxyV)
 *
 * This plugin is just a minimal effort way to check that the most common
 * side effects in polymorphic positions don't cause the query to break. It
 * is NOT an indication that we support this bad pattern, and we reserve
 * the right to remove side effect support from non-mutation fields in a
 * future minor release.
 */
const AchinthaSideEffectsPlugin = extendSchema((build) => {
  const {
    input: {
      pgRegistry: {
        pgResources: { animal, shop, owner },
      },
    },
    grafast: { connection },
  } = build;

  return {
    typeDefs: gql`
      extend type Shop {
        animals: AnimalsConnection
      }
      extend type CatAnimal {
        owners: OwnersConnection
      }
      extend type DogAnimal {
        owners: OwnersConnection
      }
      extend type Owner {
        hasClinic: Boolean
      }
    `,
    objects: {
      Shop: {
        plans: {
          animals($shop, { $first }) {
            sideEffect($first, (arg) => {
              if (arg && arg > 10) {
                throw new GraphQLError("wrong input");
              }
            });
            const $animals = animal.find({
              shop_id: $shop.get("id"),
            });

            return connection($animals);
          },
        },
      },
      CatAnimal: {
        plans: {
          owners($animal, { $first }) {
            sideEffect($first, (arg) => {
              if (arg && arg > 10) {
                throw new GraphQLError("wrong input");
              }
            });
            const $owners = owner.find({
              animal_id: $animal.get("id"),
            });

            return connection($owners);
          },
        },
      },
      DogAnimal: {
        plans: {
          owners($animal, { $first }) {
            sideEffect($first, (arg) => {
              if (arg && arg > 10) {
                throw new GraphQLError("wrong input");
              }
            });
            const $owners = owner.find({
              animal_id: $animal.get("id"),
            });

            return connection($owners);
          },
        },
      },
      Owner: {
        plans: {
          hasClinic($owner) {
            const $shop = shop.get({
              id: $owner.get("owner_id"),
            });

            return $shop.get("has_clinic");
          },
        },
      },
    },
  };
}, "AchinthaSideEffectsPlugin");

it("handles basic side effects in polymorphic positions", async () => {
  const { schema, resolvedPreset } = await makeSchema({
    extends: [PostGraphileAmberPreset, makeV4Preset()],
    plugins: [AchinthaSideEffectsPlugin],
    pgServices: [
      makePgService({ pool: pgPool!, schemas: ["achintha_side_effects"] }),
    ],
  });
  const source = /* GraphQL */ `
    query MyQuery {
      shopById(id: 1) {
        name
        type
        animals {
          totalCount
          nodes {
            __typename
            ... on CatAnimal {
              id
              name
              owners {
                nodes {
                  ownerId
                  ownerType
                  hasClinic
                }
                totalCount
              }
            }
            ... on DogAnimal {
              id
              name
              owners {
                nodes {
                  ownerId
                  ownerType
                  hasClinic
                }
                totalCount
              }
            }
          }
        }
      }
    }
  `;

  {
    const result = await grafast({
      resolvedPreset,
      requestContext: {},
      schema,
      source,
      variableValues: {},
    });
    expect(result).not.toHaveProperty("errors");
    expect(result).toEqual({
      data: {
        shopById: {
          name: "Super Axinom",
          type: "super",
          animals: {
            totalCount: 1,
            nodes: [
              {
                __typename: "DogAnimal",
                id: 1,
                name: "Niki",
                owners: {
                  nodes: [
                    {
                      ownerId: 5,
                      ownerType: "person",
                      hasClinic: null,
                    },
                  ],
                  totalCount: 1,
                },
              },
            ],
          },
        },
      },
    });
  }
});
