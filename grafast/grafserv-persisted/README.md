# @grafserv/persisted

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/@grafserv/persisted.svg?style=flat)](https://www.npmjs.com/package/@grafserv/persisted)
![MIT license](https://img.shields.io/npm/l/@grafserv/persisted.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

Persisted operations (aka "persisted queries", "query allowlist", "persisted
documents") support for [Grafserv](https://grafast.org/grafserv). Applies to
both standard GET and POST requests and to websocket connections. Works for all
operation types (queries, mutations and subscriptions).

We recommend that all GraphQL servers (PostGraphile or otherwise) that only
intend first party clients to use the GraphQL schema should use persisted
operations to mitigate attacks against the GraphQL API and to help track the
fields that have been used. This package is our solution for Grafserv, for other
servers you will need different software.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://qwick.com/"><img src="https://graphile.org/images/sponsors/qwick.png" width="90" height="90" alt="Qwick" /><br />Qwick</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
</tr><tr>
<td align="center"><a href=""><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
<td align="center"><a href="https://www.accenture.com/"><img src="https://graphile.org/images/sponsors/accenture.svg" width="90" height="90" alt="Accenture" /><br />Accenture</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Installation

```sh
yarn add @grafserv/persisted
# or: npm install --save @grafserv/persisted
```

## Usage

Import `PersistedPlugin` from `@grafserv/persisted` and then add it to the
`plugins` list in your `graphile.config.ts` (or equivalent) file:

```ts
import "graphile-config";
import PersistedPlugin from "@grafserv/persisted";

const preset: GraphileConfig.Preset = {
  plugins: [PersistedPlugin],
  grafserv: {
    /* add configuration options here, e.g. */
    persistedOperationsDirectory: `${process.cwd()}/.persisted_operations`,
  },
};

export default preset;
```

### Options

This plugin adds the following options to the Grafserv options:

````ts
/**
 * This function will be passed a GraphQL request object (normally
 * `{query: string, variables?: any, operationName?: string, extensions?: any}`,
 * but in the case of persisted operations it likely won't have a `query`
 * property), and must extract the hash to use to identify the persisted
 * operation. For Apollo Client, this might be something like:
 * `request?.extensions?.persistedQuery?.sha256Hash`; for Relay something
 * like: `request?.documentId`.
 */
hashFromPayload?(request: ParsedGraphQLBody): string | undefined;

/**
 * We can read persisted operations from a folder (they must be named
 * `<hash>.graphql`). When used in this way, the first request for a hash
 * will read the file, and then the result will be cached such that the
 * **filesystem read** will only impact the first use of that hash. We
 * periodically scan the folder for new files, requests for hashes that
 * were not present in our last scan of the folder will be rejected to
 * mitigate denial of service attacks asking for non-existent hashes.
 */
persistedOperationsDirectory?: string;

/**
 * An optional string-string key-value object defining the persisted
 * operations, where the keys are the hashes, and the values are the
 * operation document strings to use.
 */
persistedOperations?: { [hash: string]: string };

/**
 * If your known persisted operations may change over time, or you'd rather
 * load them on demand, you may supply this function. Note this function is
 * **performance critical** so you should use caching to improve
 * performance of any follow-up requests for the same hash.
 */
persistedOperationsGetter?: PersistedOperationGetter;

/**
 * There are situations where you may want to allow arbitrary operations
 * (for example using GraphiQL in development, or allowing an admin to
 * make arbitrary requests in production) whilst enforcing Persisted
 * Operations for the application and non-admin users. This function
 * allows you to determine under which circumstances persisted operations
 * may be bypassed.
 *
 * IMPORTANT: this function must not throw!
 *
 * @example
 *
 * ```
 * app.use(postgraphile(DATABASE_URL, SCHEMAS, {
 *   allowUnpersistedOperation(event) {
 *     return process.env.NODE_ENV === "development" && event.request?.getHeader('referer')?.endsWith("/graphiql");
 *   }
 * });
 * ```
 */
allowUnpersistedOperation?:
  | boolean
  | ((event: ProcessGraphQLRequestBodyEvent) => boolean);
````

All these options are optional; but you should specify exactly one of
`persistedOperationsDirectory`, `persistedOperations` or
`persistedOperationsGetter` for this plugin to be useful.

## Generating Persisted Operations

### Relay

Relay has built-in support for persisted operations:

https://relay.dev/docs/guides/persisted-queries/

Pass `--persist-output ./path/to/server.json` to `relay-compiler` along with
your normal options to have it generate the persisted operations file. You can
then use the `addToPersistedOperations.js` script below to split this operations
JSON file into one file per query that can be passed to
`--persisted-operations-directory`.

Then in your network config (`fetchQuery` function) you need to change the
`query: operation.text` to `documentId: operation.id`
[as shown in the relay docs](https://relay.dev/docs/guides/persisted-queries/#network-layer-changes).

### GraphQL-Code-Generator

For everything except Relay, we recommend that you generate persisted operations
when you build your clients using the awesome
[graphql-code-generator](https://github.com/dotansimha/graphql-code-generator)
project and the
[graphql-codegen-persisted-query-ids](https://www.npmjs.com/package/graphql-codegen-persisted-query-ids)
(tested with v0.1.2) plugin. A config might look like:

```yaml
schema: "schema.graphql"
documents: "src/**/*.graphql"
hooks:
  afterAllFileWrite:
    - node addToPersistedOperations.js
generates:
  client.json:
    plugins:
      - graphql-codegen-persisted-query-ids:
          output: client
          algorithm: sha256
  server.json:
    plugins:
      - graphql-codegen-persisted-query-ids:
          output: server
          algorithm: sha256
```

We also recommend using the file `addToPersistedOperations.js` to write the
`server.json` file contents out to separate GraphQL files every time the code is
built for easier version control:

```js
// addToPersistedOperations.js
const map = require("./server.json");
const { promises: fsp } = require("fs");

async function main() {
  await Promise.all(
    Object.entries(map).map(([hash, query]) =>
      fsp.writeFile(
        `${__dirname}/.persisted_operations/${hash}.graphql`,
        query,
      ),
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Then you pass the `.persisted_operations` folder via the
`persistedOperationsDirectory` option as shown in the usage example.

#### Apollo Client

You can configure Apollo Client to send the persisted operations generated by
`graphql-codegen` with `apollo-link-persisted-queries`:

```ts
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { usePregeneratedHashes as withPregeneratedHashes } from "graphql-codegen-persisted-query-ids/lib/apollo";
import { hashes } from "./path/to/client.json";

const persistedLink = createPersistedQueryLink({
  useGETForHashedQueries: false,
  generateHash: withPregeneratedHashes(hashes),
  disable: () => false,
});

// ...

const client = new ApolloClient({
  link: ApolloLink.from([persistedLink, httpLink]),
  // ...
});
```
