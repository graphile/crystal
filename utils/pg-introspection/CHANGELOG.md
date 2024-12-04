# pg-introspection

## 0.0.1-beta.10

### Patch Changes

- [#2256](https://github.com/graphile/crystal/pull/2256)
  [`dc5746594`](https://github.com/graphile/crystal/commit/dc5746594d7870a13296f405f4327f89d17dac1e)
  Thanks [@benjie](https://github.com/benjie)! - Add support for introspecting
  RLS policies.

## 0.0.1-beta.9

### Patch Changes

- [#2202](https://github.com/graphile/crystal/pull/2202)
  [`2efadc0f8`](https://github.com/graphile/crystal/commit/2efadc0f80c3a0c172fb94c770afecc5447e832b)
  Thanks [@benjie](https://github.com/benjie)! - Postgres v17 support

## 0.0.1-beta.8

### Patch Changes

- [#1962](https://github.com/graphile/crystal/pull/1962)
  [`7606a5b87`](https://github.com/graphile/crystal/commit/7606a5b87aed747fad4eb11744ef7b01cfa3b879)
  Thanks [@DanielFGray](https://github.com/DanielFGray)! - Export PgEntity type
  in pg-introspection

## 0.0.1-beta.7

### Patch Changes

- [#1943](https://github.com/graphile/crystal/pull/1943)
  [`46d8289b4`](https://github.com/graphile/crystal/commit/46d8289b44ab10aea1ff3d2915184650d6896b81)
  Thanks [@benjie](https://github.com/benjie)! - `pg-introspection` now exports
  `reservedWords` which are a list of reserved keywords in PostgreSQL (in
  uppercase; though SQL is case insensitive).

## 0.0.1-beta.6

### Patch Changes

- [#1927](https://github.com/graphile/crystal/pull/1927)
  [`00d32d887`](https://github.com/graphile/crystal/commit/00d32d887a6ae01374a4fda1babab7c8f14832c0)
  Thanks [@benjie](https://github.com/benjie)! - Excludes table constraints on
  tables from extensions if configured to not include extensions.

- [#1927](https://github.com/graphile/crystal/pull/1927)
  [`c62eee10b`](https://github.com/graphile/crystal/commit/c62eee10b445f9455bf2a0524ad2b828bdf4ffa6)
  Thanks [@benjie](https://github.com/benjie)! - Add pg_am to pg-introspection
  to enable determining index access method

## 0.0.1-beta.5

### Patch Changes

- [#1894](https://github.com/graphile/crystal/pull/1894)
  [`7851d89ab`](https://github.com/graphile/crystal/commit/7851d89ab4216b0252583f0068a69900fa2ddc88)
  Thanks [@benjie](https://github.com/benjie)! - Fix logic around RBAC
  permissions for tables and sequences.

- [#1893](https://github.com/graphile/crystal/pull/1893)
  [`470ee4000`](https://github.com/graphile/crystal/commit/470ee40008689de7cf6f206a9897abbe4891ff9b)
  Thanks [@benjie](https://github.com/benjie)! - Import latest PG16 docs into
  pg-introspection

## 0.0.1-beta.4

### Patch Changes

- [#1801](https://github.com/graphile/crystal/pull/1801)
  [`2d447a6b4`](https://github.com/graphile/crystal/commit/2d447a6b45d7db2813bd957f412cd959e2185759)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug where the owner of a
  database object wasn't seen as having any privileges.

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

## 0.0.1-alpha.4

### Patch Changes

- [#408](https://github.com/benjie/crystal/pull/408)
  [`bc14d488d`](https://github.com/benjie/crystal/commit/bc14d488d5385f350b6d377716e43c46a405dc57)
  Thanks [@benjie](https://github.com/benjie)! - When sorting, specify a
  concrete locale to localeCompare to ensure stable ordering across machines.

## 0.0.1-alpha.3

### Patch Changes

- [#386](https://github.com/benjie/crystal/pull/386)
  [`8230fcaeb`](https://github.com/benjie/crystal/commit/8230fcaeb0286c905fc0dad4b7af2d94bac88a44)
  Thanks [@benjie](https://github.com/benjie)! - If an issue occurs whilst
  retrieving attributes for a constraint, we now log an error and return an
  empty array.

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

## 0.0.1-1.1

### Patch Changes

- [#260](https://github.com/benjie/crystal/pull/260)
  [`d5312e6b9`](https://github.com/benjie/crystal/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

## 0.0.1-0.3

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

## 0.0.1-0.2

### Patch Changes

- [`677c8f5fc`](undefined) - Create new getTags() introspection helper and use
  it. Rename GraphileBuild.GraphileBuildSchemaOptions to
  GraphileBuild.SchemaOptions. Fix a couple minor inflection bugs. Add some
  missing descriptions. Fix the initial inflection types to not leak
  implementation details. Fix inflectors to use ResolvedPreset rather than
  Preset.

## 0.0.1-0.1

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/crystal/pull/125)
  [`91f2256b3`](https://github.com/benjie/crystal/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release
