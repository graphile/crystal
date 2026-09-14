---
"@dataplan/pg": patch
"grafast": patch
"postgraphile": patch
---

Fix a bug where `trap()` would prevent connection-capable list steps from
resolving correctly (often replacing them with `null`).
