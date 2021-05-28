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
  expect({ __: data }).toMatchInlineSnapshot(
    `{ forums: [{ name: "Cats" }, { name: "Dogs" }, { name: "Postgres" }] }`,
  );
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0"
    from app_public.forums as __forums__
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{a:name b:name}}", async () => {
  const data = await test(/* GraphQL */ `
    {
      forums {
        a: name
        b: name
      }
    }
  `);
  expect(data.forums[0].a).toEqual("Cats");
  expect(data.forums[2].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        { a: "Cats", b: "Cats" },
        { a: "Dogs", b: "Dogs" },
        { a: "Postgres", b: "Postgres" },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0"
    from app_public.forums as __forums__
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{a:forums{a:name b:name}b:forums{a:name b:name}}", async () => {
  const data = await test(/* GraphQL */ `
    {
      a: forums {
        a: name
        b: name
      }
      b: forums {
        a: name
        b: name
      }
    }
  `);
  expect(data.a[0].a).toEqual("Cats");
  expect(data.b[2].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      a: [
        { a: "Cats", b: "Cats" },
        { a: "Dogs", b: "Dogs" },
        { a: "Postgres", b: "Postgres" },
      ],
      b: [
        { a: "Cats", b: "Cats" },
        { a: "Dogs", b: "Dogs" },
        { a: "Postgres", b: "Postgres" },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0"
    from app_public.forums as __forums__
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{a:forums{id a:name b:name}b:forums{a:name b:name}}", async () => {
  const data = await test(/* GraphQL */ `
    {
      a: forums {
        id
        a: name
        b: name
      }
      b: forums {
        a: name
        b: name
      }
    }
  `);
  expect(data.a[0].a).toEqual("Cats");
  expect(data.b[2].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      a: [
        { id: "ca700000-0000-0000-0000-000000000ca7", a: "Cats", b: "Cats" },
        { id: "d0900000-0000-0000-0000-000000000d09", a: "Dogs", b: "Dogs" },
        { id: "bae00000-0000-0000-0000-000000000bae", a: "Postgres", b: "Postgres" },
      ],
      b: [
        { a: "Cats", b: "Cats" },
        { a: "Dogs", b: "Dogs" },
        { a: "Postgres", b: "Postgres" },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."id"::text as "0",
      __forums__."name"::text as "1"
    from app_public.forums as __forums__
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
        { name: "Cats", self: { id: "ca700000-0000-0000-0000-000000000ca7", name: "Cats" } },
        { name: "Dogs", self: { id: "d0900000-0000-0000-0000-000000000d09", name: "Dogs" } },
        { name: "Postgres", self: { id: "bae00000-0000-0000-0000-000000000bae", name: "Postgres" } },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0",
      __forums__."id"::text as "1"
    from app_public.forums as __forums__
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
          name: "Cats",
          messagesList: [
            { body: "Cats = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
            { body: "Cats = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
            { body: "Cats = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
          ],
        },
        {
          name: "Dogs",
          messagesList: [
            { body: "Dogs = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
            { body: "Dogs = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
            { body: "Dogs = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
          ],
        },
        {
          name: "Postgres",
          messagesList: [
            { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
            { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
            { body: "Postgres = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
          ],
        },
      ],
    }
  `);
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0",
      array(
        select array[
          __messages__."body"::text,
          __users__."username"::text,
          __users__."gravatar_url"::text,
          __messages__."author_id"::text
        ]::text[]
        from app_public.messages as __messages__
        left outer join app_public.users as __users__
        on ((__messages__."author_id"::"uuid" = __users__."id"))
        where (
          __forums__."id"::uuid = __messages__.forum_id
        )
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
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
          { cursor: "424242", node: { body: "Cats = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } } },
          { cursor: "424242", node: { body: "Cats = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } } },
          {
            cursor: "424242",
            node: { body: "Cats = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
          },
          { cursor: "424242", node: { body: "Dogs = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } } },
          { cursor: "424242", node: { body: "Dogs = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } } },
          {
            cursor: "424242",
            node: { body: "Dogs = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
          },
          {
            cursor: "424242",
            node: { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
          },
          { cursor: "424242", node: { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } } },
          {
            cursor: "424242",
            node: { body: "Postgres = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
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
      __messages__."body"::text as "1",
      __users__."username"::text as "2",
      __users__."gravatar_url"::text as "3",
      __messages__."author_id"::text as "4"
    from app_public.messages as __messages__
    left outer join app_public.users as __users__
    on ((__messages__."author_id"::"uuid" = __users__."id"))
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
          name: "Cats",
          messagesConnection: {
            nodes: [
              { body: "Cats = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              { body: "Cats = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
              { body: "Cats = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
            ],
            edges: [
              {
                cursor: "424242",
                node: { body: "Cats = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              },
              { cursor: "424242", node: { body: "Cats = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } } },
              {
                cursor: "424242",
                node: { body: "Cats = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
              },
            ],
          },
        },
        {
          name: "Dogs",
          messagesConnection: {
            nodes: [
              { body: "Dogs = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              { body: "Dogs = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
              { body: "Dogs = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
            ],
            edges: [
              {
                cursor: "424242",
                node: { body: "Dogs = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              },
              { cursor: "424242", node: { body: "Dogs = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } } },
              {
                cursor: "424242",
                node: { body: "Dogs = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
              },
            ],
          },
        },
        {
          name: "Postgres",
          messagesConnection: {
            nodes: [
              { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
              { body: "Postgres = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
            ],
            edges: [
              {
                cursor: "424242",
                node: { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
              },
              {
                cursor: "424242",
                node: { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
              },
              {
                cursor: "424242",
                node: { body: "Postgres = awesome -- Cecilia", author: { username: "Cecilia", gravatarUrl: null } },
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
      __forums__."name"::text as "0",
      array(
        select array[
          __messages__."body"::text,
          __users__."username"::text,
          __users__."gravatar_url"::text,
          __messages__."author_id"::text,
          424242 /* TODO: CURSOR */,
          __users_2."username"::text,
          __users_2."gravatar_url"::text
        ]::text[]
        from app_public.messages as __messages__
        left outer join app_public.users as __users__
        on ((__messages__."author_id"::"uuid" = __users__."id"))
        left outer join app_public.users as __users_2
        on ((__messages__."author_id"::"uuid" = __users_2."id"))
        where (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
    where (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});
