---
"graphile-build": patch
"postgraphile": patch
"graphile-config": patch
"@dataplan/pg": patch
"grafserv": patch
"grafast": patch
---

`GrafastExecutionArgs` now accepts `resolvedPreset` and `requestContext`
directly; passing these through additional arguments is now deprecated and
support will be removed in a future revision. This affects:

- `grafast()`
- `execute()`
- `subscribe()`
- `hookArgs()`

`graphile-config` has gained a middleware system which is more powerful than
it's AsyncHooks system. Old hooks can be emulated through the middleware system
safely since middleware is a superset of hooks' capabilities. `applyHooks` has
been renamed to `orderedApply` (because it applies to more than just hooks),
calling `applyHooks` will still work but is deprecated.

🚨 `grafast` no longer automatically reads your `graphile.config.ts` or similar;
you must do that yourself and pass the `resolvedPreset` to grafast via the
`args`. This is to aid in bundling of grafast since it should not need to read
from filesystem or dynamically load modules.

`grafast` no longer outputs performance warning when you set
`GRAPHILE_ENV=development`.

🚨 `plugin.grafast.hooks.args` is now `plugin.grafast.middleware.prepareArgs`,
and the signature has changed - you must be sure to call the `next()` function
and ctx/resolvedPreset can be extracted directly from `args`:

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

Many more middleware have been added; use TypeScript's autocomplete to see
what's available until we have proper documentation for them.

`plugin.grafserv.hooks.*` are still supported but deprecated; instead use
middleware `plugin.grafserv.middleware.*` (note that call signatures have
changed slightly, similar to the diff above):

- `hooks.init` -> `middleware.setPreset`
- `hooks.processGraphQLRequestBody` -> `middleware.processGraphQLRequestBody`
- `hooks.ruruHTMLParts` -> `middleware.ruruHTMLParts`

A few TypeScript types related to Hooks have been renamed, but their old names
are still available, just deprecated. They will be removed in a future update:

- `HookObject` -> `FunctionalityObject`
- `PluginHook` -> `CallbackOrDescriptor`
- `PluginHookObject` -> `CallbackDescriptor`
- `PluginHookCallback` -> `UnwrapCallback`
