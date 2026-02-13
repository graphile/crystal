# ruru-components

## 2.0.0-rc.6

### Patch Changes

- [#2937](https://github.com/graphile/crystal/pull/2937)
  [`8f50146`](https://github.com/graphile/crystal/commit/8f5014605d2d3a3353ab99e2ac4bbadaadcccdca)
  Thanks [@benjie](https://github.com/benjie)! - Eliminate dangling promises,
  reducing chance of process exit due to unhandled promise rejection.
- Updated dependencies
  [[`8f50146`](https://github.com/graphile/crystal/commit/8f5014605d2d3a3353ab99e2ac4bbadaadcccdca),
  [`5e83533`](https://github.com/graphile/crystal/commit/5e83533f2d7005ba031d800c079e21f9fa1fecd5),
  [`03e5ce5`](https://github.com/graphile/crystal/commit/03e5ce5b3feaed585b9fabef9e81a0b0564bc725),
  [`f213a8e`](https://github.com/graphile/crystal/commit/f213a8e4813ec79beddc81fc994314e99a9b67f9)]:
  - grafast@1.0.0-rc.7

## 2.0.0-rc.5

### Patch Changes

- [#2910](https://github.com/graphile/crystal/pull/2910)
  [`9eb3829`](https://github.com/graphile/crystal/commit/9eb3829ea337041e4585e0cfeb63b44e87d7d14f)
  Thanks [@benjie](https://github.com/benjie)! - Use consistent type export
  syntax

- [`a3722d6`](https://github.com/graphile/crystal/commit/a3722d613bc6fb9e32f167aae9a31eaa422ceef1)
  Thanks [@benjie](https://github.com/benjie)! - Refactor to enable TypeScript
  options rewriteRelativeImportExtensions and erasableSyntaxOnly (including
  using .ts extensions in source code)

- [#2912](https://github.com/graphile/crystal/pull/2912)
  [`ebe1d22`](https://github.com/graphile/crystal/commit/ebe1d22e45156d9ec2274f291bbb824405e02049)
  Thanks [@benjie](https://github.com/benjie)! - Ruru now depends on ruru-types
  package - stripped down vs ruru-components

- [#2915](https://github.com/graphile/crystal/pull/2915)
  [`be9792b`](https://github.com/graphile/crystal/commit/be9792bea3b39097533b0f86e1d25ee66208909d)
  Thanks [@benjie](https://github.com/benjie)! - Fix some peerDependencies woes

- Updated dependencies
  [[`9eb3829`](https://github.com/graphile/crystal/commit/9eb3829ea337041e4585e0cfeb63b44e87d7d14f),
  [`a3722d6`](https://github.com/graphile/crystal/commit/a3722d613bc6fb9e32f167aae9a31eaa422ceef1),
  [`ebe1d22`](https://github.com/graphile/crystal/commit/ebe1d22e45156d9ec2274f291bbb824405e02049),
  [`be9792b`](https://github.com/graphile/crystal/commit/be9792bea3b39097533b0f86e1d25ee66208909d),
  [`5fc379e`](https://github.com/graphile/crystal/commit/5fc379ea1ee56ea033a3f7d8c4a1ee00a6c83de7)]:
  - grafast@1.0.0-rc.5
  - ruru-types@2.0.0-rc.5

## 2.0.0-rc.4

### Patch Changes

- [#2877](https://github.com/graphile/crystal/pull/2877)
  [`1e45a3d`](https://github.com/graphile/crystal/commit/1e45a3d6495cfea45bfdde95af889a453b82def3)
  Thanks [@benjie](https://github.com/benjie)! - Safety - use null prototype
  objects in more places.

- [#2873](https://github.com/graphile/crystal/pull/2873)
  [`0772086`](https://github.com/graphile/crystal/commit/0772086411a55d56b4e345cff1eef133eee31b36)
  Thanks [@benjie](https://github.com/benjie)! - Update TypeScript configuration
  to support Node 22 minimum

- [#2881](https://github.com/graphile/crystal/pull/2881)
  [`1606298`](https://github.com/graphile/crystal/commit/1606298cdac2938e02675d0e7e5e134364ac7bcf)
  Thanks [@benjie](https://github.com/benjie)! - Fix `{"isTrusted": true}` error
  that would be output in Ruru when websocket connection unexpectedly
  terminated.

- [#2888](https://github.com/graphile/crystal/pull/2888)
  [`1a56db2`](https://github.com/graphile/crystal/commit/1a56db2f53bc455a3d3ba6555a2cd777b27b271c)
  Thanks [@benjaie](https://github.com/benjaie)! - Node v22+ is required for
  this module.

- [#2883](https://github.com/graphile/crystal/pull/2883)
  [`2e770df`](https://github.com/graphile/crystal/commit/2e770df354db58d39aead55c3aeca8ee2fb41833)
  Thanks [@benjie](https://github.com/benjie)! - Ruru gains ability to export
  schema as SDL (with options!)

- Updated dependencies
  [[`44555c7`](https://github.com/graphile/crystal/commit/44555c7f479d531d6aef100f99859c3bcbf06c93),
  [`1e45a3d`](https://github.com/graphile/crystal/commit/1e45a3d6495cfea45bfdde95af889a453b82def3),
  [`0772086`](https://github.com/graphile/crystal/commit/0772086411a55d56b4e345cff1eef133eee31b36),
  [`a565503`](https://github.com/graphile/crystal/commit/a5655035dfee7000c1d37e4791354d7a2ba35792),
  [`d9ccc82`](https://github.com/graphile/crystal/commit/d9ccc82a30ca6167f480e5c8bc15d17df51c0d1c),
  [`1a56db2`](https://github.com/graphile/crystal/commit/1a56db2f53bc455a3d3ba6555a2cd777b27b271c),
  [`eafa3f0`](https://github.com/graphile/crystal/commit/eafa3f036ce68e6ffb65935f0a78edee2fa6bdf8),
  [`b27c562`](https://github.com/graphile/crystal/commit/b27c562409f7a2fd8a0eeaca96cd2c6b935efe4c),
  [`f23f0cf`](https://github.com/graphile/crystal/commit/f23f0cf8812eddff7c91c529499a4f20f1f2978c)]:
  - grafast@1.0.0-rc.4

## 2.0.0-rc.3

### Patch Changes

- [#2836](https://github.com/graphile/crystal/pull/2836)
  [`c4f2e52`](https://github.com/graphile/crystal/commit/c4f2e527c9c3a8ea99777f6940330c04d8c4f618)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug with Ruru bundling

- Updated dependencies
  [[`c4f2e52`](https://github.com/graphile/crystal/commit/c4f2e527c9c3a8ea99777f6940330c04d8c4f618)]:
  - grafast@1.0.0-rc.3

## 2.0.0-rc.2

### Patch Changes

- [#2829](https://github.com/graphile/crystal/pull/2829)
  [`a82e6fa`](https://github.com/graphile/crystal/commit/a82e6fae099f7e9d62fb3fc1ee173368cdabca27)
  Thanks [@benjie](https://github.com/benjie)! - Update dependency ranges.

- Updated dependencies
  [[`f3a9869`](https://github.com/graphile/crystal/commit/f3a9869c6f9e7aa1eb501af5f7d582d2073be585),
  [`68f61cd`](https://github.com/graphile/crystal/commit/68f61cdbeea19e81b1d59a3fac69a569642c5c88),
  [`a82e6fa`](https://github.com/graphile/crystal/commit/a82e6fae099f7e9d62fb3fc1ee173368cdabca27)]:
  - grafast@1.0.0-rc.2

## 2.0.0-rc.1

### Patch Changes

- [`8a5a7c5`](https://github.com/graphile/crystal/commit/8a5a7c536fc4b9b702600c5cc3d413724670c327)
  Thanks [@benjie](https://github.com/benjie)! - Bump to release candidate

- Updated dependencies
  [[`abb623d`](https://github.com/graphile/crystal/commit/abb623d59e517c0949f0fef5440b817103c685bf),
  [`7b86454`](https://github.com/graphile/crystal/commit/7b864546fa81803ce0e573a2efa2e7f0905b2040),
  [`42a0785`](https://github.com/graphile/crystal/commit/42a0785ddabf58812a22d764eeddfde9362974e5),
  [`d196d60`](https://github.com/graphile/crystal/commit/d196d60664fbc9ffd410c11645db27554b22ac0b),
  [`c6cbe61`](https://github.com/graphile/crystal/commit/c6cbe6175b0f1f034db59d42cbe594e7d329aba6),
  [`d4ac603`](https://github.com/graphile/crystal/commit/d4ac603da7df6ea01aaa483a7cb29b1e514a90cd),
  [`8a5a7c5`](https://github.com/graphile/crystal/commit/8a5a7c536fc4b9b702600c5cc3d413724670c327),
  [`ea0135f`](https://github.com/graphile/crystal/commit/ea0135fac3f43850b65828f2ff2b01a34cfdff15),
  [`b6821f5`](https://github.com/graphile/crystal/commit/b6821f5f4dc13abd0b605be7396c1b3c36e66177)]:
  - grafast@1.0.0-rc.1

## 2.0.0-beta.37

### Patch Changes

- [#2730](https://github.com/graphile/crystal/pull/2730)
  [`4c3cf22`](https://github.com/graphile/crystal/commit/4c3cf22592f44cb28e399434474ca5fcef0e1a3b)
  Thanks [@benjie](https://github.com/benjie)! - Update `graphql` version range

- Updated dependencies
  [[`4c3cf22`](https://github.com/graphile/crystal/commit/4c3cf22592f44cb28e399434474ca5fcef0e1a3b),
  [`71e0af2`](https://github.com/graphile/crystal/commit/71e0af265c90e9d9d0dc764cc552f7470e860251),
  [`ab96e5f`](https://github.com/graphile/crystal/commit/ab96e5f58aa3315db9b85b452b048f600cb8353e),
  [`278b4d3`](https://github.com/graphile/crystal/commit/278b4d398eb7db1935caba4155e1d1727284a370),
  [`eaa771b`](https://github.com/graphile/crystal/commit/eaa771b34dbdac1c4d701faa8fb5947e9cf1d1be),
  [`d0c15cc`](https://github.com/graphile/crystal/commit/d0c15ccc32ed8dec19ff068f851529132dc93302),
  [`bffbb77`](https://github.com/graphile/crystal/commit/bffbb775ea76d1add85422866a6b7e904d2311af),
  [`c48ca48`](https://github.com/graphile/crystal/commit/c48ca4840227b8e5e6a1dc198a189cfd911a602b)]:
  - grafast@0.1.1-beta.27

## 2.0.0-beta.36

### Patch Changes

- [#2694](https://github.com/graphile/crystal/pull/2694)
  [`13513dd`](https://github.com/graphile/crystal/commit/13513ddaea15ad9498a77de7c4e92679498f99ca)
  Thanks [@benjie](https://github.com/benjie)! - Add support for `onError` RFC
  with `PROPAGATE`, `NULL` and `HALT` behaviors implemented.

- [#2678](https://github.com/graphile/crystal/pull/2678)
  [`6dafac1`](https://github.com/graphile/crystal/commit/6dafac162955291e5147c21e57734b44e30acb98)
  Thanks [@benjie](https://github.com/benjie)! - Remove peer dependency
  optionality in an attempt to satisfy pnpm's installation algorithms

- [#2676](https://github.com/graphile/crystal/pull/2676)
  [`34efed0`](https://github.com/graphile/crystal/commit/34efed09892d4b6533f40026de4a6b0a8a35035d)
  Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump mermaid from
  11.8.1 to 11.10.0

- Updated dependencies
  [[`c3f9c38`](https://github.com/graphile/crystal/commit/c3f9c38cb00ad4553e4bc3c04e16a7c77bd16142),
  [`13513dd`](https://github.com/graphile/crystal/commit/13513ddaea15ad9498a77de7c4e92679498f99ca),
  [`bc2b188`](https://github.com/graphile/crystal/commit/bc2b188a50e00f153dc68df6955399c5917130bd),
  [`c13813e`](https://github.com/graphile/crystal/commit/c13813eecb42c0d9a6703540c022e318e18c5751),
  [`4a9072b`](https://github.com/graphile/crystal/commit/4a9072bfa3d3e86c6013caf2b89a31e87f2bb421),
  [`6dafac1`](https://github.com/graphile/crystal/commit/6dafac162955291e5147c21e57734b44e30acb98),
  [`34efed0`](https://github.com/graphile/crystal/commit/34efed09892d4b6533f40026de4a6b0a8a35035d),
  [`185d449`](https://github.com/graphile/crystal/commit/185d449ed30d29c9134cc898b50a1473ab2910a2)]:
  - grafast@0.1.1-beta.26

## 2.0.0-beta.35

### Patch Changes

- [`ce9dd46`](https://github.com/graphile/crystal/commit/ce9dd46bd0625ab23ee0f728baec0479149ef895)
  Thanks [@benjie](https://github.com/benjie)! - Fix the sidebar border in
  collapsed mode

## 2.0.0-beta.34

### Patch Changes

- [#2646](https://github.com/graphile/crystal/pull/2646)
  [`59adcd5`](https://github.com/graphile/crystal/commit/59adcd52d3fd465c8d6afdcefaa41c82c9a77319)
  Thanks [@benjie](https://github.com/benjie)! - Add condensed mode for Ruru,
  enabled by default. (To disable, use the settings cog in the editor view and
  uncheck condensed.)

- [#2645](https://github.com/graphile/crystal/pull/2645)
  [`f941cfd`](https://github.com/graphile/crystal/commit/f941cfdcc8235e34716d3595745a05e49267de12)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade GraphiQL to latest
  release

- Updated dependencies
  [[`2adfd6e`](https://github.com/graphile/crystal/commit/2adfd6efedd1ab6831605526a515c683a7e95c2c),
  [`6113518`](https://github.com/graphile/crystal/commit/61135188900c39d0cb6bd2f9c0033f0954cd0e6a)]:
  - grafast@0.1.1-beta.25

## 2.0.0-beta.33

### Patch Changes

- [#2578](https://github.com/graphile/crystal/pull/2578)
  [`1d76d2f`](https://github.com/graphile/crystal/commit/1d76d2f0d19b4d56895ee9988440a35d2c60f9f9)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **Ruru has been "rebuilt"!
  The loading methods and APIs have changed!**

  Ruru is now built on top of GraphiQL v5, which moves to using the Monaco
  editor (the same editor used in VSCode) enabling more familiar keybindings and
  more features (e.g. press F1 in the editor to see the command palette, and you
  can now add comments in the variables JSON). This has required a
  rearchitecture to Ruru's previously "single file" approach since Monaco uses
  workers which require additional files.

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
    `inputValueDeprecation` and `schemaDeprecation` which you can set to false
    if your GraphQL server is, _ahem_, a little behind the GraphQL spec draft.

  🚨 **Changes you need to make:** 🚨
  - If you are using Ruru directly (i.e. importing from `ruru/server`), please
    see the new Ruru README for setup instructions, you'll want to switch out
    your previous setup. In particular, `ruru/bundle` no longer exists and you
    now need to serve the static files (via `ruru/static`).
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
    `ruruHTML` and wraps the generation of the HTML - simply trim `Parts` from
    the name and be sure calling `next()` is the final line of the function
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
  - `RuruConfig.clientConfig` has been added for props to explicitly pass to
    Ruru making it explicit that these will be sent to the client
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

- [#2605](https://github.com/graphile/crystal/pull/2605)
  [`24d379a`](https://github.com/graphile/crystal/commit/24d379ae4b8a3c0afe3f1a309d87806a05e8d00d)
  Thanks [@benjie](https://github.com/benjie)! - Add defaultTheme and
  forcedTheme props to Ruru (passed through to GraphiQL)

- Updated dependencies
  [[`c54c6db`](https://github.com/graphile/crystal/commit/c54c6db320b3967ab16784a504770c9b5ef24494),
  [`ad588ec`](https://github.com/graphile/crystal/commit/ad588ecde230359f56800e414b7c5fa1aed14957)]:
  - grafast@0.1.1-beta.24

## 2.0.0-beta.32

### Patch Changes

- [#2584](https://github.com/graphile/crystal/pull/2584)
  [`00b3b8b`](https://github.com/graphile/crystal/commit/00b3b8baea55f0f8cb90c769baf63b408a593182)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to GraphiQL v4. 🚨
  Change `graphiql/graphiql.css` to `graphiql/style.css` and
  `@graphiql/plugin-explorer/dist/style.css` to
  `@graphiql/plugin-explorer/style.css`

- [#2577](https://github.com/graphile/crystal/pull/2577)
  [`0c6b1f1`](https://github.com/graphile/crystal/commit/0c6b1f1e188f6e2913832adfed9ca76dfdc25c47)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies

- [#2582](https://github.com/graphile/crystal/pull/2582)
  [`826f2cb`](https://github.com/graphile/crystal/commit/826f2cbff651273098d6b0d8c343aefeacfb5a14)
  Thanks [@benjie](https://github.com/benjie)! - Fix button-in-button warning
  from ToolbarMenu

- [#2585](https://github.com/graphile/crystal/pull/2585)
  [`5311f9c`](https://github.com/graphile/crystal/commit/5311f9c8206fb3287b6aae6c4e7668ae920a4441)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to React 19

- [#2583](https://github.com/graphile/crystal/pull/2583)
  [`faee38b`](https://github.com/graphile/crystal/commit/faee38bbff0421bbccfaa77c0dffa5c2d44e2b92)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Upgrade to graphql-ws v6

- Updated dependencies
  [[`0c6b1f1`](https://github.com/graphile/crystal/commit/0c6b1f1e188f6e2913832adfed9ca76dfdc25c47)]:
  - grafast@0.1.1-beta.23

## 2.0.0-beta.31

### Patch Changes

- [#2444](https://github.com/graphile/crystal/pull/2444)
  [`192a27e08763ea26607344a2ea6c7f5c595cc2a3`](https://github.com/graphile/crystal/commit/192a27e08763ea26607344a2ea6c7f5c595cc2a3)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to Mermaid 11, and
  reduce verbosity of polymorphism in plan diagrams.

- [#2546](https://github.com/graphile/crystal/pull/2546)
  [`997c49648b62a93e5b915c65c49cdad1654bef3e`](https://github.com/graphile/crystal/commit/997c49648b62a93e5b915c65c49cdad1654bef3e)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue where ruru wasn't
  hiding explain output in incremental delivery results.
- Updated dependencies
  [[`0e36cb9077c76710d2e407830323f86c5038126e`](https://github.com/graphile/crystal/commit/0e36cb9077c76710d2e407830323f86c5038126e),
  [`c0c3f48fa9f60cb9a4436ea135979b779ecc71ec`](https://github.com/graphile/crystal/commit/c0c3f48fa9f60cb9a4436ea135979b779ecc71ec),
  [`cef9a37f846b4af105ac20960530d65c9f44afa9`](https://github.com/graphile/crystal/commit/cef9a37f846b4af105ac20960530d65c9f44afa9),
  [`56ce94a847c6a4094643665cbf5d3712f56140b6`](https://github.com/graphile/crystal/commit/56ce94a847c6a4094643665cbf5d3712f56140b6),
  [`192a27e08763ea26607344a2ea6c7f5c595cc2a3`](https://github.com/graphile/crystal/commit/192a27e08763ea26607344a2ea6c7f5c595cc2a3),
  [`6ef6abce15936a896156d5316020df55cf7d18e3`](https://github.com/graphile/crystal/commit/6ef6abce15936a896156d5316020df55cf7d18e3),
  [`0239c2d519300a72f545e0db7c371adae4ade2a9`](https://github.com/graphile/crystal/commit/0239c2d519300a72f545e0db7c371adae4ade2a9),
  [`0ea439d33ccef7f8d01ac5f54893ab2bbf1cbd4d`](https://github.com/graphile/crystal/commit/0ea439d33ccef7f8d01ac5f54893ab2bbf1cbd4d),
  [`8034614d1078b1bd177b6e7fcc949420614e3245`](https://github.com/graphile/crystal/commit/8034614d1078b1bd177b6e7fcc949420614e3245),
  [`459e1869a2ec58925b2bac5458af487c52a8ca37`](https://github.com/graphile/crystal/commit/459e1869a2ec58925b2bac5458af487c52a8ca37),
  [`c350e49e372ec12a4cbf04fb6b4260e01832d12b`](https://github.com/graphile/crystal/commit/c350e49e372ec12a4cbf04fb6b4260e01832d12b),
  [`3176ea3e57d626b39613a73117ef97627370ec83`](https://github.com/graphile/crystal/commit/3176ea3e57d626b39613a73117ef97627370ec83),
  [`46a42f5547c041289aa98657ebc6815f4b6c8539`](https://github.com/graphile/crystal/commit/46a42f5547c041289aa98657ebc6815f4b6c8539),
  [`be3f174c5aae8fe78a240e1bc4e1de7f18644b43`](https://github.com/graphile/crystal/commit/be3f174c5aae8fe78a240e1bc4e1de7f18644b43),
  [`576fb8bad56cb940ab444574d752e914d462018a`](https://github.com/graphile/crystal/commit/576fb8bad56cb940ab444574d752e914d462018a),
  [`9f459101fa4428aa4bac71531e75f99e33da8e17`](https://github.com/graphile/crystal/commit/9f459101fa4428aa4bac71531e75f99e33da8e17),
  [`921665df8babe2651ab3b5886ab68bb518f2125b`](https://github.com/graphile/crystal/commit/921665df8babe2651ab3b5886ab68bb518f2125b),
  [`78bb1a615754d772a5fda000e96073c91fa9eba7`](https://github.com/graphile/crystal/commit/78bb1a615754d772a5fda000e96073c91fa9eba7),
  [`ab0bcda5fc3c136eea09493a7d9ed4542975858e`](https://github.com/graphile/crystal/commit/ab0bcda5fc3c136eea09493a7d9ed4542975858e),
  [`455f4811d37ad8fff91183c7a88621bcf9d79acf`](https://github.com/graphile/crystal/commit/455f4811d37ad8fff91183c7a88621bcf9d79acf),
  [`45adaff886e7cd72b864150927be6c0cb4a7dfe8`](https://github.com/graphile/crystal/commit/45adaff886e7cd72b864150927be6c0cb4a7dfe8)]:
  - grafast@0.1.1-beta.22
  - tamedevil@0.0.0-beta.8

## 2.0.0-beta.30

### Patch Changes

- [#2426](https://github.com/graphile/crystal/pull/2426)
  [`658d46c9a5b246e3beb4ba2a004334278f7bb24d`](https://github.com/graphile/crystal/commit/658d46c9a5b246e3beb4ba2a004334278f7bb24d)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade GraphiQL and fix
  duplicate module issue

## 2.0.0-beta.29

### Patch Changes

- Updated dependencies
  [[`d34014a9a3c469154cc796086ba13719954731e5`](https://github.com/graphile/crystal/commit/d34014a9a3c469154cc796086ba13719954731e5),
  [`98516379ac355a0833a64e002f3717cc3a1d6473`](https://github.com/graphile/crystal/commit/98516379ac355a0833a64e002f3717cc3a1d6473),
  [`f8602d05eed3247c90b87c55d7af580d1698effc`](https://github.com/graphile/crystal/commit/f8602d05eed3247c90b87c55d7af580d1698effc),
  [`65df25534fa3f787ba2ab7fd9547d295ff2b1288`](https://github.com/graphile/crystal/commit/65df25534fa3f787ba2ab7fd9547d295ff2b1288),
  [`1b3c76efd27df73eab3a5a1d221ce13de4cd6b1a`](https://github.com/graphile/crystal/commit/1b3c76efd27df73eab3a5a1d221ce13de4cd6b1a),
  [`3c0a925f26f10cae627a23c49c75ccd8d76b60c8`](https://github.com/graphile/crystal/commit/3c0a925f26f10cae627a23c49c75ccd8d76b60c8),
  [`fcaeb48844156e258a037f420ea1505edb50c52a`](https://github.com/graphile/crystal/commit/fcaeb48844156e258a037f420ea1505edb50c52a),
  [`68926abc31c32ce527327ffbb1ede4b0b7be446b`](https://github.com/graphile/crystal/commit/68926abc31c32ce527327ffbb1ede4b0b7be446b),
  [`4b49dbd2df3b339a2ba3f1e9ff400fa1a125298b`](https://github.com/graphile/crystal/commit/4b49dbd2df3b339a2ba3f1e9ff400fa1a125298b),
  [`d7950e8e28ec6106a4ce2f7fe5e35d88b10eac48`](https://github.com/graphile/crystal/commit/d7950e8e28ec6106a4ce2f7fe5e35d88b10eac48),
  [`c8f1971ea4198633ec97f72f82abf65089f71a88`](https://github.com/graphile/crystal/commit/c8f1971ea4198633ec97f72f82abf65089f71a88),
  [`dd3d22eab73a8554715bf1111e30586251f69a88`](https://github.com/graphile/crystal/commit/dd3d22eab73a8554715bf1111e30586251f69a88),
  [`a120a8e43b24dfc174950cdbb69e481272a0b45e`](https://github.com/graphile/crystal/commit/a120a8e43b24dfc174950cdbb69e481272a0b45e),
  [`84f06eafa051e907a3050237ac6ee5aefb184652`](https://github.com/graphile/crystal/commit/84f06eafa051e907a3050237ac6ee5aefb184652),
  [`4a3aeaa77c8b8d2e39c1a9d05581d0c613b812cf`](https://github.com/graphile/crystal/commit/4a3aeaa77c8b8d2e39c1a9d05581d0c613b812cf),
  [`0fc2db95d90df918cf5c59ef85f22ac78d8000d3`](https://github.com/graphile/crystal/commit/0fc2db95d90df918cf5c59ef85f22ac78d8000d3),
  [`90e81a5deeae554a8be2dd55dcd01489860e96e6`](https://github.com/graphile/crystal/commit/90e81a5deeae554a8be2dd55dcd01489860e96e6),
  [`c59132eb7a93bc82493d2f1ca050db8aaea9f4d1`](https://github.com/graphile/crystal/commit/c59132eb7a93bc82493d2f1ca050db8aaea9f4d1),
  [`7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7`](https://github.com/graphile/crystal/commit/7c38cdeffe034c9b4f5cdd03a8f7f446bd52dcb7),
  [`728888b28fcd2a6fc481e0ccdfe20d41181a091f`](https://github.com/graphile/crystal/commit/728888b28fcd2a6fc481e0ccdfe20d41181a091f),
  [`f4f39092d7a51517668384945895d3b450237cce`](https://github.com/graphile/crystal/commit/f4f39092d7a51517668384945895d3b450237cce),
  [`5cf3dc9d158891eaf324b2cd4f485d1d4bbb6b5e`](https://github.com/graphile/crystal/commit/5cf3dc9d158891eaf324b2cd4f485d1d4bbb6b5e),
  [`83d3b533e702cc875b46ba2ca02bf3642b421be8`](https://github.com/graphile/crystal/commit/83d3b533e702cc875b46ba2ca02bf3642b421be8),
  [`7001138c38e09822ad13db1018c62d2cac37941e`](https://github.com/graphile/crystal/commit/7001138c38e09822ad13db1018c62d2cac37941e),
  [`e9e7e33665e22ec397e9ead054d2e4aad3eadc8c`](https://github.com/graphile/crystal/commit/e9e7e33665e22ec397e9ead054d2e4aad3eadc8c),
  [`bb6ec8d834e3e630e28316196246f514114a2296`](https://github.com/graphile/crystal/commit/bb6ec8d834e3e630e28316196246f514114a2296),
  [`2b1918d053f590cdc534c8cb81f7e74e96c1bbe6`](https://github.com/graphile/crystal/commit/2b1918d053f590cdc534c8cb81f7e74e96c1bbe6),
  [`d1ecb39693a341f85762b27012ec4ea013857b0c`](https://github.com/graphile/crystal/commit/d1ecb39693a341f85762b27012ec4ea013857b0c),
  [`042ebafe11fcf7e2ecac9b131265a55dddd42a6d`](https://github.com/graphile/crystal/commit/042ebafe11fcf7e2ecac9b131265a55dddd42a6d),
  [`fa005eb0783c58a2476add984fbdd462e0e91dbe`](https://github.com/graphile/crystal/commit/fa005eb0783c58a2476add984fbdd462e0e91dbe),
  [`df0e5a0f968cf6f9ae97b68745a9a2f391324bf5`](https://github.com/graphile/crystal/commit/df0e5a0f968cf6f9ae97b68745a9a2f391324bf5),
  [`ef4cf75acd80e6b9c700c2b5a7ace899e565ef7f`](https://github.com/graphile/crystal/commit/ef4cf75acd80e6b9c700c2b5a7ace899e565ef7f),
  [`c041fd250372c57601188b65a6411c8f440afab6`](https://github.com/graphile/crystal/commit/c041fd250372c57601188b65a6411c8f440afab6),
  [`629b45aab49151810f6efc18ac18f7d735626433`](https://github.com/graphile/crystal/commit/629b45aab49151810f6efc18ac18f7d735626433),
  [`6d19724330d50d076aab9442660fa8abddd095cb`](https://github.com/graphile/crystal/commit/6d19724330d50d076aab9442660fa8abddd095cb),
  [`ca5bc1a834df7b894088fb8602a12f9fcff55b38`](https://github.com/graphile/crystal/commit/ca5bc1a834df7b894088fb8602a12f9fcff55b38),
  [`da6f3c04efe3d8634c0bc3fcf93ac2518de85322`](https://github.com/graphile/crystal/commit/da6f3c04efe3d8634c0bc3fcf93ac2518de85322),
  [`f0bc64b71914dfdd3612f4b65370401fd85b97bc`](https://github.com/graphile/crystal/commit/f0bc64b71914dfdd3612f4b65370401fd85b97bc)]:
  - grafast@0.1.1-beta.21

## 2.0.0-beta.28

### Patch Changes

- Updated dependencies
  [[`fc9d64eb8`](https://github.com/graphile/crystal/commit/fc9d64eb8002d3b72625bc505ed76c07f4296d68),
  [`a2dbad945`](https://github.com/graphile/crystal/commit/a2dbad9457195bec797d72e4e6d45f45278f9f69),
  [`31078842a`](https://github.com/graphile/crystal/commit/31078842ad0eeaa7111491fa9eb5e3bd026fb38a),
  [`5a0ec31de`](https://github.com/graphile/crystal/commit/5a0ec31deae91f1dd17a77a4bb7c1a911a27e26a)]:
  - grafast@0.1.1-beta.20

## 2.0.0-beta.27

### Patch Changes

- Updated dependencies []:
  - grafast@0.1.1-beta.19

## 2.0.0-beta.26

### Patch Changes

- Updated dependencies
  [[`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)]:
  - grafast@0.1.1-beta.18

## 2.0.0-beta.25

### Patch Changes

- [#2266](https://github.com/graphile/crystal/pull/2266)
  [`38163c86a`](https://github.com/graphile/crystal/commit/38163c86ae628fed84cf38fc6a1cc76a7bc7932a)
  Thanks [@hos](https://github.com/hos)! - Fix white-screen-of-death caused by
  EventSource disconnection. Instead, handle errors gracefully. Also, allow
  overriding of the EventSource configuration options.
- Updated dependencies
  [[`69ab227b5`](https://github.com/graphile/crystal/commit/69ab227b5e1c057a6fc8ebba87bde80d5aa7f3c8)]:
  - grafast@0.1.1-beta.17

## 2.0.0-beta.24

### Patch Changes

- Updated dependencies
  [[`76c7340b7`](https://github.com/graphile/crystal/commit/76c7340b74d257c454beec883384d19ef078b21e)]:
  - grafast@0.1.1-beta.16

## 2.0.0-beta.23

### Patch Changes

- Updated dependencies
  [[`d5834def1`](https://github.com/graphile/crystal/commit/d5834def1fb84f3e2c0c0a6f146f8249a6df890a),
  [`42b982463`](https://github.com/graphile/crystal/commit/42b9824637a6c05e02935f2b05b5e8e0c61965a6),
  [`884a4b429`](https://github.com/graphile/crystal/commit/884a4b4297af90fdadaf73addd524f1fbbcfdcce),
  [`38835313a`](https://github.com/graphile/crystal/commit/38835313ad93445206dccdd4cf07b90c5a6e4377),
  [`b0865d169`](https://github.com/graphile/crystal/commit/b0865d1691105b5419009954c98c8109a27a5d81)]:
  - grafast@0.1.1-beta.15

## 2.0.0-beta.22

### Patch Changes

- Updated dependencies
  [[`871d32b2a`](https://github.com/graphile/crystal/commit/871d32b2a18df0d257880fc54a61d9e68c4607d6),
  [`a26e3a30c`](https://github.com/graphile/crystal/commit/a26e3a30c02f963f8f5e9c9d021e871f33689e1b),
  [`02c11a4d4`](https://github.com/graphile/crystal/commit/02c11a4d42bf434dffc9354b300e8d791c4eeb2d)]:
  - grafast@0.1.1-beta.14

## 2.0.0-beta.21

### Patch Changes

- Updated dependencies
  [[`807650035`](https://github.com/graphile/crystal/commit/8076500354a3e2bc2de1b6c4e947bd710cc5bddc)]:
  - grafast@0.1.1-beta.13

## 2.0.0-beta.20

### Patch Changes

- [#2125](https://github.com/graphile/crystal/pull/2125)
  [`18addb385`](https://github.com/graphile/crystal/commit/18addb3852525aa91019a36d58fa2fecd8b5b443)
  Thanks [@benjie](https://github.com/benjie)! - Change how unary steps are
  rendered to plan diagrams, fixing the rendering of side-effect steps.

- [#2124](https://github.com/graphile/crystal/pull/2124)
  [`cf535c210`](https://github.com/graphile/crystal/commit/cf535c21078da06c14dd12f30e9b4378da4ded03)
  Thanks [@benjie](https://github.com/benjie)! - Render implicit side effects as
  dependencies on plan diagram

- Updated dependencies
  [[`1bd50b61e`](https://github.com/graphile/crystal/commit/1bd50b61ebb10b7d09b3612c2e2767c41cca3b78),
  [`4e102b1a1`](https://github.com/graphile/crystal/commit/4e102b1a1cd232e6f6703df0706415f01831dab2),
  [`7bb1573ba`](https://github.com/graphile/crystal/commit/7bb1573ba45a4d8b7fa9ad53cdd79686d2641383),
  [`18addb385`](https://github.com/graphile/crystal/commit/18addb3852525aa91019a36d58fa2fecd8b5b443),
  [`6ed615e55`](https://github.com/graphile/crystal/commit/6ed615e557b2ab1fb57f1e68c06730a8e3da7175),
  [`b25cc539c`](https://github.com/graphile/crystal/commit/b25cc539c00aeda7a943c37509aaae4dc7812317),
  [`867f33136`](https://github.com/graphile/crystal/commit/867f331365346fc46ed1e0d23c79719846e398f4),
  [`cf535c210`](https://github.com/graphile/crystal/commit/cf535c21078da06c14dd12f30e9b4378da4ded03),
  [`acf99b190`](https://github.com/graphile/crystal/commit/acf99b190954e3c5926e820daed68dfe8eb3ee1f),
  [`4967a197f`](https://github.com/graphile/crystal/commit/4967a197fd2c71ee2a581fe29470ee9f30e74de5),
  [`1908e1ba1`](https://github.com/graphile/crystal/commit/1908e1ba11883a34dac66f985fc20ab160e572b1),
  [`084d80be6`](https://github.com/graphile/crystal/commit/084d80be6e17187c9a9932bcf079e3f460368782)]:
  - grafast@0.1.1-beta.12

## 2.0.0-beta.19

### Patch Changes

- Updated dependencies
  [[`582bd768f`](https://github.com/graphile/crystal/commit/582bd768fec403ce3284f293b85b9fd86e4d3f40)]:
  - grafast@0.1.1-beta.11

## 2.0.0-beta.18

### Patch Changes

- Updated dependencies
  [[`3c161f7e1`](https://github.com/graphile/crystal/commit/3c161f7e13375105b1035a7d5d1c0f2b507ca5c7),
  [`a674a9923`](https://github.com/graphile/crystal/commit/a674a9923bc908c9315afa40e0cb256ee0953d16),
  [`b7cfeffd1`](https://github.com/graphile/crystal/commit/b7cfeffd1019d61c713a5054c4f5929960a2a6ab)]:
  - grafast@0.1.1-beta.10

## 2.0.0-beta.17

### Patch Changes

- Updated dependencies
  [[`437570f97`](https://github.com/graphile/crystal/commit/437570f97e8520afaf3d0d0b514d1f4c31546b76)]:
  - grafast@0.1.1-beta.9

## 2.0.0-beta.16

### Patch Changes

- Updated dependencies
  [[`bd5a908a4`](https://github.com/graphile/crystal/commit/bd5a908a4d04310f90dfb46ad87398ffa993af3b)]:
  - grafast@0.1.1-beta.8

## 2.0.0-beta.15

### Patch Changes

- Updated dependencies
  [[`357d475f5`](https://github.com/graphile/crystal/commit/357d475f54fecc8c51892e0346d6872b34132430),
  [`3551725e7`](https://github.com/graphile/crystal/commit/3551725e71c3ed876554e19e5ab2c1dcb0fb1143),
  [`80836471e`](https://github.com/graphile/crystal/commit/80836471e5cedb29dee63bc5002550c4f1713cfd),
  [`b788dd868`](https://github.com/graphile/crystal/commit/b788dd86849e703cc3aa863fd9190c36a087b865),
  [`a5c20fefb`](https://github.com/graphile/crystal/commit/a5c20fefb571dea6d1187515dc48dd547e9e6204),
  [`1ce08980e`](https://github.com/graphile/crystal/commit/1ce08980e2a52ed9bc81564d248c19648ecd3616),
  [`dff4f2535`](https://github.com/graphile/crystal/commit/dff4f2535ac6ce893089b312fcd5fffcd98573a5),
  [`a287a57c2`](https://github.com/graphile/crystal/commit/a287a57c2765da0fb6a132ea0953f64453210ceb),
  [`2fe56f9a6`](https://github.com/graphile/crystal/commit/2fe56f9a6dac03484ace45c29c2223a65f9ca1db),
  [`fed603d71`](https://github.com/graphile/crystal/commit/fed603d719c02f33e12190f925c9e3b06c581fac),
  [`ed6e0d278`](https://github.com/graphile/crystal/commit/ed6e0d2788217a1c419634837f4208013eaf2923),
  [`e82e4911e`](https://github.com/graphile/crystal/commit/e82e4911e32138df1b90ec0fde555ea963018d21),
  [`42ece5aa6`](https://github.com/graphile/crystal/commit/42ece5aa6ca05345ebc17fb5c7d55df3b79b7612),
  [`e0d69e518`](https://github.com/graphile/crystal/commit/e0d69e518a98c70f9b90f59d243ce33978c1b5a1),
  [`6699388ec`](https://github.com/graphile/crystal/commit/6699388ec167d35c71220ce5d9113cac578da6cb),
  [`966203504`](https://github.com/graphile/crystal/commit/96620350467ab8c65b56adf2f055e19450f8e772),
  [`c1645b249`](https://github.com/graphile/crystal/commit/c1645b249aae949a548cd916e536ccfb63e5ab35),
  [`ed8bbaa3c`](https://github.com/graphile/crystal/commit/ed8bbaa3cd1563a7601ca8c6b0412633b0ea4ce9),
  [`a0e82b9c5`](https://github.com/graphile/crystal/commit/a0e82b9c5f4e585f1af1e147299cd07944ece6f8),
  [`14e2412ee`](https://github.com/graphile/crystal/commit/14e2412ee368e8d53abf6774c7f0069f32d4e8a3),
  [`57ab0e1e7`](https://github.com/graphile/crystal/commit/57ab0e1e72c01213b21d3efc539cd655d83d993a),
  [`8442242e4`](https://github.com/graphile/crystal/commit/8442242e43cac7d89ca0c413cf42c9fabf6f247f),
  [`64ce7b765`](https://github.com/graphile/crystal/commit/64ce7b7650530251aec38a51089da66f914c19b4),
  [`cba842357`](https://github.com/graphile/crystal/commit/cba84235786acbd77ade53bae7a3fba4a9be1eb7),
  [`2fa77d0f2`](https://github.com/graphile/crystal/commit/2fa77d0f237cdb98d3dafb6b5e4083a2c6c38673)]:
  - grafast@0.1.1-beta.7
  - tamedevil@0.0.0-beta.7

## 2.0.0-beta.14

### Patch Changes

- Updated dependencies
  [[`9f85c614d`](https://github.com/graphile/crystal/commit/9f85c614d48dc745c5fed15333dbb75af7fddc88),
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de),
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)]:
  - grafast@0.1.1-beta.6
  - tamedevil@0.0.0-beta.6

## 2.0.0-beta.13

### Patch Changes

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`dfac3f790`](https://github.com/graphile/crystal/commit/dfac3f790ec5c446c132202dde624aeeb75b5a6d)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue where headers weren't
  sent via websocket connectionParams

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`941e28003`](https://github.com/graphile/crystal/commit/941e280038a735014a9fe4e24fc534a197fac0f2)
  Thanks [@benjie](https://github.com/benjie)! - Add support for deprecated
  arguments to Ruru.

- [#1931](https://github.com/graphile/crystal/pull/1931)
  [`068be2f51`](https://github.com/graphile/crystal/commit/068be2f51d7a9c17311f26c6c9451985397c9e1f)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue typing into Ruru
  explorer plugin - characters no longer overwritten.

- Updated dependencies
  [[`49fd8afed`](https://github.com/graphile/crystal/commit/49fd8afed1afe573ea76a2a7a821dfa5d6288e2d),
  [`63dd7ea99`](https://github.com/graphile/crystal/commit/63dd7ea992d30ad711dd85a73a127484a0e35479),
  [`d801c9778`](https://github.com/graphile/crystal/commit/d801c9778a86d61e060896460af9fe62a733534a),
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195),
  [`8ea67f891`](https://github.com/graphile/crystal/commit/8ea67f8910693edaf70daa9952e35d8396166f38)]:
  - tamedevil@0.0.0-beta.5
  - grafast@0.1.1-beta.5

## 2.0.0-beta.12

### Patch Changes

- Updated dependencies
  [[`1b6c2f636`](https://github.com/graphile/crystal/commit/1b6c2f6360a316a8dc550c60e28c61deea538f19),
  [`a2176ea32`](https://github.com/graphile/crystal/commit/a2176ea324db0801249661b30e9c9d314c6fb159),
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044)]:
  - tamedevil@0.0.0-beta.4
  - grafast@0.1.1-beta.4

## 2.0.0-beta.11

### Patch Changes

- Updated dependencies []:
  - grafast@0.1.1-beta.3

## 2.0.0-beta.10

### Patch Changes

- Updated dependencies
  [[`3fdc2bce4`](https://github.com/graphile/crystal/commit/3fdc2bce42418773f808c5b8309dfb361cd95ce9),
  [`aeef362b5`](https://github.com/graphile/crystal/commit/aeef362b5744816f01e4a6f714bbd77f92332bc5),
  [`8a76db07f`](https://github.com/graphile/crystal/commit/8a76db07f4c110cecc6225504f9a05ccbcbc7b92),
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f),
  [`1c9f1c0ed`](https://github.com/graphile/crystal/commit/1c9f1c0edf4e621a5b6345d3a41527a18143c6ae)]:
  - grafast@0.1.1-beta.2

## 2.0.0-beta.9

### Patch Changes

- [#1833](https://github.com/graphile/crystal/pull/1833)
  [`11ceb1753`](https://github.com/graphile/crystal/commit/11ceb1753ee42ee6d991e618dedc670a6f238fab)
  Thanks [@benjie](https://github.com/benjie)! - Rework how schema fetching
  works to solve issue with headers not being sent. Thanks @JoviDeCroock for the
  inspiration.
- Updated dependencies
  [[`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f)]:
  - grafast@0.1.1-beta.1

## 2.0.0-beta.8

### Patch Changes

- [#1799](https://github.com/graphile/crystal/pull/1799)
  [`3dd5d86d6`](https://github.com/graphile/crystal/commit/3dd5d86d6c1ea7ba106c08e8a315ec47ed6cfa2d)
  Thanks [@jvandermey](https://github.com/jvandermey)! - Can now pass onEdit
  callbacks through the Ruru config via the plugin system; e.g. to update the
  URL search params with the current editor state.

## 2.0.0-beta.7

### Patch Changes

- [#1796](https://github.com/graphile/crystal/pull/1796)
  [`ebb0b817e`](https://github.com/graphile/crystal/commit/ebb0b817e3efe210445d3f3396ff4bc53ebab3e7)
  Thanks [@benjie](https://github.com/benjie)! - Can now set initial query and
  variables in Ruru via the plugin system; e.g. to set query/variables based on
  query string.

## 2.0.0-beta.6

### Patch Changes

- Updated dependencies
  [[`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8),
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434),
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)]:
  - grafast@0.1.1-beta.0

## 2.0.0-beta.5

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

- Updated dependencies
  [[`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b),
  [`ede1092fe`](https://github.com/graphile/crystal-pre-merge/commit/ede1092fe197719b6fa786f4cfa75f6a1f4c56c1),
  [`566983fbd`](https://github.com/graphile/crystal-pre-merge/commit/566983fbd99c4b2df8c4ebd6260521670a2b7dfc),
  [`409bf6071`](https://github.com/graphile/crystal-pre-merge/commit/409bf607180d4d8faec658c803e5ec4d1a00c451)]:
  - grafast@0.0.1-beta.8
  - tamedevil@0.0.0-beta.3

## 2.0.0-beta.4

### Patch Changes

- Updated dependencies
  [[`3700e204f`](https://github.com/benjie/crystal/commit/3700e204f430db182c92ca7abc82017c81fa1f9b)]:
  - grafast@0.0.1-beta.7

## 2.0.0-beta.3

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- [#496](https://github.com/benjie/crystal/pull/496)
  [`1867d365f`](https://github.com/benjie/crystal/commit/1867d365f360ac8411f622b0813ca76a19ab4013)
  Thanks [@benjie](https://github.com/benjie)! - Ruru now runs on React 18

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c747d91e9`](https://github.com/benjie/crystal/commit/c747d91e9646409c66e73c12195dbf6cbd97b211)
  Thanks [@benjie](https://github.com/benjie)! - Modules converted to ESM to fix
  compatibility with GraphiQL.

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1),
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)]:
  - grafast@0.0.1-beta.6
  - tamedevil@0.0.0-beta.2

## 2.0.0-beta.2

### Patch Changes

- [#488](https://github.com/benjie/crystal/pull/488)
  [`9f82b8612`](https://github.com/benjie/crystal/commit/9f82b861206fdd2b8a7c50ba5184112dfb57b54a)
  Thanks [@benjie](https://github.com/benjie)! - Fix detection of SQL aliases

## 2.0.0-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

## 2.0.0-alpha.2

### Patch Changes

- [`2fe247f75`](https://github.com/benjie/crystal/commit/2fe247f751377e18b3d6809cba39a01aa1602dbc)
  Thanks [@benjie](https://github.com/benjie)! - Added ability to download
  mermaid plan diagram as SVG.

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

## 2.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

## 2.0.0-1.1

### Patch Changes

- [#267](https://github.com/benjie/crystal/pull/267)
  [`159735204`](https://github.com/benjie/crystal/commit/15973520462d4a95e3cdf04fdacfc71ca851122f)
  Thanks [@benjie](https://github.com/benjie)! - Add formatting for SQL aliases

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

## 2.0.0-0.9

### Patch Changes

- [`612092359`](undefined) - Fix header saving

## 2.0.0-0.8

### Patch Changes

- [#229](https://github.com/benjie/crystal/pull/229)
  [`b795b3da5`](https://github.com/benjie/crystal/commit/b795b3da5f8e8f13c495be3a8cf71667f3d149f8)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade GraphiQL, gaining the
  watch mode fix.

## 2.0.0-0.7

### Patch Changes

- [#200](https://github.com/benjie/crystal/pull/200)
  [`e11698473`](https://github.com/benjie/crystal/commit/e1169847303790570bfafa07eb25d8fce53a0391)
  Thanks [@benjie](https://github.com/benjie)! - Add support for websocket
  subscriptions to Ruru.

## 2.0.0-0.6

### Patch Changes

- [`a40fa6966`](undefined) - Default to explain enabled. Fix issues with fetcher
  mutating immutable objects. Fix typo in README. Fix playground on grafast
  website.

## 2.0.0-0.5

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo
