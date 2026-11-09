---
"graphile-build": patch
---

Optimize behavior system to improve schema build time. One report indicates a in
schema of ~8,500 types, `buildSchema` drops from 33s to 6.5s.
