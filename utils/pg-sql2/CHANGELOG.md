# pg-sql2

## 5.0.0-rc.1

### Patch Changes

- [#2740](https://github.com/graphile/crystal/pull/2740)
  [`31b388c`](https://github.com/graphile/crystal/commit/31b388c6d5546640af7dcf4e6021643e47892ed1)
  Thanks [@benjie](https://github.com/benjie)! - Support more comment strings.

- [#2746](https://github.com/graphile/crystal/pull/2746)
  [`930240a`](https://github.com/graphile/crystal/commit/930240a4a7d3373f5691d495df752bb8fedac2af)
  Thanks [@jemgillam](https://github.com/jemgillam)! - New:
  `sql.comment("...", true)` forces comments to be included, even in production.

- [`8a5a7c5`](https://github.com/graphile/crystal/commit/8a5a7c536fc4b9b702600c5cc3d413724670c327)
  Thanks [@benjie](https://github.com/benjie)! - Bump to release candidate

- Updated dependencies
  [[`8a5a7c5`](https://github.com/graphile/crystal/commit/8a5a7c536fc4b9b702600c5cc3d413724670c327)]:
  - @graphile/lru@5.0.0-rc.1

## 5.0.0-beta.9

### Patch Changes

- [#2434](https://github.com/graphile/crystal/pull/2434)
  [`5a26196eff8fd1956d73e0b8fdf5cfcb7f01b7d3`](https://github.com/graphile/crystal/commit/5a26196eff8fd1956d73e0b8fdf5cfcb7f01b7d3)
  Thanks [@benjie](https://github.com/benjie)! - `util.inspect(someSql)` will
  now output a much nicer string

- [#2482](https://github.com/graphile/crystal/pull/2482)
  [`459e1869a2ec58925b2bac5458af487c52a8ca37`](https://github.com/graphile/crystal/commit/459e1869a2ec58925b2bac5458af487c52a8ca37)
  Thanks [@benjie](https://github.com/benjie)! - Minimum version of Node.js
  bumped to Node 22 (the latest LTS).

- [#2450](https://github.com/graphile/crystal/pull/2450)
  [`a87bbd76f1a8b60fd86de65922746d830cc160b4`](https://github.com/graphile/crystal/commit/a87bbd76f1a8b60fd86de65922746d830cc160b4)
  Thanks [@benjie](https://github.com/benjie)! - Type-only tweak

- [#2525](https://github.com/graphile/crystal/pull/2525)
  [`c9cd0cc72a4db4b02b2bdf770161c9346cb4b174`](https://github.com/graphile/crystal/commit/c9cd0cc72a4db4b02b2bdf770161c9346cb4b174)
  Thanks [@benjie](https://github.com/benjie)! - `sql.getIdentifierSymbol(node)`
  method added to extract a symbol from an identifier node (if a node is an
  identifier node, otherwise return `null`).
- Updated dependencies
  [[`459e1869a2ec58925b2bac5458af487c52a8ca37`](https://github.com/graphile/crystal/commit/459e1869a2ec58925b2bac5458af487c52a8ca37)]:
  - @graphile/lru@5.0.0-beta.4

## 5.0.0-beta.8

### Patch Changes

- [#2329](https://github.com/graphile/crystal/pull/2329)
  [`e10c372dafbe0d6014b1e946349b22f40aa87ef9`](https://github.com/graphile/crystal/commit/e10c372dafbe0d6014b1e946349b22f40aa87ef9)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug causing unhelpful throw
  on $type optimization on null - instead pass through to more helpful throw.

- [#2341](https://github.com/graphile/crystal/pull/2341)
  [`3b0f5082b2272997ce33ce8823a4752513d19e28`](https://github.com/graphile/crystal/commit/3b0f5082b2272997ce33ce8823a4752513d19e28)
  Thanks [@benjie](https://github.com/benjie)! - Some of the pg-sql2 inputs are
  now marked Readonly to indicate we won't mutate them.

- [#2320](https://github.com/graphile/crystal/pull/2320)
  [`3789326b2e2fdb86519acc75e606c752ddefe590`](https://github.com/graphile/crystal/commit/3789326b2e2fdb86519acc75e606c752ddefe590)
  Thanks [@benjie](https://github.com/benjie)! - Add new `withTransformer`
  functionality to enable embedding of non-SQL values into PgSQL fragments, for
  improved user ergonomics.

- [#2384](https://github.com/graphile/crystal/pull/2384)
  [`412b92a0b1e03ad962521f630b57a996d8620cf6`](https://github.com/graphile/crystal/commit/412b92a0b1e03ad962521f630b57a996d8620cf6)
  Thanks [@benjie](https://github.com/benjie)! - Small optimization/fix to
  `arraysMatch` function.

## 5.0.0-beta.7

### Patch Changes

- [#2250](https://github.com/graphile/crystal/pull/2250)
  [`7bf045282`](https://github.com/graphile/crystal/commit/7bf04528264c3b9c509f148253fed96d3394141d)
  Thanks [@benjie](https://github.com/benjie)! - Export version number.

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
