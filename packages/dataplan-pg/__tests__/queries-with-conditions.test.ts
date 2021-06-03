import { runTestQuery } from "./helpers";

it("{forums{name messagesList(limit){body author{username gravatarUrl}}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums {
        name
        messagesList(limit: 2) {
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
          ],
        },
        {
          name: "Postgres",
          messagesList: [
            { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
            { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
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
          (__messages__.archived_at is null) = (__forums__."archived_at" is null)
        ) and (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
        limit 2
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
    where (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});

it("{forums(limit){name messagesList(limit){body author{username gravatarUrl}}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums(limit: 2) {
        name
        messagesList(limit: 2) {
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
          ],
        },
        {
          name: "Postgres",
          messagesList: [
            { body: "Postgres = awesome -- Alice", author: { username: "Alice", gravatarUrl: null } },
            { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
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
          (__messages__.archived_at is null) = (__forums__."archived_at" is null)
        ) and (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
        limit 2
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
    where (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    limit 2
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{name messagesConnection(limit,includeArchived){nodes{body author{...}} edges{cursor node{body author{...}}}}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums {
        name
        messagesConnection(limit: 5, includeArchived: INHERIT) {
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
        limit 5
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
    where (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});
it("{forums{name messagesConnection(...){nodes{body author{...}} edges{cursor node{body author{...}}}}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums {
        name
        messagesConnection(
          limit: 5
          condition: { featured: true }
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
        { name: "Cats", messagesConnection: { nodes: [], edges: [] } },
        {
          name: "Postgres",
          messagesConnection: {
            nodes: [{ body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } }],
            edges: [
              {
                cursor: "424242",
                node: { body: "Postgres = awesome -- Bob", author: { username: "Bob", gravatarUrl: null } },
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
          (__messages__.featured = $1::boolean)
        ) and (
          __forums__."id"::"uuid" = __messages__."forum_id"
        )
        limit 5
      ) as "1",
      __forums__."id"::text as "2"
    from app_public.forums as __forums__
    where (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
  `);
  expect(queries).toHaveLength(1);
});
