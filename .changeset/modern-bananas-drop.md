---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

Massive overhaul of the behavior system which now has a centralized registry of
known behaviors and applies behaviors in a more careful and nuanced way,
removing many hacks and workarounds, and ultimately meaning that
`defaultBehavior: "-*"` should now operate correctly. Importantly,
`addBehaviorToTags()` has been removed - you should use
`plugin.schema.entityBehaviors` to indicate behaviors as shown in this PR - do
not mod the tags directly unless they're explicitly meant to be overrides.

Technically this is a breaking change (besides the removal of the
`addBehaviorToTags()` helper) because the order in which behaviors are applied
has changed, and so a different behavior might ultimately "win". This shows up
in places where there is ambiguity, for example if you add `@filterable` to a
function that you don't have execute permissions on, that function will now show
up in the schema since user overrides (smart tags) "win" versus inferred
behaviors such as introspected permissions; this wasn't the case before.
Hopefully most users will not notice any difference, and for those who do, the
`graphile behavior debug` CLI may be able to help you figure out what's going
on.

Be sure to print your schema before and after this update and look for changes;
if there are changes then you likely need to fix the relevant behaviors/smart
tags. (Hopefully there's no changes for you!)
