---
"graphile-build-pg": patch
"postgraphile": patch
"grafast": patch
---

Breaking: `connection()` step now accepts configuration object in place of 2nd
argument onwards.

Feature: `edgeDataPlan` can be specified as part of this configuration object,
allowing you to associate edge data with your connection edges.

Feature: `ConnectionStep` and `EdgeStep` gain `get()` methods, so
`*Connection.edges`, `*Connection.nodes`, `*Connection.pageInfo`, `*Edge.node`
and `*Edge.cursor` no longer need plans to be defined.
