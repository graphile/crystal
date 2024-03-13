---
"postgraphile": patch
"@dataplan/pg": patch
---

Make it so that more pgSelect queries optimize themselves into parent queries
via new step.canAddDependency helper.
