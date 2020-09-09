import pg from "pg";
import { graphql } from "graphql";
import { createPostGraphileSchema } from "postgraphile-core";
import { makeExtendSchemaPlugin, gql, embed } from "../";

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
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
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
                  sql.fragment`graphile_utils.users`,
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
  expect(schema).toMatchSnapshot();
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
    await pgClient.release();
  }
});

it("allows adding a custom field returning a list to PG schema", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
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
                  sql.fragment`graphile_utils.users`,
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
  expect(schema).toMatchSnapshot();
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
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
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
                await pgClient.query("SAVEPOINT graphql_mutation");
                try {
                  const {
                    rows: [user],
                  } = await pgClient.query(
                    `insert into graphile_utils.users(name, email, bio) values ($1, $2, $3) returning *`,
                    [args.input.name, args.input.email, args.input.bio]
                  );
                  const [
                    row,
                  ] = await resolveInfo.graphile.selectGraphQLResultFromTable(
                    sql.fragment`graphile_utils.users`,
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

                  await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
                  return {
                    data: row,
                  };
                } catch (e) {
                  await pgClient.query(
                    "ROLLBACK TO SAVEPOINT graphql_mutation"
                  );
                  throw e;
                }
              },
            },
          },
        };
      }),
    ],
  });
  expect(schema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  await pgClient.query("begin");
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
    await pgClient.query("rollback");
    await pgClient.release();
  }
});

it("allows adding a field to an existing table, and requesting necessary data along with it", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
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
            customField: user => {
              return `User ${user.id} fetched (name: ${
                user.name
              }) ${JSON.stringify(user.renamedComplexColumn)}`;
            },
          },
        },
      })),
    ],
  });
  expect(schema).toMatchSnapshot();
  const pgClient = await pgPool.connect();
  try {
    const { data, errors } = await graphql(
      schema,
      `
        query {
          userById(id: 1) {
            id
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
    await pgClient.release();
  }
});

it("allows adding a custom connection", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        const table = build.pgIntrospectionResultsByKind.class.find(
          tbl => tbl.namespaceName === "graphile_utils" && tbl.name === "users"
        );
        return {
          typeDefs: gql`
            extend type Query {
              myCustomConnection: UsersConnection
                @scope(isPgFieldConnection: true, pgFieldIntrospection: ${embed(
                  table
                )})
            }
          `,
          resolvers: {
            Query: {
              myCustomConnection(_parent, args, context, resolveInfo) {
                return resolveInfo.graphile.selectGraphQLResultFromTable(
                  sql.fragment`graphile_utils.users`
                );
              },
            },
          },
        };
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
          myCustomConnection(first: 2, offset: 1) {
            edges {
              cursor
              node {
                bio
              }
            }
            nodes {
              name
            }
            totalCount
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
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
    expect(data.myCustomConnection).toBeTruthy();
    expect(data.myCustomConnection.edges.length).toEqual(2);
    expect(data.myCustomConnection.nodes.length).toEqual(2);
    expect(data.myCustomConnection.edges[0].cursor).toBeTruthy();
    expect(data.myCustomConnection.edges[0].node).toBeTruthy();
    expect(data.myCustomConnection.edges[0].node.bio).not.toBe(undefined);
    expect(data.myCustomConnection.nodes[0]).toBeTruthy();
    expect(data.myCustomConnection.nodes[0].name).toBeTruthy();
    expect(data.myCustomConnection.totalCount).toEqual(3);
    expect(data.myCustomConnection.pageInfo).toBeTruthy();
    expect(data.myCustomConnection.pageInfo.hasNextPage).toBe(false);
    expect(data.myCustomConnection.pageInfo.hasPreviousPage).toBe(true);
    expect(data.myCustomConnection.pageInfo.startCursor).toBeTruthy();
    expect(data.myCustomConnection.pageInfo.endCursor).toBeTruthy();
  } finally {
    pgClient.release();
  }
});

it("allows adding a custom connection without requiring directives", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type Query {
              myCustomConnection: UsersConnection
            }
          `,
          resolvers: {
            Query: {
              myCustomConnection(_parent, args, context, resolveInfo) {
                return resolveInfo.graphile.selectGraphQLResultFromTable(
                  sql.fragment`graphile_utils.users`
                );
              },
            },
          },
        };
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
          myCustomConnection(first: 2, offset: 1) {
            edges {
              cursor
              node {
                bio
              }
            }
            nodes {
              name
            }
            totalCount
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
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
    expect(data.myCustomConnection).toBeTruthy();
    expect(data.myCustomConnection.edges.length).toEqual(2);
    expect(data.myCustomConnection.nodes.length).toEqual(2);
    expect(data.myCustomConnection.edges[0].cursor).toBeTruthy();
    expect(data.myCustomConnection.edges[0].node).toBeTruthy();
    expect(data.myCustomConnection.edges[0].node.bio).not.toBe(undefined);
    expect(data.myCustomConnection.nodes[0]).toBeTruthy();
    expect(data.myCustomConnection.nodes[0].name).toBeTruthy();
    expect(data.myCustomConnection.totalCount).toEqual(3);
    expect(data.myCustomConnection.pageInfo).toBeTruthy();
    expect(data.myCustomConnection.pageInfo.hasNextPage).toBe(false);
    expect(data.myCustomConnection.pageInfo.hasPreviousPage).toBe(true);
    expect(data.myCustomConnection.pageInfo.startCursor).toBeTruthy();
    expect(data.myCustomConnection.pageInfo.endCursor).toBeTruthy();
  } finally {
    pgClient.release();
  }
});

