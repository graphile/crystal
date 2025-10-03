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

:::note

The authoritative reference for every step lives on
[grafast.org](https://grafast.org); follow the links below for the full
API.

:::

Below are the steps PostGraphile
users encounter most when extending their schema.

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/context>

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/loadOne>

## loadMany

`loadMany()` is identical to `loadOne()` except it expects the result to be a
list - for example "load _invoices_ by customer ID".

```ts
import { loadMany } from "postgraphile/grafast";

const $stripeId = $customer.get("stripeId");
const $invoices = loadMany($stripeId, batchGetInvoicesByStripeCustomerId);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/loadMany>

## get

`get($step, key)` retrieves a property `key` from step `$step`, either using
`$step.get(key)` if it is supported, otherwise falling back to `access($step,
key)`. Use it when you're not sure whether or not `$step` will always support
`.get()`.

```ts
import { get } from "postgraphile/grafast";

const $userId = get($user, "id");
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/get>

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/sideEffect>

## constant

`constant()` lifts a literal value into the plan. Use it when you need a fixed
step value, typically as an argument to another step.

```ts
import { constant } from "postgraphile/grafast";

const $true = constant(true);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/constant>

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/each>

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/lambda>

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

Read more: <https://grafast.org/grafast/step-library/standard-steps/object>

## connection

`connection()` wraps a set of rows (typically a `PgSelectStep`) so connection
fields keep the helper methods PostGraphile expects. Use it when returning
Relay connections from custom fields.

```ts
import { connection } from "postgraphile/grafast";

const $productId = $product.get("id");
const $rows = reviews.find({ product_id: $productId });
const $reviews = connection($rows);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/connection>

## list

`list()` bundles multiple dependency steps together so a downstream loader can
see them all at once. Pair it with `loadManyWithPgClient()` or
`sideEffectWithPgClientTransaction()` when your callback needs more than one
input.

```ts
import { context, list } from "postgraphile/grafast";

const $context = context();
const $jwtClaims = $context.get("jwtClaims");
const $inputs = list([$jwtClaims, $itemId]);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/list>

## access

`access()` reads a property on plain JavaScript objects. Reach for it when the
step you are working with does not provide `.get()` (for example, the temporary
objects returned by custom SQL loaders).

```ts
import { access } from "postgraphile/grafast";

const $userId = access($user, "id");
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/access>

## specFromNodeId

`specFromNodeId()` decodes a Node ID using a handler from
`build.getNodeIdHandler("TypeName")`. It returns the step specifications you
can feed into resources or other loaders.

```ts
import { specFromNodeId } from "postgraphile/grafast";

const spec = specFromNodeId(itemHandler, $nodeId);
const $itemId = spec.id;
```

Read more:
<https://grafast.org/grafast/step-library/standard-steps/node#specfromnodeid>

## loadManyWithPgClient

`loadManyWithPgClient()` (and its partner `loadOneWithPgClient()`) bridge the
Grafast planner with custom SQL. They live in
`postgraphile/@dataplan/pg` and give your callback a `pgClient` so you can run
bespoke queries while still batching inputs.

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

Read more: <https://grafast.org/grafast/step-library/dataplan-pg/withPgClient>

## withPgClient

`withPgClient()` is the transaction-friendly variant that simply hands you a
client and whatever inputs you passed. It is ideal for mutations that need to
mix SQL with additional business logic (such as sending emails) before you
shape the final payload.

```ts
import { list } from "postgraphile/grafast";
import { withPgClient } from "postgraphile/@dataplan/pg";

const $inputs = list([$username, $email]);
const $result = withPgClient(
  executor, // obtained from build.pgResources.users
  $inputs,
  async (pgClient, [username, email]) => {
    return registerUser(pgClient, username, email);
  },
);
```

Read more: <https://grafast.org/grafast/step-library/dataplan-pg/withPgClient>

## sideEffectWithPgClientTransaction

`sideEffectWithPgClientTransaction()` wraps your callback in a PostgreSQL
transaction. Use it for custom mutations that should commit only if the entire
callback succeeds.

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

Read more: <https://grafast.org/grafast/step-library/dataplan-pg/withPgClient>

Together these steps let you blend PostgreSQL data, external APIs, and custom
business logic into a single plan. Grafast keeps execution efficient while
PostGraphile gives you the extension points to shape the graph you need.
