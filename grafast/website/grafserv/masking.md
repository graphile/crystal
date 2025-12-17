---
sidebar_position: 4
---

# Masking errors

To protect your systems from a class of potential information disclosure bugs,
by default Grafserv masks "unsafe" errors before they reach the client. "Safe"
errors are errors that are constructed either via `new SafeError(...)`, or `new
GraphQLError(...)` without an `originalError` - all other errors are treated as
"unsafe" and will be masked by default.

Supply `preset.grafserv.maskError` to take control of error masking; the function
must return the `GraphQLError` instance that should be sent back to the caller.
If you do not provide an override, Grafserv uses `defaultMaskError`, which passes
safe errors through, but for unsafe errors it will:

1. Generate an errorId for them (random string) and a hash of the message
2. Log the error on the server side
   (`Masked GraphQL error (hash: '...', id: '...')[...]`)
3. Replace the client-facing message of the error with a reference to this
   (`An error occurred (logged with hash: '...', id: '...')`)

:::caution[Only expose intentional data]

Any data you add to the masked error will be returned to clients. Reuse the
incoming error path and avoid leaking stack traces or secrets.

:::

To log all errors on the server-side while retaining Grafserv's masking
behaviour, you can wrap the default implementation:

```js title="graphile.config.mjs"
import { defaultMaskError } from "grafserv";

export default {
  grafserv: {
    maskError(error) {
      console.error("GraphQL execution error:", error);
      return defaultMaskError(error);
    },
  },
};
```
