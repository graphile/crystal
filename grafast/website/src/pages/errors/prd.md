---
title: Accessing Dependencies Forbidden in Plan Resolver
---

# Accessing Dependencies Forbidden in Plan Resolver

You're probably here because you just received an error like:

```
Accessing dependencies of a step during a plan resolver is forbidden; see:
https://err.red/gprd
```

This happens when one of your plan resolvers (or something that your plan
resolver has called, including step methods) attempts to access the
dependencies of another step. Typically this indicates you are attempting to
interact with ancestor steps, which has a significant chance of making you
non-compliant with the GraphQL specification; see: [Benjie's article on
referencing ancestors](https://benjie.dev/graphql/ancestors) (which applies to
any GraphQL schema using any technology, it is not specific to Gra*fast*).

In Gra*fast*, access to ancestors is permitted under strictly controlled
conditions to ensure compliance with the GraphQL specification. Most likely,
your access should be placed in [the `optimize` lifecycle
method](/grafast/step-classes#optimize).

For more information on this, please reach out on Discord at
https://discord.gg/graphile
