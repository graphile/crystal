---
"grafast": patch
---

Exposes rootValueStep on OperationPlan and removes some transient values from
being stored. Adds new global `variableValues()` step retriever, useful for
helping produce GraphQLResolveInfo and similar.
