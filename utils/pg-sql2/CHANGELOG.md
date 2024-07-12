# pg-sql2

## 5.0.0-beta.6

### Patch Changes

- [#1994](https://github.com/graphile/crystal/pull/1994)
  [`ab08cbf9c`](https://github.com/graphile/crystal/commit/ab08cbf9c504c3cc22495a99a965e7634c18a6a3)
  Thanks [@benjie](https://github.com/benjie)! - Introduce
  `interface SQLable {[$toSQL](): SQL}` to `pg-sql2` and use it to simplify SQL
  fragments in various places.

- [#1973](https://github.com/graphile/crystal/pull/1973)
  [`94a05064e`](https://github.com/graphile/crystal/commit/94a05064ea05108685ff71174a9f871ab5b4c147)
  Thanks [@benjie](https://github.com/benjie)! - Fix processing of GRAPHILE_ENV
  to allow "test"

## 5.0.0-beta.5

### Patch Changes

- [#1924](https://github.com/graphile/crystal/pull/1924)
  [`ef44c29b2`](https://github.com/graphile/crystal/commit/ef44c29b24a1ad5a042ae1536a4546dd64b17195)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 TypeScript is now configured
  to hide interfaces marked as `@internal`. This may result in a few errors
  where you're accessing things you oughtn't be, but also may hide some
  interfaces that should be exposed - please file an issue if an API you were
  dependent on has been removed from the TypeScript typings. If that API happens
  to be `step.dependencies`; you should first read this:
  https://benjie.dev/graphql/ancestors

## 5.0.0-beta.4

### Patch Changes

- [`2805edc68`](https://github.com/graphile/crystal/commit/2805edc68b90546bf71ffd293af4d87a79345825)
  Thanks [@benjie](https://github.com/benjie)! - Don't freeze object, so that it
  can be annotated as exportable.

## 5.0.0-beta.3

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

- Updated dependencies
  [[`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)]:
  - @graphile/lru@5.0.0-beta.3

## 5.0.0-beta.2

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

- Updated dependencies
  [[`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)]:
  - @graphile/lru@5.0.0-beta.2

## 5.0.0-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

- Updated dependencies
  [[`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)]:
  - @graphile/lru@5.0.0-beta.1

## 5.0.0-alpha.3

### Patch Changes

- [#370](https://github.com/benjie/crystal/pull/370)
  [`339fe20d0`](https://github.com/benjie/crystal/commit/339fe20d0c6e8600d263ce8093cd85a6ea8adbbf)
  Thanks [@benjie](https://github.com/benjie)! - Allow multiple instances of
  pg-sql2 and tamedevil to help handle package manager shenanigans.

## 5.0.0-alpha.2

### Patch Changes

- [`82cc01152`](https://github.com/benjie/crystal/commit/82cc01152ee06dafce45299661afd77ad943d785)
  Thanks [@benjie](https://github.com/benjie)! - Performance overhaul and new
  cache method.

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`98ae00f59`](https://github.com/benjie/crystal/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)]:
  - @graphile/lru@5.0.0-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - @graphile/lru@5.0.0-alpha.1

## 5.0.0-1.1

### Patch Changes

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#270](https://github.com/benjie/crystal/pull/270)
  [`f93c79b94`](https://github.com/benjie/crystal/commit/f93c79b94eb93ae04b1b2e0478f5106e1aca8ee2)
  Thanks [@benjie](https://github.com/benjie)! - Experimental: expose
  `symbolToIdentifier` on `sql.compile()` result (via special
  `$symbolToIdentifier` symbol key) so you can determine which identifiers were
  used for which symbols.

- [#270](https://github.com/benjie/crystal/pull/270)
  [`53e164cbc`](https://github.com/benjie/crystal/commit/53e164cbca7eaf1e6e03c849ac1bbe1789c61105)
  Thanks [@benjie](https://github.com/benjie)! - When the same `sql.value()`
  node is used in multiple places, it will now be replaced with the same
  placeholder (`$1`, etc).
- Updated dependencies
  [[`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)]:
  - @graphile/lru@5.0.0-1.1

## 5.0.0-0.4

### Patch Changes

- [#257](https://github.com/benjie/crystal/pull/257)
  [`8f323bdc8`](https://github.com/benjie/crystal/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf)
  Thanks [@benjie](https://github.com/benjie)! - When multiple versions of
  grafast or pg-sql2 are detected, a warning will be raised.

## 5.0.0-0.3

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

## 5.0.0-0.2

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
