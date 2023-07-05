---
"postgraphile": patch
---

Re-export dependencies at `postgraphile/{depName}` e.g.
`postgraphile/@dataplan/pg` so exports can be used without
peerDependency/hoisting issues.
