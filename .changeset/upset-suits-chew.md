---
"graphile-build-pg": patch
"postgraphile": patch
"graphile-export": patch
---

Improve export optimization to remove redundant repeated identifier arguments
from local helper function calls, resulting in smaller and more straight-forward
exports and easier optimizations for third-party plugins where `import`s are
discouraged.
