# graphile-plugin

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-plugin.svg?style=flat)](https://www.npmjs.com/package/graphile-plugin)
![MIT license](https://img.shields.io/npm/l/graphile-plugin.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

`graphile-plugin` provides a standard plugin interface and helpers that can be
used across the entire of the Graphile suite. Primarily users will only use this
as `import type Plugin from 'graphile-plugin';` so that they can export plugins.

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

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://surge.io/"><img src="https://graphile.org/images/sponsors/surge.png" width="90" height="90" alt="Surge" /><br />Surge</a> *</td>
<td align="center"><a href="https://storyscript.com/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Story.ai" /><br />Story.ai</a> *</td>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
</tr><tr>
<td align="center"><a href="https://www.fanatics.com/"><img src="https://graphile.org/images/sponsors/fanatics.png" width="90" height="90" alt="Fanatics" /><br />Fanatics</a> *</td>
<td align="center"><a href="https://www.enzuzo.com/"><img src="https://graphile.org/images/sponsors/enzuzo.png" width="90" height="90" alt="Enzuzo" /><br />Enzuzo</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->
