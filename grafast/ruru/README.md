# ruru

A distribution of [Graph*i*QL][graphiql] that's easy to use and embeds both the
popular [GraphiQL Explorer](https://github.com/onegraph/graphiql-explorer)
plugin and [Gra*fast*][grafast]-related tools such as viewing of plan diagrams
and explaining executed operations. _(Ruru can be used without Gra*fast*.)_

Flexible usage options

- [a CLI](https://grafast.org/ruru/cli) - temporary or installed
- [a Node.js middleware](https://grafast.org/ruru/server)
- [a static HTML file](https://grafast.org/ruru/html) - hosted or self-hosted
- [embedded](https://grafast.org/ruru/html#embedded) - render Ruru into your
  existing HTML pages

See it in action at:

https://grafast.org/myruru/#endpoint=https://countries.trevorblades.com/graphql

If you have Node installed, you can instantly run `ruru` without permanently
installing it using the `npx` command. Here's an example command to explore
[@trevorblades](https://twitter.com/trevorblades)'s countries API:

```
npx ruru -SPe https://countries.trevorblades.com/graphql
```

(`-S` enables subscriptions, `-P` proxies GraphQL requests; neither of these are
needed for Trevor's API, but you might want them for your API.)

**Documentation**: https://grafast.org/ruru

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. The pre-release nature also explains the shocking lack of
documentation.

[GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

[graphiql]: https://github.com/graphql/graphiql
[grafast]: https://grafast.org
