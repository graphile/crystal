---
layout: page
path: /postgraphile/namespaces/
title: Namespaces (PostgreSQL "schemas")
---

In PostgreSQL, each database consists of a number of "schemas". The default
schema is named "public" and many users only ever deal with this one schema.

In PostGraphile we advise you to use schemas to help organise your application -
you can use one schema for the tables that will be exposed to GraphQL, another
for the tables that should be completely private (e.g. where you store the
bcrypted user passwords or other secrets never to be exposed!), and you can use
other schemas too, whatever makes sense for your application.

To create a schema in PostgreSQL:

```sql
CREATE SCHEMA app_public;
```

To create or reference something in that schema, just prepend the name of the
thing with the schema name, e.g:

```sql
CREATE TABLE app_public.users ( ... );
CREATE FUNCTION app_public.best_user() ...;

SELECT * FROM app_public.users;
SELECT * FROM app_public.best_user();
```

### Advice

Having built quite a few applications on PostGraphile now, I (Benjie) have
settled on the following:

- `app_public` - tables and functions to be exposed to GraphQL (or any other
  system) - it's your public interface. This is the main part of your database.
- `app_hidden` - same privileges as `app_public`, but it's not intended to be
  exposed publicly. It's like "implementation details" of your app_public
  schema. You may not need it often.
- `app_private` - SUPER SECRET STUFF 🕵️ No-one should be able to read this
  without a `SECURITY DEFINER` function letting them selectively do things. This
  is where you store passwords (bcrypted), access tokens (hopefully encrypted),
  etc. It should be impossible (thanks to RBAC (`GRANT`/`REVOKE`)) for web users
  to access this.

I personally don't use the `public` schema for anything other than as the
[default location that PostgreSQL extensions get installed](https://www.postgresql.org/docs/current/static/sql-createextension.html).

Using this pattern is **not required** and in fact you can just use the default
`public` schema if you so chose. By default, PostGraphile will automatically
ignore resources installed by extensions, so you don't need to omit these
manually. Other tables and functions can be omitted using the
[smart comments](./smart-comments) functionality.

### Other schemas

Here's some other schemas you might see (but should not modify):

- `graphile_worker` - a schema used and managed by
  https://github.com/graphile/worker
- `graphile_migrate` - a schema used and managed by
  https://github.com/graphile/migrate
- `postgraphile_watch` - if you're using PostGraphile in watch mode (`--watch`
  or `watchPg: true`), PostGraphile will install this schema to create
  [PostgreSQL Event Triggers](https://www.postgresql.org/docs/current/sql-createeventtrigger.html)
  to enable watch mode.
- `information_schema` - a SQL standard schema for reflection over the database:
  https://www.postgresql.org/docs/current/information-schema.html
- `pg_catalog` - the
  [PostgreSQL system catalog](https://www.postgresql.org/docs/current/catalogs.html),
  contain details of everything inside the database (a more PG-native form of
  `information_schema`)
- `pg_*` - various other PostgreSQL reserved schemas
