---
sidebar_position: 4
title: "Library Authors"
---

# Library Authors

Graphile Config is currently only used by Graphile projects. Should you find it
useful for other projects, please reach out via GitHub issues and we can discuss
what is necessary to make this more universal. Should you decide to not heed
this advice, please at least make sure that the scopes you add are named to
reduce the likelihood of future conflicts with features we may wish to add.

## Naming scopes

By convention, scopes are camelCase strings. Scopes should be descriptive enough
to reduce the chance of either conflicts across libraries or conflicts with
future additions to Graphile Config.

<details>

<summary>Click for specifically reserved scope names</summary>

The following strings are reserved by Graphile Config, and should not be used as
preset scopes or plugin scopes:

- Anything beginning with an underscore (`_`)
- after
- appendPlugins (to avoid confusion with PostGraphile v4 plugins)
- before
- callback
- description
- default (to enable compatibility with the various ESM emulations)
- disablePlugins
- experimental
- export
- exports
- extend
- extends
- functionality
- id
- import
- imports
- include
- includes
- label
- name
- plugin
- plugins
- prependPlugins (to avoid confusion with PostGraphile v4 plugins)
- provides
- skipPlugins (to avoid confusion with PostGraphile v4 plugins)
- title

</details>

## Middleware

(This section was primarily written by Benjie for Benjie... so you may want to
skip it.)

If you need to create a middleware system for your library, you might follow
something along these lines (replacing `libraryName` with the name of your
library):

```ts title="src/interfaces.ts"
// Define the middlewares that you support, their event type and their return type
export interface MyMiddleware {
  someAction(event: SomeActionEvent): PromiseOrDirect<SomeActionResult>;
}
interface SomeActionEvent {
  someParameter: number;
  /*
   * Use a per-middleware-method interface to define the various pieces of
   * data relevant to this event. **ALWAYS** use the event as an abstraction
   * so that new information can be added in future without causing any
   * knock-on consequences. Note that these parameters of the event may be
   * mutated. The values here can be anything, they don't need to be simple
   * values.
   */
}
// Middleware wraps a function call; this represents whatever the function returns
type SomeActionResult = number;

export type PromiseOrDirect<T> = Promise<T> | T;
```

```ts title="src/index.ts"
import type { MiddlewareHandlers } from "graphile-config";

// Extend Plugin with support for registering handlers for the middleware activities:
declare global {
  namespace GraphileConfig {
    interface Plugin {
      libraryName?: {
        middleware?: MiddlewareHandlers<MyMiddleware>;
      };
    }
  }
}
```

```ts title="src/getMiddleware.ts"
import { Middleware, orderedApply, resolvePreset } from "graphile-config";

export function getMiddleware(resolvedPreset: GraphileConfig.ResolvedPreset) {
  // Create your middleware instance. The generic describes the events supported
  const middleware = new Middleware<MyMiddleware>();
  // Now apply the relevant middlewares registered by each plugin (if any) to the
  // Middleware instance
  orderedApply(
    resolvedPreset.plugins,
    (plugin) => plugin.libraryName?.middleware,
    (name, fn, _plugin) => {
      middleware.register(name, fn as any);
    },
  );
}
```

```ts title="src/main.ts"
// Get the user's Graphile Config from somewhere, e.g.
import config from "./graphile.config.js";

// Resolve the above config, recursively applying all the presets it extends from
const resolvedPreset = resolvePreset(config);

// Get the middleware for this preset
const middleware = getMiddleware(resolvedPreset);

// Then in the relevant place in your code, call the middleware around the
// relevant functionality
const result = await middleware.run(
  "someAction",
  { someParameter: 42 }, // < `event` object
  async (event) => {
    // Note: `event` will be the same object as above, but its contents may
    // have been modified by middlewares.
    const { someParameter } = event;

    // Call the underlying method to perform the action.
    return await someAction(someParameter);
  },
);
// The value of `result` should match the return value of `someAction(...)`
// (unless a middleware tweaked or replaced it, of course!)

// This is the thing that your middleware wraps. It can do anything, it's just
// an arbitrary JavaScript function.
function someAction(someParameter: number): PromiseOrDirect<SomeActionResult> {
  // Do something here...
  if (Math.random() < 0.5) {
    return someParameter;
  } else {
    return sleep(200).then(() => someParameter);
  }
}
```
