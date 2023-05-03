---
"postgraphile": patch
"grafserv": patch
"ruru": patch
---

🚨 Ruru is now a CommonJS module, no longer an ESM module.

Ruru CLI now reads options from a `graphile.config.ts` file if present.

It's now possible to customize the HTML that Ruru is served with (specifically
the meta, title, stylesheets, header JS, body content, body JS, and init
script), either via configuration:

```ts
import { defaultHTMLParts } from "ruru/server";

const preset: GraphileConfig.Preset = {
  //...
  ruru: {
    htmlParts: {
      titleTag: "<title>GraphiQL with Grafast support - Ruru!</title>",
      metaTags:
        defaultHTMLParts.metaTags +
        `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    },
  },
};
```

or via a plugin, which allows you to change it on a per-request (per-user)
basis:

```ts
const RuruMetaPlugin: GraphileConfig.Plugin = {
  name: "RuruMetaPlugin",
  version: "0.0.0",
  grafserv: {
    hooks: {
      ruruHTMLParts(_info, parts, extra) {
        // extra.request gives you access to request details, so you can customize `parts` for the user

        parts.metaTags += `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
      },
    },
  },
};
```
