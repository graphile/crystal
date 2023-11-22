---
"postgraphile": patch
---

Fix bug in CLI parser where omitting `--watch` would force `watch: false` even
if config sets `watch: true`.
