---
sidebar_position: 6
---

# Planning complex inputs

:::info[Optional helpers]

It's totally fine to just take the raw input values and handle them in a plan
resolver however you like. The features on this page are optional: they're
provided for more advanced use cases where they can help keep your plans clean,
composable, and easier to reason about.

:::

Before diving in, it’s useful to distinguish between two patterns for handling
complex input data:

- **Baking** — transforming input *data* into a backend representation.
- **Applying** — transforming *behavior* by having input data modify the
  actions a step will take.

Both patterns work by recursing over the tree of input values (objects, lists,
scalars) at runtime and invoking per-field or per-type logic as needed.

---

## Baking (data transformations)

Baking is about **data in, data out**. You start with a GraphQL input object and
transform it into the representation your backend needs. For example:

```graphql
input AvatarInput {
  url: String!
}

input UserInput {
  userId: Int!
  avatar: AvatarInput
}
```

At runtime, you might receive:

```json
{ "userId": 27, "avatar": { "url": "http://..." } }
```

and bake it into:

```json
{ "user_id": 27, "avatar_url": "http://..." }
```

### Schema

Baking is defined per input object type with the
`extensions.grafast.baked` method:

```ts
type InputObjectTypeBakedResolver = (
  input: Record<string, any>,
  info: {
    schema: GraphQLSchema;
    type: GraphQLInputObjectType;
    applyChildren(parent: any): void;
  },
) => any;
```

- `input` is the raw GraphQL input object.
- Return value becomes the "baked" representation.
- Call `info.applyChildren(parent)` if you want to recurse with a different
  parent object.
- If you don’t implement `baked`, the raw input passes through unchanged.

### In a plan resolver

You can wrap a raw input step in `bakedInput()` to invoke the baking logic:

```ts
const path = ["user"];
const $raw = fieldArgs.getRaw(path);
const inputType = fieldArgs.typeAt(path);
const $baked = bakedInput(inputType, $raw);
```

At execution time, `$baked` will resolve to the transformed value.

---

## Applying (behavior transformations)

Applying is about using input values to **change what a step does**. Typical
examples include pagination, filtering, or custom ordering.

Rather than producing a baked value, inputs are *applied* to a step that knows
how to accept them — e.g. a step wrapping a query builder, REST call, or any
other data source.

### Schema

Applying is defined per input *field* with
`extensions.grafast.apply`:

```ts
type InputObjectFieldApplyResolver<
  TParent = any,
  TData = any,
  TScope = any,
> = (
  target: TParent,
  input: TData,
  info: {
    schema: GraphQLSchema;
    fieldName: string;
    field: GraphQLInputField;
    scope: TScope;
  },
) => any;
```

- `target` is the parent object (e.g. a query builder) passed in.
- `input` is the value for this field.
- You may **mutate** `target`, or **return** a new parent object for children to
  recurse into.
- For list types, you may return a **factory function** `() => childParent`,
  which will be called for each list element. This enables patterns like `OR`
  filters where each entry gets its own sub-condition.

Example (simplified from `postgraphile-plugin-connection-filter`):

```ts
apply(parent: PgCondition, value: ReadonlyArray<LogicalOperatorInput> | null) {
  if (value == null) return;
  const orCondition = parent.orPlan();
  // Each entry is added to `$or`, but entries themselves should AND together.
  return () => orCondition.andPlan();
}
```

### In a plan resolver

`FieldArgs.apply()` is how you apply input arguments to a step:

```ts
function usersPlan($query, fieldArgs) {
  const $users = UsersStep.find();

  // Apply all arguments to the users step
  fieldArgs.apply($users);

  return $users;
}
```

You can also target a specific argument path, and optionally provide a callback
to transform the step’s value before applying:

```ts
fieldArgs.apply($target, ["pagination"], (qb, inputValue) => {
  // Convert the step’s value (e.g. query builder) into a condition object
  return new PgCondition(qb, inputValue);
});
```

### Under the hood

`fieldArgs.apply()` uses the [`applyInput()`](../standard-steps/applyInput.md)
step internally. You don’t normally call this directly, but you may see
`ApplyInput` nodes in plan diagrams.  

`applyScope` methods (experimental) can provide additional scope values to be
passed through during applying — these live on input objects or enums at
`extensions.grafast.applyScope`.

---

## Choosing between baking and applying

- If you just need to **transform data** into the shape your backend expects,
  use **baking**.
- If you need to **influence behavior** — e.g. tell a step how to filter, sort,
  or paginate — use **applying**.

You can freely mix the two patterns in the same schema depending on what makes
sense for each input.
