---
"pg-introspection": minor
---

NEW! Use `introspect` and `introspectRaw` to run introspection using a supplied
database query callback, rather than building the query and running it yourself.
`introspect` returns full introspection results (including navigation helpers);
`introspectRaw` returns plain introspection data, which can be passed to
`augmentIntrospectionData` separately. This is useful when caching results:
clone cached data before augmentation and pass the same options used to fetch
it.

NEW! The `onlyEntities` option (experimental) allows you to select catalog
collections, including additional PostgreSQL collections such as settings,
triggers and foreign servers. Some collections require others to be selected; an
error will be reported when a required collection was not included.

NEW! Top-level `filters` accepts trusted SQL predicates keyed by collection.
These apply to the single introspection query or, with multipass enabled, to
every discovery and dependency query. `makeIntrospectionQuery` also accepts
`onlyEntities` and `filters`.

NEW! Multipass introspection (opt-in with `multipass: { policies: [...] }`)
allows pg-introspection to minimize the amount of data it pulls from the
database to just the parts you're interested in, significantly reducing memory
usage. Supports configurable discovery policies, role-based filtering,
entrypoint filters and pruning. See the
[multipass guide](https://star.graphile.org/pg-introspection/multipass).

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of `introspect` or `introspectRaw`. Replace the old
manual query/parse pattern:

```js
const { rows } = await client.query(makeIntrospectionQuery());
const introspection = parseIntrospectionResults(rows[0].introspection);
```

with:

```js
const introspection = await introspect({}, async (text, values) => {
  const { rows } = await client.query(text, values);
  return rows[0].introspection;
});
```

Import `introspect` from `pg-introspection`. To retain raw data for caching, use
`introspectRaw` with the same arguments, then call
`augmentIntrospectionData(options, structuredClone(data))` when helpers are
needed. Use this augmentation API for selected collections too; the legacy
parser assumes the default collections.

The deprecated parsing APIs retain their existing boolean flag and default
behaviour for compatibility.
