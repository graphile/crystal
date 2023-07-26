---
sidebar_position: 3
title: "Preset"
---

# Graphile Config Preset

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
