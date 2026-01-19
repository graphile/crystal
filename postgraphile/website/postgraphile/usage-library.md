---
title: Library/middleware
toc_max_heading_level: 4
---

# Using PostGraphile as a Library

Library mode is the most popular way of running PostGraphile; it gives more
power than using the CLI (see [CLI usage](./usage-cli)) because you can
leverage the capabilities and ecosystems of your chosen Node.js webserver
(Express, Koa, Fastify, etc), but is more fully featured than [Schema-only
Usage](./usage-schema).

## PostGraphile instance

Library mode is configured using a preset (see [Configuration](./config) for
the options) and returns a PostGraphile instance `pgl` which has various
methods you can use depending on what you're trying to do.

```js title="pgl.js"
import preset from "./graphile.config.js";
import { postgraphile } from "postgraphile";

// Our PostGraphile instance:
export const pgl = postgraphile(preset);
```

### `pgl.createServ(grafserv)`

[Grafserv][] supports a number of different servers in the JS ecosystem, you
should import the `grafserv` function from the relevant grafserv subpath:

```js
import { grafserv } from "postgraphile/grafserv/express/v4";
// OR: import { grafserv } from "postgraphile/grafserv/node";
// OR: import { grafserv } from "postgraphile/grafserv/koa/v2";
// OR: import { grafserv } from "postgraphile/grafserv/fastify/v4";
```

Then create your `serv` instance by passing this to the `pgl.createServ()`
method:

```js
const serv = pgl.createServ(grafserv);
```

