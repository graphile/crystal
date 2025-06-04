---
"grafast": patch
"postgraphile": patch
---

🚨 Complete overhaul of polymorphism:

- Centralized the responsibility of polymorphic resolution from field plan
  resolvers into abstract types.
- Eliminated the concept of "polymorphic capable" steps: any step may now be
  used for polymorphism.
- Steps such as `polymorphicBranch`, `pgPolymorphism`, and other polymorphism
  related steps no longer exist as they are no longer supported in this new
  paradigm.
- Abstract types gain a `planType` method: passed a `$specifier` step from the
  field plan resolver, and returns an `AbstractTypePlanner` object which returns
  a `$__typename` step indicating the concrete object type name for this
  `$specifier` along with an (optional) `planForType(objectType)` method to plan
  how to turn the `$specifier` into a step suitable for usage by the given
  object type (assuming the `$__typename` matches).
- No more exponential branching: we now merge the previous polymorphic branch
  into a single `$specifier` step before planning the next level of
  polymorphism.

PostGraphile Postgres-level polymorphism users are unaffected (all changes have
been done for you); SQL queries are now slightly smaller, and in general there
may be fewer requests to the DB.

If you've written your own plan resolvers by hand, first: thanks for being
brave! Second, sorry... You're going to have to rewrite them. Hopefully the
result will be a net reduction in complexity though &mdash; you can move
repetative polymorphism handling code from the field plan resolvers themselves
to the new `planType` method on the abstract type. It's hard to explain all the
possible ways of re-writing these plans, so read the docs about the new pattern
first and, if you still need help, please do reach out
[on Discord](https://discord.gg/graphile)!

This is the last breaking change to hand written plan resolvers that we expect
to make before the v1.0 release (other than some improvements around TypeScript
types) and marks the completion of the fourth and final epic that was outlined
in the first Grafast Working Group. With this change, we're much closer to
moving to release candidate status!
