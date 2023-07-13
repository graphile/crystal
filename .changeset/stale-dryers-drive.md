---
"graphile-config": patch
---

Only eat ENOENT errors when checking for file existance, other errors should
still throw.
