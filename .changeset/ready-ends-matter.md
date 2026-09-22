---
"postgraphile": minor
"@dataplan/pg": minor
---

`pgResource.find(...)` is now more precise about the requirements of the fields;
previously `Step<any>` was accepted, but now the Step must represent the
datatype of the field (or null/undefined).
