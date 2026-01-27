# graphql-codegen-grafast

## 1.0.0-rc.3

### Patch Changes

- [#2873](https://github.com/graphile/crystal/pull/2873)
  [`0772086`](https://github.com/graphile/crystal/commit/0772086411a55d56b4e345cff1eef133eee31b36)
  Thanks [@benjie](https://github.com/benjie)! - Update TypeScript configuration
  to support Node 22 minimum

## 1.0.0-rc.2

### Patch Changes

- [#2829](https://github.com/graphile/crystal/pull/2829)
  [`a82e6fa`](https://github.com/graphile/crystal/commit/a82e6fae099f7e9d62fb3fc1ee173368cdabca27)
  Thanks [@benjie](https://github.com/benjie)! - Update dependency ranges.

## 1.0.0-rc.1

### Patch Changes

- [#2785](https://github.com/graphile/crystal/pull/2785)
  [`641222b`](https://github.com/graphile/crystal/commit/641222b999e0401f76886ffd09aebc27488b1ba1)
  Thanks [@benjie](https://github.com/benjie)! - Fix generation for abstract
  types to reflect Grafast type changes. Specifically, `source` and `specifier`
  have reversed order, and `specifier` is generated as the _data_ type rather
  than the _step_ type. If you had `specifier: ...` in your type overrides file
  (unlikely), please ensure this change is reflected: `specifier: Step<T>`
  should now be `specifier: T`.

- [`8a5a7c5`](https://github.com/graphile/crystal/commit/8a5a7c536fc4b9b702600c5cc3d413724670c327)
  Thanks [@benjie](https://github.com/benjie)! - Bump to release candidate

## 0.0.1-beta.3

### Patch Changes

- [#2730](https://github.com/graphile/crystal/pull/2730)
  [`4c3cf22`](https://github.com/graphile/crystal/commit/4c3cf22592f44cb28e399434474ca5fcef0e1a3b)
  Thanks [@benjie](https://github.com/benjie)! - Update `graphql` version range

- [#2723](https://github.com/graphile/crystal/pull/2723)
  [`f2dca50`](https://github.com/graphile/crystal/commit/f2dca50c48f86eaf832d11570a46362ae67e9170)
  Thanks [@benjie](https://github.com/benjie)! - List types now have a more
  correct type generated.

## 0.0.1-beta.2

### Patch Changes

- [#2562](https://github.com/graphile/crystal/pull/2562)
  [`3064e14`](https://github.com/graphile/crystal/commit/3064e14773676043799b270cf82c13759a7a5e7b)
  Thanks [@adrtivv](https://github.com/adrtivv)! - Uses `convertName` to convert
  names, should improve compatibility with non-standard configurations/field
  names.

## 0.0.1-beta.1

### Patch Changes

- [`a37a183fd2474380317097a714e81527aad98a80`](https://github.com/graphile/crystal/commit/a37a183fd2474380317097a714e81527aad98a80)
  Thanks [@benjie](https://github.com/benjie)! - Initial release of package.

- [#2549](https://github.com/graphile/crystal/pull/2549)
  [`949a16c36a5dd744831a8a7d71a1ffd75eb06cc1`](https://github.com/graphile/crystal/commit/949a16c36a5dd744831a8a7d71a1ffd75eb06cc1)
  Thanks [@benjie](https://github.com/benjie)! - First release of
  `graphql-codegen-grafast`
