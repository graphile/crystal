# pg-sql2

## 5.0.0-1.1

### Patch Changes

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`f93c79b94`](https://github.com/benjie/postgraphile-private/commit/f93c79b94eb93ae04b1b2e0478f5106e1aca8ee2)
  Thanks [@benjie](https://github.com/benjie)! - Experimental: expose
  `symbolToIdentifier` on `sql.compile()` result (via special
  `$symbolToIdentifier` symbol key) so you can determine which identifiers were
  used for which symbols.

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`53e164cbc`](https://github.com/benjie/postgraphile-private/commit/53e164cbca7eaf1e6e03c849ac1bbe1789c61105)
  Thanks [@benjie](https://github.com/benjie)! - When the same `sql.value()`
  node is used in multiple places, it will now be replaced with the same
  placeholder (`$1`, etc).
- Updated dependencies
  [[`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)]:
  - @graphile/lru@5.0.0-1.1

## 5.0.0-0.4

### Patch Changes

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf)
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

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - @graphile/lru@5.0.0-0.1