it("allows adding a custom connection to a nested type", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              pets: PetsConnection @pgQuery(
                source: ${embed(sql.fragment`graphile_utils.pets`)}
                withQueryBuilder: ${embed(queryBuilder => {
                  queryBuilder.where(
                    sql.fragment`${queryBuilder.getTableAlias()}.user_id = ${queryBuilder.parentQueryBuilder.getTableAlias()}.id`
                  );
                })}
              )
            }
          `,
        };
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
              id
              name
              p1: pets(first: 1, offset: 1) {
                nodes {
                  name
                }
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
              }
              p2: pets(first: 2) {
                edges {
                  cursor
                  node {
                    type
                  }
                }
                nodes {
                  name
                }
                totalCount
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
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
    expect(data.allUsers).toBeTruthy();
    expect(data.allUsers.nodes).toHaveLength(3);
    const [alice, bob, caroline] = data.allUsers.nodes;
    expect(alice.p2).toBeTruthy();
    expect(alice.p2.nodes).toHaveLength(0);
    expect(alice.p2.totalCount).toEqual(0);
    expect(bob.p2).toBeTruthy();
    expect(bob.p2.nodes).toHaveLength(2);
    expect(bob.p2.totalCount).toEqual(2);
    expect(caroline.p2).toBeTruthy();
    expect(caroline.p2.nodes).toHaveLength(2);
    expect(caroline.p2.totalCount).toEqual(3);
    expect(caroline.p2.nodes.map(n => n.name)).toEqual(["Goldie", "Spot"]);
    expect(data).toMatchSnapshot();
  } finally {
    pgClient.release();
  }
});

it("allows adding a custom list to a nested type", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              myCustomList(idLessThan: Int): [User] @pgQuery(
                source: ${embed(sql.fragment`graphile_utils.users`)}
                withQueryBuilder: ${embed((queryBuilder, args) => {
                  if (args.idLessThan) {
                    queryBuilder.where(
                      sql.fragment`${queryBuilder.getTableAlias()}.id < ${sql.value(
                        args.idLessThan
                      )}`
                    );
                  }
                })}
              )
            }
          `,
        };
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
          user: userById(id: 1) {
            id
            name
            myCustomList(idLessThan: 3) {
              bio
              email
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
    expect(data.user).toBeTruthy();
    expect(data.user.myCustomList).toBeTruthy();
    expect(data.user.myCustomList[0].bio).not.toBe(undefined);
    expect(data.user.myCustomList[0].email).toBeTruthy();
  } finally {
    pgClient.release();
  }
});

