---
sidebar_position: 1
---

# Grafast Introduction

The GraphQL specification describes how a GraphQL operation should be executed,
talking in terms of layer-by-layer resolution of data using "resolvers." But
critical to note is this sentence from the beginning of the specification:

> _Conformance requirements [...] can be fulfilled [...] in any way as long as
> the perceived result is equivalent._  
> ─ https://spec.graphql.org/draft/#sec-Conforming-Algorithms

Before Gra*fast*, there was only one GraphQL execution engine available in
JavaScript: the GraphQL reference implementation, which we will refer to as
[graphql-js][] from now on. A design goal of graphql-js is to follow the
specification as much as possible, it therefore follows the advice to use
resolvers.

Resolvers are relatively straightforward to understand, but when implemented
naively can very quickly result in serious performance issues. [DataLoader][] is
one of the approaches suggested to solve the "N+1 problem," but this is only the
most egregious performance issue that a naive GraphQL schema may face - there
are other such as server-side over-fetching and under-fetching and related
issues.

Gra*fast* was designed from the ground up to eliminate these issues and more
whilst maintaining pleasant APIs for developers to use. To do this, it eschews
the concept of opaque resolvers, favoring instead a planning strategy that
unlocks the potential for significant optimizations not previously achievable
without hundreds or thousands of lines of custom logic.