This Grafserv instance (`serv`) can be mounted inside of your chosen server -
for instructions on how to do that, please see the relevant entry for your
server of choice in [the Grafserv
documentation](https://grafast.org/grafserv/); typically there's a
`serv.addTo(...)` method you can use.

Here's an example with Node's HTTP server:

```js title="example-node.js"
import { createServer } from "node:http";
import { grafserv } from "postgraphile/grafserv/node";
import { pgl } from "./pgl.js";

const serv = pgl.createServ(grafserv);

const server = createServer();
server.once("listening", () => {
  server.on("error", (e) => void console.error(e));
});

serv.addTo(server).catch((e) => {
  console.error(e);
  process.exit(1);
});

server.listen(5678);

console.log("Server listening at http://localhost:5678");
```

And an example for Express:

```js title="example-express.js"
import { createServer } from "node:http";
import express from "express";
import { grafserv } from "postgraphile/grafserv/express/v4";
import { pgl } from "./pgl.js";

const serv = pgl.createServ(grafserv);

const app = express();
const server = createServer(app);
server.once("listening", () => {
  server.on("error", (e) => void console.error(e));
});
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});
server.listen(5678);

console.log("Server listening at http://localhost:5678");
```

For information about using this `serv` instance with Connect, Express, Koa, Fastify,
Restify, or any other HTTP servers, please see the [Grafserv
documentation][grafserv].

### `pgl.getSchemaResult()`

Returns a promise to the schema result — an object containing:

- `schema` - the GraphQL schema
- `resolvedPreset` - the resolved preset

Note that this may change over time, e.g. in watch mode.

### `pgl.getSchema()`

Shortcut to `(await pgl.getSchemaResult()).schema` — a promise to the GraphQL
schema the instance represents (may change due to watch mode).

### `pgl.getResolvedPreset()`

Get the current resolved preset that PostGraphile is using. Synchronous.

### `pgl.release()`

Call this when you don't need the PostGraphile instance any more and it will
release any resources it holds (for example schema watching, etc).

[grafserv]: https://grafast.org/grafserv/

## Example 1: single JS file, express

In this example we'll set up a PostGraphile server using ExpressJS all in a
single JS file that we can run directly with `node`.

To start, create a directory for the project and initialize a Node.js project
in that folder:

```bash title="Create and initialize the project directory"
mkdir postgraphile_express
cd postgraphile_express
npm init -y
```

### Installing dependencies

Install the required packages:

```bash npm2yarn
npm install --save express postgraphile
```

### Environment variables

It's bad practice to store credentials directly into source code, so instead we
use an environment variable `DATABASE_URL` to to store the database connection
string.

Additionally, we want PostGraphile to behave slightly differently in
development versus production: in development we want better error messages and
easier to read SQL; whereas, in production, we don't want to reveal more
information to potential attackers than we need to, and we want to execute as
fast as possible. Since we're in development, we'll use the
`GRAPHILE_ENV=development` envvar to indicate this.

To save us from having to pass the environment variables every time we run the server,
we can add them to a convenient `.env` file:

```ini title=".env"
# Replace the contents of the square brackets with the details of your database
DATABASE_URL=postgres://[username]:[password]@[host]:[port]/[database]
GRAPHILE_ENV=development
```

Be sure to replace the square brackets with the relevant settings for your own
database connection!

Critically, we must ensure that this file is not tracked by git:

```bash title="Ensure the .env file is ignored by git"
echo .env >> .gitignore
```

### The code

Create a `server.js` file with the following contents:

```js title="server.js"
import express from "express";
import { createServer } from "node:http";
import { postgraphile } from "postgraphile";
import { grafserv } from "postgraphile/grafserv/express/v4";
import preset from "./graphile.config.js";

// Which port do we want to listen for requests on?
const PORT = 5050;

// Create our PostGraphile instance, `pgl`:
const pgl = postgraphile(preset);

// Create our PostGraphile grafserv instance, `serv`:
const serv = pgl.createServ(grafserv);

async function main() {
  // Create an express app:
  const app = express();

  // Create a Node HTTP server, and have the express app handle requests:
  const server = createServer(app);

  // If the server were to produce any errors after it has been successfully
  // set up, log them:
  server.once("listening", () => {
    server.on("error", (e) => void console.error(e));
  });

  // Mount our grafserv instance inside of the Express app, also passing the
  // reference to the Node.js server for use with websockets (for GraphQL
  // subscriptions):
  await serv.addTo(app, server);

  // Start listening for HTTP requests:
  server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

// Start the main process, exiting if an error occurs during setup.
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

The project is now complete, listing the project directory should show

```bash
postgraphile_express/
 ├── .env
 ├── .gitignore
 ├── node_modules/
 ├── package.json
 ├── package-lock.json
 └── server.js
```

Configure your project by setting some options in `package.json`:

```bash
# Delete things we're not configuring right now
npm pkg delete author license description keywords scripts main
# Don't allow publishing to npm
npm pkg set private=true --json
# Use ESModule syntax and set our start script
npm pkg set type=module scripts.start="node server.js"
```

The `package.json` file should now have content similar to the following (with
the versions of `express` and `postgraphile` being the most recent):

```json
{
  "name": "postgraphile_express",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.21.2",
    "postgraphile": "^5.0.0"
  },
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
```

To tidy up, let's make the following changes to the `package.json` file:

```diff
 {
   "name": "postgraphile_express",
   "version": "1.0.0",
-  "main": "index.js",
+  "private": true,
+  "type": "module",
   "scripts": {
+    "start": "node --env-file=./.env server.js",
     "test": "echo \"Error: no test specified\" && exit 1"
   },
-  "keywords": [],
-  "author": "",
-  "license": "ISC",
-  "description": "",
   "dependencies": {
     "express": "^4.21.2",
     "postgraphile": "^5.0.0"
   }
 }
```

The main things we've done here are:

- Remove the reference to a non-existant index.js file
- Mark the project as "private" such that we can't attempt to `npm publish` it to the npm repository
- Declare that `.js` files are ES modules, enabling the use of `import` statements
- Delete unnecessary metadata
- Add our `start` script, which runs the server contained in `server.js` using the `node` command, passing the environment variables stored in the `.env` file

### Running the server

Thanks to the `start` script we added above, running our server is as simple as:

```bash
npm start
```

Alternatively you can run the command from the start script directly:

```bash
node --env-file=./.env server.js
```

Either way, this will start a server at `http://localhost:5050`. Opening the
URL in a browser will show a user interface where a GraphQL query can be
entered. The following query is valid against any GraphQL schema and tells you
the fields that are available to be queried at the `Query` root:

```graphql
query {
  __schema {
    queryType {
      name
      fields {
        name
        description
      }
    }
  }
}
```

## Example 2: TypeScript project, express

To get the most out of PostGraphile (and the modern npm ecosystem in general),
you'll want to be running TypeScript. This will give you much better
auto-complete in your editor, type safety of your code, help with refactoring,
and so much more.

This example will have three files in a `src` directory: `graphile.config.ts`,
`pgl.ts` and `server.ts`. It will also demonstrate including the
[`simple-inflection
preset`](https://www.npmjs.com/package/@graphile/simplify-inflection), included
as `PgSimplifyInflectionPreset` in `graphile.config.ts`

To start, create a directory for the project and initialize a Node.js project
in that folder:

```bash title="Create and initialize the project directory"
mkdir postgraphile_express_typescript
cd postgraphile_express_typescript
npm init -y
```

You should also ensure you're running Node v24+ (Node v22 is also supported,
but does not include built-in type stripping; you may need to pass
`--experimental-strip-types` to Node if using v22).

```bash
# For nvm; other Node version managers exist.
echo 24 > .nvmrc
nvm use
```

### Installing dependencies

Install the required packages:

```bash npm2yarn
npm install --save express postgraphile @graphile/simplify-inflection
npm install --save-dev typescript @tsconfig/node24 @types/express @types/node
```

### Environment variables

As before, create a `.env` file containing your database connection string and
development/production environment setting:

```ini title=".env"
DATABASE_URL=postgres://[username]:[password]@[host]:[port]/[database]
GRAPHILE_ENV=development
```

And ensure that it is not tracked by git:

```bash title="Ensure the .env file is ignored by git"
echo .env >> .gitignore
```

### TypeScript configuration

Create a `tsconfig.json` file that extends from the relevant @tsconfig for your
Node.js major version; e.g. if you're using Node v24.0.0 that would be
[`@tsconfig/node24`](https://www.npmjs.com/package/@tsconfig/node24):

```json title="tsconfig.json"
{
  "extends": "@tsconfig/node24/tsconfig.json",
  "compilerOptions": {
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

### The code

In the `postgraphile_express_typescript` directory, create a `src` directory and
create three TypeScript files in the src folder: `graphile.config.ts`, `pgl.ts`
and `server.ts` with the contents shown below:

#### `src/graphile.config.ts`

```ts title="src/graphile.config.ts"
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset, PgSimplifyInflectionPreset],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ["public"],
    }),
  ],
  grafast: {
    explain: true,
  },
};

