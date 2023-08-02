# @grafserv/persisted

## 0.0.0-beta.2

### Patch Changes

- Updated dependencies
  [[`23bd3c291`](https://github.com/benjie/crystal/commit/23bd3c291246aebf27cf2784f40fc948485f43c9)]:
  - grafast@0.0.1-beta.2
  - grafserv@0.0.1-beta.2

## 0.0.0-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - grafast@0.0.1-beta.1
  - grafserv@0.0.1-beta.1
  - graphile-config@0.0.1-beta.1
  - @graphile/lru@5.0.0-beta.1

## 0.0.0-alpha.17

### Patch Changes

- Updated dependencies
  [[`dfefdad3c`](https://github.com/benjie/crystal/commit/dfefdad3cd5a99c36d47eb0bddd914bab4ca9a1f)]:
  - grafast@0.0.1-alpha.16
  - grafserv@0.0.1-alpha.16

## 0.0.0-alpha.16

### Patch Changes

- Updated dependencies
  [[`ea003ca3a`](https://github.com/benjie/crystal/commit/ea003ca3a8f68fb87dca603582e47981ed033996),
  [`57d88b5fa`](https://github.com/benjie/crystal/commit/57d88b5fa3ed296210c1fcb223452213fd57985b),
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d),
  [`9f87a26b1`](https://github.com/benjie/crystal/commit/9f87a26b10e5539aa88cfd9909e265513e941fd5)]:
  - grafast@0.0.1-alpha.15
  - graphile-config@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.15

## 0.0.0-alpha.15

### Patch Changes

- Updated dependencies
  [[`d99d666fb`](https://github.com/benjie/crystal/commit/d99d666fb234eb02dd196610995fa480c596242a)]:
  - grafast@0.0.1-alpha.14
  - grafserv@0.0.1-alpha.14

## 0.0.0-alpha.14

### Patch Changes

- [#418](https://github.com/benjie/crystal/pull/418)
  [`9ab2adba2`](https://github.com/benjie/crystal/commit/9ab2adba2c146b5d1bc91bbb2f25e4645ed381de)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul peerDependencies and
  dependencies to try and eliminate duplicate modules error.

- [#417](https://github.com/benjie/crystal/pull/417)
  [`9a324f195`](https://github.com/benjie/crystal/commit/9a324f195568f3ee6ade858c881fe9777c238c14)
  Thanks [@benjie](https://github.com/benjie)! - Use an LRU for caching the
  getter from options - prevents memory exhaustion in the case of poorly written
  consumer code.
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
  - grafserv@0.0.1-alpha.13

## 0.0.0-alpha.13

### Patch Changes

- [#407](https://github.com/benjie/crystal/pull/407)
  [`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478)
  Thanks [@benjie](https://github.com/benjie)! - Exported `version` no longer
  uses `require('../package.json')` hack, instead the version number is written
  to a source file at versioning time. Packages now export `version`.

- [#408](https://github.com/benjie/crystal/pull/408)
  [`799007532`](https://github.com/benjie/crystal/commit/79900753258f5fae8c64160281dfd4f3c68d7b11)
  Thanks [@benjie](https://github.com/benjie)! - No longer polls the persisted
  queries folder every 5 seconds unless you configure it to do so. New watch
  mode _untested_.
- Updated dependencies
  [[`9281a2d88`](https://github.com/benjie/crystal/commit/9281a2d889ab1e72a3f6f9777779f31a6588d478),
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999),
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd),
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37)]:
  - grafast@0.0.1-alpha.12
  - graphile-config@0.0.1-alpha.6
  - grafserv@0.0.1-alpha.12

## 0.0.0-alpha.12

### Patch Changes

- Updated dependencies
  [[`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)]:
  - graphile-config@0.0.1-alpha.5
  - grafast@0.0.1-alpha.11
  - grafserv@0.0.1-alpha.11

## 0.0.0-alpha.11

### Patch Changes

- [#399](https://github.com/benjie/crystal/pull/399)
  [`409581534`](https://github.com/benjie/crystal/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd)
  Thanks [@benjie](https://github.com/benjie)! - Change many of the dependencies
  to be instead (or also) peerDependencies, to avoid duplicate modules.
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
  - grafserv@0.0.1-alpha.10
  - grafast@0.0.1-alpha.10

## 0.0.0-alpha.10

### Patch Changes

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/crystal/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/crystal/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/crystal/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/crystal/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/crystal/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4
  - grafserv@0.0.1-alpha.9

## 0.0.0-alpha.9

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/crystal/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - grafserv@0.0.1-alpha.8

## 0.0.0-alpha.8

### Patch Changes

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/crystal/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`9ddaaaa96`](https://github.com/benjie/crystal/commit/9ddaaaa9617874cb44946acfcd252517ae427446),
  [`2fcbe688c`](https://github.com/benjie/crystal/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/crystal/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`adc7ae5e0`](https://github.com/benjie/crystal/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.7
  - graphile-config@0.0.1-alpha.3

## 0.0.0-alpha.7

### Patch Changes

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/crystal/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6
  - grafserv@0.0.1-alpha.6

## 0.0.0-alpha.6

### Patch Changes

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/crystal/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/crystal/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5
  - grafserv@0.0.1-alpha.5

## 0.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/crystal/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4
  - grafserv@0.0.1-alpha.4

## 0.0.0-alpha.4

### Patch Changes

- [#332](https://github.com/benjie/crystal/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/crystal/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

## 0.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`2389f47ec`](https://github.com/benjie/crystal/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`e91ee201d`](https://github.com/benjie/crystal/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/crystal/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/crystal/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - grafast@0.0.1-alpha.3
  - grafserv@0.0.1-alpha.3
  - graphile-config@0.0.1-alpha.2

## 0.0.0-alpha.2

### Patch Changes

- Updated dependencies
  [[`3cf35fdb4`](https://github.com/benjie/crystal/commit/3cf35fdb41d08762e9ff838a55dd7fc6004941f8),
  [`7c45eaf4e`](https://github.com/benjie/crystal/commit/7c45eaf4ed6edf3b9e7bb17846d553f5504e0fb4),
  [`3df3f1726`](https://github.com/benjie/crystal/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafserv@0.0.1-alpha.2
  - grafast@0.0.1-alpha.2

## 0.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - grafserv@0.0.1-alpha.1
  - graphile-config@0.0.1-alpha.1

## 0.0.0-1.1

### Patch Changes

- [#297](https://github.com/benjie/crystal/pull/297)
  [`5a7396e2d`](https://github.com/benjie/crystal/commit/5a7396e2d1675f49b1d54cf6e748f2bc35aefe8a)
  Thanks [@benjie](https://github.com/benjie)! - New @grafserv/persisted plugin
  to add persisted operations support to Grafserv 🎉
- Updated dependencies
  [[`90ed0cb7a`](https://github.com/benjie/crystal/commit/90ed0cb7a78479b85115cd1ce045ac253107b3eb),
  [`56be761c2`](https://github.com/benjie/crystal/commit/56be761c29343e28ba4980c62c955b5adaef25c0),
  [`8d270ead3`](https://github.com/benjie/crystal/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`1a012bdd7`](https://github.com/benjie/crystal/commit/1a012bdd7d3748ac9a4ca9b1f771876654988f25),
  [`b4eaf89f4`](https://github.com/benjie/crystal/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafserv@0.0.1-1.3
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2
