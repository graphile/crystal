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

const $context = context();
const $currentUserId = $context.get("currentUserId");
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

However, if it is fed into another step you will need to wrap it with
`applyTransforms()` to ensure the mapping takes place:

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
import { object } from "postgraphile/grafast";

const $userIdForLoader = $user.get("id");
const $includeArchived = constant(false);

const $loaderInput = object({
  id: $userIdForLoader,
  includeArchived: $includeArchived,
});
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/object>
