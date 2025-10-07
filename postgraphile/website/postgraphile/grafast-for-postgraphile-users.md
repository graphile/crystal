---
title: Grafast for PostGraphile users
---

PostGraphile plans and executes fields through Gra*fast*. When building a
`plan()` function (a "field plan resolver") for use in
[`extendSchema`](./extend-schema.md) or similar you will be using Gra*fast*
"steps" to compose that part of the "operation plan", and these steps are
generated from step functions such as `loadOne()`.

Together these steps let you blend PostgreSQL data, external APIs, and custom
business logic into a single plan. Gra*fast* keeps the execution efficient while
PostGraphile gives you the extension points to shape the graph you need.

:::note[Main docs at grafast.org]

The authoritative reference for every step lives on
[grafast.org](https://grafast.org); follow the links below for the full
API.

:::

Below are the steps PostGraphile users encounter most when extending their
schema.

## Postgres-related steps

Of course it makes sense that PostGraphile users will deal with the database a
lot. Often the step that represents a specific type you're extending will be a
`pgSelectSingle` step representing a row in the database. Sometimes you'll need
to query or update other rows in the database.

### pgResources

For most query operations you'll start with the "resource" that represents your
database table, and you'll `.get()` a single row or `.find()` many rows. This
will, under the hood, create a `pgSelectSingle` or `pgSelect` step for you.

Resources are found in the `build.pgResources` object (or, equivalently,
`build.input.pgRegistry.pgResources`), keyed by the _inflected_ name of the
resource. Typically this will be the name of the table/view/function/etc:

```ts
const { users, get_users_by_organization } = build.pgResources;
```

Read more: [registry resources at
grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/registry/resources)

#### pgResource.get()

You can then select a single row from a resource by passing a "specifier" object
to `.get()`. This must identify the step to check equality with for each of the
attributes in a unique constraint or primary key:

```ts
const $user = users.get({ id: $id });
```

(Returns a `pgSelectSingle` step.)

#### pgResource.find()

Alternatively, you might wish to select many rows from the resource. You may
optionally still use a specifier object to give some equality constraints, but
more typically you will want to add your own conditions:

```ts
const $users = users.find();
$users.where(sql`${$users}.is_active = true`);
```

(Returns a `pgSelect` step.)

#### pgResource.execute()

"Resources" aren't limited to just being database tables; views, materialized
views, and even functions are also resources. For a function, you would issue an
execute command instead, passing descriptions of each argument:

```ts
const $users = get_users_by_organization.execute([
  { step: $organizationId, pgCodec: TYPES.uuid },
]);
$users.where(sql`${$users}.is_active = true`);
```

(Returns a `pgSelect` step.)

:::note[The codec is currently required]

Unfortunately the work required to make the codecs optional didn't make the cut
for the V5.0.0 release.

:::

### pgSelect

A `pgSelect` step represents selecting a list of rows from a database. It's rare
that you would construct a `pgSelect(...)` step directly; instead use the
resources as shown above.

A `pgSelect` step has loads of useful methods, including:

- `.where(...)` - add a `WHERE` clause
- `.orderBy(...)` - add an `ORDER BY` clause
- `.setOrderIsUnique()` - if you know the ordering is stable (no two rows can
  have the same values for the ordered columns) set this for efficiency
- `.groupBy(...)` - add a `GROUP BY` clause
- `.having(...)` - add a `HAVING` clause
- `.setInliningForbidden()` - prevent this select being inlined into its parent
- `.setTrusted()` - don't invoke the `selectAuth()` and other methods from the
  resource (for efficiency, presumably because they were already validated some other way).
- `.setUnique()` - indicate that this will return at most one row.
- `.single()` - return the single row (or result if this is a scalar function) from this unique pgSelect

Read more: [pgSelect at
grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/pgSelect)

### pgSelectSingle

A single row from the database is represented by a `pgSelectSingle` step. It's
used for accessing columns (`.get(columnName)`) and constructing expressions.
Common methods:

- `.get('column_name')` - read the column `column_name` from the row
- `.record()` - return an object representing the full database record
  (inefficient - avoid unless needed!)
- `.select(...)` - return a step representing the result of an SQL expression using this row, decoded with the given codec
- `.getPgRoot()` - return the fetching step this `pgSelectSingle` step came
  from - this will typically be a `pgSelect` step, but need not be (e.g. in the
  case of `pgCreateSingle`/`pgUpdateSingle`)
- `.singleRelation(relationName)` - get a `pgSelectSingle` step representing the row from
  traversing the `relationName` relation
- `.manyRelation(relationName)` - get a `pgSelect` step representing the rows from
  traversing the `relationName` relation

Read more: [pgSelectSingle at
grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/pgSelect)

## context

`context()` exposes the GraphQL context as a step so you can read or modify
per-request values. PostGraphile users might use this to access methods
that they've added to context to expose authentication information,
or even in side effects to update database settings via `pgSettings`.

```ts
import { context } from "postgraphile/grafast";

const $currentUserId = context().get("currentUserId");
```

You can also derive a new value and persist it back to context:

```ts
import { context, sideEffect } from "postgraphile/grafast";

const $context = context();

sideEffect([$context, $userId], (context, userId) => {
  context.pgSettings["jwt.claims.userId"] = userId;
});
```

Read more: [`context()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/context)

## loadOne

`loadOne()` is similar to DataLoader's `load` - it batches retrieving a values
by their identifier(s) to avoid the N+1 problem. `loadOne()` is more powerful
than the DataLoader equivalent because it lets Gra*fast* reason about requested
attributes and parameters.

Use `loadOne()` when fetching a single value from an external service (Stripe,
REST APIs, microservices, etc.) by its identifier(s); for example "load
customer by customer ID". (For PostgreSQL, lean on `@dataplan/pg` steps and
`pgResources` instead.)

```ts
import { context, loadOne } from "postgraphile/grafast";

const $currentUserId = context().get("currentUserId");
const $customer = loadOne($currentUserId, batchGetStripeCustomerByUserId);
```

Read more: [`loadOne()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/loadOne)

## loadMany

`loadMany()` is identical to `loadOne()` except it expects the result to be a
list - for example "load _invoices_ by customer ID".

```ts
import { loadMany } from "postgraphile/grafast";

const $stripeId = $customer.get("stripeId");
const $invoices = loadMany($stripeId, batchGetInvoicesByStripeCustomerId);
```

Read more: [`loadMany()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/loadMany)

## get

`get($step, key)` retrieves a property `key` from step `$step`, either using
`$step.get(key)` if it is supported, otherwise falling back to `access($step,
key)`. Use it when you're not sure whether or not `$step` will always support
`.get()`.

```ts
import { get } from "postgraphile/grafast";

const $userId = get($user, "id");
```

Read more: [`get()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/get)

## sideEffect

`sideEffect()` runs imperative work (like mutations). Keep it to mutation root
fields and let the callback perform the state change.

PostGraphile users may want to use it to mutate the context, e.g. updating
`pgSettings` once the user has logged in.

**IMPORTANT**: sideEffect calls are NOT batched, if used outside mutation root
fields they may result in N+1 executions.

```ts
import { context, sideEffect } from "postgraphile/grafast";

const $context = context();

sideEffect($context, async (context) => {
  await context.logout();
  context.pgSettings["jwt.claims.userId"] = null;
});
```

Read more: [`sideEffect()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/sideEffect)

## constant

`constant()` lifts a literal value into the plan. Use it when you need a fixed
step value, typically as an argument to another step.

```ts
import { constant } from "postgraphile/grafast";

const $true = constant(true);
```

Read more: [`constant()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/constant)

## each

`each()` maps over a list step, returning a new step for the transformed list.

```ts
import { each, object } from "postgraphile/grafast";

const $points = each($rows, ($row) => {
  const $lng = $row.get("x");
  const $lat = $row.get("y");

  return object({ lng: $lng, lat: $lat });
});
```

It's normally used as the return value for a field plan resolver to transform
the result:

```ts
return $points;
```

However, if you feed `$points` into another step you will need to call
`applyTransforms($points)` first so the mapping occurs before the dependent
step runs:

```ts
sideEffect(applyTransforms($points), (points) => {
  console.dir(points);
});
```

Read more: [`each()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/each)

## lambda

`lambda()` lets you derive data with a pure callback. Avoid side effects here;
if you need them reach for `sideEffect()` instead.

This should be used for simple synchronous transforms; using it for asynchronous
work will result in the N+1 problem since lambda is explicitly unbatched.

```ts
import { lambda } from "postgraphile/grafast";

const $first = $user.get("first_name");
const $last = $user.get("last_name");

const $fullName = lambda(
  [$first, $last],
  ([first, last]) => `${first} ${last}`,
);
```

Read more: [`lambda()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/lambda)

## object

`object()` assembles an object by wiring keys to other steps. It's commonly used
as the result of a mutation plan resolver.

```ts
import { constant, object } from "postgraphile/grafast";

const $userIdForLoader = $user.get("id");
const $includeArchived = constant(false);

const $loaderInput = object({
  id: $userIdForLoader,
  includeArchived: $includeArchived,
});
```

Read more: [`object()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/object)

## connection

`connection()` wraps a set of rows (typically a `PgSelectStep`) so connection
fields keep the helper methods PostGraphile expects. Use it when returning
Relay connections from custom fields.

```ts
import { connection } from "postgraphile/grafast";

const $productId = $product.get("id");
const $rows = reviews.find({ product_id: $productId });
return connection($rows);
```

Read more: [`connection()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/connection)

## list

`list()` bundles multiple steps together into a list step, typically useful so a
downstream step can see them all via a single dependency.

:::tip[Rarely needed]

Many of the builtin steps support accepting an array of dependencies (`[$dep1,
$dep2, ...]`) directly instead of calling `list([$dep1, $dep2, ...])`
explicitly.

:::

```ts
import { context, list } from "postgraphile/grafast";

const $context = context();
const $jwtClaims = $context.get("jwtClaims");
const $inputs = list([$jwtClaims, $itemId]);
```

Read more: [`list()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/list)

## access

`access($step, key)` reads a property, `key`, from the result of any step,
`$step`. Prefer `get($step, key)` unless you are implementing a custom
`$step.get(key)` method; using `get()` there would recurse forever.

```ts
import { access } from "postgraphile/grafast";

const $userId = access($user, "id");
```

Read more: [`access()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/access)

## specFromNodeId

`specFromNodeId()` decodes a Node ID using a handler from
`build.getNodeIdHandler("TypeName")`. It returns the step specifications you
can feed into resources or other loaders.

```ts
import { specFromNodeId } from "postgraphile/grafast";

const spec = specFromNodeId(itemHandler, $nodeId);
const $itemId = spec.id;
const $item = items.get({ id: $itemId });
```

Read more: [`specFromNodeId()` at grafast.org](https://grafast.org/grafast/step-library/standard-steps/node#specfromnodeid)

## loadOneWithPgClient

`loadOneWithPgClient()` gives you DataLoader-style batching while letting the
callback run custom SQL with the provided `pgClient`. Use it for single-row
lookups that need bespoke queries.

```ts
import { loadOneWithPgClient } from "postgraphile/@dataplan/pg";
import { get } from "postgraphile/grafast";

const $userId = get($input, "userId");
const $user = loadOneWithPgClient(
  executor, // obtained from build.pgResources.users
  $userId,
  async (pgClient, userIds) => {
    return selectUsersById(pgClient, userIds);
  },
);
```

Read more: [`loadOneWithPgClient()` at grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/withPgClient)

## loadManyWithPgClient

`loadManyWithPgClient()` mirrors `loadMany()` but still hands you the
`pgClient`, so you can fan out SQL work using the same settings the
rest of the request uses.

```ts
import { loadManyWithPgClient } from "postgraphile/@dataplan/pg";
import { get } from "postgraphile/grafast";

const $userId = get($user, "id");
const $phones = loadManyWithPgClient(
  executor, // obtained from build.pgResources.users
  $userId,
  async (pgClient, userIds) => {
    // return an array aligned with userIds
    return normalizePhones(pgClient, userIds);
  },
);
```

Read more: [`loadManyWithPgClient()` at grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/withPgClient)

## sideEffectWithPgClient

## sideEffectWithPgClientTransaction

`sideEffectWithPgClient()` and `sideEffectWithPgClientTransaction()` pass a
pgClient to your callback and expect it to perform a side effect - they both run
_unbatched_, so do not use them anywhere but in the root mutation fields.
`sideEffectWithPgClientTransaction()` guarantess that the callback is wrapped in
a transaction. `sideEffectWithPgClient()` may or may not wrap the callback in a
transaction, depending on if it's necessary to create one in order to apply the
`pgSettings`.

```ts
import { object } from "postgraphile/grafast";
import { sideEffectWithPgClientTransaction } from "postgraphile/@dataplan/pg";

const $input = fieldArgs.getRaw("input");
const $user = sideEffectWithPgClientTransaction(
  executor, // obtained from build.pgResources.users
  $input,
  async (pgClient, input) => {
    return insertUser(pgClient, input);
  },
);

return object({ user: $user });
```

Read more: [`sideEffectWithPgClientTransaction()` at grafast.org](https://grafast.org/grafast/step-library/dataplan-pg/withPgClient)