it("allows adding a single table entry to a nested type", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              myCustomRecord(id: Int!): User @pgQuery(
                source: ${embed(
                  (parentQueryBuilder, args) =>
                    sql.fragment`(select * from graphile_utils.users where users.id = ${sql.value(
                      args.id
                    )} and users.id <> ${parentQueryBuilder.getTableAlias()}.id limit 1)`
                )}
              )
            }
          `,
        };
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
          user: userById(id: 1) {
            id
            name
            myCustomRecord(id: 2) {
              id
              bio
              email
            }
            expectNull: myCustomRecord(id: 1) {
              id
              bio
              email
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
    expect(data.user).toBeTruthy();
    expect(data.user.myCustomRecord).toBeTruthy();
    expect(data.user.myCustomRecord.id).toBe(2);
    expect(data.user.myCustomRecord.bio).not.toBe(undefined);
    expect(data.user.myCustomRecord.email).toBeTruthy();
    expect(data.user.expectNull).toBe(null);
  } finally {
    pgClient.release();
  }
});

it("allows to retrieve a single scalar value", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              myCustomScalar: Int! @pgQuery(
                fragment: ${embed(sql.fragment`(SELECT 100)`)}
              )
              myCustomScalarWithFunction: String! @pgQuery(
                fragment: ${embed(
                  queryBuilder =>
                    sql.fragment`(${queryBuilder.getTableAlias()}.name || ' ' || ${queryBuilder.getTableAlias()}.email)`
                )}
              )
              myCustomScalarWithFunctionAndArgument(test: Int!): Int! @pgQuery(
                fragment: ${embed(
                  (queryBuilder, args) =>
                    sql.fragment`(SELECT ${sql.value(args.test)}::integer)`
                )}
              )
            }
          `,
        };
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
          user: userById(id: 1) {
            id
            name
            myCustomScalar
            myCustomScalarWithFunction
            myCustomScalarWithFunctionAndArgument(test: 102)
            m100: myCustomScalar
            mAlice: myCustomScalarWithFunction
            m103: myCustomScalarWithFunctionAndArgument(test: 103)
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.myCustomScalar).toBe(100);
    expect(data.user.myCustomScalarWithFunction).toBe(
      "Alice alice@example.com"
    );
    expect(data.user.myCustomScalarWithFunctionAndArgument).toBe(102);
    expect(data.user.m100).toBe(100);
    expect(data.user.mAlice).toBe("Alice alice@example.com");
    expect(data.user.m103).toBe(103);
  } finally {
    pgClient.release();
  }
});

it("allows to retrieve array scalar values", async () => {
  const schema = await createPostGraphileSchema(pgPool, ["graphile_utils"], {
    disableDefaultMutations: true,
    appendPlugins: [
      makeExtendSchemaPlugin(build => {
        const { pgSql: sql } = build;
        return {
          typeDefs: gql`
            extend type User {
              myCustomArrayOfScalars: [String!]! @pgQuery(
                fragment: ${embed(
                  sql.fragment`array(SELECT name from graphile_utils.pets)`
                )}
              )
              
            }
          `,
        };
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
          user: userById(id: 1) {
            id
            name
            myCustomArrayOfScalars
          }
        }
      `,
      null,
      { pgClient },
      {}
    );
    expect(errors).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.user).toBeTruthy();
    expect(data.user.myCustomArrayOfScalars).toEqual([
      "Felix",
      "Fido",
      "Goldie",
      "Spot",
      "Albert",
    ]);
  } finally {
    pgClient.release();
  }
});
