---
"graphile-build-pg": patch
---

Fixes missing await which might cause process to exit when something goes wrong
during schema building.
