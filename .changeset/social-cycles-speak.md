---
"postgraphile": minor
"@dataplan/pg": minor
---

Automatically skip fetches when we know no rows can be returned due to
`WHERE some_column = null` (which is always falsy).
