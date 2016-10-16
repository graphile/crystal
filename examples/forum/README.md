# PostGraphQL Forum Example
This directory contains an example PostgreSQL schema which will work with PostGraphQL. The schema used is contained in the `schema.sql` file and some sample data is contained in the `data.sql` file. A comprehensive tutorial on the decisions made in creating that schema may be found in `tutorial.md`.

When running the `schema.sql` file on your PostgreSQL database everything will be created in the `forum_example` schema.

## Installation
Somehow you need to download this directory, do it however you like but we’ll go over how to do it with git here.

```bash
$ git clone https://github.com/calebmer/postgraphql.git
$ cd postgraphql/examples/forum
```

## Running
Once you are in this directory and have checked to make sure Postgre is running on port 5432, run the following:

```bash
$ npm install -g postgraphql
$ psql -f schema.sql
$ psql -f data.sql
$ postgraphql --schema forum_example
```

This will run the SQL in `schema.sql` and `data.sql` on your default database and start PostGraphQL. Navigate to the URL printed in your console and you should see GraphiQL. Use it to navigate the generated documentation for the GraphQL server. The schema has been designed to support PostGraphQL authentication and authorization, read the tutorial for more information on how this works.

In some situations, you might need to change the `psql` and `postgraphql` commands to better reflect your database environment. For example, you might need to change `postgres://localhost:5432` to `postgres://user:pass@localhost:5432` if your database requires authentication.

## Sample queries
To get a post by its id:

```graphql
{
  postById(id: 3) {
    id
    headline
  }
}
```

To get a list of all posts:

```graphql
{
  allPosts {
    edges {
      node {
        id
        headline
      }
    }
  }
}
```
