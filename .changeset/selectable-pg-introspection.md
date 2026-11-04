---
"pg-introspection": major
---

NEW! Use `introspect` and `introspectRaw` to run introspection using a supplied
database query callback, rather than building the query and running it yourself.
`introspect` returns full introspection result (including navigation helpers);
`introspectRaw` returns plain introspection data, which can be passed to
`augmentIntrospectionData` separately (useful when you want to cache the
introspection results and use them as a base for future mutations).

NEW! The `onlyEntities` option (experimental) allows you to select catalog
collections, including additional PostgreSQL collections such as settings,
triggers and foreign servers. Some collections require others to be selected; an
error will be reported when a required collection was not included.

NEW! Multipass introspection (opt-in with `multipass: { policies: [...] }`)
allows pg-introspection to minimize the amount of data it pulls from the
database to just the parts you're interested in, significantly reducing memory
usage. Supports configurable discovery policies, role-based filtering and
pruning.

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of `introspect` or `introspectRaw`.

BREAKING: `parseIntrospectionResults` and `augmentIntrospection` now retain
extension-owned resources, matching `introspect` and `augmentIntrospectionData`.
The `includeExtensionResources` argument has been removed. Resource exclusion is
an application policy rather than a responsibility of `pg-introspection`;
PostGraphile applies its extension resource discovery filters through
`graphile-build-pg` introspection policies. Other consumers should use multipass
entrypoint filters to exclude extension-owned resources from initial discovery
whilst retaining dependencies required by user resources.
