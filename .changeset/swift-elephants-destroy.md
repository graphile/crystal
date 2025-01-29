---
"graphile-utils": patch
---

Fix bug in makeWrapPlansPlugin where the default plan resolver used was
incorrect; use the new `defaultPlanResolver` export from `grafast` instead of
building our own.
