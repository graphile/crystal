import { runTestQuery } from "./helpers";

it("{forums{name}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums {
        name
      }
    }
  `);
  expect(data.forums[0].name).toEqual("Cats");
  expect(data.forums[1].name).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(
    `{ forums: [{ name: "Cats" }, { name: "Postgres" }] }`,
  );
  expect({
    __: queries.map((q) => q.text).join("\n\n"),
  }).toMatchInlineSnapshot(`
    select 
      __forums__."name"::text as "0"
    from app_public.forums as __forums__
    where (
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __forums__."id" asc
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{a:name b:name}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
    {
      forums {
        a: name
        b: name
      }
    }
  `);
  expect(data.forums[0].a).toEqual("Cats");
  expect(data.forums[1].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      forums: [
        { a: "Cats", b: "Cats" },
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
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __forums__."id" asc
  `);
  expect(queries).toHaveLength(1);
});

it("{a:forums{a:name b:name}b:forums{a:name b:name}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
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
  expect(data.b[1].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      a: [
        { a: "Cats", b: "Cats" },
        { a: "Postgres", b: "Postgres" },
      ],
      b: [
        { a: "Cats", b: "Cats" },
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
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __forums__."id" asc
  `);
  expect(queries).toHaveLength(1);
});

it("{a:forums{id a:name b:name}b:forums{a:name b:name}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
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
  expect(data.b[1].b).toEqual("Postgres");
  expect({ __: data }).toMatchInlineSnapshot(`
    {
      a: [
        { id: "ca700000-0000-0000-0000-000000000ca7", a: "Cats", b: "Cats" },
        { id: "f1700000-0000-0000-0000-000000000f17", a: "Postgres", b: "Postgres" },
      ],
      b: [
        { a: "Cats", b: "Cats" },
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
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __forums__."id" asc
  `);
  expect(queries).toHaveLength(1);
});

it("{forums{name self{id name}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
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
        { name: "Postgres", self: { id: "f1700000-0000-0000-0000-000000000f17", name: "Postgres" } },
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
      __forums__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __forums__."id" asc
  `);
  expect(queries).toHaveLength(1);
});

it("{allMessagesConnection{edges{cursor node{body author{username gravatarUrl}}}}}", async () => {
  const { data, queries } = await runTestQuery(/* GraphQL */ `
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
      __messages__.archived_at is null
    ) and (
      true /* authorization checks */
    )
    order by __messages__."id" asc
  `);
  expect(queries).toHaveLength(1);
});
