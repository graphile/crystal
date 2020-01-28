<!--

==================== CONTRIBUTING INSTRUCTIONS ====================

We love PRs updating TROUBLESHOOTING.md with your own tips or improving those of others. Please follow the following best practices when adding new items:

1. Follow the formating convention described below.

2. Use neutral and respectful language, e.g. "You may sometimes meet an issue with ..." rather than "You may sometimes meet a really annoying issue with ..."

3. Be concise: describe the problem with precision, and add the solution details only when it is short (the solution should be a link when is too long, e.g. to a GitHub gist).

4. Cite the "motivation" in your PR. For example it might be from [postgraphile/issues](https://github.com/graphile/postgraphile/issues) or [stackoverflow](https://stackoverflow.com/search?q=postgraphile). This helps us gauge how common the issue is.


Format:
```
## subject group X
...

### problem Y1 at subject X
...

Details at ...

### problem Y2 at subject X
...

Details at ...
```

Thanks! 🙏

====================    END OF INSTRUCTIONS    ==================== 
-->

# Troubleshooting

To report or discuss details, [use the issues](https://github.com/graphile/postgraphile/issues). Pull requests to update this file with more troubleshooting tips are welcome.

## Installation

The basic installation procedure is described at [section Usage](README.md#usage).

### "EACCES: permission denied" on `npm install -g postgraphile`

See [this tutorial of "Installing global node modules"](<https://github.com/nodeschool/discussions/wiki/Installing-global-node-modules-(Linux-and-Mac)>).  
Details at [issue #495](https://github.com/graphile/postgraphile/issues/495).

## Using the command line `postgraphile`

See [usage](README.md#usage)

### "error: password authentication failed for user"

Please check your connection string (provided via the `-c` option) is valid. Example:

```
postgraphile -c postgres://postgres:postgres@localhost:5432/issn
```

If you believe the connection string to be valid, you can check it with the `psql` command line utility:

```
psql postgres://postgres:postgres@localhost:5432/issn
```

(Note this works with `postgres://` and `postgresql://` schemas, but not `pg://`)

If this is failing then your issue lies outside of PostGraphile - check your postgresql roles and grants.

Details at [issue #482](https://github.com/graphile/postgraphile/issues/482) and [issue #495](https://github.com/graphile/postgraphile/issues/495).

## Generated Schema

### Stored procedure / function not appearing

Check the following:

* return a named type (e.g. a scalar, table name or domain) - we don't currently support anonymous types
* query procedures must not return `VOID` (mutations can, however)
* mark it as `STABLE` if it's a query, or `VOLATILE` if it's a mutation
* it should be defined in one of the Postgres schemas you've told PostGraphile to introspect (via `postgraphile --schema`)

```sql
create function MY_SCHEMA.my_function() returns INTEGER as $$
  select 1;
$$ language sql STABLE;
```

Details at [issue #529](https://github.com/graphile/postgraphile/issues/529).



## Using JWTs

### Role not successfully changing with JWT

Check the following:

* If you're using postgraphile as a library with express, make sure that the ``jwtRole`` option is passed an ``array``, not a string, and that the list of strings in the array matches whatever enum type you have designated as a role in your ``jwt_token`` type in the schema.
* Make sure that any function that returns your ``jwt_token`` type returns the exact text string of your DB role that you want the token to identify 
* If you're using postgraphile as a libary, make sure that ``pgDefaultRole`` is also set to your role that any user will be assigned before providing an jwt

### Example

You should follow the tutorial for the full explanation here: https://github.com/graphile/postgraphile/blob/master/examples/forum/TUTORIAL.md

But here is the essential SQL you need to understand using JWTs.

```sql

-- roles
CREATE ROLE app_admin WITH LOGIN PASSWORD admin_pass;
CREATE ROLE app_anon;
CREATE ROLE app_user;

-- grants for roles
GRANT ALL PRIVILEGES ON DATABASE app to app_admin;
GRANT app_anon TO app_admin;
GRANT app_user TO app_user;

-- jwt type
CREATE TYPE app.jwt_token AS ENUM (
  role TEXT,
  user_id integer
);

-- from tutorial
CREATE OR REPLACE FUNCTION app.authenticate (
  username TEXT, 
  password TEXT
) RETURNS app.jwt_token AS $$
DECLARE
  account app_private.user;
BEGIN
  SELECT a.* INTO account
  FROM app_private.user AS a
  WHERE a.username = $1;

  IF account.password_hash = crypt(password, account.password_hash) then
    return ('app_user', account.user_id)::app.jwt_token;
  ELSE
    return null;
  END IF;
END
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;

-- some time later

GRANT EXECUTE ON FUNCTION app.authenticate(text, text) to app_anon, app_user;

```
