# Gra*fast*

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Patreon sponsor button](https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg)](https://patreon.com/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GrafastHQ-blueviolet.svg)](https://twitter.com/GrafastHQ)

_**The next-generation planning and execution engine for GraphQL**_

**Documentation**: https://grafast.org/grafast/

## About

Gra*fast* understands GraphQL and (with your help) your business logic; this
allows it to orchestrate a GraphQL request's data requirements in an extremely
efficient manner, leading to excellent performance, reduced server load, and
happier customers.

This increased efficiency is achieved by leveraging the declarative nature of
GraphQL and deeper integration with your existing Node.js or remote business
logic via "plan resolvers" attached to the fields of your schema. These plan
resolvers detail the abstract steps necessary to execute the given field, these
steps are then combined with the steps from all other fields in the request into
an operation plan. This operation plan can then be rewritten and optimized
before execution, and can often be re-used for similar queries in the future.

In addition to "plan resolvers," Gra*fast* is also backwards compatible with
traditional resolvers - in fact most existing GraphQL.js schemas should already
be executable via Gra*fast* (and doing so should result in a small speed
improvement). Replace your resolvers with Gra*fast* plan resolvers to see the
real efficiency gains!

Gra*fast* schemas can be built using the same techniques other GraphQL.js
schemas can be built - Gra*fast* schemas _are_ GraphQL.js schemas - for example
schema-first, code-first or auto-generated. If you maintain a library that
builds GraphQL schemas, get in touch - we'd love to help you integrate Gra*fast*
with it!

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://dovetailapp.com/"><img src="https://graphile.org/images/sponsors/dovetail.png" width="90" height="90" alt="Dovetail" /><br />Dovetail</a> *</td>
<td align="center"><a href="https://www.netflix.com/"><img src="https://graphile.org/images/sponsors/Netflix.png" width="90" height="90" alt="Netflix" /><br />Netflix</a> *</td>
<td align="center"><a href="https://stellate.co/"><img src="https://graphile.org/images/sponsors/Stellate.png" width="90" height="90" alt="Stellate" /><br />Stellate</a> *</td>
</tr><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
<td align="center"><a href="https://www.sylvera.com/"><img src="https://graphile.org/images/sponsors/sylvera.svg" width="90" height="90" alt="Sylvera" /><br />Sylvera</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Overview

Gra*fast* is an alternative GraphQL execution engine for JavaScript; you can use
it as a drop-in replacement for the "execute" method of GraphQL.js. Any GraphQL
server that allows replacement of the `execute` method (which includes any
server that fully supports [envelop][]) can support Gra*fast*.

When Gra*fast* sees a GraphQL request for the first time it will "plan" the
request: figuring out the data requirements, the steps that need to be taken,
and how to write the results to the response. This "first draft" plan will be
optimised and rewritten to give the best achievable performance (for example
removing redundant or duplicate processing steps, rewriting and merging
processing steps, etc). Finally, the plan will be executed, and the response
returned to the client. Future requests that are compatible with this plan can
be executed immediately without a need to re-plan.

## Requirements

Gra*fast* should work with any GraphQL.js schema that matches the following
requirements:

- GraphQL.js v16+
- you must not override the default GraphQL field resolver (TODO: support this)
- for every request:
  - `context` must be an object (anything suitable to be used as the key to a
    `WeakMap`); if you do not need a context then `{}` is perfectly acceptable
  - `rootValue` must be an object or `null`/`undefined`
- resolver limitations:
  - only explicit field resolvers (baked into the GraphQL schema) are supported,
    i.e. resolvers passed via `rootValue` are not (currently) supported
  - our support for traditional GraphQL resolvers does not have full parity with
    the fourth argument to `resolve` (aka `resolveInfo`) - in particular, the
    `resolveInfo.path` property is not currently supported.

If you find a GraphQL schema that matches these requirements and doesn't work
with Gra*fast*, please file an issue.

## Advice

To reap the most benefit from using Gra*fast*, you want as little to change
between executions as possible. In particular, this means you should:

- **CRITICAL**: Cache (e.g. with a LRU cache) the parsed GraphQL document, so
  the same AST can be reused over and over for the same document
  - `grafserv` handles this for you
  - Envelop users can use `@envelop/parser-cache` for this
- Don't use `rootValue` (Do you really need it? Use `context` instead.)
- Where possible, memoize the variables object (e.g. using a cache over
  `canonicalJSONStringify(variables)`) so the same variables results in the same
  object in memory
- Cache (e.g. with a LRU cache) the GraphQL `context` object, so the same
  context can be reused over and over for the same user
  - This is less important - feel free to break it if you need to, for example
    if you're still using DataLoaders during migration

## Usage

Where you would use `graphql` from the `graphql` module, use `grafast` instead:

```diff
-import { graphql } from "graphql";
+import { grafast as graphql } from "grafast";
```

Where you would use `execute` from the `graphql` module, use `grafast`'s
`execute` instead:

```diff
-import { execute } from "graphql";
+import { execute } from "grafast";
```

## Full documentation

https://grafast.org/grafast/
