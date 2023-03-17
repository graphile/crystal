# graphile-utils

## 5.0.0-0.34

### Patch Changes

- [#236](https://github.com/benjie/postgraphile-private/pull/236)
  [`c802cb307`](https://github.com/benjie/postgraphile-private/commit/c802cb307da0ee69fb8bd0eba4cde8984855ddfa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 makeWrapPlansPlugin callback
  is now passed `build` rather than `options` - use `build.options` to get the
  options object. 🚨 makeWrapPlansPlugin filters now accept only three args
  (`context`, `build`, `field`) since the fourth argument (`options`) was
  redundant - get it from `build.options` instead.

## 5.0.0-0.33

### Patch Changes

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`a50bc5be4`](https://github.com/benjie/postgraphile-private/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8)
  Thanks [@benjie](https://github.com/benjie)! - Introduce new
  GraphQLObjectType_fields_field_args_arg and
  GraphQLInterfaceType_fields_field_args_arg hooks to resolve some plugin
  ordering issues.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

- Updated dependencies
  [[`a50bc5be4`](https://github.com/benjie/postgraphile-private/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8),
  [`6fb7ef449`](https://github.com/benjie/postgraphile-private/commit/6fb7ef4494b4f61b3b1aa36642e51eb9ec99a941),
  [`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85),
  [`2f50a633a`](https://github.com/benjie/postgraphile-private/commit/2f50a633acab7c112413ec4576beeec2efef24df),
  [`005e5cea0`](https://github.com/benjie/postgraphile-private/commit/005e5cea01224533282bc4d0f3516368fb8db81a)]:
  - graphile-build@5.0.0-0.28
  - graphile-build-pg@5.0.0-0.33
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22

## 5.0.0-0.32

### Patch Changes

- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa),
  [`13cfc7501`](https://github.com/benjie/postgraphile-private/commit/13cfc75019d42353c1e6be394c28c6ba61ab32d0),
  [`b9a2236d4`](https://github.com/benjie/postgraphile-private/commit/b9a2236d43cc92e06085298e379de71f7fdedcb7),
  [`ac6137bb6`](https://github.com/benjie/postgraphile-private/commit/ac6137bb60a34a3ebf5fad3c6ac153c95acb6158)]:
  - grafast@0.0.1-0.21
  - graphile-build-pg@5.0.0-0.32
  - graphile-build@5.0.0-0.27

## 5.0.0-0.31

### Patch Changes

- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20
  - graphile-build@5.0.0-0.26
  - graphile-build-pg@5.0.0-0.31

## 5.0.0-0.30

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/postgraphile-private/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19
  - graphile-build@5.0.0-0.25
  - graphile-build-pg@5.0.0-0.30

## 5.0.0-0.29

### Patch Changes

- [#223](https://github.com/benjie/postgraphile-private/pull/223)
  [`df8c06657`](https://github.com/benjie/postgraphile-private/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)
  Thanks [@benjie](https://github.com/benjie)! - `graphile-utils` now includes
  the `makeAddPgTableConditionPlugin` and `makeAddPgTableOrderByPlugin`
  generators, freshly ported from V4. The signatures of these functions has
  changed slightly, but the functionality is broadly the same.
- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/postgraphile-private/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`2abc58cf6`](https://github.com/benjie/postgraphile-private/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245),
  [`c8a56cdc8`](https://github.com/benjie/postgraphile-private/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c),
  [`df8c06657`](https://github.com/benjie/postgraphile-private/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)]:
  - grafast@0.0.1-0.18
  - graphile-build@5.0.0-0.24
  - graphile-build-pg@5.0.0-0.29

## 5.0.0-0.28

### Patch Changes

- Updated dependencies
  [[`f2c1423fb`](https://github.com/benjie/postgraphile-private/commit/f2c1423fbd6c354146a70a9a2ebabd97370b9b05),
  [`b58f5dfac`](https://github.com/benjie/postgraphile-private/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)]:
  - graphile-build-pg@5.0.0-0.28
  - graphile-build@5.0.0-0.23

## 5.0.0-0.27

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17
  - graphile-build@5.0.0-0.22
  - graphile-build-pg@5.0.0-0.27

## 5.0.0-0.26

### Patch Changes

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/postgraphile-private/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5),
  [`3ed7d3349`](https://github.com/benjie/postgraphile-private/commit/3ed7d334939e5e0ab2f63b2fde202884cc2daa74)]:
  - grafast@0.0.1-0.16
  - graphile-build-pg@5.0.0-0.26
  - graphile-build@5.0.0-0.21

## 5.0.0-0.25

### Patch Changes

- Updated dependencies [[`a8d26b30a`](undefined)]:
  - graphile-build-pg@5.0.0-0.25

## 5.0.0-0.24

### Patch Changes

- Updated dependencies [[`5812ad277`](undefined)]:
  - graphile-build-pg@5.0.0-0.24

## 5.0.0-0.23

### Patch Changes

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`2fb5001b4`](https://github.com/benjie/postgraphile-private/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d),
  [`2bd4b619e`](https://github.com/benjie/postgraphile-private/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99),
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - graphile-build@5.0.0-0.20
  - graphile-build-pg@5.0.0-0.23
  - grafast@0.0.1-0.15

## 5.0.0-0.22

### Patch Changes

- [#206](https://github.com/benjie/postgraphile-private/pull/206)
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/postgraphile-private/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/postgraphile-private/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14
  - graphile-build@5.0.0-0.19
  - graphile-build-pg@5.0.0-0.22

## 5.0.0-0.21

### Patch Changes

- Updated dependencies
  [[`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)]:
  - graphile-build@5.0.0-0.18
  - graphile-build-pg@5.0.0-0.21

## 5.0.0-0.20

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13
  - graphile-build-pg@5.0.0-0.20
  - graphile-build@5.0.0-0.17

## 5.0.0-0.19

### Patch Changes

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`9f85b0308`](https://github.com/benjie/postgraphile-private/commit/9f85b030896d335ee2d0da2b93c3784d0eb841ea)
  Thanks [@benjie](https://github.com/benjie)! - Fix bugs around handling of the
  plans/resolvers objects.

- [#198](https://github.com/benjie/postgraphile-private/pull/198)
  [`f9948e4e9`](https://github.com/benjie/postgraphile-private/commit/f9948e4e913299ca4f3858d45105790df2acaa89)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in
  makePgSmartTagsPlugin that prevented smart tags being loaded early enough from
  files.
- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`a1158d83e`](https://github.com/benjie/postgraphile-private/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12
  - graphile-build@5.0.0-0.16
  - graphile-build-pg@5.0.0-0.19

## 5.0.0-0.18

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876),
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)]:
  - grafast@0.0.1-0.11
  - graphile-build@5.0.0-0.15
  - graphile-build-pg@5.0.0-0.18
  - graphile-config@0.0.1-0.5
  - pg-introspection@0.0.1-0.3

## 5.0.0-0.17

### Patch Changes

- Updated dependencies [[`72bf5f535`](undefined)]:
  - graphile-build@5.0.0-0.14
  - graphile-build-pg@5.0.0-0.17

## 5.0.0-0.16

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10
  - graphile-build@5.0.0-0.13
  - graphile-build-pg@5.0.0-0.16

## 5.0.0-0.15

### Patch Changes

- Updated dependencies
  [[`ebb24895c`](https://github.com/benjie/postgraphile-private/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005),
  [`d3cba220c`](https://github.com/benjie/postgraphile-private/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65),
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)]:
  - graphile-build-pg@5.0.0-0.15
  - graphile-build@5.0.0-0.12

## 5.0.0-0.14

### Patch Changes

- Updated dependencies
  [[`1b040b3ba`](https://github.com/benjie/postgraphile-private/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0),
  [`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-build-pg@5.0.0-0.14
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9
  - graphile-build@5.0.0-0.11

## 5.0.0-0.13

### Patch Changes

- [#173](https://github.com/benjie/postgraphile-private/pull/173)
  [`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in grafast causing
  loadOne to error. Add missing JSON5 dependency.

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - graphile-build@5.0.0-0.10
  - graphile-build-pg@5.0.0-0.13

## 5.0.0-0.12

### Patch Changes

- Updated dependencies
  [[`af9f11f28`](https://github.com/benjie/postgraphile-private/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3),
  [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a),
  [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)]:
  - graphile-build-pg@5.0.0-0.12
  - graphile-build@5.0.0-0.9

## 5.0.0-0.11

### Patch Changes

- Updated dependencies [[`677c8f5fc`](undefined)]:
  - graphile-build@5.0.0-0.8
  - graphile-build-pg@5.0.0-0.11
  - pg-introspection@0.0.1-0.2
  - grafast@0.0.1-0.7

## 5.0.0-0.10

### Patch Changes

- Updated dependencies []:
  - graphile-build-pg@5.0.0-0.10

## 5.0.0-0.9

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - graphile-build@5.0.0-0.7
  - graphile-build-pg@5.0.0-0.9
  - graphile-config@0.0.1-0.2
  - pg-introspection@0.0.1-0.1

## 5.0.0-0.8

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.8
  - graphile-build@5.0.0-0.6

## 5.0.0-0.7

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4
  - graphile-build@5.0.0-0.5
  - graphile-build-pg@5.0.0-0.7

## 5.0.0-0.6

### Patch Changes

- Updated dependencies []:
  - graphile-build-pg@5.0.0-0.6

## 5.0.0-0.5

### Patch Changes

- Updated dependencies []:
  - graphile-build-pg@5.0.0-0.5

## 5.0.0-0.4

### Patch Changes

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3
  - graphile-build@5.0.0-0.4
  - graphile-build-pg@5.0.0-0.4
  - graphile-config@0.0.1-0.1

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2
  - graphile-build-pg@5.0.0-0.3
  - graphile-build@5.0.0-0.3

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1
  - graphile-build-pg@5.0.0-0.2
  - graphile-build@5.0.0-0.2

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - grafast@0.0.1-0.0
  - graphile-build@5.0.0-0.1
  - graphile-build-pg@5.0.0-0.1
  - graphile-config@0.0.1-0.0
  - pg-introspection@0.0.1-0.0
