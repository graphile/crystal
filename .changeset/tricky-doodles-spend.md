---
"grafserv": patch
---

Fix support for HTTP 304 in @whatwg/node adaptor, thereby fixing serving of
static assets with ETag headers (thanks @valerii15298!)
