---
sidebar_position: 1
---

# Ruru

Ruru[^1] is a distribution of [Graph*i*QL](https://github.com/graphql/graphiql), the
GraphQL IDE, that:

- integrates the popular ["GraphiQL Explorer"](https://github.com/onegraph/graphiql-explorer) plugin
- supports automatic hot-reloading GraphQL schemas via the `X-GraphQL-Event-Stream` header
- focusses on ease of deployment
- contains enhancements for use with a [<Grafast />](/grafast)-powered servers[^2]
  (namely: view your plan diagrams and similar debugging)
- is somewhat customizable
- will be more customizable in future

## Running

**See a demo of Ruru in action in the [Gra*fast* playground](/playground).**

**Or try: [ruru serving https://countries.trevorblades.com/graphql](https://grafast.org/myruru/#endpoint=https%3A%2F%2Fcountries.trevorblades.com%2Fgraphql).**

You can run Ruru in many ways:

- [HTML file](./html.md) &mdash; entirely browser-based
  - hosted: `https://grafast.org/myruru/#endpoint=http%3A%2F%@Fexample.com%2Fgraphql` (requires CORS)
  - self-hosted: serve the [`ruru.html`](https://unpkg.com/ruru/ruru.html) file from
    your endpoint's origin
  - [embedded](./html.md#embedded) on an existing webpage
- [CLI](./cli.md) &mdash; proxy bypasses CORS, works offline, great for debugging
  arbitrary GraphQL APIs
  - instant usage (no permanent installation): `npx ruru -SPe http://...`
  - install globally: `npm install --global ruru`
  - install locally: `npm install --save-dev ruru`
- [server](./server.md) &mdash; best for your own Node.js based GraphQL API
  - integrate via the `ruruHTML({...})` HTML generator function
  - (optional) companion `serveStatic(...)` middleware enables offline usage

[^1]:
    Jem and I are big fans of the late Terry Pratchett's Discworld universe. The
    city at the centre of many a Discworld tale is the twin-city city-state of
    Ankh-Morpork. A "morepork" is a type of New Zealand owl, known in Māori as
    "ruru."[^3] Owls have excellent sight, and Ruru helps you to get an insight into not
    just the inputs and outputs of your API, but also what it does internally.
    [GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

[^2]: <Grafast /> is not required to run Ruru

[^3]:
    RURU is also an abbreviation for checks to use when gathering information: "is
    it Reliable, Up-to-date, Relevant, and Useful?" We hope that you'll find Ruru to
    be all those things!

[graphiql]: https://github.com/graphql/graphiql
[grafast]: https://grafast.org
