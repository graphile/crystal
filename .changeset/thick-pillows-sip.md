---
"eslint-plugin-graphile-export": patch
"graphile-build-pg": patch
"graphile-build": patch
"@dataplan/pg": patch
"grafast": patch
---

Since the following have been removed from Grafast, throw an error if they're
seen in the schema:

- `autoApplyAfterParentInputPlan`
- `autoApplyAfterParentApplyPlan`
- `autoApplyAfterParentPlan`
- `autoApplyAfterParentSubscribePlan`
- `inputPlan`
- `applyPlan` on input fields

Also: when Query type fails to build, throw the underlying error directly.
