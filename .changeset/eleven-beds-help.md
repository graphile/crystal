---
"@dataplan/pg": patch
"postgraphile": patch
---

In development, `$pgSelect.orderBy(...)` now has some runtime validation rather
than relying solely on types.
