---
title: "makeWrapResolversPlugin"
---

# No makeWrapResolversPlugin

Since PostGraphile V5 no longer uses resolvers, wrapping resolvers is
meaningless. And yet! Since we now use `plans`, you can suddenly do a lot more
by wrapping the plans than you ever could by wrapping resolvers - not only does
it allow you to affect the data that's returned, it also allows you to change
the very plan of what's being built!

## makeWrapPlansPlugin

This new plugin generator replaces makeWrapResolversPlugin. It has a similar
API, but it's somewhat simplified:

- No need for `requires` any more, since you can use steps to get what you need
- No resolveInfo since it's not needed in Gra*fast*
- No context, but you can retrieve it via the [`context()` step][context]

[context]: https://grafast.org/grafast/step-library/standard-steps/context
