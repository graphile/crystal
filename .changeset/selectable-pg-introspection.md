---
"pg-introspection": minor
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

`makeIntrospectionQuery` and `parseIntrospectionResults` remain available but
are deprecated in favour of `introspect` or `introspectRaw`. These APIs prepare
for incremental introspection.
