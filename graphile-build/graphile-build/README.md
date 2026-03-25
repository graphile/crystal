# graphile-build

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

`graphile-build` provides a framework to build extensible GraphQL APIs by
combining plugins. Each plugin typically has its own small purpose (such as
implementing the [`Node` interface][global-object-identification], adding
`query: Query` to mutation payloads, or watching an external source for schema
changes) and by combining these plugins together you get a large, powerful, and
manageable GraphQL schema. Plugins enable you to make broad changes to your
GraphQL schema with minimal code, and because you're changing your schema in
broad ways it helps to guarantee consistency.

Graphile Build has strong built-in support for [Gra*fast*](https://grafast.org)
so you can make an exceptionally performant auto-generated (or
generator-assisted) GraphQL API.

[PostGraphile](https://github.com/graphile/postgraphile) uses Graphile Build and
Gra*fast* to produce an extremely high performance standards-compliant GraphQL
API with minimal fuss. The separate
[`graphile-build-pg` module](../graphile-build-pg/README.md) contains the
plugins that are specific to PostgreSQL support (`graphile-build` itself does
not know nor care about databases).

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Documentation

TODO!

[global-object-identification]:
  https://relay.dev/graphql/objectidentification.htm
