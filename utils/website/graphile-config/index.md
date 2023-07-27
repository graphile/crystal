---
sidebar_position: 1
---

# Graphile Config

**PRERELEASE**: this is pre-release software; use at your own risk. This will
likely change a lot before it's ultimately released.

`graphile-config` provides a standard plugin interface and helpers that can be
used across the entire of the Graphile suite. Primarily users will only use this
as `import type Plugin from 'graphile-config';` so that they can export plugins.

This package provides two interfaces: `Plugin` and `Preset`

## Supporting TypeScript ESM

You can specify a `graphile.config.ts` file; but if that uses `export default`
and your TypeScript is configured to export ESM then you'll get an error telling
you that you cannot `require` an ES Module:

```js
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /path/to/graphile.config.ts
require() of ES modules is not supported.
require() of /path/to/graphile.config.ts from /path/to/node_modules/graphile-config/dist/loadConfig.js is an ES module file as it is a .ts file whose nearest parent package.json contains "type": "module" which defines all .ts files in that package scope as ES modules.
Instead change the requiring code to use import(), or remove "type": "module" from /path/to/package.json.
```

Or, in newer versions, an error saying unknown file extension:

```js
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /path/to/graphile.config.ts
```

To solve this, use the experimental loaders API to add support for TS ESM via
the `ts-node/esm` loader:

```js
export NODE_OPTIONS="$NODE_OPTIONS --loader ts-node/esm"
```

Then run your command again.
