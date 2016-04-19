# PostGraphQL
*A GraphQL server created from reflection over a PostgreSQL schema.*

The strongly typed GraphQL data querying language is a revolutionary new way to interact with your server. Similar to how JSON very quickly overtook XML, GraphQL will likely take over REST. Why? Because GraphQL allows us to express our data in the exact same way we think about it.

The PostgreSQL database is the self acclaimed “world’s most advanced open source database” and even after 15 years that still rings true. PostgreSQL is the most feature rich SQL database available and provides an excellent public reflection API giving its users a lot of power over their data. And despite being 15 years old, the database still has frequent releases.

With PostGraphQL, you can access the power of PostgreSQL through a well designed GraphQL server. PostGraphQL uses PostgreSQL reflection APIs to automatically detect primary keys, relationships, types, comments, and more providing a GraphQL server that is highly intelligent about your data.

PostGraphQL holds a fundamental belief that a *well designed database schema should be all you need to serve well thought out APIs*. PostgreSQL already has amazing user management and relationship infrastructure, *why duplicate that logic* in a custom API? PostGraphQL is likely to provide a more performant and standards compliant GraphQL API then any created in house.

## Usage
```
postgraphql postgres://localhost:5432/mydb --schema forum --development
```

## Benefits
PostGraphQL uses the joint benefits of PostgreSQL and GraphQL to provide a number of key benefits.

### Automatic Relation Detection
Does your table’s `authorId` column reference another table? PostGraphQL knows and will give you a field for easily querying that reference.

A schema like:

```sql
create table post (
  id serial primary key,
  author_id int non null references user(id),
  headline text,
  body text,
  …
);
```

Can query relations like so:

```graphql
{
  postNodes {
    nodes {
      headline
      body
      author: userByAuthorId {
        name
      }
    }
  }
}
```

### Fully Documented APIs
Introspection of a GraphQL schema is powerful for developer tooling and one element of introspection is that every type in GraphQL has an associated `description` field. As PostgreSQL allows you to document your database objects, naturally PostGraphQL exposes these documentation comments through GraphQL.

Documenting PostgreSQL objects with the [`COMMENT`][1] command like so:

```sql
create table user (
  username text non null unique,
  …
);

comment on table user is 'A human user of the forum.';
comment on column user.username is 'A unique name selected by the user to represent them on our site.';
```

Will let you reflect on the schema and get the JSON below:

```graphql
{
  __type(name: "User") { … }
}
```

```json
{
  "__type": {
    "name": "User",
    "description": "A human user of the forum.",
    "fields": {
      "username": {
        "name": "username",
        "description": "A unique name selected by the user to represent them on our site."
      }
    }
  }
}
```

[1]: http://www.postgresql.org/docs/current/static/sql-comment.html

### UI for Development Comes Standard
[GraphiQL][1] is a great tool by Facebook to let you interactively explore your data. When development mode is enabled in PostGraphQL, the GraphiQL interface will be *automatically* displayed at your GraphQL endpoint.

Just navigate with your browser to the URL printed to your console after starting PostGraphQL and use GraphiQL with your data! Even if you don’t want to use GraphQL in your app, this is a great interface for working with any PostgreSQL database.

Just remember to use the `--development` when starting PostGraphQL!

[1]: https://github.com/graphql/graphiql

<!-- TODO: ### Cursor Based Pagination for Free -->

<!-- TODO: ### Relay Standards Compliant -->

<!-- TODO: ## Lock In -->
