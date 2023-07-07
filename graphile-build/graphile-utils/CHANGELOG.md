# graphile-utils

## 5.0.0-alpha.13

### Patch Changes

- Updated dependencies
  [[`70b2c3900`](https://github.com/benjie/postgraphile-private/commit/70b2c3900cd29d241e968fc81d6279848fafb9ae),
  [`37d829b89`](https://github.com/benjie/postgraphile-private/commit/37d829b8912fb3d2b7e1aa99d2314444d136971d),
  [`ff91a5660`](https://github.com/benjie/postgraphile-private/commit/ff91a5660c5a33ab32555ab3da12f880179d9892),
  [`644938276`](https://github.com/benjie/postgraphile-private/commit/644938276ebd48c5486ba9736a525fcc66d7d714),
  [`47365f0df`](https://github.com/benjie/postgraphile-private/commit/47365f0df2644fd91839a6698998e1463df8de79),
  [`339cb005e`](https://github.com/benjie/postgraphile-private/commit/339cb005ed91aa8d421cdacd934877aee32e3f23)]:
  - graphile-build-pg@5.0.0-alpha.13
  - graphile-build@5.0.0-alpha.12
  - graphile-config@0.0.1-alpha.5
  - grafast@0.0.1-alpha.11

## 5.0.0-alpha.12

### Patch Changes

- [#399](https://github.com/benjie/postgraphile-private/pull/399)
  [`409581534`](https://github.com/benjie/postgraphile-private/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd)
  Thanks [@benjie](https://github.com/benjie)! - Change many of the dependencies
  to be instead (or also) peerDependencies, to avoid duplicate modules.

- [#396](https://github.com/benjie/postgraphile-private/pull/396)
  [`7573bf374`](https://github.com/benjie/postgraphile-private/commit/7573bf374897228b613b19f37b4e076737db3279)
  Thanks [@benjie](https://github.com/benjie)! - Address a decent number of
  TODO/FIXME/etc comments in the codebase.

- [#383](https://github.com/benjie/postgraphile-private/pull/383)
  [`2c8586b36`](https://github.com/benjie/postgraphile-private/commit/2c8586b367b76af91d1785cc90455c70911fdec7)
  Thanks [@benjie](https://github.com/benjie)! - Change
  'objectType.extensions.grafast.Step' to
  'objectType.extensions.grafast.assertStep', accept it via object spec,
  deprecate registerObjectType form that accepts it (pass via object spec
  instead), improve typings around it.
- Updated dependencies
  [[`409581534`](https://github.com/benjie/postgraphile-private/commit/409581534f41ac2cf0ff21c77c2bcd8eaa8218fd),
  [`17fe531d7`](https://github.com/benjie/postgraphile-private/commit/17fe531d729e88a7126b0e2e06fc1ee9ab3ac5b8),
  [`b7533bd4d`](https://github.com/benjie/postgraphile-private/commit/b7533bd4dfc210cb8b113b8fa06f163a212aa5e4),
  [`326aa99cd`](https://github.com/benjie/postgraphile-private/commit/326aa99cd5e6b5cc8f30e4500382738eb63b792d),
  [`9238d3ce4`](https://github.com/benjie/postgraphile-private/commit/9238d3ce4f6f59295ba849d6325286e4847c1bac),
  [`9feb769c2`](https://github.com/benjie/postgraphile-private/commit/9feb769c2df0c57971ed26a937be4a1bee7a7524),
  [`b5eb7c490`](https://github.com/benjie/postgraphile-private/commit/b5eb7c490305b869e1bfc176a5a417e28f1411cd),
  [`976958e80`](https://github.com/benjie/postgraphile-private/commit/976958e80c791819cd80e96df8209dcff1918585),
  [`7573bf374`](https://github.com/benjie/postgraphile-private/commit/7573bf374897228b613b19f37b4e076737db3279),
  [`95b2ab41e`](https://github.com/benjie/postgraphile-private/commit/95b2ab41e41976de852276b83f7fb5924555e7c5),
  [`2c8586b36`](https://github.com/benjie/postgraphile-private/commit/2c8586b367b76af91d1785cc90455c70911fdec7),
  [`8230fcaeb`](https://github.com/benjie/postgraphile-private/commit/8230fcaeb0286c905fc0dad4b7af2d94bac88a44),
  [`6f545683c`](https://github.com/benjie/postgraphile-private/commit/6f545683c981af4ee40d51b272a053b01d535491),
  [`c43802d74`](https://github.com/benjie/postgraphile-private/commit/c43802d7419f93d18964c654f16d0937a2e23ca0),
  [`b118b8f6d`](https://github.com/benjie/postgraphile-private/commit/b118b8f6dc18196212cfb0a05486e1dd8d77ccf8),
  [`b66d2503b`](https://github.com/benjie/postgraphile-private/commit/b66d2503b90eb458af709bb593e5a00d869df03f),
  [`9008c4f87`](https://github.com/benjie/postgraphile-private/commit/9008c4f87df53be4051c49f9836358dc2baa59df),
  [`47ff7e824`](https://github.com/benjie/postgraphile-private/commit/47ff7e824b2fc96c11f601c3814d0200208711ce),
  [`b868aa63f`](https://github.com/benjie/postgraphile-private/commit/b868aa63f7759396b71fdd1e8eda1012352ad595),
  [`e8c81cd20`](https://github.com/benjie/postgraphile-private/commit/e8c81cd2046390ed5b6799aa7ff3d90b28a1861a),
  [`3caaced6c`](https://github.com/benjie/postgraphile-private/commit/3caaced6cfbac4a187a245a61eb103edcb8cd4c9),
  [`9f2507ed9`](https://github.com/benjie/postgraphile-private/commit/9f2507ed9fe8a6abe93c9c8a1cff410446587fd6)]:
  - graphile-build-pg@5.0.0-alpha.12
  - graphile-build@5.0.0-alpha.11
  - grafast@0.0.1-alpha.10
  - pg-introspection@0.0.1-alpha.3

## 5.0.0-alpha.11

### Patch Changes

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/postgraphile-private/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/postgraphile-private/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`a94f11091`](https://github.com/benjie/postgraphile-private/commit/a94f11091520b52d90fd007986760848ed20017b),
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/postgraphile-private/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/postgraphile-private/commit/2ac706f18660c855fe20f460b50694fdd04a7768),
  [`bcfffd5fe`](https://github.com/benjie/postgraphile-private/commit/bcfffd5fe14d5bbc3517c62041da585a3bf1bab1),
  [`dad4d4aae`](https://github.com/benjie/postgraphile-private/commit/dad4d4aaee499098104841740c9049b1deb6ac5f),
  [`e443db39b`](https://github.com/benjie/postgraphile-private/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)]:
  - grafast@0.0.1-alpha.9
  - graphile-build-pg@5.0.0-alpha.11
  - graphile-build@5.0.0-alpha.10
  - graphile-config@0.0.1-alpha.4

## 5.0.0-alpha.10

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/postgraphile-private/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - graphile-build@5.0.0-alpha.9
  - graphile-build-pg@5.0.0-alpha.10

## 5.0.0-alpha.9

### Patch Changes

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/postgraphile-private/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`2fcbe688c`](https://github.com/benjie/postgraphile-private/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`fe9154b23`](https://github.com/benjie/postgraphile-private/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215),
  [`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - graphile-build-pg@5.0.0-alpha.9
  - graphile-build@5.0.0-alpha.8
  - graphile-config@0.0.1-alpha.3

## 5.0.0-alpha.8

### Patch Changes

- Updated dependencies
  [[`dcc3d0355`](https://github.com/benjie/postgraphile-private/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773),
  [`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba),
  [`ca1526b70`](https://github.com/benjie/postgraphile-private/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6),
  [`3426b0f4a`](https://github.com/benjie/postgraphile-private/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)]:
  - graphile-build-pg@5.0.0-alpha.8
  - grafast@0.0.1-alpha.6
  - graphile-build@5.0.0-alpha.7

## 5.0.0-alpha.7

### Patch Changes

- Updated dependencies
  [[`ef8432511`](https://github.com/benjie/postgraphile-private/commit/ef84325111416a9663417bb58ec664998040cf7c),
  [`86e503d78`](https://github.com/benjie/postgraphile-private/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`2850e4732`](https://github.com/benjie/postgraphile-private/commit/2850e4732ff173347357dba048eaf3c1ef775497),
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - graphile-build-pg@5.0.0-alpha.7
  - grafast@0.0.1-alpha.5
  - graphile-build@5.0.0-alpha.6

## 5.0.0-alpha.6

### Patch Changes

- Updated dependencies
  [[`1ea7acdf5`](https://github.com/benjie/postgraphile-private/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)]:
  - graphile-build-pg@5.0.0-alpha.6

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/postgraphile-private/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950)]:
  - grafast@0.0.1-alpha.4
  - graphile-build@5.0.0-alpha.5
  - graphile-build-pg@5.0.0-alpha.5

## 5.0.0-alpha.4

### Patch Changes

- Updated dependencies
  [[`faa1c9eaa`](https://github.com/benjie/postgraphile-private/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)]:
  - graphile-build-pg@5.0.0-alpha.4
  - graphile-build@5.0.0-alpha.4

## 5.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`2389f47ec`](https://github.com/benjie/postgraphile-private/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`e91ee201d`](https://github.com/benjie/postgraphile-private/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/postgraphile-private/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`9605165d5`](https://github.com/benjie/postgraphile-private/commit/9605165d5857c97053778275836b95bf19c0b1c9),
  [`d39a5d409`](https://github.com/benjie/postgraphile-private/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - grafast@0.0.1-alpha.3
  - graphile-build@5.0.0-alpha.3
  - graphile-build-pg@5.0.0-alpha.3
  - graphile-config@0.0.1-alpha.2
  - pg-introspection@0.0.1-alpha.2

## 5.0.0-alpha.2

### Patch Changes

- Updated dependencies
  [[`3df3f1726`](https://github.com/benjie/postgraphile-private/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafast@0.0.1-alpha.2
  - graphile-build-pg@5.0.0-alpha.2
  - graphile-build@5.0.0-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - graphile-build@5.0.0-alpha.1
  - graphile-build-pg@5.0.0-alpha.1
  - graphile-config@0.0.1-alpha.1
  - pg-introspection@0.0.1-alpha.1

## 5.0.0-1.3

### Patch Changes

- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/postgraphile-private/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2
  - graphile-build-pg@5.0.0-1.3
  - graphile-build@5.0.0-1.3

## 5.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/postgraphile-private/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2
  - graphile-build@5.0.0-1.2
  - graphile-build-pg@5.0.0-1.2

## 5.0.0-1.1

### Patch Changes

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#271](https://github.com/benjie/postgraphile-private/pull/271)
  [`261eb520b`](https://github.com/benjie/postgraphile-private/commit/261eb520b33fe3673fe3a7712085e50291aed1e5)
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
  [[`2df36c5a1`](https://github.com/benjie/postgraphile-private/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7),
  [`c5d89d705`](https://github.com/benjie/postgraphile-private/commit/c5d89d7052dfaaf4c597c8c36858795fa7227b07),
  [`a73f9c709`](https://github.com/benjie/postgraphile-private/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26),
  [`ae304b33c`](https://github.com/benjie/postgraphile-private/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/postgraphile-private/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`c22dcde7b`](https://github.com/benjie/postgraphile-private/commit/c22dcde7b53af323d907b22a0a69924841072aa9),
  [`bd37be707`](https://github.com/benjie/postgraphile-private/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1),
  [`96b0bd14e`](https://github.com/benjie/postgraphile-private/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4),
  [`d951897ee`](https://github.com/benjie/postgraphile-private/commit/d951897eea824acabdb17baab4bf900b4b3b842f),
  [`366b166dc`](https://github.com/benjie/postgraphile-private/commit/366b166dc88a340de7f092f92840b0fba1f03d60),
  [`261eb520b`](https://github.com/benjie/postgraphile-private/commit/261eb520b33fe3673fe3a7712085e50291aed1e5),
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef),
  [`a14cf5f4c`](https://github.com/benjie/postgraphile-private/commit/a14cf5f4c233cd794eb4d3c6f2281e747d234a71)]:
  - graphile-build-pg@5.0.0-1.1
  - graphile-build@5.0.0-1.1
  - grafast@0.0.1-1.1
  - pg-introspection@0.0.1-1.1
  - graphile-config@0.0.1-1.1

## 5.0.0-0.35

### Patch Changes

- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83)]:
  - grafast@0.0.1-0.23
  - graphile-build-pg@5.0.0-0.34
  - graphile-build@5.0.0-0.29

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
