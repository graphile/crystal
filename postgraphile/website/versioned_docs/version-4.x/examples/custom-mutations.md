---
sidebar_position: 7
---

# Custom mutations

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## Forgot password

```graphql
mutation {
  forgotPassword(input: { email: "benjie@example.com" }) {
    success
  }
}
```

Generated with SQL like this:

```sql
create function forgot_password(email text)
returns boolean
language plpgsql volatile
as $$
  ...
$$;
-- Optionally rename the result field:
comment on function
  forgot_password(email text)
  is '@resultFieldName success';

```

Result:

```json
{
  "forgotPassword": {
    "success": true
  }
}
```
