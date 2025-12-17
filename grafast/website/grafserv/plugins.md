---
sidebar_position: 5
---

# Plugins

Grafserv enables extensibility via [Graphile Config
plugins](https://star.graphile.org/graphile-config/plugin/), and more
specifically via middleware. This capability can be used
to augment and enhance Grafserv's behavior.

A plugin is an object with a `name` property with unique string value. Grafserv
plugins will then have a `grafserv` scope where `middleware` functions may be
defined:

```ts
const MyPlugin: GraphileConfig.Plugin = {
  name: "MyPlugin",

  grafserv: {
    middleware: {
      /* Implement middleware methods here */
    },
  },
};
```

## Middleware

As your TypeScript auto-complete will hopefully tell you, the following
middlewares are available:

```ts
interface GrafservMiddleware {
  setPreset(event: InitEvent): PromiseOrDirect<void>;
  processRequest(event: ProcessRequestEvent): PromiseOrDirect<Result | null>;
  processGraphQLRequestBody(
    event: ProcessGraphQLRequestBodyEvent,
  ): PromiseOrDirect<void>;
  /**
   * Wraps the generation of the HTML to render from Ruru
   */
  ruruHTML(event: RuruHTMLEvent): PromiseOrDirect<string>;
  onSubscribe(
    event: OnSubscribeEvent,
  ): TruePromiseOrDirect<void | readonly GraphQLError[] | ExecutionArgs>;
}
```

When you define a middleware in your plugin, each method will
receive an additional initial argument - `next` - which is a function to call
the "inner" behavior. The inner behavior is the next middleware or the
underlying functionality.

:::danger Call `next()` exactly once

It's important that you call this method, otherwise the underlying behavior will
not execute! If you call `next()` more than once then unexpected behaviors may
result. It's safest if you call it exactly once unless you know better!

:::

## Examples

### RuruTitlePlugin

This example uses the `ruruHTML` middleware to overwrite the `<title>` tag in
the HTML to be served to the end user to render Ruru. It is passed the `next`
function (which, when called, actually generates the HTML) along with an "event"
which encompasses all information available to the middleware. In our case we
care about the `request` property so we can get the "host" header, and the
`htmlParts` property so that we can overwrite the `titleTag` attribute.

```ts
const RuruTitlePlugin: GraphileConfig.Plugin = {
  name: "RuruTitlePlugin",
  version: "0.0.0",

  grafserv: {
    middleware: {
      ruruHTML(next, event) {
        const { htmlParts, request } = event;
        htmlParts.titleTag = `<title>${escapeHTML(
          "My Ruru Title Here | " + request.getHeader("host"),
        )}</title>`;
        return next();
      },
    },
  },
};
```

:::danger Plugins are powerful and dangerous

Mutating objects in plugins can have unexpected results; please be sure you know
what you are doing and only follow documented patterns.

:::
