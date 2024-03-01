---
"postgraphile": patch
"@dataplan/json": patch
"@dataplan/pg": patch
"grafast": patch
---

Add 'unary steps' concept to codebase and refactor to using new executeV2
execution method which leverages them. Backwards compatibility maintained, but
users should move to executeV2.
