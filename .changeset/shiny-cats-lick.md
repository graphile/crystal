---
"postgraphile": patch
"@dataplan/pg": patch
---

`set jit = 'off'` replaced with `set jit_optimize_above_cost = -1` so that JIT
can still be used but heavy optimization costs are not incurred.
