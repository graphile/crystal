---
"postgraphile": patch
"grafserv": patch
---

🚨 'application/x-www-form-urlencoded' is now opt-in (unless you're using the V4
preset).

CSRF and CORS are tricky topics. When you use PostGraphile as part of a larger
system, it's your responsibility to ensure that you don't open yourself up to
CSRF/etc issues (e.g. by using CSRF/XSRF tokens, by using `SameSite` cookie
policies, by checking the `Origin` of requests, or by using a combination of
these or other techniques).

Out of the box, PostGraphile does not use cookies, so any cross-origin requests
are harmless because an attacker without the actual user token in hand can only
execute unauthenticated requests.

However, once cookies (and sessions) enter the equation, suddenly CSRF becomes a
risk. Normally you cannot submit an `Content-Type: application/json` request
cross origins (unless you've enabled CORS), so this content type doesn't open
CSRF issues on its own, but `Content-Type: application/x-www-form-urlencoded`
can be submitted cross origins without CORS policies. The attacker won't be able
to view the response, but that doesn't mean they can't cause havoc by triggering
dangerous mutations using the user's credentials.

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
