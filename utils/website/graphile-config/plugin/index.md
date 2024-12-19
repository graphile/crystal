---
sidebar_position: 3
title: "Plugin"
---

# Graphile Config Plugin

_Target Audience: plugin authors 🔌 and library authors 📚_

Plugins allow you to extend the functionality of libraries that use Graphile
Config. Each library that uses Graphile Config may register plugin scopes that
enable expanded functionality, including through [middleware](#middleware).

Beyond these scopes, a Graphile Config Plugin has the following properties:

- `name` (`string`): The name of the plugin. This must be unique among all
  plugins that a library user uses with a library. Thus, names should be
  descriptive to limit conflicts and confusion with other plugins in that
  library's ecosystem. Names are used to deduplicate plugins in the
  [preset resolution algorithm](../preset.md#preset-resolution).
- `version` (optional `string`): a semver-compliant version for the plugin. This
  would normally match the version in the `package.json`, but it does not need
  to (e.g. if the module in question contains multiple plugins). Today, this
  isn't used for much. It is only displayed in the output of
  `graphile config print`, but it may be used in the future to allow plugins to
  express dependencies on other plugins.
- `description` (optional `string`): human-readable description of the plugin in
  [CommonMark](https://commonmark.org/) (markdown) format.
- `provides` (optional `string[]`): an optional list of "feature labels" that
  this plugin provides. This is used to govern the order in which the plugin is
  registered. Graphile Config will append the plugin name to any feature labels
  here. See [Plugin order](#plugin-order)
- `after` (optional `string[]`): indicates that this plugin should be loaded
  after plugins with these feature labels if these feature labels are present in
  other plugins in the preset.
- `before` (optional `string[]`): indicates that this plugin should be loaded
  before plugins with these feature labels if these feature labels are present
  in other plugins in the preset.

## Plugin order

Plugins are ordered first according to the
[preset resolution algorithm](../preset.md#preset-resolution). Consider the
following presets:

```ts title=some-default-preset.ts
import type {} from "graphile-config";
import PluginA from "./plugin-a";

const preset: GraphileConfig.Preset = {
  plugins: [PluginA],
};

export default preset;
```

```ts title=graphile.config.ts
import type {} from "graphile-config";
import PluginB from "./plugin-b";
import PluginC from "./plugin-c";
import SomeDefaultPreset from "./some-default-preset";

const preset: GraphileConfig.Preset = {
  extends: [SomeDefaultPreset],
  plugins: [PluginB, PluginC],
};

export default preset;
```

If you use the preset in `graphile.config.ts` and none of the plugins specify
`before` or `after` then the resolved plugins will typically be loaded in the
order `[PluginA, PluginB, PluginC]`; however, this ordering is not guaranteed
and should not be relied upon.

If the order in which a plugin is loaded is significant, it must be stated
explicitly by adding to a plugin's `before` and `after` properties. These
properties guarantee its loading position relative to other plugins that provide
those features.

If multiple different plugins provide the same feature they should indicate this
via the `provides` property, thereby allowing other plugins to guarantee their
position relative to all the plugins providing this feature with a single
feature label in `before` or `after`.

For example, imagine `PluginD` and `PluginE` each include implementations of a
subscriptions feature. By including the `subscriptions` feature label in their
`provides` property, `PluginD` and `PluginE` allow `PluginF` to ensure it is
loaded before any plugin that provides subscriptions by setting
`before: ['subscriptions']`.

:::note Unknown features are ignored.

Adding a feature label to `before` or `after` does not guarantee that that
feature label is present in a preset; if a feature label is not provided by any
plugins then it will have no impact on ordering.

There currently is no standard way for a plugin to declare explicit dependencies
on other plugins.

:::

## Adding config options

Plugins can add additional config options with
[declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
Exactly what interfaces you need to extend will depend on how the library author
has organized the types. For example, if you want to add an option to the
`worker` scope used in
[Graphile Worker](https://github.com/graphile/worker/blob/aa417401838e010ef92c63e15a3173ee494eaae2/src/index.ts#L62),
you need to extend `GraphileConfig.WorkerOptions`:

```ts
declare global {
  namespace GraphileConfig {
    interface WorkerOptions {
      myNewConfigOption?: string;
    }
  }
}
```

You can also add a new scope:

```ts
declare global {
  namespace GraphileConfig {
    interface SendgridOptions {
      apiKey?: string;
    }

    interface Preset {
      sendgrid?: SendgridOptions;
    }
  }
}
```

The options you add should be optional. If the file containing these additions
to the `GraphileConfig` types is imported, but the plugin is not used in the
preset, the interfaces are still extended. Additionally, even if you want to
ensure that the **resolved** preset has some value for some option, you do not
want to force every (unresolved) preset to have a value.

If you are building a plugin to share with others, you may also want to export a
preset that sets options to sensible defaults or uses secrets from environment
variables.

```ts title=my-sendgrid-plugin.ts
declare global {
  namespace GraphileConfig {
    interface SendgridOptions {
      apiKey?: string;
      someOtherOption?: number;
    }

    interface Preset {
      sendgrid?: SendgridOptions;
    }
  }
}

export const MySendgridPlugin: GraphileConfig.Plugin = {
  name: "MySendgridPlugin",
  libraryName: {
    middleware: {
      foo(next, event) {
        new SendgridSdk(
          // This assumes that the library passes in the resolved preset via
          // `event.resolvedPreset`. This will vary depending on the library.
          event.resolvedPreset.sendgrid?.apiKey,
        ).makeSomeCall();
      },
    },
  },
};

export const MySendgridPreset: GraphileConfig.Preset = {
  plugins: [MySendgridPlugin],
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    someOtherOption: 2,
  },
};
```
