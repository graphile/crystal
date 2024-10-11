---
layout: page
path: /postgraphile/eval/
title: eval()
fullTitle: Limitations of using eval()
---

Input steps can have an `eval()` method which evaluates the real value of the step during planning. However, using `$__inputStep.eval()` during query planning can result in 2<sup>x</sup> potential plans being generated — a behavior which is likely unwanted due to the impact on planning time and only a small fraction of the generated plans actually being used.

# Alternatives to `eval()`

All the eval methods have a cost, but being specific about how the plans should branch reduces the number of plans generated and reduces the resulting planning time and code complexity.

`evalHas(key)`  
Results in two plans being generated, the plans branch on whether a particular `key` is set or not.

`evalIs(val)`  
Results in two plans being generated: one where `$__inputStep`'s value `=== val`, and one where it doesn't.

`evalLength()`  
Results in one plan being generated for each length of the list being used.

:::info

We are currently _evaulating_ whether to remove `eval()` completely from PostGraphile and Grafast in a future version (after Version 5), see [issue #2060](https://github.com/graphile/crystal/issues/2060). This is another reason why you should choose one of the alternatives above!

:::
