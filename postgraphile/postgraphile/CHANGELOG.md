# postgraphile

## 5.0.0-alpha.11

### Patch Changes

- [#349](https://github.com/benjie/postgraphile-private/pull/349)
  [`a94f11091`](https://github.com/benjie/postgraphile-private/commit/a94f11091520b52d90fd007986760848ed20017b)
  Thanks [@benjie](https://github.com/benjie)! - **Overhaul behavior system**

  Previously the behavior system worked during the schema building process,
  inside the various schema hooks. So looking at the behavior of a `relation`
  might have looked like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;

    // Establish a default behavior, e.g. you might give it different default behavior
    // depending on if the remote table is in the same schema or not
    const defaultBehavior = someCondition(relation) ? "behavior_if_true" : "behavior_if_false";

    // Now establish the user-specified behavior for the entity, inheriting from all the
    // relevant places.
    const behavior = getBehavior([
      relation.remoteResource.codec.extensions,
      relation.remoteResource.extensions,
      relation.extensions
    ]);

    // Finally check this behavior string against `behavior_to_test`, being sure to apply
    // the "schema-time smart defaulting" that we established in `defaultBehavior` above.
    if (build.behavior.matches(behavior, "behavior_to_test", defaultBehavior)) {
      doTheThing();
    }
  ```

  This meant that each plugin might treat the behavior of the entity different -
  for example `postgraphile-plugin-connection-filter` might have a different
  `someCondition()` under which the "filter" behavior would apply by default,
  whereas the built in `condition` plugin might have a different one.

  Moreover, each place needs to know to call `getBehavior` with the same list of
  extension sources in the same order, otherwise subtle (or not so subtle)
  differences in the schema would occur.

  And finally, because each entity doesn't have an established behavior, you
  can't ask "what's the final behavior for this entity" because it's dynamic,
  depending on which plugin is viewing it.

  This update fixes all of this; now each entity has a single behavior that's
  established once. Each plugin can register `entityBehaviors` for the various
  behavior entity types (or global behaviors which apply to all entity types if
  that makes more sense). So the hook code equivalent to the above would now be
  more like:

  ```ts
  GraphQLObjectType_fields_field(field, build, context) {
    const relation = context.scope.pgRelationOrWhatever;
    // Do the thing if the relation has the given behavior. Simples.
    if (build.behavior.pgCodecRelationMatches(relation, "behavior_to_test")) {
      doTheThing();
    }
  ```

  This code is much more to the point, much easier for plugin authors to
  implement, and also a lot easier to debug since everything has a single
  established behavior now (except `refs`, which aren't really an entity in
  their own right, but a combination of entities...).

  These changes haven't changed any of the schemas in the test suite, but they
  may impact you. This could be a breaking change - so be sure to do a schema
  diff before/after this.

- [#355](https://github.com/benjie/postgraphile-private/pull/355)
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84)
  Thanks [@benjie](https://github.com/benjie)! - **MAJOR BREAKING CHANGE**:
  implicit application of args/input fields has been removed.

  Previously we would track the fieldArgs that you accessed (via `.get()`,
  `.getRaw()` or `.apply()`) and those that you _did not access_ would
  automatically have their `applyPlan` called, if they had one. This isn't
  likely to be particularly useful for pure Gra*fast* users (unless they want to
  adopt this pattern) but it's extremely useful for plugin-based schemas as it
  allows plugins to add arguments that can influence their field's plan _without
  having to wrap the field's plan resolver function_. This is fairly critical,
  otherwise each behavior added (`first:`, `condition:`, `orderBy:`, `filter:`,
  `ignoreArchived:`, etc etc) would wrap the plan resolver with another function
  layer, and they would get _messy_.

  However, implicit is rarely good. And it turns out that it severely limited
  what I wanted to do for improving the `fieldArgs` APIs.

  I decided to remove this implicit functionality by making it more explicit, so
  now args/input fields can specify the relevant
  `autoApplyAfterParent{Plan,SubscribePlan,InputPlan,ApplyPlan}: true` property
  and we'll only apply them at a single level.

  From a user perspective, little has changed. From a plugin author perspective,
  if you were relying on the implicit `applyPlan` then you should now add the
  relevant `autoApply*` property next to your `applyPlan` method.

- [#363](https://github.com/benjie/postgraphile-private/pull/363)
  [`bcfffd5fe`](https://github.com/benjie/postgraphile-private/commit/bcfffd5fe14d5bbc3517c62041da585a3bf1bab1)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug causing `@foreignKey`
  relation to not show up under rare circumstances (by updating
  PgRelationsPlugin to use codec, not resource, as the primary entity).

- [#362](https://github.com/benjie/postgraphile-private/pull/362)
  [`e443db39b`](https://github.com/benjie/postgraphile-private/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)
  Thanks [@benjie](https://github.com/benjie)! - Use original case for table
  resource names.

- Updated dependencies
  [[`56237691b`](https://github.com/benjie/postgraphile-private/commit/56237691bf3eed321b7159e17f36e3651356946f),
  [`ed1982f31`](https://github.com/benjie/postgraphile-private/commit/ed1982f31a845ceb3aafd4b48d667649f06778f5),
  [`a94f11091`](https://github.com/benjie/postgraphile-private/commit/a94f11091520b52d90fd007986760848ed20017b),
  [`1fe47a2b0`](https://github.com/benjie/postgraphile-private/commit/1fe47a2b08d6e7153a22dde3a99b7a9bf50c4f84),
  [`198ac74d5`](https://github.com/benjie/postgraphile-private/commit/198ac74d52fe1e47d602fe2b7c52f216d5216b25),
  [`6878c589c`](https://github.com/benjie/postgraphile-private/commit/6878c589cc9fc8f05a6efd377e1272ae24fbf256),
  [`2ac706f18`](https://github.com/benjie/postgraphile-private/commit/2ac706f18660c855fe20f460b50694fdd04a7768),
  [`77e011294`](https://github.com/benjie/postgraphile-private/commit/77e01129450ab78d55d3868661e37b0c99db3da5),
  [`bcfffd5fe`](https://github.com/benjie/postgraphile-private/commit/bcfffd5fe14d5bbc3517c62041da585a3bf1bab1),
  [`dad4d4aae`](https://github.com/benjie/postgraphile-private/commit/dad4d4aaee499098104841740c9049b1deb6ac5f),
  [`e443db39b`](https://github.com/benjie/postgraphile-private/commit/e443db39b07f9d71f7a1ce402475004e072a2d1d)]:
  - grafast@0.0.1-alpha.9
  - graphile-build-pg@5.0.0-alpha.11
  - graphile-build@5.0.0-alpha.10
  - graphile-config@0.0.1-alpha.4
  - @dataplan/pg@0.0.1-alpha.10
  - grafserv@0.0.1-alpha.9
  - ruru@2.0.0-alpha.6

## 5.0.0-alpha.10

### Patch Changes

- Updated dependencies
  [[`dd3ef599c`](https://github.com/benjie/postgraphile-private/commit/dd3ef599c7f2530fd1a19a852d334b7349e49e70)]:
  - grafast@0.0.1-alpha.8
  - @dataplan/pg@0.0.1-alpha.9
  - grafserv@0.0.1-alpha.8
  - graphile-build@5.0.0-alpha.9
  - graphile-build-pg@5.0.0-alpha.10

## 5.0.0-alpha.9

### Patch Changes

- [#346](https://github.com/benjie/postgraphile-private/pull/346)
  [`9ddaaaa96`](https://github.com/benjie/postgraphile-private/commit/9ddaaaa9617874cb44946acfcd252517ae427446)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug in subscriptions
  where variables were not recognized

- [#345](https://github.com/benjie/postgraphile-private/pull/345)
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d)
  Thanks [@benjie](https://github.com/benjie)! - Cursor validation errors are
  now raised by the connection directly, rather than the subfields.

- [#340](https://github.com/benjie/postgraphile-private/pull/340)
  [`fe9154b23`](https://github.com/benjie/postgraphile-private/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215)
  Thanks [@benjie](https://github.com/benjie)! - Make Datetime RFC3339
  compatible when a timezone is present

- Updated dependencies
  [[`5c9d32264`](https://github.com/benjie/postgraphile-private/commit/5c9d322644028e33f5273fb9bcaaf6a80f1f7360),
  [`9ddaaaa96`](https://github.com/benjie/postgraphile-private/commit/9ddaaaa9617874cb44946acfcd252517ae427446),
  [`2fcbe688c`](https://github.com/benjie/postgraphile-private/commit/2fcbe688c11b355f0688b96e99012a829cf8b7cb),
  [`3a984718a`](https://github.com/benjie/postgraphile-private/commit/3a984718a322685304777dec7cd48a1efa15539d),
  [`fe9154b23`](https://github.com/benjie/postgraphile-private/commit/fe9154b23f6e45c56ff5827dfe758bdf4974e215),
  [`adc7ae5e0`](https://github.com/benjie/postgraphile-private/commit/adc7ae5e002961c8b8286500527752f21139ab9e)]:
  - grafast@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.7
  - graphile-build-pg@5.0.0-alpha.9
  - @dataplan/pg@0.0.1-alpha.8
  - graphile-build@5.0.0-alpha.8
  - graphile-config@0.0.1-alpha.3
  - ruru@2.0.0-alpha.5

## 5.0.0-alpha.8

### Patch Changes

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`dcc3d0355`](https://github.com/benjie/postgraphile-private/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773)
  Thanks [@benjie](https://github.com/benjie)! - `@interface mode:union`
  interfaces now also gain root fields.

- [#339](https://github.com/benjie/postgraphile-private/pull/339)
  [`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba)
  Thanks [@benjie](https://github.com/benjie)! - CRITICAL BUGFIX: mistake in
  optimization of list() can lead to arrays being truncated

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`ca1526b70`](https://github.com/benjie/postgraphile-private/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6)
  Thanks [@benjie](https://github.com/benjie)! - Fix startCursor/endCursor for
  connections using pgUnionAll steps.

- [#338](https://github.com/benjie/postgraphile-private/pull/338)
  [`3426b0f4a`](https://github.com/benjie/postgraphile-private/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)
  Thanks [@benjie](https://github.com/benjie)! - Fix bugs in pgUnionAll
  connections relating to PageInfo

- Updated dependencies
  [[`dcc3d0355`](https://github.com/benjie/postgraphile-private/commit/dcc3d03558d28506260dcfc79e1a797b60ec1773),
  [`f75926f4b`](https://github.com/benjie/postgraphile-private/commit/f75926f4b9aee33adff8bdf6b1a4137582cb47ba),
  [`ca1526b70`](https://github.com/benjie/postgraphile-private/commit/ca1526b7028b0b9d506b6ccda7da046b64af1ab6),
  [`3426b0f4a`](https://github.com/benjie/postgraphile-private/commit/3426b0f4adb0c5d80c66e51c203214f06f364d3a)]:
  - graphile-build-pg@5.0.0-alpha.8
  - grafast@0.0.1-alpha.6
  - @dataplan/pg@0.0.1-alpha.7
  - grafserv@0.0.1-alpha.6
  - graphile-build@5.0.0-alpha.7

## 5.0.0-alpha.7

### Patch Changes

- [#335](https://github.com/benjie/postgraphile-private/pull/335)
  [`ef8432511`](https://github.com/benjie/postgraphile-private/commit/ef84325111416a9663417bb58ec664998040cf7c)
  Thanks [@benjie](https://github.com/benjie)! - Have ref fields support
  ordering and filtering.

- [#336](https://github.com/benjie/postgraphile-private/pull/336)
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)
  Thanks [@benjie](https://github.com/benjie)! - Fix over-cautious throw when
  dealing with recursive inputs.

- Updated dependencies
  [[`ef8432511`](https://github.com/benjie/postgraphile-private/commit/ef84325111416a9663417bb58ec664998040cf7c),
  [`86e503d78`](https://github.com/benjie/postgraphile-private/commit/86e503d785626ad9a2e91ec2e70b272dd632d425),
  [`2850e4732`](https://github.com/benjie/postgraphile-private/commit/2850e4732ff173347357dba048eaf3c1ef775497),
  [`24822d0dc`](https://github.com/benjie/postgraphile-private/commit/24822d0dc87d41f0b0737d6e00cf4022de4bab5e)]:
  - graphile-build-pg@5.0.0-alpha.7
  - grafast@0.0.1-alpha.5
  - graphile-build@5.0.0-alpha.6
  - @dataplan/pg@0.0.1-alpha.6
  - grafserv@0.0.1-alpha.5

## 5.0.0-alpha.6

### Patch Changes

- [#334](https://github.com/benjie/postgraphile-private/pull/334)
  [`1ea7acdf5`](https://github.com/benjie/postgraphile-private/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)
  Thanks [@benjie](https://github.com/benjie)! - Tweak peerDependencies

- Updated dependencies
  [[`1ea7acdf5`](https://github.com/benjie/postgraphile-private/commit/1ea7acdf5cbf39c876d5a7990ff456eb0803ac0b)]:
  - graphile-build-pg@5.0.0-alpha.6
  - @dataplan/pg@0.0.1-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies
  [[`45dcf3a8f`](https://github.com/benjie/postgraphile-private/commit/45dcf3a8fd8bad5c8b82a7cbff2db4dacb916950),
  [`f34bd5a3c`](https://github.com/benjie/postgraphile-private/commit/f34bd5a3c353693b86a0307357a3620110700e1c)]:
  - grafast@0.0.1-alpha.4
  - @dataplan/pg@0.0.1-alpha.4
  - ruru@2.0.0-alpha.4
  - grafserv@0.0.1-alpha.4
  - graphile-build@5.0.0-alpha.5
  - graphile-build-pg@5.0.0-alpha.5

## 5.0.0-alpha.4

### Patch Changes

- [#332](https://github.com/benjie/postgraphile-private/pull/332)
  [`faa1c9eaa`](https://github.com/benjie/postgraphile-private/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)
  Thanks [@benjie](https://github.com/benjie)! - Adjust dependencies and
  peerDependencies and peerDependenciesMeta.

- Updated dependencies
  [[`faa1c9eaa`](https://github.com/benjie/postgraphile-private/commit/faa1c9eaa25cbd6f0e25635f6a100d0dc9be6106)]:
  - graphile-build-pg@5.0.0-alpha.4
  - graphile-build@5.0.0-alpha.4
  - @dataplan/pg@0.0.1-alpha.3

## 5.0.0-alpha.3

### Patch Changes

- [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71)
  Thanks [@benjie](https://github.com/benjie)! - Upgrade to the latest
  TypeScript/tslib

- [`9605165d5`](https://github.com/benjie/postgraphile-private/commit/9605165d5857c97053778275836b95bf19c0b1c9)
  Thanks [@benjie](https://github.com/benjie)! - Fix naming conflict that occurs
  with `@enum` smart tag when not using `@enumName`. New `enumTableEnum`
  inflector.
- Updated dependencies
  [[`21e95326d`](https://github.com/benjie/postgraphile-private/commit/21e95326d72eaad7a8860c4c21a11736191f169b),
  [`98ae00f59`](https://github.com/benjie/postgraphile-private/commit/98ae00f59a8ab3edc5718ad8437a0dab734a7d69),
  [`2389f47ec`](https://github.com/benjie/postgraphile-private/commit/2389f47ecf3b708f1085fdeb818eacaaeb257a2d),
  [`2fe247f75`](https://github.com/benjie/postgraphile-private/commit/2fe247f751377e18b3d6809cba39a01aa1602dbc),
  [`e91ee201d`](https://github.com/benjie/postgraphile-private/commit/e91ee201d80d3b32e4e632b101f4c25362a1a05b),
  [`865bec590`](https://github.com/benjie/postgraphile-private/commit/865bec5901f666e147f5d4088152d1f0d2584827),
  [`7f857950a`](https://github.com/benjie/postgraphile-private/commit/7f857950a7e4ec763c936eb6bd1fb77824041d71),
  [`9605165d5`](https://github.com/benjie/postgraphile-private/commit/9605165d5857c97053778275836b95bf19c0b1c9),
  [`d39a5d409`](https://github.com/benjie/postgraphile-private/commit/d39a5d409ffe1a5855740ecbff1ad11ec0bf6660)]:
  - graphile-export@0.0.2-alpha.2
  - @graphile/lru@5.0.0-alpha.2
  - grafast@0.0.1-alpha.3
  - ruru@2.0.0-alpha.3
  - @dataplan/pg@0.0.1-alpha.3
  - grafserv@0.0.1-alpha.3
  - graphile-build@5.0.0-alpha.3
  - graphile-build-pg@5.0.0-alpha.3
  - graphile-config@0.0.1-alpha.2
  - pg-introspection@0.0.1-alpha.2

## 5.0.0-alpha.2

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
  [`7c45eaf4e`](https://github.com/benjie/postgraphile-private/commit/7c45eaf4ed6edf3b9e7bb17846d553f5504e0fb4),
  [`3df3f1726`](https://github.com/benjie/postgraphile-private/commit/3df3f17269bb896cdee90ed8c4ab46fb821a1509)]:
  - grafserv@0.0.1-alpha.2
  - ruru@2.0.0-alpha.2
  - grafast@0.0.1-alpha.2
  - @dataplan/pg@0.0.1-alpha.2
  - graphile-build-pg@5.0.0-alpha.2
  - graphile-build@5.0.0-alpha.2

## 5.0.0-alpha.1

### Patch Changes

- [`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)
  Thanks [@benjie](https://github.com/benjie)! - Alpha release - see
  https://postgraphile.org/news/2023-04-26-version-5-alpha

- Updated dependencies
  [[`759ad403d`](https://github.com/benjie/postgraphile-private/commit/759ad403d71363312c5225c165873ae84b8a098c)]:
  - @dataplan/pg@0.0.1-alpha.1
  - grafast@0.0.1-alpha.1
  - grafserv@0.0.1-alpha.1
  - ruru@2.0.0-alpha.1
  - graphile-build@5.0.0-alpha.1
  - graphile-build-pg@5.0.0-alpha.1
  - graphile-config@0.0.1-alpha.1
  - graphile-export@0.0.2-alpha.1
  - @graphile/lru@5.0.0-alpha.1
  - pg-introspection@0.0.1-alpha.1

## 5.0.0-1.3

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
- Updated dependencies
  [[`90ed0cb7a`](https://github.com/benjie/postgraphile-private/commit/90ed0cb7a78479b85115cd1ce045ac253107b3eb),
  [`56be761c2`](https://github.com/benjie/postgraphile-private/commit/56be761c29343e28ba4980c62c955b5adaef25c0),
  [`8d270ead3`](https://github.com/benjie/postgraphile-private/commit/8d270ead3fa8331e28974aae052bd48ad537d1bf),
  [`1a012bdd7`](https://github.com/benjie/postgraphile-private/commit/1a012bdd7d3748ac9a4ca9b1f771876654988f25),
  [`b4eaf89f4`](https://github.com/benjie/postgraphile-private/commit/b4eaf89f401ca207de08770361d07903f6bb9cb0)]:
  - grafserv@0.0.1-1.3
  - grafast@0.0.1-1.3
  - graphile-config@0.0.1-1.2
  - graphile-build-pg@5.0.0-1.3
  - @dataplan/pg@0.0.1-1.3
  - graphile-build@5.0.0-1.3
  - ruru@2.0.0-1.2

## 5.0.0-1.2

### Patch Changes

- Updated dependencies
  [[`7dcb0e008`](https://github.com/benjie/postgraphile-private/commit/7dcb0e008bc3a60c9ef325a856d16e0baab0b9f0)]:
  - grafast@0.0.1-1.2
  - @dataplan/pg@0.0.1-1.2
  - grafserv@0.0.1-1.2
  - graphile-build@5.0.0-1.2
  - graphile-build-pg@5.0.0-1.2

## 5.0.0-1.1

### Patch Changes

- [#279](https://github.com/benjie/postgraphile-private/pull/279)
  [`2df36c5a1`](https://github.com/benjie/postgraphile-private/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7)
  Thanks [@benjie](https://github.com/benjie)! - `description` moved out of
  `extensions` to live directly on all the relevant entities.

- [#279](https://github.com/benjie/postgraphile-private/pull/279)
  [`a73f9c709`](https://github.com/benjie/postgraphile-private/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26)
  Thanks [@benjie](https://github.com/benjie)! -
  `PgConnectionArgFirstLastBeforeAfterPlugin` is now
  `PgFirstLastBeforeAfterArgsPlugin` (because it applies to lists as well as
  connections).
  `PgInsertStep`/`pgInsert()`/`PgUpdateStep`/`pgUpdate()`/`PgDeleteStep`/`pgDelete()`
  are now
  `PgInsertSingleStep`/`pgInsertSingle()`/`PgUpdateSingleStep`/`pgUpdateSingle()`/`PgDeleteSingleStep`/`pgDeleteSingle()`
  (to make space to add a future bulk API if we want to).
  `config.schema.orderByNullsLast` is now `config.schema.pgOrderByNullsLast` for
  consistency (V4 preset users are unaffected). Lots of field scopes in
  `graphile-build-pg` have been updated to incorporate `field` into their names.

- [#267](https://github.com/benjie/postgraphile-private/pull/267)
  [`159735204`](https://github.com/benjie/postgraphile-private/commit/15973520462d4a95e3cdf04fdacfc71ca851122f)
  Thanks [@benjie](https://github.com/benjie)! - Add formatting for SQL aliases

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`ef42d717c`](https://github.com/benjie/postgraphile-private/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a)
  Thanks [@benjie](https://github.com/benjie)! - SQL is now generated in a
  slightly different way, helping PostgreSQL to optimize queries that have a
  batch size of 1. Also removes internal mapping code as we now simply append
  placeholder values rather than search and replacing a symbol (eradicates
  `queryValuesSymbol` and related hacks). If you manually issue queries through
  `PgExecutor` (_extremely_ unlikely!) then you'll want to check out PR #270 to
  see the differences.

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c)
  Thanks [@benjie](https://github.com/benjie)! - TypeScript v5 is now required

- [#285](https://github.com/benjie/postgraphile-private/pull/285)
  [`bd37be707`](https://github.com/benjie/postgraphile-private/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1)
  Thanks [@benjie](https://github.com/benjie)! - Single table inheritance no
  longer exposes non-shared columns via condition/order, and also only exposes
  the relationships on the types where they are appropriate.

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`f8954fb17`](https://github.com/benjie/postgraphile-private/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23)
  Thanks [@benjie](https://github.com/benjie)! - `EXPLAIN ANALYZE` (for
  `SELECT`) and `EXPLAIN` (for other operations) support added. Currently
  requires `DEBUG="datasource:pg:PgExecutor:explain"` to be set. Publish this
  through all the way to Ruru.

- [#260](https://github.com/benjie/postgraphile-private/pull/260)
  [`96b0bd14e`](https://github.com/benjie/postgraphile-private/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4)
  Thanks [@benjie](https://github.com/benjie)! - `PgSource` has been renamed to
  `PgResource`, `PgTypeCodec` to `PgCodec`, `PgEnumTypeCodec` to `PgEnumCodec`,
  `PgTypeColumn` to `PgCodecAttribute` (and similar for related
  types/interfaces). `source` has been replaced by `resource` in various of the
  APIs where it relates to a `PgResource`.

  `PgSourceBuilder` is no more, instead being replaced with `PgResourceOptions`
  and being built into the final `PgResource` via the new
  `makeRegistryBuilder`/`makeRegistry` functions.

  `build.input` no longer contains the `pgSources` directly, instead
  `build.input.pgRegistry.pgResources` should be used.

  The new registry system also means that various of the hooks in the gather
  phase have been renamed/replaced, there's a new `PgRegistryPlugin` plugin in
  the default preset. The only plugin that uses the `main` method in the
  `gather` phase is now `PgRegistryPlugin` - if you are using the `main`
  function for Postgres-related behaviors you should consider moving your logic
  to hooks instead.

  Plugin ordering has changed and thus the shape of the final schema is likely
  to change (please use `lexicographicSortSchema` on your before/after schemas
  when comparing).

  Relationships are now from a codec to a resource, rather than from resource to
  resource, so all the relationship inflectors (`singleRelation`,
  `singleRelationBackwards`, `_manyRelation`, `manyRelationConnection`,
  `manyRelationList`) now accept different parameters
  (`{registry, codec, relationName}` instead of `{source, relationaName}`).

  Significant type overhaul, most generic types no longer require generics to be
  explicitly passed in many circumstances. `PgSelectStep`, `PgSelectSingleStep`,
  `PgInsertStep`, `PgUpdateStep` and `PgDeleteStep` now all accept the resource
  as their single type parameter rather than accepting the 4 generics they did
  previously. `PgClassExpressionStep` now accepts just a codec and a resource as
  generics. `PgResource` and `PgCodec` have gained a new `TName extends string`
  generic at the very front that is used by the registry system to massively
  improve continuity of the types through all the various APIs.

  Fixed various issues in schema exporting, and detect more potential
  issues/oversights automatically.

  Fixes an RBAC bug when using superuser role for introspection.

- [#271](https://github.com/benjie/postgraphile-private/pull/271)
  [`d951897ee`](https://github.com/benjie/postgraphile-private/commit/d951897eea824acabdb17baab4bf900b4b3b842f)
  Thanks [@benjie](https://github.com/benjie)! - Add extensions.pg to Postgres
  function resources (makes it easier for plugins to hook them).

- [#270](https://github.com/benjie/postgraphile-private/pull/270)
  [`c564825f3`](https://github.com/benjie/postgraphile-private/commit/c564825f3fda0083e536154c4c34ce0b2948eba4)
  Thanks [@benjie](https://github.com/benjie)! - `set jit = 'off'` replaced with
  `set jit_optimize_above_cost = -1` so that JIT can still be used but heavy
  optimization costs are not incurred.

- [#286](https://github.com/benjie/postgraphile-private/pull/286)
  [`366b166dc`](https://github.com/benjie/postgraphile-private/commit/366b166dc88a340de7f092f92840b0fba1f03d60)
  Thanks [@benjie](https://github.com/benjie)! - Add detection for `@ref` that
  is missing `singular`, fix docs and test schema and add tests for same.

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

- [#266](https://github.com/benjie/postgraphile-private/pull/266)
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef)
  Thanks [@benjie](https://github.com/benjie)! - The Grafast step class
  'execute' and 'stream' methods now have a new additional first argument
  `count` which indicates how many results they must return. This means we don't
  need to rely on the `values[0].length` trick to determine how many results to
  return, and thus we can pass through an empty tuple to steps that have no
  dependencies.

- [#268](https://github.com/benjie/postgraphile-private/pull/268)
  [`a14cf5f4c`](https://github.com/benjie/postgraphile-private/commit/a14cf5f4c233cd794eb4d3c6f2281e747d234a71)
  Thanks [@benjie](https://github.com/benjie)! - PgV4NoIgnoreIndexesPlugin is
  now PgIndexBehaviorsPlugin, moved to graphile-build-pg, and is enabled by
  default
- Updated dependencies
  [[`2df36c5a1`](https://github.com/benjie/postgraphile-private/commit/2df36c5a1b228be50ed325962b334290e7e3e8a7),
  [`c5d89d705`](https://github.com/benjie/postgraphile-private/commit/c5d89d7052dfaaf4c597c8c36858795fa7227b07),
  [`a73f9c709`](https://github.com/benjie/postgraphile-private/commit/a73f9c709959b9d6ddef18d714783f864a3d8e26),
  [`ae304b33c`](https://github.com/benjie/postgraphile-private/commit/ae304b33c7c5a04d36b552177ae24a7b7b522645),
  [`159735204`](https://github.com/benjie/postgraphile-private/commit/15973520462d4a95e3cdf04fdacfc71ca851122f),
  [`ef42d717c`](https://github.com/benjie/postgraphile-private/commit/ef42d717c38df7fddc1cd3a5b97dc8d68419417a),
  [`d5312e6b9`](https://github.com/benjie/postgraphile-private/commit/d5312e6b968fbeb46d074b82a41b4bdbc166598c),
  [`22ec50e36`](https://github.com/benjie/postgraphile-private/commit/22ec50e360d90de41c586c5c220438f780c10ee8),
  [`0f4709356`](https://github.com/benjie/postgraphile-private/commit/0f47093560cf4f8b1f215853bc91d7f6531278cc),
  [`c22dcde7b`](https://github.com/benjie/postgraphile-private/commit/c22dcde7b53af323d907b22a0a69924841072aa9),
  [`bd37be707`](https://github.com/benjie/postgraphile-private/commit/bd37be7075804b1299e10dd2dcb4473159bb26f1),
  [`f8954fb17`](https://github.com/benjie/postgraphile-private/commit/f8954fb17bbcb0f6633475d09924cdd9f94aaf23),
  [`96b0bd14e`](https://github.com/benjie/postgraphile-private/commit/96b0bd14ed9039d60612e75b3aeb63dcaef271d4),
  [`d951897ee`](https://github.com/benjie/postgraphile-private/commit/d951897eea824acabdb17baab4bf900b4b3b842f),
  [`fbf1da26a`](https://github.com/benjie/postgraphile-private/commit/fbf1da26a9208519ee58f7ac34dd7e569bf1f9e5),
  [`c564825f3`](https://github.com/benjie/postgraphile-private/commit/c564825f3fda0083e536154c4c34ce0b2948eba4),
  [`366b166dc`](https://github.com/benjie/postgraphile-private/commit/366b166dc88a340de7f092f92840b0fba1f03d60),
  [`261eb520b`](https://github.com/benjie/postgraphile-private/commit/261eb520b33fe3673fe3a7712085e50291aed1e5),
  [`395b4a2dd`](https://github.com/benjie/postgraphile-private/commit/395b4a2dd24044bad25f5e411a7a7cfa43883eef),
  [`a14cf5f4c`](https://github.com/benjie/postgraphile-private/commit/a14cf5f4c233cd794eb4d3c6f2281e747d234a71),
  [`f6e644bd3`](https://github.com/benjie/postgraphile-private/commit/f6e644bd35be1ee2b63c8636785a241d863b8b5d)]:
  - graphile-build-pg@5.0.0-1.1
  - @dataplan/pg@0.0.1-1.1
  - graphile-build@5.0.0-1.1
  - grafast@0.0.1-1.1
  - ruru@2.0.0-1.1
  - pg-introspection@0.0.1-1.1
  - graphile-config@0.0.1-1.1
  - graphile-export@0.0.2-1.1
  - grafserv@0.0.1-1.1
  - @graphile/lru@5.0.0-1.1

## 5.0.0-0.37

### Patch Changes

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b)
  Thanks [@benjie](https://github.com/benjie)! - PgClassSinglePlan is now
  enforced, users will be informed if plans return a step incompatible with the
  given GraphQL object type.

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf)
  Thanks [@benjie](https://github.com/benjie)! - When multiple versions of
  grafast or pg-sql2 are detected, a warning will be raised.

- [#257](https://github.com/benjie/postgraphile-private/pull/257)
  [`dd5464e39`](https://github.com/benjie/postgraphile-private/commit/dd5464e3986fcc917c8e2dadcec6bfe6bc451e56)
  Thanks [@benjie](https://github.com/benjie)! - `@omit read` on a column now
  omits constraints using that column, as it did in V4.
- Updated dependencies
  [[`89d16c972`](https://github.com/benjie/postgraphile-private/commit/89d16c972f12659de091b0b866768cacfccc8f6b),
  [`8f323bdc8`](https://github.com/benjie/postgraphile-private/commit/8f323bdc88e39924de50775891bd40f1acb9b7cf),
  [`9e7183c02`](https://github.com/benjie/postgraphile-private/commit/9e7183c02cb82d5f5c684c4f73962035e0267c83),
  [`fce77f40e`](https://github.com/benjie/postgraphile-private/commit/fce77f40efb194a3dfa7f38bfe20eb99e09efa70),
  [`612092359`](undefined)]:
  - grafast@0.0.1-0.23
  - graphile-build-pg@5.0.0-0.34
  - @dataplan/pg@0.0.1-0.28
  - ruru@2.0.0-0.13
  - grafserv@0.0.1-0.25
  - graphile-build@5.0.0-0.29

## 5.0.0-0.36

### Patch Changes

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`a50bc5be4`](https://github.com/benjie/postgraphile-private/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8)
  Thanks [@benjie](https://github.com/benjie)! - Introduce new
  GraphQLObjectType_fields_field_args_arg and
  GraphQLInterfaceType_fields_field_args_arg hooks to resolve some plugin
  ordering issues.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85)
  Thanks [@benjie](https://github.com/benjie)! - Solve mutation issue in plugin
  ordering code which lead to heisenbugs.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`2f50a633a`](https://github.com/benjie/postgraphile-private/commit/2f50a633acab7c112413ec4576beeec2efef24df)
  Thanks [@benjie](https://github.com/benjie)! - Fix a bug where plugin ordering
  could result in update mutations not being created.

- [#233](https://github.com/benjie/postgraphile-private/pull/233)
  [`005e5cea0`](https://github.com/benjie/postgraphile-private/commit/005e5cea01224533282bc4d0f3516368fb8db81a)
  Thanks [@benjie](https://github.com/benjie)! - Eradicate
  PgSmartCommentsPlugin, it is no longer needed. Solves some plugin ordering
  issues.
- Updated dependencies
  [[`a50bc5be4`](https://github.com/benjie/postgraphile-private/commit/a50bc5be4b4be344203f4acd0ffd5ad8b90d89b8),
  [`6fb7ef449`](https://github.com/benjie/postgraphile-private/commit/6fb7ef4494b4f61b3b1aa36642e51eb9ec99a941),
  [`11e7c12c5`](https://github.com/benjie/postgraphile-private/commit/11e7c12c5a3545ee24b5e39392fbec190aa1cf85),
  [`2f50a633a`](https://github.com/benjie/postgraphile-private/commit/2f50a633acab7c112413ec4576beeec2efef24df),
  [`005e5cea0`](https://github.com/benjie/postgraphile-private/commit/005e5cea01224533282bc4d0f3516368fb8db81a)]:
  - graphile-build@5.0.0-0.28
  - graphile-build-pg@5.0.0-0.33
  - graphile-config@0.0.1-0.6
  - grafast@0.0.1-0.22
  - grafserv@0.0.1-0.24
  - ruru@2.0.0-0.12
  - @dataplan/pg@0.0.1-0.27

## 5.0.0-0.35

### Patch Changes

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 **BREAKING CHANGE**
  `hookArgs()` now accepts arguments in the same order as `grafast()`:
  `hookArgs(args, resolvedPreset, ctx)`. Please update all your `hookArgs`
  calls.

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`a06b8933f`](https://github.com/benjie/postgraphile-private/commit/a06b8933f9365627c2eab019af0c12393e29e509)
  Thanks [@benjie](https://github.com/benjie)! - Rename 'eventStreamRoute' to
  'eventStreamPath' for consistency with 'graphqlPath' and 'graphiqlPath'. V4
  preset unaffected.

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`ac6137bb6`](https://github.com/benjie/postgraphile-private/commit/ac6137bb60a34a3ebf5fad3c6ac153c95acb6158)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 PgRBACPlugin is now included
  in the default `graphile-build-pg` (and thus PostGraphile amber) preset. Users
  of the V4 preset are unaffected.

- [#229](https://github.com/benjie/postgraphile-private/pull/229)
  [`9edf7511a`](https://github.com/benjie/postgraphile-private/commit/9edf7511ae71928390213ff9c807b7cc7e3174fa)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 pgl.getServerParams() has
  been renamed to pgl.getSchemaResult()

- Updated dependencies
  [[`f5a04cf66`](https://github.com/benjie/postgraphile-private/commit/f5a04cf66f220c11a6a82db8c1a78b1d91606faa),
  [`13cfc7501`](https://github.com/benjie/postgraphile-private/commit/13cfc75019d42353c1e6be394c28c6ba61ab32d0),
  [`b795b3da5`](https://github.com/benjie/postgraphile-private/commit/b795b3da5f8e8f13c495be3a8cf71667f3d149f8),
  [`a06b8933f`](https://github.com/benjie/postgraphile-private/commit/a06b8933f9365627c2eab019af0c12393e29e509),
  [`b9a2236d4`](https://github.com/benjie/postgraphile-private/commit/b9a2236d43cc92e06085298e379de71f7fdedcb7),
  [`ac6137bb6`](https://github.com/benjie/postgraphile-private/commit/ac6137bb60a34a3ebf5fad3c6ac153c95acb6158)]:
  - grafast@0.0.1-0.21
  - @dataplan/pg@0.0.1-0.26
  - graphile-build-pg@5.0.0-0.32
  - ruru@2.0.0-0.11
  - grafserv@0.0.1-0.23
  - graphile-build@5.0.0-0.27

## 5.0.0-0.34

### Patch Changes

- [#226](https://github.com/benjie/postgraphile-private/pull/226)
  [`2a7c682f4`](https://github.com/benjie/postgraphile-private/commit/2a7c682f46ff916c040732d91510fb19f639955e)
  Thanks [@benjie](https://github.com/benjie)! - Enable websockets and add
  better compatibility with V4's pgSettings/additionalGraphQLContextFromRequest
  for websockets when using `makeV4Preset({subscriptions: true})`.

- [#226](https://github.com/benjie/postgraphile-private/pull/226)
  [`6a846e009`](https://github.com/benjie/postgraphile-private/commit/6a846e00945ba2dcea0cd89f5e6a8ecc5a32775d)
  Thanks [@benjie](https://github.com/benjie)! - Enable users to use Grafserv
  alongside other websocket-enabled entities in their final server.
- Updated dependencies [[`aac8732f9`](undefined),
  [`6a846e009`](https://github.com/benjie/postgraphile-private/commit/6a846e00945ba2dcea0cd89f5e6a8ecc5a32775d)]:
  - grafast@0.0.1-0.20
  - grafserv@0.0.1-0.22
  - @dataplan/pg@0.0.1-0.25
  - graphile-build@5.0.0-0.26
  - graphile-build-pg@5.0.0-0.31

## 5.0.0-0.33

### Patch Changes

- Updated dependencies
  [[`397e8bb40`](https://github.com/benjie/postgraphile-private/commit/397e8bb40fe3783995172356a39ab7cb33e3bd36)]:
  - grafast@0.0.1-0.19
  - @dataplan/pg@0.0.1-0.24
  - grafserv@0.0.1-0.21
  - graphile-build@5.0.0-0.25
  - graphile-build-pg@5.0.0-0.30

## 5.0.0-0.32

### Patch Changes

- [#220](https://github.com/benjie/postgraphile-private/pull/220)
  [`2abc58cf6`](https://github.com/benjie/postgraphile-private/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245)
  Thanks [@benjie](https://github.com/benjie)! - Convert a few more more options
  from V4 to V5.

  Explicitly remove query batching functionality, instead use HTTP2+ or
  websockets or similar.

  Add schema exporting.

- Updated dependencies
  [[`4c2b7d1ca`](https://github.com/benjie/postgraphile-private/commit/4c2b7d1ca1afbda1e47da22c346cc3b03d01b7f0),
  [`2abc58cf6`](https://github.com/benjie/postgraphile-private/commit/2abc58cf61e78e77b2ba44a875f0ef5b3f98b245),
  [`c8a56cdc8`](https://github.com/benjie/postgraphile-private/commit/c8a56cdc83390e5735beb9b90f004e7975cab28c),
  [`df8c06657`](https://github.com/benjie/postgraphile-private/commit/df8c06657e6f5a7d1444d86dc32fd750d1433223)]:
  - grafast@0.0.1-0.18
  - graphile-build@5.0.0-0.24
  - @dataplan/pg@0.0.1-0.23
  - grafserv@0.0.1-0.20
  - graphile-build-pg@5.0.0-0.29

## 5.0.0-0.31

### Patch Changes

- [#218](https://github.com/benjie/postgraphile-private/pull/218)
  [`f2c1423fb`](https://github.com/benjie/postgraphile-private/commit/f2c1423fbd6c354146a70a9a2ebabd97370b9b05)
  Thanks [@benjie](https://github.com/benjie)! - Option for `@foreignKey` smart
  tag to have unique auto-created for it to ease transition from V4:
  `{ gather: { pgFakeConstraintsAutofixForeignKeyUniqueness: true } }`

- [#219](https://github.com/benjie/postgraphile-private/pull/219)
  [`b58f5dfac`](https://github.com/benjie/postgraphile-private/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)
  Thanks [@benjie](https://github.com/benjie)! - Rename
  `GraphileBuild.GraphileBuildGatherOptions` to `GraphileBuild.GatherOptions`.
  Rename `GraphileBuild.GraphileBuildInflectionOptions` to
  `GraphileBuild.InflectionOptions`.
- Updated dependencies
  [[`f2c1423fb`](https://github.com/benjie/postgraphile-private/commit/f2c1423fbd6c354146a70a9a2ebabd97370b9b05),
  [`b58f5dfac`](https://github.com/benjie/postgraphile-private/commit/b58f5dfac6ead1efb8bb56b5cfdfd6a0040a60b5)]:
  - graphile-build-pg@5.0.0-0.28
  - graphile-build@5.0.0-0.23

## 5.0.0-0.30

### Patch Changes

- Updated dependencies [[`f48860d4f`](undefined)]:
  - grafast@0.0.1-0.17
  - graphile-build@5.0.0-0.22
  - @dataplan/pg@0.0.1-0.22
  - grafserv@0.0.1-0.19
  - graphile-build-pg@5.0.0-0.27

## 5.0.0-0.29

### Patch Changes

- [#214](https://github.com/benjie/postgraphile-private/pull/214)
  [`3ed7d3349`](https://github.com/benjie/postgraphile-private/commit/3ed7d334939e5e0ab2f63b2fde202884cc2daa74)
  Thanks [@benjie](https://github.com/benjie)! - @uniqueKey smart tag now
  converted via V4 preset to @unique.

- Updated dependencies
  [[`7e3bfef04`](https://github.com/benjie/postgraphile-private/commit/7e3bfef04ebb76fbde8273341ec92073b9e9f04d),
  [`df89aba52`](https://github.com/benjie/postgraphile-private/commit/df89aba524270e52f82987fcc4ab5d78ce180fc5),
  [`3ed7d3349`](https://github.com/benjie/postgraphile-private/commit/3ed7d334939e5e0ab2f63b2fde202884cc2daa74)]:
  - @dataplan/pg@0.0.1-0.21
  - grafast@0.0.1-0.16
  - graphile-build-pg@5.0.0-0.26
  - grafserv@0.0.1-0.18
  - graphile-build@5.0.0-0.21

## 5.0.0-0.28

### Patch Changes

- [`a8d26b30a`](undefined) - `ignoreReplaceIfNotExists` now truly ignores
  replacement inflectors. Better handle disabled NodePlugin.
- Updated dependencies [[`a8d26b30a`](undefined)]:
  - graphile-build-pg@5.0.0-0.25

## 5.0.0-0.27

### Patch Changes

- [`5812ad277`](undefined) - Deal better with NodePlugin being disabled.

- Updated dependencies [[`5812ad277`](undefined)]:
  - graphile-build-pg@5.0.0-0.24

## 5.0.0-0.26

### Patch Changes

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`2fb5001b4`](https://github.com/benjie/postgraphile-private/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d)
  Thanks [@benjie](https://github.com/benjie)! - retryOnInitFail implemented,
  and bug in introspection cache on error resolved.

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`2bd4b619e`](https://github.com/benjie/postgraphile-private/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99)
  Thanks [@benjie](https://github.com/benjie)! - Add
  `extensions.pg = { databaseName, schemaName, name }` to various DB-derived
  resources (codecs, sources, etc); this replaces the `originalName` temporary
  solution that we had previously.

- [#210](https://github.com/benjie/postgraphile-private/pull/210)
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df)
  Thanks [@benjie](https://github.com/benjie)! - Replace BaseGraphQLContext with
  Grafast.Context throughout.

- Updated dependencies
  [[`2fb5001b4`](https://github.com/benjie/postgraphile-private/commit/2fb5001b4aaac07942b2e9b0398a996f9aa8b15d),
  [`2bd4b619e`](https://github.com/benjie/postgraphile-private/commit/2bd4b619ee0f6054e14da3ac4885ec55d944cd99),
  [`b523118fe`](https://github.com/benjie/postgraphile-private/commit/b523118fe6217c027363fea91252a3a1764e17df),
  [`461c03b72`](https://github.com/benjie/postgraphile-private/commit/461c03b72477821ec26cbf703011542e453d083c)]:
  - graphile-build@5.0.0-0.20
  - graphile-build-pg@5.0.0-0.23
  - @dataplan/pg@0.0.1-0.20
  - grafast@0.0.1-0.15
  - grafserv@0.0.1-0.17

## 5.0.0-0.25

### Patch Changes

- [`9a6b18fd9`](undefined) - Give postgraphile() a named return type and export
  the V4 plugins from the V4 preset.

## 5.0.0-0.24

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
  [`c850dd4ec`](https://github.com/benjie/postgraphile-private/commit/c850dd4ec0e42e37122f5bca55a079b53bfd895e),
  [`afa0ea5f6`](https://github.com/benjie/postgraphile-private/commit/afa0ea5f6c508d9a0ba5946ab153b13ddbd274a0),
  [`92c2378f2`](https://github.com/benjie/postgraphile-private/commit/92c2378f297cc917f542b126e1cdddf58e1f0fc3),
  [`851b78ef2`](https://github.com/benjie/postgraphile-private/commit/851b78ef20d430164507ec9b3f41a5a0b8a18ed7),
  [`384b3594f`](https://github.com/benjie/postgraphile-private/commit/384b3594f543d113650c1b6b02b276360dd2d15f)]:
  - grafast@0.0.1-0.14
  - grafserv@0.0.1-0.16
  - @dataplan/pg@0.0.1-0.19
  - graphile-build@5.0.0-0.19
  - graphile-build-pg@5.0.0-0.22

## 5.0.0-0.23

### Patch Changes

- [#201](https://github.com/benjie/postgraphile-private/pull/201)
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)
  Thanks [@benjie](https://github.com/benjie)! - JSON now works how most users
  would expect it to.

- Updated dependencies
  [[`a14bd2288`](https://github.com/benjie/postgraphile-private/commit/a14bd2288532b0977945d1c0508e51baef6dba2b),
  [`dca706ad9`](https://github.com/benjie/postgraphile-private/commit/dca706ad99b1cd2b98872581b86bd4b22c7fd5f4)]:
  - @dataplan/pg@0.0.1-0.18
  - graphile-build@5.0.0-0.18
  - graphile-build-pg@5.0.0-0.21

## 5.0.0-0.22

### Patch Changes

- Updated dependencies [[`e5b664b6f`](undefined)]:
  - @dataplan/pg@0.0.1-0.17
  - grafast@0.0.1-0.13
  - graphile-build-pg@5.0.0-0.20
  - grafserv@0.0.1-0.15
  - graphile-build@5.0.0-0.17

## 5.0.0-0.21

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
  [`1e5671cdb`](https://github.com/benjie/postgraphile-private/commit/1e5671cdbbf9f4600b74c43eaa7e33b7bfd75fb9),
  [`fb40bd97b`](https://github.com/benjie/postgraphile-private/commit/fb40bd97b8a36da91c6b08e0ce67f1a9419ad91f),
  [`a1158d83e`](https://github.com/benjie/postgraphile-private/commit/a1158d83e2d26f7da0182ec2b651f7f1ec202f14),
  [`5b634a78e`](https://github.com/benjie/postgraphile-private/commit/5b634a78e51816071447aceb1edfb813d77d563b),
  [`25f5a6cbf`](https://github.com/benjie/postgraphile-private/commit/25f5a6cbff6cd5a94ebc4f411f7fa89c209fc383)]:
  - @dataplan/pg@0.0.1-0.16
  - grafast@0.0.1-0.12
  - ruru@2.0.0-0.10
  - grafserv@0.0.1-0.14
  - graphile-build@5.0.0-0.16
  - graphile-build-pg@5.0.0-0.19

## 5.0.0-0.20

### Patch Changes

- [`0ab95d0b1`](undefined) - Update sponsors.

- [#196](https://github.com/benjie/postgraphile-private/pull/196)
  [`af9bc38c8`](https://github.com/benjie/postgraphile-private/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7)
  Thanks [@benjie](https://github.com/benjie)! - Allow passing `pool` directly
  to `makePgConfig`.

- [#190](https://github.com/benjie/postgraphile-private/pull/190)
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876)
  Thanks [@benjie](https://github.com/benjie)! - 🚨 Breaking changes around
  types and postgres configuration:

  - `GraphileBuild.GraphileResolverContext` renamed to `Grafast.Context`
  - `GraphileConfig.GraphQLRequestContext` renamed to `Grafast.RequestContext`
  - `Grafast.PgDatabaseAdaptorOptions` renaed to
    `GraphileConfig.PgDatabaseAdaptorOptions`
  - `@dataplan/pg/adaptors/node-postgres` is now `@dataplan/pg/adaptors/pg` due
    to the bizarre naming of PostgreSQL clients on npm - we've decided to use
    the module name as the unique identifier
  - `makePgConfigs`:
    - is now `makePgConfig` (singular) - so you'll need to wrap it in an array
      where you use it
    - no longer exported by `@dataplan/pg` (because it depended on `pg`) -
      instead each adaptor exposes this helper - so import from
      `@dataplan/pg/adaptors/node-postgres`
    - accepts an object parameter containing
      `{connectionString, schemas, superuserConnectionString}`, rather than
      multiple string parameters
  - `makeNodePostgresWithPgClient` -> `makePgAdaptorWithPgClient`
  - `postgraphile` CLI will now try and respect the adaptor stated in your
    preset when overriding connection arguments
  - Removed `Grafast.RequestContext.httpRequest` and instead use
    `Grafast.RequestContext.node.req/res`; all server adaptors should implement
    this if appropriate

- [#192](https://github.com/benjie/postgraphile-private/pull/192)
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)
  Thanks [@benjie](https://github.com/benjie)! - - Conflicts in `pgConfigs`
  (e.g. multiple sources using the same 'name') now detected and output
  - Fix defaults for `pgSettingsKey` and `withPgClientKey` based on config name
  - `makePgConfig` now allows passing `pgSettings` callback and
    `pgSettingsForIntrospection` config object
  - Multiple postgres sources now works nicely with multiple `makePgConfig`
    calls
- Updated dependencies [[`0ab95d0b1`](undefined),
  [`af9bc38c8`](https://github.com/benjie/postgraphile-private/commit/af9bc38c86dddfa776e5d8db117b5cb35dbe2cd7),
  [`4783bdd7c`](https://github.com/benjie/postgraphile-private/commit/4783bdd7cc28ac8b497fdd4d6f1024d80cb432ef),
  [`652cf1073`](https://github.com/benjie/postgraphile-private/commit/652cf107316ea5832f69c6a55574632187f5c876),
  [`752ec9c51`](https://github.com/benjie/postgraphile-private/commit/752ec9c516add7c4617b426e97eccd1d4e5b7833),
  [`80091a8e0`](https://github.com/benjie/postgraphile-private/commit/80091a8e0343a162bf2b60cf619267a874a67e60)]:
  - @dataplan/pg@0.0.1-0.15
  - grafast@0.0.1-0.11
  - grafserv@0.0.1-0.13
  - graphile-build@5.0.0-0.15
  - graphile-build-pg@5.0.0-0.18
  - graphile-config@0.0.1-0.5
  - pg-introspection@0.0.1-0.3
  - ruru@2.0.0-0.9

## 5.0.0-0.19

### Patch Changes

- [`72bf5f535`](undefined) - Overhaul the behavior system (see
  https://postgraphile.org/postgraphile/next/behavior).

  - Adds `schema.defaultBehavior` configuration option to save having to write a
    plugin for such a simple task
  - Changes a bunch of behavior strings:
    - `(query|singularRelation|manyRelation|queryField|typeField):(list|connection|single)`
      -> `$1:source:$2` (e.g. `query:list` -> `query:source:list`)
  - Checks for more specific behaviors, e.g. `source:update` or
    `constraint:source:update` or `attribute:update` rather than just `update`
  - Updates every change to `getBehavior` so that it follows the relevant chain
    (e.g. codec -> source -> relation for relations, similar for other types)
  - More helpful error message when `-insert` prevents functions with input
    arguments working
  - Throw an error if you try and use "create" scope (because we use
    insert/update/delete not create/update/delete)

- Updated dependencies [[`72bf5f535`](undefined)]:
  - graphile-build@5.0.0-0.14
  - graphile-build-pg@5.0.0-0.17

## 5.0.0-0.18

### Patch Changes

- [#184](https://github.com/benjie/postgraphile-private/pull/184)
  [`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)
  Thanks [@benjie](https://github.com/benjie)! - Handle array-to-object issue in
  graphile-config when multiple presets set an array key.
- Updated dependencies
  [[`842f6ccbb`](https://github.com/benjie/postgraphile-private/commit/842f6ccbb3c9bd0c101c4f4df31c5ed1aea9b2ab)]:
  - graphile-config@0.0.1-0.4
  - grafast@0.0.1-0.10
  - grafserv@0.0.1-0.12
  - ruru@2.0.0-0.8
  - graphile-build@5.0.0-0.13
  - graphile-build-pg@5.0.0-0.16
  - @dataplan/pg@0.0.1-0.14

## 5.0.0-0.17

### Patch Changes

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`ebb24895c`](https://github.com/benjie/postgraphile-private/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug when handling stable
  void functions

- [#181](https://github.com/benjie/postgraphile-private/pull/181)
  [`d3cba220c`](https://github.com/benjie/postgraphile-private/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65)
  Thanks [@benjie](https://github.com/benjie)! - `*FieldName` smart tags are now
  used verbatim rather than being piped through `inflection.camelCase(...)` -
  you've explicitly stated a 'field name' so we should use that. This may be a
  breaking change for you if your field names are currently different
  before/after they are camelCase'd.

- [#183](https://github.com/benjie/postgraphile-private/pull/183)
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)
  Thanks [@benjie](https://github.com/benjie)! - Fix potential construction loop
  on failure to construct a type

- Updated dependencies
  [[`ebb24895c`](https://github.com/benjie/postgraphile-private/commit/ebb24895c3ee05c670ffb6c9b4fa4bd1328d9005),
  [`d3cba220c`](https://github.com/benjie/postgraphile-private/commit/d3cba220c5acb52bb45f1f82f599dd13e0340e65),
  [`3eb9da95e`](https://github.com/benjie/postgraphile-private/commit/3eb9da95e6834d687972b112ee0c12b01c7d11c2)]:
  - graphile-build-pg@5.0.0-0.15
  - graphile-build@5.0.0-0.12

## 5.0.0-0.16

### Patch Changes

- [#178](https://github.com/benjie/postgraphile-private/pull/178)
  [`1b040b3ba`](https://github.com/benjie/postgraphile-private/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0)
  Thanks [@benjie](https://github.com/benjie)! - `@omit` and similar smart tags
  are now processed on `@foreignKey` and other fake constraints.

- [#176](https://github.com/benjie/postgraphile-private/pull/176)
  [`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb)
  Thanks [@benjie](https://github.com/benjie)! - Better graphile.config.\*
  compatibility with ESM-emulation, so 'export default preset;' should work in
  TypeScript even if outputting to CommonJS.

- [#177](https://github.com/benjie/postgraphile-private/pull/177)
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e)
  Thanks [@benjie](https://github.com/benjie)! - `@foreignFieldName` smart tag
  is now fed into the `inflection.connectionField(...)` or
  `inflection.listField(...)` inflector as appropriate. If you are using
  `@foreignSimpleFieldName` you may be able to delete that now; alternatively
  you should consider renaming `@foreignFieldName` to
  `@foreignConnectionFieldName` for consistency.
- Updated dependencies
  [[`1b040b3ba`](https://github.com/benjie/postgraphile-private/commit/1b040b3bad10ea42b01134e6bddaefaf604936c0),
  [`19e2961de`](https://github.com/benjie/postgraphile-private/commit/19e2961de67dc0b9601799bba256e4c4a23cc0cb),
  [`6be68a53e`](https://github.com/benjie/postgraphile-private/commit/6be68a53e21940406a9fd629ee15cb1673497a6e),
  [`11d6be65e`](https://github.com/benjie/postgraphile-private/commit/11d6be65e0da489f8ab3e3a8b8db145f8b2147ad)]:
  - graphile-build-pg@5.0.0-0.14
  - graphile-config@0.0.1-0.3
  - grafast@0.0.1-0.9
  - grafserv@0.0.1-0.11
  - graphile-build@5.0.0-0.11
  - ruru@2.0.0-0.7
  - @dataplan/pg@0.0.1-0.13

## 5.0.0-0.15

### Patch Changes

- Updated dependencies
  [[`208166269`](https://github.com/benjie/postgraphile-private/commit/208166269177d6e278b056e1c77d26a2d8f59f49)]:
  - grafast@0.0.1-0.8
  - @dataplan/pg@0.0.1-0.12
  - grafserv@0.0.1-0.10
  - graphile-build@5.0.0-0.10
  - graphile-build-pg@5.0.0-0.13

## 5.0.0-0.14

### Patch Changes

- [`af9f11f28`](https://github.com/benjie/postgraphile-private/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3)
  Thanks [@benjie](https://github.com/benjie)! - 'preset.pgSources' renamed to
  'preset.pgConfigs' to avoid confusion with PgSource class and
  'input.pgSources' used for build.

- [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a)
  Thanks [@benjie](https://github.com/benjie)! - Enable omitting update/delete
  mutations using behaviors on unique constraints.

- [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)
  Thanks [@benjie](https://github.com/benjie)! - Add new
  `--superuser-connection` option to allow installing watch fixtures as
  superuser.

- [`f7d885527`](https://github.com/benjie/postgraphile-private/commit/f7d8855276c3ab0bbcaf8505a1f2f6e872d53128)
  Thanks [@benjie](https://github.com/benjie)! - Fix bug in server startup
  message where preset.server.graphqlPath was not respected.
- Updated dependencies
  [[`af9f11f28`](https://github.com/benjie/postgraphile-private/commit/af9f11f289b0029442c6cf4ededf86ee823a26c3),
  [`6ebe3a13e`](https://github.com/benjie/postgraphile-private/commit/6ebe3a13e563f2bd665b24a5c84bbfc5eba1cc0a),
  [`0e440a862`](https://github.com/benjie/postgraphile-private/commit/0e440a862d29e8db40fd72413223a10de885ef46)]:
  - graphile-build-pg@5.0.0-0.12
  - graphile-build@5.0.0-0.9
  - @dataplan/pg@0.0.1-0.11

## 5.0.0-0.13

### Patch Changes

- Updated dependencies [[`a40fa6966`](undefined), [`677c8f5fc`](undefined),
  [`8f04af08d`](https://github.com/benjie/postgraphile-private/commit/8f04af08da68baf7b2b4d508eac0d2a57064da7b)]:
  - ruru@2.0.0-0.6
  - graphile-build@5.0.0-0.8
  - graphile-build-pg@5.0.0-0.11
  - pg-introspection@0.0.1-0.2
  - grafserv@0.0.1-0.9
  - grafast@0.0.1-0.7
  - @dataplan/pg@0.0.1-0.10

## 5.0.0-0.12

### Patch Changes

- [`c4213e91d`](undefined) - Add pgl.getResolvedPreset() API; fix Ruru
  respecting graphqlPath setting; replace 'instance' with 'pgl'/'serv' as
  appropriate; forbid subscriptions on GET
- Updated dependencies [[`c4213e91d`](undefined)]:
  - @dataplan/pg@0.0.1-0.9
  - grafserv@0.0.1-0.8
  - graphile-build-pg@5.0.0-0.10

## 5.0.0-0.11

### Patch Changes

- [`9b296ba54`](undefined) - More secure, more compatible, and lots of fixes
  across the monorepo

- Updated dependencies [[`9b296ba54`](undefined)]:
  - @dataplan/pg@0.0.1-0.8
  - grafast@0.0.1-0.6
  - grafserv@0.0.1-0.7
  - ruru@2.0.0-0.5
  - graphile-build@5.0.0-0.7
  - graphile-build-pg@5.0.0-0.9
  - graphile-config@0.0.1-0.2
  - pg-introspection@0.0.1-0.1

## 5.0.0-0.10

### Patch Changes

- Updated dependencies [[`cd37fd02a`](undefined)]:
  - grafast@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.8
  - @dataplan/pg@0.0.1-0.7
  - grafserv@0.0.1-0.6
  - graphile-build@5.0.0-0.6

## 5.0.0-0.9

### Patch Changes

- Updated dependencies [[`768f32681`](undefined)]:
  - @dataplan/pg@0.0.1-0.6
  - grafast@0.0.1-0.4
  - grafserv@0.0.1-0.5
  - ruru@2.0.0-0.4
  - graphile-build@5.0.0-0.5
  - graphile-export@0.0.2-0.4
  - graphile-build-pg@5.0.0-0.7

## 5.0.0-0.8

### Patch Changes

- Updated dependencies [[`0983df3f6`](undefined)]:
  - ruru@2.0.0-0.3
  - grafserv@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.6
  - @dataplan/pg@0.0.1-0.5

## 5.0.0-0.7

### Patch Changes

- [`d7b87b325`](undefined) - Fix importing presets

## 5.0.0-0.6

### Patch Changes

- Updated dependencies [[`9ebe3d860`](undefined)]:
  - @dataplan/pg@0.0.1-0.5
  - graphile-build-pg@5.0.0-0.6

## 5.0.0-0.5

### Patch Changes

- Updated dependencies [[`bf83f591d`](undefined)]:
  - @dataplan/pg@0.0.1-0.4
  - graphile-build-pg@5.0.0-0.5

## 5.0.0-0.4

### Patch Changes

- [`d11c1911c`](undefined) - Fix dependencies

- Updated dependencies [[`d11c1911c`](undefined)]:
  - @dataplan/pg@0.0.1-0.3
  - grafast@0.0.1-0.3
  - grafserv@0.0.1-0.3
  - ruru@2.0.0-0.2
  - graphile-build@5.0.0-0.4
  - graphile-build-pg@5.0.0-0.4
  - graphile-config@0.0.1-0.1
  - graphile-export@0.0.2-0.3

## 5.0.0-0.3

### Patch Changes

- Updated dependencies [[`6576bd37b`](undefined), [`25037fc15`](undefined)]:
  - ruru@2.0.0-0.1
  - @dataplan/pg@0.0.1-0.2
  - grafast@0.0.1-0.2
  - grafserv@0.0.1-0.2
  - graphile-build-pg@5.0.0-0.3
  - graphile-build@5.0.0-0.3
  - graphile-export@0.0.2-0.2

## 5.0.0-0.2

### Patch Changes

- Updated dependencies [[`55f15cf35`](undefined)]:
  - @dataplan/pg@0.0.1-0.1
  - grafast@0.0.1-0.1
  - graphile-build-pg@5.0.0-0.2
  - grafserv@0.0.1-0.1
  - graphile-build@5.0.0-0.2
  - graphile-export@0.0.2-0.1

## 5.0.0-0.1

### Patch Changes

- [#125](https://github.com/benjie/postgraphile-private/pull/125)
  [`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)
  Thanks [@benjie](https://github.com/benjie)! - Initial changesets release

- Updated dependencies
  [[`91f2256b3`](https://github.com/benjie/postgraphile-private/commit/91f2256b3fd699bec19fc86f1ca79df057e58639)]:
  - ruru@2.0.0-0.0
  - @dataplan/pg@0.0.1-0.0
  - @graphile/lru@5.0.0-0.1
  - grafast@0.0.1-0.0
  - grafserv@0.0.1-0.0
  - graphile-build@5.0.0-0.1
  - graphile-build-pg@5.0.0-0.1
  - graphile-config@0.0.1-0.0
  - graphile-export@0.0.2-0.0
