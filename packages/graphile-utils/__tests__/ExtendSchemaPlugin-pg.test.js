import pg from "pg";
import { graphql, printSchema } from "graphql";
import { createPostGraphileSchema } from "postgraphile-core";
import { makeExtendSchemaPlugin, gql } from "../";

const clean = data => {
  if (Array.isArray(data)) {
    return data.map(clean);
  } else if (data && typeof data === "object") {
    return Object.keys(data).reduce((memo, key) => {
      const value = data[key];
      if (key === "id" && typeof value === "number") {
        memo[key] = "[id]";
      } else if (key === "nodeId" && typeof value === "string") {
        memo[key] = "[nodeId]";
      } else {
        memo[key] = clean(value);
      }
      return memo;
    }, {});
  } else {
    return data;
  }
};

function mockSendEmail() {
  return new Promise(resolve => setTimeout(resolve, 1));
}
let pgPool;

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
  const schema = await createPostGraphileSchema(pgPool, ["a"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type Query {
              randomUser: User
            }
          `,
          resolvers: {
            Query: {
              async randomUser(_query, args, context, resolveInfo) {
                const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
                  sql.fragment`a.users`,
                  (tableAlias, sqlBuilder) => {
                    sqlBuilder.orderBy(sql.fragment`random()`);
                    sqlBuilder.limit(1);
                  }
                );
                return rows[0];
              },
            },
          },
        };
      }),
    ],
  });
  const printedSchema = printSchema(schema);
  expect(printedSchema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          randomUser {
            nodeId
            id
            name
            email
            bio
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.randomUser).toBeTruthy();
    expect(data.randomUser.id).toBeTruthy();
    expect(data.randomUser.nodeId).toBeTruthy();
    expect(data.randomUser.name).toBeTruthy();
    expect(data.randomUser.email).toBeTruthy();
  } finally {
    pgClient.release();
  }
});

it("allows adding a custom field returning a list to PG schema", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["a"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type Query {
              randomUsers: [User!]
            }
          `,
          resolvers: {
            Query: {
              async randomUsers(_query, args, context, resolveInfo) {
                const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
                  sql.fragment`a.users`,
                  (tableAlias, sqlBuilder) => {
                    sqlBuilder.orderBy(sql.fragment`random()`);
                    sqlBuilder.limit(3);
                  }
                );
                return rows;
              },
            },
          },
        };
      }),
    ],
  });
  const printedSchema = printSchema(schema);
  expect(printedSchema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          randomUsers {
            nodeId
            id
            name
            email
            bio
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.randomUsers).toBeTruthy();
    expect(data.randomUsers.length).toEqual(3);
    expect(data.randomUsers[2].id).toBeTruthy();
    expect(data.randomUsers[2].nodeId).toBeTruthy();
    expect(data.randomUsers[2].name).toBeTruthy();
    expect(data.randomUsers[2].email).toBeTruthy();
  } finally {
    pgClient.release();
  }
});

it("allows adding a simple mutation field to PG schema", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["a"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            input RegisterUserInput {
              name: String!
              email: String!
              bio: String
            }

            type RegisterUserPayload {
              user: User @pgField
            }

            extend type Mutation {
              registerUser(input: RegisterUserInput!): RegisterUserPayload
            }
          `,
          resolvers: {
            Mutation: {
              async registerUser(_query, args, context, resolveInfo) {
                const { pgClient } = context;
                await pgClient.query("begin");
                try {
                  const {
                    rows: [user],
                  } = await pgClient.query(
                    `insert into a.users(name, email, bio) values ($1, $2, $3) returning *`,
                    [args.input.name, args.input.email, args.input.bio]
                  );
                  const [
                    row,
                  ] = await resolveInfo.graphile.selectGraphQLResultFromTable(
                    sql.fragment`a.users`,
                    (tableAlias, sqlBuilder) => {
                      sqlBuilder.where(
                        sql.fragment`${tableAlias}.id = ${sql.value(user.id)}`
                      );
                    }
                  );
                  await mockSendEmail(
                    args.input.email,
                    "Welcome to my site",
                    `You're user ${user.id} - thanks for being awesome`
                  );

                  await pgClient.query("commit");
                  return {
                    data: row,
                  };
                } catch (e) {
                  await pgClient.query("rollback");
                  throw e;
                }
              },
            },
          },
        };
      }),
    ],
  });
  const printedSchema = printSchema(schema);
  expect(printedSchema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        mutation {
          user1: registerUser(
            input: { name: "Test User 1", email: "testuser1@example.com" }
          ) {
            user {
              nodeId
              id
              name
              email
              bio
            }
          }
          user2: registerUser(
            input: {
              name: "Test User 2"
              email: "testuser2@example.com"
              bio: "I have a bio!"
            }
          ) {
            user {
              nodeId
              id
              name
              email
              bio
            }
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data.user1).toBeTruthy();
    expect(data.user1.user.nodeId).toBeTruthy();
    expect(data.user1.user.id).toBeTruthy();
    expect(data.user2.user.nodeId).toBeTruthy();
    expect(data.user2.user.id).toBeTruthy();
    expect(data.user1.user.id).not.toEqual(data.user2.user.id);
    expect(clean(data)).toMatchSnapshot();
  } finally {
    pgClient.release();
  }
});

it("allows adding a field to an existing table, and requesting necessary data along with it", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["a"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(() => ({
        typeDefs: gql`
          extend type User {
            customField: String
              @requires(columns: ["id", "name", "slightly_more_complex_column"])
          }
        `,
        resolvers: {
          User: {
            customField: user =>
              `User ${user.id} fetched (name: ${user.name}) ${JSON.stringify(
                user.renamedComplexColumn
              )}`,
          },
        },
      })),
    ],
  });
  const printedSchema = printSchema(schema);
  expect(printedSchema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          userById(id: 1) {
            customField
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.userById).toBeTruthy();
    expect(data.userById.customField).toEqual(
      `User 1 fetched (name: Alice) [{"number_int":1,"string_text":"hi"},{"number_int":2,"string_text":"bye"}]`
    );
  } finally {
    pgClient.release();
  }
});
