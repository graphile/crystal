# graphile-build-pg

## 5.0.0-0.12

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
- Updated dependencies
  [[`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a),
  [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)]:
  - graphile-build@5.0.0-0.9
  - @dataplan/pg@0.0.1-0.11

## 5.0.0-0.11

### Patch Changes

- [`677c8f5fc`](undefined) - Create new getTags() introspection helper and use
  it. Rename GraphileBuild.GraphileBuildSchemaOptions to
  GraphileBuild.SchemaOptions. Fix a couple minor inflection bugs. Add some
  missing descriptions. Fix the initial inflection types to not leak
  implementation details. Fix inflectors to use ResolvedPreset rather than
  Preset.
- Updated dependencies [[`4ca7fce12`](undefined), [`677c8f5fc`](undefined)]:
  - tamedevil@0.0.0-0.3
  - graphile-build@5.0.0-0.8
  - pg-introspection@0.0.1-0.2
  - grafast@0.0.1-0.7
  - @dataplan/pg@0.0.1-0.10

## 5.0.0-0.10

### Patch Changes

- Updated dependencies [[`c4213e91d`](undefined)]:
  - @dataplan/pg@0.0.1-0.9

## 5.0.0-0.9

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - @dataplan/pg@0.0.1-0.8
  - grafast@0.0.1-0.6
  - graphile-build@5.0.0-0.7
  - graphile-config@0.0.1-0.2
  - pg-introspection@0.0.1-0.1
  - pg-sql2@5.0.0-0.2
  - tamedevil@0.0.0-0.2

## 5.0.0-0.8

### Patch Changes

- [`cd37fd02a`](undefined) - Introduce new tamedevil package for managing JIT
  code

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - tamedevil@0.0.0-0.1
  - @dataplan/pg@0.0.1-0.7
  - graphile-build@5.0.0-0.6

## 5.0.0-0.7

### Patch Changes

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/pg@0.0.1-0.6
  - grafast@0.0.1-0.4
  - graphile-build@5.0.0-0.5
  - graphile-export@0.0.2-0.4

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`9ebe3d860`](undefined)]:
  - @dataplan/pg@0.0.1-0.5

## 5.0.0-0.5

### Patch Changes

- Updated dependencies [[`bf83f591d`](undefined)]:
  - @dataplan/pg@0.0.1-0.4

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - @dataplan/pg@0.0.1-0.3
  - grafast@0.0.1-0.3
  - graphile-build@5.0.0-0.4
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - @dataplan/pg@0.0.1-0.2
  - grafast@0.0.1-0.2
  - graphile-build@5.0.0-0.3
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - @dataplan/pg@0.0.1-0.1
  - grafast@0.0.1-0.1
  - graphile-build@5.0.0-0.2
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @dataplan/pg@0.0.1-0.0
  - grafast@0.0.1-0.0
  - graphile-build@5.0.0-0.1
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
  - pg-introspection@0.0.1-0.0
