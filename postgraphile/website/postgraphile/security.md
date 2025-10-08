---
title: Security
---

Traditionally in web application architectures the security is implemented in
the server layer and the database is treated as a simple store of data. Partly
this was due to necessity (the security policies offered by databases such as
PostgreSQL were simply not granular enough), and partly this was people figuring
it would reduce the workload on the database thus increases scalability.
However, as applications grow, they start needing more advanced features or
additional services to interact with the database. There's a couple options they
have here: duplicate the authentication/authorization logic in multiple places
(which can lead to discrepancies and increases the surface area for potential
issues), or make sure everything goes through the original application layer
(which then becomes both the development and performance bottleneck).

However, this is no longer necessary since PostgreSQL introduced much more
granular permissions in the form of
[Row-Level Security (RLS) policies][rls-policies] in PostgreSQL 9.5 back at the
beginning of 2016. Now you can combine this with
PostgreSQL established permissions system (based on roles) allowing your
application to be considerably more specific about permissions: adding row-level
permission constraints to the existing table- and column-based permissions.

Now that this functionality is stable and proven (and especially with the
performance improvements in the latest PostgreSQL releases), we advise that you
protect your lowest level — the data itself. By doing so you can be sure that no
matter how many services interact with your database they will all be protected
by the same underlying permissions logic, which you only need to maintain in one
place. You can add as many microservices as you like, and they can talk to the
database directly!

When Row Level Security (RLS) is enabled, all rows are by default not visible to
any roles (except database administration roles and the role who created the
database/table); and permission is selectively granted with the use of policies.

If you already have a secure database schema that implements these technologies
to protect your data at the lowest levels then you can leverage `postgraphile`
to generate a powerful, secure and fast API very rapidly. PostGraphile simply
needs enough context (via [`pgSettings`](./config#pgsettings)) to understand who
is making the current request.

## Authentication strategies

- **Session cookies**: Use your framework’s existing session middleware (e.g.
  `express-session`, `@fastify/session`). After the session has been validated
  you can copy the user identifier and any relevant flags into `pgSettings`.
- **JWTs**: Verify the token in your middleware of choice, then map whichever
  claims you require into PostgreSQL. The [JWT guide](./jwt-guide) walks through
  that process and links to the
  [PostgreSQL JWT specification](./jwt-specification) that PostGraphile
  follows.
- **Other tokens**: API keys, mTLS attributes, OAuth access tokens, or other
  credentials can authenticate the caller; convert whatever identity or policy
  data you need into values for
  `pgSettings`.

PostGraphile does not recommend one approach over another; pick whatever fits
the rest of your infrastructure and long-term maintenance plans.

:::warning[`lazy-jwt` is a stopgap]

The `postgraphile/presets/lazy-jwt` preset can decode simple Bearer tokens, but
it deliberately does not address refresh tokens, revocation, or custom claim
mapping. Use it while you build your own middleware, not as a permanent
solution.

:::

## Feeding identity into PostgreSQL

Your authentication layer runs inside your web framework; PostgreSQL only sees
the values you place into `pgSettings`. A common pattern is to copy data from
the framework’s request object inside `preset.grafast.context`:

```ts title="graphile.config.ts"
export default {
  grafast: {
    async context(requestContext, args) {
      const req = requestContext.expressv4?.req;
      const pgSettings = {
        ...args.contextValue?.pgSettings,
      } as Record<string, string>;

      if (req?.user?.id) {
        pgSettings["myapp.user_id"] = String(req.user.id);
      }
      if (req?.user?.is_admin) {
        pgSettings["myapp.is_admin"] = "true";
      }

      return {
        ...args.contextValue,
        pgSettings,
      };
    },
  },
};
```

Inside PostgreSQL you can read these values with `current_setting`:

```sql
create function myapp.current_user_id() returns uuid as $$
  select nullif(current_setting('myapp.user_id', true), '')::uuid;
$$ language sql stable;
```

Apply the function (or the `current_setting` call directly) inside Row Level
Security policies to enforce your rules.

The [configuration docs](./config#pgsettings) contain more variations on this
pattern, including how to expose HTTP headers or other request metadata.

## Issuing JWTs from PostgreSQL

PostGraphile also has support for generating JWTs easily from inside your
PostgreSQL schema.

To do so we will take a composite type that you specify via
`preset.gather.pgJwtTypes`:

```js title="graphile.config.mjs"
export default {
  gather: {
    pgJwtTypes: "jwt_token",
  },
  //...
};
```

The value of this setting is a schema-name, type-name tuple. Whenever a value
of the type identified by this tuple is returned from a PostgreSQL function we
will instead sign it with your JWT secret and return it as a string JWT token
as part of your GraphQL response payload.

For example, you might define a composite type such as this in PostgreSQL:

```sql
create type my_public_schema.jwt_token as (
  role text,
  exp integer,
  person_id integer,
  is_admin boolean,
  username varchar
);
```

Then run PostGraphile with this configuration

```js title="graphile.config.mjs"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

export default {
  extends: [PostGraphileAmberPreset],
  gather: {
    // highlight-next-line
    pgJwtTypes: "my_public_schema.jwt_token",
  },
  schema: {
    // highlight-next-line
    pgJwtSecret: process.env.JWT_SECRET,
  },
};
```

And finally you might add a PostgreSQL function such as:

```sql {5}
create function my_public_schema.authenticate(
  email text,
  password text
)
returns my_public_schema.jwt_token
as $$
declare
  account my_private_schema.person_account;
begin
  select a.* into account
    from my_private_schema.person_account as a
    where a.email = authenticate.email;

  if account.password_hash = crypt(password, account.password_hash) then
    return (
      'person_role',
      extract(epoch from now() + interval '7 days'),
      account.person_id,
      account.is_admin,
      account.username
    )::my_public_schema.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;
```

Which would give you an `authenticate` mutation with which you can extract the
`jwtToken` from the response payload.

Remember that the resulting token will be verified by whichever middleware you
write (or by the `lazy-jwt` preset if you are still using it). Review the
[PostgreSQL JWT specification](./jwt-specification) to ensure the fields you
return map cleanly onto PostgreSQL session settings.

[rls-policies]: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
