---
"eslint-plugin-graphile-export": patch
---

Read `context.filename` and `context.physicalFilename` when available, falling
back to `context.getFilename()` and `context.getPhysicalFilename()` (removed in
ESLint 10) on older ESLint versions.
