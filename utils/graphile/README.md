# graphile

Graphile makes a number of open source projects, some of the headline projects
include [PostGraphile](https://postgraphile.org),
[Graphile Worker](https://github.com/graphile/worker),
[Graphile Migrate](https://github.com/graphile/migrate) and
[Gra*fast*](https://grafast.org), but there are many others. This module is
intended to be a CLI that will help when interacting with these various
projects, helping you to create, debug, update, interact with and maintain them.

At the moment, it doesn't contain much, but it should grow over time.

## `graphile config`

Config debugging commands

### `graphile config print`

Prints out the configuration from your `graphile.config.mjs` (or similar) file
in an easy to read/digest form.

### `graphile config options`

Outputs markdown detailing the full list of options that you may specify in your
config file, suitable for inclusion in your repository's documentation folder.
Output is honed specifically to your set of plugins and presets.

## `graphile inflection`

Inflection debugging commands

### `graphile inflection list`

Outputs markdown detailing the full list of inflectors that have been defined
(and may be overridden via a plugin), suitable for inclusion in your
repository's documentation folder. Output is honed specifically to your set of
plugins and presets.

## `graphile behavior`

Behavior debugging commands. (WARNING: This hasn't been updated since behavior
defaults were reworked, so is now super verbose and a little confusing.)

### `graphile behavior debug`

Lists the `entityType`s available to debug (will vary depending on your
plugins); example:

```
$ graphile behavior debug
No entity type was specified; please pick one of the supported entity types:
- pgCodec
- pgCodecAttribute
- pgCodecRef
- pgCodecRelation
- pgRefDefinition
- pgResource
- pgResourceUnique
```

(See
[@dataplan/pg registry](https://grafast.org/grafast/step-library/dataplan-pg/registry/)
for details of the example above.)

### `graphile behavior debug <entityType>`

Lists the entity identifiers for that specific entity type; e.g.

```
$ graphile behavior debug pgResource
No entity identifier was specified; please pick one of the supported entities for entity type 'pgResource':
- fn
- person
- post
```

### `graphile behavior debug <entityType> <entityIdentifier>`

Outputs the behavior string for the given entity, along with sources that caused
it to be derived in that way - indicating which behaviors came from which
plugins.

The output for each plugin includes styled text:

- green text is behavior strings added by this plugin - this may be either at
  the start or end of the string
- grey text is inherited from previous behavior string
- strike through text (green or grey) indicates a behavior fragment that has
  been overridden by a later value in the string

The `__ApplyBehaviors_*__`-style entry is a workaround that shows the
"multiplication" of the previous behavior with the default behavior. It's a
hack/workaround until we have a better way of presenting this concept.

### `graphile behavior debug <entityType> <entityIdentifier> <filterString>`

As above, but pass a filter string (a behavior fragment) and any behaviors
related to that will be highlit so you can see what came to manipulate that
particular setting.
