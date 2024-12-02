---
"@dataplan/pg": patch
"ruru-components": patch
"graphile-utils": patch
---

Fixes incorrect deduplication in pgSelect resulting from lack of `from`
comparison when passing custom `from` to custom `pgSelect()` calls.
