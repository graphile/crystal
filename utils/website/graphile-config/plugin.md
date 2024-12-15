---
sidebar_position: 3
title: "Plugin"
---

# Graphile Config Plugin

Target Audience: plugin authors 🔌 and library authors 📚

Plugins allow you to extend the functionality of libraries that use Graphile
Config. Each library that uses Graphile Config may register plugin scopes that
can contain optional [middleware](#middleware).

Beyond scoped middleware, a Graphile Config Plugin has the following properties:

- `name` (`string`): The name of the plugin. This must be unique among all
  plugins that a library user uses with a library. Thus, names should be
  descriptive to limit conflicts and confusion with other plugins in that
  library's ecosystem. Names are used to deduplicate plugins in the
  [preset resolution algorithm](./preset.md#preset-resolution).
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
  registered. Feature labels must be unique across all plugins used in a single
  preset. If unspecified, defaults to the plugin name. See
  [Plugin order](#plugin-order)
- `after` (optional `string[]`): indicates that this plugin should be loaded
  after plugins with these feature labels if these feature labels are present in
  other plugins in the preset.
- `before` (optional `string[]`): indicates that this plugin should be loaded
  before plugins with these feature labels if these feature labels are present
  in other plugins in the preset.

## Plugin order

Plugins are ordered first according to the
[preset resolution algorithm](./preset.md#preset-resolution). Consider the
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

If you use the preset in `graphile-config.ts`, the resolved plugins will be
loaded in the order `[PluginA, PluginB, PluginC]`, unless `before` and `after`
are used.

By adding to a plugin's `before` and `after` properties, you can guarantee its
loading position relative to other plugins if those other plugins are present.

If you have multiple different plugins that provide the same feature, you should
use the `provides` property. The property has two benefits:

1.  Any other plugin that needs to guarantee its position relative to that
    feature does not need to list every possible plugin name that provides that
    feature. Instead those other plugins can list a single feature label.
2.  You guarantee that a library user does not accidentally load plugins that
    provide overlapping functionality.

For example, imagine `PluginD` and `PluginE` each include implementations of a
subscriptions feature. By including the `subscriptions` feature label in their
`provides` property, `PluginD` and `PluginE` allow `PluginF` to ensure it is
loaded before any plugin that provides subscriptions by setting
`before: ['subscriptions']`. This also prevents library users from loading both
`PluginD` and `PluginE` in the same preset.

:::note

Note that `before` and `after` do not guarantee that those feature labels are
present in a preset. There currently is no built-in way for a plugin to declare
dependencies on other plugins.

:::

## Middleware

Adding middleware to a plugin allows you to add your own code to be run at
specific points in the library's execution. Libraries most often call middleware
in the context of some underlying action. Libraries include an `event` object
which is passed to your middleware function alongside a `next` callback
function.

By adding middleware to a plugin, you can...

- run logic before the library's underlying action by including code before
  `next()`.
- run logic after the library's underlying action by including code after
  `next()` but before returning.
- (if supported by the library and other middleware) omit calling the underlying
  action and following middleware by not calling `next()`.
- (if supported by the library and other middleware) call the underlying action
  and following middleware more than once by calling `next()` twice.
- (if supported by the library and other middleware) mutate the `event` object.
  The mutated event object may be used by other middleware registered with the
  same action name. The mutated event object may also

The following example plugin includes middleware that adds a naive retry and
backoff to the underlying action. Note that this example would only be safe if
the library and other middleware explicitly supported calling `next()` more than
once.

```ts title="my-some-action-retry-plugin.ts"
export const MySomeActionRetryPlugin: GraphileConfig.Plugin = {
  name: "MySomeActionRetryPlugin",
  myScopeName: {
    middleware: {
      async someAction(next, event) {
        console.log(`someAction(someParameter=${event.someParameter}) called`);

        let error!: Error;
        for (let attempts = 0; attempts < 3; attempts++) {
          if (attempts > 0) {
            // Wait a few milliseconds before trying again
            await sleep(attempts * 5);
          }
          try {
            return await next();
          } catch (e) {
            error = e;
          }
        }
        throw error;
      },
    },
  },
};
```

Middleware functions are executed when libraries call `middelware.run()` or
`middleware.runSync()`. For example:

```ts
await middleware.run(
  "someAction", // The "action name"
  { someParameter: 42 }, // The `event` object
  async (event) => {
    // The "underlying action"
    // This function is what will be retried if the MySomeActionRetryPlugin is
    // included in a preset.
  },
);
```

Multiple plugins in a preset can register middleware for the same action. When
middleware functions call `next()`, the next registered middleware is run. Once
there are no more registered middleware functions for that action, `next()` will
perform the underlying action that the library defines.

Middleware are registered and executed in the order the plugins are loaded. See
[Plugin order](#plugin-order).

**Most libraries and most middleware will not function correctly if you omit
`next()`, call `next()` more than once, or change the `event` in an unexpected
way.** Refer to the documentation for the appropriate library to see the
available actions around which you can add middleware, the structure of the
`event`, and whether the middleware are
[synchronous or asynchronous](#synchronous-middleware).

:::note

Some libraries may call middleware with a no-op underlying action. This has no
effect on how you should write a middleware function for these actions.

:::

### Synchronous middleware

Libraries use `middleware.runSync()` when the underlying action is synchronous
and the library expects any middleware function run around that action to be
synchronous. If you return a promise from a synchronous middleware function,
Graphile Config will throw an error.

Libraries should document whether their middleware are synchronous or
asynchronous, but you may be able to tell from the library's TypeScript types:
asynchronous middleware functions' return types generally incorporate `Promise`
or `PromiseLike`.

Unless you are certain a given middleware supports promises, you should not use
`async`/`await`. Instead, use `next.callback(...)` if you need to execute some
code once the action is complete.

### `next.callback()`

`next.callback()` simplifies including code after `next`, regardless of whether
`next` succeeds or fails.

Using `next.callback()` also allows you to introduce a promise only if one is
already present. This lets you avoid the performance overhead of promises when
they are not necessary, and it allows your function to be used as either
synchronous or asynchronous middleware.

```ts
export const MySomeActionLogPlugin: GraphileConfig.Plugin = {
  name: "MySomeActionLogPlugin",
  libraryName: {
    middleware: {
      someAction(next, event) {
        console.log(`someAction(someParameter=${event.someParameter}) called`);
        // Optionally mutate event
        event.someParameter = event.someParameter * 2;

        return next.callback((error, result) => {
          if (error) {
            console.error(`someAction() threw ${error}`);
            // Handle the error somehow... Or just rethrow it.
            throw error;
          } else {
            console.log(`someAction() returned ${result}`);
            // Return `result` or a derivative thereof
            return result / 2;
          }
        });
      },
    },
  },
};
```
