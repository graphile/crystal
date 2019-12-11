import pg from "pg";
import { graphql } from "graphql";
import { createPostGraphileSchema } from "postgraphile-core";
import { makeJSONPgSmartTagsPlugin } from "../node8plus";

let pgPool = null;

beforeAll(() => {
  pgPool = new pg.Pool({
    connectionString: process.env.TEST_DATABASE_URL,
  });
});

afterAll(() => {
  if (pgPool) {
    pgPool.end();
    pgPool = null;
  }
});

it("allows adding a custom single field to PG schema", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeJSONPgSmartTagsPlugin({
        version: 1,
        config: {
          class: {
            "graphile_utils.test_smart_tags": {
              tags: {
                omit: "",
                primaryKey: "email",
                foreignKey: "(email) references graphile_utils.users (email)",
              },
              attribute: {
                value: {
                  tags: {
                    name: "val",
                  },
                },
              },
            },
          },
        },
      }),
    ],
  });
  expect(schema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          allUsers {
            nodes {
              email
              testSmartTagByEmail {
                email
                val
              }
            }
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data).toMatchInlineSnapshot(`
      Object {
        "allUsers": Object {
          "nodes": Array [
            Object {
              "email": "alice@example.com",
              "testSmartTagByEmail": null,
            },
            Object {
              "email": "bob@example.com",
              "testSmartTagByEmail": Object {
                "email": "bob@example.com",
                "val": 42,
              },
            },
            Object {
              "email": "caroline@example.com",
              "testSmartTagByEmail": Object {
                "email": "caroline@example.com",
                "val": 9999,
              },
            },
          ],
        },
      }
    `);
  } finally {
    await pgClient.release();
  }
});
