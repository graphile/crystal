---
sidebar_position: 1
title: "Middleware"
---

# Middleware

Target Audience: plugin authors 🔌 and library authors 📚

Some libraries may choose to make a middleware system available to plugins.
Adding middleware to a plugin allows you to wrap specific procedures in the
library's execution with your own code, and even to skip the execution or
replace the result of these procedures. Middleware functions are called with a
`next` function to be used to invoke the underlying procedure, and a mutable
`event` object that describes the context under which the middleware is being
called; they return the result of calling `next`, or a replacement result to use
in its place.

By adding middleware to a plugin, you can:

- run logic before the library's underlying action by including code before
  `next()`.
- run logic after the library's underlying action by including code after
  `next()` but before returning.
- omit calling the underlying action and further middleware by not calling
  `next()` (not recommended unless the library notes this is expected)
- call the underlying action and following middleware more than once by calling
  `next()` multiple times (not recommended unless the library notes this is
  expected)
- mutate the `event` object to change the behaviour of further middleware and
  the underlying procedure (not recommended unless the library notes this is
  expected, typically in the TSDoc comments for the various event properties)

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
const actionResult = await middleware.run(
  "someAction", // The "action name"
  { someParameter: 42 }, // The `event` object
  // The "underlying action"
  // This function is what will be retried if the MySomeActionRetryPlugin is
  // included in a preset.
  async (event) => {
    // Extract the (possibly modified) values from the event
    const { someParameter } = event;
    return doTheThing(someParameter);
  },
);
```

Multiple plugins in a preset can register middleware for the same action. When
middleware functions call `next()`, the next registered middleware is run. Once
there are no more registered middleware functions for that action, `next()` will
perform the underlying action that the library defines.

:::warning Here be dragons

When you write a middleware, you are explicitly choosing to change the way in
which a library functions - and your demands may not be compatible with the
expectations of the library, which may result in subtle and not-so-subtle bugs.
In particular, most libraries and most middleware will not function correctly if
you:

- omit `next()`,
- call `next()` more than once,
- return a promise when the middleware is expected to be synchronous, or
- change the `event` in an unexpected way.

Refer to the documentation for the appropriate library to see the available
actions around which you can add middleware, the structure of the `event`, and
whether the middleware are
[synchronous or asynchronous](#synchronous-middleware).

:::

:::note The underlying procedure might be a no-op

Some libraries may call middleware with no underlying action (aka no operation
or "no-op"); typically this allows for middleware to be called at a "point in
time" rather than _around_ a specific procedure. This has no effect on how you
should write a middleware function for these actions.

:::

## Synchronous middleware

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

## `next.callback()`

`next.callback()` simplifies including code after `next`, regardless of whether
`next` succeeds or fails.

Using `next.callback()` also allows you to introduce a promise only if one is
already present. This lets you avoid the performance overhead of promises when
they are not necessary, and it allows your function to be used as either
synchronous or asynchronous middleware.

```ts
export const MySpecialPlugin: GraphileConfig.Plugin = {
  name: "MySpecialPlugin",
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

## Middleware order

Most middleware are registered and executed in
[the order the plugins are loaded](./index.md#plugin-order). Sometimes,
middleware in the same plugin have varying requirements for when they are run.
For this reason, middleware also support `before`, `after`, and `provides`.
These properties function similarly to how they are used to
[order plugins](./index.md#plugin-order), but Graphile Config uses them to
individually sort the middleware for each scoped action.

In the following example, the `bar` middleware in the `libraryName` scope has an
order constraint at the middleware level. The `bar` middleware in `MyPlugin`
will be run after the `bar` middleware in `OtherPlugin` if both plugins are used
in the same resolved preset.

```ts
export const MyPlugin: GraphileConfig.Plugin = {
  name: "MyPlugin",
  // Plugins can have order constraints at the plugin level and at the
  // middleware level. All middleware in MyPlugin will be executed before any
  // middleware in plugins that have `provides: ["featureA" ]`
  before: ["featureA"],
  libraryName: {
    middleware: {
      foo(next) {
        // ... do something
        return next();
      },
      bar: {
        after: ["featureB"],
        callback(next) {
          // ... do something
          // Will be executed after middleware that set
          // `provides: ['featureB']`
          return next();
        },
      },
      // ... any other middleware
    },
  },
};

export const OtherPlugin: GraphileConfig.Plugin = {
  name: "OtherPlugin",
  libraryName: {
    middleware: {
      bar: {
        provides: ["featureB"],
        callback(next) {
          // ... do something
          return next();
        },
      },
    },
  },
};
```

Similar to plugins' `provides` property, Graphile Config appends the plugin
`name` to the `provides` property for all middleware.
