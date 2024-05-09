# graphile-export

## 0.0.2-beta.13

### Patch Changes

- Updated dependencies
  [[`bd5a908a4`](https://github.com/graphile/crystal/commit/bd5a908a4d04310f90dfb46ad87398ffa993af3b)]:
  - grafast@0.1.1-beta.8

## 0.0.2-beta.12

### Patch Changes

- [#2050](https://github.com/graphile/crystal/pull/2050)
  [`a4d4de334`](https://github.com/graphile/crystal/commit/a4d4de33435d3f6d04d9e627bcc3e77f6eb66c7b)
  Thanks [@benjie](https://github.com/benjie)! - Graphile Export now
  auto-detects that a function has additional properties set, and makes sure
  these properties are exported too. (Typically this is `fn.isSyncAndSafe=true`
  for Grafast optimization.)

- [#2050](https://github.com/graphile/crystal/pull/2050)
  [`de24f1d14`](https://github.com/graphile/crystal/commit/de24f1d143a331f410cf4955a18b10a09790f7f8)
  Thanks [@benjie](https://github.com/benjie)! - Fix exporting input object
  inputPlan in typeDefs mode.

- [#1993](https://github.com/graphile/crystal/pull/1993)
  [`fdc440eb3`](https://github.com/graphile/crystal/commit/fdc440eb31004114aa5e1d91d290414dd0587746)
  Thanks [@benjie](https://github.com/benjie)! - Ability to export values from
  graphile-export (e.g. the registry)

- [#2050](https://github.com/graphile/crystal/pull/2050)
  [`0dbfbb687`](https://github.com/graphile/crystal/commit/0dbfbb68747f2755ba228afe22bf2da25348c71b)
  Thanks [@benjie](https://github.com/benjie)! - Don't pass filePath to lintText
  to avoid ESLint ignoring the file.

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
  - pg-sql2@5.0.0-beta.6

## 0.0.2-beta.11

### Patch Changes

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

## 0.0.2-beta.10

### Patch Changes

- [#1934](https://github.com/graphile/crystal/pull/1934)
  [`9ac0ddc01`](https://github.com/graphile/crystal/commit/9ac0ddc014bfceb60b4b5641d6e8db605cc6a79b)
  Thanks [@benjie](https://github.com/benjie)! - Automatically detect when a
  `graphile-export` export is invalid, and throw an error indicating which
  method needs to have `EXPORTABLE` added around it.

- [#1935](https://github.com/graphile/crystal/pull/1935)
  [`8ea67f891`](https://github.com/graphile/crystal/commit/8ea67f8910693edaf70daa9952e35d8396166f38)
  Thanks [@benjie](https://github.com/benjie)! - Fix lots of things related to
  exporting a schema with `graphile-export`.

- Updated dependencies
  [[`63dd7ea99`](https://github.com/graphile/crystal/commit/63dd7ea992d30ad711dd85a73a127484a0e35479),
  [`d801c9778`](https://github.com/graphile/crystal/commit/d801c9778a86d61e060896460af9fe62a733534a),
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195)]:
  - grafast@0.1.1-beta.5
  - pg-sql2@5.0.0-beta.5

## 0.0.2-beta.9

### Patch Changes

- Updated dependencies
  [[`a2176ea32`](https://github.com/graphile/crystal/commit/a2176ea324db0801249661b30e9c9d314c6fb159),
  [`886833e2e`](https://github.com/graphile/crystal/commit/886833e2e319f23d905d7184ca88fca701b94044)]:
  - grafast@0.1.1-beta.4

## 0.0.2-beta.8

### Patch Changes

- Updated dependencies []:
  - grafast@0.1.1-beta.3

## 0.0.2-beta.7

### Patch Changes

- Updated dependencies
  [[`3fdc2bce4`](https://github.com/graphile/crystal/commit/3fdc2bce42418773f808c5b8309dfb361cd95ce9),
  [`aeef362b5`](https://github.com/graphile/crystal/commit/aeef362b5744816f01e4a6f714bbd77f92332bc5),
  [`8a76db07f`](https://github.com/graphile/crystal/commit/8a76db07f4c110cecc6225504f9a05ccbcbc7b92),
  [`8a0cdb95f`](https://github.com/graphile/crystal/commit/8a0cdb95f200b28b0ea1ab5caa12b23dce5f374f),
  [`1c9f1c0ed`](https://github.com/graphile/crystal/commit/1c9f1c0edf4e621a5b6345d3a41527a18143c6ae)]:
  - grafast@0.1.1-beta.2

## 0.0.2-beta.6

### Patch Changes

- Updated dependencies
  [[`49fcb0d58`](https://github.com/graphile/crystal/commit/49fcb0d585b31b291c9072c339d6f5b550eefc9f)]:
  - grafast@0.1.1-beta.1

## 0.0.2-beta.5

### Patch Changes

- Updated dependencies
  [[`4a4d26d87`](https://github.com/graphile/crystal/commit/4a4d26d87ce74589429b8ca5126a7bfdf30351b8),
  [`b2bce88da`](https://github.com/graphile/crystal/commit/b2bce88da26c7a8965468be16fc2d935eadd3434),
  [`861a8a306`](https://github.com/graphile/crystal/commit/861a8a306ef42a821da19e77903ddd7e8130bfb3)]:
  - grafast@0.1.1-beta.0

## 0.0.2-beta.4

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
  - pg-sql2@5.0.0-beta.3

## 0.0.2-beta.3

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1),
  [`e613b476d`](https://github.com/benjie/crystal/commit/e613b476d6ee867d1f7509c895dabee40e7f9a31)]:
  - grafast@0.0.1-beta.6
  - pg-sql2@5.0.0-beta.2

## 0.0.2-beta.2

### Patch Changes

- [#454](https://github.com/benjie/crystal/pull/454)
  [`89400d5c2`](https://github.com/benjie/crystal/commit/89400d5c2bb44aeccbb6285c283313f4e3947847)
  Thanks [@benjie](https://github.com/benjie)! - Apply a different patch to the
  babel traverse issue we've been facing when optimizing.

## 0.0.2-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - grafast@0.0.1-beta.1
  - pg-sql2@5.0.0-beta.1

## 0.0.2-alpha.8

### Patch Changes

- [#428](https://github.com/benjie/crystal/pull/428)
  [`9695c65f8`](https://github.com/benjie/crystal/commit/9695c65f8dbad807de683a70f5f663af2d3b35f0)
  Thanks [@benjie](https://github.com/benjie)! - Optimize away some unnecessary
  content from graphile-exported schema

- Updated dependencies
  [[`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996),
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b),
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)]:
  - grafast@0.0.1-alpha.15

## 0.0.2-alpha.7

### Patch Changes

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

## 0.0.2-alpha.6

### Patch Changes

- [#406](https://github.com/benjie/crystal/pull/406)
  [`ecd7598f1`](https://github.com/benjie/crystal/commit/ecd7598f1a12c724e744249246eec7b882198a8a)
  Thanks [@benjie](https://github.com/benjie)! - More docs for graphile-export

- Updated dependencies
  [[`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999)]:
  - grafast@0.0.1-alpha.12

## 0.0.2-alpha.5

### Patch Changes

- [#372](https://github.com/benjie/crystal/pull/372)
  [`ae1a248eb`](https://github.com/benjie/crystal/commit/ae1a248ebd5e907f94f37e44f2d17737cd5755cb)
  Thanks [@benjie](https://github.com/benjie)! - Optimize away even more IIFEs

- [#383](https://github.com/benjie/crystal/pull/383)
  [`2c8586b36`](https://github.com/benjie/crystal/commit/2c8586b367b76af91d1785cc90455c70911fdec7)
  Thanks [@benjie](https://github.com/benjie)! - Change
  'objectType.extensions.grafast.Step' to
  'objectType.extensions.grafast.assertStep', accept it via object spec,
  deprecate registerObjectType form that accepts it (pass via object spec
  instead), improve typings around it.
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

## 0.0.2-alpha.4

### Patch Changes

- [#366](https://github.com/benjie/crystal/pull/366)
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256)
  Thanks [@benjie](https://github.com/benjie)! - Fix typeDefs export, and
  makeGrafastSchema support for arg and input field plans.
- Updated dependencies
  [[`339fe20d0`](https://github.com/benjie/crystal/commit/339fe20d0c6e8600d263ce8093cd85a6ea8adbbf),
  [`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - pg-sql2@5.0.0-alpha.3
  - grafast@0.0.1-alpha.9

## 0.0.2-alpha.3

### Patch Changes

- [#332](https://github.com/benjie/crystal/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/crystal/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

## 0.0.2-alpha.2

### Patch Changes

- [`21e95326d`](https://github.com/benjie/crystal/commit/21e95326d72eaad7a8860c4c21a11736191f169b)
  Thanks [@benjie](https://github.com/benjie)! - Fix the name of some exported
  variables (Step -> Plan)

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`82cc01152`](https://github.com/benjie/crystal/commit/82cc01152ee06dafce45299661afd77ad943d785),
  [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - grafast@0.0.1-alpha.3
  - pg-sql2@5.0.0-alpha.2

## 0.0.2-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - pg-sql2@5.0.0-alpha.1

## 0.0.2-1.1

### Patch Changes

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/crystal/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/crystal/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/crystal/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`f93c79b94`](https://github.com/benjie/crystal/commit/f93c79b94eb93ae04b1b2e0478f5106e1aca8ee2),
  [`53e164cbc`](https://github.com/benjie/crystal/commit/53e164cbca7eaf1e6e03c849ac1bbe1789c61105),
  [`395b4a2dd`](https://github.com/benjie/crystal/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - pg-sql2@5.0.0-1.1

## 0.0.2-0.4

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4

## 0.0.2-0.3

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3

## 0.0.2-0.2

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2

## 0.0.2-0.1

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1

## 0.0.2-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - grafast@0.0.1-0.0
  - pg-sql2@5.0.0-0.1
