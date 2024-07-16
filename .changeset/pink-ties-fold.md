---
"grafast": patch
---

GraphQL resolver emulation now cascades to ancestors, fixing issues with
polymorphic fields using default Grafast plan resolvers and breaking rather than
using the default GraphQL.js resolution process as they should. (Pure Grafast
schemas should not be affected, this only matters where resolvers are used.)
