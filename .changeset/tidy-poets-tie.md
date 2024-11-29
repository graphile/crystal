---
"graphile-build-pg": patch
"graphile-build": patch
---

Integrate preset.lib into build and gather context so plugins can use modules
without needing to install dependencies (and thus avoiding the dual package
hazard).
