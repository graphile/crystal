# postgraphile

## 5.0.0-0.24

### Patch Changes

- [#207](https://github.com/benjie/postgraphile-private/pull/207)
  [`c850dd4ec`](https://github.com/benjie/postgraphile-private/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'preset.server' to
  'preset.grafserv'.

- [#207](https://github.com/benjie/postgraphile-private/pull/207)
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in subscriptions where
  termination of underlying stream wouldn't terminate the subscription.

- [#206](https://github.com/benjie/postgraphile-private/pull/206)
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/postgraphile-private/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`c850dd4ec`](https://github.com/benjie/postgraphile-private/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e),
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`92c2378f2`](https://github.com/benjie/postgraphile-private/commit/92c2378f297cc917f542b126e1cdddf58e1f0fc3),
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/postgraphile-private/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14
  - grafserv@0.0.1-0.16
  - @dataplan/pg@0.0.1-0.19
  - graphile-build@5.0.0-0.19
  - graphile-build-pg@5.0.0-0.22

## 5.0.0-0.23

### Patch Changes

- [#201](https://github.com/benjie/postgraphile-private/pull/201)
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

- Updated dependencies
  [[`a14bd2288`](https://github.com/benjie/postgraphile-private/commit/a14bd2288532b0977945d1c0508e51baef6dba2b),
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)]:
  - @dataplan/pg@0.0.1-0.18
  - graphile-build@5.0.0-0.18
  - graphile-build-pg@5.0.0-0.21

## 5.0.0-0.22

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - @dataplan/pg@0.0.1-0.17
  - grafast@0.0.1-0.13
  - graphile-build-pg@5.0.0-0.20
  - grafserv@0.0.1-0.15
  - graphile-build@5.0.0-0.17

## 5.0.0-0.21

### Patch Changes

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`1e5671cdb`](https://github.com/benjie/postgraphile-private/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9)
  Thanks [@benjie](https://github.com/benjie)! - Add support for websocket
  GraphQL subscriptions (via graphql-ws) to grafserv and PostGraphile (currently
  supporting Node, Express, Koa and Fastify)

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`5b634a78e`](https://github.com/benjie/postgraphile-private/commit/5b634a78e51816071447aceb1edfb813d77d563b)
  Thanks [@benjie](https://github.com/benjie)! - Standardize on `serv.addTo`
  interface, even for Node

- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`e11698473`](https://github.com/benjie/postgraphile-private/commit/e1169847303790570bfafa07eb25d8fce53a0391),
  [`1e5671cdb`](https://github.com/benjie/postgraphile-private/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9),
  [`fb40bd97b`](https://github.com/benjie/postgraphile-private/commit/fb40bd97b8a36da91c6b08e0ce67f1a9419ad91f),
  [`a1158d83e`](https://github.com/benjie/postgraphile-private/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14),
  [`5b634a78e`](https://github.com/benjie/postgraphile-private/commit/5b634a78e51816071447aceb1edfb813d77d563b),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - @dataplan/pg@0.0.1-0.16
  - grafast@0.0.1-0.12
  - ruru@2.0.0-0.10
  - grafserv@0.0.1-0.14
  - graphile-build@5.0.0-0.16
  - graphile-build-pg@5.0.0-0.19

## 5.0.0-0.20

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#196](https://github.com/benjie/postgraphile-private/pull/196)
  [`af9bc38c8`](https://github.com/benjie/postgraphile-private/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7)
  Thanks [@benjie](https://github.com/benjie)! - Allow passing `pool` directly
  to `makePgConfig`.

- [#190](https://github.com/benjie/postgraphile-private/pull/190)
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)
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

- [#192](https://github.com/benjie/postgraphile-private/pull/192)
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)
  Thanks [@benjie](https://github.com/benjie)! - - Conflicts in `pgConfigs`
  (e.g. multiple sources using the same 'name') now detected and output
  - Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
  - `makePgConfig` now allows passing `pgSettings` callback and
    `pgSettingsForIntrospection` config object
  - Multiple postgres sources now works nicely with multiple `makePgConfig`
    calls
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`af9bc38c8`](https://github.com/benjie/postgraphile-private/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876),
  [`752ec9c51`](https://github.com/benjie/postgraphile-private/commit/752ec9c516add7c4617b426e97eccd1d4e5b7833),
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)]:
  - @dataplan/pg@0.0.1-0.15
  - grafast@0.0.1-0.11
  - grafserv@0.0.1-0.13
  - graphile-build@5.0.0-0.15
  - graphile-build-pg@5.0.0-0.18
  - graphile-config@0.0.1-0.5
  - pg-introspection@0.0.1-0.3
  - ruru@2.0.0-0.9

## 5.0.0-0.19

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

- Updated dependencies [[`72bf5f535`](undefined)]:
  - graphile-build@5.0.0-0.14
  - graphile-build-pg@5.0.0-0.17

## 5.0.0-0.18

### Patch Changes

- [#184](https://github.com/benjie/postgraphile-private/pull/184)
  [`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)
  Thanks [@benjie](https://github.com/benjie)! - Handle array-to-object issue in
  graphile-config when multiple presets set an array key.
- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10
  - grafserv@0.0.1-0.12
  - ruru@2.0.0-0.8
  - graphile-build@5.0.0-0.13
  - graphile-build-pg@5.0.0-0.16
  - @dataplan/pg@0.0.1-0.14

## 5.0.0-0.17

### Patch Changes

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`ebb24895c`](https://github.com/benjie/postgraphile-private/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug when handling stable
  void functions

- [#181](https://github.com/benjie/postgraphile-private/pull/181)
  [`d3cba220c`](https://github.com/benjie/postgraphile-private/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65)
  Thanks [@benjie](https://github.com/benjie)! - `*FieldName` smart tags are now
  used verbatim rather than being piped through `inflection.camelCase(...)` -
  you've explicitly stated a 'field name' so we should use that. This may be a
  breaking change for you if your field names are currently different
  before/after they are camelCase'd.

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

- Updated dependencies
  [[`ebb24895c`](https://github.com/benjie/postgraphile-private/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005),
  [`d3cba220c`](https://github.com/benjie/postgraphile-private/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65),
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)]:
  - graphile-build-pg@5.0.0-0.15
  - graphile-build@5.0.0-0.12

## 5.0.0-0.16

### Patch Changes

- [#178](https://github.com/benjie/postgraphile-private/pull/178)
  [`1b040b3ba`](https://github.com/benjie/postgraphile-private/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0)
  Thanks [@benjie](https://github.com/benjie)! - `@omit` and similar smart tags
  are now processed on `@foreignKey` and other fake constraints.

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb)
  Thanks [@benjie](https://github.com/benjie)! - Better graphile.config.\*
  compatibility with ESM-emulation, so 'export default preset;' should work in
  TypeScript even if outputting to CommonJS.

- [#177](https://github.com/benjie/postgraphile-private/pull/177)
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e)
  Thanks [@benjie](https://github.com/benjie)! - `@foreignFieldName` smart tag
  is now fed into the `inflection.connectionField(...)` or
  `inflection.listField(...)` inflector as appropriate. If you are using
  `@foreignSimpleFieldName` you may be able to delete that now; alternatively
  you should consider renaming `@foreignFieldName` to
  `@foreignConnectionFieldName` for consistency.
- Updated dependencies
  [[`1b040b3ba`](https://github.com/benjie/postgraphile-private/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0),
  [`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-build-pg@5.0.0-0.14
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9
  - grafserv@0.0.1-0.11
  - graphile-build@5.0.0-0.11
  - ruru@2.0.0-0.7
  - @dataplan/pg@0.0.1-0.13

## 5.0.0-0.15

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - @dataplan/pg@0.0.1-0.12
  - grafserv@0.0.1-0.10
  - graphile-build@5.0.0-0.10
  - graphile-build-pg@5.0.0-0.13

## 5.0.0-0.14

### Patch Changes

- [`af9f11f28`](https://github.com/benjie/postgraphile-private/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3)
  Thanks [@benjie](https://github.com/benjie)! - 'preset.pgSources' renamed to
  'preset.pgConfigs' to avoid confusion with PgSource class and
  'input.pgSources' used for build.

- [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

- [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)
  Thanks [@benjie](https://github.com/benjie)! - Add new
  `--superuser-connection` option to allow installing watch fixtures as
  superuser.

- [`f7d885527`](https://github.com/benjie/postgraphile-private/commit/f7d8855276c3ab0bbcaf8505a1f2f6e872d53128)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in server startup
  message where preset.server.graphqlPath was not respected.
- Updated dependencies
  [[`af9f11f28`](https://github.com/benjie/postgraphile-private/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3),
  [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a),
  [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)]:
  - graphile-build-pg@5.0.0-0.12
  - graphile-build@5.0.0-0.9
  - @dataplan/pg@0.0.1-0.11

## 5.0.0-0.13

### Patch Changes

- Updated dependencies [[`a40fa6966`](undefined), [`677c8f5fc`](undefined),
  [`8f04af08d`](https://github.com/benjie/postgraphile-private/commit/8f04af08da68baf7b2b4d508eac0d2a57064da7b)]:
  - ruru@2.0.0-0.6
  - graphile-build@5.0.0-0.8
  - graphile-build-pg@5.0.0-0.11
  - pg-introspection@0.0.1-0.2
  - grafserv@0.0.1-0.9
  - grafast@0.0.1-0.7
  - @dataplan/pg@0.0.1-0.10

## 5.0.0-0.12

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET
- Updated dependencies [[`c4213e91d`](undefined)]:
  - @dataplan/pg@0.0.1-0.9
  - grafserv@0.0.1-0.8
  - graphile-build-pg@5.0.0-0.10

## 5.0.0-0.11

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - @dataplan/pg@0.0.1-0.8
  - grafast@0.0.1-0.6
  - grafserv@0.0.1-0.7
  - ruru@2.0.0-0.5
  - graphile-build@5.0.0-0.7
  - graphile-build-pg@5.0.0-0.9
  - graphile-config@0.0.1-0.2
  - pg-introspection@0.0.1-0.1

## 5.0.0-0.10

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.8
  - @dataplan/pg@0.0.1-0.7
  - grafserv@0.0.1-0.6
  - graphile-build@5.0.0-0.6

## 5.0.0-0.9

### Patch Changes

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/pg@0.0.1-0.6
  - grafast@0.0.1-0.4
  - grafserv@0.0.1-0.5
  - ruru@2.0.0-0.4
  - graphile-build@5.0.0-0.5
  - graphile-export@0.0.2-0.4
  - graphile-build-pg@5.0.0-0.7

## 5.0.0-0.8

### Patch Changes

- Updated dependencies [[`0983df3f6`](undefined)]:
  - ruru@2.0.0-0.3
  - grafserv@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.6
  - @dataplan/pg@0.0.1-0.5

## 5.0.0-0.7

### Patch Changes

- [`d7b87b325`](undefined) - Fix importing presets

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`9ebe3d860`](undefined)]:
  - @dataplan/pg@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.6

## 5.0.0-0.5

### Patch Changes

- Updated dependencies [[`bf83f591d`](undefined)]:
  - @dataplan/pg@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.5

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - @dataplan/pg@0.0.1-0.3
  - grafast@0.0.1-0.3
  - grafserv@0.0.1-0.3
  - ruru@2.0.0-0.2
  - graphile-build@5.0.0-0.4
  - graphile-build-pg@5.0.0-0.4
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`6576bd37b`](undefined), [`25037fc15`](undefined)]:
  - ruru@2.0.0-0.1
  - @dataplan/pg@0.0.1-0.2
  - grafast@0.0.1-0.2
  - grafserv@0.0.1-0.2
  - graphile-build-pg@5.0.0-0.3
  - graphile-build@5.0.0-0.3
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - @dataplan/pg@0.0.1-0.1
  - grafast@0.0.1-0.1
  - graphile-build-pg@5.0.0-0.2
  - grafserv@0.0.1-0.1
  - graphile-build@5.0.0-0.2
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - ruru@2.0.0-0.0
  - @dataplan/pg@0.0.1-0.0
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - grafserv@0.0.1-0.0
  - graphile-build@5.0.0-0.1
  - graphile-build-pg@5.0.0-0.1
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
