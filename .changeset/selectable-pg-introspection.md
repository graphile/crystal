---
"pg-introspection": major
---

The focus of this release was allowing you to (severely!) limit the amount of
data you pull from introspection, whilst also allowing you to introspect more
database resources!

See https://star.graphile.org/pg-introspection/v1-to-v2 for a migration guide
(the legacy APIs remain supported, but move to the new APIs to make use of the
new features!)

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
single-pass or multipass mode, before augmentation. Its `details.hide` helper
moves objects into a serializable `hidden` collection for navigation without
exposing them as resources. Pruning runs until the exposed row count stabilizes
and must not add objects.

NEW! Use `prune: pruneExtensionResources` to preserve the legacy extension
resource exclusions. This callback is shared by the legacy parser and
PostGraphile; it hides extension-owned functions and relations while retaining
their dependency data. Standalone extension types are unaffected.

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of either `introspect` or the
`introspectRaw`/`augmentIntrospectionData` combo; the deprecated methods do not
gain any of this new functionality. See
https://star.graphile.org/pg-introspection/v1-to-v2 for a migration guide.
