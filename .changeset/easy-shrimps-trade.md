---
"graphile-build": patch
"postgraphile": patch
---

"Transliterate" non-latin characters so that schemas can be constructed more
easily when characters incompatible with GraphQL's `Name` are used.

To disable, remove the new plugin:

```diff
 const preset = {
   extends: [AmberPreset /* ... */],
+  disablePlugins: ['TransliterationPlugin'],
   /* ... */
 }
```
