---
"ruru-components": patch
"ruru": patch
"pgl": patch
"postgraphile": patch
---

Ruru is now built on top of GraphiQL v5, which moves to using the Monaco editor
(the same editor used in VSCode) enabling more familiar keybindings and more
features (e.g. press F1 in the editor to see the command palette, and you can
now add comments in the variables JSON).

🚨 This has required a rearchitecture to Ruru's previously "single file"
approach since Monaco uses workers which require additional files; so instead we
have embraced the bundle splitting approach. We now bundle both prettier and
mermaid, but these are now loaded on-demand. Usage instructions for all
environments have had to change since we can no longer serve Ruru as a single
HTML file, so we now include helpers for serving Ruru's static files from
whatever JS-based webserver you are using.

We've also added some additional improvements:

- Formatting with prettier now maintains the cursor position
  (`Ctrl-Shift-P`/`Meta-Shift-P`/`Cmd-Shift-P` depending on platform)
- All editors are now formatted, not just the GraphQL editor
- Prettier and mermaid should now work offline
- Even more GraphiQL props are now passed through, including
  `inputValueDeprecation` and `schemaDeprecation` which you can set to false if
  your GraphQL server is, _ahem_, a little behind the GraphQL spec draft.

If you are using Ruru directly, please see the new Ruru README for setup
instructions, you'll want to switch out your previous setup.

Since we now need to deal with loading Ruru from somewhere, the way that we deal
with `htmlParts` has also changed:

- `config.htmlParts` now allows the entries to be callback functions; these are
  called passing the original value to reduce boilerplate
- `defaultHTMLParts` is no more - please either use the callback form of
  `config.htmlParts` mentioned above (recommended), or use
  `makeHTMLParts(config)` instead (though you are better off using the
- `RuruConfig.clientConfig` has been added for props to explicitly pass to Ruru
  - this makes it explicit that these will be sent to the client
- `RuruServerConfig` has deprecated the client options `editorTheme`,
  `debugTools` and `eventSourceInit` at the top level; instead these should be
  passed via `RuruServerConfig.clientConfig` (which makes it explicit these will
  be sent to the client, and has expanded to cover more props)
- `RuruServerConfig` isn't really needed any more, you can just use `RuruConfig`
  instead
- `middleware.ruruHTMLParts` is now `middleware.ruruHTML` and wraps the
  generation of the HTML - simply rename `ruruHTMLParts` to `ruruHTML` (and be
  sure to manipulate `htmlParts` _before_ calling the `next()` callback!)
