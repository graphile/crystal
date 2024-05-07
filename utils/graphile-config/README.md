# graphile-config

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

**PRERELEASE**: this is pre-release software; use at your own risk. This will
likely change a lot before it's ultimately released.

`graphile-config` provides a standard plugin interface and helpers that can be
used across the entire of the Graphile suite. Primarily users will only use this
as `import type Plugin from 'graphile-config';` so that they can export plugins.

This package provides two interfaces: `Plugin` and `Preset` (alias `Config`).

## Plugin

A plugin is responsible for adding capabilities to a Graphile package. Each
Graphile package will register its own "scope" within the plugin's spec;
commonly these scopes may contain capabilities such as 'hooks' or 'events' which
this package attempts to standardize.

A Graphile Plugin is an object with the following properties:

- `name` (`string`): The name of the plugin, this must be unique and will be
  used for capabilities such as `skipPlugins`
- `version` (`string`): a semver-compliant version for the plugin, this would
  normally match the version in the `package.json` but does not need to (e.g. if
  the module in question contains multiple plugins)
- `description` (optional `string`): human-readable description of the plugin in
  [CommonMark](https://commonmark.org/) (markdown) format.
- `provides` (optional `string[]`): an optional list of "feature labels" that
  this plugin provides, this is primarily used to govern the order in which the
  plugin (and its hooks and events) are executed. Feature labels must be unique
  within the list of loaded plugins, for example two different plugins should
  not both provide `subscriptions`. If unspecified, defaults to the plugin name.
- `after` (optional `string[]`): indicates that this plugin should be loaded
  after the named features (if present)
- `before` (optional `string[]`): indicates that this plugin should be loaded
  before the named features (if present)

In addition to the properties above, plugins may also contain properties for
each of the supported scopes, for example there may be a `postgraphile` scope
for PostGraphile, or a `worker` scope for Graphile Worker. The value for each of
these scopes will be an object, but the contents of that object are defined by
the projects in question.

**NOTE**: Currently this plugin system is only intended for Graphile usage (and
thus we do not need to "reserve" keys), but should you find it useful for other
projects please reach out via GitHub issues and we can discuss what's necessary
to make this more universal. Should you decide to not heed this advice, please
at least make sure that the "scopes" you add are namespaced in a way to avoid
future conflicts with features we may wish to add.

## Preset

A preset bundles together a list of plugins, and options for various of the
"scopes". You may use more than one preset at a time, and presets may also
compose (extend) other presets. When a library is passed a list of presets it
results in a resolved preset (a preset that has no "extends") using the
`ResolvePresets` algorithm; broadly all the `extends` are resolved in order, the
plugins specified are merged as a set (each plugin will only be included once)
and the options are merged via object merging such that the options specified
last win.

**NOTE**: if you compose two presets (PresetA and PresetB) that both `extends`
the same underlying preset (BASE) and apply some overrides, then the overrides
in PresetA will be overridden by re-applying the BASE preset again. For this
reason, presets that are expected to be combined with other presets should not
`extends` common/shared presets, instead the end-user should be expected to add
these presets themselves.

**NOTE**: the order of presets is significant.

ResolvePresets(presets):

1. Let {finalPreset} be an empty preset.
1. For each {preset} in {presets}:
   1. Let {resolvedPreset} be {ResolvePreset(preset)}.
   1. Let {finalPreset} be {MergePreset(finalPreset, resolvedPreset)}.
1. Return {finalPreset}.

ResolvePreset(preset):

1. Let {presets} be the list specified in the {extends} property of {preset} (or
   an empty list if none specified).
1. Let {basePreset} be {ResolvePresets(presets)}.
1. Return {MergePreset(basePreset, preset)}.

MergePreset(basePreset, extendingPreset):

1. Let {finalPreset} be an empty preset.
1. Assert: {basePreset} has an empty or non-existent {extends} property.
1. Let {plugins} be the list of plugins defined in {basePreset} union the list
   of plugins in {extendingPreset}.
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

**IMPORTANT**: the `default` name must not be used as a top-level key in a
preset to enable compatibility with the various ESM emulations.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
<td align="center"><a href="https://www.sylvera.com/"><img src="https://graphile.org/images/sponsors/sylvera.svg" width="90" height="90" alt="Sylvera" /><br />Sylvera</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Supporting TypeScript ESM

You can specify a `graphile.config.ts` file; but if that uses `export default`
and your TypeScript is configured to export ESM then you'll get an error telling
you that you cannot `require` an ES Module:

```
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /path/to/graphile.config.ts
require() of ES modules is not supported.
require() of /path/to/graphile.config.ts from /path/to/node_modules/graphile-config/dist/loadConfig.js is an ES module file as it is a .ts file whose nearest parent package.json contains "type": "module" which defines all .ts files in that package scope as ES modules.
Instead change the requiring code to use import(), or remove "type": "module" from /path/to/package.json.
```

Or, in newer versions, an error saying unknown file extension:

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /path/to/graphile.config.ts
```

To solve this, use the experimental loaders API to add support for TS ESM via
the `ts-node/esm` loader:

```
export NODE_OPTIONS="$NODE_OPTIONS --loader ts-node/esm"
```

Then run your command again.
