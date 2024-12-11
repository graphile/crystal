# @dataplan/pg

## 0.0.1-beta.30

### Patch Changes

- Updated dependencies
  [[`83c546509`](https://github.com/graphile/crystal/commit/83c546509d24be2955a56120981363ad3c3a5f3f)]:
  - graphile-config@0.0.1-beta.14
  - grafast@0.1.1-beta.19
  - @dataplan/json@0.0.1-beta.28

## 0.0.1-beta.29

### Patch Changes

- [#2279](https://github.com/graphile/crystal/pull/2279)
  [`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)
  Thanks [@benjie](https://github.com/benjie)! - Introduce step caching to
  reduce deduplication workload safely, thereby reducing planning time for many
  larger queries.
- Updated dependencies
  [[`7580bc16a`](https://github.com/graphile/crystal/commit/7580bc16a050fd8d916c6dabe9d1ded980090349),
  [`b336a5829`](https://github.com/graphile/crystal/commit/b336a58291cfec7aef884d3843172d408abfaf3c)]:
  - graphile-config@0.0.1-beta.13
  - grafast@0.1.1-beta.18
  - @dataplan/json@0.0.1-beta.27

## 0.0.1-beta.28

### Patch Changes

- [#2257](https://github.com/graphile/crystal/pull/2257)
  [`2a37fb99a`](https://github.com/graphile/crystal/commit/2a37fb99a04784647dff6ab8c5bfffb072cc6e8a)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul how PostgreSQL arrays
  are handled, and fix the "empty arrays become null" bug caused by using
  `array_agg()`.

- [#2265](https://github.com/graphile/crystal/pull/2265)
  [`5d9f2de85`](https://github.com/graphile/crystal/commit/5d9f2de8519b216732b17464d0b326ec8d7c58de)
  Thanks [@benjie](https://github.com/benjie)! - Prevents inlining (via joins)
  child PgSelect queries into parents when the parent is relying on implicit
  ordering coming from a function or suitably flagged subquery.

- [#2258](https://github.com/graphile/crystal/pull/2258)
  [`cba6ee06d`](https://github.com/graphile/crystal/commit/cba6ee06d38ec5ae4ef4dafa58569fad61f239ac)
  Thanks [@kzlar](https://github.com/kzlar)! - Fixes incorrect deduplication in
  pgSelect resulting from lack of `from` comparison when passing custom `from`
  to custom `pgSelect()` calls.
- Updated dependencies
  [[`69ab227b5`](https://github.com/graphile/crystal/commit/69ab227b5e1c057a6fc8ebba87bde80d5aa7f3c8),
  [`d13b76f0f`](https://github.com/graphile/crystal/commit/d13b76f0fef2a58466ecb44880af62d25910e83e),
  [`b167bd849`](https://github.com/graphile/crystal/commit/b167bd8499be5866b71bac6594d55bd768fda1d0),
  [`7bf045282`](https://github.com/graphile/crystal/commit/7bf04528264c3b9c509f148253fed96d3394141d),
  [`6a13ecbd4`](https://github.com/graphile/crystal/commit/6a13ecbd45534c39c846c1d8bc58242108426dd1)]:
  - grafast@0.1.1-beta.17
  - graphile-config@0.0.1-beta.12
  - pg-sql2@5.0.0-beta.7
  - @dataplan/json@0.0.1-beta.26

## 0.0.1-beta.27

### Patch Changes

- Updated dependencies
  [[`5626c7d36`](https://github.com/graphile/crystal/commit/5626c7d3649285e11fe9857dfa319d2883d027eb),
  [`76c7340b7`](https://github.com/graphile/crystal/commit/76c7340b74d257c454beec883384d19ef078b21e)]:
  - graphile-config@0.0.1-beta.11
  - grafast@0.1.1-beta.16
  - @dataplan/json@0.0.1-beta.25

## 0.0.1-beta.26

### Patch Changes

- [#2156](https://github.com/graphile/crystal/pull/2156)
  [`6fdc6cad8`](https://github.com/graphile/crystal/commit/6fdc6cad8f8d1230202df533d05cc2bd80538f09)
  Thanks [@benjie](https://github.com/benjie)! - Added `pgRegistry.pgExecutors`
  so executors don't need to be looked up from a resource (this causes
  confusion) - instead they can be referenced directly. By default there's one
  executor called `main`, i.e. `build.input.pgRegistry.pgExecutors.main`.

- [#2193](https://github.com/graphile/crystal/pull/2193)
  [`42b982463`](https://github.com/graphile/crystal/commit/42b9824637a6c05e02935f2b05b5e8e0c61965a6)
  Thanks [@benjie](https://github.com/benjie)! - Add support for stable
  deduplication of object/list arguments to loadOne/loadMany, reducing redundant
  fetches.

- [#2191](https://github.com/graphile/crystal/pull/2191)
  [`1eac03ec2`](https://github.com/graphile/crystal/commit/1eac03ec2e9da65c64b7754c04292f43da82c40b)
  Thanks [@benjie](https://github.com/benjie)! - Broaden types around
  `pgSelectSingleFromRecord`

- [#2151](https://github.com/graphile/crystal/pull/2151)
  [`e8a9fd424`](https://github.com/graphile/crystal/commit/e8a9fd4243981b892364148eca1df66620ddeb87)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug preventing using
  certain steps as input to `resource.find({...})` and `resource.get({...})`.

- [#2157](https://github.com/graphile/crystal/pull/2157)
  [`50f6ce456`](https://github.com/graphile/crystal/commit/50f6ce456de3edd084869b54ee9f2eaf51a7fa0c)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 PostGraphile now ignores
  unlogged database tables by default.

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
  - @dataplan/json@0.0.1-beta.24

## 0.0.1-beta.25

### Patch Changes

- [#2150](https://github.com/graphile/crystal/pull/2150)
  [`82ce02cd9`](https://github.com/graphile/crystal/commit/82ce02cd93df3df3c9570c3528483c4f720ff9bb)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug selecting single row
  via pgUnionAll where no rows were selected.

- [#2146](https://github.com/graphile/crystal/pull/2146)
  [`eca7e62e2`](https://github.com/graphile/crystal/commit/eca7e62e2a09af77f4f166a281dab81d009d9ec1)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug causing out of date
  information to be displayed via subscriptions

- Updated dependencies
  [[`871d32b2a`](https://github.com/graphile/crystal/commit/871d32b2a18df0d257880fc54a61d9e68c4607d6),
  [`a26e3a30c`](https://github.com/graphile/crystal/commit/a26e3a30c02f963f8f5e9c9d021e871f33689e1b),
  [`02c11a4d4`](https://github.com/graphile/crystal/commit/02c11a4d42bf434dffc9354b300e8d791c4eeb2d)]:
  - grafast@0.1.1-beta.14
  - @dataplan/json@0.0.1-beta.23

## 0.0.1-beta.24

### Patch Changes

- [#2132](https://github.com/graphile/crystal/pull/2132)
  [`807650035`](https://github.com/graphile/crystal/commit/8076500354a3e2bc2de1b6c4e947bd710cc5bddc)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue where planning errors
  occurring after side-effects would result in GrafastInternalError being
  thrown. Further, fix issue causing `$step.hasSideEffects=true` to throw a
  planning error if `$step` had created other steps (as dependencies) during its
  construction. (Notably, `withPgClient` suffered from this.) Thanks to @purge
  for reporting the issue and creating a reproduction.
- Updated dependencies
  [[`807650035`](https://github.com/graphile/crystal/commit/8076500354a3e2bc2de1b6c4e947bd710cc5bddc)]:
  - grafast@0.1.1-beta.13
  - @dataplan/json@0.0.1-beta.22

## 0.0.1-beta.23

### Patch Changes

- [#2121](https://github.com/graphile/crystal/pull/2121)
  [`8bdc553b7`](https://github.com/graphile/crystal/commit/8bdc553b79aae21a27d22a4e1f1e57ee2e5d1d3f)
  Thanks [@benjie](https://github.com/benjie)! - Add support for accepting
  poolConfig via makePgService

- [#2128](https://github.com/graphile/crystal/pull/2128)
  [`4e102b1a1`](https://github.com/graphile/crystal/commit/4e102b1a1cd232e6f6703df0706415f01831dab2)
  Thanks [@adamni21](https://github.com/adamni21)! - Reduce planning cost of
  large input object trees by evaluating keys up front (thanks to @adamni21).

- [#2121](https://github.com/graphile/crystal/pull/2121)
  [`1cabbd311`](https://github.com/graphile/crystal/commit/1cabbd311bdefd7ce78f8dacbf61a42237a6c73c)
  Thanks [@benjie](https://github.com/benjie)! - Superuser connection now uses
  `superuserPoolConfig` rather than `poolConfig` when creating a pool.

- [#2091](https://github.com/graphile/crystal/pull/2091)
  [`590b6fdf5`](https://github.com/graphile/crystal/commit/590b6fdf5d04a392c4cc9e8bdad83278377c547b)
  Thanks [@benjie](https://github.com/benjie)! - Allow `PgClassExpressionStep`
  instances to be embedded directly into SQL expressions.

- [#1985](https://github.com/graphile/crystal/pull/1985)
  [`d6102714e`](https://github.com/graphile/crystal/commit/d6102714e4fec35952784c988c1617c789eee0cd)
  Thanks [@hannesj](https://github.com/hannesj)! - 🚨 PostgreSQL adaptor is no
  longer loaded via string value; instead you must pass the adaptor instance
  directly. If you have `adaptor: "@dataplan/pg/adaptors/pg"` then replace it
  with `adaptor: await import("@dataplan/pg/adaptors/pg")`. (This shouldn't
  cause you issues because you _should_ be using `makePgService` to construct
  your `pgServices` rather than building raw objects.)

  🚨 If you've implemented a custom PgAdaptor, talk to Benjie about how to port
  it. (Should be straightforward, but no point me figuring it out if no-one has
  done it yet 🤷)

  This change improves bundle-ability by reducing the number of dynamic imports.

  Also: `PgAdaptorOptions` has been renamed to `PgAdaptorSettings`, so please do
  a global find and replace for that.

- [#2120](https://github.com/graphile/crystal/pull/2120)
  [`925123497`](https://github.com/graphile/crystal/commit/925123497cf17b5e145ab80f62fa9de768a977ae)
  Thanks [@benjie](https://github.com/benjie)! - Internal refactoring of pg
  adaptor.

- [#2119](https://github.com/graphile/crystal/pull/2119)
  [`aa0474755`](https://github.com/graphile/crystal/commit/aa0474755142a758fc58c5c1a30b8c754bc84e7c)
  Thanks [@benjie](https://github.com/benjie)! - Reflect in types that
  `pgSettings` object keys may be undefined.

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
  - @dataplan/json@0.0.1-beta.21

## 0.0.1-beta.22

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
  - @dataplan/json@0.0.1-beta.20

## 0.0.1-beta.21

### Patch Changes

- Updated dependencies
  [[`3c161f7e1`](https://github.com/graphile/crystal/commit/3c161f7e13375105b1035a7d5d1c0f2b507ca5c7),
  [`a674a9923`](https://github.com/graphile/crystal/commit/a674a9923bc908c9315afa40e0cb256ee0953d16),
  [`b7cfeffd1`](https://github.com/graphile/crystal/commit/b7cfeffd1019d61c713a5054c4f5929960a2a6ab)]:
  - grafast@0.1.1-beta.10
  - @dataplan/json@0.0.1-beta.19

## 0.0.1-beta.20

### Patch Changes

- Updated dependencies
  [[`437570f97`](https://github.com/graphile/crystal/commit/437570f97e8520afaf3d0d0b514d1f4c31546b76)]:
  - grafast@0.1.1-beta.9
  - @dataplan/json@0.0.1-beta.18

## 0.0.1-beta.19

### Patch Changes

- Updated dependencies
  [[`bd5a908a4`](https://github.com/graphile/crystal/commit/bd5a908a4d04310f90dfb46ad87398ffa993af3b)]:
  - grafast@0.1.1-beta.8
  - @dataplan/json@0.0.1-beta.17

## 0.0.1-beta.18

### Patch Changes

- [#1980](https://github.com/graphile/crystal/pull/1980)
  [`357d475f5`](https://github.com/graphile/crystal/commit/357d475f54fecc8c51892e0346d6872b34132430)
  Thanks [@benjie](https://github.com/benjie)! - The signature of
  `ExecutableStep.execute` has changed; please make the following change to each
  of your custom step classes' `execute` methods:

  ```diff
  - async execute(count: number, values: any[][], extra: ExecutionExtra) {
  + async execute({ count, values: newValues, extra }: ExecutionDetails) {
  +   const values = newValues.map((dep) =>
  +     dep.isBatch ? dep.entries : new Array(count).fill(dep.value)
  +   );
      // REST OF YOUR FUNCTION HERE
    }
  ```

  For more details, see: https://err.red/gev2

- [#2039](https://github.com/graphile/crystal/pull/2039)
  [`30bcd6c12`](https://github.com/graphile/crystal/commit/30bcd6c12e59f878617ea987c35a2f589ce05cb8)
  Thanks [@benjie](https://github.com/benjie)! - Exposes PgSelectPlan.clone, no
  longer internal.

- [#1994](https://github.com/graphile/crystal/pull/1994)
  [`ab08cbf9c`](https://github.com/graphile/crystal/commit/ab08cbf9c504c3cc22495a99a965e7634c18a6a3)
  Thanks [@benjie](https://github.com/benjie)! - Introduce
  `interface SQLable {[$toSQL](): SQL}` to `pg-sql2` and use it to simplify SQL
  fragments in various places.

- [#1982](https://github.com/graphile/crystal/pull/1982)
  [`86168b740`](https://github.com/graphile/crystal/commit/86168b740510aef17bde7ae21f1d0eebb0c5c9b3)
  Thanks [@benjie](https://github.com/benjie)! - Fix authorization check so it
  can call other steps (e.g. reading from `context()`)

- [#1995](https://github.com/graphile/crystal/pull/1995)
  [`e0d69e518`](https://github.com/graphile/crystal/commit/e0d69e518a98c70f9b90f59d243ce33978c1b5a1)
  Thanks [@benjie](https://github.com/benjie)! - Refactoring of unary logic.

- [#1973](https://github.com/graphile/crystal/pull/1973)
  [`a0e82b9c5`](https://github.com/graphile/crystal/commit/a0e82b9c5f4e585f1af1e147299cd07944ece6f8)
  Thanks [@benjie](https://github.com/benjie)! - Add 'unary steps' concept to
  codebase and refactor to using new executeV2 execution method which leverages
  them. Backwards compatibility maintained, but users should move to executeV2.

- [#1989](https://github.com/graphile/crystal/pull/1989)
  [`c48d3da7f`](https://github.com/graphile/crystal/commit/c48d3da7fe4fac2562fab5f085d252a0bfb6f0b6)
  Thanks [@benjie](https://github.com/benjie)! - Make it so that more pgSelect
  queries optimize themselves into parent queries via new step.canAddDependency
  helper.

- [#2019](https://github.com/graphile/crystal/pull/2019)
  [`51a94417f`](https://github.com/graphile/crystal/commit/51a94417fb62b54d309be184f4be479bc267c2b7)
  Thanks [@benjie](https://github.com/benjie)! - Now possible to filter by relay
  node identifiers without weird results if you pass an incompatible node id
  (e.g. a 'Post' ID where a 'User' ID was expected) - significantly improves the
  Relay preset.

- [#1988](https://github.com/graphile/crystal/pull/1988)
  [`81d17460c`](https://github.com/graphile/crystal/commit/81d17460ced08608814635779c5cf997c19c101d)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with record types
  when attributes need to be cast; this previously caused errors with computed
  columns when passed particular arguments.
- Updated dependencies
  [[`357d475f5`](https://github.com/graphile/crystal/commit/357d475f54fecc8c51892e0346d6872b34132430),
  [`3551725e7`](https://github.com/graphile/crystal/commit/3551725e71c3ed876554e19e5ab2c1dcb0fb1143),
  [`80836471e`](https://github.com/graphile/crystal/commit/80836471e5cedb29dee63bc5002550c4f1713cfd),
  [`a5c20fefb`](https://github.com/graphile/crystal/commit/a5c20fefb571dea6d1187515dc48dd547e9e6204),
  [`1ce08980e`](https://github.com/graphile/crystal/commit/1ce08980e2a52ed9bc81564d248c19648ecd3616),
  [`ab08cbf9c`](https://github.com/graphile/crystal/commit/ab08cbf9c504c3cc22495a99a965e7634c18a6a3),
  [`dff4f2535`](https://github.com/graphile/crystal/commit/dff4f2535ac6ce893089b312fcd5fffcd98573a5),
  [`a287a57c2`](https://github.com/graphile/crystal/commit/a287a57c2765da0fb6a132ea0953f64453210ceb),
  [`2fe56f9a6`](https://github.com/graphile/crystal/commit/2fe56f9a6dac03484ace45c29c2223a65f9ca1db),
  [`fed603d71`](https://github.com/graphile/crystal/commit/fed603d719c02f33e12190f925c9e3b06c581fac),
  [`ed6e0d278`](https://github.com/graphile/crystal/commit/ed6e0d2788217a1c419634837f4208013eaf2923),
  [`e82e4911e`](https://github.com/graphile/crystal/commit/e82e4911e32138df1b90ec0fde555ea963018d21),
  [`94a05064e`](https://github.com/graphile/crystal/commit/94a05064ea05108685ff71174a9f871ab5b4c147),
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
  - @dataplan/json@0.0.1-beta.16
  - grafast@0.1.1-beta.7
  - pg-sql2@5.0.0-beta.6
  - graphile-config@0.0.1-beta.8

## 0.0.1-beta.17

### Patch Changes

- [#1945](https://github.com/graphile/crystal/pull/1945)
  [`9f85c614d`](https://github.com/graphile/crystal/commit/9f85c614d48dc745c5fed15333dbb75af7fddc88)
  Thanks [@benjie](https://github.com/benjie)! - Mark `ExecutableStep::getDep`
  as `protected` to avoid abuse.

- [#1955](https://github.com/graphile/crystal/pull/1955)
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de)
  Thanks [@benjie](https://github.com/benjie)! - Steps are now prevented from
  calling other steps' lifecycle methods. GRAPHILE_ENV is actively encouraged,
  and falls back to NODE_ENV.

- [#1944](https://github.com/graphile/crystal/pull/1944)
  [`6c80c44b7`](https://github.com/graphile/crystal/commit/6c80c44b76a5eb30cc2b1555ba81a4b6236f4300)
  Thanks [@benjie](https://github.com/benjie)! - Fix accidental double-encoding
  of values on their way to postgres.

- [#1958](https://github.com/graphile/crystal/pull/1958)
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)
  Thanks [@benjie](https://github.com/benjie)! - EXPORTABLE now accepts a third
  argument, `nameHint`, which is used to hint what variable name to use for the
  given value. Used this in `graphile-export` along with some fixes and
  optimizations to improve the exports further.
- Updated dependencies
  [[`9f85c614d`](https://github.com/graphile/crystal/commit/9f85c614d48dc745c5fed15333dbb75af7fddc88),
  [`6c6be29f1`](https://github.com/graphile/crystal/commit/6c6be29f12b24782c926b2bc62ed2ede09ac05de),
  [`8315e8d01`](https://github.com/graphile/crystal/commit/8315e8d01c118cebc4ebbc53a2f264b958b252ad)]:
  - grafast@0.1.1-beta.6
  - @dataplan/json@0.0.1-beta.15

## 0.0.1-beta.16

### Patch Changes

- [#1924](https://github.com/graphile/crystal/pull/1924)
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 TypeScript is now configured
  to hide interfaces marked as `@internal`. This may result in a few errors
  where you're accessing things you oughtn't be, but also may hide some
  interfaces that should be exposed - please file an issue if an API you were
  dependent on has been removed from the TypeScript typings. If that API happens
  to be `step.dependencies`; you should first read this:
  https://benjie.dev/graphql/ancestors
- Updated dependencies
  [[`63dd7ea99`](https://github.com/graphile/crystal/commit/63dd7ea992d30ad711dd85a73a127484a0e35479),
  [`d801c9778`](https://github.com/graphile/crystal/commit/d801c9778a86d61e060896460af9fe62a733534a),
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195),
  [`5de3e86eb`](https://github.com/graphile/crystal/commit/5de3e86eba1ddfe5e07732d0325c63e5d72d4b5b)]:
  - grafast@0.1.1-beta.5
  - @dataplan/json@0.0.1-beta.14
  - pg-sql2@5.0.0-beta.5
  - graphile-config@0.0.1-beta.7

## 0.0.1-beta.15

### Patch Changes

- [#1895](https://github.com/graphile/crystal/pull/1895)
  [`555a2be03`](https://github.com/graphile/crystal/commit/555a2be037f49bd599abbaafe6e5d5ab190c96d6)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Fix issue with aggregates
  for polymorphic connections.

- Updated dependencies
  [[`a2176ea32`](https://github.com/graphile/crystal/commit/a2176ea324db0801249661b30e9c9d314c6fb159),
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044)]:
  - grafast@0.1.1-beta.4
  - @dataplan/json@0.0.1-beta.13

## 0.0.1-beta.14

### Patch Changes

- Updated dependencies
  [[`0df5511ac`](https://github.com/graphile/crystal/commit/0df5511ac8b79ea34f8d12ebf8feeb421f8fe971)]:
  - graphile-config@0.0.1-beta.6
  - grafast@0.1.1-beta.3
  - @dataplan/json@0.0.1-beta.12

## 0.0.1-beta.13

### Patch Changes

- [#1817](https://github.com/graphile/crystal/pull/1817)
  [`f305c3278`](https://github.com/graphile/crystal/commit/f305c327848eb7baef46c5384a7cc5af6f79db8d)
  Thanks [@benjie](https://github.com/benjie)! - Add support for limiting
  polymorphic plans (only some of them, specifically `pgUnionAll()` right now)
  to limit the types of their results; exposed via an experimental 'only'
  argument on fields, for example
  `allApplications(only: [GcpApplication, AwsApplication])` would limit the type
  of applications returned to only be the two specified.

- [#1877](https://github.com/graphile/crystal/pull/1877)
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f)
  Thanks [@benjie](https://github.com/benjie)! - Move 'declare global' out of
  'interfaces.ts' and into 'index.ts' or equivalent. Should make TypeScript more
  aware of these types.

- [#1879](https://github.com/graphile/crystal/pull/1879)
  [`dbd91fdd8`](https://github.com/graphile/crystal/commit/dbd91fdd836f041b6e2ff9d358c6a6f521f43914)
  Thanks [@benjie](https://github.com/benjie)! - Move PgContextPlugin from
  graphile-build-pg into @dataplan/pg so it can be used after schema export
  without needing dependency on graphile-build-pg

- [#1884](https://github.com/graphile/crystal/pull/1884)
  [`c66c3527c`](https://github.com/graphile/crystal/commit/c66c3527ce2bb38afa37242ecb5a22247efd6db9)
  Thanks [@benjie](https://github.com/benjie)! - List codecs can now have names.

- Updated dependencies
  [[`3fdc2bce4`](https://github.com/graphile/crystal/commit/3fdc2bce42418773f808c5b8309dfb361cd95ce9),
  [`aeef362b5`](https://github.com/graphile/crystal/commit/aeef362b5744816f01e4a6f714bbd77f92332bc5),
  [`8a76db07f`](https://github.com/graphile/crystal/commit/8a76db07f4c110cecc6225504f9a05ccbcbc7b92),
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f),
  [`1c9f1c0ed`](https://github.com/graphile/crystal/commit/1c9f1c0edf4e621a5b6345d3a41527a18143c6ae)]:
  - grafast@0.1.1-beta.2
  - graphile-config@0.0.1-beta.5
  - @dataplan/json@0.0.1-beta.11

## 0.0.1-beta.12

### Patch Changes

- Updated dependencies
  [[`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f),
  [`7aef73319`](https://github.com/graphile/crystal/commit/7aef73319a8a147c700727be62427e1eefdefbf8)]:
  - grafast@0.1.1-beta.1
  - graphile-config@0.0.1-beta.4
  - @dataplan/json@0.0.1-beta.10

## 0.0.1-beta.11

### Patch Changes

- [#1797](https://github.com/graphile/crystal/pull/1797)
  [`26e0bc726`](https://github.com/graphile/crystal/commit/26e0bc72653cd8dcef4b6cfb3c76876a5e620a12)
  Thanks [@benjie](https://github.com/benjie)! - Fix that smart tags were not
  copied onto enum codecs.

## 0.0.1-beta.10

### Patch Changes

- Updated dependencies
  [[`2805edc68`](https://github.com/graphile/crystal/commit/2805edc68b90546bf71ffd293af4d87a79345825)]:
  - pg-sql2@5.0.0-beta.4
  - grafast@0.1.1-beta.0

## 0.0.1-beta.9

### Patch Changes

- [#1778](https://github.com/graphile/crystal/pull/1778)
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434)
  Thanks [@benjie](https://github.com/benjie)! - Enable source maps in modules
  where it was disabled.

- [#1770](https://github.com/graphile/crystal/pull/1770)
  [`9a84bc6dd`](https://github.com/graphile/crystal/commit/9a84bc6dd5b33c1919f75f867df1f61c78686695)
  Thanks [@benjie](https://github.com/benjie)! - Fix issues around enum tables:
  indicate when an enum table codec replaces a regular attribute codec, expose
  helpers for working with enum tables, and don't exclude enum table references
  when using the Relay preset.
- Updated dependencies
  [[`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8),
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434),
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)]:
  - grafast@0.1.1-beta.0
  - @dataplan/json@0.0.1-beta.9

## 0.0.1-beta.8

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
  - @dataplan/json@0.0.1-beta.8
  - graphile-config@0.0.1-beta.3
  - grafast@0.0.1-beta.8
  - pg-sql2@5.0.0-beta.3
  - @graphile/lru@5.0.0-beta.3

## 0.0.1-beta.7

### Patch Changes

- Updated dependencies
  [[`3700e204f`](https://github.com/benjie/crystal/commit/3700e204f430db182c92ca7abc82017c81fa1f9b)]:
  - grafast@0.0.1-beta.7
  - @dataplan/json@0.0.1-beta.7

## 0.0.1-beta.6

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1),
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)]:
  - @dataplan/json@0.0.1-beta.6
  - graphile-config@0.0.1-beta.2
  - grafast@0.0.1-beta.6
  - pg-sql2@5.0.0-beta.2
  - @graphile/lru@5.0.0-beta.2

## 0.0.1-beta.5

### Patch Changes

- [#488](https://github.com/benjie/crystal/pull/488)
  [`95e902f54`](https://github.com/benjie/crystal/commit/95e902f5403c16895e874692f7650293d77590dd)
  Thanks [@benjie](https://github.com/benjie)! - Don't try and inline a query
  when it includes an inner join (unsafe).

- Updated dependencies
  [[`53186213a`](https://github.com/benjie/crystal/commit/53186213ade962f4b66cb0d5ea8b57b5ce7ea85f)]:
  - grafast@0.0.1-beta.5
  - @dataplan/json@0.0.1-beta.5

## 0.0.1-beta.4

### Patch Changes

- [#462](https://github.com/benjie/crystal/pull/462)
  [`53f0488b1`](https://github.com/benjie/crystal/commit/53f0488b1c060fe9f5dfcd67ad5c0bd932a4b7aa)
  Thanks [@benjie](https://github.com/benjie)! - Allow 'null' to be passed to
  `withPgClient`/`withPgClientTransaction`

- [#464](https://github.com/benjie/crystal/pull/464)
  [`00d026409`](https://github.com/benjie/crystal/commit/00d0264090f90914eac881b34918fa3370782adc)
  Thanks [@benjie](https://github.com/benjie)! - `@dataplan/pg/adaptors/pg` now
  adds `rawClient` property which is the underlying Postgres client for use with
  `pgTyped`, `zapatos`, and other libraries that can use a raw postgres client.
  This is exposed via `NodePostgresPgClient` interface which is a subtype of
  `PgClient`.
- Updated dependencies
  [[`f9cc88dc4`](https://github.com/benjie/crystal/commit/f9cc88dc442d371aee154a28d4e63c6da39f6b2e)]:
  - grafast@0.0.1-beta.4
  - @dataplan/json@0.0.1-beta.4

## 0.0.1-beta.3

### Patch Changes

- [#452](https://github.com/benjie/crystal/pull/452)
  [`d3ab4e12d`](https://github.com/benjie/crystal/commit/d3ab4e12d5bf0dc1c0364c603585175fa4d94d34)
  Thanks [@benjie](https://github.com/benjie)! - Improve error messages with
  links to more details.

- Updated dependencies
  [[`46cd08aa1`](https://github.com/benjie/crystal/commit/46cd08aa13e3bac4d186c72c6ce24997f37658af)]:
  - grafast@0.0.1-beta.3
  - @dataplan/json@0.0.1-beta.3

## 0.0.1-beta.2

### Patch Changes

- Updated dependencies
  [[`23bd3c291`](https://github.com/benjie/crystal/commit/23bd3c291246aebf27cf2784f40fc948485f43c9)]:
  - grafast@0.0.1-beta.2
  - @dataplan/json@0.0.1-beta.2

## 0.0.1-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - @dataplan/json@0.0.1-beta.1
  - grafast@0.0.1-beta.1
  - graphile-config@0.0.1-beta.1
  - @graphile/lru@5.0.0-beta.1
  - pg-sql2@5.0.0-beta.1

## 0.0.1-alpha.17

### Patch Changes

- [#441](https://github.com/benjie/crystal/pull/441)
  [`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)
  Thanks [@benjie](https://github.com/benjie)! - Change bundling techniques for
  grafast and @dataplan/pg

- Updated dependencies
  [[`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)]:
  - grafast@0.0.1-alpha.16
  - @dataplan/json@0.0.1-alpha.16

## 0.0.1-alpha.16

### Patch Changes

- [#435](https://github.com/benjie/crystal/pull/435)
  [`cf32f0397`](https://github.com/benjie/crystal/commit/cf32f0397f7a47509df9876112275f1ad135e8f2)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in listOfCodec causing
  wrong extensions to be used in non-deterministic manner (thanks to @jvandermey
  for finding the bug and helping to track it down).

- [#422](https://github.com/benjie/crystal/pull/422)
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)
  Thanks [@benjie](https://github.com/benjie)! - Comments enabled in released
  packages

- Updated dependencies
  [[`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996),
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b),
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d),
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)]:
  - grafast@0.0.1-alpha.15
  - graphile-config@0.0.1-alpha.7
  - @dataplan/json@0.0.1-alpha.15

## 0.0.1-alpha.15

### Patch Changes

- Updated dependencies
  [[`d99d666fb`](https://github.com/benjie/crystal/commit/d99d666fb234eb02dd196610995fa480c596242a)]:
  - grafast@0.0.1-alpha.14
  - @dataplan/json@0.0.1-alpha.14

## 0.0.1-alpha.14

### Patch Changes

- [#417](https://github.com/benjie/crystal/pull/417)
  [`881672305`](https://github.com/benjie/crystal/commit/88167230578393e3b24a364f0d673e36c5cb088d)
  Thanks [@benjie](https://github.com/benjie)! - `deepEval` has been renamed to
  `applyTransforms`

- [#418](https://github.com/benjie/crystal/pull/418)
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul peerDependencies and
  dependencies to try and eliminate duplicate modules error.
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
  - @dataplan/json@0.0.1-alpha.13

## 0.0.1-alpha.13

### Patch Changes

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - Exported `version` no longer
  uses `require('../package.json')` hack, instead the version number is written
  to a source file at versioning time. Packages now export `version`.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999)
  Thanks [@benjie](https://github.com/benjie)! - `inspect()` fallback function
  updated

- [#406](https://github.com/benjie/crystal/pull/406)
  [`51414d328`](https://github.com/benjie/crystal/commit/51414d3281f04c8fd450d6364960336b862a5795)
  Thanks [@benjie](https://github.com/benjie)! - Add support for `bytea`
  datatype using new `Base64EncodedBinary` scalar in GraphQL.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`bc14d488d`](https://github.com/benjie/crystal/commit/bc14d488d5385f350b6d377716e43c46a405dc57)
  Thanks [@benjie](https://github.com/benjie)! - When sorting, specify a
  concrete locale to localeCompare to ensure stable ordering across machines.
- Updated dependencies
  [[`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999),
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd),
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37)]:
  - grafast@0.0.1-alpha.12
  - graphile-config@0.0.1-alpha.6
  - @dataplan/json@0.0.1-alpha.12

## 0.0.1-alpha.12

### Patch Changes

- Updated dependencies
  [[`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)]:
  - graphile-config@0.0.1-alpha.5
  - grafast@0.0.1-alpha.11
  - @dataplan/json@0.0.1-alpha.11

## 0.0.1-alpha.11

### Patch Changes

- [#396](https://github.com/benjie/crystal/pull/396)
  [`659508371`](https://github.com/benjie/crystal/commit/659508371e79e76b581532978fe26d50a54e6248)
  Thanks [@benjie](https://github.com/benjie)! - List and range codecs now use
  the underlying codec to parse values from Postgres.

- [#399](https://github.com/benjie/crystal/pull/399)
  [`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd)
  Thanks [@benjie](https://github.com/benjie)! - Change many of the dependencies
  to be instead (or also) peerDependencies, to avoid duplicate modules.

- [#372](https://github.com/benjie/crystal/pull/372)
  [`4d64ac127`](https://github.com/benjie/crystal/commit/4d64ac12799be55680448aab6906312bcbc525ab)
  Thanks [@benjie](https://github.com/benjie)! - Remove
  pgSelectSingle.expression; use the equivalent method pgSelectSingle.select
  instead.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`17fe531d7`](https://github.com/benjie/crystal/commit/17fe531d729e88a7126b0e2e06fc1ee9ab3ac5b8)
  Thanks [@benjie](https://github.com/benjie)! - pgUnionAll uses a slightly more
  optimal SQL (where JSON isn't cast to `::text` and then back to `::json`)

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b7533bd4d`](https://github.com/benjie/crystal/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery will no
  longer deliver payloads for paths that don't exist when an error is thrown in
  an output plan.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`56b52295c`](https://github.com/benjie/crystal/commit/56b52295c77d1748c01754d5e71702e05c8a2dd3)
  Thanks [@benjie](https://github.com/benjie)! - pgUnionAll can now specify a
  name, making the SQL and query plan easier to read.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`b5eb7c490`](https://github.com/benjie/crystal/commit/b5eb7c490305b869e1bfc176a5a417e28f1411cd)
  Thanks [@benjie](https://github.com/benjie)! - Cursor pagination over nullable
  columns _should_ now work, although it is untested.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`7573bf374`](https://github.com/benjie/crystal/commit/7573bf374897228b613b19f37b4e076737db3279)
  Thanks [@benjie](https://github.com/benjie)! - Address a decent number of
  TODO/FIXME/etc comments in the codebase.

- [#378](https://github.com/benjie/crystal/pull/378)
  [`95b2ab41e`](https://github.com/benjie/crystal/commit/95b2ab41e41976de852276b83f7fb5924555e7c5)
  Thanks [@benjie](https://github.com/benjie)! - Support for nested arrays via
  PostgreSQL domains.

- [#398](https://github.com/benjie/crystal/pull/398)
  [`c43802d74`](https://github.com/benjie/crystal/commit/c43802d7419f93d18964c654f16d0937a2e23ca0)
  Thanks [@benjie](https://github.com/benjie)! - Fix a number of issues relating
  to incremental delivery and iterators

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b118b8f6d`](https://github.com/benjie/crystal/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery `@stream`
  now works for regular steps as well as streamable steps.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`b66d2503b`](https://github.com/benjie/crystal/commit/b66d2503b90eb458af709bb593e5a00d869df03f)
  Thanks [@benjie](https://github.com/benjie)! - hasNextPage (via hasMore) now
  uses an access plan rather than a lambda plan.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`3caaced6c`](https://github.com/benjie/crystal/commit/3caaced6cfbac4a187a245a61eb103edcb8cd4c9)
  Thanks [@benjie](https://github.com/benjie)! - When fetching a single row, an
  `ORDER BY` clause will no longer be added.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`9f2507ed9`](https://github.com/benjie/crystal/commit/9f2507ed9fe8a6abe93c9c8a1cff410446587fd6)
  Thanks [@benjie](https://github.com/benjie)! - Codecs can now (optionally)
  have executors associated (typically useful for record codecs); so we've
  eradicated runtime resource definition for columns that use composite types
  (or lists thereof) - all composite types accessible from attributes are now
  guaranteed to have a table-like resource generated in the registry.
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
  - @dataplan/json@0.0.1-alpha.10

## 0.0.1-alpha.10

### Patch Changes

- [#362](https://github.com/benjie/crystal/pull/362)
  [`77e011294`](https://github.com/benjie/crystal/commit/77e01129450ab78d55d3868661e37b0c99db3da5)
  Thanks [@benjie](https://github.com/benjie)! - Forbid duplicate codec/resource
  names.

- [#362](https://github.com/benjie/crystal/pull/362)
  [`e443db39b`](https://github.com/benjie/crystal/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)
  Thanks [@benjie](https://github.com/benjie)! - Use original case for table
  resource names.

- Updated dependencies
  [[`339fe20d0`](https://github.com/benjie/crystal/commit/339fe20d0c6e8600d263ce8093cd85a6ea8adbbf),
  [`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - pg-sql2@5.0.0-alpha.3
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4
  - @dataplan/json@0.0.1-alpha.9

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/crystal/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - @dataplan/json@0.0.1-alpha.8

## 0.0.1-alpha.8

### Patch Changes

- [#341](https://github.com/benjie/crystal/pull/341)
  [`2fcbe688c`](https://github.com/benjie/crystal/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb)
  Thanks [@benjie](https://github.com/benjie)! - Ensure interfaces with zero
  implementations don't cause a crash.

- [#345](https://github.com/benjie/crystal/pull/345)
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d)
  Thanks [@benjie](https://github.com/benjie)! - Cursor validation errors are
  now raised by the connection directly, rather than the subfields.

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
  - @dataplan/json@0.0.1-alpha.7

## 0.0.1-alpha.7

### Patch Changes

- [#338](https://github.com/benjie/crystal/pull/338)
  [`ca1526b70`](https://github.com/benjie/crystal/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6)
  Thanks [@benjie](https://github.com/benjie)! - Fix startCursor/endCursor for
  connections using pgUnionAll steps.

- [#338](https://github.com/benjie/crystal/pull/338)
  [`3426b0f4a`](https://github.com/benjie/crystal/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)
  Thanks [@benjie](https://github.com/benjie)! - Fix bugs in pgUnionAll
  connections relating to PageInfo

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6
  - @dataplan/json@0.0.1-alpha.6

## 0.0.1-alpha.6

### Patch Changes

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/crystal/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5
  - @dataplan/json@0.0.1-alpha.5

## 0.0.1-alpha.5

### Patch Changes

- [#334](https://github.com/benjie/crystal/pull/334)
  [`1ea7acdf5`](https://github.com/benjie/crystal/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)
  Thanks [@benjie](https://github.com/benjie)! - Tweak peerDependencies

## 0.0.1-alpha.4

### Patch Changes

- [`f34bd5a3c`](https://github.com/benjie/crystal/commit/f34bd5a3c353693b86a0307357a3620110700e1c)
  Thanks [@benjie](https://github.com/benjie)! - Address dependency issues.

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/crystal/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4
  - @dataplan/json@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`98ae00f59`](https://github.com/benjie/crystal/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`82cc01152`](https://github.com/benjie/crystal/commit/82cc01152ee06dafce45299661afd77ad943d785),
  [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - @graphile/lru@5.0.0-alpha.2
  - grafast@0.0.1-alpha.3
  - pg-sql2@5.0.0-alpha.2
  - @dataplan/json@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- Updated dependencies
  [[`3df3f1726`](https://github.com/benjie/crystal/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafast@0.0.1-alpha.2
  - @dataplan/json@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - @dataplan/json@0.0.1-alpha.1
  - grafast@0.0.1-alpha.1
  - @graphile/lru@5.0.0-alpha.1
  - pg-sql2@5.0.0-alpha.1

## 0.0.1-1.3

### Patch Changes

- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/crystal/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf)]:
  - grafast@0.0.1-1.3
  - @dataplan/json@0.0.1-1.3

## 0.0.1-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/crystal/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2
  - @dataplan/json@0.0.1-1.2

## 0.0.1-1.1

### Patch Changes

- [#279](https://github.com/benjie/crystal/pull/279)
  [`2df36c5a1`](https://github.com/benjie/crystal/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7)
  Thanks [@benjie](https://github.com/benjie)! - `description` moved out of
  `extensions` to live directly on all the relevant entities.

- [#279](https://github.com/benjie/crystal/pull/279)
  [`a73f9c709`](https://github.com/benjie/crystal/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26)
  Thanks [@benjie](https://github.com/benjie)! -
  `PgConnectionArgFirstLastBeforeAfterPlugin` is now
  `PgFirstLastBeforeAfterArgsPlugin` (because it applies to lists as well as
  connections).
  `PgInsertStep`/`pgInsert()`/`PgUpdateStep`/`pgUpdate()`/`PgDeleteStep`/`pgDelete()`
  are now
  `PgInsertSingleStep`/`pgInsertSingle()`/`PgUpdateSingleStep`/`pgUpdateSingle()`/`PgDeleteSingleStep`/`pgDeleteSingle()`
  (to make space to add a future bulk API if we want to).
  `config.schema.orderByNullsLast` is now `config.schema.pgOrderByNullsLast` for
  consistency (V4 preset users are unaffected). Lots of field scopes in
  `graphile-build-pg` have been updated to incorporate `field` into their names.

- [#270](https://github.com/benjie/crystal/pull/270)
  [`ef42d717c`](https://github.com/benjie/crystal/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a)
  Thanks [@benjie](https://github.com/benjie)! - SQL is now generated in a
  slightly different way, helping PostgreSQL to optimize queries that have a
  batch size of 1. Also removes internal mapping code as we now simply append
  placeholder values rather than search and replacing a symbol (eradicates
  `queryValuesSymbol` and related hacks). If you manually issue queries through
  `PgExecutor` (_extremely_ unlikely!) then you'll want to check out PR #270 to
  see the differences.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#265](https://github.com/benjie/crystal/pull/265)
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8)
  Thanks [@benjie](https://github.com/benjie)! - 'extensions.graphile' is now
  'extensions.grafast'

- [#259](https://github.com/benjie/crystal/pull/259)
  [`c22dcde7b`](https://github.com/benjie/crystal/commit/c22dcde7b53af323d907b22a0a69924841072aa9)
  Thanks [@benjie](https://github.com/benjie)! - Renamed `recordType` codec
  factory to `recordCodec`. `recordCodec()` now only accepts a single object
  argument. Renamed `enumType` codec factory to `enumCodec`. `enumCodec()` now
  only accepts a single object argument. Rename `listOfType` to `listOfCodec`.

  Massive overhaul of PgTypeCodec, PgTypeColumn and PgTypeColumns generics -
  types should be passed through much deeper now, but if you reference any of
  these types directly you'll need to update your code.

- [#285](https://github.com/benjie/crystal/pull/285)
  [`bd37be707`](https://github.com/benjie/crystal/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1)
  Thanks [@benjie](https://github.com/benjie)! - Single table inheritance no
  longer exposes non-shared columns via condition/order, and also only exposes
  the relationships on the types where they are appropriate.

- [#270](https://github.com/benjie/crystal/pull/270)
  [`f8954fb17`](https://github.com/benjie/crystal/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23)
  Thanks [@benjie](https://github.com/benjie)! - `EXPLAIN ANALYZE` (for
  `SELECT`) and `EXPLAIN` (for other operations) support added. Currently
  requires `DEBUG="datasource:pg:PgExecutor:explain"` to be set. Publish this
  through all the way to Ruru.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`96b0bd14e`](https://github.com/benjie/crystal/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4)
  Thanks [@benjie](https://github.com/benjie)! - `PgSource` has been renamed to
  `PgResource`, `PgTypeCodec` to `PgCodec`, `PgEnumTypeCodec` to `PgEnumCodec`,
  `PgTypeColumn` to `PgCodecAttribute` (and similar for related
  types/interfaces). `source` has been replaced by `resource` in various of the
  APIs where it relates to a `PgResource`.

  `PgSourceBuilder` is no more, instead being replaced with `PgResourceOptions`
  and being built into the final `PgResource` via the new
  `makeRegistryBuilder`/`makeRegistry` functions.

  `build.input` no longer contains the `pgSources` directly, instead
  `build.input.pgRegistry.pgResources` should be used.

  The new registry system also means that various of the hooks in the gather
  phase have been renamed/replaced, there's a new `PgRegistryPlugin` plugin in
  the default preset. The only plugin that uses the `main` method in the
  `gather` phase is now `PgRegistryPlugin` - if you are using the `main`
  function for Postgres-related behaviors you should consider moving your logic
  to hooks instead.

  Plugin ordering has changed and thus the shape of the final schema is likely
  to change (please use `lexicographicSortSchema` on your before/after schemas
  when comparing).

  Relationships are now from a codec to a resource, rather than from resource to
  resource, so all the relationship inflectors (`singleRelation`,
  `singleRelationBackwards`, `_manyRelation`, `manyRelationConnection`,
  `manyRelationList`) now accept different parameters
  (`{registry, codec, relationName}` instead of `{source, relationaName}`).

  Significant type overhaul, most generic types no longer require generics to be
  explicitly passed in many circumstances. `PgSelectStep`, `PgSelectSingleStep`,
  `PgInsertStep`, `PgUpdateStep` and `PgDeleteStep` now all accept the resource
  as their single type parameter rather than accepting the 4 generics they did
  previously. `PgClassExpressionStep` now accepts just a codec and a resource as
  generics. `PgResource` and `PgCodec` have gained a new `TName extends string`
  generic at the very front that is used by the registry system to massively
  improve continuity of the types through all the various APIs.

  Fixed various issues in schema exporting, and detect more potential
  issues/oversights automatically.

  Fixes an RBAC bug when using superuser role for introspection.

- [#279](https://github.com/benjie/crystal/pull/279)
  [`fbf1da26a`](https://github.com/benjie/crystal/commit/fbf1da26a9208519ee58f7ac34dd7e569bf1f9e5)
  Thanks [@benjie](https://github.com/benjie)! - listOfCodec type signature
  changed: all parameters after the first are now a single config object:
  `listOfCodec(listedCodec, extensions, typeDelim, identifier)` ->
  `listOfCodec(listedCodec, { extensions, typeDelim, identifier })`.

- [#270](https://github.com/benjie/crystal/pull/270)
  [`c564825f3`](https://github.com/benjie/crystal/commit/c564825f3fda0083e536154c4c34ce0b2948eba4)
  Thanks [@benjie](https://github.com/benjie)! - `set jit = 'off'` replaced with
  `set jit_optimize_above_cost = -1` so that JIT can still be used but heavy
  optimization costs are not incurred.

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

- [#266](https://github.com/benjie/crystal/pull/266)
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)
  Thanks [@benjie](https://github.com/benjie)! - The Grafast step class
  'execute' and 'stream' methods now have a new additional first argument
  `count` which indicates how many results they must return. This means we don't
  need to rely on the `values[0].length` trick to determine how many results to
  return, and thus we can pass through an empty tuple to steps that have no
  dependencies.
- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/crystal/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/crystal/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`f93c79b94`](https://github.com/benjie/crystal/commit/f93c79b94eb93ae04b1b2e0478f5106e1aca8ee2),
  [`53e164cbc`](https://github.com/benjie/crystal/commit/53e164cbca7eaf1e6e03c849ac1bbe1789c61105),
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - @dataplan/json@0.0.1-1.1
  - pg-sql2@5.0.0-1.1
  - @graphile/lru@5.0.0-1.1

## 0.0.1-0.28

### Patch Changes

- [#257](https://github.com/benjie/crystal/pull/257)
  [`9e7183c02`](https://github.com/benjie/crystal/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)
  Thanks [@benjie](https://github.com/benjie)! - Don't mangle class names, we
  want them for debugging.

- [#257](https://github.com/benjie/crystal/pull/257)
  [`fce77f40e`](https://github.com/benjie/crystal/commit/fce77f40efb194a3dfa7f38bfe20eb99e09efa70)
  Thanks [@benjie](https://github.com/benjie)! - Maintain types through
  lambda/list (if you get type errors after this update, you may need to put
  'readonly' in more of your types).
- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/crystal/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/crystal/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)]:
  - grafast@0.0.1-0.23
  - pg-sql2@5.0.0-0.4
  - @dataplan/json@0.0.1-0.23

## 0.0.1-0.27

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.22
  - @dataplan/json@0.0.1-0.22

## 0.0.1-0.26

### Patch Changes

- [#229](https://github.com/benjie/crystal/pull/229)
  [`13cfc7501`](https://github.com/benjie/crystal/commit/13cfc75019d42353c1e6be394c28c6ba61ab32d0)
  Thanks [@benjie](https://github.com/benjie)! - pgConfig.listen is no more; it
  was redundant versus PgSubscriber. Have migrated PgIntrospectionPlugin to use
  PgSubscriber instead.
- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/crystal/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)]:
  - grafast@0.0.1-0.21
  - @dataplan/json@0.0.1-0.21

## 0.0.1-0.25

### Patch Changes

- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20
  - @dataplan/json@0.0.1-0.20

## 0.0.1-0.24

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/crystal/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19
  - @dataplan/json@0.0.1-0.19

## 0.0.1-0.23

### Patch Changes

- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/crystal/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`c8a56cdc8`](https://github.com/benjie/crystal/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)]:
  - grafast@0.0.1-0.18
  - @dataplan/json@0.0.1-0.18

## 0.0.1-0.22

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17
  - @dataplan/json@0.0.1-0.17

## 0.0.1-0.21

### Patch Changes

- [#214](https://github.com/benjie/crystal/pull/214)
  [`7e3bfef04`](https://github.com/benjie/crystal/commit/7e3bfef04ebb76fbde8273341ec92073b9e9f04d)
  Thanks [@benjie](https://github.com/benjie)! - Correctly drop null/undefined
  pgSettings keys

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/crystal/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)]:
  - grafast@0.0.1-0.16
  - @dataplan/json@0.0.1-0.16

## 0.0.1-0.20

### Patch Changes

- [#210](https://github.com/benjie/crystal/pull/210)
  [`2bd4b619e`](https://github.com/benjie/crystal/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `extensions.pg = { databaseName, schemaName, name }` to various DB-derived
  resources (codecs, sources, etc); this replaces the `originalName` temporary
  solution that we had previously.

- [#210](https://github.com/benjie/crystal/pull/210)
  [`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - grafast@0.0.1-0.15
  - @dataplan/json@0.0.1-0.15

## 0.0.1-0.19

### Patch Changes

- [#204](https://github.com/benjie/crystal/pull/204)
  [`92c2378f2`](https://github.com/benjie/crystal/commit/92c2378f297cc917f542b126e1cdddf58e1f0fc3)
  Thanks [@benjie](https://github.com/benjie)! - Ensure codecs 'toPg' and
  'fromPg' never have to handle null.

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
  - @dataplan/json@0.0.1-0.14

## 0.0.1-0.18

### Patch Changes

- [#202](https://github.com/benjie/crystal/pull/202)
  [`a14bd2288`](https://github.com/benjie/crystal/commit/a14bd2288532b0977945d1c0508e51baef6dba2b)
  Thanks [@benjie](https://github.com/benjie)! - Expose
  pgWhereConditionSpecListToSQL helper function.

- [#201](https://github.com/benjie/crystal/pull/201)
  [`dca706ad9`](https://github.com/benjie/crystal/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

## 0.0.1-0.17

### Patch Changes

- [`e5b664b6f`](undefined) - Fix "Cannot find module '../package.json'" error

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13
  - @dataplan/json@0.0.1-0.13

## 0.0.1-0.16

### Patch Changes

- [#197](https://github.com/benjie/crystal/pull/197)
  [`4f5d5bec7`](https://github.com/benjie/crystal/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36)
  Thanks [@benjie](https://github.com/benjie)! - Fix importing subpaths via ESM

- [#200](https://github.com/benjie/crystal/pull/200)
  [`fb40bd97b`](https://github.com/benjie/crystal/commit/fb40bd97b8a36da91c6b08e0ce67f1a9419ad91f)
  Thanks [@benjie](https://github.com/benjie)! - Move PgSubscriber to
  @dataplan/pg/adaptors/pg and automatically build it if you set `pubsub: true`
  in your `makePgConfig` call.
- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/crystal/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`25f5a6cbf`](https://github.com/benjie/crystal/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12
  - @dataplan/json@0.0.1-0.12

## 0.0.1-0.15

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#196](https://github.com/benjie/crystal/pull/196)
  [`af9bc38c8`](https://github.com/benjie/crystal/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7)
  Thanks [@benjie](https://github.com/benjie)! - Allow passing `pool` directly
  to `makePgConfig`.

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

- [#192](https://github.com/benjie/crystal/pull/192)
  [`80091a8e0`](https://github.com/benjie/crystal/commit/80091a8e0343a162bf2b60cf619267a874a67e60)
  Thanks [@benjie](https://github.com/benjie)! - - Conflicts in `pgConfigs`
  (e.g. multiple sources using the same 'name') now detected and output
  - Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
  - `makePgConfig` now allows passing `pgSettings` callback and
    `pgSettingsForIntrospection` config object
  - Multiple postgres sources now works nicely with multiple `makePgConfig`
    calls
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/crystal/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/crystal/commit/652cf107316ea5832f69c6a55574632187f5c876)]:
  - @dataplan/json@0.0.1-0.11
  - grafast@0.0.1-0.11
  - pg-sql2@5.0.0-0.3

## 0.0.1-0.14

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.10
  - @dataplan/json@0.0.1-0.10

## 0.0.1-0.13

### Patch Changes

- Updated dependencies
  [[`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - grafast@0.0.1-0.9
  - @dataplan/json@0.0.1-0.9

## 0.0.1-0.12

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/crystal/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - @dataplan/json@0.0.1-0.8

## 0.0.1-0.11

### Patch Changes

- [`0e440a862`](https://github.com/benjie/crystal/commit/0e440a862d29e8db40fd72413223a10de885ef46)
  Thanks [@benjie](https://github.com/benjie)! - Add new
  `--superuser-connection` option to allow installing watch fixtures as
  superuser.

## 0.0.1-0.10

### Patch Changes

- Updated dependencies []:
  - grafast@0.0.1-0.7
  - @dataplan/json@0.0.1-0.7

## 0.0.1-0.9

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET

## 0.0.1-0.8

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - pg-sql2@5.0.0-0.2
  - @dataplan/json@0.0.1-0.6

## 0.0.1-0.7

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - @dataplan/json@0.0.1-0.5

## 0.0.1-0.6

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/json@0.0.1-0.4
  - grafast@0.0.1-0.4

## 0.0.1-0.5

### Patch Changes

- [`9ebe3d860`](undefined) - Fix issue with webpack bundling adaptor

## 0.0.1-0.4

### Patch Changes

- [`bf83f591d`](undefined) - Fix deps

## 0.0.1-0.3

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3

## 0.0.1-0.2

### Patch Changes

- [`25037fc15`](undefined) - Fix distribution of TypeScript types

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2

## 0.0.1-0.1

### Patch Changes

- [`55f15cf35`](undefined) - Tweaked build script

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - pg-sql2@5.0.0-0.1
