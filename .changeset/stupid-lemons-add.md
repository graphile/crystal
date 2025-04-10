---
"grafast": patch
---

Fix an issue in plan finalization causing unary side effect steps in polymorphic
positions (not supported!) to bleed into other polymorphic paths. Technically we
don't support side effects outside of mutation fields, but they can be useful
for debugging so we don't deliberately break them.
