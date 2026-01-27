---
title: The Default Role
---

PostGraphile makes full use of PostgreSQL roles, so in this article we will
explain briefly how PostgreSQL roles and users work and how that relates to how
we use them in PostGraphile.

You can make any number of PostgreSQL roles with
[`CREATE ROLE`](https://www.postgresql.org/docs/current/static/sql-createrole.html)
command and assign permissions to those roles with the
[`GRANT`](https://www.postgresql.org/docs/current/static/sql-grant.html)
command. Permissions like select from the table `post` or insert rows into the
`person` table.

PostgreSQL roles are also hierarchical. That is you can “grant” roles to other
roles. For example if I had role `editor` which could change the data in our
database and role `admin`, if I granted the `editor` role to `admin` with the
command:

```sql
grant editor to admin;
```

Then the `admin` role would have the same permissions the `editor` role has. The
`admin` role would also be able to _change_ its role to the `editor` role. This
means for the rest of the session you don’t have any `admin` permissions, but
only permissions given to the `editor` role.

In PostgreSQL you also have the idea of a user. A user is just a role that can
login. So for example, the following are equivalent as the create an `admin`
role that can log in (or a user):

```sql
create role admin login;
create user admin;
```

…and the following are also equivalent as they create a role that _can’t_ log
in:

```sql
create role editor;
create user editor nologin;
```

“Logging in” just means we can use the role when authenticating in the
PostgreSQL authentication section of the connection string. So with the above
roles you could start a PostgreSQL connection with
`postgres://admin@localhost/mydb`, but not `postgres://editor@localhost/mydb`.

### Roles in PostGraphile

So how does this apply to PostGraphile? PostGraphile requires you to have at
least one user (role that can log in) when connecting to the server. That role
will be specified in your connection string and will from here on out be
referred to as the `authenticator`. You’d connect with your `authenticator` as follows:

```bash
postgraphile -c postgres://authenticator@localhost/mydb
```

The `authenticator` will have all the privileges PostGraphile might need
(including, and often exclusively, the ability to switch to certain other
roles), but should be restricted so that it can only see data that's intended to
be exposed.

The `authenticator` role can be granted the ability to switch to other roles e.g. via
`grant visitor to authenticator;`. Using the `noinherit` option when you define
the authenticator role (`create role authenticator login noinherit ...`) will mean
that it needs to switch to this role to gain its permissions - e.g. via `set
role to visitor;` - this can be a
great security boundary.

In PostGraphile this role switch can be triggered via the
`role` setting which can be populated
in your [preset.grafast.context](./config/context.mdx) callback:

```js title="graphile.config.mjs"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

export default {
  extends: [PostGraphileAmberPreset],
  grafast: {
    context(requestContext, args) {
      // Extract the "session user" from the request context, e.g.
      const user = requestContext.expressv4?.req?.user;

      // Start with the role we've already set it to - e.g. via the JWT plugin
      let role = args.contextValue.pgSettings?.role;

      // If this is unset: default to "visitor" if logged in, anonymous otherwise
      role ??= user ? "visitor" : "anonymous";

      return {
        pgSettings: {
          // Override the role in the pgSettings
          ...args.contextValue.pgSettings,
          role,
        },
      };
    },
  },
};
```

_This article was originally written by
[Caleb Meredith](https://twitter.com/calebmer)._
