---
title: makePluginByCombiningPlugins
---

# makePluginByCombiningPlugins

There's no need for the `makePluginByCombiningPlugins` helper any more; instead
you can just build a preset instead:

```diff
-const plugin = makePluginByCombiningPlugins(Plugin1, Plugin2, Plugin3);
+const preset = { plugins: [Plugin1, Plugin2, Plugin3] };
```
