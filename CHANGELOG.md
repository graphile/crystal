# [SEE RELEASES INSTEAD](https://github.com/graphile/postgraphile/releases)

We use GitHub's releases tab to log our changes in detail, but this
auto-generated changelog helps us to produce that list, and it may be helpful
to you also.

**IMPORTANT NOTE**: most of the changes in PostGraphile actually come from
Graphile Engine, so you should also reference [those
changes](https://github.com/graphile/graphile-engine/blob/master/CHANGELOG.md).

# [4.9.0](https://github.com/graphile/postgraphile/compare/v4.8.0...v4.9.0) (2020-09-11)

### Bug Fixes

- **graphiql:** fix CSS bundling issue ([#1346](https://github.com/graphile/postgraphile/issues/1346)) ([31f177e](https://github.com/graphile/postgraphile/commit/31f177ea44c47f1097a7cf2256ae717dc3050b60))
- **graphiql:** fix icon alignment issue ([#1347](https://github.com/graphile/postgraphile/issues/1347)) ([50ccb77](https://github.com/graphile/postgraphile/commit/50ccb77c25978db645849b009c8ff9a5bd0ae220))
- **types:** update next function for Express compatability ([#1343](https://github.com/graphile/postgraphile/issues/1343)) ([0420c95](https://github.com/graphile/postgraphile/commit/0420c9564f2f38d885f1f24669ac0b5ca1baffb7))

### Features

- allow overriding init fail handling ([#1342](https://github.com/graphile/postgraphile/issues/1342)) ([b06142a](https://github.com/graphile/postgraphile/commit/b06142a4a6481acfca82f4c0962b1441ac259111))
- upgrade graphile-engine and other dependencies ([#1345](https://github.com/graphile/postgraphile/issues/1345)) ([cd23d26](https://github.com/graphile/postgraphile/commit/cd23d26743d73d4d54b93a15dc89eb1c90f09a4b))

# [4.8.0](https://github.com/graphile/postgraphile/compare/v4.8.0-rc.0...v4.8.0) (2020-08-11)

### Bug Fixes

- **deps:** upgrade dependencies to upgrade dot-prop ([#1325](https://github.com/graphile/postgraphile/issues/1325)) ([fe12ece](https://github.com/graphile/postgraphile/commit/fe12ece38abad3938bf593750382e9b052abadcd))
- **ts:** add jwtSignOptions to PostGraphileOptions type ([#1324](https://github.com/graphile/postgraphile/issues/1324)) ([52f5731](https://github.com/graphile/postgraphile/commit/52f573121bacf9f5d6eb38205f1c028865a191b3))

### Features

- **deps:** upgrade postgraphile-engine (enum constraints) ([#1323](https://github.com/graphile/postgraphile/issues/1323)) ([3999b58](https://github.com/graphile/postgraphile/commit/3999b585cc4277827e64c5c23a15ae25bb1080ed))

# [4.8.0-rc.0](https://github.com/graphile/postgraphile/compare/v4.7.0...v4.8.0-rc.0) (2020-08-05)

### Bug Fixes

- **http:** don't use LRU when queryCacheMaxSize too small ([#1312](https://github.com/graphile/postgraphile/issues/1312)) ([82c0a4c](https://github.com/graphile/postgraphile/commit/82c0a4c3aa5232df30cd4b09a23525e4e406f3d1))

### Features

- **deps:** upgrade postgraphile-core ([#1320](https://github.com/graphile/postgraphile/issues/1320)) ([9054cc2](https://github.com/graphile/postgraphile/commit/9054cc2444e1e1ce1554345ec0aa37cd2d9e9c98))

# [4.7.0](https://github.com/graphile/postgraphile/compare/v4.6.0...v4.7.0) (2020-04-27)

### Features

- **cli:** look for JWT_SECRET in environment variables ([#1236](https://github.com/graphile/postgraphile/issues/1236)) ([dd2b6b2](https://github.com/graphile/postgraphile/commit/dd2b6b2b364efd015e46cd1faab4d37d2fd9fbad))

# [4.6.0](https://github.com/graphile/postgraphile/compare/v4.5.5...v4.6.0) (2020-01-27)

### Features

- **deps:** upgrade graphile engine ([#1222](https://github.com/graphile/postgraphile/issues/1222)) ([1aa782a](https://github.com/graphile/postgraphile/commit/1aa782a4fed033ebf61002e85747c14bf5ecf3b8))

## [4.5.5](https://github.com/graphile/postgraphile/compare/v4.5.4...v4.5.5) (2019-12-13)

## [4.5.4](https://github.com/graphile/postgraphile/compare/v4.5.3...v4.5.4) (2019-12-11)

### Bug Fixes

- **deps:** upgrade graphile-utils ([3d3c41e](https://github.com/graphile/postgraphile/commit/3d3c41eb314ef83715db321a7236da7666a08fa7))

## [4.5.3](https://github.com/graphile/postgraphile/compare/v4.5.2...v4.5.3) (2019-12-11)

### Bug Fixes

- **deps:** upgrade graphile-utils ([e19184f](https://github.com/graphile/postgraphile/commit/e19184f1153b7a6c57af7a5150094398ed192e8f))

## [4.5.2](https://github.com/graphile/postgraphile/compare/v4.5.1...v4.5.2) (2019-12-11)

### Bug Fixes

- **deps:** solve serialize-javascript issue ([02af643](https://github.com/graphile/postgraphile/commit/02af64361d634ff009a7cf9ab2fd52b510987b9e))

### Reverts

- Revert "chore(deps): upgrade PostGraphiQL deps" ([7147e50](https://github.com/graphile/postgraphile/commit/7147e5093aac7488eb14e5e9a517dfb41b881746))

## [4.5.1](https://github.com/graphile/postgraphile/compare/v4.5.0...v4.5.1) (2019-12-11)

### Bug Fixes

- **deps:** upgrade postgraphile-core ([ff5784a](https://github.com/graphile/postgraphile/commit/ff5784a436ead9412dad9075280d524139c682d3))
- **deps:** upgrade serialize-javascript dep ([c735ea1](https://github.com/graphile/postgraphile/commit/c735ea11fde31c7ef5deb09347f41a9175176358))
- **docker:** add missing files to Dockerfile ([04310e2](https://github.com/graphile/postgraphile/commit/04310e2b1766bd1705e39fef078738298a5444f4))

# [4.5.0](https://github.com/graphile/postgraphile/compare/v4.5.0-rc.4...v4.5.0) (2019-11-22)

# [4.5.0-rc.4](https://github.com/graphile/postgraphile/compare/v4.5.0-rc.3...v4.5.0-rc.4) (2019-11-20)

### Bug Fixes

- **package:** move conventional-changelog-cli to devDependencies ([7d2df1b](https://github.com/graphile/postgraphile/commit/7d2df1bb6e30fdece26c6713d28aa50f89ef024d))

# [4.5.0-rc.3](https://github.com/graphile/postgraphile/compare/v4.5.0-rc.2...v4.5.0-rc.3) (2019-11-20)

### Bug Fixes

- **graphiql:** fix operation detection on multi-op documents ([#1191](https://github.com/graphile/postgraphile/issues/1191)) ([49b2176](https://github.com/graphile/postgraphile/commit/49b2176caf269e85d18cb2ab6f06646dda93f0a4))

# [4.5.0-rc.2](https://github.com/graphile/postgraphile/compare/v4.5.0-rc.1...v4.5.0-rc.2) (2019-11-20)

### Bug Fixes

- **graphiql:** solve vertical scrolling issue ([#1188](https://github.com/graphile/postgraphile/issues/1188)) ([b811b9f](https://github.com/graphile/postgraphile/commit/b811b9f16354898d390de8eeb021bc7c2b58ba6a))

### Features

- **tags:** file watching plugin for library users ([#1190](https://github.com/graphile/postgraphile/issues/1190)) ([8d36997](https://github.com/graphile/postgraphile/commit/8d36997b21df225b8f678b5f335c6eaf56718ac5))

# [4.5.0-rc.1](https://github.com/graphile/postgraphile/compare/v4.5.0-rc.0...v4.5.0-rc.1) (2019-11-13)

# [4.5.0-rc.0](https://github.com/graphile/postgraphile/compare/v4.4.5-alpha.0...v4.5.0-rc.0) (2019-11-12)

### Bug Fixes

- **cli:** abort if given unused arguments ([#1181](https://github.com/graphile/postgraphile/issues/1181)) ([3e7381d](https://github.com/graphile/postgraphile/commit/3e7381d5c3431aae673daffe2362e85cc5e0a37d))
- **export:** only write schema if it differs ([#1180](https://github.com/graphile/postgraphile/issues/1180)) ([6334897](https://github.com/graphile/postgraphile/commit/6334897256dc9649a0340a07c561b99da9b11f82))

### Features

- **graphiql:** add 'explain' button ([#1179](https://github.com/graphile/postgraphile/issues/1179)) ([1a065ab](https://github.com/graphile/postgraphile/commit/1a065ab228dc9da273e7ee440d45a6c6da5c01bc))
- **jwt:** support lazy public key loading for verification ([#1167](https://github.com/graphile/postgraphile/issues/1167)) ([d27aaf9](https://github.com/graphile/postgraphile/commit/d27aaf965261ce75456d188b882b6bd86147815e))

## [4.4.5-alpha.0](https://github.com/graphile/postgraphile/compare/v4.4.4...v4.4.5-alpha.0) (2019-11-08)

### Features

- **jwt:** add asymmetric JWT signing and verifying support ([#1089](https://github.com/graphile/postgraphile/issues/1089)) ([b4730b7](https://github.com/graphile/postgraphile/commit/b4730b78a815aed15fba3425cb1934c54a33359f))
- **postgraphiql:** save headers to localStorage ([#1174](https://github.com/graphile/postgraphile/issues/1174)) ([37abcd3](https://github.com/graphile/postgraphile/commit/37abcd387e6276e2df449ce2e4745c133b96995c))
- **tags:** upgrade engine & `postgraphile.tags.json5` support ([#1177](https://github.com/graphile/postgraphile/issues/1177)) ([7da3c7f](https://github.com/graphile/postgraphile/commit/7da3c7fe70a076936d3386c309cab307df1b4e14)), closes [graphile/graphile-engine#529](https://github.com/graphile/graphile-engine/issues/529)

## [4.4.4](https://github.com/graphile/postgraphile/compare/v4.4.3...v4.4.4) (2019-09-24)

### Bug Fixes

- **deps:** upgrade postgraphile-core ([#1156](https://github.com/graphile/postgraphile/issues/1156)) ([d032df8](https://github.com/graphile/postgraphile/commit/d032df8432d9ae3b25597dd8b1195222f7dd2bc6))
- make sure x-graphql-event-stream url is domain relative ([#1148](https://github.com/graphile/postgraphile/issues/1148)) ([c1b8ca7](https://github.com/graphile/postgraphile/commit/c1b8ca797e5785d9b3b1e8bc393e888b481614b6)), closes [#1143](https://github.com/graphile/postgraphile/issues/1143)

## [4.4.3](https://github.com/graphile/postgraphile/compare/v4.4.2...v4.4.3) (2019-08-09)

### Bug Fixes

- **deps:** upgrade postgraphile-core ([#1133](https://github.com/graphile/postgraphile/issues/1133)) ([610fe88](https://github.com/graphile/postgraphile/commit/610fe885a64aa3d12668d8f0c58521a185a6ea0c))

## [4.4.2](https://github.com/graphile/postgraphile/compare/v4.4.1...v4.4.2) (2019-08-07)

### Bug Fixes

- **docs:** clarify jwtRole is JSON path components ([#1129](https://github.com/graphile/postgraphile/issues/1129)) ([d6c5a78](https://github.com/graphile/postgraphile/commit/d6c5a78c978a5094ac692dd612656572da8b67c4))

### Features

- **deps:** upgrade graphiql-explorer ([#1132](https://github.com/graphile/postgraphile/issues/1132)) ([ea7b49b](https://github.com/graphile/postgraphile/commit/ea7b49bc56e829c6910a86552b97451153f33da0))
- **deps:** upgrade postgraphile-core ([#1111](https://github.com/graphile/postgraphile/issues/1111)) ([241b783](https://github.com/graphile/postgraphile/commit/241b783e9560ca980135782778b318496fe64ed8))
- **deps:** upgrade postgraphile-core ([#1131](https://github.com/graphile/postgraphile/issues/1131)) ([881fa45](https://github.com/graphile/postgraphile/commit/881fa450da39342408c93bd9bb7c34aa2c69c3a4))

## [4.4.1](https://github.com/graphile/postgraphile/compare/v4.4.1-rc.0...v4.4.1) (2019-06-23)

### Features

- **cli:** accept PGHOSTADDR if PGHOST is not present ([#1096](https://github.com/graphile/postgraphile/issues/1096)) ([b72f1ef](https://github.com/graphile/postgraphile/commit/b72f1ef7740127bc279629e13d3ed105d5fbaa9a))
- **deps:** upgrade postgraphile ([#1103](https://github.com/graphile/postgraphile/issues/1103)) ([616bc5b](https://github.com/graphile/postgraphile/commit/616bc5bc4b2fc24b94f67926e4ea73146e346c27))

## [4.4.1-rc.0](https://github.com/graphile/postgraphile/compare/v4.4.0...v4.4.1-rc.0) (2019-05-24)

### Bug Fixes

- **postgraphile:** use externalUrlBase for websockets ([#1070](https://github.com/graphile/postgraphile/issues/1070)) ([e3d7d19](https://github.com/graphile/postgraphile/commit/e3d7d1977462a07ce9590a8012e87e21d8ddc247))

### Features

- **docker:** update Dockerfile to build fresh rather than install from npm ([#1078](https://github.com/graphile/postgraphile/issues/1078)) ([9aa3799](https://github.com/graphile/postgraphile/commit/9aa37999f123d749c53e3f66b558ca9d65381c48))
- **perf:** performance enhancements ([#1077](https://github.com/graphile/postgraphile/issues/1077)) ([d237417](https://github.com/graphile/postgraphile/commit/d2374174adfb363c20fc068aea255ad45bbbe708))

# [4.4.0](https://github.com/graphile/postgraphile/compare/v4.4.0-rc.1...v4.4.0) (2019-05-03)

# [4.4.0-rc.1](https://github.com/graphile/postgraphile/compare/v4.4.0-rc.0...v4.4.0-rc.1) (2019-04-29)

### Bug Fixes

- **type:** fix type of handleErrors' req parameter ([#1061](https://github.com/graphile/postgraphile/issues/1061)) ([a3c3df8](https://github.com/graphile/postgraphile/commit/a3c3df8ec3513d7d95aeefe41792d90804cc2176))

### Features

- **deps:** upgrade postgraphile-core ([899c1e5](https://github.com/graphile/postgraphile/commit/899c1e511596b7ca76fc18e27f6055afe4ce5739))
- **server:** option to not exit when initial schema build fails ([#1062](https://github.com/graphile/postgraphile/issues/1062)) ([3bcc7e2](https://github.com/graphile/postgraphile/commit/3bcc7e2082857735fd540b4b16e0ca3519c5f1c4))

# [4.4.0-rc.0](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.13...v4.4.0-rc.0) (2019-04-23)

### Features

- **deps:** upgrade postgraphile-core ([097d301](https://github.com/graphile/postgraphile/commit/097d30107f314d1b9d247dfb6414b0bff83c196d))

# [4.4.0-beta.13](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.12...v4.4.0-beta.13) (2019-04-18)

### Features

- **deps:** upgrade postgraphile-core ([#1056](https://github.com/graphile/postgraphile/issues/1056)) ([4d96696](https://github.com/graphile/postgraphile/commit/4d9669697d999a568b0353aa1dcea5c8a999b3f9))

# [4.4.0-beta.12](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.11...v4.4.0-beta.12) (2019-04-17)

### Features

- **deps:** upgrade postgraphile-core ([#1052](https://github.com/graphile/postgraphile/issues/1052)) ([71fd6d2](https://github.com/graphile/postgraphile/commit/71fd6d2694e3c1354377304809f19a84eec99c10))

# [4.4.0-beta.11](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.10...v4.4.0-beta.11) (2019-04-15)

### Features

- **deps:** upgrade postgraphile-core ([2c9ce3e](https://github.com/graphile/postgraphile/commit/2c9ce3e21ebb4e2211e8fea031411bbbce0cf83d))

# [4.4.0-beta.10](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.9...v4.4.0-beta.10) (2019-04-14)

### Bug Fixes

- **resilience:** don't exit on initial schema build fail ([#1044](https://github.com/graphile/postgraphile/issues/1044)) ([cfdfc1e](https://github.com/graphile/postgraphile/commit/cfdfc1e4e6ff197cbce0ad06c28458c4641bc9b1)), closes [#1041](https://github.com/graphile/postgraphile/issues/1041) [#1042](https://github.com/graphile/postgraphile/issues/1042)
- **ts:** make 'export \*' explicit; type PostGraphileOptions ([#1043](https://github.com/graphile/postgraphile/issues/1043)) ([f477f5e](https://github.com/graphile/postgraphile/commit/f477f5e75cc80154227fb7d522bf0025d6975f21))
- **ts:** PostGraphileOptions extends PostGraphileCoreOptions ([#1047](https://github.com/graphile/postgraphile/issues/1047)) ([89999b0](https://github.com/graphile/postgraphile/commit/89999b0b26422218b3191e08afdbfc1a5f67292e))

### Features

- **deps:** upgrade postgraphile-core ([#1048](https://github.com/graphile/postgraphile/issues/1048)) ([a485385](https://github.com/graphile/postgraphile/commit/a485385946eaabf45753aa64c426070d91fc99cc))
- **export:** option to lexicographically sort exported schema ([#1046](https://github.com/graphile/postgraphile/issues/1046)) ([ae3bd74](https://github.com/graphile/postgraphile/commit/ae3bd74d2165e001e3431ece6b002d7be9eb38c3)), closes [#1039](https://github.com/graphile/postgraphile/issues/1039)

# [4.4.0-beta.9](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.8...v4.4.0-beta.9) (2019-04-04)

### Bug Fixes

- **deps:** upgrade GraphiQL ([#1038](https://github.com/graphile/postgraphile/issues/1038)) ([526f9c3](https://github.com/graphile/postgraphile/commit/526f9c3ad24bb097f5fbf7faeb883b9d2ea17800)), closes [#1029](https://github.com/graphile/postgraphile/issues/1029)
- **live:** solve race conditions ([#1037](https://github.com/graphile/postgraphile/issues/1037)) ([4e202e8](https://github.com/graphile/postgraphile/commit/4e202e8b7ecf0d8622a7af1f668214e68aeda2c6))
- **types:** jwtRole is optional ([#1031](https://github.com/graphile/postgraphile/issues/1031)) ([d8c3d0a](https://github.com/graphile/postgraphile/commit/d8c3d0a76b35bb21c1a74aa277258c9f72eded05))

# [4.4.0-beta.8](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.7...v4.4.0-beta.8) (2019-03-25)

### Bug Fixes

- **deps:** upgrade postgraphile-core ([#1023](https://github.com/graphile/postgraphile/issues/1023)) ([fa67a37](https://github.com/graphile/postgraphile/commit/fa67a37794c3fb1a4e3f69abf15cb5961d0911a1))

# [4.4.0-beta.7](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.6...v4.4.0-beta.7) (2019-03-22)

### Features

- **deps:** upgrade postgraphile-core ([#1021](https://github.com/graphile/postgraphile/issues/1021)) ([2f8c06c](https://github.com/graphile/postgraphile/commit/2f8c06c3d56c925d7bd291a3fe5050c1aac06b3e))

# [4.4.0-beta.6](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.5...v4.4.0-beta.6) (2019-03-18)

### Bug Fixes

- **deps:** fix makeExtendSchemaPlugin [@pg](https://github.com/pg)Query directive ([dc6819a](https://github.com/graphile/postgraphile/commit/dc6819a183474c0f9af02b21321acbada676da58))

# [4.4.0-beta.5](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.4...v4.4.0-beta.5) (2019-03-15)

### Features

- **deps:** upgrade postgraphile-core ([277d1ca](https://github.com/graphile/postgraphile/commit/277d1ca99c32768045f827cbf00de77a04603597))

# [4.4.0-beta.4](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.3...v4.4.0-beta.4) (2019-03-12)

### Features

- **deps:** upgrade postgraphile-core ([600ebcf](https://github.com/graphile/postgraphile/commit/600ebcf86f51fad1c16d877eddb85f82dc3fa1ba))
- **ws:** add default 15s keepalive ([a066ffd](https://github.com/graphile/postgraphile/commit/a066ffdd35257de51e6e54a48031e4ca00bdf051))

# [4.4.0-beta.3](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.2...v4.4.0-beta.3) (2019-03-08)

### Features

- **deps:** upgrade postgraphile-core ([4c9c883](https://github.com/graphile/postgraphile/commit/4c9c8830a7d01aff67eb01926b0213fc588c380c))

# [4.4.0-beta.2](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.1...v4.4.0-beta.2) (2019-03-07)

### Bug Fixes

- **errors:** send error through correct branch ([acf6dfb](https://github.com/graphile/postgraphile/commit/acf6dfbdb6dd0bd9cbff6575a69cb6d24888753d))

### Features

- **deps:** upgrade postgraphile-core ([b65ab2f](https://github.com/graphile/postgraphile/commit/b65ab2f34fec9b93f4d079204a5ea557ebb72d34))
- **jwt:** add support for buffer as JWT secret ([#1015](https://github.com/graphile/postgraphile/issues/1015)) ([eacc294](https://github.com/graphile/postgraphile/commit/eacc29496931b4e9159a290c46d1e1d2cea17b25))

# [4.4.0-beta.1](https://github.com/graphile/postgraphile/compare/v4.4.0-beta.0...v4.4.0-beta.1) (2019-02-28)

### Features

- **deps:** upgrade postgraphile-core ([120ae45](https://github.com/graphile/postgraphile/commit/120ae45a8763a5ec82ddc1ad3c6557c4eac79f2c))

# [4.4.0-beta.0](https://github.com/graphile/postgraphile/compare/v4.4.0-alpha.0...v4.4.0-beta.0) (2019-02-28)

### Bug Fixes

- **logs:** fix timing information ([#999](https://github.com/graphile/postgraphile/issues/999)) ([1326f89](https://github.com/graphile/postgraphile/commit/1326f896cda4d2134a1246d765bf63d2dfa8fd36))

### Features

- **deps:** upgrade postgraphile-core ([8e6ab02](https://github.com/graphile/postgraphile/commit/8e6ab02e27e8e2deb06143253c14daed6a838f1c))
- **http:** Access-Control-Expose-Headers: X-GraphQL-Event-Stream ([#1002](https://github.com/graphile/postgraphile/issues/1002)) ([eee8985](https://github.com/graphile/postgraphile/commit/eee8985082795f8c715c75fe40da81b68849be11))
- **http2:** basic HTTP2 support for event-stream ([#1009](https://github.com/graphile/postgraphile/issues/1009)) ([3ebea16](https://github.com/graphile/postgraphile/commit/3ebea166b2099b1d731e50b1f225d7c2f25d8abc))

# [4.4.0-alpha.0](https://github.com/graphile/postgraphile/compare/v4.3.4-rc.0...v4.4.0-alpha.0) (2019-02-21)

### Bug Fixes

- **postgraphile:** check pgConfig constructor's function in case of uglify ([#992](https://github.com/graphile/postgraphile/issues/992)) ([419280d](https://github.com/graphile/postgraphile/commit/419280d6afc7d12813a461350aaf11561b273eb3))

### Features

- **graphql:** subscriptions and live queries enhancements ([#998](https://github.com/graphile/postgraphile/issues/998)) ([1719cbf](https://github.com/graphile/postgraphile/commit/1719cbfef041e59536482ed20551d593fb82f78e))

## [4.3.4-rc.0](https://github.com/graphile/postgraphile/compare/v4.3.3...v4.3.4-rc.0) (2019-02-07)

### Features

- **server:** websockets support ([#986](https://github.com/graphile/postgraphile/issues/986)) ([ede614c](https://github.com/graphile/postgraphile/commit/ede614c5eeb11556dea6f079b98e4f53e5a92439))

## [4.3.3](https://github.com/graphile/postgraphile/compare/v4.3.2...v4.3.3) (2019-02-05)

### Bug Fixes

- **debug:** be more careful when monkey-patching ([#987](https://github.com/graphile/postgraphile/issues/987)) ([c47f4be](https://github.com/graphile/postgraphile/commit/c47f4becd303536dedb51cf16873f0834cb13db0))
- **dev:** change shebang from /bin/bash to /usr/bin/env bash ([#983](https://github.com/graphile/postgraphile/issues/983)) ([577c1e6](https://github.com/graphile/postgraphile/commit/577c1e6df08ebe47e8880665ce99580cf7d375a7))

## [4.3.2](https://github.com/graphile/postgraphile/compare/v4.3.1...v4.3.2) (2019-01-30)

### Bug Fixes

- release pg-pool connection regardless of whether commit throws ([#978](https://github.com/graphile/postgraphile/issues/978)) ([ef4e017](https://github.com/graphile/postgraphile/commit/ef4e017aac9b2d522194a871c000dc274bed9d3a))

### Features

- **graphiql:** add GraphiQL Explorer to enhanced GraphiQL ([#981](https://github.com/graphile/postgraphile/issues/981)) ([e63fd76](https://github.com/graphile/postgraphile/commit/e63fd76ea9231075e5b210744d3296a39ee64336))

## [4.3.1](https://github.com/graphile/postgraphile/compare/v4.3.0...v4.3.1) (2019-01-24)

### Features

- **deps:** upgrade postgraphile-core ([#975](https://github.com/graphile/postgraphile/issues/975)) ([5afc56c](https://github.com/graphile/postgraphile/commit/5afc56c78262a3d81ae4c2a82dab0fc48a2037d7))
- **hooks:** add hooks for HTTP results and GraphiQL HTML ([#970](https://github.com/graphile/postgraphile/issues/970)) ([244c1cb](https://github.com/graphile/postgraphile/commit/244c1cbd8346fc5ee8813efa68e65a5897da36ed)), closes [#962](https://github.com/graphile/postgraphile/issues/962) [#969](https://github.com/graphile/postgraphile/issues/969)

# [4.3.0](https://github.com/graphile/postgraphile/compare/v4.2.0...v4.3.0) (2019-01-17)

### Bug Fixes

- **README:** Fix link to Postgres Schema Design ([#955](https://github.com/graphile/postgraphile/issues/955)) ([774e91b](https://github.com/graphile/postgraphile/commit/774e91b6ab8946e4968e00157cc5e7305fd2223f))
- **server:** throw when encountering `undefined` positional arguments ([#958](https://github.com/graphile/postgraphile/issues/958)) ([21d47c9](https://github.com/graphile/postgraphile/commit/21d47c9a5023de41d6a61695394cea2fbf850ae7)), closes [#951](https://github.com/graphile/postgraphile/issues/951)

### Features

- **deps:** upgrade postgraphile-core ([#961](https://github.com/graphile/postgraphile/issues/961)) ([d8c529c](https://github.com/graphile/postgraphile/commit/d8c529ca7b31d4a8d80a82b6f823208f95feab5a))

# [4.2.0](https://github.com/graphile/postgraphile/compare/v4.1.0...v4.2.0) (2018-12-19)

### Features

- **deps:** upgrade postgraphile-core ([#943](https://github.com/graphile/postgraphile/issues/943)) ([f97afb3](https://github.com/graphile/postgraphile/commit/f97afb3a55161be4b35de88fc9f78d6ed01f419b))

# [4.1.0](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.5...v4.1.0) (2018-12-06)

### Features

- **deps:** upgrade postgraphile-core ([817302d](https://github.com/graphile/postgraphile/commit/817302d0751309dc73f9687eb03ac2151c7bcf8d))

# [4.1.0-rc.5](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.4...v4.1.0-rc.5) (2018-12-03)

### Bug Fixes

- **deps:** upgrade postgraphile-core ([#936](https://github.com/graphile/postgraphile/issues/936)) ([54f81c0](https://github.com/graphile/postgraphile/commit/54f81c016275ba60faa34e32978e1caaed6bf069))

# [4.1.0-rc.4](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.3...v4.1.0-rc.4) (2018-12-02)

### Bug Fixes

- **types:** add missing hook types ([#932](https://github.com/graphile/postgraphile/issues/932)) ([102b786](https://github.com/graphile/postgraphile/commit/102b78655f73cbb2c1f4d16f1b26f8ec380ba381))
- **types:** missing question-mark ([#931](https://github.com/graphile/postgraphile/issues/931)) ([12ed988](https://github.com/graphile/postgraphile/commit/12ed988dc6d231a228dbd3229e2e21eb5299028f))

### Features

- **deps:** upgrade postgraphile-core ([#935](https://github.com/graphile/postgraphile/issues/935)) ([676b352](https://github.com/graphile/postgraphile/commit/676b3525522c5025a31158e7364d90fe06ef0011))

# [4.1.0-rc.3](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.2...v4.1.0-rc.3) (2018-11-24)

### Bug Fixes

- **cli:** add sponsors.json to bundled files ([d66537f](https://github.com/graphile/postgraphile/commit/d66537febb6a16d122e8bb272251f12285da5922))

# [4.1.0-rc.2](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.1...v4.1.0-rc.2) (2018-11-23)

### Bug Fixes

- **deps:** move css-loader to depDependencies ([#909](https://github.com/graphile/postgraphile/issues/909)) ([0244c1e](https://github.com/graphile/postgraphile/commit/0244c1e0b653718bef3923f8a711ef66f1e22e5f))
- **docs:** add `nullif` to current_user function ([#911](https://github.com/graphile/postgraphile/issues/911)) ([3f6c66c](https://github.com/graphile/postgraphile/commit/3f6c66c733d9e9004f3345930fd8cf71a8f6ff06))
- **examples:** typo ([#907](https://github.com/graphile/postgraphile/issues/907)) ([e5816d5](https://github.com/graphile/postgraphile/commit/e5816d51e4e423a05682b9aec43d2eaed6e23371))
- **graphiql:** solve favoriting issue ([#922](https://github.com/graphile/postgraphile/issues/922)) ([7fa5ba7](https://github.com/graphile/postgraphile/commit/7fa5ba763567f86ead62957f79abd5dd5ef440a3))
- **graphql:** respect GraphQL working draft changes to errors ([#923](https://github.com/graphile/postgraphile/issues/923)) ([442d2b7](https://github.com/graphile/postgraphile/commit/442d2b70b8fcf4f0d6c1061a35fe4b9ad2f34793)), closes [#896](https://github.com/graphile/postgraphile/issues/896)
- **ignoreIndexes:** add to interfaces ([#918](https://github.com/graphile/postgraphile/issues/918)) ([f3610d2](https://github.com/graphile/postgraphile/commit/f3610d2288ac85148cd651069633907c8b2b5dba))
- **README:** restore image size ([83249b5](https://github.com/graphile/postgraphile/commit/83249b5dd988a60794629f80b05bc48ceeeb7214))
- **tests:** add missing `await` after premature merge ([#925](https://github.com/graphile/postgraphile/issues/925)) ([a1d1402](https://github.com/graphile/postgraphile/commit/a1d1402b13f0a3fe5eaa594fe114e161912bef7f))

### Features

- **deps:** upgrade postgraphile-core ([#926](https://github.com/graphile/postgraphile/issues/926)) ([41802d5](https://github.com/graphile/postgraphile/commit/41802d55dd9e6508726a24e84549ea5d35208f31))
- **graphiql:** add basic protection against clickjacking ([#920](https://github.com/graphile/postgraphile/issues/920)) ([4f28fa1](https://github.com/graphile/postgraphile/commit/4f28fa1c99735b11f289afce59556a68f7141acf))
- **http:** add externalUrlBase setting ([#919](https://github.com/graphile/postgraphile/issues/919)) ([9545c8b](https://github.com/graphile/postgraphile/commit/9545c8bc91be810b2e4604a7ab01eca31b332943))
- **http:** add tests for fastify server ([#924](https://github.com/graphile/postgraphile/issues/924)) ([9e28161](https://github.com/graphile/postgraphile/commit/9e28161e0e51598e328126e63de4ad7bd087f3b3))
- **sponsors:** feature a random sponsor ❤️ ([#904](https://github.com/graphile/postgraphile/issues/904)) ([ec02c78](https://github.com/graphile/postgraphile/commit/ec02c78be01fb541eefb97f93d3e2c992db9d3a2))

# [4.1.0-rc.1](https://github.com/graphile/postgraphile/compare/v4.1.0-rc.0...v4.1.0-rc.1) (2018-11-02)

### Bug Fixes

- **cli:** format 'Get started' ([#895](https://github.com/graphile/postgraphile/issues/895)) ([a23aaed](https://github.com/graphile/postgraphile/commit/a23aaede71caf49e7888d91e6788c5a4ebdd42e1))
- **http:** absolute route parsing is now opt-in ([#899](https://github.com/graphile/postgraphile/issues/899)) ([b3e61ea](https://github.com/graphile/postgraphile/commit/b3e61ea99d1a73ae02bcbe054afbbd5f066ca3d6))

# [4.1.0-rc.0](https://github.com/graphile/postgraphile/compare/v4.1.0-alpha.1...v4.1.0-rc.0) (2018-10-31)

### Bug Fixes

- img tags in README.md ([#888](https://github.com/graphile/postgraphile/issues/888)) ([bfffc9d](https://github.com/graphile/postgraphile/commit/bfffc9da60566a6605cb3c3a8691caa9ea9351df)), closes [#886](https://github.com/graphile/postgraphile/issues/886)

### Features

- **favicon:** use PostGraphile favicon ([#889](https://github.com/graphile/postgraphile/issues/889)) ([6c349c2](https://github.com/graphile/postgraphile/commit/6c349c279625f863854786db704bd657d73ec54a))
- **graphiql:** GraphiQL customize headers; graphql@14.x support ([#892](https://github.com/graphile/postgraphile/issues/892)) ([84f00be](https://github.com/graphile/postgraphile/commit/84f00be4a67eb69a5ae26814883dda8cf35e360e))
- **graphiql:** minor tweaks ([#893](https://github.com/graphile/postgraphile/issues/893)) ([9cc5526](https://github.com/graphile/postgraphile/commit/9cc55264d9d5982373f99894edc119657db37ee6))
- **http:** support mounting on subroutes ([#894](https://github.com/graphile/postgraphile/issues/894)) ([2026477](https://github.com/graphile/postgraphile/commit/20264778a7288eb2165555d0df2af3a2b88edc44))

# [4.1.0-alpha.1](https://github.com/graphile/postgraphile/compare/v4.1.0-alpha.0...v4.1.0-alpha.1) (2018-10-25)

### Bug Fixes

- **examples:** typo corrected ([#880](https://github.com/graphile/postgraphile/issues/880)) ([d901010](https://github.com/graphile/postgraphile/commit/d901010343ea2ab51a0f5a196f82b2443408965c))

### Features

- --no-ignore-indexes; IN/OUT/INOUT/RETURNS TABLE functions; performance ([#884](https://github.com/graphile/postgraphile/issues/884)) ([c70667f](https://github.com/graphile/postgraphile/commit/c70667f975b47cf312f6309b6c920cad55b273fd))

# [4.1.0-alpha.0](https://github.com/graphile/postgraphile/compare/v4.0.1...v4.1.0-alpha.0) (2018-10-15)

### Features

- upgrade postgraphile-core ([3e12708](https://github.com/graphile/postgraphile/commit/3e127086f457db9d46be139e624478095288270c))
- **errors:** improve server-side message when JWT expired ([#879](https://github.com/graphile/postgraphile/issues/879)) ([400af56](https://github.com/graphile/postgraphile/commit/400af5632b96dcca1a1a4d33dfd7b43fe31eceb5))

## [4.0.1](https://github.com/graphile/postgraphile/compare/v4.0.0...v4.0.1) (2018-10-08)

### Features

- **deps:** Upgrade postgraphile-core ([#871](https://github.com/graphile/postgraphile/issues/871)) ([52d90c7](https://github.com/graphile/postgraphile/commit/52d90c74445c3fb7fc610b13ce94c94a952bc4fc))
- **errors:** notice logging, error enhancements ([#866](https://github.com/graphile/postgraphile/issues/866)) ([9f78cd0](https://github.com/graphile/postgraphile/commit/9f78cd0d3249386e166495b15cfede87b493765a))

# [4.0.0](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.5.1...v4.0.0) (2018-10-02)

# [4.0.0-rc.5.1](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.5...v4.0.0-rc.5.1) (2018-09-22)

### Bug Fixes

- **hooks:** ensure hooked options passed to createPostGraphileHttpRequestHandler ([#856](https://github.com/graphile/postgraphile/issues/856)) ([5fc6da1](https://github.com/graphile/postgraphile/commit/5fc6da1793eaa35d73c6210277b04abef2f16478))

### Features

- **deps:** upgrade postgraphile-core ([#862](https://github.com/graphile/postgraphile/issues/862)) ([c66a474](https://github.com/graphile/postgraphile/commit/c66a474dea93182c1652ac551f75ce3d753d9c76))

# [4.0.0-rc.5](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.4...v4.0.0-rc.5) (2018-09-13)

### Bug Fixes

- **cache:** estimate memory usage more accurately ([#852](https://github.com/graphile/postgraphile/issues/852)) ([cc3c7d9](https://github.com/graphile/postgraphile/commit/cc3c7d95b3a567aa58e32e1ff9485a6caf37569d))
- **CLI:** disabling JWT audience verification now possible ([#848](https://github.com/graphile/postgraphile/issues/848)) ([eb2b529](https://github.com/graphile/postgraphile/commit/eb2b52964c445244af79f5ff2b755c61aa70b593))

### Features

- upgrade postgraphile-core ([#855](https://github.com/graphile/postgraphile/issues/855)) ([db017b5](https://github.com/graphile/postgraphile/commit/db017b5007db91265748a0dc003f6dde7ac18dff))
- **cli:** add --skip-plugins option ([#853](https://github.com/graphile/postgraphile/issues/853)) ([e75cbd7](https://github.com/graphile/postgraphile/commit/e75cbd713d4e9dc8d57c575a29ff25b1894a62c2))
- **deps:** upgrade postgraphile-core for better errors ([464ecd0](https://github.com/graphile/postgraphile/commit/464ecd09db35a33d1032bc495505c7dc96a2fa55))

# [4.0.0-rc.4](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.3.4...v4.0.0-rc.4) (2018-08-24)

# [4.0.0-rc.3.4](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.3.3...v4.0.0-rc.3.4) (2018-08-24)

### Features

- **types:** export more things from postgraphile-core directly ([#843](https://github.com/graphile/postgraphile/issues/843)) ([d79589f](https://github.com/graphile/postgraphile/commit/d79589f68a05882218cd942ada58ac988c45567f))

# [4.0.0-rc.3.3](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.3.2...v4.0.0-rc.3.3) (2018-08-24)

### Bug Fixes

- **deps:** support GraphQL 0.13.x ([#842](https://github.com/graphile/postgraphile/issues/842)) ([bacd394](https://github.com/graphile/postgraphile/commit/bacd394c1799645a9ea21a4b304a5b255a112dcd))

# [4.0.0-rc.3.2](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.3.1...v4.0.0-rc.3.2) (2018-08-23)

### Bug Fixes

- **types:** export interfaces ([#841](https://github.com/graphile/postgraphile/issues/841)) ([d64ec06](https://github.com/graphile/postgraphile/commit/d64ec06744bc629ab8ec397675670afaa6f20139))

# [4.0.0-rc.3.1](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.3...v4.0.0-rc.3.1) (2018-08-22)

### Bug Fixes

- **bodySizeLimit:** Extend body size limit to other parsers ([#832](https://github.com/graphile/postgraphile/issues/832)) ([90335c9](https://github.com/graphile/postgraphile/commit/90335c97dfb5b6ba0b0a295b2292002ef373f3da))
- **cors:** fix allowed methods header, allow X-Apollo-Tracing ([#838](https://github.com/graphile/postgraphile/issues/838)) ([7d605a5](https://github.com/graphile/postgraphile/commit/7d605a501a1a2c26724ef13e86aa2fb6adfd0538))
- **dev:** remove '--ignore' flag from ts-node ([6e5d9ac](https://github.com/graphile/postgraphile/commit/6e5d9ac3873e3847f1c5ae2b5953cb3bcffee51a))

### Features

- **deps:** upgrade pg-sql2 and postgraphile-core ([#839](https://github.com/graphile/postgraphile/issues/839)) ([4507b3d](https://github.com/graphile/postgraphile/commit/4507b3d57a550474a718807f4efb46e162986644))
- **jwt:** include JWT claims in withPostGraphileContext callback ([#829](https://github.com/graphile/postgraphile/issues/829)) ([1b330f3](https://github.com/graphile/postgraphile/commit/1b330f36b0178a6f409e2c2e15319c391e60d6f4))

# [4.0.0-rc.3](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2018-07-25)

### Bug Fixes

- **rc:** don't swallow errors in postgraphilerc ([#811](https://github.com/graphile/postgraphile/issues/811)) ([dc9445c](https://github.com/graphile/postgraphile/commit/dc9445c1d14b3414719de45a5898a1442d845cc1))

### Features

- **cli:** add server timeout configuration [#623](https://github.com/graphile/postgraphile/issues/623) ([#741](https://github.com/graphile/postgraphile/issues/741)) ([5f48a08](https://github.com/graphile/postgraphile/commit/5f48a083a5041c67ffef1acc804c3c8056ac3126))
- **cli:** improve greeting message ([#816](https://github.com/graphile/postgraphile/issues/816)) ([17f741f](https://github.com/graphile/postgraphile/commit/17f741f65d1330079f748d2edd6201bf03e3558c))
- **hooks:** enable enhancing PostGraphile middleware via hook ([#814](https://github.com/graphile/postgraphile/issues/814)) ([fc82472](https://github.com/graphile/postgraphile/commit/fc824725fe014278fbc6f99dea44ecef6615ebd7))
- **types:** ship automatic TypeScript typings ([#794](https://github.com/graphile/postgraphile/issues/794)) ([89b0900](https://github.com/graphile/postgraphile/commit/89b09009f73aa312fdf4526ee49b31b380f146e6))

# [4.0.0-rc.2](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.1.4...v4.0.0-rc.2) (2018-07-14)

### Bug Fixes

- ignore RBAC by default, tweak CLI & library documentation ([#798](https://github.com/graphile/postgraphile/issues/798)) ([61faf73](https://github.com/graphile/postgraphile/commit/61faf73f458b546d0ac683cf48c1ffd65d459b5d))

# [4.0.0-rc.1.4](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.1.3...v4.0.0-rc.1.4) (2018-06-30)

### Bug Fixes

- **deps:** upgrade postgraphile-core to handle rbac edge-cases ([49bb6dd](https://github.com/graphile/postgraphile/commit/49bb6dd89dcd02815c2df8e09acd27cfdad1008f))
- **koa:** disable koa-compress when using send ([#789](https://github.com/graphile/postgraphile/issues/789)) ([bb851da](https://github.com/graphile/postgraphile/commit/bb851da999e0c546e827fe2f4626172f1fce0a4e))

# [4.0.0-rc.1.3](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.1.2...v4.0.0-rc.1.3) (2018-06-25)

### Bug Fixes

- **koa:** don't compress server-sent events stream ([e2fcfe2](https://github.com/graphile/postgraphile/commit/e2fcfe2387d547566b1a7ccc090a4254d41348f9))

# [4.0.0-rc.1.2](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.1.1...v4.0.0-rc.1.2) (2018-06-25)

### Bug Fixes

- **dev:** don't open browser from dev script ([9e4effa](https://github.com/graphile/postgraphile/commit/9e4effaabc6fb3c82ad621e56b02297907877cae))
- **jwt:** solve audience verification issues ([#785](https://github.com/graphile/postgraphile/issues/785)) ([d12a8be](https://github.com/graphile/postgraphile/commit/d12a8bebfbadead2b1b2b4131140ab4b84cda2d6))

### Features

- **deps:** upgrade postgraphile-core ([#786](https://github.com/graphile/postgraphile/issues/786)) ([aea0add](https://github.com/graphile/postgraphile/commit/aea0adde4b87934fece8ce360fd89050db06790b))
- **graphiql:** auto-reinspect on reconnect (and better hot-load support) ([#787](https://github.com/graphile/postgraphile/issues/787)) ([bd27e57](https://github.com/graphile/postgraphile/commit/bd27e575249aad00a9238f92222b6e7b98bc6f42))

# [4.0.0-rc.1.1](https://github.com/graphile/postgraphile/compare/v4.0.0-rc.1...v4.0.0-rc.1.1) (2018-06-22)

### Bug Fixes

- **jwt:** allow booleans in JWTs again ([#783](https://github.com/graphile/postgraphile/issues/783)) ([e3bf765](https://github.com/graphile/postgraphile/commit/e3bf765e24255261278689e2402017ad3fd83c12)), closes [#775](https://github.com/graphile/postgraphile/issues/775)
- **koa:** don't hang when body is already parsed ([#780](https://github.com/graphile/postgraphile/issues/780)) ([3463742](https://github.com/graphile/postgraphile/commit/34637424929bb3cc5a3d3f40b939abd8744f1d99)), closes [#602](https://github.com/graphile/postgraphile/issues/602)
- **koa:** let Koa finalise the request ([#781](https://github.com/graphile/postgraphile/issues/781)) ([0e52908](https://github.com/graphile/postgraphile/commit/0e529083b1d674116e3356c812d6999d6776183c))
- **koa:** remove res.writeHead & res.send overrides ([#784](https://github.com/graphile/postgraphile/issues/784)) ([c0c3412](https://github.com/graphile/postgraphile/commit/c0c3412c84151586e709ae5ec4a6fc85acafb1d5))
- **koa:** support server-sent events in Koa ([#782](https://github.com/graphile/postgraphile/issues/782)) ([54c47be](https://github.com/graphile/postgraphile/commit/54c47be5e97c7ae392953f30446ccebef51275cb))

# [4.0.0-rc.1](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.10...v4.0.0-rc.1) (2018-06-09)

# [4.0.0-beta.10](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.9...v4.0.0-beta.10) (2018-05-31)

### Features

- **hooks:** add a hook to the request handler ([#770](https://github.com/graphile/postgraphile/issues/770)) ([ade11be](https://github.com/graphile/postgraphile/commit/ade11bea519bfcf57c21f0ae6e04957e07629797))
- simple collections and massive perf gains on small queries ([#766](https://github.com/graphile/postgraphile/issues/766)) ([d8d131e](https://github.com/graphile/postgraphile/commit/d8d131ed0191841456cd41d24d8a4cf86ba3d8d5))

# [4.0.0-beta.9](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.8...v4.0.0-beta.9) (2018-05-15)

# [4.0.0-beta.8](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2018-05-09)

### Bug Fixes

- **docs:** add middlewareOnly flag to watchPg ([#755](https://github.com/graphile/postgraphile/issues/755)) ([89bd596](https://github.com/graphile/postgraphile/commit/89bd59654e69ddfa693f6c59a8a81c419fada918))

# [4.0.0-beta.7](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2018-05-05)

### Bug Fixes

- **docs:** correct typo ([#751](https://github.com/graphile/postgraphile/issues/751)) ([e78e73b](https://github.com/graphile/postgraphile/commit/e78e73b99cf6eaacc8a95efb8a0fc953977d5a7f))

# [4.0.0-beta.6](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2018-05-04)

### Features

- **dev:** improve dev script so it can test --help etc ([64988d1](https://github.com/graphile/postgraphile/commit/64988d17d6184fcbb6272aadb923e5a36e228c5c))
- **middleware:** batched queries support ([#749](https://github.com/graphile/postgraphile/issues/749)) ([5cc82fd](https://github.com/graphile/postgraphile/commit/5cc82fdaaefdaa135e535154842a1bfb54208e21))
- **plugins:** plugins for non-GraphQL parts ([#733](https://github.com/graphile/postgraphile/issues/733)) ([988c936](https://github.com/graphile/postgraphile/commit/988c9364357dc844f05165953e3c02ae36cc92d0))

# [4.0.0-beta.5](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2018-03-29)

### Bug Fixes

- **graphiql:** standardise on 'change' event ([#729](https://github.com/graphile/postgraphile/issues/729)) ([95d36e0](https://github.com/graphile/postgraphile/commit/95d36e06a371cde9cb3ec287f870582894636b58))

# [4.0.0-beta.4](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2018-03-29)

### Features

- **errors:** added handleErrors option ([#723](https://github.com/graphile/postgraphile/issues/723)) ([051dcf7](https://github.com/graphile/postgraphile/commit/051dcf768715f155e3e0b99bd05116684a5bddd2))
- **graphiql:** Set 'X-GraphQL-Event-Stream' header when --watch enabled ([#728](https://github.com/graphile/postgraphile/issues/728)) ([5fd2cf2](https://github.com/graphile/postgraphile/commit/5fd2cf218654e03021ef06ffe8f7556a874906b4))

# [4.0.0-beta.3](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2018-03-14)

### Bug Fixes

- **sql:** remove unnecessary row expansion ([#711](https://github.com/graphile/postgraphile/issues/711)) ([fd43934](https://github.com/graphile/postgraphile/commit/fd43934be81f6de424df5d292968a639c23f2de5))

# [4.0.0-beta.2](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2018-03-10)

### Bug Fixes

- still introspect when `standard_conforming_strings` is off ([1406518](https://github.com/graphile/postgraphile/commit/140651824e0d9ac92ab739a65722890469665df0))

# [4.0.0-beta.1](https://github.com/graphile/postgraphile/compare/v4.0.0-beta.0...v4.0.0-beta.1) (2018-03-08)

# [4.0.0-beta.0](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.33...v4.0.0-beta.0) (2018-03-07)

### Bug Fixes

- sed compatibility OSX/Linux ([8f41002](https://github.com/graphile/postgraphile/commit/8f410024b5999604efe4921f245215126750d05a))
- **cli:** better --legacy-relation validation ([b6a59d9](https://github.com/graphile/postgraphile/commit/b6a59d9b137c670e77b3bf289fcc49128f854615))

### Features

- **errors:** more helpful error if extendedErrors argument is wrong type ([5ab4c94](https://github.com/graphile/postgraphile/commit/5ab4c944fa7b45c2dc10e909365698033ab6b4d8))
- SQL perf++; CLI overhall; CLI opts to use Json/Uuid & reduce nullables ([#697](https://github.com/graphile/postgraphile/issues/697)) ([7a1abfc](https://github.com/graphile/postgraphile/commit/7a1abfc9c5e59b02fd25da9d71b051cd00b501b5))
- **cluster:** introduce cluster feature ([#694](https://github.com/graphile/postgraphile/issues/694)) ([bc64196](https://github.com/graphile/postgraphile/commit/bc64196bb4e4676f7a579de9486db83485ea3c0b))
- **jwt:** expand jwt verification options ([#655](https://github.com/graphile/postgraphile/issues/655)) ([bf635cb](https://github.com/graphile/postgraphile/commit/bf635cb14b6a78110ea4244111fbf8e6d3332556))

# [4.0.0-alpha2.33](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.32...v4.0.0-alpha2.33) (2018-02-19)

# [4.0.0-alpha2.32](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.31...v4.0.0-alpha2.32) (2018-02-19)

### Bug Fixes

- **docs:** Fix pg.Pool import in library.md ([#690](https://github.com/graphile/postgraphile/issues/690)) ([20565b5](https://github.com/graphile/postgraphile/commit/20565b5c003720b23bf1e6b4b76be84b21fa4745))

### Features

- **postgraphql:** support PGUSER and PGPASSWORD environment variables ([#658](https://github.com/graphile/postgraphile/issues/658)) ([acb594e](https://github.com/graphile/postgraphile/commit/acb594e5421f7a146294297d4094e4812780490a))

# [4.0.0-alpha2.31](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.30...v4.0.0-alpha2.31) (2018-02-17)

### Bug Fixes

- **docker:** Fix GraphiQL dependency in dockerfile ([#679](https://github.com/graphile/postgraphile/issues/679)) ([959395e](https://github.com/graphile/postgraphile/commit/959395ebaa6924a262ebbc112a3b62d40510ef41)), closes [#677](https://github.com/graphile/postgraphile/issues/677)
- **docker:** Remove middle layers from docker image ([#680](https://github.com/graphile/postgraphile/issues/680)) ([bf670be](https://github.com/graphile/postgraphile/commit/bf670be75dd26c5f7e0e36a1884a6cba50e0f9b7))

# [4.0.0-alpha2.30](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.29...v4.0.0-alpha2.30) (2018-01-30)

# [4.0.0-alpha2.29](https://github.com/graphile/postgraphile/compare/v3.5.5...v4.0.0-alpha2.29) (2018-01-30)

# [4.0.0-alpha2.28](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.27...v4.0.0-alpha2.28) (2018-01-14)

### Features

- **additionalGraphQLContextFromRequest:** add res to callback ([#652](https://github.com/graphile/postgraphile/issues/652)) ([1fa4310](https://github.com/graphile/postgraphile/commit/1fa4310dae82d1a28636cb0fc6d4f8294729c5a2))

# [4.0.0-alpha2.27](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.26...v4.0.0-alpha2.27) (2017-12-16)

# [4.0.0-alpha2.26](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.25...v4.0.0-alpha2.26) (2017-12-03)

# [4.0.0-alpha2.25](https://github.com/graphile/postgraphile/compare/v3.5.4...v4.0.0-alpha2.25) (2017-11-30)

# [4.0.0-alpha2.24](https://github.com/graphile/postgraphile/compare/v3.5.3...v4.0.0-alpha2.24) (2017-11-29)

# [4.0.0-alpha2.23](https://github.com/graphile/postgraphile/compare/v3.5.2...v4.0.0-alpha2.23) (2017-11-28)

# [4.0.0-alpha2.22](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.21...v4.0.0-alpha2.22) (2017-11-02)

### Features

- **pgSettings:** Only use settings of type string or number ([#589](https://github.com/graphile/postgraphile/issues/589)) ([7a69eb2](https://github.com/graphile/postgraphile/commit/7a69eb25bb93de53abe83373d76eefb05b2799f2))

# [4.0.0-alpha2.21](https://github.com/graphile/postgraphile/compare/v3.5.1...v4.0.0-alpha2.21) (2017-10-29)

### Features

- **postgraphql:** Provide mechanism to add data to resolver context ([#601](https://github.com/graphile/postgraphile/issues/601)) ([5526c2c](https://github.com/graphile/postgraphile/commit/5526c2cc37a7b2242c8f515092ad878e43930bb9))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

## [3.5.5](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.28...v3.5.5) (2018-01-30)

### Bug Fixes

- resolution of files within GraphiQL ([#676](https://github.com/graphile/postgraphile/issues/676)) ([f111e8d](https://github.com/graphile/postgraphile/commit/f111e8d819009b36d1797787ac5989ee93598640))

# [4.0.0-alpha2.28](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.27...v4.0.0-alpha2.28) (2018-01-14)

### Features

- **additionalGraphQLContextFromRequest:** add res to callback ([#652](https://github.com/graphile/postgraphile/issues/652)) ([1fa4310](https://github.com/graphile/postgraphile/commit/1fa4310dae82d1a28636cb0fc6d4f8294729c5a2))

# [4.0.0-alpha2.27](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.26...v4.0.0-alpha2.27) (2017-12-16)

# [4.0.0-alpha2.26](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.25...v4.0.0-alpha2.26) (2017-12-03)

# [4.0.0-alpha2.25](https://github.com/graphile/postgraphile/compare/v3.5.4...v4.0.0-alpha2.25) (2017-11-30)

# [4.0.0-alpha2.24](https://github.com/graphile/postgraphile/compare/v3.5.3...v4.0.0-alpha2.24) (2017-11-29)

# [4.0.0-alpha2.23](https://github.com/graphile/postgraphile/compare/v3.5.2...v4.0.0-alpha2.23) (2017-11-28)

# [4.0.0-alpha2.22](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.21...v4.0.0-alpha2.22) (2017-11-02)

### Features

- **pgSettings:** Only use settings of type string or number ([#589](https://github.com/graphile/postgraphile/issues/589)) ([7a69eb2](https://github.com/graphile/postgraphile/commit/7a69eb25bb93de53abe83373d76eefb05b2799f2))

# [4.0.0-alpha2.21](https://github.com/graphile/postgraphile/compare/v3.5.1...v4.0.0-alpha2.21) (2017-10-29)

### Features

- **postgraphql:** Provide mechanism to add data to resolver context ([#601](https://github.com/graphile/postgraphile/issues/601)) ([5526c2c](https://github.com/graphile/postgraphile/commit/5526c2cc37a7b2242c8f515092ad878e43930bb9))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

## [3.5.4](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.24...v3.5.4) (2017-11-30)

### Bug Fixes

- **graphiql:** upgrade codemirror-graphql to support graphql@0.11.x ([6ed6796](https://github.com/graphile/postgraphile/commit/6ed6796ff95f2f73f4c12d92fa92b7edce2bc207))

### Features

- **errors:** extend errors further ([#641](https://github.com/graphile/postgraphile/issues/641)) ([206a775](https://github.com/graphile/postgraphile/commit/206a775ddaf2767e1962b28acbf72a08c857d056))

# [4.0.0-alpha2.24](https://github.com/graphile/postgraphile/compare/v3.5.3...v4.0.0-alpha2.24) (2017-11-29)

# [4.0.0-alpha2.23](https://github.com/graphile/postgraphile/compare/v3.5.2...v4.0.0-alpha2.23) (2017-11-28)

# [4.0.0-alpha2.22](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.21...v4.0.0-alpha2.22) (2017-11-02)

### Features

- **pgSettings:** Only use settings of type string or number ([#589](https://github.com/graphile/postgraphile/issues/589)) ([7a69eb2](https://github.com/graphile/postgraphile/commit/7a69eb25bb93de53abe83373d76eefb05b2799f2))

# [4.0.0-alpha2.21](https://github.com/graphile/postgraphile/compare/v3.5.1...v4.0.0-alpha2.21) (2017-10-29)

### Features

- **postgraphql:** Provide mechanism to add data to resolver context ([#601](https://github.com/graphile/postgraphile/issues/601)) ([5526c2c](https://github.com/graphile/postgraphile/commit/5526c2cc37a7b2242c8f515092ad878e43930bb9))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

## [3.5.3](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.23...v3.5.3) (2017-11-29)

# [4.0.0-alpha2.23](https://github.com/graphile/postgraphile/compare/v3.5.2...v4.0.0-alpha2.23) (2017-11-28)

# [4.0.0-alpha2.22](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.21...v4.0.0-alpha2.22) (2017-11-02)

### Features

- **pgSettings:** Only use settings of type string or number ([#589](https://github.com/graphile/postgraphile/issues/589)) ([7a69eb2](https://github.com/graphile/postgraphile/commit/7a69eb25bb93de53abe83373d76eefb05b2799f2))

# [4.0.0-alpha2.21](https://github.com/graphile/postgraphile/compare/v3.5.1...v4.0.0-alpha2.21) (2017-10-29)

### Features

- **postgraphql:** Provide mechanism to add data to resolver context ([#601](https://github.com/graphile/postgraphile/issues/601)) ([5526c2c](https://github.com/graphile/postgraphile/commit/5526c2cc37a7b2242c8f515092ad878e43930bb9))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

## [3.5.2](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.22...v3.5.2) (2017-11-28)

### Bug Fixes

- **docs:** Update TUTORIAL.md (outdated phrase) ([#638](https://github.com/graphile/postgraphile/issues/638)) ([f3fe26a](https://github.com/graphile/postgraphile/commit/f3fe26a1702f12113a7fcc82fcb068629f985880))
- **docs:** Update TUTORIAL.md (spelling mistake) ([#637](https://github.com/graphile/postgraphile/issues/637)) ([e2eabd0](https://github.com/graphile/postgraphile/commit/e2eabd078be6e0bfb37f8fd3c8a30ca89833a607))

# [4.0.0-alpha2.22](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.21...v4.0.0-alpha2.22) (2017-11-02)

### Features

- **pgSettings:** Only use settings of type string or number ([#589](https://github.com/graphile/postgraphile/issues/589)) ([7a69eb2](https://github.com/graphile/postgraphile/commit/7a69eb25bb93de53abe83373d76eefb05b2799f2))

# [4.0.0-alpha2.21](https://github.com/graphile/postgraphile/compare/v3.5.1...v4.0.0-alpha2.21) (2017-10-29)

### Features

- **postgraphql:** Provide mechanism to add data to resolver context ([#601](https://github.com/graphile/postgraphile/issues/601)) ([5526c2c](https://github.com/graphile/postgraphile/commit/5526c2cc37a7b2242c8f515092ad878e43930bb9))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

## [3.5.1](https://github.com/graphile/postgraphile/compare/v3.5.0...v3.5.1) (2017-10-29)

# [3.5.0](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.9...v3.5.0) (2017-08-25)

### Features

- **HTTP:** `pgSettings` now accepts a function to generate settings from req ([85e630a](https://github.com/graphile/postgraphile/commit/85e630a9de530b5f141241ab62d2b6974cc6fbd4))

# [4.0.0-alpha2.9](https://github.com/graphile/postgraphile/compare/v4.0.0-alpha2.6...v4.0.0-alpha2.9) (2017-08-10)

# [4.0.0-alpha2.6](https://github.com/graphile/postgraphile/compare/v3.4.0...v4.0.0-alpha2.6) (2017-08-08)

# [3.4.0](https://github.com/graphile/postgraphile/compare/v3.3.0...v3.4.0) (2017-08-08)

### Bug Fixes

- **typo:** fix spelling error in procedures.md ([#541](https://github.com/graphile/postgraphile/issues/541)) ([ff029b8](https://github.com/graphile/postgraphile/commit/ff029b8fe619463aec055cb6a04fe563be8973eb))

### Features

- **postgraphql:** add extendedErrors option ([#513](https://github.com/graphile/postgraphile/issues/513)) ([a41e5f2](https://github.com/graphile/postgraphile/commit/a41e5f2664350eb27fd0ec265de4995f2a6f4a9a))

# [3.3.0](https://github.com/graphile/postgraphile/compare/v3.2.0...v3.3.0) (2017-07-18)

### Bug Fixes

- pervasive typo ([e62d7af](https://github.com/graphile/postgraphile/commit/e62d7af5c47065a0aba27f0518c02ac795931d89))
- **auth:** send a 401 status on expired token ([#472](https://github.com/graphile/postgraphile/issues/472)) ([fa241f4](https://github.com/graphile/postgraphile/commit/fa241f477f57c4f1547279cf400285771585e5d9))
- **build:** Support spaces in folder name ([#441](https://github.com/graphile/postgraphile/issues/441)) ([df347e7](https://github.com/graphile/postgraphile/commit/df347e76f1ca295f96b3928198d18c92646796a8))
- **cli:** invalid program destructuring ([#434](https://github.com/graphile/postgraphile/issues/434)) ([998ba25](https://github.com/graphile/postgraphile/commit/998ba25c95f75fc5519f8d8a64c88bc88c433dc7))
- **graphqli:** pass along credentials in fetcher ([#436](https://github.com/graphile/postgraphile/issues/436)) ([bf10085](https://github.com/graphile/postgraphile/commit/bf10085582790ff97a07e9108c2ba7001130c24b))
- **postgraphql:** don't throw on auth header if auth not enabled ([#437](https://github.com/graphile/postgraphile/issues/437)) ([b2155c9](https://github.com/graphile/postgraphile/commit/b2155c9a5048b90f9f8c0357eeb2f3084241c60d))
- **postgraphql:** Throw if jwtSecret set but jwtPgTypeIndentifer isn't ([#466](https://github.com/graphile/postgraphile/issues/466)) ([f68056c](https://github.com/graphile/postgraphile/commit/f68056ce91d9c9432feef1e05e634a341cf3932d))
- **regression:** change jwtPgTypeIdentifier error to warning ([1c88d61](https://github.com/graphile/postgraphile/commit/1c88d6131b2e03dc8dca11a190a70c26a6d212e8))

### Features

- **docker:** Docker Image ([#496](https://github.com/graphile/postgraphile/issues/496)) ([886f875](https://github.com/graphile/postgraphile/commit/886f8752f03d3fa05bdbdd97eeabb153a4d0343e))
- **jwt:** allow all numbers in jwt token type names ([#511](https://github.com/graphile/postgraphile/issues/511)) ([b3e22d6](https://github.com/graphile/postgraphile/commit/b3e22d66e0aeb6212a672de07080107b7ef6e01f))
- **postgraphql:** extract pgRole from arbitrary JWT path ([#480](https://github.com/graphile/postgraphile/issues/480)) ([607f662](https://github.com/graphile/postgraphile/commit/607f6629986735139e2b77d5a9b1143846c4f691))

### Performance Improvements

- **postgres:** use CTEs for paginators ([#396](https://github.com/graphile/postgraphile/issues/396)) ([24ba777](https://github.com/graphile/postgraphile/commit/24ba7771f223064ce38ec1e76491b647a2fe1bf4)), closes [#380](https://github.com/graphile/postgraphile/issues/380)

# [3.2.0](https://github.com/graphile/postgraphile/compare/v3.1.0...v3.2.0) (2017-04-01)

### Features

- **postgraphql:** expose jwt.verify options parameter to the api and cli ([#403](https://github.com/graphile/postgraphile/issues/403)) ([d4fd6a4](https://github.com/graphile/postgraphile/commit/d4fd6a4009fea75dbcaa00d743c985148050475e))

# [3.1.0](https://github.com/graphile/postgraphile/compare/v3.0.0...v3.1.0) (2017-03-26)

### Bug Fixes

- **ci:** peerdeps for graphql/graphiql must match ([#377](https://github.com/graphile/postgraphile/issues/377)) ([5b73f2d](https://github.com/graphile/postgraphile/commit/5b73f2d3601f491c7cdfcdc51036befc581a6365))
- **graphiql:** fix GraphiQL version 0.9.3 integration ([#410](https://github.com/graphile/postgraphile/issues/410)) ([ef03591](https://github.com/graphile/postgraphile/commit/ef035911026f3a0006214c57880b0cf6e5e00239))
- **graphiql:** fixes graphiql so it works with koa ([#370](https://github.com/graphile/postgraphile/issues/370)) ([53c6a31](https://github.com/graphile/postgraphile/commit/53c6a3139b9c7247e5dc1d6761f610ddef61f384)), closes [pillarjs/send#118](https://github.com/pillarjs/send/issues/118) [pillarjs/send#119](https://github.com/pillarjs/send/issues/119)
- **http:** Add option to set limit in bodyParser ([6cf9ac7](https://github.com/graphile/postgraphile/commit/6cf9ac7d1b28440523d6938e0c993d007f0169ed)), closes [#372](https://github.com/graphile/postgraphile/issues/372)
- **postgraphql:** add missing type coercion in computed procedure field ([#409](https://github.com/graphile/postgraphile/issues/409)) ([24cb295](https://github.com/graphile/postgraphile/commit/24cb29554f6e33a2709cea125aa86e0d81997aef))
- **postgraphql:** emit correct listen port during startup ([#366](https://github.com/graphile/postgraphile/issues/366)) ([a88a983](https://github.com/graphile/postgraphile/commit/a88a9836722c5d42c7cae93fe901c095d7c704f6))
- **postgres:** only include columns in insert statements if needed ([#367](https://github.com/graphile/postgraphile/issues/367)) ([61fe455](https://github.com/graphile/postgraphile/commit/61fe4550751aa45c07783a6ae17fdcd01b73f956))
- **postgres:** use literal syntax for empty arrays ([#407](https://github.com/graphile/postgraphile/issues/407)) ([45e5971](https://github.com/graphile/postgraphile/commit/45e5971335343ca8d0f00cf1a0a6c8f214134bd6))
- **watch:** fix startup crash when a non-superuser tries to watch ([#371](https://github.com/graphile/postgraphile/issues/371)) ([6b3374b](https://github.com/graphile/postgraphile/commit/6b3374baa974d8efd110970e4bd9431b8b3771f3))

### Features

- **postgraphql:** inject custom settings into the database ([#399](https://github.com/graphile/postgraphile/issues/399)) ([9d10389](https://github.com/graphile/postgraphile/commit/9d10389c970eae9fb4e4f26595706c329a0b547a))

# [3.0.0](https://github.com/graphile/postgraphile/compare/v2.5.1...v3.0.0) (2017-02-11)

### Bug Fixes

- **cli:** example postgres connection string and default port ([1cdd7c2](https://github.com/graphile/postgraphile/commit/1cdd7c28168c9e239e8baaa188ee929c2b2947b3))
- **interface:** add missing import ([4da7b61](https://github.com/graphile/postgraphile/commit/4da7b611d5530f7dcd6542166c9b6da3eba683f2))
- **postgraphql:** add missing import ([2f73f1e](https://github.com/graphile/postgraphile/commit/2f73f1e163bb08d6d93abb9d2fa24f24aa0404bd))
- **postgraphql:** fix errors generated by running ts-node ([c513b67](https://github.com/graphile/postgraphile/commit/c513b67cb93f8a7fe1c8773bbc147139e5821074))
- **postgres:** duplicate foreign key bug ([#326](https://github.com/graphile/postgraphile/issues/326)) ([73bb8f8](https://github.com/graphile/postgraphile/commit/73bb8f8e5ab02025fd237348418e23865cc84f7d))
- **postgres:** fix processing money type ([#339](https://github.com/graphile/postgraphile/issues/339)) ([2f25ce8](https://github.com/graphile/postgraphile/commit/2f25ce8a9567e956f6dac55c237a1bf2e9e38003))

### Features

- **graphql:** added support for auto-exporting the schema ([#347](https://github.com/graphile/postgraphile/issues/347)) ([f71bb7a](https://github.com/graphile/postgraphile/commit/f71bb7a69953682af68d954075e5146b2a0d4664))
- **postgraphql:** add live reloading to GraphiQL ([#252](https://github.com/graphile/postgraphile/issues/252)) ([939a91e](https://github.com/graphile/postgraphile/commit/939a91ed20fc183bcd0fc8367a7b6af891e6a2de))
- **postgraphql:** enable running PostGraphQL queries outside HTTP ([#269](https://github.com/graphile/postgraphile/issues/269)) ([1145689](https://github.com/graphile/postgraphile/commit/1145689054f7f7a6a5542ec34aa3827af3bc572a))

## [2.5.1](https://github.com/graphile/postgraphile/compare/v2.5.0...v2.5.1) (2017-01-28)

### Bug Fixes

- **deps:** restrict graphql version range ([#322](https://github.com/graphile/postgraphile/issues/322)) ([8d7cee9](https://github.com/graphile/postgraphile/commit/8d7cee9d203911d52310aced975fa872b8895505))
- **postgraphql:** don't throw a 500 error if JWT is expired ([#315](https://github.com/graphile/postgraphile/issues/315)) ([a9b810a](https://github.com/graphile/postgraphile/commit/a9b810a77565b77fb2d3a29569b8a9619e4a669a))

# [2.5.0](https://github.com/graphile/postgraphile/compare/v2.4.1...v2.5.0) (2017-01-09)

### Features

- **postgraphql:** build schema from prebuild PgCatalog ([#306](https://github.com/graphile/postgraphile/issues/306)) ([99d4bbe](https://github.com/graphile/postgraphile/commit/99d4bbe8fcd79b9e7fb31df94f58e7fe4f6311ed))

## [2.4.1](https://github.com/graphile/postgraphile/compare/v2.4.0...v2.4.1) (2016-12-22)

### Bug Fixes

- **postgres:** make pg range objects nullable ([#286](https://github.com/graphile/postgraphile/issues/286)) ([ddfac85](https://github.com/graphile/postgraphile/commit/ddfac8589a1299cfc5a646bf37c34e34816fc32e))

# [2.4.0](https://github.com/graphile/postgraphile/compare/v2.2.1...v2.4.0) (2016-12-15)

### Bug Fixes

- **contributing:** minor corrections ([#201](https://github.com/graphile/postgraphile/issues/201)) ([b3436e0](https://github.com/graphile/postgraphile/commit/b3436e032d9c92dca81ce1fb0f6988010a7574f7))
- **docs:** contribution file ([#274](https://github.com/graphile/postgraphile/issues/274)) ([9c8c187](https://github.com/graphile/postgraphile/commit/9c8c1872971cc42556d6c4e890a57bb0de62203e))
- **docs:** fixed command examples ([#244](https://github.com/graphile/postgraphile/issues/244)) ([4c686a7](https://github.com/graphile/postgraphile/commit/4c686a7e9c15e982e5d1261b44c11a6ac68e8c68))
- **docs:** fixed insert/update confusion ([#245](https://github.com/graphile/postgraphile/issues/245)) ([ce84c19](https://github.com/graphile/postgraphile/commit/ce84c191e7273b9ded49f0007777ad369f58f823))
- **tests:** fix daylight savings time failures ([4678bd3](https://github.com/graphile/postgraphile/commit/4678bd3d3aeb5d61a82362269b63bb44f9a2861d))
- **tests:** fix daylight savings time failures ([#217](https://github.com/graphile/postgraphile/issues/217)) ([84cb922](https://github.com/graphile/postgraphile/commit/84cb922f305064b8ca2d150edb161c3411223d4a))

### Features

- **docs:** add to readme a link to contributing ([#239](https://github.com/graphile/postgraphile/issues/239)) ([ea3c94d](https://github.com/graphile/postgraphile/commit/ea3c94de6bbef483c70a3f15f3792b539f943b96))
- **graphql:** add reverse relation conditions (fixes v2 regression) ([#198](https://github.com/graphile/postgraphile/issues/198)) ([0cb2438](https://github.com/graphile/postgraphile/commit/0cb2438c36cc232cc1ec86b59ccbfc113ffba6f2))

## [2.2.1](https://github.com/graphile/postgraphile/compare/v2.2.0...v2.2.1) (2016-10-29)

### Bug Fixes

- **graphql:** fix ambiguous values from node field ([#192](https://github.com/graphile/postgraphile/issues/192)) ([be88a93](https://github.com/graphile/postgraphile/commit/be88a93d6f595e67310fd509b91b833f57fa31b1))
- **graphql:** fix mutation query field returning null ([#193](https://github.com/graphile/postgraphile/issues/193)) ([ce5451f](https://github.com/graphile/postgraphile/commit/ce5451f36b0f8f3d173a7a444b2eae3ee8994b7f))
- **postgraphql:** fix argument ordering ([#194](https://github.com/graphile/postgraphile/issues/194)) ([82950c6](https://github.com/graphile/postgraphile/commit/82950c6f85cf4fc8841a5268bbe4799424510f49))

### Features

- **ci:** run against multiple postgres versions ([#196](https://github.com/graphile/postgraphile/issues/196)) ([7a753b1](https://github.com/graphile/postgraphile/commit/7a753b1ab3a452735ce93f366416f5dcd6f8ca77))

# [2.2.0](https://github.com/graphile/postgraphile/compare/v2.1.1...v2.2.0) (2016-10-24)

### Features

- **graphql:** disable default mutations ([#182](https://github.com/graphile/postgraphile/issues/182)) ([c752260](https://github.com/graphile/postgraphile/commit/c752260666f2a9a2b9f5f40916bc1b2348b28f42)), closes [#170](https://github.com/graphile/postgraphile/issues/170)

## [2.1.1](https://github.com/graphile/postgraphile/compare/v2.1.0...v2.1.1) (2016-10-22)

### Bug Fixes

- **postgraphql:** fix create schema to end client after introspection ([#173](https://github.com/graphile/postgraphile/issues/173)) ([9b36ff8](https://github.com/graphile/postgraphile/commit/9b36ff8d283e13d10c7289776d68ee94aa57c2c0))
- **postgraphql:** fix opaque error messages ([#174](https://github.com/graphile/postgraphile/issues/174)) ([8213195](https://github.com/graphile/postgraphile/commit/8213195efdb914b586231ebcc57bae1ba5b13869))

# [2.1.0](https://github.com/graphile/postgraphile/compare/v1.9.3...v2.1.0) (2016-10-18)

### Bug Fixes

- **ci:** increase the timeout for more test suites ([4093237](https://github.com/graphile/postgraphile/commit/4093237fc4f1bfa5040798bdce3ab88ad9a39159))
- **ci:** increase the timeout interval for another test ([852cf75](https://github.com/graphile/postgraphile/commit/852cf75f4fba351b61bff7682b897c943ec462ed))
- **ci:** increase timeout interval for flaky tests ([d488050](https://github.com/graphile/postgraphile/commit/d488050fa41423db5267e851319f82edb2b04b76))
- **ci:** multiple postgres versions ([73173db](https://github.com/graphile/postgraphile/commit/73173dbfd5efcb2d2ed2144781ecf35ec0785476))
- **ci:** remove old Node.js, add second Postgres version ([8e4c3f5](https://github.com/graphile/postgraphile/commit/8e4c3f59ec60785df82b1eddf689592cb7986d3f))
- **cli:** package.json import ([3a58adf](https://github.com/graphile/postgraphile/commit/3a58adfa5baae18c66cb839e15fe05b0e10fa604))
- **examples:** add missing namespace ([f97c723](https://github.com/graphile/postgraphile/commit/f97c7232301abee9f66b2012f6efde439e508a50))
- **examples:** update schema ([678e67d](https://github.com/graphile/postgraphile/commit/678e67d4e4b3c09611565f87e472783ca4bfb9fe))
- **graphql:** add transform input value function ([0588871](https://github.com/graphile/postgraphile/commit/0588871b7ab6e1a700009097fe4405ca2c02e1d9))
- **graphql:** don’t allow the use of cursors with offset ([3159859](https://github.com/graphile/postgraphile/commit/3159859b253af89222bc8f18c88213ac743d078f))
- **graphql:** empty set cursors ([6c97ed3](https://github.com/graphile/postgraphile/commit/6c97ed31a719a01a6ae151704da22ef41334e2e6))
- **graphql:** fix compile errors ([dd75e37](https://github.com/graphile/postgraphile/commit/dd75e37865c2f8aedd3bcf0c888c7de551231b16))
- **graphql:** fix create mutation return type ([a89d89f](https://github.com/graphile/postgraphile/commit/a89d89f459b3875ff6e1c5226b11fa216ea50e1f))
- **graphql:** fix file name casing ([b230763](https://github.com/graphile/postgraphile/commit/b230763cbbf93e9ce13b79a586a64ab090ca5b01))
- **graphql:** fix id serialization and deserialization ([fada7f1](https://github.com/graphile/postgraphile/commit/fada7f177f6f9e78bd3806e61e0c8c83664d36cd))
- **graphql:** fix not null has default case ([df3f4b0](https://github.com/graphile/postgraphile/commit/df3f4b0ef2b7c2cd747956fcebb7fe41e6d54056))
- **graphql:** use `typeof` undefined check instead of equality ([961f011](https://github.com/graphile/postgraphile/commit/961f0115ed54e11238ab1a7875221408b16a1785))
- **interface:** fix interface json type name ([a330f3c](https://github.com/graphile/postgraphile/commit/a330f3c25f5c42f4acaa5cf69bf2ede46c9fadae))
- **interface:** fix relation inventory key name ([7e41f18](https://github.com/graphile/postgraphile/commit/7e41f184a567529a75d10e287ce4a984ac145e94))
- **package:** add some more npm ignores ([e1cd793](https://github.com/graphile/postgraphile/commit/e1cd79352e219c27bf2fc9e1ee22a9b83614d338))
- **package:** fix ignored build script ([6ce633e](https://github.com/graphile/postgraphile/commit/6ce633e4b9f6c98514278f94edad9787f5c9ce11))
- **package:** fix Travis format ([7c6436f](https://github.com/graphile/postgraphile/commit/7c6436fc9e090e34e65c3d903537cb5314137d07))
- **package:** refactor package exports ([a485700](https://github.com/graphile/postgraphile/commit/a485700fa60370ed47ce716bfe4d5ab547e88399))
- **package:** remove prepublish script again ([bf7eedb](https://github.com/graphile/postgraphile/commit/bf7eedb21e622f6b35cf03e9e52d8b38d8355e08))
- **package:** remove prepublish script for ci ([2dd2016](https://github.com/graphile/postgraphile/commit/2dd2016bdaea06d5144c22d3e0897f59072bcde3))
- **postgraphql:** add extra snapshot changes after last commit ([1615982](https://github.com/graphile/postgraphile/commit/161598204e03936021a623b0fc13d8a026c6a6a0))
- **postgraphql:** fix broken cli import ([3f69058](https://github.com/graphile/postgraphile/commit/3f6905836598d54011a4714412076ae2d4000aac))
- **postgraphql:** fix HTTP server ([62c4212](https://github.com/graphile/postgraphile/commit/62c4212e3471a6bca12ad465f81742a4128cad55))
- **postgraphql:** fix procedure defaults call ([fe19307](https://github.com/graphile/postgraphile/commit/fe1930751e36bc371ef994238ca7e8b3e33203a4))
- **postgraphql:** fix support for information_schema and pg_catalog ([24b7840](https://github.com/graphile/postgraphile/commit/24b78407bb6fba6732665816f9016073800443e0))
- **postgraphql:** hide unused demo option ([0acf0bc](https://github.com/graphile/postgraphile/commit/0acf0bc00058d37231ebf8b9b14dc363ed946035))
- **postgres:** add cast information for composite types ([be2e8a7](https://github.com/graphile/postgraphile/commit/be2e8a7abbf4593e09f796651344e9173b298b2c))
- **postgres:** fix alias naming collision ([a45a869](https://github.com/graphile/postgraphile/commit/a45a8696bf48dfcac63ae76d8c4aa1f4514df8ce))
- **postgres:** fix condition classic ids handling ([e24f884](https://github.com/graphile/postgraphile/commit/e24f8847e259d3c9edd9c1d6f4ff51c2b12735d8))
- **postgres:** fix domain types nullability ([dbe0468](https://github.com/graphile/postgraphile/commit/dbe04682e5475094980ce2e31df754238b512cac))
- **postgres:** fix drop column introspection error ([ea16735](https://github.com/graphile/postgraphile/commit/ea16735ea49b64697b7416e2431c11ac800f61b3))
- **postgres:** fix Postgres value handling logic ([145cf6e](https://github.com/graphile/postgraphile/commit/145cf6ed9fe7b9a2913c11bb79cc4a07533a5533))
- **postgres:** fix some broken things ([31b7e1e](https://github.com/graphile/postgraphile/commit/31b7e1eb1c5cfbe629af004e2254c0ff4bd0c17c))
- **postgres:** fix the handling for smallint and money types ([9e180ed](https://github.com/graphile/postgraphile/commit/9e180ed000f19f0ef6e8c7aa8d0b7bd2cbced9b7))
- **postgres:** use attisdropped in introspection ([5b8b043](https://github.com/graphile/postgraphile/commit/5b8b04349ad5902854b3e4ee57d92164245db355))
- **test:** data ordering error opportunity ([9ee7f1e](https://github.com/graphile/postgraphile/commit/9ee7f1e789eb7292325556a6612ed9d4d41a7a0e))
- **test:** fix failures caused by linting ([238d7a2](https://github.com/graphile/postgraphile/commit/238d7a2b92150f7bd8791d800360d739ba7d3e9e))
- **test:** fix kitchen sink schema mutation procedure ([91e4ab7](https://github.com/graphile/postgraphile/commit/91e4ab75a6efb1a6370fb0b57f2643b24cfddbf5))
- **test:** fix test failures ([0de9ad3](https://github.com/graphile/postgraphile/commit/0de9ad35421b02ba5551a0e56b694d40862e04a5))
- **test:** fix test flakiness ([d8bd1bc](https://github.com/graphile/postgraphile/commit/d8bd1bcc85f08fb88f1e57a17af68b0b56e01b49))
- **test:** fix timezone disparities in tests ([5819c02](https://github.com/graphile/postgraphile/commit/5819c0223e751f1419513385554a3369e8492eee))
- **tests:** fix flakiness, again… ([ed6065d](https://github.com/graphile/postgraphile/commit/ed6065df1e56a2ddea4bbf0db77d98adb44a9e31))
- **tests:** fix incorrect environment variable casing ([1b375b9](https://github.com/graphile/postgraphile/commit/1b375b9c157413e665a067d6efbc3da551f3988f))
- **tests:** fix missing property in enum type test ([be4e0d6](https://github.com/graphile/postgraphile/commit/be4e0d67400c5c5d2ebc1859e4274764b53e8590))

### Features

- **catalog:** add paginators ([1e25d46](https://github.com/graphile/postgraphile/commit/1e25d4672d32869f1d1344c5388d485238b69b13))
- **catalog:** add type tracking to the catalog ([0b04ce9](https://github.com/graphile/postgraphile/commit/0b04ce9a3f643f9c9009d2286c2763cd96693134))
- **ci:** add caching for nvm ([398517f](https://github.com/graphile/postgraphile/commit/398517f9a087f842dacc5348b88060f963aa8a66))
- **ci:** build demo database on ci success ([3888eea](https://github.com/graphile/postgraphile/commit/3888eeaf912100c4095c111b32d9b821bf74557f))
- **collection:** add reverse relation fields ([05f5614](https://github.com/graphile/postgraphile/commit/05f561400cf804d4398f5126991186712b11d0ac))
- **graphql:** add a root recursive field for Relay 1 ([4d6518e](https://github.com/graphile/postgraphile/commit/4d6518e092e14b040169b97803cd7c5ac38c2dc3))
- **graphql:** add collection key update mutations ([8f05e93](https://github.com/graphile/postgraphile/commit/8f05e93f8e83a40a4276796ed954fdf1d3994aad))
- **graphql:** add collection update mutation ([1d3eb5d](https://github.com/graphile/postgraphile/commit/1d3eb5ddd671e6d8a3b787becceb0ce9a65a6df9))
- **graphql:** add connection conditions ([4fbb94e](https://github.com/graphile/postgraphile/commit/4fbb94e23fd59f7ea67d30dddb4ed7d8bc6830be))
- **graphql:** add create mutation ([7a37c80](https://github.com/graphile/postgraphile/commit/7a37c80d4ad0cbc7d7a80c44045f92c1161afef7))
- **graphql:** add delete by collection key mutation ([8d10806](https://github.com/graphile/postgraphile/commit/8d10806b154c6f42127b6c276ac8ed2c1e99d8b1))
- **graphql:** add delete by collection mutation ([74922ee](https://github.com/graphile/postgraphile/commit/74922ee6ec1c1ce453b02d9b1da036c341e81304))
- **graphql:** add deleted id to delete mutations ([69f16ad](https://github.com/graphile/postgraphile/commit/69f16adf5b786dc870aafe24281d035b9f760c18))
- **graphql:** add descriptions ([60b63d0](https://github.com/graphile/postgraphile/commit/60b63d020bb8821b74f268c30b05e80075b06851))
- **graphql:** add dynamic json option ([a6dce4a](https://github.com/graphile/postgraphile/commit/a6dce4a8f4a31c91ec7aa1cb952908de2710c3b4))
- **graphql:** add GraphiQL to HTTP request handler ([61b38e9](https://github.com/graphile/postgraphile/commit/61b38e930ceb337b143e52b6509b8ce4b5788c02))
- **graphql:** add GraphQL HTTP request handler ([da3acef](https://github.com/graphile/postgraphile/commit/da3acefdd6f151ee3205cc28c1147fce37001393))
- **graphql:** add paginator mutation procedure support ([dbb6e3f](https://github.com/graphile/postgraphile/commit/dbb6e3f4dced6f214081dda190b0b122bc6a43a0))
- **graphql:** add procedure single output ([9c4953d](https://github.com/graphile/postgraphile/commit/9c4953d6bfaa9be5223e2a458b8c04ae6e196c23))
- **graphql:** add related collections to create mutation payload ([4a6b103](https://github.com/graphile/postgraphile/commit/4a6b1034bd1d541f620055042b5cafa738ec8ed2))
- **graphql:** add related tail collection fields to all collection mutations ([9af31b4](https://github.com/graphile/postgraphile/commit/9af31b45ad3d704e52c07f256d31745f1a1853bd))
- **graphql:** allow users to rename the node id field name ([de3d3ed](https://github.com/graphile/postgraphile/commit/de3d3ed2701cebf26b05f22c81398dc89a6ba744))
- **graphql:** debugs http requests ([108116b](https://github.com/graphile/postgraphile/commit/108116b9fbf597b9322dafd59bbff9835ebdf368))
- **graphql:** implement Node for top level query field ([594b554](https://github.com/graphile/postgraphile/commit/594b5547c5717e9ede98daf0bf97322ec50b7c0e))
- **graphql:** serve a favicon from GraphQL HTTP ([44692bb](https://github.com/graphile/postgraphile/commit/44692bbc3a155369dbf7b2f3f5ab2df79b3a4133))
- **interface:** add procedures ([d9f307e](https://github.com/graphile/postgraphile/commit/d9f307e3971292500e654f9a79bbe1520334c703))
- **package:** add extra meta information ([847c70e](https://github.com/graphile/postgraphile/commit/847c70e6675a1653026dc1be5d964c1a0827ded9))
- **paginator:** add optional optimizations ([fc25072](https://github.com/graphile/postgraphile/commit/fc25072dabd05000662958efe2a2c241d6bb0e32))
- **postgraphql:** add an offset argument to pagination ([2ab3aa6](https://github.com/graphile/postgraphile/commit/2ab3aa647e1160bf76d9fd85dbaeb33816fed47f))
- **postgraphql:** add authentication support ([0565429](https://github.com/graphile/postgraphile/commit/0565429dba26bd911b45af3b9cf5fcbb2cabcc41))
- **postgraphql:** add authorization ([c3ae332](https://github.com/graphile/postgraphile/commit/c3ae332d84216a4e8c715cd311da6a4688654b6e))
- **postgraphql:** add computed procedure fields ([a39fab2](https://github.com/graphile/postgraphile/commit/a39fab2224247bb5d9f52d2e184e2121d53d0b8e))
- **postgraphql:** add connection procedure execution ([156fc46](https://github.com/graphile/postgraphile/commit/156fc46fa44ed53f32a83fd023be2cdd89743295))
- **postgraphql:** add custom handling of the JSON type ([eb88285](https://github.com/graphile/postgraphile/commit/eb882851cedb1ba67998019a33e0208cfd24431d))
- **postgraphql:** add first rough stab at cli ([c3cdaec](https://github.com/graphile/postgraphile/commit/c3cdaecd3e35094a52039bb803d9a79a62608ade))
- **postgraphql:** add head to tail relation selection ([464ba71](https://github.com/graphile/postgraphile/commit/464ba71cd89c6206fcfb6202df66e97f9f649896))
- **postgraphql:** add library interface ([5fd1e0e](https://github.com/graphile/postgraphile/commit/5fd1e0ece422d89622657b2e4c048c66e95ec8b8))
- **postgraphql:** add missing descriptions ([012f76c](https://github.com/graphile/postgraphile/commit/012f76c2b9034ac45ba2d2366b4c022dfe4a05bb))
- **postgraphql:** add mutation procedure execution ([b1ba4c8](https://github.com/graphile/postgraphile/commit/b1ba4c8bc8dfe90441b3a3751aa903b0f2891c99))
- **postgraphql:** add related fields to mutation top level for Relay 1 ([5977e8c](https://github.com/graphile/postgraphile/commit/5977e8c9913c5fd2a5f18953952990e39eb47d10))
- **postgraphql:** add resolution for single return procedures ([85f2e4e](https://github.com/graphile/postgraphile/commit/85f2e4ececc4946b017af895e57d8b34c6a7a9f5))
- **postgraphql:** add schema for mutation procedures ([9d51ea6](https://github.com/graphile/postgraphile/commit/9d51ea6fc175ef0adb4c61f31bee3706f4eca680))
- **postgraphql:** add schema watch functionality to CLI and middleware ([#166](https://github.com/graphile/postgraphile/issues/166)) ([396bca4](https://github.com/graphile/postgraphile/commit/396bca42a927f598b5cbab176fd53a012600f60f))
- **postgraphql:** allow single schema ([878779f](https://github.com/graphile/postgraphile/commit/878779f621d3f488f0b51531969ee3a8d6cc1365))
- **postgraphql:** finish up cli ([79b6846](https://github.com/graphile/postgraphile/commit/79b6846ca97e8d2adf398540e9a6bc05e7d84b2b))
- **postgraphql:** improve type identifier parsing ([f8b2d42](https://github.com/graphile/postgraphile/commit/f8b2d42c4d17dfd099a1762f28f33d675b50f219))
- **postgraphql:** log Postgres role in HTTP handler ([56d9a23](https://github.com/graphile/postgraphile/commit/56d9a238a5bbe7c8ddf0b918139106f1b60052a8))
- **postgres:** add collection paginator ([1a14669](https://github.com/graphile/postgraphile/commit/1a1466952c60897095c0d9a1d321451d238c5f9d))
- **postgres:** add constraint introspection ([6906200](https://github.com/graphile/postgraphile/commit/6906200d972c0d51832882440f93741390a21d45))
- **postgres:** add delete to collection key ([76c6a84](https://github.com/graphile/postgraphile/commit/76c6a8463067e3ee1644b97d95af63e15f1040d1))
- **postgres:** add get object by name methods ([2110b34](https://github.com/graphile/postgraphile/commit/2110b3491026f97fb34874faff2e6870df4967c6))
- **postgres:** add id to rowId rename support ([f3a73e3](https://github.com/graphile/postgraphile/commit/f3a73e34ed8609efcd81708911a35d2baf6d6d84))
- **postgres:** add procedures to introspection ([d844ae9](https://github.com/graphile/postgraphile/commit/d844ae97788763d1b3fce3a0eed05ac708b3ae40))
- **postgres:** add relations ([807c93a](https://github.com/graphile/postgraphile/commit/807c93a8756d11e4a9c5235249e28f570af9240b))
- **postgres:** add support for Postgres range types ([c830f79](https://github.com/graphile/postgraphile/commit/c830f79df3941aa9b6f954d41aa802a5ba79a5a3))
- **postgres:** add support for symbol identifiers to sql util ([2ccdb63](https://github.com/graphile/postgraphile/commit/2ccdb638b55e669fcc681230f3dddc27278bd0e0))
- **postgres:** better handling of time types ([ee57864](https://github.com/graphile/postgraphile/commit/ee57864fe48bf3603ba9b6b4b17f0968b2cb17a3))
- **postgres:** implement initial pg collection key ([b5fafa6](https://github.com/graphile/postgraphile/commit/b5fafa60eb27167917143c4a51032ffb248a790f))
- **postgres:** improve collection key performance ([1e0e5b4](https://github.com/graphile/postgraphile/commit/1e0e5b434e3ec4f80756eba6c002c025e436dc8a))
- **postgres:** integrate keys with collections ([0e50110](https://github.com/graphile/postgraphile/commit/0e501103eee3fade1ecb2727d362a93f4d2f3ac5))
- **postgres:** make pg catalog types immutable ([a1db5d4](https://github.com/graphile/postgraphile/commit/a1db5d415e5909158d84f6f1f1d6e711ffd51bac))
- **postgres:** pluralize collection names ([b43a461](https://github.com/graphile/postgraphile/commit/b43a4612f205500025df71538b1c7ef24c0f1237))
- **postgres:** singularize the collection type name ([1564223](https://github.com/graphile/postgraphile/commit/15642239dc89512b4e27d005869ff83ffc540072))
- **postgres:** start implementing update ([7318a5e](https://github.com/graphile/postgraphile/commit/7318a5eac2bf77255610b578955a211065465b1d))
- **postgres:** start Postgres procedure support ([eecda05](https://github.com/graphile/postgraphile/commit/eecda05146e9f1531b240f559577da2b67bcefd7))
- **query:** add basic procedure mutation and query fields ([655a7b1](https://github.com/graphile/postgraphile/commit/655a7b1c833e6379090368b246f9f9e31ca8dc67))

## [1.9.3](https://github.com/graphile/postgraphile/compare/v1.9.2...v1.9.3) (2016-09-21)

### Bug Fixes

- **graphql:** fix insert false bug ([#120](https://github.com/graphile/postgraphile/issues/120)) ([0438e90](https://github.com/graphile/postgraphile/commit/0438e90845bb3c892199cc499d613bc500acad5e))
- **graphql:** fix JSON type serialization ([ce79b99](https://github.com/graphile/postgraphile/commit/ce79b99b880c3f287b67a8f2442f1c32d026d60d))
- **postgres:** fix empty insert case ([#122](https://github.com/graphile/postgraphile/issues/122)) ([f9af3f9](https://github.com/graphile/postgraphile/commit/f9af3f98fb9427c8ace476767b81bd4e21e6c485))

## [1.9.2](https://github.com/graphile/postgraphile/compare/v1.9.1...v1.9.2) (2016-09-04)

## [1.9.1](https://github.com/graphile/postgraphile/compare/v1.9.0...v1.9.1) (2016-09-04)

# [1.9.0](https://github.com/graphile/postgraphile/compare/v1.8.3...v1.9.0) (2016-08-19)

### Features

- **server:** add anonymous roles ([#98](https://github.com/graphile/postgraphile/issues/98)) ([e5ab46b](https://github.com/graphile/postgraphile/commit/e5ab46b83e6bd0269c0115dd695c1289a29437d2))

## [1.8.3](https://github.com/graphile/postgraphile/compare/v1.8.2...v1.8.3) (2016-08-17)

### Bug Fixes

- add `finalhandler` dependency ([ba868f7](https://github.com/graphile/postgraphile/commit/ba868f7575d811b76f09c7f3814eef18871fc6df))

## [1.8.2](https://github.com/graphile/postgraphile/compare/v1.8.1...v1.8.2) (2016-08-11)

### Bug Fixes

- **graphql:** non-unique cursors ([#95](https://github.com/graphile/postgraphile/issues/95)) ([9d062b1](https://github.com/graphile/postgraphile/commit/9d062b11cb687504561e51e8e7bfd201dcf5223a))

## [1.8.1](https://github.com/graphile/postgraphile/compare/v1.8.0...v1.8.1) (2016-07-30)

### Bug Fixes

- **graphql:** fix interval and other types handling ([#89](https://github.com/graphile/postgraphile/issues/89)) ([33f826b](https://github.com/graphile/postgraphile/commit/33f826bc4ba0ba1a483b318a64686f403302e076)), closes [#88](https://github.com/graphile/postgraphile/issues/88)

# [1.8.0](https://github.com/graphile/postgraphile/compare/v1.7.0...v1.8.0) (2016-07-27)

### Bug Fixes

- **examples:** remove emoji which causes "invalid byte sequence for encoding" ([#81](https://github.com/graphile/postgraphile/issues/81)) ([149ce26](https://github.com/graphile/postgraphile/commit/149ce26cffa911f9b4a365e71991f0a86c375eea))

### Features

- **server:** add CORS headers ([#86](https://github.com/graphile/postgraphile/issues/86)) ([97b521f](https://github.com/graphile/postgraphile/commit/97b521f78bbeb4a80919cf3adc5475978af58e3d))

# [1.7.0](https://github.com/graphile/postgraphile/compare/v1.6.0...v1.7.0) (2016-06-19)

### Features

- **graphql:** add fields based on unique constraints ([#70](https://github.com/graphile/postgraphile/issues/70)) ([dc4a970](https://github.com/graphile/postgraphile/commit/dc4a97088037ae75f791aec68e9d71ffb4bf49f7)), closes [#67](https://github.com/graphile/postgraphile/issues/67)
- **postgres:** only show mutations for types that are updatable. ([#73](https://github.com/graphile/postgraphile/issues/73)) ([091b111](https://github.com/graphile/postgraphile/commit/091b111e830ce52c6d29e15c5c5fa739ecde8ea0))

# [1.6.0](https://github.com/graphile/postgraphile/compare/v1.5.1...v1.6.0) (2016-06-15)

### Bug Fixes

- **resolve:** check for empty string ([#65](https://github.com/graphile/postgraphile/issues/65)) ([7b4c73a](https://github.com/graphile/postgraphile/commit/7b4c73a00e9ac17554f4905e4ade47cb7ee85282))
- **server:** throw error for bad auth header ([#71](https://github.com/graphile/postgraphile/issues/71)) ([2faa2a1](https://github.com/graphile/postgraphile/commit/2faa2a1216b06a29ac72efb0f8e57bb14ab50ef3)), closes [#62](https://github.com/graphile/postgraphile/issues/62)

### Features

- **graphql:** add relay mutation types support ([#68](https://github.com/graphile/postgraphile/issues/68)) ([f44ab99](https://github.com/graphile/postgraphile/commit/f44ab99e2ea4d134228a28e0ea6b7da2f2c2e922))

## [1.5.1](https://github.com/graphile/postgraphile/compare/v1.5.0...v1.5.1) (2016-06-07)

### Bug Fixes

- **postgresql:** support for user defined domains ([#64](https://github.com/graphile/postgraphile/issues/64)) ([8283d26](https://github.com/graphile/postgraphile/commit/8283d26f40d61a6f482d26499988e44012771c90))
- **procedure:** convert js arrays to postgres array type ([#58](https://github.com/graphile/postgraphile/issues/58)) ([5e802a3](https://github.com/graphile/postgraphile/commit/5e802a375feaf24fcd2f0746eabee398704527d1))

# [1.5.0](https://github.com/graphile/postgraphile/compare/v1.4.0...v1.5.0) (2016-06-01)

### Bug Fixes

- **graphql:** explicitly check input values for undefined ([#60](https://github.com/graphile/postgraphile/issues/60)) ([ac15f8e](https://github.com/graphile/postgraphile/commit/ac15f8e8ab16acc7a2d56b3b513ba7d55e519bde))

### Features

- **graphql:** add Relay viewer field ([#49](https://github.com/graphile/postgraphile/issues/49)) ([539c29d](https://github.com/graphile/postgraphile/commit/539c29d22852c4c9fb3e99daeb2e031a6925f843))

# [1.4.0](https://github.com/graphile/postgraphile/compare/v1.3.0...v1.4.0) (2016-05-23)

### Features

- add library usage ([#48](https://github.com/graphile/postgraphile/issues/48)) ([43fe123](https://github.com/graphile/postgraphile/commit/43fe1238ea50efd0915eba1d64da00199c9b5878))

# [1.3.0](https://github.com/graphile/postgraphile/compare/v1.2.3...v1.3.0) (2016-05-11)

### Features

- **graphql:** add procedure support ([#41](https://github.com/graphile/postgraphile/issues/41)) ([62f3f51](https://github.com/graphile/postgraphile/commit/62f3f51665546195234f3aff40482a2a04d63438))

## [1.2.3](https://github.com/graphile/postgraphile/compare/v1.2.2...v1.2.3) (2016-05-05)

### Bug Fixes

- **graphql:** remove ID type conflict ([58e05ec](https://github.com/graphile/postgraphile/commit/58e05ec3d263719437dcd242d030e240f879d132))

## [1.2.2](https://github.com/graphile/postgraphile/compare/v1.2.0...v1.2.2) (2016-05-05)

### Bug Fixes

- **graphql:** enum types get cached ([#35](https://github.com/graphile/postgraphile/issues/35)) ([6eb854f](https://github.com/graphile/postgraphile/commit/6eb854f30e9df348eb4067a1377e55a0f388a8d5))
- **postgres:** prevent `error: operator is not unique: smallint[] @> smallint[]` ([15ba071](https://github.com/graphile/postgraphile/commit/15ba071e38000e393041bbb56b16f984c194f9cd))

### Reverts

- Revert "doc(readme): add note on breaking changes" ([19bb494](https://github.com/graphile/postgraphile/commit/19bb4949dd69b9341b6a86dbf15390f17550bbbf))

# [1.2.0](https://github.com/graphile/postgraphile/compare/v1.1.6...v1.2.0) (2016-05-01)

### Features

- **server:** authorization ([#26](https://github.com/graphile/postgraphile/issues/26)) ([1388542](https://github.com/graphile/postgraphile/commit/1388542088f2d7bb783ac245550127ab6764c91d))

## [1.1.6](https://github.com/graphile/postgraphile/compare/v1.1.5...v1.1.6) (2016-05-01)

### Bug Fixes

- **graphql:** column name edge case ([7b4115c](https://github.com/graphile/postgraphile/commit/7b4115cdb06a9b6e14d3473664ebc868eb629f0b))

## [1.1.5](https://github.com/graphile/postgraphile/compare/v1.1.4...v1.1.5) (2016-05-01)

### Bug Fixes

- **package:** add pg connection string as a dependency ([78a8b10](https://github.com/graphile/postgraphile/commit/78a8b106d5a46edc282a27f751918e5a1808a735))

### Features

- **package:** add a clean script ([9fc3773](https://github.com/graphile/postgraphile/commit/9fc37731e1031f58f6de59ccdae93f73c8813257))

## [1.1.4](https://github.com/graphile/postgraphile/compare/v1.1.3...v1.1.4) (2016-05-01)

## [1.1.3](https://github.com/graphile/postgraphile/compare/v1.1.2...v1.1.3) (2016-04-30)

### Bug Fixes

- **graphql:** timestamp and other string type serialization ([#25](https://github.com/graphile/postgraphile/issues/25)) ([85864b1](https://github.com/graphile/postgraphile/commit/85864b1c839c9c991fafac49d20a8b4c044fc3aa))
- **tests:** failing catalog test ([0156b55](https://github.com/graphile/postgraphile/commit/0156b55eee66927682b9eab92281b1593c78d1e6))

## [1.1.2](https://github.com/graphile/postgraphile/compare/v1.1.1...v1.1.2) (2016-04-29)

### Bug Fixes

- **catalog:** broken import ([4bdc2b1](https://github.com/graphile/postgraphile/commit/4bdc2b1ac7d912c304eeac7e10a2844b2276b14e))
- **package:** test before publish ([649eff0](https://github.com/graphile/postgraphile/commit/649eff0fd2820fac1dbe714dd93a21073b881b2d))

## [1.1.1](https://github.com/graphile/postgraphile/compare/v1.0.5...v1.1.1) (2016-04-29)

### Bug Fixes

- **catalog:** fix underscore field name bug ([e76f0df](https://github.com/graphile/postgraphile/commit/e76f0df7a27f159f7e635f1de971cd3982b5804d))

### Features

- **query:** node is no longer a required interface ([#10](https://github.com/graphile/postgraphile/issues/10)) ([b0f89c4](https://github.com/graphile/postgraphile/commit/b0f89c445d796c1e27b6dd346d7b6cce0ea24bcb))

## [1.0.5](https://github.com/graphile/postgraphile/compare/v1.0.4...v1.0.5) (2016-04-27)

### Bug Fixes

- **main:** parse json manifest ([4d7adac](https://github.com/graphile/postgraphile/commit/4d7adac11a26325d36ef16c6c9c4be8f4261ff20))

## [1.0.4](https://github.com/graphile/postgraphile/compare/v1.0.3...v1.0.4) (2016-04-27)

## [1.0.3](https://github.com/graphile/postgraphile/compare/v1.0.2...v1.0.3) (2016-04-23)

### Bug Fixes

- **main:** fix option documentation ([5d4875b](https://github.com/graphile/postgraphile/commit/5d4875b4d5f6718bc04f73bb6b977053e96f3430))

## [1.0.2](https://github.com/graphile/postgraphile/compare/v1.0.1...v1.0.2) (2016-04-23)

### Bug Fixes

- **main:** add shebang to main ([44cb70a](https://github.com/graphile/postgraphile/commit/44cb70a687b2c8186389f858114ab0f9541996a5))

## [1.0.1](https://github.com/graphile/postgraphile/compare/2fef40adfbe1ec931ea06c19fb6dafa7a683c135...v1.0.1) (2016-04-23)

### Bug Fixes

- **tests:** leaking clients ([458c5cd](https://github.com/graphile/postgraphile/commit/458c5cd2b5182f3be8e39d7894741cb66dff6630))
- add client fetching to server ([ea1e2e7](https://github.com/graphile/postgraphile/commit/ea1e2e7518489f32b43aced411225af5f7a74f65))
- add tests to linting ([55f54cf](https://github.com/graphile/postgraphile/commit/55f54cfda093312ec61f85d5deaaf50a37673e18))
- allow test watch to take arguments ([5449723](https://github.com/graphile/postgraphile/commit/544972319dc5c2ec8f3ae6a7397183496be5c4dc))
- column does not have an oid ([c7ffec8](https://github.com/graphile/postgraphile/commit/c7ffec8bc439cbeb3bd472ac5e1acc76041ee95d))
- comment type ([15cb727](https://github.com/graphile/postgraphile/commit/15cb7275a5dab4ba99b336ac2d7310428c180037))
- dist folder ([648d8e7](https://github.com/graphile/postgraphile/commit/648d8e73fe48bb20e0708471bb25428f83ea4b10))
- dist folder ignore ([6965e10](https://github.com/graphile/postgraphile/commit/6965e1037bc9a22bb51928f2fb4ca74f7f14f5ee))
- example schema test usage ([9c3b56a](https://github.com/graphile/postgraphile/commit/9c3b56ae9c6f0b6d437ad41037b59fa9e997d77a))
- fix column enum test ([d273028](https://github.com/graphile/postgraphile/commit/d27302858e61c9ae874562d31f5ef34b4e03e040))
- hidden tests ([67589a6](https://github.com/graphile/postgraphile/commit/67589a666c7e7288ea137cc65698c300449755a4))
- npm bin is added to path ([c8fa39b](https://github.com/graphile/postgraphile/commit/c8fa39b52ec20fa273e96cc1d6a923c95387d40e))
- release client back to the pool on request end ([07de95e](https://github.com/graphile/postgraphile/commit/07de95efdf961817347f2daeac87704eef027470))
- some misc errors ([2fef40a](https://github.com/graphile/postgraphile/commit/2fef40adfbe1ec931ea06c19fb6dafa7a683c135))

### Features

- **graphql:** add delete mutation ([4346654](https://github.com/graphile/postgraphile/commit/4346654bca832a2608c7e4a6a8dc57ba177d643f))
- **graphql:** add relay object identification interface ([e0fe4a9](https://github.com/graphile/postgraphile/commit/e0fe4a94af6361db894090e4b372746a01c9da7c))
- **package:** add json and graphql extensions to tests watch ([25d9945](https://github.com/graphile/postgraphile/commit/25d994559833c22b01ade2f5e11a19f0abaa4012))
- **package:** add release step and binary ([84830e4](https://github.com/graphile/postgraphile/commit/84830e4a35230a6566f9c42e102047a63f185e3f))
- **package:** only publish certain files ([7d26e8e](https://github.com/graphile/postgraphile/commit/7d26e8e17c42138c3db38bd0abbd4bd996c88307))
- **postgres:** catalog now knows about the pg config ([e0c42c9](https://github.com/graphile/postgraphile/commit/e0c42c9e24177591e77e2f01f5e4daa09cde5b05))
- **server:** rename create server file ([6379744](https://github.com/graphile/postgraphile/commit/637974420eb1be9a92bdeb96b0aa8bd2ac303154))
- add conditions to list field resolution ([cf343ad](https://github.com/graphile/postgraphile/commit/cf343ade7797af31d79b0721b5eec1ecb5ed79c4))
- add default orderBy ([562c390](https://github.com/graphile/postgraphile/commit/562c3904fccb15b14495f8923638b7f75e33a470))
- add editor config ([e8faede](https://github.com/graphile/postgraphile/commit/e8faede3cf422232cff35c6135da6014bd59e743))
- add enum type to forum example ([28e6126](https://github.com/graphile/postgraphile/commit/28e612667bae4a21e144356c520b494f583bbd7d))
- add favicon to express http server ([c2caeb0](https://github.com/graphile/postgraphile/commit/c2caeb0091d05260f21d42d994e731cbe2bef9f4))
- add foreign key field ([07f420d](https://github.com/graphile/postgraphile/commit/07f420d03424425a64d8b3f66e2d5f4f16126b56))
- add foreign key support to catalog ([b4eff96](https://github.com/graphile/postgraphile/commit/b4eff96e3dd648f9b250348f8de72a55f50c8a58))
- add oid to all objects ([8e71fcb](https://github.com/graphile/postgraphile/commit/8e71fcbacb381437a1f89de71179ae3cf83a9972))
- add personal TODO file to .gitignore ([8d85c8b](https://github.com/graphile/postgraphile/commit/8d85c8bd674c52824c3a8b09d0bafb3b19f250c2))
- add post example data ([fe0deab](https://github.com/graphile/postgraphile/commit/fe0deabbeff7e25ca75642b8c5b4eceab2408b93))
- add reverse foreign key ([33bc5a7](https://github.com/graphile/postgraphile/commit/33bc5a7964430da9d3b364ce5d6e45d0485d2c83))
- add table insertion ([10ca562](https://github.com/graphile/postgraphile/commit/10ca5625504cc583a9104974f6ad051416591ca9))
- add update mutation ([3c2916e](https://github.com/graphile/postgraphile/commit/3c2916e1d4d99f3484ebe261f20455134da81528))
- have insert mutation follow relay specification ([9957fe9](https://github.com/graphile/postgraphile/commit/9957fe914bedd21ad805a3d99f38aa6580fbe9e0))
- log the stack for errors in development ([680a057](https://github.com/graphile/postgraphile/commit/680a057e67ac78f9d6a97471e131721d38bb8656))
- optimize parallel single resolve calls ([4965954](https://github.com/graphile/postgraphile/commit/4965954d439dfa048cf4ca243eee91949ef64d70))
- restart sequences after manual insertions ([7ed2f27](https://github.com/graphile/postgraphile/commit/7ed2f277e7812c4f5c2eed2f9e90b88b7aad7b25))
