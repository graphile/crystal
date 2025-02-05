---
layout: page
path: /postgraphile/deploying-gcp/
title: Deploying to GCP
---

_aka Google Cloud Platform (App Engine)_

_This post is a work in progress. Please see
[#161](https://github.com/graphile/graphile.github.io/issues/161) for notes._

### PostGraphile CLI and CloudSQL

_Section author: @redaikidoka_

Deploying PostGraphile with nothing more than command-line arguments to the
cloud to serve between PostgreSQL hosted in Google Cloud SQL and an Angular App
hosted in Google App Engine.

Need to use `cloud_sql_instances` to connect to the PostgreSQL instance, and set
the host and port in the command line.

Make sure you've got a project with your
[Cloud SQL PostgreSQL database](https://cloud.google.com/sql/docs/postgres/connect-app-engine),
with the Google Cloud Admin SQL turned on, and App Engine turned on. Reserve the
default service in App Engine for whatever your frontend is.

Example deployment file `app.yaml`:

```yaml
beta_settings:
  cloud_sql_instances: webstr-dev-######:us-central1:webstr-dev=tcp:5432

# [START runtime]
runtime: nodejs
env: flex
threadsafe: yes
service: wgraphile

manual_scaling:
  instances: 1
resources:
  cpu: .5
  memory_gb: .5
  disk_size_gb: 10

health_check:
  enable_health_check: False

# [END runtime]

handlers:
  - url: /(.*)
    static_files: ./\1
    upload: ./(.*)

#  settings to keep gcloud from uploading files not required for deployment
skip_files:
  - ^node_modules$
  - ^README\..*
  - ^package-lock.json
  - \.gitignore
  - \.es*
  - ^\.git$
  - ^errors\.log
```

Under `beta_settings`,
`cloud_sql_instances: webstr-dev-######:us-central1:webstr-dev=tcp:5432` tells
us that we are opening a unix pipe to a cloud instance in the GCP project, in
this case `webstr-dev-######` in 'central region 1', connecting to Cloud SQL
instance `websr-dev`.

- The `=tcp:5432` maps that unix socket to tcp port 5432.
- _I couldn't get using the unix port directly working, which is why the tcp
  port piece is in there_
- You can get the full instance name from your Cloud SQL Instance in the area of
  the Cloud SQL interface titled "Connect to this instance"

In `package.json` specify `postgraphile`, some project details, and the `start`
script. E.g.:

```json
{
  "name": "myprojectname",
  "version": "1.0.0",
  "scripts": {
    "start": "postgraphile --host --port 8080 --cors --enhance-graphiql --graphql / 0.0.0.0 -c postgres://user:password@172.17.0.1:5432/str_dev"
  },
  "engines": {
    "node": "^10.15",
    "npm": "^6.9"
  },
  "license": "ISC",
  "dependencies": {
    "postgraphile": "^4.4.5"
  }
}
```

**The project will end up at `https://[project-name].appspot.com/`**

- Your GraphQL endpoint will be that URL.
- You can access GraphiQL at `https://[project-name].appspot.com/graphiql`

Regarding the `start` command, the flags are:

- `--host 0.0.0.0` allows GAE's nginx to successfully bind to the service
- `--port 8080` binds to port 8080, which is a special port number that Google
  cloud will automatically expose via the service name, so you can access your
  PostGraphile service directly at **`https://[project-name].appspot.com/`**
- `--graphql /` puts the GraphQL endpoint at the root `/` (rather than
  `/graphql` as is the default)
- `--cors` circumvents annoying CORS nonsense

#### Deploying

I deployed the project with `gcloud`.

I used `gcloud init` to setup my connection to my Google Cloud project.

Then I used `gcloud app deploy` in this directory to push it up.

### Deploying an express app

_Section author: @garcianavalon_

GCP configuration:

```yaml
runtime: nodejs
env: flex

env_variables:
  PGUSER: "your-database-user"
  PGHOST: "/cloudsql/your-cloudsql-instance-connection-string"
  PGPASSWORD: "your-password"
  PGDATABASE: "your-database-name"

beta_settings:
  cloud_sql_instances: your-cloudsql-instance-connection-string
```

1. You will need `flexible` environment for websocket support (subscriptions and
   live queries). If you are not interested in real-time features you can use
   `standard` environment and save some bucks. In that case, remove the
   `beta_settings` section
1. This requires using postgraphile as a library. Minimum setup would be
   something like

```
/project
|--package.json
|--/src
   |--index.js
```

in package.json

```json
{
  "scripts": {
    "start": "node src/index.js"
  }
}
```

In index.js

```js
const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

// node-postgres Pool config (https://node-postgres.com/api/pool,
// https://node-postgres.com/api/client)
const pgConfig = {
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
};

// Your PostGraphile config:
// https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
const postgraphileOptions = {
  /* ... */
};
app.use(postgraphile(pgConfig, "public", postgraphileOptions));

app.listen(8080);
```

### PostgreSQL authorization with Google Cloud SQL

The `postgres` user on Google Cloud SQL is not a `superuser`, unlike the
Postgres user account you've likely been using in development. As such, if you
need it to be able to switch into a different role then you must grant that role
to the `postgres` user. For example, if you created the role `anonymous` in your
database, and you want the `postgres` role to be able to perform
`SET LOCAL role TO anonymous;` then you could run:

```sql
GRANT anonymous TO postgres;
```

### Helpful resources

See
https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/hello-world/flexible
for example Node.js project on GCP.

See information about configuring port forwarding:
https://cloud.google.com/appengine/docs/flexible/custom-runtimes/configuring-your-app-with-app-yaml
