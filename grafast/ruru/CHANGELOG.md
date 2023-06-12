# ruru

## 2.0.0-alpha.6

### Patch Changes

- Updated dependencies
  [[`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25)]:
  - graphile-config@0.0.1-alpha.4

## 2.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - graphile-config@0.0.1-alpha.3

## 2.0.0-alpha.4

### Patch Changes

- [`f34bd5a3c`](https://github.com/benjie/postgraphile-private/commit/f34bd5a3c353693b86a0307357a3620110700e1c)
  Thanks [@benjie](https://github.com/benjie)! - Address dependency issues.

## 2.0.0-alpha.3

### Patch Changes

- [`2fe247f75`](https://github.com/benjie/postgraphile-private/commit/2fe247f751377e18b3d6809cba39a01aa1602dbc)
  Thanks [@benjie](https://github.com/benjie)! - Added ability to download
  mermaid plan diagram as SVG.

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)]:
  - graphile-config@0.0.1-alpha.2

## 2.0.0-alpha.2

### Patch Changes

- [#305](https://github.com/benjie/postgraphile-private/pull/305)
  [`3cf35fdb4`](https://github.com/benjie/postgraphile-private/commit/3cf35fdb41d08762e9ff838a55dd7fc6004941f8)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Ruru is now a CommonJS
  module, no longer an ESM module.

  Ruru CLI now reads options from a `graphile.config.ts` file if present.

  It's now possible to customize the HTML that Ruru is served with (specifically
  the meta, title, stylesheets, header JS, body content, body JS, and init
  script), either via configuration:

  ```ts
  import { defaultHTMLParts } from "ruru/server";

  const preset: GraphileConfig.Preset = {
    //...
    ruru: {
      htmlParts: {
        titleTag: "<title>GraphiQL with Grafast support - Ruru!</title>",
        metaTags:
          defaultHTMLParts.metaTags +
          `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      },
    },
  };
  ```

  or via a plugin, which allows you to change it on a per-request (per-user)
  basis:

  ```ts
  const RuruMetaPlugin: GraphileConfig.Plugin = {
    name: "RuruMetaPlugin",
    version: "0.0.0",
    grafserv: {
      hooks: {
        ruruHTMLParts(_info, parts, extra) {
          // extra.request gives you access to request details, so you can customize `parts` for the user

          parts.metaTags += `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
        },
      },
    },
  };
  ```

## 2.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - graphile-config@0.0.1-alpha.1

## 2.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - graphile-config@0.0.1-1.2

## 2.0.0-1.1

### Patch Changes

- [#267](https://github.com/benjie/postgraphile-private/pull/267)
  [`159735204`](https://github.com/benjie/postgraphile-private/commit/15973520462d4a95e3cdf04fdacfc71ca851122f)
  Thanks [@benjie](https://github.com/benjie)! - Add formatting for SQL aliases

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- Updated dependencies
  [[`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)]:
  - graphile-config@0.0.1-1.1

## 2.0.0-0.13

### Patch Changes

- [`612092359`](undefined) - Fix header saving

## 2.0.0-0.12

### Patch Changes

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6

## 2.0.0-0.11

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`b795b3da5`](https://github.com/benjie/postgraphile-private/commit/b795b3da5f8e8f13c495be3a8cf71667f3d149f8)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade GraphiQL, gaining the
  watch mode fix.

## 2.0.0-0.10

### Patch Changes

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`e11698473`](https://github.com/benjie/postgraphile-private/commit/e1169847303790570bfafa07eb25d8fce53a0391)
  Thanks [@benjie](https://github.com/benjie)! - Add support for websocket
  subscriptions to Ruru.

## 2.0.0-0.9

### Patch Changes

- Updated dependencies [[`0ab95d0b1`](undefined)]:
  - graphile-config@0.0.1-0.5

## 2.0.0-0.8

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4

## 2.0.0-0.7

### Patch Changes

- Updated dependencies
  [[`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-config@0.0.1-0.3

## 2.0.0-0.6

### Patch Changes

- [`a40fa6966`](undefined) - Default to explain enabled. Fix issues with fetcher
  mutating immutable objects. Fix typo in README. Fix playground on grafast
  website.

- [`8f04af08d`](https://github.com/benjie/postgraphile-private/commit/8f04af08da68baf7b2b4d508eac0d2a57064da7b)
  Thanks [@benjie](https://github.com/benjie)! - Fix typo in README

## 2.0.0-0.5

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - graphile-config@0.0.1-0.2

## 2.0.0-0.4

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

## 2.0.0-0.3

### Patch Changes

- [`0983df3f6`](undefined) - Downgrade to React 16 to work around npm infinite
  loop bug (npm/cli#5322).

## 2.0.0-0.2

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - graphile-config@0.0.1-0.1

## 2.0.0-0.1

### Patch Changes

- [`6576bd37b`](undefined) - Fix text colours in dark mode

## 2.0.0-0.0

### Major Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

### Patch Changes

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - graphile-config@0.0.1-0.0
