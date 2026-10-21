---
"eslint-plugin-graphile-export": patch
---

Use `context.filename` and `context.physicalFilename` instead of the deprecated
`context.getFilename()` and `context.getPhysicalFilename()`, which were removed
in ESLint 10.
