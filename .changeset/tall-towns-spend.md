---
"grafserv": patch
---

🚨 Since Ruru now needs to serve static assets due to the upgrade to GraphiQL v5
and Monaco, we've had to extend Grafserv to do so. We've (theoretically) added
support in the H3, Hono and Fastify adaptors, along with the base node adaptor
(used by Node, Express, Koa); however - if you have your own adaptor for a
different server, you'll need to be sure to call the `.graphiqlStaticHandler`
for URLs that start with `dynamicOptions.graphiqlStaticPath`.

Whilst at it, we've added more places where headers can be added, and we've
added a new "raw" ResultType which can be used to serve a Node Buffer with
entirely custom headers (e.g. set your own `Content-Type`).
