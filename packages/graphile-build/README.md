# graphile-build

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/donate-via%20Patreon-orange.svg" alt="Patreon donate button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-build.svg?style=flat)](https://www.npmjs.com/package/graphile-build)
![MIT license](https://img.shields.io/npm/l/graphile-build.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

`graphile-build` is the core of Graphile Engine. It provides a framework to
build high-performance extensible GraphQL APIs by combining plugins and using
advanced query look-ahead features. Each plugin typically has its own small
purpose (such as implementing the Node interface, adding `query: Query` to
mutation payloads, or watching an external source for schema changes) and by
combining these plugins together you get a large, powerful, and manageable
GraphQL schema. Plugins enable you to make broad changes to your GraphQL
schema with minimal code and without sacrificing performance.

An example of an application built on `graphile-build` is
[PostGraphile](https://github.com/graphile/postgraphile) which with one
command connects to your PostgreSQL database and provides a full highly
performant standards-compliant GraphQL API. The separate `graphile-build-pg`
module contains the plugins that are specific to PostgreSQL support
(`graphile-build` itself does not know about databases).

**For in-depth documentation about `graphile-build`, please see [the graphile
documentation website at graphile.org](https://www.graphile.org/).** The
below just serves as a limited quick-reference for people already familiar
with the library.

**Please note: rather than using the raw plugin interface that
`graphile-build` exposes, you may want to use the helpers in
the `graphile-utils` module.**