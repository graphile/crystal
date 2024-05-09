---
sidebar_position: 2
---

# pgSelect and pgSelectSingle

Though you don't typically create a `pgSelect()` or `pgSelectSingle()` step
manually (instead using the `.get()`, `.find()` or `.execute()` methods on the
relevant resource), they are the step classes that you'll likely interact with
the most in `@dataplan/pg`.

## pgSelect

`pgSelect()` represents a selection of rows from the database. You might get a
pgSelect instance such as `$pgSelect` in this example:

```ts
// `pgSelect()` step representing all the messages in forum 1:
const $pgSelect = registry.pgResources.messages.find({ forum_id: constant(1) });
```

Once you have access to a `pgSelect()` step, you may use its various methods to
add conditions, reorder it, add pagination limits, and so on.

:::info

You can only make these changes whilst planning the field in which the
`pgSelect()` was created. Once that field plan is finalized (via the Gra*fast*
`deduplicate` lifecycle event) any changes to conditions, ordering, etc may
cause your schema to violate the GraphQL specification, and thus these actions
are forbidden.

:::

:::warning

If you are using a pgSelect in a mutation plan resolver, and that pgSelect has
side effects (e.g. calls a `VOLATILE` database function), then ensure that the
[resource](./registry/resources) representing the function is correctly
configured with `isMutation: true` and that you are creating the step through
`resource.execute()`. (If this is not done then in some circumstances it's
possible that the step may be tree-shaken away and thus the side effects may
never occur.)

(Alternatively, if creating the `pgSelect` directly, create it with
`mode="mutation"`, or set `$pgSelect.hasSideEffects = true;`.)

:::

Below we've documenting the most commonly used properties and methods, for full
documentation you should explore the methods and their types through
TypeScript.

Note that methods that are generally used internally or via helper steps such
as `connection()` have not been documented because you typically won't call
these yourself.

### $pgSelect.alias

Since the same table might appear multiple times in the resulting query (once
the queries have been inlined/merged), each $pgSelect is given its own alias.
The alias is an SQL fragment representing the underlying table, useful so that
you can reference a column of the table or similar:

```ts
const $users = usersResource.find();
const tbl = $users.alias;
$users.where(sql`${tbl}.username = 'Benjie'`);
```

### $pgSelect.single()

If this plan may only return one record, you can use `$pgSelect.single()` to
return a plan that resolves to either that record (in the case of composite
types) or the underlying scalar (in the case of a resource whose codec has no
attributes).

Beware: if you call this and the database might actually return more than
one record then you're potentially in for a Bad Time.

```ts
// Instead of:
//     const $user = usersResource.get({ id: constant(1) });
// you could do:
const $user = usersResource.find({ id: constant(1) }).single();
```

### $pgSelect.singleAsRecord()

Most likely you want `.single()` instead; only use this if you specifically
need a `PgSelectSingleStep` instance even though you're querying a scalar.

### $pgSelect.row($row)

You can use this to create a `pgSelectSingle` instance based on an arbitrary
entry from a `$pgSelect`, e.g. to get the first row from a `$pgSelect` set as a
`pgSelectSingle` you might do:

```ts
const $row = $pgSelect.row(first($pgSelect));
```

### $pgSelect.orderBy(spec)

Adds an ordering clause to the query. Can be called multiple times to add more
ordering clauses, these are always appended to the existing list.

The argument can either be an attribute spec, an object with the following properties:

- `attribute` (required) - the name of the attribute to sort by, must be one of the attributes on the codec the $pgSelect represents
- `callback` (optional) - used to wrap the attribute in an expression
- `direction` (required) - `"ASC"` or `"DESC"`
- `nulls` (optional) - `"FIRST"` or `"LAST"` or `null`

or a fragment spec, an object with the following properties:

- `fragment` (required) - an SQL expression to order by
- `codec` (required) - the codec that matches the type of the expression in `fragment`
- `direction` (required) - `"ASC"` or `"DESC"`
- `nulls` (optional) - `"FIRST"` or `"LAST"` or `null`

#### Example

