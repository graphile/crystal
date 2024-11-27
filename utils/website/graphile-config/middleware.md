---
sidebar_position: 3
title: "Middleware"
---

# Middleware

## For plugin authors

You should probably see the documentation for the relevant project that you
want to add a middleware for.

Generally middleware works by registering a handler function for a given action
in a plugin, scoped within an entry named after the library (e.g.
`plugin.libraryName.middleware.someAction`).

Your handler function will be passed a `next` callback that calls the next
handler, or performs the underlying action if there is no next handler, and any
additional arguments. Normally there is exactly one additional argument,
`event`, which describes the event that is being wrapped in middleware.

Your function should:

1. Take any actions that it needs to take before the underlying code is called
   (including mutating `event` if necessary)
2. Then, either:
   1. `return next()` (and you're done); or:
   2. Call, await, and store the result of `next()`, then return a derivative
      thereof (after taking any necessary cleanup actions); or:
   3. Use `return next.callback(cb)` where `cb` is a callback you define in
      traditional (non-promises!) Node.js style which receives the error (if
      any) as the first parameter, and the result (if no error) as the second, and
      must return the value to resolve as (or throw an error)

:::warning Some middleware are synchronous!

Some libraries enable middleware around synchronous methods, and expect the
result of the middleware to be synchronous too. Internally, these libraries run
this middleware with `middleware.runSync()` rather than `middleware.run()`;
returning a promise from your middleware will throw an error in these cases.

You should be able to tell a synchronous middleware from its TypeScript types:
if the middleware's return type does not incorporate Promise or PromiseLike
then it probably does not support promises.

Unless you are certain a given middleware supports promises, you should not use
`async`/`await` and should instead use `next.callback(...)` if you need to
perform an action once the action is complete.

:::

Here's a simple example that just multiplies one of the parameters by two, and
logs that this action has been called:

```ts
export const MySomeActionDoubleParameterPlugin: GraphileConfig.Plugin = {
  name: "MySomeActionDoubleParameterPlugin",
  libraryName: {
    middleware: {
      someAction(next, event) {
        console.log(`someAction(someParameter=${event.someParameter}) called`);
        event.someParameter = event.someParameter * 2;
        return next();
      },
    },
  },
};
```

Here's an example that retries on error (but always forces promises):

:::danger `next()` should be called exactly once unless otherwise stated

In general libraries may assume that `next()` will be called once, so it might
not be safe to retry `next()`. Libraries that support `next()` being called
more than once should note this in the documentation for the relevant action.

:::

```ts
export const MySomeActionRetryPlugin: GraphileConfig.Plugin = {
  name: "MySomeActionRetryPlugin",
  libraryName: {
    middleware: {
      async someAction(next, event) {
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

Here's an example that does not introduce a promise unless one was already
present (complex, right? Don't do this - see next example instead):

```ts
export const MySomeActionLogPlugin: GraphileConfig.Plugin = {
  name: "MySomeActionLogPlugin",
  libraryName: {
    middleware: {
      someAction(next, event) {
        console.log(`someAction(someParameter=${event.someParameter}) called`);
        // Optionally mutate event
        event.someParameter = event.someParameter * 2;

        const onSuccess = (result) => {
          console.log(`someAction() returned ${result}`);
          // Return `result` or a derivative thereof
          return result / 2;
        };

        const onError = (error) => {
          console.error(`someAction() threw ${error}`);
          // Handle the error somehow... Or just rethrow it.
          throw error;
        };

        const promiseOrValue = next();
        try {
          if (isPromiseLike(promiseOrValue)) {
            return promiseOrValue.then(onSuccess, onError);
          } else {
            // Optionally perform any additional actions here
            return onSuccess(promiseOrValue);
          }
        } catch (e) {
          return onError(e);
        }
      },
    },
  },
};
```

Here's the above example again, but using `next.callback()` to handle the
promises (if any) for us; this is the generally recommended approach:

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

## For a library author

(This section was primarily written by Benjie for Benjie... so you may want to
skip it.)

If you need to create a middleware system for your library, you might follow
something along these lines (replacing `libraryName` with the name of your
library):

```ts
/***** interfaces.ts *****/

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

/***** index.ts *****/

import type { MiddlewareHandlers } from "graphile-config";

// Extend Plugin with support for registering handlers for the middleware activities:
declare global {
  namespace GraphileConfig {
    interface Plugin {
      libraryName?: {
        middleware?: MiddlewareHandlers<MyMiddleware>;

        // Prior to graphile-config@0.0.1-beta.12, a more verbose alternative was required:
        /*
        middleware?: {
          [key in keyof MyMiddleware]?: CallbackOrDescriptor<
            MyMiddleware[key] extends (...args: infer UArgs) => infer UResult
              ? (next: MiddlewareNext<UResult>, ...args: UArgs) => UResult
              : never
          >;
        };
        */
      };
    }
  }
}

/***** getMiddleware.ts *****/

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

/***** main.ts *****/

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
    // Call the underlying method to perform the action.
    // Note: `event` will be the same object as above, but its contents may
    // have been modified by middlewares.
    return await someAction(event.someParameter);
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
