# grafast

## 0.1.1-beta.1

### Patch Changes

- [#1808](https://github.com/graphile/crystal/pull/1808)
  [`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f)
  Thanks [@morleytatro](https://github.com/morleytatro)! - Fix typos

- Updated dependencies
  [[`7aef73319`](https://github.com/graphile/crystal/commit/7aef73319a8a147c700727be62427e1eefdefbf8)]:
  - graphile-config@0.0.1-beta.4

## 0.1.1-beta.0

### Patch Changes

- [#1779](https://github.com/graphile/crystal/pull/1779)
  [`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8)
  Thanks [@benjie](https://github.com/benjie)! - Fix a polymorphic planning
  issue.

- [#1778](https://github.com/graphile/crystal/pull/1778)
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434)
  Thanks [@benjie](https://github.com/benjie)! - Enable source maps in modules
  where it was disabled.

- [#1780](https://github.com/graphile/crystal/pull/1780)
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)
  Thanks [@benjie](https://github.com/benjie)! - Fix an issue with side effect
  plans and polymorphism

## 0.0.1-beta.8

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

- [#513](https://github.com/graphile/crystal-pre-merge/pull/513)
  [`ede1092fe`](https://github.com/graphile/crystal-pre-merge/commit/ede1092fe197719b6fa786f4cfa75f6a1f4c56c1)
  Thanks [@benjie](https://github.com/benjie)! - A couple minor follow-up fixes
  to plan diagrams

- [#498](https://github.com/graphile/crystal-pre-merge/pull/498)
  [`566983fbd`](https://github.com/graphile/crystal-pre-merge/commit/566983fbd99c4b2df8c4ebd6260521670a2b7dfc)
  Thanks [@benjie](https://github.com/benjie)! - loadOne and loadMany now
  support "input/output equivalence" feature to enable collapsing of request
  waterfalls.

- [#502](https://github.com/graphile/crystal-pre-merge/pull/502)
  [`409bf6071`](https://github.com/graphile/crystal-pre-merge/commit/409bf607180d4d8faec658c803e5ec4d1a00c451)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug when merging AccessStep
  into OutputPlan relation to optionalGet

- Updated dependencies
  [[`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)]:
  - graphile-config@0.0.1-beta.3
  - tamedevil@0.0.0-beta.3
  - @graphile/lru@5.0.0-beta.3

## 0.0.1-beta.7

### Patch Changes

- [`3700e204f`](https://github.com/benjie/crystal/commit/3700e204f430db182c92ca7abc82017c81fa1f9b)
  Thanks [@benjie](https://github.com/benjie)! - Fix grafast mermaid export

## 0.0.1-beta.6

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- [#496](https://github.com/benjie/crystal/pull/496)
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)
  Thanks [@benjie](https://github.com/benjie)! - `mermaid-js` explain type no
  longer supported, instead use `plan` which produces a JSON object. You can use
  the new `import { planToMermaid } from 'grafast/mermaid'` to convert this
  object back into a mermaid definition.
- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)]:
  - graphile-config@0.0.1-beta.2
  - tamedevil@0.0.0-beta.2
  - @graphile/lru@5.0.0-beta.2

## 0.0.1-beta.5

### Patch Changes

- [#488](https://github.com/benjie/crystal/pull/488)
  [`53186213a`](https://github.com/benjie/crystal/commit/53186213ade962f4b66cb0d5ea8b57b5ce7ea85f)
  Thanks [@benjie](https://github.com/benjie)! - Expose new `makeDecodeNodeId`
  helper

## 0.0.1-beta.4

### Patch Changes

- [#465](https://github.com/benjie/crystal/pull/465)
  [`f9cc88dc4`](https://github.com/benjie/crystal/commit/f9cc88dc442d371aee154a28d4e63c6da39f6b2e)
  Thanks [@benjie](https://github.com/benjie)! - Make type of step in
  specFromNodeId more flexible.

## 0.0.1-beta.3

### Patch Changes

- [#448](https://github.com/benjie/crystal/pull/448)
  [`46cd08aa1`](https://github.com/benjie/crystal/commit/46cd08aa13e3bac4d186c72c6ce24997f37658af)
  Thanks [@benjie](https://github.com/benjie)! - Fix access step to use safe
  access pattern even when compiled

## 0.0.1-beta.2

### Patch Changes

- [#444](https://github.com/benjie/crystal/pull/444)
  [`23bd3c291`](https://github.com/benjie/crystal/commit/23bd3c291246aebf27cf2784f40fc948485f43c9)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in processing variables
  of stricter types than arguments.

## 0.0.1-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - graphile-config@0.0.1-beta.1
  - @graphile/lru@5.0.0-beta.1
  - tamedevil@0.0.0-beta.1

## 0.0.1-alpha.16

### Patch Changes

- [#441](https://github.com/benjie/crystal/pull/441)
  [`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)
  Thanks [@benjie](https://github.com/benjie)! - Change bundling techniques for
  grafast and @dataplan/pg

## 0.0.1-alpha.15

### Patch Changes

- [#433](https://github.com/benjie/crystal/pull/433)
  [`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996)
  Thanks [@benjie](https://github.com/benjie)! - Change type of `args` from
  `ExecutionArgs` to `Grafast.ExecutionArgs` and thus the type of
  `args.contextValue` from `unknown` to `Grafast.Context`.

- [#428](https://github.com/benjie/crystal/pull/428)
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug exporting schema, and
  importing schema with \_\_assertStep.

- [#422](https://github.com/benjie/crystal/pull/422)
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)
  Thanks [@benjie](https://github.com/benjie)! - Comments enabled in released
  packages

- Updated dependencies
  [[`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d)]:
  - graphile-config@0.0.1-alpha.7

## 0.0.1-alpha.14

### Patch Changes

- [`d99d666fb`](https://github.com/benjie/crystal/commit/d99d666fb234eb02dd196610995fa480c596242a)
  Thanks [@benjie](https://github.com/benjie)! - Fix grafast release command

## 0.0.1-alpha.13

### Patch Changes

- [#417](https://github.com/benjie/crystal/pull/417)
  [`620f9e07e`](https://github.com/benjie/crystal/commit/620f9e07ec6f4d66a8dc01ed6bb054a75f7b1c8b)
  Thanks [@benjie](https://github.com/benjie)! - Grafast now supports
  `operationsCacheMaxLength` and `operationOperationPlansCacheMaxLength`
  configuration via `schema.extensions.grafast.*`. Currently undocumented.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`1882e0185`](https://github.com/benjie/crystal/commit/1882e018576adf69bcae8a999224cb4d5e62a3e1)
  Thanks [@benjie](https://github.com/benjie)! - `constant(foo)` no longer adds
  the value of `foo` to the plan diagram unless you pass `true` as the second
  option (`constant(foo, true)`) or `foo` is something very basic like
  `null`/`undefined`/`true`/`false`. This is to protect your secrets.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`881672305`](https://github.com/benjie/crystal/commit/88167230578393e3b24a364f0d673e36c5cb088d)
  Thanks [@benjie](https://github.com/benjie)! - `deepEval` has been renamed to
  `applyTransforms`

- [#417](https://github.com/benjie/crystal/pull/417)
  [`e5012f9a1`](https://github.com/benjie/crystal/commit/e5012f9a1901af63e1703ea4d717e8a22544f5e7)
  Thanks [@benjie](https://github.com/benjie)! - Move `GrafastFieldExtensions`
  to `Grafast.FieldExtensions` and the same for most other `Grafast*Extensions`
  interfaces. This is to make TypeScript declaration merging easier.

- [#418](https://github.com/benjie/crystal/pull/418)
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul peerDependencies and
  dependencies to try and eliminate duplicate modules error.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`47f6f018b`](https://github.com/benjie/crystal/commit/47f6f018b11761cbfaa63d709edc0e3f4f9a9924)
  Thanks [@benjie](https://github.com/benjie)! - Fix planning such that
  OutputPlan optimizations based on `AccessPlan` can happen after the AccessPlan
  is optimized.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`ff4395bfc`](https://github.com/benjie/crystal/commit/ff4395bfc6e6b2fb263f644dae1e984c52dd84b9)
  Thanks [@benjie](https://github.com/benjie)! - Grafast operation cache now
  tied to the schema, so multiple schemas will not cause degraded performance
  from clearing the cache.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`502b23340`](https://github.com/benjie/crystal/commit/502b233401975637bc0d516af78721b37f6f9b7b)
  Thanks [@benjie](https://github.com/benjie)! - `preset.grafast.context` second
  parameter is no longer the existing GraphQL context, but instead the GraphQL
  request details (which contains the `contextValue`). If you were using this
  (unlikely), add `.contextValue` to usage of the second argument.

## 0.0.1-alpha.12

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

- Updated dependencies
  [[`f5dd38aa3`](https://github.com/benjie/crystal/commit/f5dd38aa34c10f5ef0e0fa8fa48b70534ac3c294),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999),
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd),
  [`088d83b1d`](https://github.com/benjie/crystal/commit/088d83b1de2782a1a37a5998747b202a6c2b27a2),
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37)]:
  - tamedevil@0.0.0-alpha.4
  - graphile-config@0.0.1-alpha.6

## 0.0.1-alpha.11

### Patch Changes

- Updated dependencies
  [[`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)]:
  - graphile-config@0.0.1-alpha.5

## 0.0.1-alpha.10

### Patch Changes

- [#399](https://github.com/benjie/crystal/pull/399)
  [`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd)
  Thanks [@benjie](https://github.com/benjie)! - Change many of the dependencies
  to be instead (or also) peerDependencies, to avoid duplicate modules.

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b7533bd4d`](https://github.com/benjie/crystal/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery will no
  longer deliver payloads for paths that don't exist when an error is thrown in
  an output plan.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`9feb769c2`](https://github.com/benjie/crystal/commit/9feb769c2df0c57971ed26a937be4a1bee7a7524)
  Thanks [@benjie](https://github.com/benjie)! - Improve debugging message when
  new steps are created at a time when doing so is forbidden.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`7573bf374`](https://github.com/benjie/crystal/commit/7573bf374897228b613b19f37b4e076737db3279)
  Thanks [@benjie](https://github.com/benjie)! - Address a decent number of
  TODO/FIXME/etc comments in the codebase.

- [#383](https://github.com/benjie/crystal/pull/383)
  [`2c8586b36`](https://github.com/benjie/crystal/commit/2c8586b367b76af91d1785cc90455c70911fdec7)
  Thanks [@benjie](https://github.com/benjie)! - Change
  'objectType.extensions.grafast.Step' to
  'objectType.extensions.grafast.assertStep', accept it via object spec,
  deprecate registerObjectType form that accepts it (pass via object spec
  instead), improve typings around it.

- [#398](https://github.com/benjie/crystal/pull/398)
  [`c43802d74`](https://github.com/benjie/crystal/commit/c43802d7419f93d18964c654f16d0937a2e23ca0)
  Thanks [@benjie](https://github.com/benjie)! - Fix a number of issues relating
  to incremental delivery and iterators

- [#398](https://github.com/benjie/crystal/pull/398)
  [`b118b8f6d`](https://github.com/benjie/crystal/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8)
  Thanks [@benjie](https://github.com/benjie)! - Incremental delivery `@stream`
  now works for regular steps as well as streamable steps.

- [#397](https://github.com/benjie/crystal/pull/397)
  [`9008c4f87`](https://github.com/benjie/crystal/commit/9008c4f87df53be4051c49f9836358dc2baa59df)
  Thanks [@benjie](https://github.com/benjie)! - Ensure rejected promises are
  handled in the same tick to avoid process crash.

- [#396](https://github.com/benjie/crystal/pull/396)
  [`e8c81cd20`](https://github.com/benjie/crystal/commit/e8c81cd2046390ed5b6799aa7ff3d90b28a1861a)
  Thanks [@benjie](https://github.com/benjie)! - (Internal) metaByMetaKey is now
  stored onto the bucket rather than the request context, this allows running
  steps inside special buckets (subscriptions, mutations) to run with a clean
  cache.

## 0.0.1-alpha.9

### Patch Changes

- [#359](https://github.com/benjie/crystal/pull/359)
  [`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f)
  Thanks [@benjie](https://github.com/benjie)! - Restore field-local handling of
  planning errors safely, eradicating all steps created while planning an
  errored field (and falling back to blowing up the request on error).

- [#358](https://github.com/benjie/crystal/pull/358)
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5)
  Thanks [@benjie](https://github.com/benjie)! - Allow destructuring steps
  directly from FieldArgs for more convenient plan resolvers.

  Example:

  ```diff
   const plans = {
     Mutation: {
  -    updateUser(_, fieldArgs) {
  -      const $id = fieldArgs.getRaw(['input', 'id']);
  -      const $username = fieldArgs.getRaw(['input', 'patch', 'username']);
  -      const $bio = fieldArgs.getRaw(['input', 'patch', 'bio']);
  +    updateUser(_, { $input: { $id, $patch: { $username, $bio } } }) {
         return pgUpdateSingle(
           usersResource,
           { id: $id },
           { username: $username, bio: $bio }
         );
       }
  ```

- [#355](https://github.com/benjie/crystal/pull/355)
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84)
  Thanks [@benjie](https://github.com/benjie)! - **MAJOR BREAKING CHANGE**:
  implicit application of args/input fields has been removed.

  Previously we would track the fieldArgs that you accessed (via `.get()`,
  `.getRaw()` or `.apply()`) and those that you _did not access_ would
  automatically have their `applyPlan` called, if they had one. This isn't
  likely to be particularly useful for pure Gra*fast* users (unless they want to
  adopt this pattern) but it's extremely useful for plugin-based schemas as it
  allows plugins to add arguments that can influence their field's plan _without
  having to wrap the field's plan resolver function_. This is fairly critical,
  otherwise each behavior added (`first:`, `condition:`, `orderBy:`, `filter:`,
  `ignoreArchived:`, etc etc) would wrap the plan resolver with another function
  layer, and they would get _messy_.

  However, implicit is rarely good. And it turns out that it severely limited
  what I wanted to do for improving the `fieldArgs` APIs.

  I decided to remove this implicit functionality by making it more explicit, so
  now args/input fields can specify the relevant
  `autoApplyAfterParent{Plan,SubscribePlan,InputPlan,ApplyPlan}: true` property
  and we'll only apply them at a single level.

  From a user perspective, little has changed. From a plugin author perspective,
  if you were relying on the implicit `applyPlan` then you should now add the
  relevant `autoApply*` property next to your `applyPlan` method.

- [#366](https://github.com/benjie/crystal/pull/366)
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256)
  Thanks [@benjie](https://github.com/benjie)! - Fix typeDefs export, and
  makeGrafastSchema support for arg and input field plans.

- [#361](https://github.com/benjie/crystal/pull/361)
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768)
  Thanks [@benjie](https://github.com/benjie)! - Loosen up some TypeScript types

- Updated dependencies
  [[`339fe20d0`](https://github.com/benjie/crystal/commit/339fe20d0c6e8600d263ce8093cd85a6ea8adbbf),
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25)]:
  - tamedevil@0.0.0-alpha.3
  - graphile-config@0.0.1-alpha.4

## 0.0.1-alpha.8

### Patch Changes

- [#354](https://github.com/benjie/crystal/pull/354)
  [`dd3ef599c`](https://github.com/benjie/crystal/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)
  Thanks [@benjie](https://github.com/benjie)! - HOTFIX: fix bugs in object()
  and list() and blow up entire request if planning error occurs.

## 0.0.1-alpha.7

### Patch Changes

- [#343](https://github.com/benjie/crystal/pull/343)
  [`5c9d32264`](https://github.com/benjie/crystal/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360)
  Thanks [@benjie](https://github.com/benjie)! - Default plan resolver will now
  use `$parent.get(fieldName)` if $parent has a get method, falling back to old
  `access()` behavior if not.

- [#341](https://github.com/benjie/crystal/pull/341)
  [`2fcbe688c`](https://github.com/benjie/crystal/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb)
  Thanks [@benjie](https://github.com/benjie)! - Ensure interfaces with zero
  implementations don't cause a crash.

- [#345](https://github.com/benjie/crystal/pull/345)
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d)
  Thanks [@benjie](https://github.com/benjie)! - Cursor validation errors are
  now raised by the connection directly, rather than the subfields.
- Updated dependencies
  [[`adc7ae5e0`](https://github.com/benjie/crystal/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - graphile-config@0.0.1-alpha.3

## 0.0.1-alpha.6

### Patch Changes

- [#339](https://github.com/benjie/crystal/pull/339)
  [`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)
  Thanks [@benjie](https://github.com/benjie)! - CRITICAL BUGFIX: mistake in
  optimization of list() can lead to arrays being truncated

## 0.0.1-alpha.5

### Patch Changes

- [#335](https://github.com/benjie/crystal/pull/335)
  [`86e503d78`](https://github.com/benjie/crystal/commit/86e503d785626ad9a2e91ec2e70b272dd632d425)
  Thanks [@benjie](https://github.com/benjie)! - - Adjust OutputPlan printing

  - Fix `path` used to track planning errors
  - Fix tree shaking when eradicating all steps in a LayerPlan
  - Don't `deduplicateSteps()` when printing the plan graph 🤣
  - `each()` can now be as connection capable as the list plan was (via
    delegation)

- [#336](https://github.com/benjie/crystal/pull/336)
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)
  Thanks [@benjie](https://github.com/benjie)! - Fix over-cautious throw when
  dealing with recursive inputs.

## 0.0.1-alpha.4

### Patch Changes

- [`45dcf3a8f`](https://github.com/benjie/crystal/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)
  Thanks [@benjie](https://github.com/benjie)! - Fix error message when
  detecting duplicate grafast modules

## 0.0.1-alpha.3

### Patch Changes

- [`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d)
  Thanks [@benjie](https://github.com/benjie)! - Massive overhaul of planning,
  now up to 2x faster!

  - 🚨 `metaKey` and `optimizeMetaKey` now default to `undefined` - if you need
    the `meta` object in your step class, be sure to set them (e.g.
    `this.metaKey = this.id`)
  - `RemapKeys` can optimize itself away if it doesn't really do anything
  - Simpler plan diagrams - non-polymorphic buckets no longer have "polymorphic
    paths"
  - `deduplicate()` will now no-longer receive the step itself as a peer

- [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b)
  Thanks [@benjie](https://github.com/benjie)! - Various optimizations of the
  Gra*fast* plan by converting things to constants where possible.

  - `Step.optimize()` is now passed a `meta` object if the step sets
    `optimizeMetaKey`; this object can store planning-only values and share
    across a step family.
  - `__InputStaticLeafStep` now optimizes down to a constant
  - `ListStep` where every entry in the list is a constant is now automatically
    replaced with a `ConstantStep` representing the final list
  - `ObjectStep` where all the values are `ConstantStep` is now replaced with a
    `ConstantStep`
  - `ConstantStep` can now deduplicate with other constant steps with the exact
    same value
  - `OperationPlan.optimizeStep()` now also re-deduplicates the step if it
    supports multiple optimizations
  - `ConstantStep` now has `toStringMeta` to represent the constant value in the
    plan diagram
  - When each step is processed (but not by deduplicate) we'll automatically try
    and deduplicate any new steps created

- [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827)
  Thanks [@benjie](https://github.com/benjie)! - The order in which steps are
  added to the plan diagram has changed, resulting in more optimal rendering.

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)
  Thanks [@benjie](https://github.com/benjie)! - Implement planning and
  execution timeouts; add the following to your preset (the second argument to
  `grafast()` or `execute()`):

  ```ts
  const preset = {
    grafast: {
      timeouts: {
        /** Planning timeout in ms */
        planning: 500,

        /** Execution timeout in ms */
        execution: 30_000,
      },
    },
  };
  ```

- Updated dependencies
  [[`87e6c65a7`](https://github.com/benjie/crystal/commit/87e6c65a7a687044895b3b6c9f131384984e7674),
  [`98ae00f59`](https://github.com/benjie/crystal/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)]:
  - tamedevil@0.0.0-alpha.2
  - @graphile/lru@5.0.0-alpha.2
  - graphile-config@0.0.1-alpha.2

## 0.0.1-alpha.2

### Patch Changes

- [#308](https://github.com/benjie/crystal/pull/308)
  [`3df3f1726`](https://github.com/benjie/crystal/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 LoadOneStep/LoadManyStep and
  related helpers have been merged into `LoadStep` so that the underlying
  business logic can be shared.

  `loadOne`/`loadMany` are still used exactly as before, but some of the related
  types and helpers have been renamed and `loadOne` now results in the same step
  class as an item from a `loadMany` (`LoadedRecordStep`).

  References to `LoadOneStep` and `LoadManySingleRecordStep` both need to be
  replaced with `LoadedRecordStep`.

  References to `LoadManyStep` need to be replaced with `LoadStep`.

  `LoadOneOptions` and `LoadManyOptions` are now both `LoadOptions` (and types
  refer to the _item_ type).

## 0.0.1-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - graphile-config@0.0.1-alpha.1
  - @graphile/lru@5.0.0-alpha.1
  - tamedevil@0.0.0-alpha.1

## 0.0.1-1.3

### Patch Changes

- [#293](https://github.com/benjie/crystal/pull/293)
  [`8d270ead3`](https://github.com/benjie/crystal/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf)
  Thanks [@benjie](https://github.com/benjie)! - Ensure subroutine steps are
  processed before their subroutine parent in dependents-first mode to simplify
  plan diagrams.
- Updated dependencies
  [[`b4eaf89f4`](https://github.com/benjie/crystal/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - graphile-config@0.0.1-1.2

## 0.0.1-1.2

### Patch Changes

- [`7dcb0e008`](https://github.com/benjie/crystal/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in Grafast's
  UnbatchedExecutableStep when handling steps with 0 dependencies.

## 0.0.1-1.1

### Patch Changes

- [#271](https://github.com/benjie/crystal/pull/271)
  [`ae304b33c`](https://github.com/benjie/crystal/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645)
  Thanks [@benjie](https://github.com/benjie)! - Rename opPlan to operationPlan
  throughout.

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#265](https://github.com/benjie/crystal/pull/265)
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8)
  Thanks [@benjie](https://github.com/benjie)! - 'extensions.graphile' is now
  'extensions.grafast'

- [#279](https://github.com/benjie/crystal/pull/279)
  [`0f4709356`](https://github.com/benjie/crystal/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc)
  Thanks [@benjie](https://github.com/benjie)! - `__TrackedObjectStep` is now
  `__TrackedValueStep`. `MapStep`/`map()` are now `RemapKeysStep`/`remapKeys()`.
  `ListTransform` now accepts `listStep` rather than `listPlan`.

- [#266](https://github.com/benjie/crystal/pull/266)
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)
  Thanks [@benjie](https://github.com/benjie)! - The Grafast step class
  'execute' and 'stream' methods now have a new additional first argument
  `count` which indicates how many results they must return. This means we don't
  need to rely on the `values[0].length` trick to determine how many results to
  return, and thus we can pass through an empty tuple to steps that have no
  dependencies.
- Updated dependencies
  [[`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)]:
  - graphile-config@0.0.1-1.1
  - tamedevil@0.0.0-1.1
  - @graphile/lru@5.0.0-1.1

## 0.0.1-0.23

### Patch Changes

- [#257](https://github.com/benjie/crystal/pull/257)
  [`89d16c972`](https://github.com/benjie/crystal/commit/89d16c972f12659de091b0b866768cacfccc8f6b)
  Thanks [@benjie](https://github.com/benjie)! - PgClassSinglePlan is now
  enforced, users will be informed if plans return a step incompatible with the
  given GraphQL object type.

- [#257](https://github.com/benjie/crystal/pull/257)
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf)
  Thanks [@benjie](https://github.com/benjie)! - When multiple versions of
  grafast or pg-sql2 are detected, a warning will be raised.

- [#257](https://github.com/benjie/crystal/pull/257)
  [`9e7183c02`](https://github.com/benjie/crystal/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)
  Thanks [@benjie](https://github.com/benjie)! - Don't mangle class names, we
  want them for debugging.

## 0.0.1-0.22

### Patch Changes

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6

## 0.0.1-0.21

### Patch Changes

- [#229](https://github.com/benjie/crystal/pull/229)
  [`f5a04cf66`](https://github.com/benjie/crystal/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **BREAKING CHANGE**
  `hookArgs()` now accepts arguments in the same order as `grafast()`:
  `hookArgs(args, resolvedPreset, ctx)`. Please update all your `hookArgs`
  calls.

## 0.0.1-0.20

### Patch Changes

- [`aac8732f9`](undefined) - Make item callback optional in listen() step.

## 0.0.1-0.19

### Patch Changes

- [#225](https://github.com/benjie/crystal/pull/225)
  [`397e8bb40`](https://github.com/benjie/crystal/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)
  Thanks [@benjie](https://github.com/benjie)! - Gra*fast* will no longer hoist
  steps into a mutationField layer plan making it safer to mutate `context` and
  similar things during a mutation.

## 0.0.1-0.18

### Patch Changes

- [#223](https://github.com/benjie/crystal/pull/223)
  [`4c2b7d1ca`](https://github.com/benjie/crystal/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0)
  Thanks [@benjie](https://github.com/benjie)! - In addition to `GraphQLArgs`,
  `grafast` now accepts `resolvedPreset` and `requestContext`; if both of these
  are set then `grafast` will perform `hookArgs` for you, this makes running
  tests a lot less boiler-plate-y (you no longer need to
  `parse`/`validate`/`execute` - just `grafast`).

- [#224](https://github.com/benjie/crystal/pull/224)
  [`c8a56cdc8`](https://github.com/benjie/crystal/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)
  Thanks [@benjie](https://github.com/benjie)! - FieldArgs.apply can now accept
  a callback so each list entry can have its own step (solves the OR vs AND
  issue in postgraphile-plugin-connection-filter).

## 0.0.1-0.17

### Patch Changes

- [`f48860d4f`](undefined) - Allow adding resolver-only fields to planned types.

## 0.0.1-0.16

### Patch Changes

- [#214](https://github.com/benjie/crystal/pull/214)
  [`df89aba52`](https://github.com/benjie/crystal/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)
  Thanks [@benjie](https://github.com/benjie)! - Query planning errors now
  output (to console) in production too

## 0.0.1-0.15

### Patch Changes

- [#210](https://github.com/benjie/crystal/pull/210)
  [`b523118fe`](https://github.com/benjie/crystal/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

## 0.0.1-0.14

### Patch Changes

- [#204](https://github.com/benjie/crystal/pull/204)
  [`d76043453`](https://github.com/benjie/crystal/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79)
  Thanks [@benjie](https://github.com/benjie)! - Add support for GraphQL
  subscribe method (in addition to Grafast's subscribePlan).

- [#207](https://github.com/benjie/crystal/pull/207)
  [`afa0ea5f6`](https://github.com/benjie/crystal/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in subscriptions where
  termination of underlying stream wouldn't terminate the subscription.

- [#206](https://github.com/benjie/crystal/pull/206)
  [`851b78ef2`](https://github.com/benjie/crystal/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.

- [#204](https://github.com/benjie/crystal/pull/204)
  [`384b3594f`](https://github.com/benjie/crystal/commit/384b3594f543d113650c1b6b02b276360dd2d15f)
  Thanks [@benjie](https://github.com/benjie)! - Allow subscriptions to come
  from async generator functions (previous detection of this was broken, only
  our manual async iterator objects were working).

## 0.0.1-0.13

### Patch Changes

- [`e5b664b6f`](undefined) - Fix "Cannot find module '../package.json'" error

## 0.0.1-0.12

### Patch Changes

- [#197](https://github.com/benjie/crystal/pull/197)
  [`4f5d5bec7`](https://github.com/benjie/crystal/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36)
  Thanks [@benjie](https://github.com/benjie)! - Fix importing subpaths via ESM

- [#200](https://github.com/benjie/crystal/pull/200)
  [`25f5a6cbf`](https://github.com/benjie/crystal/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in 'listen' error
  message causing additional error to be thrown.

## 0.0.1-0.11

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#195](https://github.com/benjie/crystal/pull/195)
  [`4783bdd7c`](https://github.com/benjie/crystal/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef)
  Thanks [@benjie](https://github.com/benjie)! - Fix handling of variables in
  introspection queries.

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

- Updated dependencies [[`0ab95d0b1`](undefined)]:
  - graphile-config@0.0.1-0.5
  - tamedevil@0.0.0-0.4

## 0.0.1-0.10

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/crystal/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4

## 0.0.1-0.9

### Patch Changes

- [#176](https://github.com/benjie/crystal/pull/176)
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.
- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/crystal/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3

## 0.0.1-0.8

### Patch Changes

- [#173](https://github.com/benjie/crystal/pull/173)
  [`208166269`](https://github.com/benjie/crystal/commit/208166269177d6e278b056e1c77d26a2d8f59f49)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in grafast causing
  loadOne to error. Add missing JSON5 dependency.

## 0.0.1-0.7

### Patch Changes

- Updated dependencies [[`4ca7fce12`](undefined)]:
  - tamedevil@0.0.0-0.3

## 0.0.1-0.6

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - graphile-config@0.0.1-0.2
  - tamedevil@0.0.0-0.2

## 0.0.1-0.5

### Patch Changes

- [`cd37fd02a`](undefined) - Introduce new tamedevil package for managing JIT
  code

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - tamedevil@0.0.0-0.1

## 0.0.1-0.4

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

## 0.0.1-0.3

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - graphile-config@0.0.1-0.1

## 0.0.1-0.2

### Patch Changes

- [`25037fc15`](undefined) - Fix distribution of TypeScript types

## 0.0.1-0.1

### Patch Changes

- [`55f15cf35`](undefined) - Tweaked build script

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - graphile-config@0.0.1-0.0
