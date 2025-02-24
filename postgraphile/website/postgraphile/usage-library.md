---
title: Library/middleware
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
server.on("error", (e) => {
  console.error(e);
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
server.on("error", () => {});
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

## Express Server With Postgraphile In a Single JavaScript File

### Steps to Create a Simple Express Server

Create a directory for the project and initialize the project

```bash
mkdir postgraphile_express
cd postgraphile_express
npm init -y
```

Install the required packages

```bash
npm install express postgraphile@beta
```

Create a `.env` file with the database connection string, database schema, and GRAPHILE_ENV set to start Postgraphile in development mode

```
DB_CONNECTION=postgres://[username]:[password]@localhost:5432/[database]
DB_SCHEMA=public
GRAPHILE_ENV=development
```

Create a server.js file

```JavaScript
/* server.js */
import express from 'express'
import { createServer } from 'node:http'
import { postgraphile } from 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'
import { grafserv } from 'postgraphile/grafserv/express/v4'

const preset = {
  extends: [
    PostGraphileAmberPreset
  ],
  pgServices: [
    makePgService({
      connectionString: process.env.DB_CONNECTION,
      schemas: [process.env.DB_SCHEMA || 'public'],
    }),
  ],
  grafast: {
    explain: true,
  },
}
;(async () => {
  const app = express()
  const server = createServer(app)
  server.on('error', (e) => {
    console.dir(e)
  })
  const pgl = postgraphile(preset)
  const serv = pgl.createServ(grafserv)
  await serv.addTo(app, server)
  server.listen(5050, () => {
    console.log('Server listening at http://localhost:5050')
  })
})()
```

The project is now complete, listing the project directory should show

```bash
server.js
.env
package.json
package-lock.json
node_modules
```

The `package.json` file should have the following content (with the versions of `express` and `postgraphile` being the most recent).

```json
{
  "name": "postgraphile_express",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.21.2",
    "postgraphile": "^5.0.0-beta.38"
  }
}
```

### Running The Server

To run the server from a command line we will used the `node` command, and pass in the environment variables stored in the `.env` file

```bash
node --env-file=./.env server.js
```

This will start a server at `http://localhost:5050`, opening the url in a browser will show a user interface where a GraphQL query can be entered, for example

```gql
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


## Express Server With Postgraphile Using TypeScript (Three TypeScript Files)

This example will have three files in a `src` directory, `server.ts`, `pgl.ts`, `graphile.config.ts`.  It will also show how to include the [`simple-inflection preset`](https://www.npmjs.com/package/@graphile/simplify-inflection), included as `PgSimplifyInflectionPreset` in `graphile.config.ts`

### Steps to Create a TypeScript Express Server

Create a directory for the project and initialize the project

```bash
mkdir postgraphile_express_typescript
cd postgraphile_express_typescript
npm init -y
```

#### Install the Required Packages

```bash
npm install express postgraphile@beta @graphile/simplify-inflection@beta
```
#### Create the TypeScript Files

In the `postgraphile_express_typescript` directory, create a src dirctory and create three TypeScript files in the src folder, `server.ts`, `pg.ts`, and `graphile.config.ts`

### `src/server.ts`

```TypeScript
/* src/server.ts */
import 'dotenv/config'
import { createServer } from 'node:http'
import express from 'express'
import { grafserv } from 'postgraphile/grafserv/express/v4'
import { pgl } from './pgl.js'

const app = express()
const server = createServer(app)
server.on('error', () => {})
const serv = pgl.createServ(grafserv)
serv.addTo(app, server).catch((e) => {
  console.error(e)
  process.exit(1)
})
server.listen(5050)

console.log('Server listening at http://localhost:5050')
```

### `src/pgl.ts`

```TypeScript
/* src/pgl.ts */
import preset from './graphile.config.js'
import { postgraphile } from 'postgraphile'

export const pgl = postgraphile(preset)
```

### `src/graphile.config.ts`

```TypeScript
/* src/graphile.config.ts */
import 'graphile-config'
import 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'
import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection'
import { PgManyToManyPreset } from '@graphile-contrib/pg-many-to-many'

const preset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    PgSimplifyInflectionPreset,
    PgManyToManyPreset,
  ],
  pgServices: [
    makePgService({
      connectionString: process.env.DB_CONNECTION,
      schemas: [process.env.DB_SCHEMA || 'public'],
    }),
  ],
  grafast: {
    explain: true,
  },
}

export default preset
```

### Create a `.env` File

In the `postgraphile_express_typescript` directory create a `.env` file with the database connection string, database schema, and GRAPHILE_ENV set to start Postgraphile in development mode

```
DB_CONNECTION=postgres://[username]:[password]@localhost:5432/[database]
DB_SCHEMA=public
GRAPHILE_ENV=development 
```

Replace `[username]` and `[password]` with the credentials for your PostgreSQL server.  Replace `[database]` with the name of your database



### Project Structure

The project structure should be

```
postgraphile_express_typescript/
  - src/
    - server.tsx
    - pgl.tsx
    - graphile.config.ts
  - .env
  - tsconfig.json
  - package.json
  - package-lock.json
  - node_modules/
```

### Create a `tsconfig.json` File

Create a `tsconfig.json` file with the following

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "baseUrl": "."
  }
}
```
### Contents of package.json

The package.json file should have the following (with the versions of `express`, `postgraphile`, and `simiplify-inflection` being the most recent).

```json
{
  "name": "simple_node_project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "NODE_OPTIONS='--loader ts-node/esm' node --no-warnings=ExperimentalWarning  src/server.ts"
  },
  "dependencies": {
    "@graphile-contrib/pg-many-to-many": "^2.0.0-beta.6",
    "@graphile/simplify-inflection": "^8.0.0-beta.6",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "postgraphile": "^5.0.0-beta.38"
  },
  "devDependencies": {
    "@eslint/js": "^9.20.0",
    "@tsconfig/node20": "^20.1.4",
    "@types/express": "^5.0.0",
    "@types/node": "^20.11.24",
    "eslint": "^9.20.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.24.1"
  }
}
```

### Running and Building

The `build`, `start`, and `dev` commands have been added.  To run in development mode enter `npm run dev` from the command line.

As is typical for node projects like this to build the project, which will create a `dist` directory, `npm run build`.  To start the project after building `npm run start`.

This will start a server at `http://localhost:5050`, opening the url in a browser will show a user interface where a GraphQL query can be entered, for example

```gql
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


