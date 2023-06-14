---
sidebar_position: 3
---

# pgClassExpression

A pgClassExpression represents the value of an SQL expression extracted from a
`pgSelectSingle`, `pgUnionAllSingle` or similar step.

You won't construct a pgClassExpression directly, normally you'll get it from
`$pgSelectSingle.select(...)`, `resource.execute(...)` or similar methods.

## pgClassExpression.get(attr)

The most commonly used method on a `pgClassExpression`, this gets a step
representing the value of the given attribute from the expression; only
applicable when the expression represents a composite type.

## Not opaque

Unlike a `pgSelectSingle`, a `pgClassExpression` is _not_ opaque, so it's fine
to use it directly as a dependency of any other step.
