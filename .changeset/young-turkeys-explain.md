---
"postgraphile": patch
"@dataplan/pg": patch
---

Fix issue with record types when attributes need to be cast; this previously
caused errors with computed columns when passed particular arguments.
