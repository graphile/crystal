# Small hand-written @dataplan/pg example

Registry (representing the database) is in `registry.ts`

Schema is in `schema.ts`

This uses `graphql-codegen-grafast` to make for strong(ish) types, to generate
the types run `yarn codegen` in the `grafast/dataplan-pg` folder.

Each GraphQL type that represents a PgSelectSingleStep is defined in
`schema-manual-types.ts`

The `index.ts` file runs a simple GraphQL query against the schema.

This schema assumes you have a local database called `dataplanpg-example` with
the following schema:

```sql
create extension citext;
create table users (
  id int primary key generated always as identity,
  username citext not null unique,
  created_at timestamptz not null default now()
);
create table posts (
  id int primary key generated always as identity,
  author_id int not null references users on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
```

Here's some data to add for testing:

```sql
insert into users (username) values ('Alice'), ('Bob'), ('Caroline');

insert into posts (author_id, body) values
  (1, 'Hey! I''m Alice'),
  (2, 'Call me Bob'),
  (3, 'Caroline here!'),
  (1, 'This is my second post'),
  (1, 'Stroopwaffles are great!');
```

Note that this example does not include any authentication/authorization - for
guidance there we recommend that you read the relevant parts of the PostGraphile
documentation.
