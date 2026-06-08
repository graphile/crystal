---
"grafast": patch
---

Exposes rootValueStep on OperationPlan and marks a few internals as internals.
Adds new global `variableValues()` step retriever, useful for helping produce
GraphQLResolveInfo and similar.
