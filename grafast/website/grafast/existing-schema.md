# Using with existing schema

To run an existing GraphQL schema with `grafast` you must ensure that the
following hold:

- Your resolvers are built into your schema, not passed via `rootValue`
- If any of your resolvers use `GraphQLResolveInfo` (the 4th argument to the
  resolver) then they must not rely on `path` since we don't currently populate
  that correctly.
- `context` must be an object (anything suitable to be used as the key to a
  `WeakMap`); if you do not need a context then `{}` is perfectly acceptable
- `rootValue`, if specified, must be an object or `null`/`undefined`

Replace any calls to graphql.js' `graphql` or `execute` functions with Grafast's
`grafastGraphql` and `grafastExecute` respectively.

```js
// import { graphql } from 'graphql';
import { grafastGraphql } from 'grafast';

const result = await /*graphql*/ grafastGraphql({
  source: ...
```

At this point you should be able to execute your GraphQL API as you previously
did, but we're not yet as optimal as we could be - it's likely that you're
planning each request every time, rather than reusing operation plans. To solve
this, you should cache the parsing of the GraphQL request. You can either handle
this yourself, or you could use a server/framework that does this for you:

## Grafserv

[Grafserv][] is Grafast's companion server; it's probably the fastest
general-purpose GraphQL server available in Node.js, but due to its youth it
doesn't yet have the large ecosystem of extensions that other servers have.
Grafserv automatically implements all optimisations that we could think of for
serving GraphQL schemas over HTTP!

## Envelop

[Envelop][] is an excellent plugin system written by the fine folks at [The
Guild][]; it can be used with most major GraphQL servers in Node.js (and some in
other environments!) so is a great way of integrating Grafast into an existing
project. We bundle a `useGrafast()` envelop plugin which you can use alongside
`useParserCache()` to get an optimized execution pipeline very easily, here's an
example:

```ts
import { envelop, useExtendContext, useSchema } from "@envelop/core";
import { useGrafast, useMoreDetailedErrors } from "grafast/envelop";
import { schema } from "./schema";

const getEnveloped = envelop({
  plugins: [
    // Use our executable schema
    useSchema(schema),

    // Caching the parser results is critical for Grafast, otherwise it
    // must re-plan every GraphQL request!
    useParserCache(),
    useValidationCache(),

    // Our context says how to communicate with Postgres
    useExtendContext(() => contextValue),

    // This replaces graphql-js' `execute` with Grafast's own
    useGrafast(),
  ],
});
```

For more context, please refer to
[Envelop's Documentation](https://www.envelop.dev/docs/getting-started).

[grafserv]: /grafserv/
[envelop]: https://www.envelop.dev/
[the guild]: https://the-guild.dev/
