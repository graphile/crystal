---
"graphile-build": patch
"postgraphile": patch
"@dataplan/pg": patch
"grafserv": patch
"pgl": patch
"grafast": patch
---

Tighten our public API surface by:

- renaming `EventStreamHeandlerResult` to the correctly spelt
  `EventStreamHandlerResult` (and keeping only a deprecated alias for the old
  name)
- dropping the long-deprecated Grafast exports `InterfaceOrUnionPlans`,
  `deepEval` and `DeepEvalStep`
- removing the `PgAdaptorOptions` alias in favour of `PgAdaptorSettings`
- deleting the PostGraphile preset aliases `postgraphilePresetAmber` and
  `PgRelayPreset`, and updating all first-party usage to the canonical names
