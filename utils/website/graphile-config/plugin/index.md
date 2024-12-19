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
  plugins used (directly or indirectly) in a given preset. Names should be
  descriptive to limit conflicts and confusion with other plugins. The plugin
  name is automatically added to `provides` below.
- `version` (optional `string`): a semver-compliant version for the plugin.
  This would normally match the version in the `package.json`, but it does not
  need to. Today, this isn't used for much (it is displayed in the output of
  `graphile config print`) but it may be used in the future to allow plugins to
  express dependencies on other plugins.
- `description` (optional `string`): human-readable description of the plugin in
  [CommonMark](https://commonmark.org/) (markdown) format.
- `provides` (optional `string[]`): an optional list of "feature labels" this
  plugin provides, used to govern the [order in which the plugin is
  registered](#plugin-order). Graphile Config will append the plugin name to
  any feature labels here.
- `after` (optional `string[]`): indicates this plugin should be loaded
  after any plugins with these feature labels.
- `before` (optional `string[]`): indicates this plugin should be loaded
  before any plugins with these feature labels.

## Plugin order

Consider the following set of plugins and presets:

```ts title=graphile.config.ts
import type {} from "graphile-config";

const PluginA: GraphileConfig.Plugin = { name: "PluginA" };
const PluginB: GraphileConfig.Plugin = { name: "PluginB" };
const PluginC: GraphileConfig.Plugin = { name: "PluginC" };

const Preset1: GraphileConfig.Preset = {
  plugins: [PluginA],
};

const Preset2: GraphileConfig.Preset = {
  extends: [Preset1],
  plugins: [PluginB, PluginC],
};
```

Plugins are currently ordered first according to the [preset resolution
algorithm](../preset.md#preset-resolution). Since none of the plugin in
`graphile.config.ts` specify `before` or `after`, the plugins in `Preset2`,
once resolved, will be ordered `[PluginA, PluginB, PluginC]`. However, this
ordering is not guaranteed and should not be relied upon.

If the order in which a plugin is loaded is significant, it must be stated
explicitly by adding to a plugin's `before` and `after` properties. These
properties guarantee its loading position relative to other plugins that provide
those features:

```ts title=graphile.config.ts
import type {} from "graphile-config";

const PluginA: GraphileConfig.Plugin = { name: "PluginA", after: ["PluginC"] };
const PluginB: GraphileConfig.Plugin = { name: "PluginB", before: ["PluginA"] };
const PluginC: GraphileConfig.Plugin = { name: "PluginC", after: ["PluginB"] };

const Preset1: GraphileConfig.Preset = {
  plugins: [PluginA],
};

const Preset2: GraphileConfig.Preset = {
  extends: [Preset1],
  plugins: [PluginB, PluginC],
};

// Resulting order: PluginB, PluginC, PluginA
```

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
    interface Preset {
      sendgrid?: SendgridOptions;
    }

    interface SendgridOptions {
      apiKey?: string;
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
    interface Preset {
      sendgrid?: SendgridOptions;
    }

    interface SendgridOptions {
      apiKey?: string;
      someOtherOption?: number;
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
