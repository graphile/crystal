# PostGraphile

[![Package on npm](https://img.shields.io/npm/v/postgraphql.svg?style=flat)](https://www.npmjs.com/package/postgraphql)
[![Package on npm](https://img.shields.io/npm/v/postgraphql/next.svg?style=flat)](https://www.npmjs.com/package/postgraphile)
![MIT license](https://img.shields.io/npm/l/postgraphql.svg)
[![Gitter chat room](https://badges.gitter.im/postgraphql/postgraphql.svg)](https://gitter.im/postgraphql/postgraphql?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/benjie)
[![Follow](https://img.shields.io/badge/twitter-@benjie-blue.svg)](https://twitter.com/benjie)

# This is the ALPHA VERSION of PostGraphile v4 (previously known as PostGraphQL); use with caution and monitor [#506](https://github.com/postgraphql/postgraphql/pull/506)!

*A GraphQL schema created by reflection over a PostgreSQL schema.*

**Stable**: v3 ([`master`](https://github.com/postgraphql/postgraphql) branch) - maintenance only  
**Next**: v4 ([`postgraphile`](https://github.com/postgraphql/postgraphql/tree/postgraphile) branch) - PostGraphQL is being renamed PostGraphile with the launch of v4; see [graphile.org](https://graphile.org) for docs; see [#506](https://github.com/postgraphql/postgraphql/pull/506) for the low-down.

---

The strongly typed GraphQL data querying language is a revolutionary new way to interact with your server. Similar to how JSON very quickly overtook XML, GraphQL will likely take over REST. Why? Because GraphQL allows us to express our data in the exact same way we think about it.

The PostgreSQL database is the self acclaimed “world’s most advanced open source database” and even after 20 years that still rings true. PostgreSQL is the most feature rich SQL database available and provides an excellent public reflection API giving its users a lot of power over their data. And despite being 20 years old, the database still has frequent releases.

With PostGraphQL, you can access the power of PostgreSQL through a well designed GraphQL server. PostGraphQL uses PostgreSQL reflection APIs to automatically detect primary keys, relationships, types, comments, and more providing a GraphQL server that is highly intelligent about your data.

PostGraphQL holds a fundamental belief that a *well designed database schema should be all you need to serve well thought out APIs*. PostgreSQL already has amazing user management and relationship infrastructure, *why duplicate that logic* in a custom API? PostGraphQL is likely to provide a more performant and standards compliant GraphQL API then any created in house. Focus on your product and let PostGraphQL manage how the data gets to the product.

For a critical evaluation of PostGraphQL to determine if it fits in your tech stack, read [evaluating PostGraphQL for your project](https://www.graphile.org/postgraphile/evaluating/).

## Introduction
Watch a talk by the original author [Caleb](https://twitter.com/calebmer) at GraphQL Summit for a fast 7 minute introduction to using the PostGraphQL project. This was using v2; we're now up to v4 which has many more bells and whistles!

[![PostGraphQL at GraphQL Summit](https://img.youtube.com/vi/b3pwlCDy6vY/0.jpg)](https://www.youtube.com/watch?v=b3pwlCDy6vY)

## Usage
First install using npm:

```bash
npm install -g postgraphql@next
```

…and then just run it! By default, PostGraphQL will connect to your local database at `postgres://localhost:5432` and introspect the `public` schema.

```bash
postgraphql
```

For information about how to change these defaults, just run:

```bash
postgraphql --help
```

You can also use PostGraphQL as native HTTP, Connect, Express, or Koa middleware. Just import `postgraphql`:

```js
import { createServer } from 'http'
import postgraphql from 'postgraphql'

createServer(postgraphql())
```

For more information around using PostGraphQL as a library, and the options the API expects read the [library usage article](https://www.graphile.org/postgraphile/usage-library/).

There is also a docker image for running PostGraphQL maintained by @angelosarto, simply pass the same options to the docker container:

```bash
docker pull postgraphql/postgraphql
docker run postgraphql/postgraphql --help
```

To connect to a database and expose the PostGraphQL port try this:

```bash
docker run -p 5000:5000 postgraphql/postgraphql --connection postgres://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:POSTGRES_PORT/POSTGRES_DATABASE
```

Also make sure to check out the **[forum example][]** and especially **[step by step tutorial][]** for a demo of a PostGraphQL compliant schema and authentication.

[forum example]: https://github.com/calebmer/postgraphql/tree/master/examples/forum
[step by step tutorial]: https://github.com/calebmer/postgraphql/blob/master/examples/forum/TUTORIAL.md

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
  ...
);
```

Can query relations like so:

```graphql
{
  allPosts {
    edges {
      node {
        headline
        body
        author: userByAuthorId {
          name
        }
      }
    }
  }
}
```

### Custom Mutations and Computed Columns
Procedures in PostgreSQL are powerful for writing business logic in your database schema, and PostGraphQL allows you to access those procedures through a GraphQL interface. Create a custom mutation, write an advanced SQL query, or even extend your tables with computed columns! Procedures allow you to write logic for your app in SQL instead of in the client all while being accessible through the GraphQL interface.

So a search query could be written like this:

```sql
create function search_posts(search text) returns setof post as $$
  select *
  from post
  where
    headline ilike ('%' || search || '%') or
    body ilike ('%' || search || '%')
$$ language sql stable;
```

And queried through GraphQL like this:

```graphql
{
  searchPosts(search: "Hello world", first: 5) {
    pageInfo {
      hasNextPage
    }
    totalCount
    edges {
      cursor
      node {
        headline
        body
      }
    }
  }
}
```

For more information, check out our [procedure documentation][] and our [advanced queries documentation][].

[procedure documentation]: https://www.graphile.org/postgraphile/procedures/
[advanced queries documentation]: https://www.graphile.org/postgraphile/custom-queries/

### Advanced Watch Mode
Running PostGraphQL in watch mode will get you the best experience for iterating on a GraphQL API in the whole GraphQL ecosystem.

```
postgraphql --watch
```

PostGraphQL will watch your Postgres database for changes. New tables, updated columns, new procedures, and more! When these changes are detected PostGraphQL will re-create your schema and will automatically update any opened GraphiQL windows with the new schema while preserving your navigation state in the documentation viewer.

### Fully Documented APIs
Introspection of a GraphQL schema is powerful for developer tooling and one element of introspection is that every type in GraphQL has an associated `description` field. As PostgreSQL allows you to document your database objects, naturally PostGraphQL exposes these documentation comments through GraphQL.

Documenting PostgreSQL objects with the [`COMMENT`][sql-comment] command like so:

```sql
create table user (
  username text non null unique,
  ...
);

comment on table user is 'A human user of the forum.';
comment on column user.username is 'A unique name selected by the user to represent them on our site.';
```

Will let you reflect on the schema and get the JSON below:

```graphql
{
  __type(name: "User") { ... }
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

[sql-comment]: http://www.postgresql.org/docs/current/static/sql-comment.html

### UI For Development Comes Standard
[GraphiQL][graphiql] is a great tool by Facebook to let you interactively explore your data. When development mode is enabled in PostGraphQL, the GraphiQL interface will be *automatically* displayed at your GraphQL endpoint.

Just navigate with your browser to the URL printed to your console after starting PostGraphQL and use GraphiQL with your data! Even if you don’t want to use GraphQL in your app, this is a great interface for working with any PostgreSQL database.

[graphiql]: https://github.com/graphql/graphiql

### Token Based Authorization
PostGraphQL lets you use token based authentication with [JSON Web Tokens][jwt] (JWT) to secure your API. It doesn’t make sense to redefine your authentication in the API layer, instead just put your authorization logic in the database schema! With an advanced [grants][grants] system and [row level security][row-level-security], authorization in PostgreSQL is more than enough for your needs.

PostGraphQL follows the [PostgreSQL JSON Web Token Serialization Specification][pg-jwt-spec] for serializing JWTs to the database for your use in authorization. The `role` claim of your JWT will become your PostgreSQL role and all other claims can be found under the `jwt.claims` namespace (see [retrieving claims in PostgreSQL][retrieving-claims]).

To enable token based authorization use the `--secret <string>` command line argument with a secure string PostGraphQL will use to sign and verify tokens. And if you don’t want authorization, just don’t set the `--secret` argument and PostGraphQL will ignore all authorization information!

[jwt]: https://jwt.io
[grants]: http://www.postgresql.org/docs/current/static/sql-grant.html
[row-level-security]: http://www.postgresql.org/docs/current/static/ddl-rowsecurity.html
[pg-jwt-spec]: https://www.graphile.org/postgraphile/jwt-guide/
[retrieving-claims]: https://www.graphile.org/postgraphile/jwt-guide/#retrieving-claims-in-postgresql

### Cursor Based Pagination For Free
There are some problems with traditional limit/offset pagination and realtime data. For more information on such problems, read [this article][pagination-for-graphql].

PostGraphQL not only provides limit/offset pagination, but it also provides cursor based pagination ordering on the column of your choice. Never again skip an item with free cursor based pagination!

[pagination-for-graphql]: https://medium.com/apollo-stack/understanding-pagination-rest-graphql-and-relay-b10f835549e7#.8ehp4qwsq

### Relay Specification Compliant
You don’t have to use GraphQL with React and Relay, but if you are, PostGraphQL implements the brilliant Relay specifications for GraphQL. Even if you are not using Relay your project will benefit from having these strong, well thought out specifications implemented by PostGraphQL.

The specific specs PostGraphQL implements are:

- [Global Object Identification Specification.](http://facebook.github.io/relay/graphql/objectidentification.htm)
- [Cursor Connections Specification.](http://facebook.github.io/relay/graphql/connections.htm)
- [Input Object Mutations Specification.](http://facebook.github.io/relay/graphql/mutations.htm)

* * *

## Documentation
- [Using PostGraphQL as Express, Connect, or Koa middleware.](https://www.graphile.org/postgraphile/usage-library/)
- [Adding advanced queries to PostGraphQL.](https://www.graphile.org/postgraphile/custom-queries/)
- [Using PostgreSQL functions to extend your PostGraphQL schema.](https://www.graphile.org/postgraphile/procedures/)
- [A crash course in PostgreSQL roles for PostGraphQL.](https://www.graphile.org/postgraphile/default-role/)


[user-management]: http://www.postgresql.org/docs/current/static/user-manag.html
[row-level-security]: http://www.postgresql.org/docs/current/static/ddl-rowsecurity.html
[pg-views]: http://www.postgresql.org/docs/current/static/sql-createview.html
[pg-udpatable-views]: http://www.postgresql.org/docs/current/static/sql-createview.html#SQL-CREATEVIEW-UPDATABLE-VIEWS
[js-in-pg]: https://blog.heroku.com/archives/2013/6/5/javascript_in_your_postgres
[ruby-in-pg]: https://github.com/knu/postgresql-plruby
[pg-notify]: http://www.postgresql.org/docs/current/static/sql-notify.html
[node-pg-notify]: https://www.npmjs.com/package/pg-pubsub

* * *

## Contributing
Want to help testing and developing PostGraphQL? Check out the [contributing document](CONTRIBUTING.md) to get started quickly!

## Maintenance
The maintainer of this project is [Benjie Gillam](https://twitter.com/benjie) - follow him on Twitter!

## Thanks
Thanks so much to the people working on [PostgREST](https://github.com/begriffs/postgrest) which was definitely a huge inspiration for this project!

A humongous, heart-felt, thank you to the original author of PostGraphQL - [Caleb Meredith](https://twitter.com/calebmer) - for everything he put into PostGraphQL! He's now graduated from the project and we all wish him the best for his future ventures!

Even more thanks to each and every [sponsor](SPONSORS.md) of the project - without their help progress would be a lot slower! Please join them in supporting this project 🙏

Thanks and enjoy 👍
