---
"graphile-build-pg": patch
"@dataplan/pg": patch
---

Generating parameter analysis at runtime is unnecessarily expensive, allow
callers to pass a parameter analysis that has been performed at plan-time and
cached.
