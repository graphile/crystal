# graphile-build

## 5.0.0-beta.30

### Patch Changes

- Updated dependencies
  [[`7580bc16a`](https://github.com/graphile/crystal/commit/7580bc16a050fd8d916c6dabe9d1ded980090349),
  [`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)]:
  - graphile-config@0.0.1-beta.13
  - grafast@0.1.1-beta.18

## 5.0.0-beta.29

### Patch Changes

- [#2251](https://github.com/graphile/crystal/pull/2251)
  [`555d65cce`](https://github.com/graphile/crystal/commit/555d65ccecb875f1e34cb40108176f0ddc11df64)
  Thanks [@benjie](https://github.com/benjie)! - We now enforce GraphQL name
  checks earlier and supply more information to better reveal where any invalid
  names are originating.

- [#2251](https://github.com/graphile/crystal/pull/2251)
  [`efa25d97d`](https://github.com/graphile/crystal/commit/efa25d97df2e00f13bc29806d396a8366a121031)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **Inflection changes!** V4
  preset should be (mostly) unaffected, but Amber preset will likely have
  changes between `ID` and `ROW_ID` in various places, plus missing underscores
  may reappear/etc. Be sure to diff your schema before/after this update (as you
  should with every update... and to be honest, with everything else that
  changes your schema).

  Normally `camelCase`/`upperCamelCase`/`constantCase`/etc are the final step
  before we name a field/type/enumValue/etc; however it turns out that some
  inflectors were using the camel-cased output as input to their own
  inflection - for example, when calculating the name of a relation it would
  take the column names _camel-cased_ and then combine them into a string which
  was then camel-cased again. Even worse, when these values are then used in an
  enum, it would then be _constant-cased_, so you end up with string 👉
  camel-case 👉 concatenate 👉 camel-case 👉 concatenate 👉 constant-case. This
  lead to certain edge cases where fields with numbers or underscores may come
  out in unexpected ways.

  This release creates "raw" backing inflectors for a few things that remove the
  final step (camel-casing) so that later usage may choose to use the raw value
  rather than the camel-cased value. And due to this, we've also moved the `id`
  👉 `rowId` tweaks from the `attribute()` inflector into the `_attributeName()`
  inflector - which is where most of the changes have come from. We've undone
  this change in the V4 preset, so if you don't use the V5 preset but need to
  undo this change, please check out the V4 overrides of:

  - [`_attributeName`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L135-L145)
  - [`_joinAttributeNames`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/plugins/PgV4InflectionPlugin.ts#L131-L138)
  - [`attribute`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L158-L169)

  Note: the V4 preset is fairly stable, but the Amber preset is being constantly
  iterated to improve the OOTB V5 experience - it will only be stable once
  V5.0.0 is released.

- [#2250](https://github.com/graphile/crystal/pull/2250)
  [`86e228299`](https://github.com/graphile/crystal/commit/86e22829996a745dc1f8cbaf32e709b1bd346e79)
  Thanks [@benjie](https://github.com/benjie)! - Integrate preset.lib into build
  and gather context so plugins can use modules without needing to install
  dependencies (and thus avoiding the dual package hazard).
- Updated dependencies
  [[`69ab227b5`](https://github.com/graphile/crystal/commit/69ab227b5e1c057a6fc8ebba87bde80d5aa7f3c8),
  [`d13b76f0f`](https://github.com/graphile/crystal/commit/d13b76f0fef2a58466ecb44880af62d25910e83e),
  [`b167bd849`](https://github.com/graphile/crystal/commit/b167bd8499be5866b71bac6594d55bd768fda1d0),
  [`6a13ecbd4`](https://github.com/graphile/crystal/commit/6a13ecbd45534c39c846c1d8bc58242108426dd1)]:
  - grafast@0.1.1-beta.17
  - graphile-config@0.0.1-beta.12

## 5.0.0-beta.28

### Patch Changes

- Updated dependencies
  [[`5626c7d36`](https://github.com/graphile/crystal/commit/5626c7d3649285e11fe9857dfa319d2883d027eb),
  [`76c7340b7`](https://github.com/graphile/crystal/commit/76c7340b74d257c454beec883384d19ef078b21e)]:
  - graphile-config@0.0.1-beta.11
  - grafast@0.1.1-beta.16

## 5.0.0-beta.27

### Patch Changes

- [#2208](https://github.com/graphile/crystal/pull/2208)
  [`632691409`](https://github.com/graphile/crystal/commit/6326914098af55f20ac85ccf3537e75910a7dafa)
  Thanks [@benjie](https://github.com/benjie)! - Behaviors can now be registered
  by more than one plugin. Apply behaviors to more entities. Don't log so much.

## 5.0.0-beta.26

### Patch Changes

- [#2207](https://github.com/graphile/crystal/pull/2207)
  [`0b1f7b577`](https://github.com/graphile/crystal/commit/0b1f7b577114a49b8e3283823845ec6e37484240)
  Thanks [@benjie](https://github.com/benjie)! - Fix overwhelming logs and
  errors being output by the new behavior system

## 5.0.0-beta.25

### Patch Changes

- [#2156](https://github.com/graphile/crystal/pull/2156)
  [`653929af0`](https://github.com/graphile/crystal/commit/653929af0a99a8a4d52b66e66c736be668b8700a)
  Thanks [@benjie](https://github.com/benjie)! - Improve error message when
  `build.getTypeByName` and related methods are called before the 'init' phase
  is complete.

- [#2198](https://github.com/graphile/crystal/pull/2198)
  [`eb69c7361`](https://github.com/graphile/crystal/commit/eb69c7361fc7bf8c5b1ce342eeb698bd28c9e013)
  Thanks [@benjie](https://github.com/benjie)! - Fix incorrect context type used
  for GraphQLSchema_types hook, and add `config` to same context.

- [#2160](https://github.com/graphile/crystal/pull/2160)
  [`54054b873`](https://github.com/graphile/crystal/commit/54054b8733236ba7b2f2fa47d84e085f7196e3f9)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug where creating the
  build object also initialized it; this is incorrect since if you just want the
  build object you don't necessarily want to register all of the GraphQL types
  (and potentially discover naming conflicts) at that moment. Introduced new
  `schemaBuilder.initBuild(schemaBuilder.createBuild(input))` API to explicitly
  handle initing if you need an initialized build object.

- [#2160](https://github.com/graphile/crystal/pull/2160)
  [`426e9320e`](https://github.com/graphile/crystal/commit/426e9320e76ef95927eebb6fe4072050b6208771)
  Thanks [@benjie](https://github.com/benjie)! - Massive overhaul of the
  behavior system which now has a centralized registry of known behaviors and
  applies behaviors in a more careful and nuanced way, removing many hacks and
  workarounds, and ultimately meaning that `defaultBehavior: "-*"` should now
  operate correctly. Importantly, `addBehaviorToTags()` has been removed - you
  should use `plugin.schema.entityBehaviors` to indicate behaviors as shown in
  this PR - do not mod the tags directly unless they're explicitly meant to be
  overrides.

  Technically this is a significant breaking change (besides the removal of the
  `addBehaviorToTags()` helper) because the order in which behaviors are applied
  has changed, and so a different behavior might ultimately "win". This shows up
  in places where there is ambiguity, for example if you add `@filterable` to a
  function that you don't have execute permissions on, that function will now
  show up in the schema since user overrides (smart tags) "win" versus inferred
  behaviors such as introspected permissions; this wasn't the case before.
  Hopefully most users will not notice any difference, and for those who do, the
  `graphile behavior debug` CLI may be able to help you figure out what's going
  on.

  Be sure to print your schema before and after this update and look for
  changes; if there are changes then you likely need to fix the relevant
  behaviors/smart tags. (Hopefully there's no changes for you!)

  You'll also need to change any places where you're specifying behaviors that
  will be type checked; you can either cast your existing strings e.g.
  `defaultBehavior: "+connection -list" as GraphileBuild.BehaviorString`, or
  preferably you can specify your behaviors as an array, which should give you
  auto-complete on each entry; e.g. `defaultBehavior: ["connection", "-list"]`.

- [#2199](https://github.com/graphile/crystal/pull/2199)
  [`3b09b414f`](https://github.com/graphile/crystal/commit/3b09b414ff43c34593373fa1f242481b0c7ada70)
  Thanks [@benjie](https://github.com/benjie)! - Database enum comments are now
  reflected in the schema.

- [#2155](https://github.com/graphile/crystal/pull/2155)
  [`8b472cd51`](https://github.com/graphile/crystal/commit/8b472cd51cd66d8227f9f2722d09c0a774792b0f)
  Thanks [@benjie](https://github.com/benjie)! - `disablePlugins` now supports
  TypeScript auto-completion of known plugin names. Other names are still
  accepted without error, so this is just a minor DX improvement rather than
  type safety.

- [#2198](https://github.com/graphile/crystal/pull/2198)
  [`ba637b56d`](https://github.com/graphile/crystal/commit/ba637b56d79a14f82fe555739921724eab0c07f7)
  Thanks [@benjie](https://github.com/benjie)! - Ensure that interface subtypes
  are added to schema even if not referenced directly.
- Updated dependencies
  [[`d5834def1`](https://github.com/graphile/crystal/commit/d5834def1fb84f3e2c0c0a6f146f8249a6df890a),
  [`42b982463`](https://github.com/graphile/crystal/commit/42b9824637a6c05e02935f2b05b5e8e0c61965a6),
  [`884a4b429`](https://github.com/graphile/crystal/commit/884a4b4297af90fdadaf73addd524f1fbbcfdcce),
  [`38835313a`](https://github.com/graphile/crystal/commit/38835313ad93445206dccdd4cf07b90c5a6e4377),
  [`cc0941731`](https://github.com/graphile/crystal/commit/cc0941731a1679bc04ce7b7fd4254009bb5f1f62),
  [`b0865d169`](https://github.com/graphile/crystal/commit/b0865d1691105b5419009954c98c8109a27a5d81),
  [`8b472cd51`](https://github.com/graphile/crystal/commit/8b472cd51cd66d8227f9f2722d09c0a774792b0f),
  [`9cd9bb522`](https://github.com/graphile/crystal/commit/9cd9bb5222a9f0398ee4b8bfa4f741b6de2a2192)]:
  - grafast@0.1.1-beta.15
  - graphile-config@0.0.1-beta.10

## 5.0.0-beta.24

### Patch Changes

- [#2143](https://github.com/graphile/crystal/pull/2143)
  [`e8a0c4441`](https://github.com/graphile/crystal/commit/e8a0c4441cd04402974cd0af6b80816c9cda91e7)
  Thanks [@benjie](https://github.com/benjie)! - Add `Self.name` and
  `scope.valueName` to context for `GraphQLEnumType_values_value` hook
- Updated dependencies
  [[`871d32b2a`](https://github.com/graphile/crystal/commit/871d32b2a18df0d257880fc54a61d9e68c4607d6),
  [`a26e3a30c`](https://github.com/graphile/crystal/commit/a26e3a30c02f963f8f5e9c9d021e871f33689e1b),
  [`02c11a4d4`](https://github.com/graphile/crystal/commit/02c11a4d42bf434dffc9354b300e8d791c4eeb2d)]:
  - grafast@0.1.1-beta.14

## 5.0.0-beta.23

### Patch Changes

- Updated dependencies
  [[`807650035`](https://github.com/graphile/crystal/commit/8076500354a3e2bc2de1b6c4e947bd710cc5bddc)]:
  - grafast@0.1.1-beta.13

## 5.0.0-beta.22

### Patch Changes

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

## 5.0.0-beta.21

### Patch Changes

- [#2071](https://github.com/graphile/crystal/pull/2071)
  [`582bd768f`](https://github.com/graphile/crystal/commit/582bd768fec403ce3284f293b85b9fd86e4d3f40)
  Thanks [@benjie](https://github.com/benjie)! - `GrafastExecutionArgs` now
  accepts `resolvedPreset` and `requestContext` directly; passing these through
  additional arguments is now deprecated and support will be removed in a future
  revision. This affects:

  - `grafast()`
  - `execute()`
  - `subscribe()`
  - `hookArgs()`

  `graphile-config` has gained a middleware system which is more powerful than
  it's AsyncHooks system. Old hooks can be emulated through the middleware
  system safely since middleware is a superset of hooks' capabilities.
  `applyHooks` has been renamed to `orderedApply` (because it applies to more
  than just hooks), calling `applyHooks` will still work but is deprecated.

  🚨 `grafast` no longer automatically reads your `graphile.config.ts` or
  similar; you must do that yourself and pass the `resolvedPreset` to grafast
  via the `args`. This is to aid in bundling of grafast since it should not need
  to read from filesystem or dynamically load modules.

  `grafast` no longer outputs performance warning when you set
  `GRAPHILE_ENV=development`.

  🚨 `plugin.grafast.hooks.args` is now `plugin.grafast.middleware.prepareArgs`,
  and the signature has changed - you must be sure to call the `next()` function
  and ctx/resolvedPreset can be extracted directly from `args`:

  ```diff
   const plugin = {
     grafast: {
  -    hooks: {
  +    middleware: {
  -      args({ args, ctx, resolvedPreset }) {
  +      prepareArgs(next, { args }) {
  +        const { requestContext: ctx, resolvedPreset } = args;
           // ...
  +        return next();
         }
       }
     }
   }
  ```

  Many more middleware have been added; use TypeScript's autocomplete to see
  what's available until we have proper documentation for them.

  `plugin.grafserv.hooks.*` are still supported but deprecated; instead use
  middleware `plugin.grafserv.middleware.*` (note that call signatures have
  changed slightly, similar to the diff above):

  - `hooks.init` -> `middleware.setPreset`
  - `hooks.processGraphQLRequestBody` -> `middleware.processGraphQLRequestBody`
  - `hooks.ruruHTMLParts` -> `middleware.ruruHTMLParts`

  A few TypeScript types related to Hooks have been renamed, but their old names
  are still available, just deprecated. They will be removed in a future update:

  - `HookObject` -> `FunctionalityObject`
  - `PluginHook` -> `CallbackOrDescriptor`
  - `PluginHookObject` -> `CallbackDescriptor`
  - `PluginHookCallback` -> `UnwrapCallback`

- Updated dependencies
  [[`582bd768f`](https://github.com/graphile/crystal/commit/582bd768fec403ce3284f293b85b9fd86e4d3f40)]:
  - graphile-config@0.0.1-beta.9
  - grafast@0.1.1-beta.11

## 5.0.0-beta.20

### Patch Changes

- Updated dependencies
  [[`3c161f7e1`](https://github.com/graphile/crystal/commit/3c161f7e13375105b1035a7d5d1c0f2b507ca5c7),
  [`a674a9923`](https://github.com/graphile/crystal/commit/a674a9923bc908c9315afa40e0cb256ee0953d16),
  [`b7cfeffd1`](https://github.com/graphile/crystal/commit/b7cfeffd1019d61c713a5054c4f5929960a2a6ab)]:
  - grafast@0.1.1-beta.10

## 5.0.0-beta.19

### Patch Changes

- Updated dependencies
  [[`437570f97`](https://github.com/graphile/crystal/commit/437570f97e8520afaf3d0d0b514d1f4c31546b76)]:
  - grafast@0.1.1-beta.9

## 5.0.0-beta.18

### Patch Changes

- [#2056](https://github.com/graphile/crystal/pull/2056)
  [`1842af661`](https://github.com/graphile/crystal/commit/1842af661950d5f962b65f6362a45a3b9c8f15e8)
  Thanks [@benjie](https://github.com/benjie)! - Improve exporting of resource
  options (neater export code)

- Updated dependencies
  [[`bd5a908a4`](https://github.com/graphile/crystal/commit/bd5a908a4d04310f90dfb46ad87398ffa993af3b)]:
  - grafast@0.1.1-beta.8

## 5.0.0-beta.17

### Patch Changes

- [#2006](https://github.com/graphile/crystal/pull/2006)
  [`7ad35fe4d`](https://github.com/graphile/crystal/commit/7ad35fe4d9b20f6ec82dc95c362390a87e25b42c)
  Thanks [@benjie](https://github.com/benjie)! - When replacing inflectors via
  `plugin.inflection.replace.<inflector_name>` the first argument is the
  previous inflector (or null). Previously this was typed including the
  `this: Inflection` argument which meant to appease TypeScript you needed to do
  `previous.call(this, arg1, arg2)`, but this was never necessary in JS. This is
  now fixed, and you can now issue `previous(arg1, arg2)` from TypeScript
  without error.

- [#2050](https://github.com/graphile/crystal/pull/2050)
  [`272608c13`](https://github.com/graphile/crystal/commit/272608c135e4ef0f76b8b5a9f764494a3f3ad779)
  Thanks [@benjie](https://github.com/benjie)! - Add missing EXPORTABLE (and
  remove excessive EXPORTABLE) to fix schema exports.

- [#2006](https://github.com/graphile/crystal/pull/2006)
  [`bee0a0a68`](https://github.com/graphile/crystal/commit/bee0a0a68d48816f84b1a7f5ec69bd6069211426)
  Thanks [@benjie](https://github.com/benjie)! - Adopt improved inflection
  typings.

- Updated dependencies
  [[`357d475f5`](https://github.com/graphile/crystal/commit/357d475f54fecc8c51892e0346d6872b34132430),
  [`3551725e7`](https://github.com/graphile/crystal/commit/3551725e71c3ed876554e19e5ab2c1dcb0fb1143),
  [`80836471e`](https://github.com/graphile/crystal/commit/80836471e5cedb29dee63bc5002550c4f1713cfd),
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
  [`db8ceed0f`](https://github.com/graphile/crystal/commit/db8ceed0f17923eb78ff09c9f3f28800a5c7e3b6),
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
  - graphile-config@0.0.1-beta.8

## 5.0.0-beta.16

### Patch Changes

- [#1955](https://github.com/graphile/crystal/pull/1955)
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de)
  Thanks [@benjie](https://github.com/benjie)! - Steps are now prevented from
  calling other steps' lifecycle methods. GRAPHILE_ENV is actively encouraged,
  and falls back to NODE_ENV.

- [#1949](https://github.com/graphile/crystal/pull/1949)
  [`179d25b09`](https://github.com/graphile/crystal/commit/179d25b09bb3272eeef564067b8e512d8de0112f)
  Thanks [@benjie](https://github.com/benjie)! - Add support for registering
  PgCodecs via plugins, add support for ltree type, improve error messages, no
  longer need to set a gather namespace to use cache/state.

- [#1958](https://github.com/graphile/crystal/pull/1958)
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)
  Thanks [@benjie](https://github.com/benjie)! - EXPORTABLE now accepts a third
  argument, `nameHint`, which is used to hint what variable name to use for the
  given value. Used this in `graphile-export` along with some fixes and
  optimizations to improve the exports further.

- [#1946](https://github.com/graphile/crystal/pull/1946)
  [`9d53dde72`](https://github.com/graphile/crystal/commit/9d53dde726b7304962e921b88a159649e49156e5)
  Thanks [@benjie](https://github.com/benjie)! - Exporting a schema now performs
  ESLint 'no-use-before-define' check to catch even more invalid export
  conditions. Fix `registerNodeIdCodec` calls caught by this.
- Updated dependencies
  [[`9f85c614d`](https://github.com/graphile/crystal/commit/9f85c614d48dc745c5fed15333dbb75af7fddc88),
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de),
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)]:
  - grafast@0.1.1-beta.6

## 5.0.0-beta.15

### Patch Changes

- [#1933](https://github.com/graphile/crystal/pull/1933)
  [`3a2ea80ee`](https://github.com/graphile/crystal/commit/3a2ea80ee470b2aef91366727d7d60a0c65067f5)
  Thanks [@mattiarossi](https://github.com/mattiarossi)! -
  `eslint-plugin-graphile-export` now spots instances of `inputPlan`,
  `applyPlan` and `assertStep` so they can be checked - thanks @mattiarossi!

- [#1924](https://github.com/graphile/crystal/pull/1924)
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 TypeScript is now configured
  to hide interfaces marked as `@internal`. This may result in a few errors
  where you're accessing things you oughtn't be, but also may hide some
  interfaces that should be exposed - please file an issue if an API you were
  dependent on has been removed from the TypeScript typings. If that API happens
  to be `step.dependencies`; you should first read this:
  https://benjie.dev/graphql/ancestors

- [#1935](https://github.com/graphile/crystal/pull/1935)
  [`8ea67f891`](https://github.com/graphile/crystal/commit/8ea67f8910693edaf70daa9952e35d8396166f38)
  Thanks [@benjie](https://github.com/benjie)! - Fix lots of things related to
  exporting a schema with `graphile-export`.

- [#1935](https://github.com/graphile/crystal/pull/1935)
  [`e20e66ed7`](https://github.com/graphile/crystal/commit/e20e66ed71b499ee5bbf05105f981809fd302212)
  Thanks [@benjie](https://github.com/benjie)! - Make even more of the schema
  exportable, including handling scalars with no parseLiteral definition.
- Updated dependencies
  [[`63dd7ea99`](https://github.com/graphile/crystal/commit/63dd7ea992d30ad711dd85a73a127484a0e35479),
  [`d801c9778`](https://github.com/graphile/crystal/commit/d801c9778a86d61e060896460af9fe62a733534a),
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195),
  [`5de3e86eb`](https://github.com/graphile/crystal/commit/5de3e86eba1ddfe5e07732d0325c63e5d72d4b5b)]:
  - grafast@0.1.1-beta.5
  - graphile-config@0.0.1-beta.7

## 5.0.0-beta.14

### Patch Changes

- [#1901](https://github.com/graphile/crystal/pull/1901)
  [`f97d7976a`](https://github.com/graphile/crystal/commit/f97d7976a683a1e2cb0fed1ce0e30aeff8cc1886)
  Thanks [@benjie](https://github.com/benjie)! - Loosens step assertion from
  Query type so it can be served from `constant(true)`.
- Updated dependencies
  [[`a2176ea32`](https://github.com/graphile/crystal/commit/a2176ea324db0801249661b30e9c9d314c6fb159),
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044)]:
  - grafast@0.1.1-beta.4

## 5.0.0-beta.13

### Patch Changes

- Updated dependencies
  [[`0df5511ac`](https://github.com/graphile/crystal/commit/0df5511ac8b79ea34f8d12ebf8feeb421f8fe971)]:
  - graphile-config@0.0.1-beta.6
  - grafast@0.1.1-beta.3

## 5.0.0-beta.12

### Patch Changes

- [#1877](https://github.com/graphile/crystal/pull/1877)
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f)
  Thanks [@benjie](https://github.com/benjie)! - Move 'declare global' out of
  'interfaces.ts' and into 'index.ts' or equivalent. Should make TypeScript more
  aware of these types.

- [#1817](https://github.com/graphile/crystal/pull/1817)
  [`f66cc40b3`](https://github.com/graphile/crystal/commit/f66cc40b3bc5bf2e7f92fe5a6bd5638e2a51ac2b)
  Thanks [@benjie](https://github.com/benjie)! - Enable detecting "empty" enums
  (enums with no values).

- [#1878](https://github.com/graphile/crystal/pull/1878)
  [`f18635a5c`](https://github.com/graphile/crystal/commit/f18635a5cf55845c9534d82bb483e5fbb9ed179e)
  Thanks [@benjie](https://github.com/benjie)! - Export
  getNodeIdHandlerByTypeName to make writing plugins easier

- Updated dependencies
  [[`3fdc2bce4`](https://github.com/graphile/crystal/commit/3fdc2bce42418773f808c5b8309dfb361cd95ce9),
  [`aeef362b5`](https://github.com/graphile/crystal/commit/aeef362b5744816f01e4a6f714bbd77f92332bc5),
  [`8a76db07f`](https://github.com/graphile/crystal/commit/8a76db07f4c110cecc6225504f9a05ccbcbc7b92),
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f),
  [`1c9f1c0ed`](https://github.com/graphile/crystal/commit/1c9f1c0edf4e621a5b6345d3a41527a18143c6ae)]:
  - grafast@0.1.1-beta.2
  - graphile-config@0.0.1-beta.5

## 5.0.0-beta.11

### Patch Changes

- Updated dependencies
  [[`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f),
  [`7aef73319`](https://github.com/graphile/crystal/commit/7aef73319a8a147c700727be62427e1eefdefbf8)]:
  - grafast@0.1.1-beta.1
  - graphile-config@0.0.1-beta.4

## 5.0.0-beta.10

### Patch Changes

- [#1769](https://github.com/graphile/crystal/pull/1769)
  [`b728d7fb9`](https://github.com/graphile/crystal/commit/b728d7fb91eb29fbb21d955af5fd9cb4278f6222)
  Thanks [@benjie](https://github.com/benjie)! - Fix error message when ref is
  used with no foreign key.

- Updated dependencies
  [[`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8),
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434),
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)]:
  - grafast@0.1.1-beta.0

## 5.0.0-beta.9

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
  - graphile-config@0.0.1-beta.3
  - grafast@0.0.1-beta.8

## 5.0.0-beta.8

### Patch Changes

- Updated dependencies
  [[`3700e204f`](https://github.com/benjie/crystal/commit/3700e204f430db182c92ca7abc82017c81fa1f9b)]:
  - grafast@0.0.1-beta.7

## 5.0.0-beta.7

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1),
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)]:
  - graphile-config@0.0.1-beta.2
  - grafast@0.0.1-beta.6

## 5.0.0-beta.6

### Patch Changes

- [#488](https://github.com/benjie/crystal/pull/488)
  [`73f1b5218`](https://github.com/benjie/crystal/commit/73f1b52187b2e009d502afa1db8a4e8f702e2958)
  Thanks [@benjie](https://github.com/benjie)! - specForHandler now only
  requires handler - no need to pass codec.

- Updated dependencies
  [[`53186213a`](https://github.com/benjie/crystal/commit/53186213ade962f4b66cb0d5ea8b57b5ce7ea85f)]:
  - grafast@0.0.1-beta.5

## 5.0.0-beta.5

### Patch Changes

- Updated dependencies
  [[`f9cc88dc4`](https://github.com/benjie/crystal/commit/f9cc88dc442d371aee154a28d4e63c6da39f6b2e)]:
  - grafast@0.0.1-beta.4

## 5.0.0-beta.4

### Patch Changes

- [#454](https://github.com/benjie/crystal/pull/454)
  [`196e5c1aa`](https://github.com/benjie/crystal/commit/196e5c1aab52dbe2a069d0a15b9e4931523fd2dd)
  Thanks [@benjie](https://github.com/benjie)! -
  `@interface mode=single/relational` now get `Node` interface if the table has
  a PK.

  🚨 `@interface mode=union` no longer gets `Node` interface unless you also add
  `@behavior node`.

## 5.0.0-beta.3

### Patch Changes

- [#452](https://github.com/benjie/crystal/pull/452)
  [`d3ab4e12d`](https://github.com/benjie/crystal/commit/d3ab4e12d5bf0dc1c0364c603585175fa4d94d34)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages with
  links to more details.

- Updated dependencies
  [[`46cd08aa1`](https://github.com/benjie/crystal/commit/46cd08aa13e3bac4d186c72c6ce24997f37658af)]:
  - grafast@0.0.1-beta.3

## 5.0.0-beta.2

### Patch Changes

- Updated dependencies
  [[`23bd3c291`](https://github.com/benjie/crystal/commit/23bd3c291246aebf27cf2784f40fc948485f43c9)]:
  - grafast@0.0.1-beta.2

## 5.0.0-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - grafast@0.0.1-beta.1
  - graphile-config@0.0.1-beta.1

## 5.0.0-alpha.18

### Patch Changes

- Updated dependencies
  [[`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)]:
  - grafast@0.0.1-alpha.16

## 5.0.0-alpha.17

### Patch Changes

- [#433](https://github.com/benjie/crystal/pull/433)
  [`5491e10b0`](https://github.com/benjie/crystal/commit/5491e10b0f1629e607e7385985315169e156071d)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages from
  custom string scalars when they cannot be parsed as a string.

- [#438](https://github.com/benjie/crystal/pull/438)
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d)
  Thanks [@benjie](https://github.com/benjie)! - Plugin name now automatically
  used in `provides` for every hook, allowing ordering hooks before/after their
  equivalents in other plugins.
- Updated dependencies
  [[`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996),
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b),
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d),
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)]:
  - grafast@0.0.1-alpha.15
  - graphile-config@0.0.1-alpha.7

## 5.0.0-alpha.16

### Patch Changes

- [#420](https://github.com/benjie/crystal/pull/420)
  [`c1518fad0`](https://github.com/benjie/crystal/commit/c1518fad093dc53c033866541f378878aab69b5c)
  Thanks [@benjie](https://github.com/benjie)! - Fix schema so it can run
  without NodePlugin

## 5.0.0-alpha.15

### Patch Changes

- Updated dependencies
  [[`d99d666fb`](https://github.com/benjie/crystal/commit/d99d666fb234eb02dd196610995fa480c596242a)]:
  - grafast@0.0.1-alpha.14

## 5.0.0-alpha.14

### Patch Changes

- [#417](https://github.com/benjie/crystal/pull/417)
  [`e7dd2e039`](https://github.com/benjie/crystal/commit/e7dd2e039769958d59a83ec3b164cad063c82500)
  Thanks [@benjie](https://github.com/benjie)! - `codec` is now baked into
  NodeId handlers (rather than using `codecName` and looking that up in
  `codecs`). All related APIs have thus simplified, e.g. the step
  `node(codecs, handler, $id)` is now `node(handler, $id)`, etc. TypeScript
  should point out any issues you have hopefully.

- [#418](https://github.com/benjie/crystal/pull/418)
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul peerDependencies and
  dependencies to try and eliminate duplicate modules error.

- [#410](https://github.com/benjie/crystal/pull/410)
  [`4eda0cd57`](https://github.com/benjie/crystal/commit/4eda0cd572274febad696ebb5a89472a981f8212)
  Thanks [@benjie](https://github.com/benjie)! - Use a single behavior check per
  location.

  In the past two weeks I added a few behavior strings like
  `array:attribute:filterBy` (a scoped form of `attribute:filterBy` to only be
  used by attributes that were arrays); however I've realised that this will
  require plugin authors to implement all the same logic to figure out what type
  an attribute is in order to then see if it has the relevant behavior. This
  goes against the design of the behavior system, and makes plugin authors'
  lives harder. So I've reverted this, and instead used the `entityBehaviors`
  system to add or remove the base `attribute:filterBy` (etc) behavior depending
  on what the type of the attribute is.

- Updated dependencies
  [[`620f9e07e`](https://github.com/benjie/crystal/commit/620f9e07ec6f4d66a8dc01ed6bb054a75f7b1c8b),
  [`1882e0185`](https://github.com/benjie/crystal/commit/1882e018576adf69bcae8a999224cb4d5e62a3e1),
  [`881672305`](https://github.com/benjie/crystal/commit/88167230578393e3b24a364f0d673e36c5cb088d),
  [`e5012f9a1`](https://github.com/benjie/crystal/commit/e5012f9a1901af63e1703ea4d717e8a22544f5e7),
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de),
  [`47f6f018b`](https://github.com/benjie/crystal/commit/47f6f018b11761cbfaa63d709edc0e3f4f9a9924),
  [`ff4395bfc`](https://github.com/benjie/crystal/commit/ff4395bfc6e6b2fb263f644dae1e984c52dd84b9),
  [`502b23340`](https://github.com/benjie/crystal/commit/502b233401975637bc0d516af78721b37f6f9b7b)]:
  - grafast@0.0.1-alpha.13

## 5.0.0-alpha.13

### Patch Changes

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - Exported `version` no longer
  uses `require('../package.json')` hack, instead the version number is written
  to a source file at versioning time. Packages now export `version`.

- [#406](https://github.com/benjie/crystal/pull/406)
  [`9f5a784c6`](https://github.com/benjie/crystal/commit/9f5a784c601b67dfb2cbf7bd836d7aa060fba63c)
  Thanks [@benjie](https://github.com/benjie)! - Introduce TypeScript CIF
  gatherConfig() to help typing the `gather` phase for plugins.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`2849cc3fb`](https://github.com/benjie/crystal/commit/2849cc3fb8e4302b57cdf21f8c9a5fea33b797f8)
  Thanks [@benjie](https://github.com/benjie)! - Better handle the situation
  where a node fetcher could not be found.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`8ca9425ed`](https://github.com/benjie/crystal/commit/8ca9425edec68fbac0e727bd3d2754bf4843cc74)
  Thanks [@benjie](https://github.com/benjie)! - Detect when your preset doesn't
  have any plugins, or omits the QueryPlugin, and raise an error or warning
  indicating to the user that there's likely an issue here.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`dda361d11`](https://github.com/benjie/crystal/commit/dda361d11c4d2625c5770df32843f3ec1407c922)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages for
  getInputTypeByName and getOutputTypeByName.

- Updated dependencies
  [[`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999),
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd),
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37)]:
  - grafast@0.0.1-alpha.12
  - graphile-config@0.0.1-alpha.6

## 5.0.0-alpha.12

### Patch Changes

- [#402](https://github.com/benjie/crystal/pull/402)
  [`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)
  Thanks [@benjie](https://github.com/benjie)! - Use `file://` URLs in import()
  to fix compatibility with Windows (e.g. when loading `graphile.config.mjs`)

- [#402](https://github.com/benjie/crystal/pull/402)
  [`47365f0df`](https://github.com/benjie/crystal/commit/47365f0df2644fd91839a6698998e1463df8de79)
  Thanks [@benjie](https://github.com/benjie)! - Add helper for more easily
  handling NodeIDs for known typeName.

- Updated dependencies
  [[`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)]:
  - graphile-config@0.0.1-alpha.5
  - grafast@0.0.1-alpha.11

## 5.0.0-alpha.11

### Patch Changes

- [#399](https://github.com/benjie/crystal/pull/399)
  [`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd)
  Thanks [@benjie](https://github.com/benjie)! - Change many of the dependencies
  to be instead (or also) peerDependencies, to avoid duplicate modules.

- [#399](https://github.com/benjie/crystal/pull/399)
  [`976958e80`](https://github.com/benjie/crystal/commit/976958e80c791819cd80e96df8209dcff1918585)
  Thanks [@benjie](https://github.com/benjie)! - Plugins can now use
  build.grafast rather than adding grafast as a peerDependency.

- [#383](https://github.com/benjie/crystal/pull/383)
  [`2c8586b36`](https://github.com/benjie/crystal/commit/2c8586b367b76af91d1785cc90455c70911fdec7)
  Thanks [@benjie](https://github.com/benjie)! - Change
  'objectType.extensions.grafast.Step' to
  'objectType.extensions.grafast.assertStep', accept it via object spec,
  deprecate registerObjectType form that accepts it (pass via object spec
  instead), improve typings around it.

- [#378](https://github.com/benjie/crystal/pull/378)
  [`47ff7e824`](https://github.com/benjie/crystal/commit/47ff7e824b2fc96c11f601c3814d0200208711ce)
  Thanks [@benjie](https://github.com/benjie)! - Add more detail to an error
  message

- Updated dependencies
  [[`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd),
  [`b7533bd4d`](https://github.com/benjie/crystal/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4),
  [`9feb769c2`](https://github.com/benjie/crystal/commit/9feb769c2df0c57971ed26a937be4a1bee7a7524),
  [`7573bf374`](https://github.com/benjie/crystal/commit/7573bf374897228b613b19f37b4e076737db3279),
  [`2c8586b36`](https://github.com/benjie/crystal/commit/2c8586b367b76af91d1785cc90455c70911fdec7),
  [`c43802d74`](https://github.com/benjie/crystal/commit/c43802d7419f93d18964c654f16d0937a2e23ca0),
  [`b118b8f6d`](https://github.com/benjie/crystal/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8),
  [`9008c4f87`](https://github.com/benjie/crystal/commit/9008c4f87df53be4051c49f9836358dc2baa59df),
  [`e8c81cd20`](https://github.com/benjie/crystal/commit/e8c81cd2046390ed5b6799aa7ff3d90b28a1861a)]:
  - grafast@0.0.1-alpha.10

## 5.0.0-alpha.10

### Patch Changes

- [#349](https://github.com/benjie/crystal/pull/349)
  [`a94f11091`](https://github.com/benjie/crystal/commit/a94f11091520b52d90fd007986760848ed20017b)
  Thanks [@benjie](https://github.com/benjie)! - **Overhaul behavior system**

  Previously the behavior system worked during the schema building process,
  inside the various schema hooks. So looking at the behavior of a `relation`
  might have looked like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;

    // Establish a default behavior, e.g. you might give it different default behavior
    // depending on if the remote table is in the same schema or not
    const defaultBehavior = someCondition(relation) ? "behavior_if_true" : "behavior_if_false";

    // Now establish the user-specified behavior for the entity, inheriting from all the
    // relevant places.
    const behavior = getBehavior([
      relation.remoteResource.codec.extensions,
      relation.remoteResource.extensions,
      relation.extensions
    ]);

    // Finally check this behavior string against `behavior_to_test`, being sure to apply
    // the "schema-time smart defaulting" that we established in `defaultBehavior` above.
    if (build.behavior.matches(behavior, "behavior_to_test", defaultBehavior)) {
      doTheThing();
    }
  ```

  This meant that each plugin might treat the behavior of the entity different -
  for example `postgraphile-plugin-connection-filter` might have a different
  `someCondition()` under which the "filter" behavior would apply by default,
  whereas the built in `condition` plugin might have a different one.

  Moreover, each place needs to know to call `getBehavior` with the same list of
  extension sources in the same order, otherwise subtle (or not so subtle)
  differences in the schema would occur.

  And finally, because each entity doesn't have an established behavior, you
  can't ask "what's the final behavior for this entity" because it's dynamic,
  depending on which plugin is viewing it.

  This update fixes all of this; now each entity has a single behavior that's
  established once. Each plugin can register `entityBehaviors` for the various
  behavior entity types (or global behaviors which apply to all entity types if
  that makes more sense). So the hook code equivalent to the above would now be
  more like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;
    // Do the thing if the relation has the given behavior. Simples.
    if (build.behavior.pgCodecRelationMatches(relation, "behavior_to_test")) {
      doTheThing();
    }
  ```

  This code is much more to the point, much easier for plugin authors to
  implement, and also a lot easier to debug since everything has a single
  established behavior now (except `refs`, which aren't really an entity in
  their own right, but a combination of entities...).

  These changes haven't changed any of the schemas in the test suite, but they
  may impact you. This could be a breaking change - so be sure to do a schema
  diff before/after this.

- [#361](https://github.com/benjie/crystal/pull/361)
  [`dad4d4aae`](https://github.com/benjie/crystal/commit/dad4d4aaee499098104841740c9049b1deb6ac5f)
  Thanks [@benjie](https://github.com/benjie)! - Instead of passing
  resolvedPreset to behaviors, pass Build.

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4

## 5.0.0-alpha.9

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/crystal/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8

## 5.0.0-alpha.8

### Patch Changes

- [#340](https://github.com/benjie/crystal/pull/340)
  [`fe9154b23`](https://github.com/benjie/crystal/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215)
  Thanks [@benjie](https://github.com/benjie)! - Make Datetime RFC3339
  compatible when a timezone is present

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/crystal/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`2fcbe688c`](https://github.com/benjie/crystal/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`adc7ae5e0`](https://github.com/benjie/crystal/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - graphile-config@0.0.1-alpha.3

## 5.0.0-alpha.7

### Patch Changes

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6

## 5.0.0-alpha.6

### Patch Changes

- [`2850e4732`](https://github.com/benjie/crystal/commit/2850e4732ff173347357dba048eaf3c1ef775497)
  Thanks [@benjie](https://github.com/benjie)! - Improve the error output when
  the schema fails to build.

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/crystal/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/crystal/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4

## 5.0.0-alpha.4

### Patch Changes

- [#332](https://github.com/benjie/crystal/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/crystal/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

## 5.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`21e95326d`](https://github.com/benjie/crystal/commit/21e95326d72eaad7a8860c4c21a11736191f169b),
  [`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - graphile-export@0.0.2-alpha.2
  - grafast@0.0.1-alpha.3
  - graphile-config@0.0.1-alpha.2

## 5.0.0-alpha.2

### Patch Changes

- Updated dependencies
  [[`3df3f1726`](https://github.com/benjie/crystal/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafast@0.0.1-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - graphile-config@0.0.1-alpha.1
  - graphile-export@0.0.2-alpha.1

## 5.0.0-1.3

### Patch Changes

- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/crystal/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`b4eaf89f4`](https://github.com/benjie/crystal/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2

## 5.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/crystal/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2

## 5.0.0-1.1

### Patch Changes

- [#287](https://github.com/benjie/crystal/pull/287)
  [`c5d89d705`](https://github.com/benjie/crystal/commit/c5d89d7052dfaaf4c597c8c36858795fa7227b07)
  Thanks [@benjie](https://github.com/benjie)! - Fix the type definition of
  GatherHooks to allow plugins to indicate individual gather hook ordering.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#265](https://github.com/benjie/crystal/pull/265)
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8)
  Thanks [@benjie](https://github.com/benjie)! - 'extensions.graphile' is now
  'extensions.grafast'

- [#271](https://github.com/benjie/crystal/pull/271)
  [`261eb520b`](https://github.com/benjie/crystal/commit/261eb520b33fe3673fe3a7712085e50291aed1e5)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **RENAME ALL THE THINGS**

  The term 'source' was overloaded, and 'configs' was too vague, and
  'databaseName' was misleading, and 'source' behaviours actually applied to
  resources, and more. So, we've renamed lots of things as part of the API
  stabilization work. You're probably only affected by the first 2 bullet
  points.

  - `pgConfigs` -> `pgServices` (also applies to related `pgConfig` terms such
    as `makePgConfig` -> `makePgService`, `MakePgConfigOptions` ->
    `MakePgServiceOptions`, etc) - see your `graphile.config.ts` or equivalent
    file
  - All `*:source:*` behaviors are now `*:resource:*` behaviors (use regexp
    `/:source\b|\bsource:[a-z$]/` to find the places that need updating)
  - `PgDatabaseConfiguration` -> `PgServiceConfiguration`
  - `databaseName` -> `serviceName` (because it's not the name of the database,
    it's the name of the `pgServices` (which was `pgConfigs`) entry)
  - `PgResourceConfig::source` -> `PgResourceConfig.from` ('source' is
    overloaded, so use a more direct term)
  - `PgResource::source` -> `PgResource.from`
  - `PgSelectPlanJoin::source` -> `PgSelectPlanJoin.from`
  - `helpers.pgIntrospection.getDatabase` ->
    `helpers.pgIntrospection.getService`
  - `helpers.pgIntrospection.getExecutorForDatabase` ->
    `helpers.pgIntrospection.getExecutorForService`

- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/crystal/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/crystal/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - graphile-config@0.0.1-1.1
  - graphile-export@0.0.2-1.1

## 5.0.0-0.29

### Patch Changes

- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/crystal/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/crystal/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)]:
  - grafast@0.0.1-0.23

## 5.0.0-0.28

### Patch Changes

- [#233](https://github.com/benjie/crystal/pull/233)
  [`a50bc5be4`](https://github.com/benjie/crystal/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8)
  Thanks [@benjie](https://github.com/benjie)! - Introduce new
  GraphQLObjectType_fields_field_args_arg and
  GraphQLInterfaceType_fields_field_args_arg hooks to resolve some plugin
  ordering issues.

- [#233](https://github.com/benjie/crystal/pull/233)
  [`6fb7ef449`](https://github.com/benjie/crystal/commit/6fb7ef4494b4f61b3b1aa36642e51eb9ec99a941)
  Thanks [@benjie](https://github.com/benjie)! - Also trim the empty
  descriptions from interface fields/args in addition to all the existing places
  empty descriptions are trimmed.

- [#233](https://github.com/benjie/crystal/pull/233)
  [`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22

## 5.0.0-0.27

### Patch Changes

- [#229](https://github.com/benjie/crystal/pull/229)
  [`b9a2236d4`](https://github.com/benjie/crystal/commit/b9a2236d43cc92e06085298e379de71f7fdedcb7)
  Thanks [@benjie](https://github.com/benjie)! - Remove deprecated
  'subscriptions' option

- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/crystal/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)]:
  - grafast@0.0.1-0.21

## 5.0.0-0.26

### Patch Changes

- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20

## 5.0.0-0.25

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/crystal/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19

## 5.0.0-0.24

### Patch Changes

- [#220](https://github.com/benjie/crystal/pull/220)
  [`2abc58cf6`](https://github.com/benjie/crystal/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245)
  Thanks [@benjie](https://github.com/benjie)! - Convert a few more more options
  from V4 to V5.

  Explicitly remove query batching functionality, instead use HTTP2+ or
  websockets or similar.

  Add schema exporting.

- [#223](https://github.com/benjie/crystal/pull/223)
  [`df8c06657`](https://github.com/benjie/crystal/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)
  Thanks [@benjie](https://github.com/benjie)! - `graphile-utils` now includes
  the `makeAddPgTableConditionPlugin` and `makeAddPgTableOrderByPlugin`
  generators, freshly ported from V4. The signatures of these functions has
  changed slightly, but the functionality is broadly the same.
- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/crystal/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`c8a56cdc8`](https://github.com/benjie/crystal/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)]:
  - grafast@0.0.1-0.18

## 5.0.0-0.23

### Patch Changes

- [#219](https://github.com/benjie/crystal/pull/219)
  [`b58f5dfac`](https://github.com/benjie/crystal/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)
  Thanks [@benjie](https://github.com/benjie)! - Rename
  `GraphileBuild.GraphileBuildGatherOptions` to `GraphileBuild.GatherOptions`.
  Rename `GraphileBuild.GraphileBuildInflectionOptions` to
  `GraphileBuild.InflectionOptions`.

## 5.0.0-0.22

### Patch Changes

- [`f48860d4f`](undefined) - Allow adding resolver-only fields to planned types.

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17

## 5.0.0-0.21

### Patch Changes

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/crystal/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)]:
  - grafast@0.0.1-0.16

## 5.0.0-0.20

### Patch Changes

- [#210](https://github.com/benjie/crystal/pull/210)
  [`2fb5001b4`](https://github.com/benjie/crystal/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d)
  Thanks [@benjie](https://github.com/benjie)! - retryOnInitFail implemented,
  and bug in introspection cache on error resolved.

- [#210](https://github.com/benjie/crystal/pull/210)
  [`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - grafast@0.0.1-0.15

## 5.0.0-0.19

### Patch Changes

- [#206](https://github.com/benjie/crystal/pull/206)
  [`851b78ef2`](https://github.com/benjie/crystal/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/crystal/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`afa0ea5f6`](https://github.com/benjie/crystal/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`851b78ef2`](https://github.com/benjie/crystal/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/crystal/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14

## 5.0.0-0.18

### Patch Changes

- [#201](https://github.com/benjie/crystal/pull/201)
  [`dca706ad9`](https://github.com/benjie/crystal/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

## 5.0.0-0.17

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13

## 5.0.0-0.16

### Patch Changes

- [#198](https://github.com/benjie/crystal/pull/198)
  [`a1158d83e`](https://github.com/benjie/crystal/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14)
  Thanks [@benjie](https://github.com/benjie)! - Gather phase initialState may
  now be asynchronous. If initialCache returns a promise, a helpful error
  message with advice is now raised.
- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/crystal/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`25f5a6cbf`](https://github.com/benjie/crystal/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12

## 5.0.0-0.15

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#190](https://github.com/benjie/crystal/pull/190)
  [`652cf1073`](https://github.com/benjie/crystal/commit/652cf107316ea5832f69c6a55574632187f5c876)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Breaking changes around
  types and postgres configuration:

  - `GraphileBuild.GraphileResolverContext` renamed to `Grafast.Context`
  - `GraphileConfig.GraphQLRequestContext` renamed to `Grafast.RequestContext`
  - `Grafast.PgDatabaseAdaptorOptions` renaed to
    `GraphileConfig.PgDatabaseAdaptorOptions`
  - `@dataplan/pg/adaptors/node-postgres` is now `@dataplan/pg/adaptors/pg` due
    to the bizarre naming of PostgreSQL clients on npm - we've decided to use
    the module name as the unique identifier
  - `makePgConfigs`:
    - is now `makePgConfig` (singular) - so you'll need to wrap it in an array
      where you use it
    - no longer exported by `@dataplan/pg` (because it depended on `pg`) -
      instead each adaptor exposes this helper - so import from
      `@dataplan/pg/adaptors/node-postgres`
    - accepts an object parameter containing
      `{connectionString, schemas, superuserConnectionString}`, rather than
      multiple string parameters
  - `makeNodePostgresWithPgClient` -> `makePgAdaptorWithPgClient`
  - `postgraphile` CLI will now try and respect the adaptor stated in your
    preset when overriding connection arguments
  - Removed `Grafast.RequestContext.httpRequest` and instead use
    `Grafast.RequestContext.node.req/res`; all server adaptors should implement
    this if appropriate

- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/crystal/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/crystal/commit/652cf107316ea5832f69c6a55574632187f5c876)]:
  - grafast@0.0.1-0.11
  - graphile-config@0.0.1-0.5

## 5.0.0-0.14

### Patch Changes

- [`72bf5f535`](undefined) - Overhaul the behavior system (see
  https://postgraphile.org/postgraphile/next/behavior).

  - Adds `schema.defaultBehavior` configuration option to save having to write a
    plugin for such a simple task
  - Changes a bunch of behavior strings:
    - `(query|singularRelation|manyRelation|queryField|typeField):(list|connection|single)`
      -> `$1:source:$2` (e.g. `query:list` -> `query:source:list`)
  - Checks for more specific behaviors, e.g. `source:update` or
    `constraint:source:update` or `attribute:update` rather than just `update`
  - Updates every change to `getBehavior` so that it follows the relevant chain
    (e.g. codec -> source -> relation for relations, similar for other types)
  - More helpful error message when `-insert` prevents functions with input
    arguments working
  - Throw an error if you try and use "create" scope (because we use
    insert/update/delete not create/update/delete)

## 5.0.0-0.13

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/crystal/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10

## 5.0.0-0.12

### Patch Changes

- [#183](https://github.com/benjie/crystal/pull/183)
  [`3eb9da95e`](https://github.com/benjie/crystal/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

## 5.0.0-0.11

### Patch Changes

- [#176](https://github.com/benjie/crystal/pull/176)
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.
- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/crystal/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9

## 5.0.0-0.10

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/crystal/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8

## 5.0.0-0.9

### Patch Changes

- [`6ebe3a13e`](https://github.com/benjie/crystal/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

## 5.0.0-0.8

### Patch Changes

- [`677c8f5fc`](undefined) - Create new getTags() introspection helper and use
  it. Rename GraphileBuild.GraphileBuildSchemaOptions to
  GraphileBuild.SchemaOptions. Fix a couple minor inflection bugs. Add some
  missing descriptions. Fix the initial inflection types to not leak
  implementation details. Fix inflectors to use ResolvedPreset rather than
  Preset.
- Updated dependencies []:
  - grafast@0.0.1-0.7

## 5.0.0-0.7

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - graphile-config@0.0.1-0.2

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5

## 5.0.0-0.5

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4
  - graphile-export@0.0.2-0.4

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
