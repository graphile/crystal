# The Default Role
PostGraphQL makes full use of PostgreSQL roles, so in this article we will explain briefly how PostgreSQL roles and users work and how that relates to how we use them in PostGraphQL.

You can make any number of PostgreSQL roles with [`CREATE ROLE`](https://www.postgresql.org/docs/9.5/static/sql-createrole.html) command and assign permissions to those roles with the [`GRANT`](https://www.postgresql.org/docs/9.5/static/sql-grant.html) command. Permissions like select from the table `post` or insert rows into the `person` table.

PostgreSQL roles are also hierarchical. That is you can “grant” roles to other roles. For example if I had role `editor` which could change the data in our database and role `admin`, if I granted the `editor` role to `admin` with the command:

```sql
grant editor to admin;
```

Then the `admin` role would have the same permissions the `editor` role has. The `admin` role would also be able to *change* its role to the `editor` role. This means for the rest of the session you don’t have any `admin` permissions, but only permissions given to the `editor` role.

In PostgreSQL you also have the idea of a user. A user is just a role that can login. So for example, the following are equivalent as the create an `admin` role that can log in (or a user):

```sql
create role admin login;
create user admin;
```

…and the following are also equivalent as they create a role that *can’t* log in:

```sql
create role editor;
create role editor nologin;
```

“Logging in” just means we can use the role when authenticating in the PostgreSQL authentication section of the connection string. So with the above roles you could start a PostgreSQL connection with `postgres://admin@localhost:5432/mydb`, but not `postgres://editor@localhost:5432/mydb`.

## Roles in PostGraphQL
So how does this apply to PostGraphQL? PostGraphQL requires you to have at least one user (role that can log in) when connecting to the server. That role will be specified in your connection string and will from here on out be referred to as the `auth_user`. You’d connect with your `auth_user` as follows:

```bash
postgraphql postgres://auth_user@localhost:5432/mydb
```

The `auth_user` will have all the priveleges PostGraphQL might need.

You can also specify a `default_role` with PostGraphQL. The `default_role` will be used by PostGraphQL whenever no authorization token is provided or when the role claim in the authorization token is not specified. So all users that don’t explicitly specify a role will automatically use the `default_role`.

So the `default_role` should have restricted priveleges to only your data that is publicly accessible.

After that you could also specify more roles like a `user_role` which should be included in the payload of your authorization tokens which may have more or less permissions then `default_role`.

In order to configure an default role just do the following:

```bash
postgraphql postgres://auth_user@localhost:5432/mydb --default-role default_role
```
