---
title: PostGraphile JWT/JWK verification quick-start
---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

This guide is an adaption of the official quickstart tutorial for Node (Express)
provided by
[Auth0](https://auth0.com/docs/quickstart/backend/nodejs/01-authorization). The
code illustrates how to intercept and verify a
[JWT Access Token](https://auth0.com/docs/tokens/concepts/jwts) via a
[JWKS (JSON Web Key Set)](https://auth0.com/docs/jwks) using
[Auth0](https://auth0.com/).

Although this code should work, we make no claims as to its validity or fit for
production use. We disclaim all liability.

### Dependencies

This guide uses the [`express`](https://www.npmjs.com/package/express) HTTP
framework and supporting Node packages authored and maintained by Auth0:

- [`express-jwt`](https://github.com/auth0/express-jwt) - _Middleware that
  validates a JWT and copies its contents to `req.user`_
- [`jwks-rsa`](https://github.com/auth0/node-jwks-rsa) - _A library to retrieve
  RSA public keys from a JWKS (JSON Web Key Set) endpoint_

```bash
yarn add express express-jwt jwks-rsa
# Or:
npm install --save express express-jwt jwks-rsa
```

### Prior Knowledge & Context

As a developer, the three essential aspects of Auth0 are:

- [_APIs_](https://auth0.com/docs/apis) and
  [_Applications_](https://auth0.com/docs/applications)
- [_JWT types_](https://auth0.com/docs/tokens) (e.g. _ID Token_ vs. _Access
  Token_)
- Authentication and Authorization [_Flows_](https://auth0.com/docs/flows)

To keep it simple, in this guide we will be dealing with an
[Access Token](https://auth0.com/docs/tokens/overview-access-tokens) granted by
an API which we will need to verify.

## Getting Started

You will need two values from your Auth0 configuration: The Auth0 _tenant domain
name_, and the API _identifier._

```javascript {1-2,20,24-25}
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// ...

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set.
// On successful verification, the payload of the
// decrypted Access Token is appended to the
// request (`req`) as a `user` parameter.
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the `kid` in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: "YOUR_API_IDENTIFIER",
  issuer: `https://YOUR_DOMAIN/`,
  algorithms: ["RS256"],
});
```

(note: if we were processing an
[ID Token](https://auth0.com/docs/tokens/id-token) instead of an Access Token,
the _audience_ would be the _Client ID_ instead)

Remember that a JWT has
[three _period-separated_ sections](https://jwt.io/introduction/): header,
payload, and signature. On successful verification, the payload will be
available for us to save inside the PostGraphile request via the
[`pgSettings`](./usage-library/#exposing-http-request-data-to-postgresql)
function.

Let's look at an example payload:

```json {8}
{
  "iss": "https://YOUR_DOMAIN/",
  "sub": "CLIENT_ID@clients",
  "aud": "YOUR_API_IDENTIFIER",
  "iat": 1555808706,
  "exp": 1555895106,
  "azp": "CLIENT_ID",
  "scope": "read:schema", // scopes a.k.a. permissions
  "gty": "client-credentials"
}
```

In this example payload, we can see that the only scope the API has made
available is `read:schema`. Our user can perform no mutations, nor can they
perform any queries, they are limited to fetching the schema. Not all tokens
will have such simple payloads, but, in this example, the only meaningful data
is in the `scope` value.

Now let's make use of the `checkJwt` middleware function:

```javascript {23-24,28-36}
const express = require("express");
const { postgraphile } = require("postgraphile");

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// ...

const checkJwt = jwt({
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

const app = express();

// Apply checkJwt to our graphql endpoint
app.use("/graphql", checkJwt);

app.use(
  postgraphile(process.env.DATABASE_URL, process.env.DB_SCHEMA, {
    pgSettings: (req) => {
      const settings = {};
      if (req.auth) {
        settings["user.permissions"] = req.auth.scope;
      }
      return settings;
    },
    // any other PostGraphile options go here
  }),
);
```

PostGraphile applies everything returned by
[pgSettings](./usage-library/#pgsettings-function) to the
[current session](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-SET)
with `set_config($key, $value, true)`. So inside Postgres we can read the
current value of `user.permissions` by
`select current_setting('user.permissions', true)::text;`.

## Basic Error Handling

By default, if there is an error in the JWT verification process, the
`express-jwt` package will send a 401 status with an HTML-formatted error
message as a response. Instead, we want to follow the pattern of PostGraphile
and return errors properly formatted in a
[GraphQL-compliant](http://graphql.github.io/graphql-spec/June2018/#sec-Errors)
JSON response.

Let's create a basic Express middleware for handling the errors which our
`checkJwt` function will throw:

```javascript
const authErrors = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log(err); // You will still want to log the error...
    // but we don't want to send back internal operation details
    // like a stack trace to the client!
    res.status(err.status).json({ errors: [{ message: err.message }] });
    res.end();
  }
};

// Apply error handling to the graphql endpoint
app.use("/graphql", authErrors);
```

So, now, for example, if someone tries to connect to our GraphQL service without
any token at all, we still get a 401 status, but with the appropriate and
succinct response:

```json
{
  "errors": [
    {
      "message": "No authorization token was found"
    }
  ]
}
```

---

_This article was written by [BR](http://gitlab.com/benjamin-rood)._
