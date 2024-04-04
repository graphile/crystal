---
layout: page
path: /postgraphile/make-plugin-by-combining-plugins/
title: makePluginByCombiningPlugins (graphile-utils)
---

**NOTE: this documentation applies to PostGraphile v4.1.0+**

This is a simple helper for combining multiple smaller plugins into one plugin
for ease of use.

```js
const { makePluginByCombiningPlugins } = require('graphile-utils');

module.exports = makePluginByCombiningPlugins(plugin1, plugin2, ...);
```
