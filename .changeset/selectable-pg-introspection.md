---
"pg-introspection": minor
---

NEW! Use `introspect` and `introspectRaw` to run introspection using a supplied
database query callback, rather than building the query and running it yourself.
`introspect` returns full introspection results (including navigation helpers);
`introspectRaw` returns plain introspection data, which can be passed to
`augmentIntrospectionData` separately (passing the same options). The latter is
useful when caching results: clone cached data before augmentation.

NEW! The `onlyEntities` option (experimental) allows you to select catalog
collections, including additional PostgreSQL collections such as settings,
triggers and foreign servers. Some collections require others to be selected; an
error will be reported when a required collection was not included.

NEW! Multipass introspection (opt-in with `multipass: { policies: [...] }`)
allows pg-introspection to minimize the amount of data it pulls from the
database to just the parts you're interested in, significantly reducing memory
usage. Supports configurable discovery policies, role-based filtering,
entrypoint filters and pruning. See the
[multipass guide](https://star.graphile.org/pg-introspection/multipass).

NEW! Top-level `filters` accepts trusted SQL predicates keyed by collection.
These apply to the single introspection query or, with multipass enabled, to
every discovery and dependency query.

NEW! Top-level `prune` removes unwanted raw objects after fetching in either
single-pass or multipass mode, before augmentation. It runs until the retained
row count stabilizes and must not add objects.

NEW! `filterExtensionResources` is a shared post-augmentation utility used by
the legacy parser and PostGraphile. It hides extension-owned resources from
exposed arrays while preserving navigation lookups for dependencies. This
differs from raw-data pruning, which removes objects before lookups are built.

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of either `introspect` or the
`introspectRaw`/`augmentIntrospectionData` combo; the deprecated methods to not
gain any of this new functionality. Replace the old manual query/parse pattern:

```js
import {
  makeIntrospectionQuery,
  parseIntrospectionResults,
} from "pg-introspection";

const text = makeIntrospectionQuery();
const { rows } = await client.query(text);
const result = rows[0].introspection;
const introspection = parseIntrospectionResults(result);
```

with:

```js
import { introspect } from "pg-introspection";

const introspection = await introspect({}, async (text, values) => {
  const { rows } = await client.query(text, values);
  return rows[0].introspection;
});
```
