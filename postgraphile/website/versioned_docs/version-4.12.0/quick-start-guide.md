---
layout: page
path: /postgraphile/quick-start-guide/
title: Quick Start Guide
---

This quick start guide will walk you through spinning up your first PostGraphile
server, including installing the prerequisites such as Node and PostgreSQL.

### Table of Contents

- [Install Node](#install-node)
- [Install PostgreSQL](#install-postgresql)
- [Create a Database](#create-a-database)
- [Install PostGraphile](#install-postgraphile)

### Install Node

You need to be running Node.js v8.6 or higher to run PostGraphile. You can check
your current version of Node by running `node --version`. If you're running a
recent version you can skip this section.

There's many ways of installing node; if you're on macOS you might prefer
installing with [homebrew](https://brew.sh/) via `brew install node`; if you're
on a unix-based system you might like to
[use the `nvm` tool](https://github.com/creationix/nvm). Failing these, if
you're using OS X or Windows, use one of the installers from the
[Node.js download page](https://nodejs.org/en/download/). Make sure you select
the version labelled LTS. Linux users can scroll down the page and find the
version that works with their system.

Once installed run `node -v` in a terminal to check your version. It must be
8.6.0 or higher.

### Install PostgreSQL

We need a PostgreSQL database to connect to. You can skip this section if you
already have PostgreSQL version `9.6.0` or higher installed.

PostgreSQL does not need to be installed on the same machine, but you'll have a
better development experience if it is. Try and minimise database connection
latency! If you do not use a local PostgreSQL server then you'll need to modify
the commands that follow to account for this.

If you are running on macOS, it is recommended that you install and use
[PostgreSQL.app](http://postgresapp.com/). If you are on another platform, go to
the [PostgreSQL download page](https://www.postgresql.org/download/) to pick up
a copy of PostgreSQL. We recommend using a version of PostgreSQL higher than
`9.6.0`. You can read more about the reasoning behind this requirement
[in our documentation](./requirements/).

After that, make sure your copy of PostgreSQL is running locally by running
`psql postgres:///` in a terminal (the three slashes is deliberate - we're
deliberately not specifying a host so it uses the defaults of hostname:
localhost, port: 5432).

If you get something like this returned then PostgreSQL is successfully
installed:

```bash
$ psql "postgres:///"

psql: FATAL:  database "username" does not exist
```

however, if you receive a "Connection refused" error then that indicates your
PostgreSQL server is not running, or not reachable:

```bash
$ psql "postgres:///"

psql: could not connect to server: Connection refused
```

If you want to connect to a different database within PostgreSQL, just add the
database name to the end of the connection string:

```bash
$ psql postgres:///testdb # Connects to the `testdb` database on your local machine
$ psql "postgres://user:password@somehost:2345/somedb"  # Connects to the `somedb` database at `postgres://somehost:2345` using login with `user` and `password`
```

Read the documentation on
[PostgreSQL connection strings](https://www.postgresql.org/docs/current/static/libpq-connect.html#LIBPQ-CONNSTRING)
to learn more about alternative formats (including using a password).

### Create a Database

Next, create a database. You can do this by using the terminal:

```
$ createdb mydb
```

This will create a PostgreSQL database called "mydb". You can read more about
this on the
[PostgreSQL Documentation site](https://www.postgresql.org/docs/current/static/tutorial-createdb.html).
Now you can run `psql` with your database URL and get a SQL prompt:

```bash
$ psql "postgres:///mydb"

psql (9.6.*)
Type "help" for help.

=#
```

Run the following query to make sure things are working smoothly:

```
=# select 1 + 1 as two;
 two
-----
   2
(1 row)

=#
```

### Install PostGraphile

It is easy to install PostGraphile with
[npm](https://docs.npmjs.com/getting-started/installing-node):

```
$ npm install -g postgraphile
```

> **NOTE**: _we do not recommend installing PostGraphile globally (with the `-g`
> flag to `npm` used here) - local installs are preferred. However, if you're
> just getting started with Node.js then using the global install method is much
> simpler. Once you start wanting to use plugins with PostGraphile we recommend
> you move to using a local install._

To run PostGraphile, you’ll use the same URL that you used for `psql` with the
database name added:

```bash
# Connect to the `mydb` database within the local PostgreSQL server
$ postgraphile -c "postgres:///mydb"

# Connect to a database that requires SSL/TLS
$ postgraphile -c "postgres://securehost:5432/db?ssl=true"

# Connect to the `somedb` database within the PostgreSQL at somehost port 2345
$ postgraphile -c "postgres://somehost:2345/somedb"
```

You can also run PostGraphile with the watch flag:

```bash
$ postgraphile -c "postgres:///mydb" --watch
```

With the `--watch` flag, PostGraphile will automatically update your GraphQL API
whenever the PostgreSQL schemas you are introspecting change.

Running PostGraphile will give you two endpoints:

```
  ‣ GraphQL endpoint served at http://localhost:5000/graphql
  ‣ GraphiQL endpoint served at http://localhost:5000/graphiql
```

The first endpoint is for your application to talk to; the second endpoint can
be opened in a web browser to give you access to your database through
`GraphiQL` - [a visual GraphQL explorer](https://github.com/graphql/graphiql).

Well done — you've got PostGraphile up and running!
