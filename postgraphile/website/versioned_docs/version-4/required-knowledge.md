---
title: Required knowledge
---

**WORK IN PROGRESS**: PR's welcome!

PostGraphile builds upon other technologies such as PostgreSQL and GraphQL, and
the PostGraphile documentation doesn't cover these topics in depth as they are
well documented elsewhere.

This page aims to outline some of the things you might want to do with
PostGraphile and what knowledge you may need (and where to get it) to do those
things well.

## Database - basics

Below outlines some of the SQL syntax and features you will probably want to be
familiar with to make the most of your PostGraphile usage. PostGraphile is
unopinionated in how you manage your database, so you may not need to be able to
write this syntax depending on what technologies you use to manage your DB (for
example, you might use a graphical tool), but if you can read it then it will
help you to read the PostGraphile documentation.

### Case insensitive unless quoted

SQL is case insensitive, both keywords and identifiers, so the following are all
equivalent:

- `select * from users`
- `SELECT * FROM USERS`
- `SeLeCt * FrOm UsErS`

This means a column like `userId` will actually come out as `userid`. To make an
identifier (table/column/function/etc name) case sensitive, wrap it in double
quotes:

- `select * from "Users"`

Benjie tends to prefer the lowercase syntax because it's easier to read and not
as "shouty".

It's common to use snake_case as the naming convention in SQL because of this
case-insensitivity, to save having to escape all the identifiers.

### The word `user` is reserved

If you want to call your table `user` you need to escape it; e.g.

```sql
create table "user" ( ... );
```

Here's a full list of reserved keywords:
https://www.postgresql.org/docs/current/sql-keywords-appendix.html

Most keywords are singular, which is why Benjie prefers to use plurals when
naming tables as it helps avoid potential keyword clashes.

### PostgreSQL doc versioning

PostgreSQL docs are found at `https://postgresql.org/docs/VERSION/...`. Often
when you google you will be taken to out of date docs, like those for version
9.1 or 8.3 or similar. At the top of every documentation page are links to jump
to the same page in the different PostgreSQL versions. Always make sure you are
referring to the docs in the version of PostgreSQL that you are using.

In our documentation, we always try and link to `/docs/current/...` which is a
special URL that always shows the latest stable version of PostgreSQL. If you
are using an older version you should make sure to switch to the older docs.

### Defining tables

```sql
create table users (
  id serial primary key,
  username citext not null unique check(username ~ '^[a-z][a-z0-9]+$'),
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- `create table` statement:
  https://www.postgresql.org/docs/current/sql-createtable.html
- `serial` data type is effectively an "auto-increment" field (for primary key):
  https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL
- `not null`:
  https://www.postgresql.org/docs/current/ddl-constraints.html#id-1.5.4.6.6
- `unique` is a shorthand for creating a unique constraint on the column:
  https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS
- `check` is a shorthand for creating a check constraint on the table:
  https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS
- `~` is the case-sensitive POSIX regexp comparison operator:
  https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-POSIX-REGEXP
- `timestamptz` is short for `timestamp with time zone` which reads the offset
  you provide and converts to UTC for storage. Note the timezone you save is
  LOST (despite the name of the type) so if you wish to store the timezone
  offset itself you should do so in a separate column. You should always use
  this date type:
  https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
- `default` if the column is not specified, what should its value default to
  (only applies to `INSERT`)

### Creating roles

```sql
create role my_superuser with login password 'password here' superuser;
create role app_authenticator with login password 'password here' noinherit;
create role app_visitor;
grant app_visitor to app_authenticator;
```

- `create role` statement:
  https://www.postgresql.org/docs/current/sql-createrole.html
- `login` - enables login
- `password '...'` - sets the password (note passwords are encrypted by default)
- `noinherit` - if you are a role with noinherit then you do not inherit the
  permissions from the roles that you have been granted, though you may still
  switch into them (via `set [local] role other_role;`) to use those privileges.
  This is useful for the PostGraphile user because it means that it cannot
  actually take any actions without first switching into another role (e.g.
  `app_visitor` or `app_admin`).

### Granting permissions

```sql
grant
  select,
  insert (column_1, column_2),
  update (column_2, column_3),
  delete
on my_table to app_visitor;
```

- `grant` statement: https://www.postgresql.org/docs/current/sql-grant.html
- `select`: we don't recommend using column-level select grants (because it
  prevents `select *` from working, and has knock-on consequences for mutations
  and functions)
- `insert (col1, col2)` / `update (col1, col2)`: we recommend that you always
  whitelist the writable columns; do not `grant insert on my_table` as that will
  allow inserting into any column including primary key, timestamps, etc.
  Combine this with PostGraphile's `--no-ignore-rbac` to have a more carefully
  honed GraphQL schema.
- `delete`: column-level grants don't make sense on delete.

### Creating security policies

Check out our Row-Level security infosheet here:
https://learn.graphile.org/docs/PostgreSQL_Row_Level_Security_Infosheet.pdf

```sql
-- Without this line, even if you define security policies, they will not be enforced
alter table my_table enable row level security;

create policy manage_own on my_table for all using ( author_id = current_user_id() );
create policy must_be_verified on my_table as restrictive for insert using ( current_user_is_verified() );
create policy admin_delete on my_table for delete using ( current_user_is_admin() );
create policy friend_insert on my_other_table for insert with check ( are_friends(author_id, user_id) );
```

- `create policy` statement:
  https://www.postgresql.org/docs/current/sql-createpolicy.html
- `as restrictive`: by default policies are 'permissive' and only one must pass;
  restrictive policies require at least one permissive policy to pass and _all_
  restrictive policies to pass
- `for all` / `for select` / `for insert` / `for update` / `for delete`: what
  operations does this policy apply to (note: there's no
  `FOR INSERT AND UPDATE` - you either have to use `ALL` or define multiple
  policies, one per operation)
- `using` - check to apply against PRE-EXISTING ROW to see if you can do the
  action (doesn't make sense for `INSERT`)
- `with check` - check to apply against NEWLY-UPDATED ROW to see if you can do
  that action (doesn't make sense for `SELECT` or `DELETE`)
- NOTE: if `with check` is not specified then the `using` clause will also be
  used for `with check` automatically.

### Recommended path

A good way to tackle and make sense of PostGraphile is to go through these
steps:

[**Introduction**](./)

Describes why you would want to go with this approach in the first place and
what the benefits and features of using PostGraphile are. Do not be deterred if
you find this daunting and are not used to using this much `SQL`. Using the
database as the application layer is a fairly modern and unfamiliar concept, but
by adopting it there are many benefits you may reap by being close to the data,
as well as leveraging the declarative nature of SQL.

[**Quick start**](./quick-start-guide)

Walks you through installing the required software such as `node` and `postgres`
and creating of a database that PostGraphile will be connecting to.

[**Schema Design**](./postgresql-schema-design)

Whether you have or have not built databases before, this section gives valuable
advice about how to design a solid database. Topics include naming conventions,
namespacing with schemas, managing access with roles and policies, handling
migrations and much more. If these words are unfamiliar to you, do not worry, it
will be clear once you have built a database following this guide.

[**PostGraphile-in-docker**](./running-postgraphile-in-docker)

PostGraphile does not require Docker, and is very at home in a pure Node.js
environment, so if you're not big on Docker you can skip this one!

If you develop using Docker, this will run through the building of a GraphQL API
for a forum-like website. It goes through installation through to example
queries and mutations to issue to PostGraphile.
