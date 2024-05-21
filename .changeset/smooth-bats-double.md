---
"graphile-build": patch
"postgraphile": patch
"graphile-config": patch
"@dataplan/pg": patch
"grafserv": patch
"grafast": patch
---

`GrafastExecutionArgs` now accepts `resolvedPreset` and `requestContext`
directly; passing these through additional arguments is now deprecated.

`plugin.grafast.hooks.args` is now `plugin.grafast.middleware.prepareArgs`, and
the signature has changed - you must be sure to call the `next()` function and
ctx/resolvedPreset can be extracted directly from `args`:

```diff
 const plugin = {
   grafast: {
-    hooks: {
+    middleware: {
-      args({ args, ctx, resolvedPreset }) {
+      prepareArgs(next, { args }) {
+        const { requestContext: ctx, resolvedPreset } = args;
         // ...
+        return next();
       }
     }
   }
 }
```
