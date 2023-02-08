# postgraphile

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
