---
sidebar_position: 2
title: Preset
---

# Graphile Config Preset

Target Audience: all Graphile Config users ⚙️🔌📚

A preset bundles together a list of options and plugins to configure and extend
a library. `GraphileConfig.Preset` is the primary interface that most Graphile
Config users will use.

Library consumers should define their preset as the default export of a
`graphile.config.js` (or `.ts`, `.mjs`, etc.) file.

Here's an example in JavaScript:

```ts title="graphile.config.js"
const SomePlugin = require("some-plugin");

module.exports = {
  plugins: [SomePlugin],
  someScope: {
    someConfigOption: 10,
  },
};
```

And an equivalent configuration in TypeScript:

```ts title="graphile.config.ts"
import type {} from "graphile-config";
import SomePlugin from "some-plugin";

const preset: GraphileConfig.Preset = {
  plugins: [SomePlugin],
  someScope: {
    someConfigOption: 10,
  },
};

export default preset;
```

:::note

Adding the import statement tells TypeScript about the `GraphileConfig` global
namespace. No code from the `graphile-config` library will be included in the
output JavaScript for `graphile.config.ts` above. See the TypeScript docs for
more info about
[type-only imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export).

:::

## Supporting TypeScript ESM

You can specify a `graphile.config.ts` file, but if that uses `export default`,
and your TypeScript is configured to export ESM, then you may get an error
telling you that you cannot `require` an ES Module:

```
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

## Preset scopes

Libraries that use Graphile Config define scopes. Scopes are properties in a
Graphile Config preset within which configuration options can be set. For
example, [Postgraphile](https://postgraphile.org/) defines `postgraphile`,
`pgServices` and other scopes. [Graphile Worker](https://worker.graphile.org/)
defines a `worker` scope.

Scopes are also used in plugins. Plugin authors 🔌 should see [Plugin](./plugin)
for more details.

## Preset composition

Library authors create Graphile Config presets that allow consumers to easily
use the library with default or recommended settings. The `extends` property in
a preset allows library consumers to extend one or more presets with their own
configuration values or plugins. Extending presets resolves values according to
the [preset resolution algorithm](#preset-resolution).

The following is a simple example of a Graphile Config preset that could be used
to configure usage of [Graphile Worker](https://worker.graphile.org/):

```ts title=graphile.config.ts
import { WorkerPreset } from "graphile-worker";

const preset: GraphileConfig.Preset = {
  extends: [WorkerPreset],
  worker: {
    connectionString: "postgres:///my_db",
  },
};

export default preset;
```

:::info Define your own presets to share your preferred defaults

As a library consumer, you can build and share presets with your collaborators
or even extend 3rd party presets provided by the community. As with any 3rd
party code, take caution to ensure you can trust the code you are importing.

:::

## Preset resolution

Some libraries that use Graphile Config allow consumers to provide more than one
preset. Presets may also compose (extend) other presets. When a library is
passed a list of presets, it resolves the preset using the `ResolvePresets`
algorithm below.

TL;DR:

- All the presets in `extends` are resolved in order (order is important!).
- The plugins are merged as a set (each plugin will only be included once) and
  sorted according to `before`/`after`.
- The options are merged such that options specified last win.

**ResolvePresets(presets):**

1. Let {finalPreset} be an empty preset.
1. For each {preset} in {presets}:
   1. Let {resolvedPreset} be {ResolvePreset(preset)}.
   1. Let {finalPreset} be {MergePreset(finalPreset, resolvedPreset)}.
1. Let {finalPreset.plugins} be
   {[sortWithBeforeAfterProvides](./plugin.md#plugin-order)(finalPreset.plugins)}.
1. Return {finalPreset}.

**ResolvePreset(preset):**

1. Let {extendedPresets} be the list specified in the {extends} property of
   {preset} (or an empty list if none specified).
1. Let {basePreset} be {ResolvePresets(extendedPresets)}.
1. Return {MergePreset(basePreset, preset)}.

**MergePreset(basePreset, extendingPreset):**

1. Let {finalPreset} be an empty preset.
1. Assert: {basePreset} has an empty or non-existent {extends} property.
1. Let {plugins} be the list of plugins defined in {basePreset} appended with
   those in {extendingPreset} that aren't already present in {basePreset}.
1. Let the list of plugins for {finalPreset} be {plugins}.
1. Let {scopes} be the list of scopes defined in {basePreset} union the list of
   scopes in {extendingPreset}.
1. For each {scope} in {scopes}:
   1. Let {baseScope} be the {scope} in {basePreset}.
   1. Let {extendingScope} be the {scope} in {extendingPreset}.
   1. If {baseScope} and {extendingScope} both exist:
      1. Let {scope} in {finalPreset} be the result of merging {baseScope} and
         {extendingScope} akin to
         `Object.assign({}, baseScope, extendingScope)`.
   1. Else: let {scope} in {finalPreset} be whichever of {baseScope} and
      {extendingScope} actually exist.
1. Return {finalPreset}.

:::info

If the following are true:

1. A preset extends two other presets - PresetA and PresetB.
2. Both PresetA and PresetB `extends` the same underlying preset - PresetBASE.
3. Both PresetA and PresetB apply some overrides to options set in PresetBASE.

Then the overrides in PresetA will be overridden by re-applying PresetBASE
again. For this reason, presets that are expected to be combined with other
presets should not `extends` common or shared presets. Instead, the end user
should be expected to add these presets themselves.

Said another way, the tree of presets should only ever have a depth of 2 or less
to avoid unexpected behavior.

:::

## `graphile` CLI

:::tip

The `graphile` CLI is only available to sponsors. See the
[README](https://github.com/graphile/crystal/blob/main/utils/graphile/README.md)
for more details.

:::

The `graphile` CLI has a `config` subcommand with various tools to help library
consumers.

```sh
# Output the options your config may contain
npx graphile config options
# Print your resolved configuration
npx graphile config print
```
