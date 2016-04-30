> This specification was authored for use in the PostGraphQL project. However, this document would be more useful as a general specification for anyone using PostgreSQL. The language of the specification is meant to be generally applicable and adoptable by any who might want to use it.
>
> The PostGraphQL team is looking for a maintainer for this specification so it may become an independently owned community run specification instead of a PostGraphQL one.

# PostgreSQL JSON Web Token Serialization Specification
This specification aims to define a standard way to serialize [JSON Web Tokens][jwt] (JWT, [RFC 7519][rfc7519]) to a PostgreSQL database for developers who want to move authentication logic into their PostgreSQL schema.

[Terminology][jwt-terms] from the JSON Web Token specification will be used.

After a JSON Web Token has been verified and decoded, the resulting claims will be serialized to the PostgreSQL database in two ways:

1. Using the `role` claim, the corresponding role will be set in the database using [`SET ROLE`][set-role]:

   ```sql
   set local role $role;
   ```

   Where `$role` is the claim value for the `role` claim. It is not an error if the `role` claim is not set.

2. All remaining claims will be set using the [`SET`][set] command under the `jwt.claims` namespace. Using:

   ```sql
   set local jwt.claims.$claim_name to $claim_value;
   ```

   Will be run for every claim including registered claims like `iss`, `sub`, and the claim specified 1 (`role`). `$claim_name` is the name of the claim and `$claim_value` is the associated value.

## Example
A JSON Web Token with the following claims:

```json
{
  "sub": "postgraphql",
  "role": "user",
  "user_id": 2
}
```

Would result in the following SQL being run:

```sql
set local role user;
set local jwt.claims.sub to 'postgraphql';
set local jwt.claims.role to 'user';
set local jwt.claims.user_id to 2;
```

## A Note on `local`
Using `local` for [`SET`][set] and [`SET ROLE`][set-role] is not required, however it is recommended. This is so that every transaction block (beginning with `BEGIN` and ending with `COMMIT` or `ROLLBACK`) will have its own local parameters. See the following demonstration:

```sql
begin;
set local jwt.claims.user_id to 2;

-- Has access to `jwt.claims.user_id`
commit;

-- Does not have access to `jwt.claims.user_id`
```

## Retrieving Claims in PostgreSQL
In order to retrieve a claim set by the serialization of a JSON Web Token as defined in this spec, either the `current_setting` function or the [`SHOW`][show] command may be used like so:

```sql
select current_setting('jwt.claims.user_id');
-- Or…
show jwt.claims.user_id;
```

[jwt]: https://jwt.io/
[rfc7519]: https://tools.ietf.org/html/rfc7519
[jwt-terms]: https://tools.ietf.org/html/rfc7519#section-2
[set-role]: http://www.postgresql.org/docs/current/static/sql-set-role.html
[set]: http://www.postgresql.org/docs/current/static/sql-set.html
[show]: http://www.postgresql.org/docs/current/static/sql-show.html
