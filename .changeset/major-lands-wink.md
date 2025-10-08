---
"postgraphile": patch
"@dataplan/pg": patch
---

Fixes bug with parsing arrays that use alternative delimeters (e.g. `;` instead
of `,`) - for example `box[]`.
