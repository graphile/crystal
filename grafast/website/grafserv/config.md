---
sidebar_position: 2
---

# Configuration

Grafserv is configured via a [`graphile-config`
preset](https://star.graphile.org/graphile-config/preset), typically stored to
`graphile.config.ts` (or variants with an alternative file extension).

## Minimal example

The preset can be an
empty object, in which case the defaults will be used:

```ts title="graphile.config.ts"
export default {};
```

## Common example

Common settings you might wish to configure are outlined below:

```ts title="graphile.config.ts"
import type {} from "grafserv";

const preset: GraphileConfig.Preset = {
  grafserv: {
    port: 5678,
    host: "0.0.0.0",
    dangerouslyAllowAllCORSRequests: false,
    graphqlPath: "/graphql",
    graphiqlPath: "/",
    eventStreamPath: "/graphql/stream",
    graphqlOverGET: true,
    graphiql: true,
    websockets: true,
    maxRequestLength: 100000,
  },
};

export default preset;
```

## `grafserv` Configuration Reference

The following options apply to the `grafserv` section of your Graphile Config:

```ts title="graphile.config.ts"
import type {} from "grafserv";

const preset: GraphileConfig.Preset = {
  grafserv: {
    /* options go here */
  },
};

export default preset;
```

### Overview

<!-- START:OPTIONS:grafserv -->
```ts
{
  allowedRequestContentTypes?: readonly RequestContentType[];
  dangerouslyAllowAllCORSRequests?: boolean;
  eventStreamPath?: string;
  graphiql?: boolean;
  graphiqlOnGraphQLGET?: boolean;
  graphiqlPath?: string;
  graphiqlStaticPath?: string;
  graphqlOverGET?: boolean;
  graphqlPath?: string;
  host?: string;
  maskError?: MaskErrorFn;
  maxRequestLength?: number;
  outputDataAsString?: boolean;
  parseAndValidateCacheSize?: number;
  port?: number;
  schemaWaitTime?: number;
  watch?: boolean;
  websocketKeepalive?: number;
  websockets?: boolean;
}
```

### grafserv.allowedRequestContentTypes

Type: `readonly RequestContentType[] | undefined`

By default `application/json` and `application/graphql` are supported
(`DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES`). You may add
`application/x-www-form-urlencoded` to the list, but be aware that
doing so potentially opens you to CSRF issues even if you're not using
CORS since this media type is handled specially by browsers - ensure
that you have CSRF protections in place.

Note further that if you're using CORS the other media types are not
safe, and you should still use CSRF protection.

### grafserv.dangerouslyAllowAllCORSRequests

Type: `boolean | undefined`

Temporary hack to allow easy testing with graphql-http.com

### grafserv.eventStreamPath

Type: `string | undefined`

The path at which the GraphQL event stream would be made available; usually /graphql/stream

### grafserv.graphiql

Type: `boolean | undefined`

### grafserv.graphiqlOnGraphQLGET

Type: `boolean | undefined`

If true, then we will render GraphiQL on GET requests to the /graphql endpoint

### grafserv.graphiqlPath

Type: `string | undefined`

The path at which GraphiQL will be available; usually /

### grafserv.graphiqlStaticPath

Type: `string | undefined`

The path from which GraphiQL's static assets are served, must end in a slash. Usually /ruru-static/

### grafserv.graphqlOverGET

Type: `boolean | undefined`

If true, allow GraphQL over GET requests. This has security ramifications, exercise caution.

### grafserv.graphqlPath

Type: `string | undefined`

The path at which GraphQL will be available; usually /graphql

### grafserv.host

Type: `string | undefined`

Host to listen on

### grafserv.maskError

Type: `MaskErrorFn | undefined`

If you would like to customize the way in which errors are masked, you may
pass your own error masking function here. You can also import
`defaultMaskError` from `grafserv`.

### grafserv.maxRequestLength

Type: `number | undefined`

The length, in bytes, for the largest request body that grafserv will accept

### grafserv.outputDataAsString

Type: `boolean | undefined`

Use grafast 'string' optimization - response will be partially stringified
already, use `stringifyPayload` before sending to the user

### grafserv.parseAndValidateCacheSize

Type: `number | undefined`

How many documents should we cache the parse and validate result for?

### grafserv.port

Type: `number | undefined`

Port number to listen on

### grafserv.schemaWaitTime

Type: `number | undefined`

How long (in milliseconds) should we wait for a schema promise to resolve before sending a failure to the client?

### grafserv.watch

Type: `boolean | undefined`

Set true to enable watch mode

### grafserv.websocketKeepalive

Type: `number | undefined`

Duration (in milliseconds) between pings. Set to `-1` to disable.

### grafserv.websockets

Type: `boolean | undefined`

Should we enable a websockets transport if available?
<!-- END:OPTIONS:grafserv -->
