---
"graphile-export": patch
---

Fix bug in graphile-export handing modules where default export
(`import mod from 'mod'`) differed from wildcard export
(`import * as mod from 'mod'`).
