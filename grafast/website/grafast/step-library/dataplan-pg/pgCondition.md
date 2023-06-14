# pgCondition

This "modifier step" (**not** an ExecutableStep) is commonly acquired from
`$pgSelect.wherePlan()`, `$pgSelect.havingPlan()`, or similar methods. It's
useful for building up a condition (`WHERE` or `HAVING` clause) bit by bit.

:::tip

This is an advanced step, you probably will never use it unless you're building
advanced filtering capabilities into your GraphQL schema.

:::

pgConditions are created with a parent (a PgConditionCapableStep - typically another PgConditionStep, a PgSelectStep, or similar) and a mode:

- `PASS_THRU` - passes conditions directly up to the parent
- `AND` - combines conditons with `AND` and passes the result up to the parent
- `OR` - combines the conditions with `OR` and passes the result up to the parent
- `NOT` - combines the conditons with `AND`, groups them together and does a `NOT` of the result, which is then passed up to the parent
- `EXISTS` - builds an `EXISTS(...)` expression utilising the conditions and passes it up to the parent

## $pgCondition.orPlan()

Returns a child pgCondition in `OR` mode.

## $pgCondition.andPlan()

Returns a child pgCondition in `AND` mode.

## $pgCondition.notPlan()

Returns a child pgCondition in `NOT` mode.

## $pgCondition.existsPlan(options)

Returns a child pgCondition in `EXISTS` mode with the given options.

## $pgCondition.where(condition)

Adds `condition` to the list of conditions. Cannot be used in "having" mode.

## $pgCondition.having(condition)

Adds `condition` to the list of conditions. Cannot be used unless in "having" mode.

## $pgCondition.placeholder($step, codec)

Equivalent to `$pgSelect.placeholder($step, codec)`
