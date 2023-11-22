# graphile-config

## 0.0.1-beta.4

### Patch Changes

- [`7aef73319`](https://github.com/graphile/crystal/commit/7aef73319a8a147c700727be62427e1eefdefbf8)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript tweak to use
  readonly array in one place.

## 0.0.1-beta.3

### Patch Changes

- [#514](https://github.com/graphile/crystal-pre-merge/pull/514)
  [`c9848f693`](https://github.com/graphile/crystal-pre-merge/commit/c9848f6936a5abd7740c0638bfb458fb5551f03b)
  Thanks [@benjie](https://github.com/benjie)! - Update package.json repository
  information

## 0.0.1-beta.2

### Patch Changes

- [#496](https://github.com/benjie/crystal/pull/496)
  [`c9bfd9892`](https://github.com/benjie/crystal/commit/c9bfd989247f9433fb5b18c5175c9d8d64cd21a1)
  Thanks [@benjie](https://github.com/benjie)! - Update dependencies (sometimes
  through major versions).

## 0.0.1-beta.1

### Patch Changes

- [`cbd987385`](https://github.com/benjie/crystal/commit/cbd987385f99bd1248bc093ac507cc2f641ba3e8)
  Thanks [@benjie](https://github.com/benjie)! - Bump all packages to beta

## 0.0.1-alpha.7

### Patch Changes

- [#438](https://github.com/benjie/crystal/pull/438)
  [`a22830b2f`](https://github.com/benjie/crystal/commit/a22830b2f293b50a244ac18e1601d7579b450c7d)
  Thanks [@benjie](https://github.com/benjie)! - Plugin name now automatically
  used in `provides` for every hook, allowing ordering hooks before/after their
  equivalents in other plugins.

## 0.0.1-alpha.6

### Patch Changes

- [#408](https://github.com/benjie/crystal/pull/408)
  [`675b7abb9`](https://github.com/benjie/crystal/commit/675b7abb93e11d955930b9026fb0b65a56ecc999)
  Thanks [@benjie](https://github.com/benjie)! - `inspect()` fallback function
  updated

- [#408](https://github.com/benjie/crystal/pull/408)
  [`c5050dd28`](https://github.com/benjie/crystal/commit/c5050dd286bd6d9fa4a5d9cfbf87ba609cb148dd)
  Thanks [@benjie](https://github.com/benjie)! - Warn if plugins could not be
  disabled (due to not being specified).

- [#408](https://github.com/benjie/crystal/pull/408)
  [`0d1782869`](https://github.com/benjie/crystal/commit/0d1782869adc76f5bbcecfdcbb85a258c468ca37)
  Thanks [@benjie](https://github.com/benjie)! - Only eat ENOENT errors when
  checking for file existance, other errors should still throw.

## 0.0.1-alpha.5

### Patch Changes

- [#402](https://github.com/benjie/crystal/pull/402)
  [`644938276`](https://github.com/benjie/crystal/commit/644938276ebd48c5486ba9736a525fcc66d7d714)
  Thanks [@benjie](https://github.com/benjie)! - Use `file://` URLs in import()
  to fix compatibility with Windows (e.g. when loading `graphile.config.mjs`)

## 0.0.1-alpha.4

### Patch Changes

- [#349](https://github.com/benjie/crystal/pull/349)
  [`198ac74d5`](https://github.com/benjie/crystal/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25)
  Thanks [@benjie](https://github.com/benjie)! - Add 'sortedPlugins' export to
  graphile-config.

## 0.0.1-alpha.3

### Patch Changes

- [#344](https://github.com/benjie/crystal/pull/344)
  [`adc7ae5e0`](https://github.com/benjie/crystal/commit/adc7ae5e002961c8b8286500527752f21139ab9e)
  Thanks [@benjie](https://github.com/benjie)! - Detect presets that look like
  plugins and vice versa and throw error.

## 0.0.1-alpha.2

### Patch Changes

- [`7f857950a`](https://github.com/benjie/crystal/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

## 0.0.1-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/crystal/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

## 0.0.1-1.2

### Patch Changes

- [#297](https://github.com/benjie/crystal/pull/297)
  [`b4eaf89f4`](https://github.com/benjie/crystal/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)
  Thanks [@benjie](https://github.com/benjie)! - AsyncHooks can now execute
  synchronously if all registered hooks are synchronous. May impact ordering of
  fields/types in GraphQL schema.

## 0.0.1-1.1

### Patch Changes

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

## 0.0.1-0.6

### Patch Changes

- [#233](https://github.com/benjie/crystal/pull/233)
  [`11e7c12c5`](https://github.com/benjie/crystal/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

## 0.0.1-0.5

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

## 0.0.1-0.4

### Patch Changes

- [#184](https://github.com/benjie/crystal/pull/184)
  [`842f6ccbb`](https://github.com/benjie/crystal/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)
  Thanks [@benjie](https://github.com/benjie)! - Handle array-to-object issue in
  graphile-config when multiple presets set an array key.

## 0.0.1-0.3

### Patch Changes

- [#176](https://github.com/benjie/crystal/pull/176)
  [`19e2961de`](https://github.com/benjie/crystal/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb)
  Thanks [@benjie](https://github.com/benjie)! - Better graphile.config.\*
  compatibility with ESM-emulation, so 'export default preset;' should work in
  TypeScript even if outputting to CommonJS.

- [#176](https://github.com/benjie/crystal/pull/176)
  [`11d6be65e`](https://github.com/benjie/crystal/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)
  Thanks [@benjie](https://github.com/benjie)! - Fix issue with plugin
  versioning. Add more TSDoc comments. New getTerminalWidth() helper.

## 0.0.1-0.2

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

## 0.0.1-0.1

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release
