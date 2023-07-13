---
"graphile-build": patch
"postgraphile": patch
---

Detect when your preset doesn't have any plugins, or omits the QueryPlugin, and
raise an error or warning indicating to the user that there's likely an issue
here.
