# grafserv

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/postgraphile-private/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/postgraphile-private/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/postgraphile-private/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/postgraphile-private/commit/2ac706f18660c855fe20f460b50694fdd04a7768)]:
  - grafast@0.0.1-alpha.9
  - graphile-config@0.0.1-alpha.4
  - ruru@2.0.0-alpha.6

## 0.0.1-alpha.8

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/postgraphile-private/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8

## 0.0.1-alpha.7

### Patch Changes

- [#346](https://github.com/benjie/postgraphile-private/pull/346)
  [`9ddaaaa96`](https://github.com/benjie/postgraphile-private/commit/9ddaaaa9617874cb44946acfcd252517ae427446)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug in subscriptions
  where variables were not recognized

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/postgraphile-private/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`2fcbe688c`](https://github.com/benjie/postgraphile-private/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - graphile-config@0.0.1-alpha.3
  - ruru@2.0.0-alpha.5

## 0.0.1-alpha.6

### Patch Changes

- Updated dependencies
  [[`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)]:
  - grafast@0.0.1-alpha.6

## 0.0.1-alpha.5

### Patch Changes

- Updated dependencies
  [[`86e503d78`](https://github.com/benjie/postgraphile-private/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - grafast@0.0.1-alpha.5

## 0.0.1-alpha.4

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/postgraphile-private/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950),
  [`f34bd5a3c`](https://github.com/benjie/postgraphile-private/commit/f34bd5a3c353693b86a0307357a3620110700e1c)]:
  - grafast@0.0.1-alpha.4
  - ruru@2.0.0-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- Updated dependencies
  [[`98ae00f59`](https://github.com/benjie/postgraphile-private/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`2389f47ec`](https://github.com/benjie/postgraphile-private/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`2fe247f75`](https://github.com/benjie/postgraphile-private/commit/2fe247f751377e18b3d6809cba39a01aa1602dbc),
  [`e91ee201d`](https://github.com/benjie/postgraphile-private/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/postgraphile-private/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`d39a5d409`](https://github.com/benjie/postgraphile-private/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - @graphile/lru@5.0.0-alpha.2
  - grafast@0.0.1-alpha.3
  - ruru@2.0.0-alpha.3
  - graphile-config@0.0.1-alpha.2

## 0.0.1-alpha.2

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

- [#307](https://github.com/benjie/postgraphile-private/pull/307)
  [`7c45eaf4e`](https://github.com/benjie/postgraphile-private/commit/7c45eaf4ed6edf3b9e7bb17846d553f5504e0fb4)
  Thanks [@benjie](https://github.com/benjie)! - 🚨
  'application/x-www-form-urlencoded' is now opt-in (unless you're using the V4
  preset).

  CSRF and CORS are tricky topics. When you use PostGraphile as part of a larger
  system, it's your responsibility to ensure that you don't open yourself up to
  CSRF/etc issues (e.g. by using CSRF/XSRF tokens, by using `SameSite` cookie
  policies, by checking the `Origin` of requests, or by using a combination of
  these or other techniques).

  Out of the box, PostGraphile does not use cookies, so any cross-origin
  requests are harmless because an attacker without the actual user token in
  hand can only execute unauthenticated requests.

  However, once cookies (and sessions) enter the equation, suddenly CSRF becomes
  a risk. Normally you cannot submit an `Content-Type: application/json` request
  cross origins (unless you've enabled CORS), so this content type doesn't open
  CSRF issues on its own, but `Content-Type: application/x-www-form-urlencoded`
  can be submitted cross origins without CORS policies. The attacker won't be
  able to view the response, but that doesn't mean they can't cause havoc by
  triggering dangerous mutations using the user's credentials.

  We've decided to take the stance of making `application/x-www-form-urlencoded`
  opt-in; you can opt-in via your graphile.config.ts (or equivalent) like so:

  ```ts
  import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";

  const preset: GraphileConfig.Preset = {
    //...

    grafserv: {
      //...

      allowedRequestContentTypes: [
        ...DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
        "application/x-www-form-urlencoded",
      ],
    },
  };
  ```

  If you're using the V4 preset then we pull in the V4 behavior of enabling this
  content type by default (since you presumably already have protections in
  place); however we recommend disabling this media type if you're not using it:

  ```ts
  import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";

  const preset: GraphileConfig.Preset = {
    //... extends V4 preset ...

    grafserv: {
      //...

      allowedRequestContentTypes: DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
    },
  };
  ```

  Note that this media type is not currently part of the
  [GraphQL-over-HTTP specification](https://graphql.github.io/graphql-over-http/draft/#sec-Media-Types)
  so disabling it does not make your server non-compliant.

- Updated dependencies
  [[`3cf35fdb4`](https://github.com/benjie/postgraphile-private/commit/3cf35fdb41d08762e9ff838a55dd7fc6004941f8),
  [`3df3f1726`](https://github.com/benjie/postgraphile-private/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - ruru@2.0.0-alpha.2
  - grafast@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - grafast@0.0.1-alpha.1
  - ruru@2.0.0-alpha.1
  - graphile-config@0.0.1-alpha.1
  - @graphile/lru@5.0.0-alpha.1

## 0.0.1-1.3

### Patch Changes

- [#297](https://github.com/benjie/postgraphile-private/pull/297)
  [`90ed0cb7a`](https://github.com/benjie/postgraphile-private/commit/90ed0cb7a78479b85115cd1ce045ac253107b3eb)
  Thanks [@benjie](https://github.com/benjie)! - Overhaul websocket handling in
  Grafserv providing cleaner integration with Grafast.

- [#297](https://github.com/benjie/postgraphile-private/pull/297)
  [`56be761c2`](https://github.com/benjie/postgraphile-private/commit/56be761c29343e28ba4980c62c955b5adaef25c0)
  Thanks [@benjie](https://github.com/benjie)! - Grafserv now has a plugin
  system (via graphile-config), first plugin hook enables manipulating the
  incoming request body which is useful for persisted operations.

- [#297](https://github.com/benjie/postgraphile-private/pull/297)
  [`1a012bdd7`](https://github.com/benjie/postgraphile-private/commit/1a012bdd7d3748ac9a4ca9b1f771876654988f25)
  Thanks [@benjie](https://github.com/benjie)! - Tweaked error handling
  codepaths, extensions can be passed through now and status codes improved.
- Updated dependencies
  [[`8d270ead3`](https://github.com/benjie/postgraphile-private/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2
  - ruru@2.0.0-1.2

## 0.0.1-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/postgraphile-private/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2

## 0.0.1-1.1

### Patch Changes

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#282](https://github.com/benjie/postgraphile-private/pull/282)
  [`f6e644bd3`](https://github.com/benjie/postgraphile-private/commit/f6e644bd35be1ee2b63c8636785a241d863b8b5d)
  Thanks [@benjie](https://github.com/benjie)! - Allow accessing websocket
  connection params via `(ctx as Grafast.RequestContext).ws?.connectionParams`.
- Updated dependencies
  [[`ae304b33c`](https://github.com/benjie/postgraphile-private/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`159735204`](https://github.com/benjie/postgraphile-private/commit/15973520462d4a95e3cdf04fdacfc71ca851122f),
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/postgraphile-private/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)]:
  - grafast@0.0.1-1.1
  - ruru@2.0.0-1.1
  - graphile-config@0.0.1-1.1
  - @graphile/lru@5.0.0-1.1

## 0.0.1-0.25

### Patch Changes

- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83),
  [`612092359`](undefined)]:
  - grafast@0.0.1-0.23
  - ruru@2.0.0-0.13

## 0.0.1-0.24

### Patch Changes

- Updated dependencies
  [[`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)]:
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22
  - ruru@2.0.0-0.12

## 0.0.1-0.23

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`a06b8933f`](https://github.com/benjie/postgraphile-private/commit/a06b8933f9365627c2eab019af0c12393e29e509)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'eventStreamRoute' to
  'eventStreamPath' for consistency with 'graphqlPath' and 'graphiqlPath'. V4
  preset unaffected.
- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa),
  [`b795b3da5`](https://github.com/benjie/postgraphile-private/commit/b795b3da5f8e8f13c495be3a8cf71667f3d149f8)]:
  - grafast@0.0.1-0.21
  - ruru@2.0.0-0.11

## 0.0.1-0.22

### Patch Changes

- [#226](https://github.com/benjie/postgraphile-private/pull/226)
  [`6a846e009`](https://github.com/benjie/postgraphile-private/commit/6a846e00945ba2dcea0cd89f5e6a8ecc5a32775d)
  Thanks [@benjie](https://github.com/benjie)! - Enable users to use Grafserv
  alongside other websocket-enabled entities in their final server.
- Updated dependencies [[`aac8732f9`](undefined)]:
  - grafast@0.0.1-0.20

## 0.0.1-0.21

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/postgraphile-private/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19

## 0.0.1-0.20

### Patch Changes

- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/postgraphile-private/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`c8a56cdc8`](https://github.com/benjie/postgraphile-private/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c)]:
  - grafast@0.0.1-0.18

## 0.0.1-0.19

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17

## 0.0.1-0.18

### Patch Changes

- Updated dependencies
  [[`df89aba52`](https://github.com/benjie/postgraphile-private/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5)]:
  - grafast@0.0.1-0.16

## 0.0.1-0.17

### Patch Changes

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`461c03b72`](https://github.com/benjie/postgraphile-private/commit/461c03b72477821ec26cbf703011542e453d083c)
  Thanks [@benjie](https://github.com/benjie)! - Make servers releasable where
  possible.

- Updated dependencies
  [[`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)]:
  - grafast@0.0.1-0.15

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
