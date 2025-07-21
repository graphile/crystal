---
"ruru-components": patch
"ruru": patch
"pgl": patch
"postgraphile": patch
"grafserv": patch
---

🚨 **Ruru has been "rebuilt"! The loading methods and APIs have changed!**

Ruru is now built on top of GraphiQL v5, which moves to using the Monaco editor
(the same editor used in VSCode) enabling more familiar keybindings and more
features (e.g. press F1 in the editor to see the command palette, and you can
now add comments in the variables JSON). This has required a rearchitecture to
Ruru's previously "single file" approach since Monaco uses workers which require
additional files.

In this release we have embraced the bundle splitting approach. We now bundle
both `prettier` and `mermaid`, and they are now loaded on-demand.

Usage instructions for all environments have had to change since we can no
longer serve Ruru as a single HTML file. We now include helpers for serving
Ruru's static files from whatever JS-based webserver you are using.

We've also added some additional improvements:

- Formatting with prettier now maintains the cursor position
  (`Ctrl-Shift-P`/`Meta-Shift-P`/`Cmd-Shift-P` depending on platform)
- All editors are now formatted, not just the GraphQL editor
- Prettier and mermaid should now work offline
- Even more GraphiQL props are now passed through, including
  `inputValueDeprecation` and `schemaDeprecation` which you can set to false if
  your GraphQL server is, _ahem_, a little behind the GraphQL spec draft.

🚨 **Changes you need to make:** 🚨

- If you are using Ruru directly (i.e. importing from `ruru/server`), please see
  the new Ruru README for setup instructions, you'll want to switch out your
  previous setup. In particular, `ruru/bundle` no longer exists and you now need
  to serve the static files (via `ruru/static`).
- `defaultHTMLParts` is no more; instead `config.htmlParts` (also
  `preset.ruru.htmlParts` for Graphile Config users) now allows the entries to
  be callback functions reducing boilerplate:
  ```diff
  -import { defaultHTMLParts } from "ruru/server";
   const config = {
     htmlParts: {
  -    metaTags: defaultHTMLParts.metaTags + "<!-- local override -->",
  +    metaTags: (base) => base + "<!-- local override -->",
     }
   }
  ```
  (alternatively you can use `makeHTMLParts(config)`)
- Grafserv users: `plugin.grafserv.middleware.ruruHTMLParts` is renamed to
  `ruruHTML` and wraps the generation of the HTML - simply trim `Parts` from the
  name and be sure calling `next()` is the final line of the function
  ```diff
   const plugin = {
     grafserv: {
       middleware: {
  -      ruruHTMLParts(next, event) {
  +      ruruHTML(next, event) {
           const { htmlParts, request } = event;
           htmlParts.titleTag = `<title>${escapeHTML(
             "Ruru | " + request.getHeader("host"),
           )}</title>`;
           return next();
         },
       },
     },
   };
  ```

Additional changes:

- `RuruConfig.clientConfig` has been added for props to explicitly pass to Ruru
  making it explicit that these will be sent to the client
- `RuruServerConfig` has deprecated the client options `editorTheme`,
  `debugTools` and `eventSourceInit` at the top level; instead these should be
  passed via `RuruServerConfig.clientConfig` making it explicit these will be
  sent to the client and expanding to cover more props
  ```diff
   const config = {
     endpoint: "/graphql",
  +  clientConfig: {
     editorTheme: "dark",
  +  },
   }
  ```