```ts
// Get a pgSelect:
const $users = usersResource.find();

// Sort by username length
$users.orderBy({
  attribute: "username",
  callback(usernameExpression, codec) {
    return [sql`length(${usernameExpression})`, TYPES.int];
  },
  direction: "ASC",
  nulls: "LAST",
});

// Sort within that by user id
$users.orderBy({ attribute: "id", direction: "ASC" });

// Result is something like:
// `SELECT ... FROM users ORDER BY length(username) ASC NULLS LAST, id ASC`
```

### $pgSelect.setOrderIsUnique()

Call this if you are certain that the order that you've specified is sufficient
to ensure that there are no ambiguities in the ordering (i.e. it is stable). If
you don't do this then we might (if unique order is required, for example for
cursor pagination) add the primary key or similar unique constraint to the
ordering in order to make it stable.

### $pgSelect.where(condition)

Adds a `WHERE` clause to the query, can be called multiple times and the
conditions will be appended with `AND`.

```ts
const $users = usersResource.find();
const tbl = $users.alias;
$users.where(sql`${tbl}.username = 'Benjie'`);
```

### $pgSelect.placeholder($step, codec)

Placeholder accepts an arbitrary step and a codec representing what its SQL
type should be (optional if the step already contains details of the codec) and
returns an SQL expression that allows the value of the step to be referenced
inside an SQL query.

```ts
const $users = usersResource.find();
const tbl = $users.alias;

const $username = fieldArgs.get("username");
const frag = $users.placeholder($username, TYPES.citext);

$users.where(sql`${tbl}.username = ${frag}`);
```

### $pgSelect.singleRelation(relationName)

Forces the `$pgSelect` to do a left join to the given relation and gives you an
alias representing this join; useful for building conditions on related tables.

Note this method on `pgSelect` (collection) differs from the same named method
on `pgSelectSingle` (row) which instead returns a step representing the related
record.

Example: "return all the posts where the forum is not archived":

```ts
const $posts = postsResource.find();
const forumAlias = $posts.singleRelation("forum");
$posts.where(sql`${forumAlias}.is_archived = false`);
return $posts;

// Result is something like:
// `SELECT ... FROM posts LEFT JOIN forums ON (...) WHERE forums.is_archived = false`
```

:::info

If the relationship is not unique then an error will be thrown.

:::

### $pgSelect.wherePlan()

Instead of adding conditions directly, this advanced method returns a
`PgConditionStep` (a "modifier step") which allows the condition to be built up
in a different way. This is particularly useful if you are building deep
filtering arguments, using the `applyPlan` plan resolver on arguments and input
fields.

### $pgSelect.setFirst($n)

Limits the number of records returned.

Currently this must be called with an input step (i.e. it must come from a
GraphQL field argument or be a constant).

### $pgSelect.setLast($n)

Limits the number of records returned, but instead of taking the first entries
in the list, it takes the last ones.

Currently this must be called with an input step (i.e. it must come from a
GraphQL field argument or be a constant).

### $pgSelect.setOffset($n)

Skips over the given number of records, cannot be combined with `setLast`.

Currently this must be called with an input step (i.e. it must come from a
GraphQL field argument or be a constant).

### $pgSelect.groupBy(spec)

Instructs the query to add a `GROUP BY` clause. Currently spec must be an
object with the following properties:

- `fragment` (required) - an SQL fragment to indicate what to `GROUP BY`

### $pgSelect.having(condition)

Like `$pgSelect.where(condition)`, but for the `HAVING` clause of a grouped
query and only supports the SQL fragment condition form.

TODO: THIS METHOD IS UNTESTED!

### $pgSelect.havingPlan()

Like `$pgSelect.wherePlan()` but for the `HAVING` clause.

TODO: THIS METHOD IS UNTESTED!

### $pgSelect.setUnique()

Call this ONLY if there can be at most one matching row. If you set this true
when this is not the case then you may get unexpected results during inlining;
if in doubt leave it at the default.

### $pgSelect.hasMore()

Returns a step indicating if there's a next page or not (by selecting 1 extra
row and throwing it away). Typically this is used by the `connection()` steps
`pageInfo` logic and you wouldn't call it yourself.

