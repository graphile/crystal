---
"graphile-build-pg": patch
"postgraphile": patch
"grafserv": patch
"grafast": patch
---

Address a slow memory leak in GraphQL subscriptions that can cause OOM errors
when a single subscription hits many hundreds of thousands of events. The cause
was racing an abortPromise with each event, causing the abort promise to build
up a large list of callbacks in its internal Promise mechanics when the event
always won the race. The fix was to move from using a promise for abort to an
AbortController, where the abort task can be released after each event
successfully resolves, avoiding memory buildup. Also applied this fix to similar
patterns elsewhere in the codebase, albeit places much less sensitive to this
issue.
