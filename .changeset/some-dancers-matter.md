---
"graphile-utils": patch
"postgraphile": patch
---

Forbid export of 'build', this has required a slight degradation of the
makeAddPgTableConditionPlugin/addPgTableCondition signature for people using the
legacy signature - namely the entire build object is no longer available in the
callback that is the fourth argument. (Only have 3 arguments to your call?
You're not impacted!) In the unlikely event this causes you any issues, your
best bet is to move to the `apply()` approach (only use the 3 documented
arguments), but we can also potentially expand the parts of build that are made
available.