### $pgSelect.setInliningForbidden()

Call this if you wish to prevent this query from being inlined into its parent.
You may want to do this to work around a performance issue, or to improve the
cacheability of the step.

### $pgSelect.setTrusted()

By default, all `pgSelect` steps will apply the authorization checks that their
resource specifies, for example to apply conditions similar to row-level
security. Call this if you wish to bypass this behavior, for example if you know
that the conditions would pass because the parent was visible.

```ts
const plans = {
  Forum: {
    posts($forum) {
      const $posts = postsResource.find({ forum_id: $forum.get("id") });

      // If we can see the forum, then we can see all the posts inside the
      // forum, so don't bother adding the access conditions:
      $posts.setTrusted();

      return $posts;
    },
  },
};
```

## pgSelectSingle

`pgSelectSingle()` represents a single row from within a `pgSelect()`
collection. Typically you wouldn't build an instance of this directly, instead
you'd get it from `resource.get()`, `resource.execute()` (for isUnique
functions), from the entries in a list from a `pgSelect`, or via
`$pgSelect.single()`.

Here are some of the more commonly used methods:

### $pgSelectSingle.get(attr)

The absolute most commonly used method on a `pgSelectSingle`, this gets a step
representing the value of the given attribute from the row.

:::important

You must always use `$pgSelectSingle.get(attr)` rather than
`access($pgSelectSingle, attr)` or similar for multiple reasons:

1. the data a `pgSelectSingle` contains is an unpredictable tuple (see [Opaque steps](#opaque-steps) below),
2. the `.get(attr)` tells the related `pgSelect` step to add the `attr` to the list of expressions to `SELECT`

:::

### $pgSelectSingle.select(fragment, codec)

Returns a PgClassExpressionStep representing the value of the given SQL
expression.

```ts
const $user = usersResource.find({ id: constant(1) });
const $usernameLength = $user.select(sql`length(username)`, TYPES.int);
```

### $pgSelectSingle.placeholder($step, codec)

Identical to `$pgSelect.placeholder($step, codec)` on the underlying `pgSelect` step.

### $pgSelectSingle.singleRelation(relationName)

Returns a `pgSelectSingle` representing the single record related via the
`relationName` relation.

Do not confuse with `$pgSelect.singleRelation`.

### $pgSelectSingle.manyRelation(relationName)

Returns a `pgSelect` representing the records related via the
`relationName` relation.

### $pgSelectSingle.record()

Returns a PgClassExpressionStep representing the entire table, useful for debugging or to use with `pgSelectSingleFromRecord`.

Here's a debugging example, we log out the full record to make sure it's the one we wanted:

```ts
const plans = {
  Query: {
    getUserById(_, { $id }) {
      const $user = usersResource.get({ id: $id });

      // Get the full user object as a record and log it for debugging:
      const $record = $user.record();
      sideEffect($record, (user) => console.dir(user));

      return $user;
    },
  },
};
```

### $pgSelectSingle.cursor()

Returns a step representing the cursor of this row, typically used for
the `cursor` field in a connection edge.

### $pgSelectSingle.getClassStep()

Returns the `PgSelectStep` that this `$pgSelectSingle` came from. Useful to get
the `alias`, among other things.

## pgSelectFromRecords(resource, $records)

Builds a `pgSelect` step representing the multi-row data in `$records` as if
they had come from the `resource` resource.

## pgSelectFromRecord(resource, $record)

Builds a `pgSelect` step using the single-row data in `$record` as if it had
come from the `resource` resource.

## pgSelectSingleFromRecord(resource, $record)

Equivalent to `pgSelectFromRecord(resource, $record).single()`.

## Opaque steps

`pgSelect` and `pgSelectSingle` are what we call "opaque steps" - that is you
are not intended to use their underlying data directly, instead you use their
methods to extract the data you need to use with other steps.

Currently a `pgSelectSingle` doesn't use the object representation you might
expect, instead it uses a tuple with entries for each of the selected
attributes. The makeup of this tuple will vary depending on which attributes
you requested, and in which order, so you must not rely on its structure. To
get an attribute you should use `$pgSelectSingle.get(attr)` or similar
