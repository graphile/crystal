# PostGraphQL Forum Example
This directory contains an example PostgreSQL schema which will work with PostGraphQL. The schema used is contained in the `schema.sql` file, if you want to take a look it is well documented.

When running the `schema.sql` file on your PostgreSQL database everything will be created in the `forum_example` schema.

## Installation
Somehow you need to download this directory, do it however you like but we’ll go over how to do it with git here.

```bash
git clone https://github.com/calebmer/postgraphql.git
cd postgraphql/examples/forum
```

## Running
Once you are in this directory and have checked to make sure PostgreSQL is running on port 5432, run the following:

```bash
npm install
npm run schema-up
postgraphql postgres://localhost:5432 --schema forum_example --development
```

This will run the SQL in `schema.sql` on your default database and start PostGraphQL. Navigate to the URL printed in your console and you should see GraphiQL. Use it to navigate the generated documentation for the GraphQL server.
