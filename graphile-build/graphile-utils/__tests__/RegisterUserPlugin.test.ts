import { makePgService } from "@dataplan/pg/adaptors/pg";
import { grafast } from "grafast";
import { makeSchema } from "graphile-build";
import type { Pool } from "pg";
import pg from "pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";

import { RegisterUserPlugin } from "./RegisterUserPlugin.js";

let pgPool: Pool | null = null;

beforeAll(async () => {
  pgPool = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });
  await pgPool.query(`\
delete from graphile_utils_2.user_emails;
delete from graphile_utils_2.users;
alter sequence graphile_utils_2.users_id_seq restart with 1;
`);
});

afterAll(() => {
  if (pgPool) {
    pgPool.end();
    pgPool = null;
  }
});

it("supports scalars", async () => {
  const { schema, resolvedPreset } = await makeSchema({
    extends: [PostGraphileAmberPreset, makeV4Preset()],
    plugins: [RegisterUserPlugin],
    pgServices: [
      makePgService({ pool: pgPool!, schemas: ["graphile_utils_2"] }),
    ],
  });
  const source = /* GraphQL */ `
    mutation RegisterUser($username: String!, $email: String!) {
      registerUser(input: { username: $username, email: $email }) {
        result {
          __typename
          ... on UsernameConflict {
            message
          }
          ... on EmailAddressConflict {
            message
          }
          ... on User {
            id
            username
          }
        }
      }
    }
  `;

  // Register user
  {
    const result = await grafast({
      resolvedPreset,
      requestContext: {},
      schema,
      source,
      variableValues: {
        username: "benjie",
        email: "benjie@example.com",
      },
    });
    expect(result).toEqual({
      data: {
        registerUser: {
          result: {
            __typename: "User",
            id: 1,
            username: "benjie",
          },
        },
      },
    });
  }

  // Register again, username conflict
  {
    const result = await grafast({
      resolvedPreset,
      requestContext: {},
      schema,
      source,
      variableValues: {
        username: "benjie",
        email: "benjie@example.com",
      },
    });
    expect(result).toEqual({
      data: {
        registerUser: {
          result: {
            __typename: "UsernameConflict",
            message: `The username 'benjie' is already in use`,
          },
        },
      },
    });
  }

  // Register again with different username, email conflict
  {
    const result = await grafast({
      resolvedPreset,
      requestContext: {},
      schema,
      source,
      variableValues: {
        username: "benjie2",
        email: "benjie@example.com",
      },
    });
    expect(result).toEqual({
      data: {
        registerUser: {
          result: {
            __typename: "EmailAddressConflict",
            message: `The email address 'benjie@example.com' is already in use`,
          },
        },
      },
    });
  }
});
