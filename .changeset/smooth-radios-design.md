---
"graphile-utils": patch
"postgraphile": patch
---

Fix the `wrapPlans()` resolver emulation warning to only occur when the type has
no `assertStep`, group related calls and log them together, offer an option to
disable this warning (along with the ability to name the plugin), and introduce
an error page with detailed information about the why and how to fix of the
issue.
