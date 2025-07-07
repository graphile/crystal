# pgCondition

:::danger OUT OF DATE

This documentation page is out of date! We've not had time to update it
correctly yet, but here's an incredibly quick and poor overview... (Please do
send a PR to update this page if you want to help!)

A PgCondition instance is a "modifier" typically acquired from a runtime query
builder via the `queryBuilder.whereBuilder()` (for `WHERE` clause) or
`queryBuilder.havingBuilder()` (for `HAVING` clause), or from another
PgCondition instance. It's used to build up complex conditions on a layer by
layer basis, which is useful for "filter" plugins.

A query builder is something that you manipulate at runtime (not plantime) but
you need to register your synchronous callback for it at plantime, e.g. via
`$pgSelect.apply($myCb)` where `$myCb` is a step representing a callback
function, for example
`const $myCb = lambda($foo, (foo) => queryBuilder => { doSomethingWith(queryBuilder, foo) })`.

:::

This "Modifier" class (**not** a Step) is commonly acquired from
`$pgSelect.wherePlan()`, `$pgSelect.havingPlan()`, or similar methods. It's
useful for building up a condition (`WHERE` or `HAVING` clause) bit by bit, and is used at runtime.

:::tip

This is an advanced class, you probably will never use it unless you're building
advanced filtering capabilities into your GraphQL schema.

:::

pgConditions are created with a parent (a PgConditionCapableParent - typically another PgCondition, a [PgSelect](./pgSelect.md), or similar) and a mode:

- `PASS_THRU` - passes conditions directly up to the parent
- `AND` - combines conditions with `AND` and passes the result up to the parent
- `OR` - combines the conditions with `OR` and passes the result up to the parent
- `NOT` - combines the conditions with `AND`, groups them together and does a `NOT` of the result, which is then passed up to the parent
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

## sqlValueWithCodec(value, codec)

Converts `value` (arbitrary value) according to the rules of `codec` (a
PostgreSQL codec indicating the expected type) and returns an SQL expression
suitable to be embedded in a larger query.
