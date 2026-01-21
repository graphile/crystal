---
title: Debugging
---

When something’s wrong with your app it can be hugely frustrating; so we want to
make it as easy as we can for you to get to the bottom of these issues! But
first, you need to figure out what type of issue you have...

## Something is wrong in a GraphQL request

### Check you’re requesting what you think you’re requesting

Often issues occur because your client code isn’t doing what you think it’s
doing. The first step here is to determine exactly what’s being sent over the
network. If you’re building a website you can easily use Google Chrome’s Network
Devtools to see exactly what’s being sent and received.

1.  Open your website in Chrome
2.  Right click, and select ‘Inspect’
3.  Select the ‘Network’ tab in the developer tools
4.  In the filter box, enter ‘/graphql’ (or whatever path you have configured
    your API to use)
5.  Ensure that ‘All’ is selected to the right of the filter box
6.  Trigger your GraphQL request (either by reloading the page or by clicking
    the relevant element on the screen)
7.  Review the network requests that have arrived to ensure they’re what you’d
    expect, that no variables are unexpectedly null, that the relevant access
    tokens are being set in the request headers, etc

### Try your query in Ruru or GraphiQL

It sometimes helps to try doing the same thing a different way, and this is
where Ruru (or any GraphiQL) comes in handy. Take the query you’re running and
execute it via Ruru. Is it producing the same issue? Note that you can set
headers in Ruru via the `Headers` tab at the bottom, where variables are
entered.

### Increase PostGraphile’s logging

GraphQL errors are masked by default and logged on the server, but if you
disable error masking then they will be sent through to the client and not
logged on the server - in which case you can use `preset.grafserv.maskError` to
output the error details on the server side (and to manipulate them before
they’re returned to the client).

:::warning[Errors impact your security stance]

The default implementation of `maskError` trims out a lot of
details for security reasons, if you replace it be sure that you are also being
cautious about what you’re outputting to potential attackers.

:::

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

:::tip[Use the `originalError` property]

GraphQLError instances have an `error.originalError` property that can be used
to retrieve the underlying error, this typically contains more actionable
information than the GraphQL error itself.

:::

### Viewing the generated SQL

Assuming that the error is coming from within the database, you can see what SQL
statements PostGraphile is generating.

#### Via Ruru ‘Explain’

One way to do so is via the “Explain” feature available in Ruru. To use this,
you must ensure that `preset.grafast.explain` is enabled in your configuration:

```js title="graphile.config.mjs"
export default {
  // ...
  grafast: {
    explain: true,
  },
};
```

:::warning[Disable Explain in production!]

Explain should be disabled in production since it could leak information about
the internals of your schema that would be useful to an attacker.

:::

