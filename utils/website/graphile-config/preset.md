---
sidebar_position: 2
title: Preset
---

# GraphileConfig.Preset

_Target Audience: all Graphile Config users ⚙️🔌📚_

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

:::note Importing Graphile Config types is recommended

Adding the `import type {} from "graphile-config"` statement tells TypeScript
about the `GraphileConfig` global namespace; this may or may not be necessary
depending on the other imports that you have, but we generally recommend it.

No code from the `graphile-config` library will be included in the output
JavaScript for `graphile.config.ts` above; see the TypeScript docs for more on
[type-only imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export).

:::

## Supporting TypeScript ESM

You can specify a `graphile.config.ts` file, but if that uses `export default`,
and your TypeScript is configured to export ESM, then you may get an error
telling you that you cannot `require` an ES Module:

<div className="wrapcode">

```
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /path/to/graphile.config.ts
require() of ES modules is not supported.
require() of /path/to/graphile.config.ts from /path/to/node_modules/graphile-config/dist/loadConfig.js is an ES module file as it is a .ts file whose nearest parent package.json contains "type": "module" which defines all .ts files in that package scope as ES modules.
Instead change the requiring code to use import(), or remove "type": "module" from /path/to/package.json.
```

</div>

Or, in newer versions, an error saying unknown file extension:

<div className="wrapcode">

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /path/to/graphile.config.ts
```

</div>

To solve this, use the experimental loaders API to add support for TS ESM via
the `ts-node/esm` loader:

```js
export NODE_OPTIONS="$NODE_OPTIONS --loader ts-node/esm"
```

Then run your command again.

## Preset scopes

Libraries that use Graphile Config define scopes. Scopes are properties in a
Graphile Config preset within which configuration options can be set. For
example, [PostGraphile](https://postgraphile.org/)'s dependencies define scopes
including `pgServices`, `schema`, `grafast`, `grafserv`, and more.
[Graphile Worker](https://worker.graphile.org/) defines a `worker` scope.

Scopes are also used in plugins. Plugin authors 🔌 should see [Plugin](./plugin)
for more details.

## Preset composition

Library authors can create Graphile Config presets that allow consumers to easily
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

:::tip Define your own presets to share your preferred defaults

As a library consumer, you can build and share presets with your collaborators
or even extend 3rd party presets provided by the community. As with any 3rd
party code, take caution to ensure you can trust the code you are importing.

:::

## Preset resolution

Presets may compose (extend) zero or more other presets. When a library is
passed a preset, it resolves the preset using the `ResolvePreset` algorithm
below.

#### TL;DR:

- All the presets in `extends` are resolved, recursively, depth-first, in order (order is important!).
- The plugins are merged as a set (each plugin will only be included once) and
  sorted according to `before`/`after`.
- The options are merged such that options specified last win.

#### `ResolvePreset(preset):`

1. Let `flattenedPreset` be `FlattenPreset(preset)`.
1. Let `resolvedPreset` be a copy of `flattenedPreset` with the `plugins`
   property sorted according to the [plugin ordering
   rules](./plugin/index.md#plugin-order).
1. Return `resolvedPreset`.

#### `FlattenPreset(preset):`

1. Let `extends` be the list specified in the `extends` property of `preset`
   (or an empty list if none specified).
1. Let `extendsPreset` be `MergePresets(extends)`.
1. Return `ExtendPreset(preset, extendsPreset)`.

#### `MergePresets(presets):`

1. Let `mergedPreset` be an empty preset.
1. For each `preset` in `presets`:
   1. Let `flattenedPreset` be `FlattenPreset(preset)`.
   1. Let `mergedPreset` be `ExtendPreset(mergedPreset, flattenedPreset)`.
1. Return `mergedPreset`.

#### `ExtendPreset(basePreset, extensionPreset):`

1. Note: this algorithm ignores the `extends` property of both `basePreset` and
   `extensionPreset`, assuming they has already been resolved elsewhere.
1. Let `mergedPreset` be an empty preset.
1. Let `plugins` be the unique list of plugins defined in `basePreset` followed
   those defined in `extensionPreset` and not already defined in `basePreset`.
1. Let the list of plugins in `mergedPreset` be `plugins`.
1. Let `scopes` be the set of scopes defined in `basePreset` union those
   defined in `extensionPreset`.
1. For each `scope` in `scopes`:
   1. Let `baseScope` be the value of the `scope` in `basePreset`.
   1. Let `extendingScope` be the value of the `scope` in `extensionPreset`.
   1. If `baseScope` and `extendingScope` both exist:
      1. Let `scope` in `mergedPreset` be the result of merging `baseScope` and
         `extendingScope` akin to
         `Object.assign({}, baseScope, extendingScope)`.
   1. Otherwise: let `scope` in `mergedPreset` be whichever of `baseScope` and
      `extendingScope` actually exist.
1. Return `mergedPreset`.

:::warning Order of composition is important

Consider a preset, APreset, that extends two other presets: Preset1 and
Preset2, each of which `extends` the same preset, Preset0:

```ts
const Preset0 = { myScope: { option1: false, option2: false } };
const Preset1 = { extends: [Preset0], myScope: { option1: true } };
const Preset2 = { extends: [Preset0], myScope: { option2: true } };
const APreset = { extends: [Preset1, Preset2] };
```

Any overrides to the options set in Preset0 by Preset1 will be reset in APreset
since they will be overridden when Preset2 applies the Preset0 options again:

```ts
// Resolving the presets operates depth first:
const Preset0 = { myScope: { option1: false, option2: false } };
const Preset1 = { myScope: { ...Preset0.myScope, option1: true } };
const Preset2 = { myScope: { ...Preset0.myScope, option2: true } };
const APreset = { myScope: { ...Preset1.myScope, ...Preset2.myScope } };
// Thus:
const APreset = { myScope: { option1: false, option2: true } };
```

For this reason, presets that are expected to be combined with other presets
should not `extends` common or shared presets; instead, the end user should be
expected to add these presets themselves.

Said another way, the tree of presets should only ever have a depth of 2 or less
to avoid unexpected behavior.

:::

## `graphile` CLI

:::tip Sponsorship has perks: the `graphile` CLI!

Graphile's open source projects only exist thanks to the sponsorship of
individuals and organizations that use them. To help convince your boss to fund
the ongoing development of the OSS that your company relies on, sponsorship
comes with perks. One such perk is the `graphile` CLI which is only licensed for
usage by sponsors. See the
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