export default preset;
```

#### `src/pgl.ts`

```ts title="src/pgl.ts"
import { postgraphile } from "postgraphile";
import preset from "./graphile.config.ts";

export const pgl = postgraphile(preset);
```

:::note[Import from `.ts` along with `rewriteRelativeImportExtensions`]

With Node's new `--experimental-strip-types` flag (automatically enabled from
Node 24+), TypeScript syntax is removed so that the TS can be executed directly
as if it were JS. However, the files still need to be able to reference each
other. In the source code, that means referencing the `.ts` file; but when
TypeScript compiles the code for production the output will be `.js` files.

Fortunately, TypeScript has added the configuration option
`rewriteRelativeImportExtensions` to ensure that you can use `.ts` to reference
TypeScript files in your source code whilst still ensuring that these imports
are output as `.js` when compiled for production usage.

:::

#### `src/server.ts`

```ts title="src/server.ts"
import { createServer } from "node:http";
import express from "express";
import { grafserv } from "postgraphile/grafserv/express/v4";
import { pgl } from "./pgl.ts";

const serv = pgl.createServ(grafserv);

const app = express();
const server = createServer(app);
server.once("listening", () => {
  server.on("error", (e) => void console.error(e));
});
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});
server.listen(5050);

console.log("Server listening at http://localhost:5050");
```

### Contents of `package.json`

Configure `package.json` to fit our project

```bash
# Delete things we're not configuring right now
npm pkg delete author license description keywords scripts main
# Don't allow publishing to npm
npm pkg set private=true --json
# Use ESModule syntax and set some scripts
npm pkg set type=module scripts.start="node --env-file=./.env src/server.ts" scripts.build=tsc scripts.prod="node dist/server.js"
```

The `package.json` file should now have content similar to the following (likely
with different version numbers):

```diff title="package.json"
{
  "name": "simple_node_project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@graphile/simplify-inflection": "^8.0.0",
    "express": "^4.21.2",
    "postgraphile": "^5.0.0"
  },
  "devDependencies": {
    "@tsconfig/node24": "^24.0.0",
    "@types/express": "^5.0.0",
    "@types/node": "^24.0.0",
    "typescript": "^5.7.3"
  },
  "private": true,
  "scripts": {
    "start": "node --env-file=./.env src/server.ts",
    "build": "tsc",
    "prod": "node dist/server.js"
  }
}
```

Note that we have defined three scripts:

- `start` runs our source files directly using Node 24's type stripping
- `build` compiles our `src/*.ts` files to `dist/*.js` files to run in production
- `prod` runs the compiled `dist/*.js` files in production, and expects the environment variables to already be set in the environment rather than reading them from a file

### Project Structure

The project structure should be

```
postgraphile_express_typescript/
 ├── .env
 ├── .gitignore
 ├── .nvmrc
 ├── node_modules/
 ├── package.json
 ├── package-lock.json
 ├── src/
 │    ├── graphile.config.ts
 │    ├── pgl.ts
 │    └── server.ts
 └── tsconfig.json
```

### Development

In development, run `npm start` as before. This will run the source code
directly using Node's native type stripping feature. This will start a server
at `http://localhost:5050`, opening the url in a browser will show a user
interface where a GraphQL query can be entered, for example

```graphql
query {
  __schema {
    queryType {
      name
      fields {
        name
        description
      }
    }
  }
}
```

:::danger[Errors running `npm start`?]

If you get errors when running `npm start` it might be because you are not
running a sufficiently up to date version of Node.js, lacking the type stripping
features. If this is the case and you can't update to Node 24 for some reason,
you'll want to run TypeScript in watch mode (`yarn tsc --watch`) in one
terminal, and then execute the compiled JS code directly:
`node --env-file=./.env dist/server.js`.

:::

### Production

In production, we want to minimize overhead. To do so, we compile the
TypeScript to JavaScript up front by running the `yarn build` command. Then we
ship the resulting files (including the `dist/` folder) to production and we
run the `npm run prod` command which executes the compiled code directly.
