---
"postgraphile": patch
"grafast": patch
---

🚨 Tracking of side effects has been completely overhauled, the main difference
for users is that if you hit issues you may need to ensure that
**this.hasSideEffects = true**, if set, is the last thing that your step does in
its constructor (previously, doing this anywhere in the constructor was okay).
This should fix a number of oddities around side effects and their impact on the
operation plan - essentially it's a lot stricter now.
