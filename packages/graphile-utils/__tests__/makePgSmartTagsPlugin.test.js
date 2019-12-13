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

const testQuery = /* GraphQL */ `
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
`;

async function withContext(callback) {
  const pgClient = await pgPool.connect();
  try {
    return await callback({ pgClient });
  } finally {
    await pgClient.release();
  }
}

/*
 * The JSON format is quite flexible, there's often a few different ways of
 * expressing the same thing; these non-exhaustive tests check that the
 * different variants all work as expected.
 */
test.each([
  [
    "fully qualified table name, embedded column",
    {
      version: 1,
      config: {
        class: {
          // Fully qualified table name
          "graphile_utils.test_smart_tags": {
            tags: {
              omit: "",
              primaryKey: "email",
              foreignKey: "(email) references graphile_utils.users (email)",
            },
            attribute: {
              // Column name embedded inside table
              value: {
                tags: {
                  name: "val",
                },
              },
            },
          },
        },
      },
    },
  ],
  [
    "simple table name, embedded column",
    {
      version: 1,
      config: {
        class: {
          // Just table name (no schema)
          test_smart_tags: {
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
    },
  ],
  [
    "simple table name, table.column",
    {
      version: 1,
      config: {
        class: {
          test_smart_tags: {
            tags: {
              omit: "",
              primaryKey: "email",
              foreignKey: "(email) references graphile_utils.users (email)",
            },
          },
        },
        attribute: {
          // Just table name and column name
          "test_smart_tags.value": {
            tags: {
              name: "val",
            },
          },
        },
      },
    },
  ],
  [
    "simple table name, fully qualified column",
    {
      version: 1,
      config: {
        class: {
          test_smart_tags: {
            tags: {
              omit: "",
              primaryKey: "email",
              foreignKey: "(email) references graphile_utils.users (email)",
            },
          },
        },
        attribute: {
          // Fully qualified column name
          "graphile_utils.test_smart_tags.value": {
            tags: {
              name: "val",
            },
          },
        },
      },
    },
  ],
  [
    "simple table name, simple column name",
    {
      version: 1,
      config: {
        class: {
          test_smart_tags: {
            tags: {
              omit: "",
              primaryKey: "email",
              foreignKey: "(email) references graphile_utils.users (email)",
            },
          },
        },
        attribute: {
          // This matches _all_ columns called 'value' (in all tables)
          value: {
            tags: {
              name: "val",
            },
          },
        },
      },
    },
  ],
])("equivalent JSON config (%s)", async (title, json) => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [makeJSONPgSmartTagsPlugin(json)],
  });
  await withContext(async context => {
    const { data, errors } = await graphql(
      schema,
      testQuery,
      null,
      context,
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data).toEqual({
      allUsers: {
        nodes: [
          {
            email: "alice@example.com",
            testSmartTagByEmail: null,
          },
          {
            email: "bob@example.com",
            testSmartTagByEmail: {
              email: "bob@example.com",
              val: 42,
            },
          },
          {
            email: "caroline@example.com",
            testSmartTagByEmail: {
              email: "caroline@example.com",
              val: 9999,
            },
          },
        ],
      },
    });
  });
});
