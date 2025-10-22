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
- dropping the long-deprecated Grafast exports `InterfaceOrUnionPlans` (use
  `InterfacePlan` or `UnionPlan` as appropriate), `deepEval` (should be
  `applyTransforms`) and `DeepEvalStep` (should be `ApplyTransformsStep`)
- removing the `PgAdaptorOptions` alias in favour of `PgAdaptorSettings`
- deleting the PostGraphile preset aliases `postgraphilePresetAmber` should be
  `PostGraphileAmberPreset`) and `PgRelayPreset` (should be
  `PostGraphileRelayPreset`), and updating all first-party usage to the
  canonical names
