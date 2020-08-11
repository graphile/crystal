# [SEE POSTGRAPHILE RELEASES INSTEAD](https://github.com/graphile/postgraphile/releases)

We use PostGraphile's GitHub releases tab to log our changes in detail, but
this auto-generated changelog helps us to produce that list, and it may be
helpful to you also.

# [](https://github.com/graphile/graphile-engine/compare/v4.8.0-rc.0...v) (2020-08-04)

# [4.8.0-rc.0](https://github.com/graphile/graphile-engine/compare/v4.7.0...v4.8.0-rc.0) (2020-08-04)

### Bug Fixes

- error message typo ([001de88](https://github.com/graphile/graphile-engine/commit/001de88d93fba7657459e581b7f36dbcfee39ff4))
- **live:** live collection for single backward relation record ([#625](https://github.com/graphile/graphile-engine/issues/625)) ([7f0225e](https://github.com/graphile/graphile-engine/commit/7f0225e7bb69bbf3c135cdf1c5c155d92e916a71))
- **watch:** handle errors during watchSchema ([#624](https://github.com/graphile/graphile-engine/issues/624)) ([4ef1b7b](https://github.com/graphile/graphile-engine/commit/4ef1b7b182390e9eeec6a7917b940243dc9c3b0e))

### Features

- add support for "enum tables" ([#635](https://github.com/graphile/graphile-engine/issues/635)) ([e6bde66](https://github.com/graphile/graphile-engine/commit/e6bde667e7e9b151e976d504f9c7a60b2b2f5c0c))
- add support for geometric types ([#637](https://github.com/graphile/graphile-engine/issues/637)) ([419ec87](https://github.com/graphile/graphile-engine/commit/419ec87b5a8affd1d2c24c55b47f3252cd9e6b7f))
- warn early if placeholders will be exhausted ([#632](https://github.com/graphile/graphile-engine/issues/632)) ([5c22e41](https://github.com/graphile/graphile-engine/commit/5c22e41d667412b2ce2ba6d9870d82fdfad65574))
- **graphile-utils:** Type update on addPgTableOrderByPlugin ([#629](https://github.com/graphile/graphile-engine/issues/629)) ([91dbf6f](https://github.com/graphile/graphile-engine/commit/91dbf6f117f4995b22d7105e521bbb927d21b2a1))
- **subscriptions:** [@pg](https://github.com/pg)Subscription now supports initial events ([#612](https://github.com/graphile/graphile-engine/issues/612)) ([e862aad](https://github.com/graphile/graphile-engine/commit/e862aad7f9188975e201dbe01e2d3ed6dbd61476))

# [4.7.0](https://github.com/graphile/graphile-engine/compare/v4.6.0...v4.7.0) (2020-04-27)

### Bug Fixes

- **introspection:** don't query roles when ignoring RBAC ([#598](https://github.com/graphile/graphile-engine/issues/598)) ([bfe2427](https://github.com/graphile/graphile-engine/commit/bfe24276c9ff5eb7d3e9e7aff56a4d2ea61f30c6))
- **types:** relax index signature in JSONPgSmartTags ([#618](https://github.com/graphile/graphile-engine/issues/618)) ([edf2abf](https://github.com/graphile/graphile-engine/commit/edf2abf18dd87e63415c273631dc38741b4e531b))

### Features

- **graphile-build-pg:** expose more utils ([#601](https://github.com/graphile/graphile-engine/issues/601)) ([ac74e2d](https://github.com/graphile/graphile-engine/commit/ac74e2d7088a9d96ef9cac7645f2c6b52d7a66d8))

# [4.6.0](https://github.com/graphile/graphile-engine/compare/v4.5.6...v4.6.0) (2020-01-27)

### Features

- **subscriptions:** [@pg](https://github.com/pg)Subscription now supports filter ([#596](https://github.com/graphile/graphile-engine/issues/596)) ([b197408](https://github.com/graphile/graphile-engine/commit/b197408bc80efdf5ab8c8dffbdab0d70e2c8f191))
- selectively back-port fixes from master ([#594](https://github.com/graphile/graphile-engine/issues/594)) ([9536750](https://github.com/graphile/graphile-engine/commit/953675007d745be51a1c29d3e533636233d8aa0f)), closes [#577](https://github.com/graphile/graphile-engine/issues/577) [#582](https://github.com/graphile/graphile-engine/issues/582) [#583](https://github.com/graphile/graphile-engine/issues/583) [#590](https://github.com/graphile/graphile-engine/issues/590) [#589](https://github.com/graphile/graphile-engine/issues/589) [#565](https://github.com/graphile/graphile-engine/issues/565) [#505](https://github.com/graphile/graphile-engine/issues/505) [#591](https://github.com/graphile/graphile-engine/issues/591)

## [4.5.6](https://github.com/graphile/graphile-engine/compare/v4.5.5...v4.5.6) (2019-12-13)

### Bug Fixes

- **utils:** fix smart tags regression on unqualified tables ([#587](https://github.com/graphile/graphile-engine/issues/587)) ([f56511f](https://github.com/graphile/graphile-engine/commit/f56511fcd8755611e5feed20f0a1eff28bc3cbc8))

## [4.5.5](https://github.com/graphile/graphile-engine/compare/v4.5.4...v4.5.5) (2019-12-11)

### Bug Fixes

- **utils:** fix smart tags for attributes ([324f066](https://github.com/graphile/graphile-engine/commit/324f0669a2b21c2445b6e7b8bb2ecd805f5de5ad))

## [4.5.4](https://github.com/graphile/graphile-engine/compare/v4.5.3...v4.5.4) (2019-12-11)

### Bug Fixes

- **utils:** to match early enough, we need build to be passed ([9aa5565](https://github.com/graphile/graphile-engine/commit/9aa556522eb8ca691bbc9d1f717c3289f6ef126c))

## [4.5.3](https://github.com/graphile/graphile-engine/compare/v4.5.2...v4.5.3) (2019-12-11)

### Bug Fixes

- **deps:** bump graphile-utils peerDependencies ([cd6b52a](https://github.com/graphile/graphile-engine/commit/cd6b52a2aa4c012fb01b59b4a489592298a5235b))
- **smart-tags:** enable using Smart Tags with [@foreign](https://github.com/foreign)Key and [@primary](https://github.com/primary)Key ([#586](https://github.com/graphile/graphile-engine/issues/586)) ([b2d8c65](https://github.com/graphile/graphile-engine/commit/b2d8c656aec4d8b380d609e4c11c78ff157becc9))
- **utils:** only apply condition when specified ([#572](https://github.com/graphile/graphile-engine/issues/572)) ([314fce1](https://github.com/graphile/graphile-engine/commit/314fce122995ab7f6017e6c43910a2fec4171623))

### Features

- **utils:** makeExtendSchemaPlugin accepts typeDef array ([#574](https://github.com/graphile/graphile-engine/issues/574)) ([82ff872](https://github.com/graphile/graphile-engine/commit/82ff8725670b512c037e04ef9426097332f976a9))

## [4.5.2](https://github.com/graphile/graphile-engine/compare/v4.5.1...v4.5.2) (2019-11-22)

### Bug Fixes

- **utils:** make makeAddPgTableConditionPlugin work on simple co… ([#569](https://github.com/graphile/graphile-engine/issues/569)) ([0a4db65](https://github.com/graphile/graphile-engine/commit/0a4db65dd900c6a4ecf161db9f32d34a5719b9e5))

## [4.5.1](https://github.com/graphile/graphile-engine/compare/v4.5.0...v4.5.1) (2019-11-20)

### Features

- **tags:** improve JSON format for Smart Tags ([#568](https://github.com/graphile/graphile-engine/issues/568)) ([cb8eac1](https://github.com/graphile/graphile-engine/commit/cb8eac1146bd3805a82201d905edb3826544334a))

# [4.5.0](https://github.com/graphile/graphile-engine/compare/v4.5.0-rc.0...v4.5.0) (2019-11-20)

# [4.5.0-rc.0](https://github.com/graphile/graphile-engine/compare/v4.4.6-alpha.0...v4.5.0-rc.0) (2019-11-12)

## [4.4.6-alpha.0](https://github.com/graphile/graphile-engine/compare/v4.4.5...v4.4.6-alpha.0) (2019-11-08)

### Bug Fixes

- **jwt:** allow JWT exp to be bigint ([#542](https://github.com/graphile/graphile-engine/issues/542)) ([69c7e8e](https://github.com/graphile/graphile-engine/commit/69c7e8e3e97d98e994d5935cf295e4722ae235d5))
- **omit:** if you omit update on all columns don't throw ([#531](https://github.com/graphile/graphile-engine/issues/531)) ([b5d9e99](https://github.com/graphile/graphile-engine/commit/b5d9e99fefa0af027bfcaeae06443eff00412aea))
- **pagination:** fix bug in cursor pagination for PL/pgSQL SETOF… ([#559](https://github.com/graphile/graphile-engine/issues/559)) ([0089a07](https://github.com/graphile/graphile-engine/commit/0089a071b55384cfb6eddf9264b4343a76f896a2))
- **types:** correct tuples to arrays in pgIntrospectionPlugin ([#530](https://github.com/graphile/graphile-engine/issues/530)) ([6488d5c](https://github.com/graphile/graphile-engine/commit/6488d5c452f032ddf3657292fcbc42f0c250a3e7))
- **types:** export more types inc PgIntrospectionResultByKind ([#532](https://github.com/graphile/graphile-engine/issues/532)) ([1689f66](https://github.com/graphile/graphile-engine/commit/1689f6691a0716d41d256de3499c9da40407348f))
- **types:** minor TypeScript fixes ([#545](https://github.com/graphile/graphile-engine/issues/545)) ([0170064](https://github.com/graphile/graphile-engine/commit/01700643ef9cff1dbb7c4c93f990f561e62b5cc0))
- **types:** use jwt.Secret type in PostGraphileCoreOptions ([#546](https://github.com/graphile/graphile-engine/issues/546)) ([be18000](https://github.com/graphile/graphile-engine/commit/be18000f92ddca2f9cecb7b641c6f33ee63adb0e))
- **watch:** don't built schema twice in watch mode ([#558](https://github.com/graphile/graphile-engine/issues/558)) ([0a36f7b](https://github.com/graphile/graphile-engine/commit/0a36f7b020404b22e88dfe8f4790d60685f1391b))

### Features

- **connections:** expose totalCount on custom connections ([#529](https://github.com/graphile/graphile-engine/issues/529)) ([b6c08cf](https://github.com/graphile/graphile-engine/commit/b6c08cf050eb3c0c2ff23c6d53b5861db2151ab6))
- **pg:** add partial index detection to introspection ([#535](https://github.com/graphile/graphile-engine/issues/535)) ([360e5e0](https://github.com/graphile/graphile-engine/commit/360e5e05ba60a229a2e16489f85683d33389c1e2))
- **pg:** add support for cidr and macaddr types ([#520](https://github.com/graphile/graphile-engine/issues/520)) ([676c3f2](https://github.com/graphile/graphile-engine/commit/676c3f2e3d6f0006b99855394be51391656dbcea))
- **QueryBuilder:** new methods for managing QB children ([#537](https://github.com/graphile/graphile-engine/issues/537)) ([1a8a0bc](https://github.com/graphile/graphile-engine/commit/1a8a0bc341ba21356ec57c4f19376c07a9ada6d4))
- **utils:** [@pg](https://github.com/pg)Query support for scalars ([#534](https://github.com/graphile/graphile-engine/issues/534)) ([49259c2](https://github.com/graphile/graphile-engine/commit/49259c291d651ab8b70d1f1785cf273bdd97fcf1))
- **utils:** `[@pg](https://github.com/pg)Query.source` can be function ([#555](https://github.com/graphile/graphile-engine/issues/555)) ([907c8e6](https://github.com/graphile/graphile-engine/commit/907c8e628c806c7d3d7ad2522ce9c18f32fcb45b))
- **utils:** add makePgSmartTagsPlugin ([#541](https://github.com/graphile/graphile-engine/issues/541)) ([40a7bfa](https://github.com/graphile/graphile-engine/commit/40a7bfa00f3e4ab44ca61264eb50529a17217ec1))
- **utils:** makeExtendSchemaPlugin supports enums and default values ([#562](https://github.com/graphile/graphile-engine/issues/562)) ([2a23aee](https://github.com/graphile/graphile-engine/commit/2a23aeecfc06db9fd0543da5c8d988d55bbe31a8))

## [4.4.5](https://github.com/graphile/graphile-engine/compare/v4.4.4...v4.4.5) (2019-09-23)

### Bug Fixes

- remove sortable/filterable from functions with required args ([#519](https://github.com/graphile/graphile-engine/issues/519)) ([2335d6e](https://github.com/graphile/graphile-engine/commit/2335d6e9334680b927598ba9e748532323ad649d))
- **introspection:** corrected bitmasks for mutability checks ([#508](https://github.com/graphile/graphile-engine/issues/508)) ([5fae076](https://github.com/graphile/graphile-engine/commit/5fae0764bc13bf3d0d481d0421e89989a7379391))

### Features

- **utils:** add PG plugin generators for conditions/orderBy ([#517](https://github.com/graphile/graphile-engine/issues/517)) ([96c1ed4](https://github.com/graphile/graphile-engine/commit/96c1ed47c70748164ebb8717cbec44758c3d5c9a))
- allow passing readCache as an object ([#479](https://github.com/graphile/graphile-engine/issues/479)) ([1a9dc17](https://github.com/graphile/graphile-engine/commit/1a9dc1774071c8dd72ca052fac0a7baebe22db12))
- **query:** improve unique orderBy error message ([#515](https://github.com/graphile/graphile-engine/issues/515)) ([29d87da](https://github.com/graphile/graphile-engine/commit/29d87dacf4ac022bc6252e33efc5dab26d1fcb14))

## [4.4.4](https://github.com/graphile/graphile-engine/compare/v4.4.3...v4.4.4) (2019-08-09)

### Bug Fixes

- **makeExtendSchemaPlugin:** no longer omits built-in directives ([#500](https://github.com/graphile/graphile-engine/issues/500)) ([18b4ff5](https://github.com/graphile/graphile-engine/commit/18b4ff5d35bc156e43dea373fdcf139a9fad898c))

## [4.4.3](https://github.com/graphile/graphile-engine/compare/v4.4.2...v4.4.3) (2019-08-07)

### Bug Fixes

- **cursors:** better cursor validation ([#499](https://github.com/graphile/graphile-engine/issues/499)) ([834687d](https://github.com/graphile/graphile-engine/commit/834687da4d66e0836c39a756fc035380a19fa642))
- **debug:** correct field.name to scope.fieldName ([#489](https://github.com/graphile/graphile-engine/issues/489)) ([122a612](https://github.com/graphile/graphile-engine/commit/122a612e518b596ef20b5e547225a6f4a435b59b))
- **ignoreIndexes:** mark fake constraints as indexed ([#496](https://github.com/graphile/graphile-engine/issues/496)) ([b3b4a60](https://github.com/graphile/graphile-engine/commit/b3b4a60f434f98e6fb7460f3f26916990fc49b8d))
- **inflectors:** names that begin with a digit are prefixed with underscore ([#495](https://github.com/graphile/graphile-engine/issues/495)) ([8eebaeb](https://github.com/graphile/graphile-engine/commit/8eebaeb5139207c69d1292e8a70cf4d7790de46e))
- **nodeId:** fix object IDs for arbitrary precision numbers and ints > 9 quadrillion ([#493](https://github.com/graphile/graphile-engine/issues/493)) ([254c80a](https://github.com/graphile/graphile-engine/commit/254c80a85f16fd98c599a536abe86e72369aeebf))
- **nodeIds:** warn if two types try and register the same alias ([#498](https://github.com/graphile/graphile-engine/issues/498)) ([4fa78b1](https://github.com/graphile/graphile-engine/commit/4fa78b11ab8ea7d15e3ca221e39ced0a398bd9f9))
- **pubsub:** use perpetual exponential back-off ([#497](https://github.com/graphile/graphile-engine/issues/497)) ([001d45e](https://github.com/graphile/graphile-engine/commit/001d45e68e306d4818cac41f7061d3d81a861403))
- **schema:** set mutation payload edge orderBy arg default to a list ([#494](https://github.com/graphile/graphile-engine/issues/494)) ([18b132e](https://github.com/graphile/graphile-engine/commit/18b132ec1d0f4340a870aefe3dfd123746882643))

### Features

- **ignoreIndexes:** add option `hideIndexWarnings` ([#462](https://github.com/graphile/graphile-engine/issues/462)) ([3cfb204](https://github.com/graphile/graphile-engine/commit/3cfb20485b0e2fc71ddfdf47c8ca1e574d6fbfac))
- **jwt:** add support for jsonwebtoken.sign options ([#466](https://github.com/graphile/graphile-engine/issues/466)) ([7825f25](https://github.com/graphile/graphile-engine/commit/7825f25fe9b08950339be5026cef025f0b09bb23))

## [4.4.2](https://github.com/graphile/graphile-engine/compare/v4.4.1...v4.4.2) (2019-06-29)

### Features

- **utils:** make makeExtendSchemaPlugin more powerful ([#480](https://github.com/graphile/graphile-engine/issues/480)) ([e73506b](https://github.com/graphile/graphile-engine/commit/e73506bc035328d99127672dca807465482f8351))

## [4.4.1](https://github.com/graphile/graphile-engine/compare/v4.4.1-alpha.2...v4.4.1) (2019-06-21)

### Bug Fixes

- **deps:** Add iterall to graphile-build dependencies ([#473](https://github.com/graphile/graphile-engine/issues/473)) ([3f2040b](https://github.com/graphile/graphile-engine/commit/3f2040bf2be8f330e1294da2b25cecd615f612aa))
- **lds:** correct the set of LDS announcement types handled ([#468](https://github.com/graphile/graphile-engine/issues/468)) ([dde59fa](https://github.com/graphile/graphile-engine/commit/dde59fa066bbaa1d34eb56f6c4991fe1f2627a79))
- **proc:** remove invalid fields from mutation functions returning setof ([#478](https://github.com/graphile/graphile-engine/issues/478)) ([6d3060d](https://github.com/graphile/graphile-engine/commit/6d3060dae4f747713303caab9d65139d109f42ba))
- **watch:** fix typo in warning message CLI flag ([#475](https://github.com/graphile/graphile-engine/issues/475)) ([fca1105](https://github.com/graphile/graphile-engine/commit/fca11059af646ef711e2685b789baa7965f2d110))

## [4.4.1-alpha.2](https://github.com/graphile/graphile-engine/compare/v4.4.1-alpha.1...v4.4.1-alpha.2) (2019-05-10)

### Features

- **perf:** a few performance enhancements ([#459](https://github.com/graphile/graphile-engine/issues/459)) ([d57c180](https://github.com/graphile/graphile-engine/commit/d57c18010a3eebf0ea9d63c9bb70637e34d67025))

## [4.4.1-alpha.1](https://github.com/graphile/graphile-engine/compare/v4.4.1-alpha.0...v4.4.1-alpha.1) (2019-05-07)

### Performance Improvements

- a number of performance optimisations ([#458](https://github.com/graphile/graphile-engine/issues/458)) ([5bca05b](https://github.com/graphile/graphile-engine/commit/5bca05bc32abcfb0c44bacca3341f564cf9c4cf2))

## [4.4.1-alpha.0](https://github.com/graphile/graphile-engine/compare/v4.4.0...v4.4.1-alpha.0) (2019-05-05)

# [4.4.0](https://github.com/graphile/graphile-engine/compare/v4.4.0-rc.1...v4.4.0) (2019-05-03)

# [4.4.0-rc.1](https://github.com/graphile/graphile-engine/compare/v4.4.0-rc.0...v4.4.0-rc.1) (2019-04-29)

### Features

- **subscriptions-lds:** enable using envvars with lds as library ([#456](https://github.com/graphile/graphile-engine/issues/456)) ([2353cf9](https://github.com/graphile/graphile-engine/commit/2353cf94867a88d76062ab274a30ce930a30aab7))

# [4.4.0-rc.0](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.13...v4.4.0-rc.0) (2019-04-23)

### Bug Fixes

- **description:** fix typo in big-int definition ([#453](https://github.com/graphile/graphile-engine/issues/453)) ([0f2442b](https://github.com/graphile/graphile-engine/commit/0f2442b56e78f7e97e904ae9b760b62ec9f94d4f))

### Features

- **smart-comments:** [@foreign](https://github.com/foreign)Key smart comments on composite types ([#454](https://github.com/graphile/graphile-engine/issues/454)) ([ae44c98](https://github.com/graphile/graphile-engine/commit/ae44c9800bb016de0e29138db5e3978b32bd0224))

# [4.4.0-beta.13](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.12...v4.4.0-beta.13) (2019-04-18)

### Bug Fixes

- **live:** fix live for relations with multiple keys ([#451](https://github.com/graphile/graphile-engine/issues/451)) ([22d7024](https://github.com/graphile/graphile-engine/commit/22d7024dfd3f37ec982ca7e44f912dd6834a92b3))

# [4.4.0-beta.12](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.11...v4.4.0-beta.12) (2019-04-17)

### Bug Fixes

- **error:** add TYPE for introspection error messages ([#449](https://github.com/graphile/graphile-engine/issues/449)) ([019996f](https://github.com/graphile/graphile-engine/commit/019996f67258ff6df748d3b5c6515bd937611c1f))
- **sql:** handle non-null compound columns with all-null values ([#446](https://github.com/graphile/graphile-engine/issues/446)) ([fe2e5dc](https://github.com/graphile/graphile-engine/commit/fe2e5dcfd8851d29a461e3d258f90081188e5cc0))
- **tx:** split transaction commit to separate query for safety ([#448](https://github.com/graphile/graphile-engine/issues/448)) ([31913eb](https://github.com/graphile/graphile-engine/commit/31913eb42da47b63e3a6f2105df8ee88d90ff327))

### Features

- **gql:** enable composing multiple gql tags ([#447](https://github.com/graphile/graphile-engine/issues/447)) ([47dcac3](https://github.com/graphile/graphile-engine/commit/47dcac39e44b442dca460a4ca67edb29b1dd96fc)), closes [#445](https://github.com/graphile/graphile-engine/issues/445)

# [4.4.0-beta.11](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.10...v4.4.0-beta.11) (2019-04-15)

### Bug Fixes

- **ts:** fix graphileBuildOptions type ([#443](https://github.com/graphile/graphile-engine/issues/443)) ([d04c582](https://github.com/graphile/graphile-engine/commit/d04c582f74f5d9856e4e69457122aee0249f2662))

# [4.4.0-beta.10](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.9...v4.4.0-beta.10) (2019-04-14)

### Bug Fixes

- **docs:** fix description of Subscription type ([#440](https://github.com/graphile/graphile-engine/issues/440)) ([2db5472](https://github.com/graphile/graphile-engine/commit/2db5472e6ab43638f05ee7b729dee4a82f6894f9))
- **graphql:** --no-setof-functions-contain-nulls now applies to simple collections too ([#441](https://github.com/graphile/graphile-engine/issues/441)) ([a3f118d](https://github.com/graphile/graphile-engine/commit/a3f118d2bcee756eb112dc3b8abf8e6c491d2e64))
- **pg:** handle more errors on Postgres restart ([#439](https://github.com/graphile/graphile-engine/issues/439)) ([cb59155](https://github.com/graphile/graphile-engine/commit/cb5915502aea02f3c5dafec36b085820b73b9b97))
- **ts:** replace 'export \*' with explicit exports to allow declaration merging ([#437](https://github.com/graphile/graphile-engine/issues/437)) ([9b47cf8](https://github.com/graphile/graphile-engine/commit/9b47cf8b3c8a5ef07d0551d2e8dc8d09b351338c))
- **watch:** rewrite schema watching; handle Postgres restart ([#438](https://github.com/graphile/graphile-engine/issues/438)) ([98f796c](https://github.com/graphile/graphile-engine/commit/98f796cf1acb64c7da694cdecf606f1ecfee5b5b))

### Features

- **plugins:** enable plugins to prevent using asterisk ([#436](https://github.com/graphile/graphile-engine/issues/436)) ([49b9da4](https://github.com/graphile/graphile-engine/commit/49b9da43c4265e5f8faed92b77cdd605ac613926))

# [4.4.0-beta.9](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.8...v4.4.0-beta.9) (2019-04-04)

### Bug Fixes

- **live:** solve race conditions in live queries ([#433](https://github.com/graphile/graphile-engine/issues/433)) ([e497590](https://github.com/graphile/graphile-engine/commit/e497590423212ff8267740e3801e5ff9be488435))
- **types:** add missing useAsterisk on QueryBuilder ([cda3d89](https://github.com/graphile/graphile-engine/commit/cda3d89abdaac974469ef71c1b89480ba09a27e7)), closes [#432](https://github.com/graphile/graphile-engine/issues/432)

# [4.4.0-beta.8](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.7...v4.4.0-beta.8) (2019-03-25)

### Bug Fixes

- **connection:** don't query identifiers unless necessary ([#429](https://github.com/graphile/graphile-engine/issues/429)) ([16785c4](https://github.com/graphile/graphile-engine/commit/16785c4f1f1c70fe8270b5ac7574fb491acc925e)), closes [#428](https://github.com/graphile/graphile-engine/issues/428)

# [4.4.0-beta.7](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.6...v4.4.0-beta.7) (2019-03-22)

### Bug Fixes

- **types:** add PoolClient to pgConfig union type ([#425](https://github.com/graphile/graphile-engine/issues/425)) ([413ea16](https://github.com/graphile/graphile-engine/commit/413ea16efe4489aa8c1d652efef08fa5e24204c0))

### Features

- **types:** make more builtin PG types hookable ([#426](https://github.com/graphile/graphile-engine/issues/426)) ([a5abf2d](https://github.com/graphile/graphile-engine/commit/a5abf2d3ed2eff949a954df0ad5346d5bfa9a904))

# [4.4.0-beta.6](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.5...v4.4.0-beta.6) (2019-03-18)

### Bug Fixes

- **utils:** fix makeExtendSchemaPlugin [@pg](https://github.com/pg)Query directive ([#424](https://github.com/graphile/graphile-engine/issues/424)) ([5211758](https://github.com/graphile/graphile-engine/commit/5211758b7a48191ffd7600f9f5ae572672ffd221)), closes [#413](https://github.com/graphile/graphile-engine/issues/413)

# [4.4.0-beta.5](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.4...v4.4.0-beta.5) (2019-03-15)

### Bug Fixes

- **live:** remove format-version for RDS compatibility ([#422](https://github.com/graphile/graphile-engine/issues/422)) ([4fcd476](https://github.com/graphile/graphile-engine/commit/4fcd476df86583f19c8e2c1286866e8742eae1df))

### Performance Improvements

- **connections:** more efficient totalCount ([#421](https://github.com/graphile/graphile-engine/issues/421)) ([00c8616](https://github.com/graphile/graphile-engine/commit/00c86161373944797f2b6d054133726e95b0d2cc))

# [4.4.0-beta.4](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.3...v4.4.0-beta.4) (2019-03-12)

### Bug Fixes

- **hasVersion:** allow pre-releases to satisfy version check ([#419](https://github.com/graphile/graphile-engine/issues/419)) ([b12bd78](https://github.com/graphile/graphile-engine/commit/b12bd78e8740dbf1e6e1d2f58179ce2930dec8e2))

### Features

- **introspection:** include namespaceName for extensions ([#417](https://github.com/graphile/graphile-engine/issues/417)) ([69ddb85](https://github.com/graphile/graphile-engine/commit/69ddb85b28cfcf052217394d410b008e93cdc5ab))

# [4.4.0-beta.3](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.2...v4.4.0-beta.3) (2019-03-08)

### Features

- **plugins:** hook priority system ([#416](https://github.com/graphile/graphile-engine/issues/416)) ([95d70ab](https://github.com/graphile/graphile-engine/commit/95d70ab00e55d020145cc4f0304bcb9e932ed836))

# [4.4.0-beta.2](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.1...v4.4.0-beta.2) (2019-03-07)

### Features

- **aggregates:** add support for aggregates ([#415](https://github.com/graphile/graphile-engine/issues/415)) ([8975cba](https://github.com/graphile/graphile-engine/commit/8975cba2cf991a3aa68f6cbab8170f526e55c0ff))
- **perf:** use more optimal query when no column-level select grants ([#414](https://github.com/graphile/graphile-engine/issues/414)) ([2b28679](https://github.com/graphile/graphile-engine/commit/2b2867954d9c45042f3c9d9c1c5312acc1eab181))
- **utils:** support connections in makeExtendSchemaPlugin ([#413](https://github.com/graphile/graphile-engine/issues/413)) ([7f5fffb](https://github.com/graphile/graphile-engine/commit/7f5fffb97d189de41d8482b2ef6069efd44041f2))

# [4.4.0-beta.1](https://github.com/graphile/graphile-engine/compare/v4.4.0-beta.0...v4.4.0-beta.1) (2019-02-28)

### Features

- **watch:** use ownerConnectionString for installing watch fixtures ([1550921](https://github.com/graphile/graphile-engine/commit/1550921377e8a91bb823e9145de1f28079a1ae5d))

# [4.4.0-beta.0](https://github.com/graphile/graphile-engine/compare/v4.4.0-alpha.0...v4.4.0-beta.0) (2019-02-28)

### Bug Fixes

- **args:** allow makeWrapResolversPlugin to override args ([#410](https://github.com/graphile/graphile-engine/issues/410)) ([9a70bfa](https://github.com/graphile/graphile-engine/commit/9a70bfa530b0f53d121861ef1629d5b2211ce0d9)), closes [#396](https://github.com/graphile/graphile-engine/issues/396)
- **arrays:** fix arrays of intervals, etc ([#405](https://github.com/graphile/graphile-engine/issues/405)) ([cc3a6b1](https://github.com/graphile/graphile-engine/commit/cc3a6b15b9c8aaf99bac7f553b181d858e6a9cf7))
- **domains:** input field nullable if domain has default ([#401](https://github.com/graphile/graphile-engine/issues/401)) ([dd2ca61](https://github.com/graphile/graphile-engine/commit/dd2ca617e3a7a48e2eb68cd6ed296ae4d7a3c231))
- **live:** add scope to new fields ([b47f334](https://github.com/graphile/graphile-engine/commit/b47f334c07762968d079f9e8bf037dc9412f800e))
- **nulls:** fix null detection when requesting only nullable columns ([#406](https://github.com/graphile/graphile-engine/issues/406)) ([c573a15](https://github.com/graphile/graphile-engine/commit/c573a158f09d712c17c565e7206297d6f44827db))
- **nulls:** totalCount shouldn't be nullable ([#411](https://github.com/graphile/graphile-engine/issues/411)) ([023fa90](https://github.com/graphile/graphile-engine/commit/023fa9040f4e1ccebddbf38f87d2f82f21a446f7))
- **procs:** fix relation errors in custom mutations when returning null ([#407](https://github.com/graphile/graphile-engine/issues/407)) ([3a9887d](https://github.com/graphile/graphile-engine/commit/3a9887d4bb9d8d0d05fbf953e06bb9db3655fcfe))

### Features

- **smart-comments:** simpleCollections smart comment ([#409](https://github.com/graphile/graphile-engine/issues/409)) ([3248a2e](https://github.com/graphile/graphile-engine/commit/3248a2e67b53ac74de77340f3dba80c3c22ff9b6))

# [4.4.0-alpha.0](https://github.com/graphile/graphile-engine/compare/v4.3.1...v4.4.0-alpha.0) (2019-02-21)

### Bug Fixes

- **hstore:** include explicit namespace when casting ([#395](https://github.com/graphile/graphile-engine/issues/395)) ([1978ffa](https://github.com/graphile/graphile-engine/commit/1978ffa9032c1dbacb24e21440bc232b38e3ab69))

### Features

- **subscriptions:** introducing live query support ([#399](https://github.com/graphile/graphile-engine/issues/399)) ([86ef40f](https://github.com/graphile/graphile-engine/commit/86ef40f0591c5580c6af38c4baf5f6f270dfbd2d))
- **subscriptions:** pg-pubsub module ([#400](https://github.com/graphile/graphile-engine/issues/400)) ([7506da1](https://github.com/graphile/graphile-engine/commit/7506da18de2e741629e5b195a9fc2e8c666733e0))

## [4.3.1](https://github.com/graphile/graphile-engine/compare/v4.3.0...v4.3.1) (2019-01-24)

### Bug Fixes

- **regression:** restore old orderBy call signature ([#386](https://github.com/graphile/graphile-engine/issues/386)) ([e7fe7cf](https://github.com/graphile/graphile-engine/commit/e7fe7cf72b10571ab1e3ed0d7ac6d9249792d9d3)), closes [#383](https://github.com/graphile/graphile-engine/issues/383)
- **windows:** add support for Windows CRLF in smart comments ([#385](https://github.com/graphile/graphile-engine/issues/385)) ([d8552cd](https://github.com/graphile/graphile-engine/commit/d8552cd4f1b15711daebc634594354a6c968b1dc))
- restore but severely deprecate ancient inflectors ([#381](https://github.com/graphile/graphile-engine/issues/381)) ([c7a7a5c](https://github.com/graphile/graphile-engine/commit/c7a7a5ce214f1e23a99e7ae0c1c732c3dab675ca))
- **typo:** pgInflection -> pgIntrospection ([#382](https://github.com/graphile/graphile-engine/issues/382)) ([12c42c1](https://github.com/graphile/graphile-engine/commit/12c42c15149e3a52149e4c1a2806aecb657701d3))

### Features

- **inflectors:** new 'builtin' inflector ([#387](https://github.com/graphile/graphile-engine/issues/387)) ([52dfa53](https://github.com/graphile/graphile-engine/commit/52dfa53d45cbbc2eb26ef88d312e9463e6519c5b))

# [4.3.0](https://github.com/graphile/graphile-engine/compare/v4.2.1...v4.3.0) (2019-01-17)

### Bug Fixes

- **compatibility:** don't fail at introspection when intarray extension is installed ([#374](https://github.com/graphile/graphile-engine/issues/374)) ([f90a61b](https://github.com/graphile/graphile-engine/commit/f90a61bffa828785ebc6523c79ddf01e65d0417e))
- **docs:** update introspection query URL ([#380](https://github.com/graphile/graphile-engine/issues/380)) ([132fe26](https://github.com/graphile/graphile-engine/commit/132fe26f044faf4e56442f72c5e79781c3e8872b))
- **jwt:** handle bigint / numeric in JWTs ([#376](https://github.com/graphile/graphile-engine/issues/376)) ([c0af902](https://github.com/graphile/graphile-engine/commit/c0af902e2b2f2ceec7570c9dd14735a77b3bc3ed))
- **sql:** tsrange, tstzrange, int8range and numrange now properly formatted ([#371](https://github.com/graphile/graphile-engine/issues/371)) ([6218c6a](https://github.com/graphile/graphile-engine/commit/6218c6ae8187ff1a7b1f3c87bda1a7ff12a2bb67))

### Features

- **functions:** [@sortable](https://github.com/sortable), [@filterable](https://github.com/filterable) and [@not](https://github.com/not)Null smart comments ([#378](https://github.com/graphile/graphile-engine/issues/378)) ([f4869e0](https://github.com/graphile/graphile-engine/commit/f4869e0dc095b907aecc519dae12feb05b57fb23))
- **indexes:** introspect index types ([#379](https://github.com/graphile/graphile-engine/issues/379)) ([df65975](https://github.com/graphile/graphile-engine/commit/df6597536ba2fca1d2be51def3fb3ff1b20f38be))
- **inflection:** add more fields/types to inflector ([#377](https://github.com/graphile/graphile-engine/issues/377)) ([77452de](https://github.com/graphile/graphile-engine/commit/77452dec603d24bd62f0b535eef3092e57b2de7b))

## [4.2.1](https://github.com/graphile/graphile-engine/compare/v4.2.0...v4.2.1) (2019-01-04)

### Features

- **utils:** enable wrapping resolvers matching a filter ([#369](https://github.com/graphile/graphile-engine/issues/369)) ([065d5d4](https://github.com/graphile/graphile-engine/commit/065d5d408720616d0affdd930a9d70413e50fbd8))

# [4.2.0](https://github.com/graphile/graphile-engine/compare/v4.1.0...v4.2.0) (2018-12-19)

### Features

- **indexes:** always warn on FK skip due to no index ([#366](https://github.com/graphile/graphile-engine/issues/366)) ([79df91d](https://github.com/graphile/graphile-engine/commit/79df91deca5e774e82dac86d503d31184fce522e))
- constraints through smart comments (view foreign keys, etc) ([#365](https://github.com/graphile/graphile-engine/issues/365)) ([7c712a9](https://github.com/graphile/graphile-engine/commit/7c712a9704642221438d93f6716cd04332d54ac3))

# [4.1.0](https://github.com/graphile/graphile-engine/compare/v4.1.0-rc.4...v4.1.0) (2018-12-06)

# [4.1.0-rc.4](https://github.com/graphile/graphile-engine/compare/v4.1.0-rc.3...v4.1.0-rc.4) (2018-12-03)

### Bug Fixes

- **perf:** add missing `unique` setting ([#364](https://github.com/graphile/graphile-engine/issues/364)) ([942d1b5](https://github.com/graphile/graphile-engine/commit/942d1b5d1a593eb9e2f7f8d00135ed6abfaf8d0f))

# [4.1.0-rc.3](https://github.com/graphile/graphile-engine/compare/v4.1.0-rc.2...v4.1.0-rc.3) (2018-12-02)

### Bug Fixes

- **cursors:** fix bad cursor error ([#362](https://github.com/graphile/graphile-engine/issues/362)) ([188769e](https://github.com/graphile/graphile-engine/commit/188769e81891cd3693d1084423d09a1dfcaddd12))
- **nulls:** make nodes nullable, consistent with node ([#357](https://github.com/graphile/graphile-engine/issues/357)) ([7d49f8e](https://github.com/graphile/graphile-engine/commit/7d49f8eeb579d12683f1c0c6579d7b230a2a3008))
- **perf:** detect unique columns and don't add primary key to order in that case ([#361](https://github.com/graphile/graphile-engine/issues/361)) ([a7eb61f](https://github.com/graphile/graphile-engine/commit/a7eb61f622359ba56aa8fa06ec246b2ef770c970))
- **types:** fix SchemaBuilder TypeScript types ([#358](https://github.com/graphile/graphile-engine/issues/358)) ([f01be28](https://github.com/graphile/graphile-engine/commit/f01be28fb44045410f88b79a8a590bb085d8c941))

### Features

- **utils:** makeExtendSchemaPlugin DX ([#360](https://github.com/graphile/graphile-engine/issues/360)) ([65758eb](https://github.com/graphile/graphile-engine/commit/65758eb08cb31072bd00c06017cf5e4d2cbb457f))

# [4.1.0-rc.2](https://github.com/graphile/graphile-engine/compare/v4.1.0-rc.1...v4.1.0-rc.2) (2018-11-23)

### Bug Fixes

- **pg9.4:** restore support for PG9.4 ([#355](https://github.com/graphile/graphile-engine/issues/355)) ([d621f91](https://github.com/graphile/graphile-engine/commit/d621f91d2273c008fd17aeb252aadd4bd785ef5e))

# [4.1.0-rc.1](https://github.com/graphile/graphile-engine/compare/v4.1.0-rc.0...v4.1.0-rc.1) (2018-11-23)

### Bug Fixes

- **typescript:** ignore fieldASTs warning ([#348](https://github.com/graphile/graphile-engine/issues/348)) ([9f44847](https://github.com/graphile/graphile-engine/commit/9f4484711c83549c7a1fc62b91142b6caa298255))
- avoid `deprecationReason: undefined` ([#346](https://github.com/graphile/graphile-engine/issues/346)) ([ba9ad33](https://github.com/graphile/graphile-engine/commit/ba9ad33c55457b45b496abd56898192a2b7f9f21))
- **sql:** use JSONB concatenation when necessary ([#333](https://github.com/graphile/graphile-engine/issues/333)) ([6195793](https://github.com/graphile/graphile-engine/commit/61957931d236b78c0c8791420d052ae8af22aecf))

### Features

- **utils:** makeProcessSchemaPlugin ([#354](https://github.com/graphile/graphile-engine/issues/354)) ([da8b39d](https://github.com/graphile/graphile-engine/commit/da8b39dc31a790342c52d7327a0f5facfdedd12b))
- **utils:** makeWrapResolversPlugin, makeChangeNullabilityPlugin ([#352](https://github.com/graphile/graphile-engine/issues/352)) ([9393990](https://github.com/graphile/graphile-engine/commit/9393990607e5f2debfe7cbdb8d0c8cbde1a93e1a))
- add `[@deprecated](https://github.com/deprecated)` support to functions ([#340](https://github.com/graphile/graphile-engine/issues/340)) ([a25b19f](https://github.com/graphile/graphile-engine/commit/a25b19f3c4ad8d4427d016f1f40745814efe88f3))
- **indexes:** introspect index column properties (asc, nulls first) ([#335](https://github.com/graphile/graphile-engine/issues/335)) ([6925d6d](https://github.com/graphile/graphile-engine/commit/6925d6dad7623f3bde233e778b55e2f96cfc76a6))
- **pg:** support ordering with NULLS FIRST / NULLS LAST ([#332](https://github.com/graphile/graphile-engine/issues/332)) ([545d082](https://github.com/graphile/graphile-engine/commit/545d0822584dcffe1c5d27d0aa2e251e0b7d4683))
- add `build.versions` and `build.hasVersion` function ([#339](https://github.com/graphile/graphile-engine/issues/339)) ([4a05670](https://github.com/graphile/graphile-engine/commit/4a05670e6eff1e87257cff510a7f92e9a9b34e54)), closes [#338](https://github.com/graphile/graphile-engine/issues/338)

# [4.1.0-rc.0](https://github.com/graphile/graphile-engine/compare/v4.1.0-alpha.1...v4.1.0-rc.0) (2018-10-31)

### Features

- **watch:** option to skip installing watch fixtures ([#328](https://github.com/graphile/graphile-engine/issues/328)) ([e085cbd](https://github.com/graphile/graphile-engine/commit/e085cbd9992247cdaac112c615abb1a61f4e4caa))

# [4.1.0-alpha.1](https://github.com/graphile/graphile-engine/compare/v4.1.0-alpha.0...v4.1.0-alpha.1) (2018-10-25)

### Bug Fixes

- **deps:** add chalk as explicit dependency of graphile-build ([#322](https://github.com/graphile/graphile-engine/issues/322)) ([84e4b91](https://github.com/graphile/graphile-engine/commit/84e4b911538dfc1001ccb5e70bdbfcbc563fb319))

### Features

- `pgIgnoreIndex = false` feature; fix introspection bug ([#324](https://github.com/graphile/graphile-engine/issues/324)) ([8a4e478](https://github.com/graphile/graphile-engine/commit/8a4e478f7f3c34f7d328a14f50efbece66048f9c))
- `pgLegacyFunctionsOnly` option ([#325](https://github.com/graphile/graphile-engine/issues/325)) ([4c1cfb9](https://github.com/graphile/graphile-engine/commit/4c1cfb9d0fe4dd307cb32894996c9b1764c997e9))
- **functions:** support IN / OUT / INOUT arguments and RETURNS TABLE ([#296](https://github.com/graphile/graphile-engine/issues/296)) ([a029c45](https://github.com/graphile/graphile-engine/commit/a029c4599fbc4c36cfc64e9958b1c912e1a3bbd6))

# [4.1.0-alpha.0](https://github.com/graphile/graphile-engine/compare/v4.0.1...v4.1.0-alpha.0) (2018-10-15)

### Bug Fixes

- remove ignore from lerna config ([78ad1c5](https://github.com/graphile/graphile-engine/commit/78ad1c539bbeaea763d761adf8987710e9a824cd))
- remove recurseDataGeneratorsForField from many places ([#316](https://github.com/graphile/graphile-engine/issues/316)) ([1f3328e](https://github.com/graphile/graphile-engine/commit/1f3328e0bf17643f803d42b67021aa11ecad0801))

### Features

- detect invalid skipPlugins option ([#320](https://github.com/graphile/graphile-engine/issues/320)) ([48f2acf](https://github.com/graphile/graphile-engine/commit/48f2acf49b230001f7535a88a45f6d9b73e8d5c6))
- make skipping NodePlugin easier ([#319](https://github.com/graphile/graphile-engine/issues/319)) ([532fd40](https://github.com/graphile/graphile-engine/commit/532fd40406a22c658f6f287b290937e81950008e)), closes [#310](https://github.com/graphile/graphile-engine/issues/310)
- **debug:** enhance SQL debugging ([#317](https://github.com/graphile/graphile-engine/issues/317)) ([128b0d5](https://github.com/graphile/graphile-engine/commit/128b0d5308e43e422b6104b11b1ac0b6db62671c))
- **inflector:** better errors, overriding possible with makeAddInflectorsPlugin ([#315](https://github.com/graphile/graphile-engine/issues/315)) ([f437721](https://github.com/graphile/graphile-engine/commit/f4377215d1a507c7ce74f9eccb15e4187f03da29))

### Performance Improvements

- Couple small tweaks ([#314](https://github.com/graphile/graphile-engine/issues/314)) ([73e16e8](https://github.com/graphile/graphile-engine/commit/73e16e88965d4291a173008e21de7a466c65f1cd))

## [4.0.1](https://github.com/graphile/graphile-engine/compare/v4.0.0...v4.0.1) (2018-10-08)

### Bug Fixes

- **sql:** queryFromResolveData call withBuilder before resolveData.pgQuery ([#307](https://github.com/graphile/graphile-engine/issues/307)) ([8201251](https://github.com/graphile/graphile-engine/commit/82012515fc086137b5b9df22b0910f9ad4b6fe97))

# [4.0.0](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.12...v4.0.0) (2018-10-02)

# [4.0.0-rc.12](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.11...v4.0.0-rc.12) (2018-09-22)

### Bug Fixes

- **errors:** Add missing swallowError call, plus debugging URL ([#300](https://github.com/graphile/graphile-engine/issues/300)) ([bc66c8f](https://github.com/graphile/graphile-engine/commit/bc66c8fe88ca14a36c74c0e0d11ed6eadfcc1be8))
- **errors:** Improve error message for invalid pg configurations ([#301](https://github.com/graphile/graphile-engine/issues/301)) ([8f3c0e7](https://github.com/graphile/graphile-engine/commit/8f3c0e7ec823d8dd56f4010f52e51761f548444c))

### Features

- **introspection:** introspect function cost ([#304](https://github.com/graphile/graphile-engine/issues/304)) ([6b0cb9e](https://github.com/graphile/graphile-engine/commit/6b0cb9e4e91050c98f1a9c62b73e3613a6c78f09))

# [4.0.0-rc.11](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.10...v4.0.0-rc.11) (2018-09-13)

### Bug Fixes

- **pagination:** fixes bug with hasPreviousPage when paginating without unique orderBy ([#297](https://github.com/graphile/graphile-engine/issues/297)) ([d4e5d29](https://github.com/graphile/graphile-engine/commit/d4e5d2959c0adbc7d722201eadc113a087b854fd)), closes [graphile/postgraphile#844](https://github.com/graphile/postgraphile/issues/844)

### Features

- **pg:** PG10 identity columns and preliminary PG11 support ([#294](https://github.com/graphile/graphile-engine/issues/294)) ([1e040ba](https://github.com/graphile/graphile-engine/commit/1e040ba6cef36cc166ac25e25c60d77e249bdd56)), closes [#244](https://github.com/graphile/graphile-engine/issues/244)
- **pg:** Recognise unique multi-key relations as unique ([#298](https://github.com/graphile/graphile-engine/issues/298)) ([2727623](https://github.com/graphile/graphile-engine/commit/2727623c68d564effbff40f00e86fa5b3db76fcb))

# [4.0.0-rc.10](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.9...v4.0.0-rc.10) (2018-09-04)

### Features

- **debugging:** massively improve name collision errors ([#292](https://github.com/graphile/graphile-engine/issues/292)) ([a6b4dd9](https://github.com/graphile/graphile-engine/commit/a6b4dd9264017a70d20ca536212eac6ef7731651))

# [4.0.0-rc.9](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.8...v4.0.0-rc.9) (2018-08-24)

### Bug Fixes

- **types:** appease TypeScript (hopefully) ([#290](https://github.com/graphile/graphile-engine/issues/290)) ([951b551](https://github.com/graphile/graphile-engine/commit/951b551c7d65a0511db68a6707f1c19fdca14129))

# [4.0.0-rc.8](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.7...v4.0.0-rc.8) (2018-08-24)

### Features

- **watch:** detect more DB changes ([#289](https://github.com/graphile/graphile-engine/issues/289)) ([80e97c2](https://github.com/graphile/graphile-engine/commit/80e97c22b18cd99825abee81ce5380505b8d946e))

# [4.0.0-rc.7](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.6...v4.0.0-rc.7) (2018-08-22)

### Features

- **types:** export more types from postgraphile-core ([#288](https://github.com/graphile/graphile-engine/issues/288)) ([98212f3](https://github.com/graphile/graphile-engine/commit/98212f3a1b294f82d830eb07874841b188cb3b4f))

# [4.0.0-rc.6](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.5...v4.0.0-rc.6) (2018-08-22)

### Bug Fixes

- **error:** template string accidentally in quotes ([#281](https://github.com/graphile/graphile-engine/issues/281)) ([a9279a0](https://github.com/graphile/graphile-engine/commit/a9279a0caacd61d20325368e072287ef221ab64c))
- **graphql:** handle all long aliases ([#272](https://github.com/graphile/graphile-engine/issues/272)) ([92d82da](https://github.com/graphile/graphile-engine/commit/92d82da0baef5f1a01696c1b4175eaa9e6ad353c)), closes [#268](https://github.com/graphile/graphile-engine/issues/268)
- **ignore-extensions:** add pg_depend.classid clause to introspection ([#285](https://github.com/graphile/graphile-engine/issues/285)) ([8e68052](https://github.com/graphile/graphile-engine/commit/8e68052b3f8bc4b339795d00a24e8a24ab90c293))
- **mutations:** add update and delete mutations for tables lacking primary key ([#278](https://github.com/graphile/graphile-engine/issues/278)) ([b28328f](https://github.com/graphile/graphile-engine/commit/b28328f394ba5a1fa90e70222774ebad75e69bab))
- **plugins:** detect null plugins ([#274](https://github.com/graphile/graphile-engine/issues/274)) ([c4f848d](https://github.com/graphile/graphile-engine/commit/c4f848d4b0de1c08242987119dcaa2d89cf11ed3)), closes [#257](https://github.com/graphile/graphile-engine/issues/257)
- **utils:** error when using legacy graphql ([#287](https://github.com/graphile/graphile-engine/issues/287)) ([9329fe3](https://github.com/graphile/graphile-engine/commit/9329fe373dcf2a7871a9fd2a5956d96062357b50)), closes [#283](https://github.com/graphile/graphile-engine/issues/283)

### Features

- **hstore:** add support for the hstore type ([#273](https://github.com/graphile/graphile-engine/issues/273)) ([e269c31](https://github.com/graphile/graphile-engine/commit/e269c3102860de27d9c5c989d7a5f52b0834d124))
- **makeExtendSchemaPlugin:** add support for enum ([#269](https://github.com/graphile/graphile-engine/issues/269)) ([0fce134](https://github.com/graphile/graphile-engine/commit/0fce134cac219d196ec97ead668ddbef7140b66c))
- **postgres:** add support for postgres inet type ([#279](https://github.com/graphile/graphile-engine/issues/279)) ([319d096](https://github.com/graphile/graphile-engine/commit/319d096aaa398403b0ed315424e9fd7f5d8bc133))
- **query-builder:** reference parent query builder on child ([#270](https://github.com/graphile/graphile-engine/issues/270)) ([af9ebd9](https://github.com/graphile/graphile-engine/commit/af9ebd9ddaf7b507b3559d6a18d365bbca1d6841))
- **smart-comments:** can edit description of relation fields ([#275](https://github.com/graphile/graphile-engine/issues/275)) ([a9efc5c](https://github.com/graphile/graphile-engine/commit/a9efc5cdba4477d88fce10f3f80b7124b321d89c)), closes [#204](https://github.com/graphile/graphile-engine/issues/204)
- **smart-comments:** can override pgViewUniqueKey for a view ([#276](https://github.com/graphile/graphile-engine/issues/276)) ([b5f48c7](https://github.com/graphile/graphile-engine/commit/b5f48c770cb42704365f1a15d7e8090abaf77bd8)), closes [#178](https://github.com/graphile/graphile-engine/issues/178)
- **types:** beginnings of TypeScriptification ([#280](https://github.com/graphile/graphile-engine/issues/280)) ([9fe9b3e](https://github.com/graphile/graphile-engine/commit/9fe9b3e180f0b8e6322e3c070aecfb4a80838524))
- **utils:** add `[@requires](https://github.com/requires)(columns: [...])` directive ([#286](https://github.com/graphile/graphile-engine/issues/286)) ([75cd16b](https://github.com/graphile/graphile-engine/commit/75cd16baf7c306686cf34770c0999a4447cc5ce7))

# [4.0.0-rc.5](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.4...v4.0.0-rc.5) (2018-07-25)

### Bug Fixes

- **errors:** More explicit error on schema build fail ([#264](https://github.com/graphile/graphile-engine/issues/264)) ([d49c36a](https://github.com/graphile/graphile-engine/commit/d49c36a1d7474d7e196dbd5149798dfd80a9926a))
- **money:** have DB convert money to numeric for us ([#258](https://github.com/graphile/graphile-engine/issues/258)) ([be71fd4](https://github.com/graphile/graphile-engine/commit/be71fd4d7153cfe384770fe6268b5ec736657f05))
- **rbac:** allow exposing hidden types when sensible ([#265](https://github.com/graphile/graphile-engine/issues/265)) ([aeccb4c](https://github.com/graphile/graphile-engine/commit/aeccb4c51c9c98d5c26eee54088959e32a1f1f2c))

### Features

- **build:** add getTypeAndIdentifiersFromNodeId(nodeId) ([#262](https://github.com/graphile/graphile-engine/issues/262)) ([447239d](https://github.com/graphile/graphile-engine/commit/447239d60f48a07e284ac26092cddae52cf07c8d))

# [4.0.0-rc.4](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.3...v4.0.0-rc.4) (2018-07-14)

### Bug Fixes

- **deps:** add lru-cache as explicit dependency ([#250](https://github.com/graphile/graphile-engine/issues/250)) ([a65cdc5](https://github.com/graphile/graphile-engine/commit/a65cdc58bc181bdfc72cf05c75fb729737630606)), closes [#245](https://github.com/graphile/graphile-engine/issues/245)
- **rbac:** revert default to ignoring RBAC ([#251](https://github.com/graphile/graphile-engine/issues/251)) ([98f4918](https://github.com/graphile/graphile-engine/commit/98f491803dc7e57ceaac90e7d5c5be4286d7e181))

### Features

- **utils:** can define `subscribe` along with `resolve` ([#246](https://github.com/graphile/graphile-engine/issues/246)) ([22aaa29](https://github.com/graphile/graphile-engine/commit/22aaa2983df3d15561f1be4fef5481b6694cdaed))

# [4.0.0-rc.3](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2018-06-30)

### Bug Fixes

- **rbac:** add support for type modifiers to gql2pg ([#243](https://github.com/graphile/graphile-engine/issues/243)) ([f71ffd7](https://github.com/graphile/graphile-engine/commit/f71ffd776cfac84c3f862f944d27516a4120f87b)), closes [#234](https://github.com/graphile/graphile-engine/issues/234)
- **rbac:** don't exclude tables that use column-based select permissions ([#242](https://github.com/graphile/graphile-engine/issues/242)) ([70dac62](https://github.com/graphile/graphile-engine/commit/70dac62a8de184909ec99919ce3235df0bd3bb14))

# [4.0.0-rc.2](https://github.com/graphile/graphile-engine/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2018-06-25)

### Features

- **pg:** introspection of subtypes, exclude extension resources ([#233](https://github.com/graphile/graphile-engine/issues/233)) ([76b348c](https://github.com/graphile/graphile-engine/commit/76b348c720e1470cf6c703c1d2736877935b44d8))
- **pg:** RBAC-based auto-omitting; functions support patch table type ([#240](https://github.com/graphile/graphile-engine/issues/240)) ([8c2b716](https://github.com/graphile/graphile-engine/commit/8c2b716e55deafca48d4621133ae05eee9013719))

# [4.0.0-rc.1](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.8...v4.0.0-rc.1) (2018-06-09)

### Bug Fixes

- **types:** handle negative money values ([#231](https://github.com/graphile/graphile-engine/issues/231)) ([8ed07ff](https://github.com/graphile/graphile-engine/commit/8ed07ff561fb560f719b2c662b74042e9ac0da59))

# [4.0.0-beta.8](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2018-05-31)

### Bug Fixes

- **sql:** limit alias length ([#225](https://github.com/graphile/graphile-engine/issues/225)) ([8c18a4d](https://github.com/graphile/graphile-engine/commit/8c18a4d05ff9333d4f41ad9f79207435629c8aa4))

### Features

- **collections:** add "simple collections" ([#222](https://github.com/graphile/graphile-engine/issues/222)) ([548e5ef](https://github.com/graphile/graphile-engine/commit/548e5ef62eb8afb3eb0745d717d4eb46f8eaf23c))

# [4.0.0-beta.7](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2018-05-15)

### Bug Fixes

- **procs:** fix querying only `totalCount` on procedure connections ([#221](https://github.com/graphile/graphile-engine/issues/221)) ([76feb72](https://github.com/graphile/graphile-engine/commit/76feb726b665eba22d6d3726327903b2868cebad))

# [4.0.0-beta.6](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2018-05-09)

### Bug Fixes

- **procs:** complex function fixes (setof, complex types, etc) + tests ([#219](https://github.com/graphile/graphile-engine/issues/219)) ([d3937ad](https://github.com/graphile/graphile-engine/commit/d3937ade30fb04c92a057341470fb2742859488a))
- **procs:** fix mutations that return null throwing errors ([#220](https://github.com/graphile/graphile-engine/issues/220)) ([6899c45](https://github.com/graphile/graphile-engine/commit/6899c45b72f565a170bef7a620070d6847ba0c0a))

# [4.0.0-beta.5](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2018-05-05)

### Bug Fixes

- **procs:** handle returning arrays of custom types ([#218](https://github.com/graphile/graphile-engine/issues/218)) ([7b04cff](https://github.com/graphile/graphile-engine/commit/7b04cff18a62313c34debdda292676a4633520c0))

# [4.0.0-beta.4](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2018-05-04)

# [4.0.0-beta.3](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2018-05-04)

### Bug Fixes

- **directives:** Omit skipped fields from execution plan ([#201](https://github.com/graphile/graphile-engine/issues/201)) ([a5a95d3](https://github.com/graphile/graphile-engine/commit/a5a95d349200758c97609ab3d830882f5f1e69bd))
- **dynamic-json:** variables in dynamic JSON subfields now supported ([#210](https://github.com/graphile/graphile-engine/issues/210)) ([6f86dc8](https://github.com/graphile/graphile-engine/commit/6f86dc8761ec14a1d6e39bd71db7f998c7ebfcf3))
- **introspection:** gracefully handle stale pg_catalog.pg_description ([#212](https://github.com/graphile/graphile-engine/issues/212)) ([4e92f98](https://github.com/graphile/graphile-engine/commit/4e92f987216e32f6ea5c8d0509035d0833405b00))

### Features

- **inflection:** Pluggable inflector, smart-comment overridable ([#199](https://github.com/graphile/graphile-engine/issues/199)) ([399ea02](https://github.com/graphile/graphile-engine/commit/399ea0241e9aa9ce21b9cc82799645543bff8c87))
- **plugins:** Add backward/forward boolean relation identifiers ([#215](https://github.com/graphile/graphile-engine/issues/215)) ([cb88313](https://github.com/graphile/graphile-engine/commit/cb883131af49ed2ca3b06d428337b2f58892c3d9))
- **plugins:** Add pgFieldIntrospection to GraphQLInputObjectType:fields:field scope ([#202](https://github.com/graphile/graphile-engine/issues/202)) ([22859bd](https://github.com/graphile/graphile-engine/commit/22859bd3516932c9e86ecee25d139f948ef791a2))
- **subscriptions:** Subscriptions base plugin ([4c1f6e8](https://github.com/graphile/graphile-engine/commit/4c1f6e8d669eb96cbf5976863937560b8e0249e6))

# [4.0.0-beta.2](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2018-03-14)

### Bug Fixes

- **sql:** remove unnecessary row expansion ([#196](https://github.com/graphile/graphile-engine/issues/196)) ([3ebc627](https://github.com/graphile/graphile-engine/commit/3ebc6276dda98c9a55a2454bde044a3c2962f9ac))

# [4.0.0-beta.1](https://github.com/graphile/graphile-engine/compare/v4.0.0-beta.0...v4.0.0-beta.1) (2018-03-10)

### Bug Fixes

- **sql:** still introspect when `standard_conforming_strings` is off ([#193](https://github.com/graphile/graphile-engine/issues/193)) ([4d1500b](https://github.com/graphile/graphile-engine/commit/4d1500ba695e0e30a517a87dc2a50a6f095d6db2))

# [4.0.0-beta.0](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha.5...v4.0.0-beta.0) (2018-03-07)

# [4.0.0-alpha.5](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha.4...v4.0.0-alpha.5) (2018-03-02)

# [4.0.0-alpha.4](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha.3...v4.0.0-alpha.4) (2018-02-28)

### Performance Improvements

- **sql:** upgrade pg-sql2 ([#185](https://github.com/graphile/graphile-engine/issues/185)) ([7d26d95](https://github.com/graphile/graphile-engine/commit/7d26d9537db07a486540e81336c0a79e16418c8b))

# [4.0.0-alpha.3](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha.2...v4.0.0-alpha.3) (2018-02-27)

### Bug Fixes

- **schema:** fix a missing non-null ([#183](https://github.com/graphile/graphile-engine/issues/183)) ([4cd8208](https://github.com/graphile/graphile-engine/commit/4cd8208e5c0fea77c26d23f51c702f9024ce8e1e))

### Features

- **compat:** enable lower case Json/Uuid like v3 ([#184](https://github.com/graphile/graphile-engine/issues/184)) ([20a084f](https://github.com/graphile/graphile-engine/commit/20a084fb07e360ac33b1452951d63e05d22ad4c1))

# [4.0.0-alpha.2](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) (2018-02-27)

### Bug Fixes

- **compatibility:** v3 compatibility tweaks ([#181](https://github.com/graphile/graphile-engine/issues/181)) ([5091cc6](https://github.com/graphile/graphile-engine/commit/5091cc6f0ecaadc967c80a1159c0f4b9637f77b8))

# [4.0.0-alpha.1](https://github.com/graphile/graphile-engine/compare/v4.0.0-alpha...v4.0.0-alpha.1) (2018-02-23)

# [4.0.0-alpha](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.41...v4.0.0-alpha) (2018-02-23)

### Bug Fixes

- **deps:** Fix dependency patterns, graphql compatibility ([#172](https://github.com/graphile/graphile-engine/issues/172)) ([0c4f9a5](https://github.com/graphile/graphile-engine/commit/0c4f9a542519c892e8df8c7541b60274879acc91))

### Features

- one-to-one relationships ([#177](https://github.com/graphile/graphile-engine/issues/177)) ([18012df](https://github.com/graphile/graphile-engine/commit/18012dfafda92ee61d861afb6bbe67881be70dd6))
- **errors:** Check inflectors give non-empty string ([#170](https://github.com/graphile/graphile-engine/issues/170)) ([5e2e697](https://github.com/graphile/graphile-engine/commit/5e2e6979a1ea413350b5d22b17286b56f1b19825))
- **sql:** support more symbol enums ([#171](https://github.com/graphile/graphile-engine/issues/171)) ([552148e](https://github.com/graphile/graphile-engine/commit/552148e238475c95839e0d5fb3147d08868f3fd5))

# [0.1.0-alpha.41](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.40...v0.1.0-alpha.41) (2018-02-19)

# [0.1.0-alpha.40](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.39...v0.1.0-alpha.40) (2018-02-19)

# [0.1.0-alpha.39](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.38...v0.1.0-alpha.39) (2018-02-17)

### Bug Fixes

- **clash:** Auto-rename clashing \_input/\_patch tables ([#159](https://github.com/graphile/graphile-engine/issues/159)) ([f5b5506](https://github.com/graphile/graphile-engine/commit/f5b5506ff309cd1acf3c9c2b58fc496ef3438ec2))
- **mutations:** add tests for orderBy multiple on mutation payload edge + fix ([#162](https://github.com/graphile/graphile-engine/issues/162)) ([4cf146c](https://github.com/graphile/graphile-engine/commit/4cf146ce2aa8733e6f395924cad6f98799152649))
- **mutations:** Fix null cursor on mutations, make orderBy an array too ([#160](https://github.com/graphile/graphile-engine/issues/160)) ([014daaf](https://github.com/graphile/graphile-engine/commit/014daafa5d31ed899c79927e214418380ac2ef1c))
- **precision:** Fix bigint/bigfloat precision loss ([#158](https://github.com/graphile/graphile-engine/issues/158)) ([5dbf6e4](https://github.com/graphile/graphile-engine/commit/5dbf6e4ecf8cf8642e41ca030a53b8328c5bf7e2))
- **schema:** remove incorrect 'pagination' comments ([#166](https://github.com/graphile/graphile-engine/issues/166)) ([72f36e6](https://github.com/graphile/graphile-engine/commit/72f36e64051ad6fdbc40bc6808fa18b305664ebd))
- **sql:** reduce redundancy in select statements ([#161](https://github.com/graphile/graphile-engine/issues/161)) ([29fb723](https://github.com/graphile/graphile-engine/commit/29fb7236503ab7193e86982ad86b710e9a9ba600))

### Features

- **errors:** Better clash error messages ([#164](https://github.com/graphile/graphile-engine/issues/164)) ([faf3b8d](https://github.com/graphile/graphile-engine/commit/faf3b8db585ff6275b9c40ea3ee48970d180ae3c))
- **errors:** Warn when one or more of the schemas you've specified are missing ([#165](https://github.com/graphile/graphile-engine/issues/165)) ([f422783](https://github.com/graphile/graphile-engine/commit/f422783251356ed4c9e05e75d74116964d1c1a01))
- **pg:** duck-type PG to prevent 'provide valid PG client' error ([#168](https://github.com/graphile/graphile-engine/issues/168)) ([d5ed9a9](https://github.com/graphile/graphile-engine/commit/d5ed9a935f7947210f2decfed3d447044ba896a2))
- support enums with asterisks in ([#163](https://github.com/graphile/graphile-engine/issues/163)) ([cbbf3ea](https://github.com/graphile/graphile-engine/commit/cbbf3ea17926cb3af108b7b799844e36cde99843))

# [0.1.0-alpha.38](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.37...v0.1.0-alpha.38) (2018-01-14)

### Features

- **cache:** enable memoizing time-intensive tasks to disk ([#149](https://github.com/graphile/graphile-engine/issues/149)) ([f5224fe](https://github.com/graphile/graphile-engine/commit/f5224fe9095605425e53ed5c75ee2c50cfd9fd62))

# [0.1.0-alpha.37](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.36...v0.1.0-alpha.37) (2017-12-16)

### Bug Fixes

- **composite-types:** Fix null composite column issue ([#140](https://github.com/graphile/graphile-engine/issues/140)) ([57a3fb9](https://github.com/graphile/graphile-engine/commit/57a3fb95b6b6620870fdab3257890b1c409d3b2a))
- **custom-mutations:** Allow mutation procedures to accept table args ([#133](https://github.com/graphile/graphile-engine/issues/133)) ([1fe3b4e](https://github.com/graphile/graphile-engine/commit/1fe3b4eb4d9d0a9d19ab022ac2e04f5b35b240bb))
- **delete:** always populate deleted nodeId ([#143](https://github.com/graphile/graphile-engine/issues/143)) ([5f4539b](https://github.com/graphile/graphile-engine/commit/5f4539bd0a634cd33b316de29752036dd503680c))
- **getTypeByName:** register default types like JSON earlier ([#135](https://github.com/graphile/graphile-engine/issues/135)) ([a383a35](https://github.com/graphile/graphile-engine/commit/a383a35dd7aba9453768363e02f559ec738e09f0))
- **sql:** don't return null for empty arrays ([#129](https://github.com/graphile/graphile-engine/issues/129)) ([fbbf4d6](https://github.com/graphile/graphile-engine/commit/fbbf4d6667bb0cd1ae51c58ec08b9eb1413cf18c))
- **tags:** Stringify array of deprecated tags ([#130](https://github.com/graphile/graphile-engine/issues/130)) ([83abbb8](https://github.com/graphile/graphile-engine/commit/83abbb84d62415a6ff455426e9424a61d95a815b))
- **types:** use named BigFloat type over GraphQLString ([#141](https://github.com/graphile/graphile-engine/issues/141)) ([649f6bb](https://github.com/graphile/graphile-engine/commit/649f6bbe8fea6b0eef4a73601ee9bfb4fd4d2832))

### Features

- **connections:** Change orderBy argument to GraphQLList ([#144](https://github.com/graphile/graphile-engine/issues/144)) ([767cfc7](https://github.com/graphile/graphile-engine/commit/767cfc72f6922df3ca1df99ecf71c4ea3c2ff867))
- **deprecation:** Deprecate fields from column comments ([#128](https://github.com/graphile/graphile-engine/issues/128)) ([67acc7c](https://github.com/graphile/graphile-engine/commit/67acc7cec7fea903210a6dee602447ff643111da))
- **postgraphile-core:** Add removePlugins option ([#139](https://github.com/graphile/graphile-engine/issues/139)) ([1652ee8](https://github.com/graphile/graphile-engine/commit/1652ee80bca9005263b6658f8d61bdd28d8ba99c))
- **types:** add support for 'point' type ([#145](https://github.com/graphile/graphile-engine/issues/145)) ([18ee16e](https://github.com/graphile/graphile-engine/commit/18ee16e79a743e69c4a39bd7fd345d1405794b6a))

# [0.1.0-alpha.36](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.35...v0.1.0-alpha.36) (2017-12-03)

### Bug Fixes

- **dependencies:** Solve missing dependency ([#122](https://github.com/graphile/graphile-engine/issues/122)) ([cda42a5](https://github.com/graphile/graphile-engine/commit/cda42a582d83b72cb5014c89febe7522e738975a)), closes [#119](https://github.com/graphile/graphile-engine/issues/119)
- **fields:** make fieldWithHooks much more consistent ([#124](https://github.com/graphile/graphile-engine/issues/124)) ([eb1a6bc](https://github.com/graphile/graphile-engine/commit/eb1a6bc6910a54907ce6098acee19503b0004d38))
- **procs:** Functions no longer passed null for missing arguments (unless necessary) ([#125](https://github.com/graphile/graphile-engine/issues/125)) ([2d9fbb9](https://github.com/graphile/graphile-engine/commit/2d9fbb961c97fd4a1010862634c3b30257f8eaf7))
- **types:** Prevent numeric overflow for arbitrary-precision types ([#123](https://github.com/graphile/graphile-engine/issues/123)) ([d2c1e95](https://github.com/graphile/graphile-engine/commit/d2c1e95f8fadb1b30bd960a757056ecc7b1e1f6c))

# [0.1.0-alpha.35](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.34...v0.1.0-alpha.35) (2017-11-02)

### Bug Fixes

- **arrays:** Fix many issues related to arrays of compound types ([#109](https://github.com/graphile/graphile-engine/issues/109)) ([df42344](https://github.com/graphile/graphile-engine/commit/df423449e9da6f494fc0230a5bc4b89264a00945))
- **graphql:** correctly detect non nullable domain ([#113](https://github.com/graphile/graphile-engine/issues/113)) ([cab2d3b](https://github.com/graphile/graphile-engine/commit/cab2d3bc51963c043ad08e3bbd608c40e225d8b1)), closes [#111](https://github.com/graphile/graphile-engine/issues/111)

# [0.1.0-alpha.34](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.33...v0.1.0-alpha.34) (2017-10-29)

# [0.1.0-alpha.33](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.32...v0.1.0-alpha.33) (2017-10-29)

### Bug Fixes

- **columns:** don't let columns overwrite each-other ([#106](https://github.com/graphile/graphile-engine/issues/106)) ([66f2cce](https://github.com/graphile/graphile-engine/commit/66f2cce8039e14ea125c12aba0b0d809d65a6c17))
- **cursors:** only use cursor when order is unique ([#107](https://github.com/graphile/graphile-engine/issues/107)) ([45e916f](https://github.com/graphile/graphile-engine/commit/45e916f2ea85e5263c968ea1c1c975d5dbcada40))
- **graphql:** solve some of the array of custom type issues ([#92](https://github.com/graphile/graphile-engine/issues/92)) ([2a7ee5e](https://github.com/graphile/graphile-engine/commit/2a7ee5e1cba196aa579ef5ebcb1e084373ce1291))
- **json:** fix JSON handling in viaTemporaryTable ([#90](https://github.com/graphile/graphile-engine/issues/90)) ([663cedc](https://github.com/graphile/graphile-engine/commit/663cedc4bef810ca3edc9e1e2d0687de9dfc1d67))
- **procedures:** fix arg refs where SQL and GraphQL field names differ ([#91](https://github.com/graphile/graphile-engine/issues/91)) ([ea5a44f](https://github.com/graphile/graphile-engine/commit/ea5a44fe436482795ab6bda20fb57d984bf4b53a))

### Features

- **conditions:** enable filtering for a column being null ([#96](https://github.com/graphile/graphile-engine/issues/96)) ([db30a95](https://github.com/graphile/graphile-engine/commit/db30a95d80b5eca17b78cdedda63b778b9463c37))
- **cursors:** improve cursors on non-unique orderings; add `pgViewUniqueKey` ([#101](https://github.com/graphile/graphile-engine/issues/101)) ([e032764](https://github.com/graphile/graphile-engine/commit/e03276483a62c2ada22bf549760de903bc78c3d9))
- **inflector:** add foreign table to manyRelationByKeys call ([#80](https://github.com/graphile/graphile-engine/issues/80)) ([d2da240](https://github.com/graphile/graphile-engine/commit/d2da24040a6a352679b5985b4829634f32396e7a)), closes [#77](https://github.com/graphile/graphile-engine/issues/77)
- **pgColumnFilter:** introduce _experimental_ column filter callback ([#73](https://github.com/graphile/graphile-engine/issues/73)) ([0fe8cfb](https://github.com/graphile/graphile-engine/commit/0fe8cfbf0c15b8c4776d9dd6afbd6822622e334c)), closes [#65](https://github.com/graphile/graphile-engine/issues/65)
- **QueryBuilder:** pass self to callIfNecessary callbacks ([#94](https://github.com/graphile/graphile-engine/issues/94)) ([e169d33](https://github.com/graphile/graphile-engine/commit/e169d332b516dee22a3cc327d9883f4c77616397)), closes [#88](https://github.com/graphile/graphile-engine/issues/88)

# [0.1.0-alpha.32](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.31...v0.1.0-alpha.32) (2017-09-22)

### Bug Fixes

- **mutations:** nullable payloads, rollback individual mutations on error ([#59](https://github.com/graphile/graphile-engine/issues/59)) ([4d00257](https://github.com/graphile/graphile-engine/commit/4d002571208c070bf37ad839bef5483498e397b4))
- **mutations:** setting null on create for nullable column with non-null default ([#74](https://github.com/graphile/graphile-engine/issues/74)) ([c609826](https://github.com/graphile/graphile-engine/commit/c6098260eb53f941350eebc1d87d538b10081042))
- **types:** handle empty enum values; improve type error message ([#78](https://github.com/graphile/graphile-engine/issues/78)) ([99d917c](https://github.com/graphile/graphile-engine/commit/99d917ca69c162b566de548d9dda45c92a4a4a7e))

### Features

- **inflector:** split rowByUniqueKeys from singleRelationByKeys ([#72](https://github.com/graphile/graphile-engine/issues/72)) ([46e88dd](https://github.com/graphile/graphile-engine/commit/46e88dddb286c8ec3202a56d8d5a383f48009482))
- **plugins:** add `type` to context ([#79](https://github.com/graphile/graphile-engine/issues/79)) ([a161f53](https://github.com/graphile/graphile-engine/commit/a161f532dad3d0d18f8c9dd505d72a1a126f3fad))

# [0.1.0-alpha.31](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.30...v0.1.0-alpha.31) (2017-09-14)

### Bug Fixes

- **namespaces:** allow JWT from private schema; pass non-null schema name to inflectors ([#70](https://github.com/graphile/graphile-engine/issues/70)) ([0d48a5d](https://github.com/graphile/graphile-engine/commit/0d48a5dc13135a1915a7265396e279e5586ca3e1))

# [0.1.0-alpha.30](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2017-09-12)

### Bug Fixes

- **graphql:** fix UUID type with `pgExtendedTypes` ([#67](https://github.com/graphile/graphile-engine/issues/67)) ([02e8868](https://github.com/graphile/graphile-engine/commit/02e88680b81419a858f6380b8f779783c3f3b8ac))

# [0.1.0-alpha.29](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2017-09-11)

### Features

- **inflection:** export inflection engine ([#64](https://github.com/graphile/graphile-engine/issues/64)) ([dc032ca](https://github.com/graphile/graphile-engine/commit/dc032ca768bcd8ddcdeb6bad614d01f6a9cfe803))

# [0.1.0-alpha.28](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2017-09-05)

### Bug Fixes

- **procedures:** support procedures returning setof composite ([#61](https://github.com/graphile/graphile-engine/issues/61)) ([b641093](https://github.com/graphile/graphile-engine/commit/b641093e0b183258a05df80818339787831d4c64)), closes [#60](https://github.com/graphile/graphile-engine/issues/60) [#60](https://github.com/graphile/graphile-engine/issues/60)

# [0.1.0-alpha.27](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.26...v0.1.0-alpha.27) (2017-08-23)

### Bug Fixes

- **errors:** tweaks to errors/logs/etc ([#56](https://github.com/graphile/graphile-engine/issues/56)) ([74654d5](https://github.com/graphile/graphile-engine/commit/74654d5ae70870acf93edf6bb3f5e513435500e1))

### Features

- export case utils ([#58](https://github.com/graphile/graphile-engine/issues/58)) ([8531671](https://github.com/graphile/graphile-engine/commit/85316717f433e0e6b6fed0889fba5306033a4151))
- **graphile-build-pg:** export case-altering functions ([#54](https://github.com/graphile/graphile-engine/issues/54)) ([fd5fe1c](https://github.com/graphile/graphile-engine/commit/fd5fe1c3f39838b7c4fd3753601ba6f281f8b708))

# [0.1.0-alpha.26](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2017-08-21)

### Bug Fixes

- **procedures:** fix paginating backwards through procedures returning setof ([#53](https://github.com/graphile/graphile-engine/issues/53)) ([731d223](https://github.com/graphile/graphile-engine/commit/731d2239c1da47a60765ba64cd55cefe71f085fe))

# [0.1.0-alpha.25](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.24...v0.1.0-alpha.25) (2017-08-20)

### Bug Fixes

- **relations:** make forward relations nullable ([#52](https://github.com/graphile/graphile-engine/issues/52)) ([97dd5df](https://github.com/graphile/graphile-engine/commit/97dd5dfb306b1137fdf11c1508ada409f0c34b7d))

# [0.1.0-alpha.24](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.23...v0.1.0-alpha.24) (2017-08-16)

### Bug Fixes

- **viaTempTable:** safer (does not assume array type existence) ([ad36f6d](https://github.com/graphile/graphile-engine/commit/ad36f6df0e6fa133dfa8aad2aff32bca1420d972))

# [0.1.0-alpha.23](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.22...v0.1.0-alpha.23) (2017-08-15)

### Bug Fixes

- **condition:** fix scope typo ([b5740a2](https://github.com/graphile/graphile-engine/commit/b5740a2157d67132e393ef809e90f47ae9b1e1f9))
- **security:** double-ensure safety of column aliases ([#48](https://github.com/graphile/graphile-engine/issues/48)) ([8a9b23b](https://github.com/graphile/graphile-engine/commit/8a9b23b0743845bfcbb20df16ebf58285aaa8849))

# [0.1.0-alpha.22](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2017-08-14)

### Bug Fixes

- **strict-fns:** fix omitted arg for computed column, non-null args ([#47](https://github.com/graphile/graphile-engine/issues/47)) ([550802d](https://github.com/graphile/graphile-engine/commit/550802d1f874ca4c61fb2ca0bbcfd1540ddcde9d))

# [0.1.0-alpha.21](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2017-08-10)

### Bug Fixes

- **schema:** don't add node ID if no PK ([8e261bb](https://github.com/graphile/graphile-engine/commit/8e261bb0e1801cb045ce14fd280df41998819120))

# [0.1.0-alpha.20](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2017-08-09)

### Bug Fixes

- **ci:** solve PATH issue ([ceb5bd8](https://github.com/graphile/graphile-engine/commit/ceb5bd85c25f5692f658e576a7ca339fc821c7c4))
- **jwt:** return null on null JWT ([#43](https://github.com/graphile/graphile-engine/issues/43)) ([415acd1](https://github.com/graphile/graphile-engine/commit/415acd145992f25db492dab778cec0e7bc34eda8))

# [0.1.0-alpha.19](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2017-08-09)

### Bug Fixes

- **inflection:** solve two enum issues ([#42](https://github.com/graphile/graphile-engine/issues/42)) ([2fd2bbb](https://github.com/graphile/graphile-engine/commit/2fd2bbb8640a9c290e25afd7159bee1c80d1f73b))

# [0.1.0-alpha.18](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2017-08-08)

### Features

- **pagination:** allow using cursors with orderBy=NATURAL ([#39](https://github.com/graphile/graphile-engine/issues/39)) ([2c3156b](https://github.com/graphile/graphile-engine/commit/2c3156b4d0b359b735a180e6558b0e0142cf3d38))

### Performance Improvements

- **totalCount:** only query \_\_cursor/rows when needed ([#40](https://github.com/graphile/graphile-engine/issues/40)) ([f7454f1](https://github.com/graphile/graphile-engine/commit/f7454f13e9bebf8ddd51c9597206dd63ded20bb9))

# [0.1.0-alpha.17](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2017-08-04)

### Features

- **graphile-build-pg:** export all plugins ([#35](https://github.com/graphile/graphile-engine/issues/35)) ([9bc9d2e](https://github.com/graphile/graphile-engine/commit/9bc9d2e4d689ef3772ca0cba2882adc2d1a703d8))

# [0.1.0-alpha.16](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2017-08-01)

### Bug Fixes

- **mutations:** remove temp tables due to privilege requirements ([#31](https://github.com/graphile/graphile-engine/issues/31)) ([1a74750](https://github.com/graphile/graphile-engine/commit/1a747509bb1aed49726d6440af10f89169f037da))

# [0.1.0-alpha.15](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.13...v0.1.0-alpha.15) (2017-08-01)

### Bug Fixes

- **mutations:** computed columns after mutations now access non-stale data ([#28](https://github.com/graphile/graphile-engine/issues/28)) ([5069fc6](https://github.com/graphile/graphile-engine/commit/5069fc6aa033fb90cb7cae473226bd252591de3f))

# [0.1.0-alpha.13](https://github.com/graphile/graphile-engine/compare/v0.1.0-alpha.1...v0.1.0-alpha.13) (2017-07-29)

# [0.1.0-alpha.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha11.2...v0.1.0-alpha.1) (2017-07-29)

### Reverts

- Revert "vundefined" ([62dde86](https://github.com/graphile/graphile-engine/commit/62dde86fff9001bd3cb986030c4ea5590a8fc78d))

## [0.0.1-alpha11.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha11.1...v0.0.1-alpha11.2) (2017-07-28)

### Bug Fixes

- **node:** change nodeIdFieldName to 'id' ([#26](https://github.com/graphile/graphile-engine/issues/26)) ([1df0743](https://github.com/graphile/graphile-engine/commit/1df07434a3bd1dee5465f4e66798fdfa5b6b20b7))

## [0.0.1-alpha11.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha11.0...v0.0.1-alpha11.1) (2017-07-26)

### Features

- **debug:** output warnings on stderr; hint how to view full error ([#24](https://github.com/graphile/graphile-engine/issues/24)) ([77edca3](https://github.com/graphile/graphile-engine/commit/77edca3a6f0cfa3eb2e90991beb75d10a6de5db3))
- **hooks:** hook for individual enum value ([#25](https://github.com/graphile/graphile-engine/issues/25)) ([3d82458](https://github.com/graphile/graphile-engine/commit/3d82458bd18eb3ffeb75ea7cd1653c315e2adbb2))

## [0.0.1-alpha11.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha10.0...v0.0.1-alpha11.0) (2017-07-26)

### Bug Fixes

- **extensions:** skip things we don't understand ([#22](https://github.com/graphile/graphile-engine/issues/22)) ([7fb5d8f](https://github.com/graphile/graphile-engine/commit/7fb5d8fb819041534145c23e6d4f5266e2e784a9))
- **types:** Convert single-row fetches to_json for consistency ([#21](https://github.com/graphile/graphile-engine/issues/21)) ([a98f2f6](https://github.com/graphile/graphile-engine/commit/a98f2f679e2d0da49ca76633057ddd41b42fc0ba))

## [0.0.1-alpha10.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha9.3...v0.0.1-alpha10.0) (2017-07-25)

### Features

- **graphql-parse-resolve-info:** add Flow types ([#12](https://github.com/graphile/graphile-engine/issues/12)) ([34322d1](https://github.com/graphile/graphile-engine/commit/34322d133483d445c55bbfee021c73ef5374a63e))

## [0.0.1-alpha9.3](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha9.2...v0.0.1-alpha9.3) (2017-07-16)

## [0.0.1-alpha9.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha9.1...v0.0.1-alpha9.2) (2017-07-15)

## [0.0.1-alpha9.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha9.0...v0.0.1-alpha9.1) (2017-07-15)

## [0.0.1-alpha9.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha8.3...v0.0.1-alpha9.0) (2017-07-15)

## [0.0.1-alpha8.3](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha8.2...v0.0.1-alpha8.3) (2017-07-14)

## [0.0.1-alpha8.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha8.1...v0.0.1-alpha8.2) (2017-07-14)

## [0.0.1-alpha8.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha8.0...v0.0.1-alpha8.1) (2017-07-13)

## [0.0.1-alpha8.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha7.1...v0.0.1-alpha8.0) (2017-07-13)

## [0.0.1-alpha7.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha7.0...v0.0.1-alpha7.1) (2017-07-13)

## [0.0.1-alpha7.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.8...v0.0.1-alpha7.0) (2017-07-13)

## [0.0.1-alpha6.8](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.7...v0.0.1-alpha6.8) (2017-07-13)

## [0.0.1-alpha6.7](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.6...v0.0.1-alpha6.7) (2017-07-13)

## [0.0.1-alpha6.6](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.5...v0.0.1-alpha6.6) (2017-07-13)

## [0.0.1-alpha6.5](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.4...v0.0.1-alpha6.5) (2017-07-13)

## [0.0.1-alpha6.4](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.3...v0.0.1-alpha6.4) (2017-07-13)

## [0.0.1-alpha6.3](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.2...v0.0.1-alpha6.3) (2017-07-13)

## [0.0.1-alpha6.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.1...v0.0.1-alpha6.2) (2017-07-13)

## [0.0.1-alpha6.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha6.0...v0.0.1-alpha6.1) (2017-07-13)

## [0.0.1-alpha6.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha5.1...v0.0.1-alpha6.0) (2017-07-12)

## [0.0.1-alpha5.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha5.0...v0.0.1-alpha5.1) (2017-07-12)

## [0.0.1-alpha5.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha4.1...v0.0.1-alpha5.0) (2017-07-12)

## [0.0.1-alpha4.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha4.0...v0.0.1-alpha4.1) (2017-07-12)

## [0.0.1-alpha4.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.7...v0.0.1-alpha4.0) (2017-07-12)

## [0.0.1-alpha3.7](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.6...v0.0.1-alpha3.7) (2017-07-08)

## [0.0.1-alpha3.6](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.5...v0.0.1-alpha3.6) (2017-07-07)

## [0.0.1-alpha3.5](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.4...v0.0.1-alpha3.5) (2017-07-07)

## [0.0.1-alpha3.4](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.3...v0.0.1-alpha3.4) (2017-07-07)

## [0.0.1-alpha3.3](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.2...v0.0.1-alpha3.3) (2017-07-07)

## [0.0.1-alpha3.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.1...v0.0.1-alpha3.2) (2017-07-07)

## [0.0.1-alpha3.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha3.0...v0.0.1-alpha3.1) (2017-07-07)

## [0.0.1-alpha3.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha2.4...v0.0.1-alpha3.0) (2017-07-06)

## [0.0.1-alpha2.4](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha2.3...v0.0.1-alpha2.4) (2017-07-05)

## [0.0.1-alpha2.3](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha2.2...v0.0.1-alpha2.3) (2017-07-05)

## [0.0.1-alpha2.2](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha2.1...v0.0.1-alpha2.2) (2017-07-05)

## [0.0.1-alpha2.1](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha2.0...v0.0.1-alpha2.1) (2017-07-05)

## [0.0.1-alpha2.0](https://github.com/graphile/graphile-engine/compare/v0.0.1-alpha1.0...v0.0.1-alpha2.0) (2017-07-05)

## [0.0.1-alpha1.0](https://github.com/graphile/graphile-engine/compare/2b6d5f37ccdcebdd1a0e6866e8db2df029a3fc0b...v0.0.1-alpha1.0) (2017-07-05)

### Features

- recursive field generators ([37d73c1](https://github.com/graphile/graphile-engine/commit/37d73c179bec33bd71daee784cbe451cd41e0a1c))
- **resolveInfo:** can now process arguments ([c94eeb2](https://github.com/graphile/graphile-engine/commit/c94eeb2ae2850a5f2e5388b3c917dc62b1c3ce42))
- Add parsing of resolveInfo ([6ae734f](https://github.com/graphile/graphile-engine/commit/6ae734fb6b7135802630d9008ba6cb3abaa22b13))
- Introduce buildFieldWithHooks ([76cb2af](https://github.com/graphile/graphile-engine/commit/76cb2af372e8b719aa27dc5d4c58ee79f51abc56))
- Introduce buildObjectWithHooks ([94b9d6f](https://github.com/graphile/graphile-engine/commit/94b9d6f10022ac64695a0cbc57e34f1c956949f9))
- Introduce SchemaBuilder ([2b6d5f3](https://github.com/graphile/graphile-engine/commit/2b6d5f37ccdcebdd1a0e6866e8db2df029a3fc0b))
- start enabling field data ([62ac647](https://github.com/graphile/graphile-engine/commit/62ac647c7abff456334576b88cc3fee3574ed669))
- Unique object for each build ([94a10d5](https://github.com/graphile/graphile-engine/commit/94a10d5f4eecbcb37bf82e2669d1d0fecbcedc40))
