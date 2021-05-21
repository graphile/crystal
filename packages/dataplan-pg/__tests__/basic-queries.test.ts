import type { BaseGraphQLContext } from "graphile-crystal";
import { graphql } from "graphql";
import type { PoolClient } from "pg";
import { Pool } from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../src/datasource";
import { schema } from "./exampleSchema";

let testPool: Pool | null = null;
beforeAll(() => {
  testPool = new Pool({ connectionString: "graphile_crystal" });
});

afterAll(() => {
  testPool.end();
  testPool = null;
});

let queries: PgClientQuery[] = [];
beforeEach(() => {
  queries = [];
});

function pg2pgclient(client: PoolClient): PgClient {
  return {
    query<TData>(opts: PgClientQuery) {
      queries.push(opts);
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
  return data;
}

it("{forums{name}}", async () => {
  const data = await test(/* GraphQL */ `
    {
      forums {
        name
      }
    }
  `);
  expect(data.forums[0].name).toEqual("Cats");
  expect(data.forums[2].name).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        {
          name: 'Cats',
        },
        {
          name: 'Dogs',
        },
        {
          name: 'Postgres',
        },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums_1."name"::text as "0"
    from app_public.forums as __forums_1
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{name self{id name}}}", async () => {
  const data = await test(/* GraphQL */ `
    {
      forums {
        name
        self {
          id
          name
        }
      }
    }
  `);
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        {
          name: 'Cats',
          self: {
            id: 'ca700000-0000-0000-0000-000000000ca7',
            name: 'Cats',
          },
        },
        {
          name: 'Dogs',
          self: {
            id: 'd0900000-0000-0000-0000-000000000d09',
            name: 'Dogs',
          },
        },
        {
          name: 'Postgres',
          self: {
            id: 'bae00000-0000-0000-0000-000000000bae',
            name: 'Postgres',
          },
        },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums_1."name"::text as "0",
      __forums_1."id"::text as "1"
    from app_public.forums as __forums_1
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{name messagesList(limit,condition,includeArchived){body author{username gravatarUrl}}}}", async () => {
  const data = await test(/* GraphQL */ `
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
  `);
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        {
          name: 'Cats',
          messagesList: [
            {
              body: 'Cats = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
            {
              body: 'Cats = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
            {
              body: 'Cats = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          ],
        },
        {
          name: 'Dogs',
          messagesList: [
            {
              body: 'Dogs = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
            {
              body: 'Dogs = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
            {
              body: 'Dogs = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          ],
        },
        {
          name: 'Postgres',
          messagesList: [
            {
              body: 'Postgres = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
            {
              body: 'Postgres = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
            {
              body: 'Postgres = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          ],
        },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums_1."name"::text as "0",
      array(
        select array[
          __messages_1."body"::text,
          __users_1."username"::text,
          __users_1."gravatar_url"::text,
          __messages_1."author_id"::text
        ]::text[]
        from app_public.messages as __messages_1
        left outer join app_public.users as __users_1
        on ((__messages_1."author_id"::uuid = __users_1.id))
        where (
          __forums_1."id"::uuid = __messages_1.forum_id
        )
      ) as "1",
      __forums_1."id"::text as "2"
    from app_public.forums as __forums_1
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{allMessagesConnection{edges{cursor node{body author{username gravatarUrl}}}}}", async () => {
  const data = await test(/* GraphQL */ `
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
  `);
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      allMessagesConnection: {
        edges: [
          {
            cursor: '424242',
            node: {
              body: 'Cats = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Cats = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Cats = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Dogs = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Dogs = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Dogs = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Postgres = awesome -- Alice',
              author: {
                username: 'Alice',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Postgres = awesome -- Bob',
              author: {
                username: 'Bob',
                gravatarUrl: null,
              },
            },
          },
          {
            cursor: '424242',
            node: {
              body: 'Postgres = awesome -- Cecilia',
              author: {
                username: 'Cecilia',
                gravatarUrl: null,
              },
            },
          },
        ],
      },
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      424242 /* TODO: CURSOR */ as "0",
      __messages_1."body"::text as "1",
      __users_1."username"::text as "2",
      __users_1."gravatar_url"::text as "3",
      __messages_1."author_id"::text as "4"
    from app_public.messages as __messages_1
    left outer join app_public.users as __users_1
    on ((__messages_1."author_id"::uuid = __users_1.id))
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{name messagesConnection(...){nodes{body author{...}} edges{cursor node{body author{...}}}}}}", async () => {
  const data = await test(/* GraphQL */ `
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
  `);
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        {
          name: 'Cats',
          messagesConnection: {
            nodes: [
              {
                body: 'Cats = awesome -- Alice',
                author: {
                  username: 'Alice',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Cats = awesome -- Bob',
                author: {
                  username: 'Bob',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Cats = awesome -- Cecilia',
                author: {
                  username: 'Cecilia',
                  gravatarUrl: null,
                },
              },
            ],
            edges: [
              {
                cursor: '424242',
                node: {
                  body: 'Cats = awesome -- Alice',
                  author: {
                    username: 'Alice',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Cats = awesome -- Bob',
                  author: {
                    username: 'Bob',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Cats = awesome -- Cecilia',
                  author: {
                    username: 'Cecilia',
                    gravatarUrl: null,
                  },
                },
              },
            ],
          },
        },
        {
          name: 'Dogs',
          messagesConnection: {
            nodes: [
              {
                body: 'Dogs = awesome -- Alice',
                author: {
                  username: 'Alice',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Dogs = awesome -- Bob',
                author: {
                  username: 'Bob',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Dogs = awesome -- Cecilia',
                author: {
                  username: 'Cecilia',
                  gravatarUrl: null,
                },
              },
            ],
            edges: [
              {
                cursor: '424242',
                node: {
                  body: 'Dogs = awesome -- Alice',
                  author: {
                    username: 'Alice',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Dogs = awesome -- Bob',
                  author: {
                    username: 'Bob',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Dogs = awesome -- Cecilia',
                  author: {
                    username: 'Cecilia',
                    gravatarUrl: null,
                  },
                },
              },
            ],
          },
        },
        {
          name: 'Postgres',
          messagesConnection: {
            nodes: [
              {
                body: 'Postgres = awesome -- Alice',
                author: {
                  username: 'Alice',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Postgres = awesome -- Bob',
                author: {
                  username: 'Bob',
                  gravatarUrl: null,
                },
              },
              {
                body: 'Postgres = awesome -- Cecilia',
                author: {
                  username: 'Cecilia',
                  gravatarUrl: null,
                },
              },
            ],
            edges: [
              {
                cursor: '424242',
                node: {
                  body: 'Postgres = awesome -- Alice',
                  author: {
                    username: 'Alice',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Postgres = awesome -- Bob',
                  author: {
                    username: 'Bob',
                    gravatarUrl: null,
                  },
                },
              },
              {
                cursor: '424242',
                node: {
                  body: 'Postgres = awesome -- Cecilia',
                  author: {
                    username: 'Cecilia',
                    gravatarUrl: null,
                  },
                },
              },
            ],
          },
        },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums_1."name"::text as "0",
      array(
        select array[
          __messages_1."body"::text,
          __users_1."username"::text,
          __users_1."gravatar_url"::text,
          __messages_1."author_id"::text,
          424242 /* TODO: CURSOR */,
          __users_2."username"::text,
          __users_2."gravatar_url"::text
        ]::text[]
        from app_public.messages as __messages_1
        left outer join app_public.users as __users_1
        on ((__messages_1."author_id"::uuid = __users_1.id))
        left outer join app_public.users as __users_2
        on ((__messages_1."author_id"::uuid = __users_2.id))
        where (
          __forums_1."id"::uuid = __messages_1.forum_id
        )
      ) as "1",
      __forums_1."id"::text as "2"
    from app_public.forums as __forums_1
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});
