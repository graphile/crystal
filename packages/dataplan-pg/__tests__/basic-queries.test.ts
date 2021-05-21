import { BaseGraphQLContext } from "graphile-crystal";
import { graphql } from "graphql";
import { Pool, PoolClient } from "pg";
import { PgClient, WithPgClient, PgClientQuery } from "../src/datasource";
import { schema } from "./exampleSchema";

let testPool: Pool | null = null;
beforeAll(() => {
  testPool = new Pool({ connectionString: "graphile_crystal" });
});

afterAll(() => {
  testPool.end();
  testPool = null;
});

function pg2pgclient(client: PoolClient): PgClient {
  return {
    query<TData>(opts: PgClientQuery) {
      const { text, values, arrayMode, name } = opts;

      return arrayMode
        ? client.query<TData extends Array<any> ? TData : never>({
            text,
            values,
            name,
            rowMode: "array",
          })
        : client.query<TData>({
            text,
            values,
            name,
          });
    },
  };
}

async function test(source: string, variableValues?: { [key: string]: any }) {
  const withPgClient: WithPgClient = async (_pgSettings, callback) => {
    const client = await testPool.connect();
    try {
      // TODO: set pgSettings within a transaction
      return callback(pg2pgclient(client));
    } finally {
      client.release();
    }
  };
  const contextValue: BaseGraphQLContext = {
    pgSettings: {},
    withPgClient,
  };
  const result = await graphql({
    schema,
    source,
    variableValues,
    contextValue,
    rootValue: null,
  });

  const { data, errors } = result;
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  expect(data).toMatchSnapshot();
  return data;
}

it("{forums{name}}", () =>
  test(/* GraphQL */ `
    {
      forums {
        name
      }
    }
  `));

it("{forums{name self{id name}}}", () =>
  test(/* GraphQL */ `
    {
      forums {
        name
        self {
          id
          name
        }
      }
    }
  `));

it("{forums{name messagesList(limit,condition,includeArchived){body author{username gravatarUrl}}}}", () =>
  test(/* GraphQL */ `
    {
      forums {
        name
        messagesList(
          limit: 5
          condition: { active: true }
          includeArchived: INHERIT
        ) {
          body
          author {
            username
            gravatarUrl
          }
        }
      }
    }
  `));

it("{allMessagesConnection{edges{cursor node{body author{username gravatarUrl}}}}}", () =>
  test(/* GraphQL */ `
    {
      allMessagesConnection {
        edges {
          cursor
          node {
            body
            author {
              username
              gravatarUrl
            }
          }
        }
      }
    }
  `));

it("{forums{name messagesConnection(...){nodes{body author{...}} edges{cursor node{body author{...}}}}}}", () =>
  test(/* GraphQL */ `
    {
      forums {
        name
        messagesConnection(
          limit: 5
          condition: { active: true }
          includeArchived: INHERIT
        ) {
          nodes {
            body
            author {
              username
              gravatarUrl
            }
          }
          edges {
            cursor
            node {
              body
              author {
                username
                gravatarUrl
              }
            }
          }
        }
      }
    }
  `));
