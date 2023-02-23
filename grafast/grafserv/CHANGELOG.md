# grafserv

## 0.0.1-0.16

### Patch Changes

- [#207](https://github.com/benjie/postgraphile-private/pull/207)
  [`c850dd4ec`](https://github.com/benjie/postgraphile-private/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'preset.server' to
  'preset.grafserv'.

- [#207](https://github.com/benjie/postgraphile-private/pull/207)
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in subscriptions where
  termination of underlying stream wouldn't terminate the subscription.

- [#206](https://github.com/benjie/postgraphile-private/pull/206)
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now masks untrusted
  errors by default; trusted errors are constructed via GraphQL's GraphQLError
  or Grafast's SafeError.
- Updated dependencies
  [[`d76043453`](https://github.com/benjie/postgraphile-private/commit/d7604345362c58bf7eb43ef1ac1795a2ac22ae79),
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/postgraphile-private/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14

## 0.0.1-0.15

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - grafast@0.0.1-0.13

## 0.0.1-0.14

### Patch Changes

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`1e5671cdb`](https://github.com/benjie/postgraphile-private/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9)
  Thanks [@benjie](https://github.com/benjie)! - Add support for websocket
  GraphQL subscriptions (via graphql-ws) to grafserv and PostGraphile (currently
  supporting Node, Express, Koa and Fastify)

- [#200](https://github.com/benjie/postgraphile-private/pull/200)
  [`5b634a78e`](https://github.com/benjie/postgraphile-private/commit/5b634a78e51816071447aceb1edfb813d77d563b)
  Thanks [@benjie](https://github.com/benjie)! - Standardize on `serv.addTo`
  interface, even for Node

- Updated dependencies
  [[`4f5d5bec7`](https://github.com/benjie/postgraphile-private/commit/4f5d5bec72f949b17b39cd07acc848ce7a8bfa36),
  [`e11698473`](https://github.com/benjie/postgraphile-private/commit/e1169847303790570bfafa07eb25d8fce53a0391),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - grafast@0.0.1-0.12
  - ruru@2.0.0-0.10

## 0.0.1-0.13

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#195](https://github.com/benjie/postgraphile-private/pull/195)
  [`752ec9c51`](https://github.com/benjie/postgraphile-private/commit/752ec9c516add7c4617b426e97eccd1d4e5b7833)
  Thanks [@benjie](https://github.com/benjie)! - Fix handling of HTTP errors and
  allow for 204 status code responses. Add CORS hack to enable graphql-http
  auditing.
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)]:
  - grafast@0.0.1-0.11
  - graphile-config@0.0.1-0.5
  - ruru@2.0.0-0.9

## 0.0.1-0.12

### Patch Changes

- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10
  - ruru@2.0.0-0.8

## 0.0.1-0.11

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
  - ruru@2.0.0-0.7

## 0.0.1-0.10

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8

## 0.0.1-0.9

### Patch Changes

- Updated dependencies [[`a40fa6966`](undefined),
  [`8f04af08d`](https://github.com/benjie/postgraphile-private/commit/8f04af08da68baf7b2b4d508eac0d2a57064da7b)]:
  - ruru@2.0.0-0.6
  - grafast@0.0.1-0.7

## 0.0.1-0.8

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET

## 0.0.1-0.7

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - grafast@0.0.1-0.6
  - ruru@2.0.0-0.5
  - graphile-config@0.0.1-0.2

## 0.0.1-0.6

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5

## 0.0.1-0.5

### Patch Changes

- [`768f32681`](undefined) - Fix peerDependencies ranges

- Updated dependencies [[`768f32681`](undefined)]:
  - grafast@0.0.1-0.4
  - ruru@2.0.0-0.4

## 0.0.1-0.4

### Patch Changes

- Updated dependencies [[`0983df3f6`](undefined)]:
  - ruru@2.0.0-0.3

## 0.0.1-0.3

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - grafast@0.0.1-0.3
  - ruru@2.0.0-0.2
  - graphile-config@0.0.1-0.1

## 0.0.1-0.2

### Patch Changes

- Updated dependencies [[`6576bd37b`](undefined), [`25037fc15`](undefined)]:
  - ruru@2.0.0-0.1
  - grafast@0.0.1-0.2

## 0.0.1-0.1

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - grafast@0.0.1-0.1

## 0.0.1-0.0

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - ruru@2.0.0-0.0
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - graphile-config@0.0.1-0.0
