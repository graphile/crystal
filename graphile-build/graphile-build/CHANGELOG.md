# graphile-build

## 5.0.0-0.12

### Patch Changes

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

## 5.0.0-0.11

### Patch Changes

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.
- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9

## 5.0.0-0.10

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8

## 5.0.0-0.9

### Patch Changes

- [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

## 5.0.0-0.8

### Patch Changes

- [`677c8f5fc`](undefined) - Create new getTags() introspection helper and use
  it. Rename GraphileBuild.GraphileBuildSchemaOptions to
  GraphileBuild.SchemaOptions. Fix a couple minor inflection bugs. Add some
  missing descriptions. Fix the initial inflection types to not leak
  implementation details. Fix inflectors to use ResolvedPreset rather than
  Preset.
- Updated dependencies []:
  - grafast@0.0.1-0.7

## 5.0.0-0.7

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - graphile-config@0.0.1-0.2

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5

## 5.0.0-0.5

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4
  - graphile-export@0.0.2-0.4

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`25037fc15`](undefined)]:
  - grafast@0.0.1-0.2
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
