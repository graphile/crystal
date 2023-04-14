---
layout: page
path: /postgraphile/requirements/
title: Requirements
---

PostGraphile is packaged as a Node.js module, you can install it with `npm` or
`yarn` (depending on your preference) - users tend to have fewer issues with
`yarn`, so we recommend it.

We recommend using the latest LTS version of Node.js and PostgreSQL, but we have
limited support for older versions, so long as they are still LTS. Using newer
released versions should generally work fine (we don't recommend using with
alpha/beta versions though), but if there's any issues let us know in an issue.

### Your PostgreSQL database

These aren't exactly "requirements", but they will impact your PostGraphile
experience.

- **Use primary keys**: if you don't have primary keys on your tables then they
  won't get the `nodeId` globally unique identifier interface. Further if you
  don't have unique constraints then you won't be able to use the automatic
  update/delete mutations (since they need a way to identify the row to
  update/delete).
- **Use foreign keys**: we infer relations between tables using
  [foreign key constraints](https://www.postgresql.org/docs/current/static/ddl-constraints.html#DDL-CONSTRAINTS-FK);
  if you don't use these constraints then we won't know there's a relationship
  between the tables. There are plugins to get around this (using smart
  comments) but it's highly recommended that you use PostgreSQL's built in
  relations support.
- **<a name="dont-use-column-based-select-grants"></a>Don't use column-based
  SELECT grants**: column-based grants work well for `INSERT` and `UPDATE`
  (especially when combined with `PgRBACPlugin`!), but they don't make sense
  for `DELETE` and they cause issues when used with `SELECT`. You cannot
  `SELECT *` which makes your life harder, and rules out some of our possible
  optimization strategies. Computed columns (where we pass the entire record to
  the function) typically have issues with column-based `SELECT` grants. It's
  recommended that you instead split your tables on permission boundaries and
  use one-to-one relations to join them together again - this also makes
  writing your RBAC/RLS policies simpler. If you want to omit a column entirely
  then you can give it the
  [`@behavior -*` smart tag](./smart-tags.md#behavior).
- **Function restrictions**: we have pretty good support for PostgreSQL
  functions, but there's some
  [common function restrictions](./function-restrictions.md) you should check out.
- **Use unique _constraints_** rather than unique _indexes_ when appropriate: we use
  unique constraints to create mutations such as `updateUserByUsername`; note
  that "PostgreSQL automatically creates a unique index when a unique constraint
  or primary key is defined for a table." --
  [PG docs](https://www.postgresql.org/docs/current/static/indexes-unique.html)
- **Use the defaults** for formatting output; we only run tests for the
  defaults so you may have an issue if you were to use, for example,
  `intervalstyle = 'iso_8601'` rather than the default
  `intervalstyle = 'postgres'`.
- **Use UTF8 encoding**: GraphQL operates over the UTF8 character set, using
  different encodings may impact your ability to store/retrieve certain values.

On top of this standard PostgreSQL best practices apply: use indexes carefully
for performance, use constraints and triggers to ensure your data is valid and
consistent, etc.

### Node.js: use the LTS

We only support LTS versions of Node.js. Once a Node.js version reaches
end-of-life we no longer support it, and any future patch release may be
incompatible with it. We do not see this as a violation of semver - once a
Node.js version reaches EOL **no reasonable user should use it**, and as such a
change to drop support for it is not a breaking change for reasonable users.

### PostgreSQL: use latest

For best results we recommend you use the latest stable release of PostgreSQL
that we officially support, however it should run well on any earlier version
of PostgreSQL that have not yet reached end-of life. Once a PostgreSQL version
reaches end-of-life we no longer support it, and any future patch release may
be incompatible with it. We do not see this as a violation of semver - once a
PostgreSQL version reaches EOL **no reasonable user should use it**, and as
such a change to drop support for it is not a breaking change for reasonable
users.

#### PG 11 [officially supported]

Works well.

#### PG 12 [officially supported]

Works well.

#### PG 13 [officially supported]

Works well.

#### PG 14 [officially supported]

Works well.

#### PG 15 [officially supported]

Works well.

### Operating system

PostGraphile is developed on \*nix operating systems like GNU/Linux and macOS.
As far as we know it works on Windows, but since no-one in the core team uses
Windows for development our Windows support is "best effort" rather than
"officially supported" - please file an issue if you have problems, but we may
be asking for your help to fix/test them!
