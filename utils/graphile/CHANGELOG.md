# graphile

## 5.0.0-alpha.4

### Patch Changes

- Updated dependencies
  [[`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25)]:
  - graphile-config@0.0.1-alpha.4

## 5.0.0-alpha.3

### Patch Changes

- Updated dependencies
  [[`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - graphile-config@0.0.1-alpha.3

## 5.0.0-alpha.2

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)]:
  - graphile-config@0.0.1-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - graphile-config@0.0.1-alpha.1

## 5.0.0-1.3

### Patch Changes

- Updated dependencies
  [[`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - graphile-config@0.0.1-1.2

## 5.0.0-1.2

### Patch Changes

- [#291](https://github.com/benjie/postgraphile-private/pull/291)
  [`611f00140`](https://github.com/benjie/postgraphile-private/commit/611f00140d7f5b0620e274fc21869ec82055e080)
  Thanks [@benjie](https://github.com/benjie)! - New `graphile inflection list`
  command to list the available inflectors (and their docs/types) based on your
  plugins and presets.

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
  [[`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)]:
  - graphile-config@0.0.1-1.1

## 5.0.0-0.7

### Patch Changes

- [`dad8c0695`](undefined) - Fix bug in 'graphile config print' where plugins
  weren't treated as providing themselves.

## 5.0.0-0.6

### Patch Changes

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6

## 5.0.0-0.5

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`d94f0eae6`](https://github.com/benjie/postgraphile-private/commit/d94f0eae68013fbf146187d40aaecdacefeea639)
  Thanks [@benjie](https://github.com/benjie)! - Strip 'undefined' values from
  'graphile config print'

## 5.0.0-0.4

### Patch Changes

- Updated dependencies [[`0ab95d0b1`](undefined)]:
  - graphile-config@0.0.1-0.5

## 5.0.0-0.3

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4

## 5.0.0-0.2

### Patch Changes

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`dc4ff1268`](https://github.com/benjie/postgraphile-private/commit/dc4ff12681eeaef3a493fea5481e31f13c9f1874)
  Thanks [@benjie](https://github.com/benjie)! - Enhance config printing with
  full description printer and plugin ordering debugger

## 5.0.0-0.1

### Patch Changes

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`7c89c2143`](https://github.com/benjie/postgraphile-private/commit/7c89c2143c73408ec63caabd68634f77f2b48511)
  Thanks [@benjie](https://github.com/benjie)! - Introduce 'graphile' command
  with two config-related subcommands: 'graphile config print' and 'graphile
  config options'.
- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3
