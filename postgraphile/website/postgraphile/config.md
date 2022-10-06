# Configuration

PostGraphile is configured through a `graphile-config` "preset." A preset is a
simple JS object that contains a combination of other presets, plugins, and
options for the various scopes.

Your preset will almost certainly need to extend an existing preset or presets,
and which preset(s) to extend depends on what you're looking for from
PostGraphile.

(TODO: expand here with different use cases and presets that support them.)

PostGraphile presets are named after crystals; the first preset available is
`postgraphile/presets/amber`, so you'll definitely want that. If you're coming
from PostGraphile V4 you may also want to make your own preset with the
`makeV4Preset()` factory - see the
[V4 migration docs](./migrating-from-v4/index.md) for more information.

## General structure

A preset is a plain JavaScript object, and every key in the preset is optional.
`{}` is a valid (but not very useful!) preset.

The value for the `extends` key, if specified, must be an array of other presets
your preset wishes to extend.

The value for the `plugins` key, if specified, must be an array of
`graphile-config` plugins that your preset wishes to make use of. Plugins must
always have unique names, and will be automatically de-duplicated by the system
if the same plugin is referenced in multiple presets.

The preset also accepts keys for each supported scope. `graphile-config` has no
native scopes, but different Graphile projects can register their own scopes,
for example `graphile-build` registers the `inflection`, `gather` and `schema`
scopes, and PostGraphile registers the `server` scope.

We highly recommend using TypeScript for dealing with your preset so that you
get auto-completion for the options available in each scope. It may be necessary
to add `import "postgraphile"` at the top of the configuration file so that
TypeScript imports all the available scopes.

Note that the schema build process in PostGraphile is:

- Synchronously build the inflectors via the "inflection" phase - inflectors are
  used throughout all other phases
- Asynchronously build the data sources by performing database introspection in
  the "gather" phase
- Synchronously build the GraphQL schema during the "schema" phase

```ts
// Only needed for TypeScript types support
import "postgraphile";

import amber from "postgraphile/presets/amber";
import { StreamDeferPlugin } from "graphile-build";

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [
    amber,
    /* Add more presets here */
  ],

  plugins: [
    /* Add plugins here, e.g. */
    StreamDeferPlugin,
  ],

  inflection: {
    /* options for the inflection system */
  },
  gather: {
    /* options for the gather phase */
  },
  schema: {
    /* options for the schema build phase */
  },
  server: {
    /* options for the server */
  },
};

export default preset;
```

## Inflection options

_(TypeScript type: `GraphileBuild.GraphileBuildInflectionOptions`)_

_None at this time._

## Gather options

_(TypeScript type: `GraphileBuild.GraphileBuildGatherOptions`)_

- `pgStrictFunctions: boolean` - if true, we'll treat all PostgreSQL function
  arguments that don't have defaults as being required (non-nullable)
- `pgJwtType: [string, string]` - the schema name and type name for the type in
  the database to convert into a JWT (equivalent to giving this type the
  behavior `"-table +jwt"`)
- `installWatchFixtures: boolean` - if not false and schema is in watch mode
  then we will attempt to install the "event triggers" into the database so that
  PostGraphile can be notified when your database changes

Deprecated options:

- `pgV4UseTableNameForNodeIdentifier: boolean` - if true, uses the table name
  instead of the type name in the Node identifier (highly discouraged because it
  significantly increases the risk of NodeID conflicts)

## Schema options

_(TypeScript type: `GraphileBuild.GraphileBuildSchemaOptions`)_

:::tip

Plugins may add additional options, please refer to your plugins' documentation
to determine the options that they offer.

:::

- `jsonScalarAsString: boolean` - if true, JSON values will be stringified
  rather than returned as "dynamic" objects.
- `nodeIdFieldName: string` - the name for the `id: ID` field; typically this is
  `id` but you may wish to set it to `_id` or `nodeId` to avoid conflicts with
  your `id` database columns
- `dontSwallowErrors: boolean` - if true, errors during the schema build process
  will throw rather than the system trying to recover from them. Recommended,
  but not enabled by default as it can be a barrier to entry to new users.
- `simpleCollections: 'only' | 'both' | 'omit'` - defaults to omit; changes the
  default behavior for collection generation
  - `only` - does not build Relay connections, instead just simple GraphQL lists
  - `omit` - does not build simple lists, instead builds Relay connections
    (recommended)
  - `both` - supplies both lists and connections, making your schema somewhat
    larger (not recommended)
- `pgJwtSecret`
- `pgJwtSignOptions`
- `pgUseCustomNetworkScalars: boolean` - if not false, adds the `CidrAddress`,
  `MacAddress` and similar types for PostgreSQL network scalars.
- `orderByNullsLast: boolean | undefined` - if true, orders such that nulls are
  always last; if false, orders such that nulls are always first; otherwise uses
  the default ordering
- `pgForbidSetofFunctionsToReturnNull: boolean` - if true, setof functions
  cannot return null, so our list and connection types can be non-nullable in
  more places.
- `subscriptions`

## Server options

_(TypeScript type: `import('postgraphile').ServerOptions`)_

- `port: number` - Port number to listen on (default: 5678)
- `host: string` - Host to listen on (default: '127.0.0.1'; consider setting to
  '0.0.0.0' in Docker and similar environments)
- `graphqlPath: string` - The path at which GraphQL will be available; usually
  `/graphql`
- `eventStreamRoute: string` - The path at which the GraphQL event stream would
  be made available; usually `/graphql/stream`
- `graphiql: boolean`
- `graphiqlOnGraphQLGET: boolean` - If true, then we will render GraphiQL on GET
  requests to the `/graphql` endpoint
- `graphiqlPath: string` - The path at which GraphiQL will be available; usually
  `/`
- `exposePlan: boolean` - If true, the mermaid diagram and SQL queries will be
  made available to clients
- `watch: boolean` - Set true to enable watch mode
- `maxRequestLength: number` - The length, in bytes, for the largest request
  body that the server will accept
