---
title: Grafast for PostGraphile users
---

PostGraphile v5 plans and executes fields through Grafast. When you see helpers
such as `loadOne` in examples, they are Grafast "steps" that compose the
execution plan. These steps are the bridge that lets you pull in external
systems, adjust database behaviour, and tailor plans without sacrificing
performance. Below are the steps PostGraphile users encounter most when
extending their schema.

:::note
The authoritative reference for every step lives on grafast.org; follow the
links below for the full API.
:::

## context

`context()` exposes the GraphQL context as a step so you can read or modify
per-request values that were attached during server initialisation. Common
PostGraphile tweaks include inspecting `pgSettings` or stashing helper
functions you registered in the context.

```ts
import { context } from "postgraphile/grafast";

const $ctx = context();
const $currentUserId = $ctx.get("currentUserId");
```

You can also derive a new value and persist it back to context:

```ts
import { context, sideEffect } from "postgraphile/grafast";

const $ctxForJwt = context();

sideEffect([$ctxForJwt, $userId], (ctx, userId) => {
  ctx.pgSettings["jwt.claims.userId"] = userId;
});
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/context>

## loadOne

`loadOne()` batches access to a single record per call, similar to DataLoader's
`load`, and lets Grafast reason about requested attributes and parameters. Use
it when fetching from _external_ services (Stripe, REST APIs, internal
microservices, etc.). For PostgreSQL, lean on `@dataplan/pg` steps and
`pgResources` instead.

```ts
import { context, loadOne } from "postgraphile/grafast";

const $ctxForCustomer = context();
const $userIdForCustomer = $ctxForCustomer.get("currentUserId");
const $customer = loadOne($userIdForCustomer, stripeCustomersByUserId);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/loadOne>

## loadMany

`loadMany()` batches list lookups. Grafast tracks which columns downstream
steps actually read so your loader can pick only the requested data. Again, it
shines when enriching your schema with data that lives outside PostgreSQL.

```ts
import { loadMany } from "postgraphile/grafast";

const $stripeId = $customer.get("stripeId");
const $invoices = loadMany($stripeId, invoicesByStripeId);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/loadMany>

## get

`get()` grabs a property from another step. Prefer it for data coming from
Grafast-managed steps, and only access trusted keys.

```ts
import { get } from "postgraphile/grafast";

const $userId = get($user, "id");
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/get>

## sideEffect

`sideEffect()` runs imperative work (like mutations). Keep it to mutation root
fields and let the callback perform the state change. It is also handy for
mutating the context (e.g. `pgSettings`) after you computed a value.

```ts
import { context, sideEffect } from "postgraphile/grafast";

const $ctxForLogout = context();
const $logout = $ctxForLogout.get("logout");

sideEffect($logout, (logout) => logout());
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/sideEffect>

## constant

`constant()` lifts a literal value into the plan. Use it when you need a fixed
step value, or to set defaults before combining data from other systems.

```ts
import { constant } from "postgraphile/grafast";

const $alwaysTrue = constant(true);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/constant>

## each

`each()` maps over a list step, returning a new step for the transformed list.
Remember to call `applyTransforms()` if you feed the result into another step.

```ts
import { each, object } from "postgraphile/grafast";

const $points = each($rows, ($row) => {
  const $lng = $row.get("x");
  const $lat = $row.get("y");

  return object({ lng: $lng, lat: $lat });
});
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/each>

## lambda

`lambda()` lets you derive data with a pure callback. Avoid side effects here;
if you need them reach for `sideEffect()` instead.

```ts
import { lambda } from "postgraphile/grafast";

const $first = $user.get("first");
const $last = $user.get("last");

const $nameParts = [$first, $last];
const $fullName = lambda($nameParts, ([first, last]) => `${first} ${last}`);
```

Read more: <https://grafast.org/grafast/step-library/standard-steps/lambda>

## object

`object()` assembles an object by wiring keys to other steps.

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

Together these steps let you blend PostgreSQL data, external APIs, and custom
business logic into a single plan. Grafast keeps the execution efficient while
PostGraphile gives you the extension points to shape the graph you need.
