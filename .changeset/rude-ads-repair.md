---
"graphile-build-pg": patch
---

Add shortcuts for improved DX:

- `build.pgResources` &larr; `build.input.pgRegistry.pgResources`
- `build.pgCodecs` &larr; `build.input.pgRegistry.pgCodecs`
- `build.pgRelations` &larr; `build.input.pgRegistry.pgRelations`
- `build.pgExecutor` is the first executor (the only executor unless you're
  using multiple databases)
