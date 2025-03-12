---
layout: page
path: /postgraphile/debugging/
title: Debugging
---

When something's wrong with your app it can be hugely frustrating; so we want to
make it as easy as we can for you to get to the bottom of these issues!

## Step 1: check you're requesting what you think you're requesting

Often issues occur because your client code isn't doing what you think it's
doing. The first step here is to determine exactly what's being sent over the
network. If you're building a website you can easily use Google Chrome's Network
Devtools to see exactly what's being sent and received.

1.  Open your website in Chrome
2.  Right click, and select 'Inspect'
3.  Select the 'Network' tab in the developer tools
4.  In the filter box, enter '/graphql' (or whatever path you have configured
    your API to use)
5.  Ensure that 'All' is selected to the right of the filter box
6.  Trigger your GraphQL request (either by reloading the page or by clicking
    the relevant element on the screen)
7.  Review the network requests that have arrived to ensure they're what you'd
    expect, that no variables are unexpectedly null, that the relevant access
    tokens are being set in the request headers, etc

## Step 2: try your query in Ruru or GraphiQL

It sometimes helps to try doing the same thing a different way, and this is
where Ruru (or any GraphiQL) comes in handy. Take the query you're running and
execute it via Ruru. Is it producing the same issue? Note that you can set
headers in Ruru via the `Headers` tab at the bottom, where variables are
entered.

## Step 3: increase PostGraphile's logging

Note that the errors are sent through to the GraphQL client (they're not output
on the server by default) so you'll need to reproduce this from your client so
you can see the output (or use a network inspector such as WireShark if
modifying the client is not an option). If you're using PostGraphile as a
library then you can use `preset.grafserv.maskError` to output the error
details on the server side (and to manipulate them before they're returned to
the client). The default implementation of `maskError` trims out a lot of
details for security reasons, if you replace it be sure that you are also being
cautious about what you're outputting to potential attackers.

```js title="graphile.config.mjs"
import { GraphQLError } from "postgraphile/graphql";
import { isSafeError } from "postgraphile/grafast";
import { createHash } from "node:crypto";

const sha1 = (text: string) =>
  createHash("sha1").update(text).digest("base64url");

export default {
  //...
  grafserv: {
    maskError(error) {
      console.error("maskError was called with the following error:");
      console.error(error);
      console.error("which had an originalError of:");
      console.error(error.originalError);

      // You probably don't want this level of debugging in production as the
      // results are sent to the client and it may leak implementation details
      // you wish to keep private.
      //
      //   return error;

      // Here's a more careful implementation:

      if (error.originalError instanceof GraphQLError) {
        return error;
      } else if (
        error.originalError != null &&
        isSafeError(error.originalError)
      ) {
        return new GraphQLError(
          error.originalError.message,
          error.nodes,
          error.source,
          error.positions,
          error.path,
          error.originalError,
          error.originalError.extensions ?? null,
        );
      } else {
        // Hash so that similar errors can easily be grouped
        const hash = sha1(String(error));
        console.error(`Masked GraphQL error (hash: '${hash}')`, error);
        return new GraphQLError(
          `An error occurred (logged with hash: '${hash}')`,
          error.nodes,
          error.source,
          error.positions,
          error.path,
          error.originalError,
          // Deliberately wipe the extensions
          {},
        );
      }
    },
  },
};
```

:::tip

GraphQLError instances have an `error.originalError` property that can be used
to retrieve the underlying error, this typically contains more actionable
information than the GraphQL error itself.

:::

## Step 4: viewing the generated SQL

Assuming that the error is coming from within the database, you can see what SQL
statements PostGraphile is generating.

### Via Ruru 'Explain'

One way to do so is via the "Explain" feature available in Ruru. To use this,
you must ensure that `preset.grafast.explain` is enabled in your configuration:

```js title="graphile.config.mjs"
export default {
  // ...
  grafast: {
    explain: true,
  },
};
```

:::warning

Explain should be disabled in production since it could leak information about
the internals of your schema that would be useful to an attacker.

:::

Once enabled, visit Ruru (by default this will be at
http://localhost:5678/graphiql) and open the `Explain` tab on the left - the
icon looks like a magnifying glass 🔍. You should see the query that was
executed and the associated Gra*fast* operation plan, and from the dropdown you
can select the various SQL queries and their explain results.

:::info

Currently SQL `EXPLAIN` can only be enabled via `DEBUG` envvar. This is a known
issue that should be fixed before the release of PostGraphile v5.0.0.

<!-- TODO: fix this! -->

:::

### Via `DEBUG` envvar

Another way is to set the relevant [DEBUG](https://github.com/visionmedia/debug)
environmental variable before running PostGraphile. For example:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="@dataplan/pg:PgExecutor:explain"
postgraphile -c postgres://...

# Windows Console
set DEBUG=@dataplan/pg:PgExecutor:explain & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG='@dataplan/pg:PgExecutor:explain'; postgraphile -c postgres://...
```

<!--

TODO: restore greater debugability

To find details of any errors thrown whilst executing SQL, use:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="postgraphile:postgres,postgraphile:postgres:error"
postgraphile -c postgres://...
  # or:
export DEBUG="postgraphile:postgres*"
postgraphile -c postgres://...

# Windows Console
set DEBUG=postgraphile:postgres,postgraphile:postgres:error & postgraphile -c postgres://...
  #or
set DEBUG=postgraphile:postgres* & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG = "postgraphile:postgres,postgraphile:postgres:error"; postgraphile -c postgres://...
  #or
$env:DEBUG = "postgraphile:postgres*"; postgraphile -c postgres://...
```

-->

## Other `DEBUG` envvars

We use a lot of DEBUG envvars for different parts of the system. Here's some of
the ones you might care about:

- `graphile-build:warn` - details of "recoverable" errors that occurred during
  schema construction. Often include details of how to fix the issue.
- `graphile-build:SchemaBuilder` - this hook is useful for understanding the
  order in which hooks execute, and how hook executions can nest - a must for
  people getting started with graphile-build plugins
- `@dataplan/pg:PgExecutor:verbose` - details of the SQL queries being executed, their inputs, and their results
- `@dataplan/pg:PgExecutor:explain` - as above, but also their EXPLAIN results

To enable these DEBUG modes, join them with commas when setting a DEBUG envvar,
then run PostGraphile or your Node.js server in the same terminal:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="graphile-build:warn,@dataplan/pg:*"
postgraphile -c postgres://...

# Windows Console
set DEBUG=graphile-build:warn,@dataplan/pg:* & postgraphile -c postgres://...

# Windows PowerShell
$env:DEBUG = "graphile-build:warn,@dataplan/pg:*"; postgraphile -c postgres://...
```

## Advanced: getting your hands dirty

If you're a plugin author, you think you've discovered an issue in PostGraphile,
or you just like seeing how things work, you can use the Chrome Debug tools to
debug the node process - add breakpoints, break on exceptions, and step through
code execution.

1.  Visit `chrome://inspect` in Google Chrome (we can't hyperlink it for
    security reasons).
2.  Select 'Open dedicated DevTools for Node', a new devtools window should
    open - don't close this!
3.  Run your server or PostGraphile via Node.js directly, in `--inspect` mode,
    e.g.:

```bash
# For globally installed PostGraphile:
node --inspect `which postgraphile` -c postgres://...

# or for locally installed PostGraphile:
node --inspect node_modules/.bin/postgraphile -c postgres://...

# or, if you have your own Node.js app in `server.js`:
node --inspect server.js
```
