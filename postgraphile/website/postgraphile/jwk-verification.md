---
title: JWK Verification (e.g. Auth0)
---

# PostGraphile JWT/JWK Verification Quickstart

This guide adapts Auth0’s Node (Express) quickstart so that the verified JWT
payload is forwarded to PostgreSQL through [`pgSettings`](./config#pgsettings).
It assumes you are running PostGraphile V5 using the Express adaptor from
Gra*fast*’s `grafserv`.

:::info

PostGraphile no longer verifies JWTs for you. Your web framework middleware must
handle verification, refresh tokens, revocation lists, and other security
concerns. Once you have a set of trusted claims you can expose them to
PostgreSQL. See the [JWT guide](./jwt-guide) for the bigger picture and the
[PostgreSQL JWT specification](./jwt-specification) for how claims map onto
PostgreSQL session settings.

:::

## Dependencies

This walkthrough uses Express and the Auth0-maintained helpers:

- [`express`](https://www.npmjs.com/package/express)
- [`express-jwt`](https://github.com/auth0/express-jwt)
- [`jwks-rsa`](https://github.com/auth0/node-jwks-rsa)

Install them with the package manager of your choice:

```bash
yarn add express express-jwt jwks-rsa
# Or:
npm install --save express express-jwt jwks-rsa
```

## Configure `express-jwt`

`express-jwt` verifies the Bearer token and populates `req.auth` with the JWT
payload. Configure it with your Auth0 details and JWKS endpoint:

```ts title="auth0.ts"
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
  }),
  audience: "YOUR_API_IDENTIFIER",
  issuer: `https://YOUR_DOMAIN/`,
  algorithms: ["RS256"],
});
```

## Surface trusted claims to PostgreSQL

Inside `preset.grafast.context` copy whichever details you need into
`pgSettings`. Only forward the fields your policies rely on.

```ts title="graphile.config.ts"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset],

  grafast: {
    async context(requestContext, args) {
      const req = requestContext.expressv4?.req;
      const pgSettings = {
        ...args.contextValue?.pgSettings,
      } as Record<string, string>;

      const claims = req?.auth;
      if (claims && typeof claims === "object") {
        if (typeof claims.scope === "string") {
          pgSettings["auth0.scope"] = claims.scope;
        }
        if (typeof claims.sub === "string") {
          pgSettings["jwt.claims.sub"] = claims.sub;
        }
        if (Array.isArray(claims.permissions)) {
          pgSettings["auth0.permissions"] = claims.permissions.join(" ");
        }
      }

      return {
        ...args.contextValue,
        pgSettings,
      };
    },
  },
};

export default preset;
```

The example above stores the Auth0 scope and permissions under your own
namespace and passes the `sub` claim (subject) using the conventional
`jwt.claims.*` prefix so it behaves like the legacy preset.

## Wire Express to Grafserv

Use the Auth0 middleware before mounting PostGraphile’s request handlers. The
Express adaptor lets you mount PostGraphile onto both the Express app and the
underlying HTTP server.

```ts title="server.ts"
import express from "express";
import { createServer } from "node:http";
import { grafserv } from "postgraphile/grafserv/express/v4";
import { postgraphile } from "postgraphile";

import preset from "./graphile.config.ts";
import { checkJwt } from "./auth0.ts";
import { authErrors } from "./auth-errors.ts";

const app = express();
app.use("/graphql", checkJwt, authErrors);

const server = createServer(app);
const pgl = postgraphile(preset);
const serv = pgl.createServ(grafserv);

serv
  .addTo(app, server)
  .then(() => {
    server.listen(5678);
    console.log("GraphQL running at http://localhost:5678/graphql");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
```

## Error handling

By default `express-jwt` sends HTML-formatted error pages. To keep errors inside
the GraphQL response surface the `UnauthorizedError` as JSON:

```ts title="auth-errors.ts"
import type { Request, Response, NextFunction } from "express";

export function authErrors(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err?.name === "UnauthorizedError") {
    res.status(err.status ?? 401).json({ errors: [{ message: err.message }] });
    return;
  }
  next(err);
}
```

## Using the claims in PostgreSQL

Anything placed in `pgSettings` is available inside PostgreSQL via
`current_setting(...)`. For example:

```sql
create function auth0_current_subject() returns text as $$
  select nullif(current_setting('jwt.claims.sub', true), '');
$$ language sql stable;
```

You can reference the helper inside Row Level Security policies or use it in
functions. Adjust the key names to match whatever you added to `pgSettings`.

Once everything is wired up, PostGraphile simply consumes the claims you provide
and enforces your database policies accordingly.
