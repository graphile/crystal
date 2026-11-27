# Migrating from V1 to V2

pg-introspection v2 introduced the `introspect` and
`introspectRaw`/`augmentIntrospectionData` patterns to replace the
`makeIntrospectionQuery` and `parseIntrospectionResults` functions. These legacy
functions are deprecated, but remain available; you must migrate to the new APIs
to make use of `onlyEntities`, `filters` and `multipass`.

To upgrade, replace:

```js
import {
  makeIntrospectionQuery,
  parseIntrospectionResults,
} from "pg-introspection";

const includeFromExtensions = false;
const text = makeIntrospectionQuery();
const { rows } = await pool.query(text);
const introspectionResults = rows[0].introspection;
const introspection = parseIntrospectionResults(
  introspectionResults,
  includeFromExtensions,
);
```

with:

```ts
import { introspect, pruneExtensionResources } from "pg-introspection";
import { runQuery } from "./runQuery.ts";

const includeFromExtensions = false;
const prune = includeFromExtensions ? null : pruneExtensionResources;
const options = { runQuery, prune };
const introspection = await introspect(options);
```

The required `runQuery` option is a reusable database adaptor. Define it once as
shown in [Usage](./index.md#runquery), then pass it in the options for every
`introspect` or `introspectRaw` call.

If you were caching the result of running `makeIntrospectionQuery` then use
the [raw data and caching pattern](./index.md#raw-data-and-caching) instead
of just `introspect`.
