---
"@dataplan/pg": patch
"graphile-build-pg": patch
"postgraphile": patch
---

Fix bug in listOfCodec causing wrong extensions to be used in non-deterministic
manner (thanks to @jvandermey for finding the bug and helping to track it down).