Once enabled, visit Ruru (by default this will be at
http://localhost:5678/graphiql) and open the `Explain` tab on the left — the
icon looks like a magnifying glass 🔍. You should see the query that was
executed and the associated Gra*fast* operation plan, and from the dropdown you
can select the various SQL queries and their explain results.

:::info

Currently SQL `EXPLAIN` can only be enabled via `DEBUG` envvar. This is a known
issue that we plan to address.

<!-- TODO: fix this! -->

:::

#### Via `DEBUG` envvar

These examples assume you already have a `graphile.config.*` file in your
working directory. If you do not, add your connection details and preset via
CLI flags instead.

Another way is to set the relevant [DEBUG](https://github.com/visionmedia/debug)
environmental variable before running PostGraphile. For example:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="@dataplan/pg:PgExecutor:explain"
postgraphile

# Windows Console
set DEBUG=@dataplan/pg:PgExecutor:explain & postgraphile

# Windows PowerShell
$env:DEBUG='@dataplan/pg:PgExecutor:explain'; postgraphile
```

:::tip[Configuration is assumed]

The above examples assume you already have a `graphile.config.*` file in your
working directory. If you do not, add your connection details and preset via CLI
flags instead.

:::

<!--

TODO: restore greater debugability

To find details of any errors thrown whilst executing SQL, use:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="postgraphile:postgres,postgraphile:postgres:error"
postgraphile
  # or:
export DEBUG="postgraphile:postgres*"
postgraphile

# Windows Console
set DEBUG=postgraphile:postgres,postgraphile:postgres:error & postgraphile
  #or
set DEBUG=postgraphile:postgres* & postgraphile

# Windows PowerShell
$env:DEBUG = "postgraphile:postgres,postgraphile:postgres:error"; postgraphile
  #or
$env:DEBUG = "postgraphile:postgres*"; postgraphile
```

-->

## Something is in my GraphQL schema that shouldn't be

This could be for a number of reasons...

### Filtering database schemas

Be sure to only include the database schemas you wish to expose in your schemas
list. By default this is `public`.

### Hiding PostgreSQL extensions

By default, `PgRemoveExtensionResourcesPlugin` removes resources and codecs that
come from extensions from your
schema. Be sure it's enabled via `npx graphile config print plugins`.

### Hiding with permissions

`PgRBACPlugin` limits the contents of your schema to only those things the
introspecting user has access to. If you disabled this plugin, this omission
will not occur. Use `npx graphile config print plugins` to see what plugins you have
in your resolved configuration.

If you're connecting with the superuser or database owner role, then everything
is permitted! Ensure you're connecting with a user with minimal permissions -
see [creating roles in required
knowledge](./required-knowledge.md#creating-roles), and especially the
"authenticator" role which should be the role used in your connection string.

Maybe you didn't grant the permission correctly? Check out the `\dp+` command in
`psql` to see full permissions for a table.

### Hiding with smart tags

`@omit` only works with the V4 preset; people using the Amber preset only should
use `@behavior` instead.

When you add a behavior (including the behaviors that the V4 preset converts
`@omit` into), you can debug it - see [hiding with
behaviors](#hiding-with-behaviors).

### Hiding with behaviors

To debug your behavior, use the `npx graphile behavior debug` command; you'll
be asked to choose a scope:

- pgResource - somewhere you can `SELECT` data from: a table, function, view,
  materialized view, etc
- pgResourceUnique - a unique constraint on a table/materialized view
- pgCodec - represents scalars, ranges, enums, domains and composite types (no
  storage!)
- pgCodecAttrbute - represents an attribute (column) on a composite type
- pgCodecRelation - a relation between a codec and a resource
- pgRefDefinition - the definition of a `@ref`
- pgCodecRef - an applied `@ref`

Run the command again with the scope added (e.g. `npx graphile behavior debug
pgResource`) and you'll be greeted with a list of entities of that type.

Run the command again with the entity identifier added (e.g. `npx graphile
behavior debug pgResource users`) and you'll be told the final behavior string for
that entity, along with its derivation (which plugins added/removed which
behaviors). Note `__ApplyBehaviors_*__` is a workaround for the new behavior
system - it represents "multiplying" the `defaultBehaviors` with the available
behaviors - and `PgBasicsPlugin.schema.entityBehavior.*.override` is typically
the overrides that come from your smart tags (`@omit`, `@behavior`, etc).

## Something is not in my schema that should be

Kind of the inverse of the above, check:

- Are you listing the correct database schemas in your config?
- If the resource is coming from a PostgreSQL extension, either disable
  `PgRemoveExtensionResourcesPlugin` or override the behaviors on the relevant
  resource.
- If you're using `PgRBACPlugin` (enabled by default), check you've granted
  permissions to the relevant visitor role, and that the database connection
  role (the "authenticator" role) has been granted the relevant visitor role (even
  with `noinherit`).
- Check smart tags and behaviors - see `npx graphile behavior debug` (described
  above)
- If it's an "advanced" or non-core feature, check the relevant plugin is
  enabled (e.g. for advanced filtering, use
  `postgraphile-plugin-connection-filter`) - use
  `npx graphile config print plugins` to see what plugins you have
- If it's an accessor (a root level "finder" field), check you're using a constraint not an index (see below)
- If it's a relation, check for missing constraints or missing indexes (see below)

### Missing constraints

By default, PostGraphile only adds relations and accessors (a root level
"finder" field) to your schema based on database constraints.

For accessors, a unique index is not sufficient - an index is an optimization,
whereas a constraint is something you state will remain true about your data.
For example, for a `userByUsername: User` field, you would add a unique
**constraint** (not index):

```sql
alter table users
  add constraint uniq_users_username
    unique (username);
```

For relations, just naming the column with a convention is insufficient - we
could infer the wrong thing - so you must add a constraint to show the
relationship:

```sql
alter table posts
  add constraint fk_posts_author
    foreign key (author_id) references users (id);

create index on posts (author_id);
```

### Missing indexes

By default, PostGraphile does not add "reverse" relationships to the schema
unless there is a matching index - this is because without an index PostgreSQL
might have to do a table scan to find the matching records, which is incredibly
expensive.

To solve this, create an index that matches the relationship (including ensuring
the columns are in the same order); for example:

```sql
alter table posts
  add constraint fk_posts_author
    foreign key (organization_id, author_id) references users (organization_id, id);

create index on posts (organization_id, author_id);
```

:::

## Poor performance

If you have a well designed database schema, you should find PostGraphile's
performance to be stellar; however if you're new to database design then there
are a lot of potential sources for poor performance. Use the [Viewing the
generated SQL](#viewing-the-generated-sql) above, and then consider these
things:

- If the same query ran directly is much faster than when ran through
  PostGraphile, chances are your RLS policies have poor perfomance. This is by
  far the most common performance issue PostGraphile users face, but it's easy
  to fix.
- Fetch only what you render
- Indexes
- Functions
- Views
- Materialized views
- Plugins
- Complex filters

### RLS performance

See [Writing performant RLS
policies](./required-knowledge.md#writing-performant-rls-policies) in required
knowledge.

### Functions

See [Understanding function
performance](./functions.md#understanding-function-performance).

### Fetch only what you render

GraphQL is designed to fetch what you request - no more, no less.

#### Overfetching

Everything you fetch should be rendered almost immediately to the user. If
something you fetch is not to be shown to the user until an interaction occurs -
for example a click on the "next page" or "expand" or "details" button - then
that data should be fetched in a follow-up request.

Fetch everything you need for the current view in a single round-trip, but only
fetch what you _need_, not what you think might be needed in a few seconds time.

The most common causes of overfetching are:

- Lack of pagination
- Incorrect use of fragments

#### Pagination

If you tell GraphQL to fetch all your emails, but then you only render the first
25, then you're doing a poor job of telling GraphQL what you need. Every list
fetch should include pagination limits.

When you render page two of a collection, you should _NOT_ use the same query
again (since it may fetch ancilliary data that you don't need a second time),
instead use a new query that uses the same fragment:

```graphql
# Use this to render the main page
query MainPage {
  notifications {
    count
  }
  me {
    avatarUrl
    name
  }
  feedItems(first: 5) {
    ...FeedItems
  }
}

# When they click to view page two (or scroll down for infinite scroll), fetch
# the next set of feed items WITHOUT re-fetching ancilliary data
query MainPageMoreFeedItems($cursor: Cursor!) {
  feedItems(first: 5, after: $cursor) {
    ...FeedItems
  }
}

# The data requirements for feed items is shared between both queries
fragment FeedItems on FeedItemsConnection {
  nodes {
    title
    description
    author {
      name
      avatar
    }
  }
  pageInfo {
    hasNextPage
    endCursor
  }
}
```

#### Fragment usage

Fragments aren't to DRY up your code, they are instead to help you locate your
data requirements with the elements of your application that consume that data
(functions, React components, etc). The fragments for components being rendered
should then be combined into a single query that can be issued to the server,
ensuring that all of the data required by the components (and nothing more!) is
fetched.

For a great tutorial on this, see: [How to use fragments (they're not for
re-use!) by Janette Cheng of Meta](https://www.youtube.com/watch?v=gMCh8jRVMiQ).

## Other `DEBUG` envvars

We use a lot of DEBUG envvars for different parts of the system. Here’s some of
the ones you might care about:

- `graphile-build:warn` - details of “recoverable” errors that occurred during
  schema construction. Often include details of how to fix the issue.
- `graphile-build:SchemaBuilder` - this hook is useful for understanding the
  order in which hooks execute, and how hook executions can nest - a must for
  people getting started with graphile-build plugins
- `@dataplan/pg:PgExecutor` - details of the SQL queries being executed, their inputs, and their results
- `@dataplan/pg:PgExecutor:explain` - as above, but also their EXPLAIN results

To enable these DEBUG modes, join them with commas when setting a DEBUG envvar,
then run PostGraphile or your Node.js server in the same terminal:

```bash
# Bash (Linux, macOS, etc)
export DEBUG="graphile-build:warn,@dataplan/pg:*"
postgraphile

# Windows Console
set DEBUG=graphile-build:warn,@dataplan/pg:* & postgraphile

# Windows PowerShell
$env:DEBUG = "graphile-build:warn,@dataplan/pg:*"; postgraphile
```

## Something is wrong in PostGraphile

If you’re a plugin author, you think you’ve discovered an issue in PostGraphile,
or you just like seeing how things work, you can use the Chrome Debug tools to
debug the node process — add breakpoints, break on exceptions, and step through
code execution.

1.  Visit `chrome://inspect` in Google Chrome (we can’t hyperlink it for
    security reasons).
2.  Select ‘Open dedicated DevTools for Node’, a new devtools window should
    open - don’t close this!
3.  Run your server or PostGraphile via Node.js directly, in `--inspect` mode,
    e.g.:

```bash
# For globally installed PostGraphile:
node --inspect `which postgraphile` -c postgres://...

# or for locally installed PostGraphile:
node --inspect node_modules/.bin/postgraphile

# or, if you have your own Node.js app in `server.js`:
node --inspect server.js
```
