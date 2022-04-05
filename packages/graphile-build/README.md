# graphile-build

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphile-build.svg?style=flat)](https://www.npmjs.com/package/graphile-build)
![MIT license](https://img.shields.io/npm/l/graphile-build.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

`graphile-build` provides a framework to build extensible GraphQL APIs by
combining plugins. Each plugin typically has its own small purpose (such as
implementing the Node interface, adding `query: Query` to mutation payloads, or
watching an external source for schema changes) and by combining these plugins
together you get a large, powerful, and manageable GraphQL schema. Plugins
enable you to make broad changes to your GraphQL schema with minimal code, and
because you're changing your schema in broad ways it helps to guarantee
consistency.

Graphile Build has strong built-in support for
[DataPlanner](../graphile-crystal/README.md) so you can make an exceptionally
performant auto-generated (or generator-assisted) GraphQL API.

[PostGraphile](https://github.com/graphile/postgraphile) uses Graphile Build and
DataPlanner to produce an extremely high performance standards-compliant GraphQL
API with minimal fuss. The separate
[`graphile-build-pg` module](../graphile-build-pg/README.md) contains the
plugins that are specific to PostgreSQL support (`graphile-build` itself does
not know nor care about databases).

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask all
individuals and businesses that use it to help support its ongoing maintenance
and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://storyscript.io/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Storyscript" /><br />Storyscript</a> *</td>
<td align="center"><a href="https://postlight.com/?utm_source=graphile"><img src="https://graphile.org/images/sponsors/postlight.png" width="90" height="90" alt="Postlight" /><br />Postlight</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Documentation

TODO!
