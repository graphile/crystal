---
"graphile-build-pg": patch
"grafast": patch
"postgraphile": patch
---

**MAJOR BREAKING CHANGE**: implicit application of args/input fields has been
removed.

Previously we would track the fieldArgs that you accessed (via `.get()`,
`.getRaw()` or `.apply()`) and those that you _did not access_ would
automatically have their `applyPlan` called, if they had one. This isn't likely
to be particularly useful for pure Gra*fast* users (unless they want to adopt
this pattern) but it's extremely useful for plugin-based schemas as it allows
plugins to add arguments that can influence their field's plan _without having
to wrap the field's plan resolver function_. This is fairly critical, otherwise
each behavior added (`first:`, `condition:`, `orderBy:`, `filter:`,
`ignoreArchived:`, etc etc) would wrap the plan resolver with another function
layer, and they would get _messy_.

However, implicit is rarely good. And it turns out that it severely limited what
I wanted to do for improving the `fieldArgs` APIs.

I decided to remove this implicit functionality by making it more explicit, so
now args/input fields can specify the relevant
`autoApplyAfterParent{Plan,SubscribePlan,InputPlan,ApplyPlan}: true` property
and we'll only apply them at a single level.

From a user perspective, little has changed. From a plugin author perspective,
if you were relying on the implicit `applyPlan` then you should now add the
relevant `autoApply*` property next to your `applyPlan` method.
