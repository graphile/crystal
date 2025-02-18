---
title: Relations
toc_max_heading_level: 4
---

We automatically discover relations between database tables by inspecting their
foreign keys (and indexes if `--no-ignore-indexes` or `ignoreIndexes: false` is
set), and use these to build relations into the generated GraphQL schema.

An example of a foreign key constraint when defining a table would be the
`REFERENCES` keyword below:

```sql {4}
create table app_public.users (
  -- ...
  organization_id int not null
    references app_public.organizations on delete cascade,
  -- ...
);
create index on app_public.users (organization_id);
```

Alternatively a foreign key constraint can be added after table creation:

```sql
alter table users
  add constraint users_organization_id_fkey
  foreign key (organization_id)
  references organizations
  on delete cascade;
create index on users (organization_id);
```

You can read more about defining foreign key constraints, including constraints
that utilize multiple columns, in the
[PostgreSQL documentation](https://www.postgresql.org/docs/current/static/ddl-constraints.html#DDL-CONSTRAINTS-FK).

PostGraphile detects and exposes one-to-one, one-to-many and many-to-one
relations automatically. Many-to-many relationships can be handled with the
[many-to-many relations plugin](https://github.com/graphile-contrib/pg-many-to-many).

By default, relations are exposed as GraphQL fields using a camelCase
combination of the target type and the source fields (inflectors:
`singleRelationByKeys`, `singleRelationByKeysBackwards`, and
`manyRelationByKeys`). Unique constraints expose a GraphQL table type directly,
non-unique constraints expose a [connection](./connections). The GraphQL
connections that these relations expose support pagination,
[filtering](./filtering), and ordering.

### Examples

#### Example database schema for one-to-many relation

```sql
create schema a;
create schema c;

create table c.person (
  id serial primary key,
  name varchar not null,
  about text,
  email varchar not null unique,
  created_at timestamp default current_timestamp
);

create table a.post (
  id serial primary key,
  headline text not null,
  body text,
  -- `references` 👇  sets up the foreign key relation
  author_id int4 references c.person(id)
);
create index on a.post (author_id);
```

#### Example query against the above schema

```graphql
{
  allPosts {
    nodes {
      headline
      body

      # this relation is automatically exposed
      personByAuthorId {
        id
        name
        about
      }
    }
  }
}
```

#### Many-to-many relations

Many-to-many relations can be handled with the
[many-to-many relations plugin](https://github.com/graphile-contrib/pg-many-to-many)
or by using a computed column that returns `setof`:

```sql

create table post (
  id serial primary key,
  headline text,
  body text
);
create table author (
  id serial primary key,
  name text
);
create table post_author (
  post_id integer references post,
  author_id integer references author,
  primary key (post_id, author_id)
);

create function "post_authorsByPostId"(p post)
returns setof author as $$
  select author.*
  from author
  inner join post_author
  on (post_author.author_id = author.id)
  where post_author.post_id = p.id;
$$ language sql stable;

```
