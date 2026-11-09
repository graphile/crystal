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
import { introspection, pruneExtensionResources } from "pg-introspection";

const includeFromExtensions = false;
const prune = includeFromExtensions ? null : pruneExtensionResources;
const options = { runQuery, prune };
const introspection = await introspect(options);
```

Where `runQuery` is the function used to execute the SQL using your chosen
driver:

```ts
async function runQuery(text, values) {
  const { rows } = await pool.query(text, values);
  return rows[0].introspection;
}
```

If you were caching the result of running `makeIntrospectionQuery` then use
the `introspectRaw`/`augmentIntrospectionData` pattern documented above instead
of just `introspect`.
