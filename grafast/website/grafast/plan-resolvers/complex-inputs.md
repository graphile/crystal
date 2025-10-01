---
sidebar_position: 6
---

# Handling complex inputs

:::info[Optional helpers]

It's totally fine to just take the raw input values and handle them in a plan
resolver however you like. The features on this page are optional: they're
provided for more advanced use cases where they can help keep your code clean,
composable, and easier to reason about.

:::

Before diving in, it’s useful to distinguish between two patterns for handling
complex input data:

- **Baking** — transforming input _data_ into another form (e.g. a backend representation).
- **Applying** — transforming _behavior_ by having input data modify the
  actions a step will take.

Both patterns work by recursing over the tree of input values (objects, lists,
scalars) at runtime and invoking per-field or per-type logic as needed.

## Baking (data transformations)

Baking is about **data in, data out**. You start with a GraphQL input object value and
transform it into the representation your backend needs. For example:

```graphql
input AvatarInput {
  url: String!
  # ...
}

input UserInput {
  userId: Int!
  avatar: AvatarInput
  # ...
}
```

At runtime, you might receive:

```json
{ "userId": 27, "avatar": { "url": "http://..." } }
```

and bake it into your backend representation:

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

- `input` is the raw GraphQL input object value.
- Return value becomes the "baked" representation.
- Call `info.applyChildren(parent)` if you want to recurse with a different
  parent object; this uses the "applying" runtime behaviors seen below
- If you don’t implement `baked`, the raw input passes through unchanged.

### Plan resolver

You can use the `fieldArgs.getBaked(path)` method to produce the baked version
of a raw input value:

```ts
const $baked = fieldArgs.getBaked(["path", "to", "input"]);
```

## Applying (behavior transformations)

Applying is about using input values to **change what a step does**. Typical
examples include pagination, filtering, or custom ordering.

Rather than producing a baked value, inputs are _applied_ to a step that knows
how to accept them — e.g. a step that uses a request builder to prepare
the request to send to a database, URL endpoint, or any other data source.

### Schema

Applying is defined per input _field_ with a
`inputField.extensions.grafast.apply(target, input, info)` method:

```ts
type InputObjectFieldApplyResolver<TParent = any, TData = any, TScope = any> = (
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

- `target` is the parent object (e.g. the request builder) passed in.
- `input` is the raw input value for this input field
- You may mutate `target`, or return a new parent object for children to
  recurse into.
- For list types, you may return a factory function (e.g. `() => new Thing()`)
  which will be called for each list element to provide its own parent object.
  This enables patterns like `OR` filters where each entry in a list gets its
  own sub-condition.

Example (simplified from `postgraphile-plugin-connection-filter`):

```ts
fields["or"] = {
  apply(
    parent: PgCondition,
    value: ReadonlyArray<LogicalOperatorInput> | null,
  ) {
    if (value == null) return;
    const orCondition = parent.orPlan();
    // Each list entry is added to `orCondition` only once the entry itself is
    // fully resolved - if an individual entry produces many clauses, they must be
    // joined with `AND` first before being incorporated into the `OR`.
    return () => orCondition.andPlan();
  },
  type: new GraphQLList(new GraphQLNonNull(UserFilter)),
};
```

### Fan-out and fan-in

When you **return** a new object for children to use, you’ve “fanned out”: each
child field can add its own modifications in isolation. But what if you need to
**fan back in** afterwards — e.g. gather all child conditions, combine them with
`OR`, and _then_ apply that combined condition to the parent?

That’s where **modifiers** come in.

If the object you return extends the `Modifier` class, Gra*fast* will track it
during the apply process. After the entire input tree has been traversed,
Gra*fast* goes back through the collected modifiers in reverse order and calls
their `apply()` methods. This gives you a final hook to push the combined
results back up into the parent.

```ts
/** Will be applied in reverse order once fan-out is complete */
const currentModifiers: Modifier<any>[] = [];

/**
 * Modifiers modify their parent (which may be another modifier or anything
 * else). First they gather all the requirements from their children (if any)
 * being applied to them, then they apply themselves to their parent. This
 * application is done through the `apply()` method.
 */
export abstract class Modifier<TParent> {
  constructor(protected readonly parent: TParent) {
    currentModifiers.push(this);
  }

  /**
   * In this method, you should apply the changes to your `this.parent` plan
   */
  abstract apply(): void;
}
```

Using a modifier makes the `OR` example cleaner: each child contributes its
conditions to the modifier; once all entries are done, the modifier’s `apply()`
method is called to add the combined `OR` clause to its parent.

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
fieldArgs.apply($target, ["filter"], (requestBuilder, inputValue) => {
  // Convert the step’s value (e.g. request builder) into a filter builder object
  return new FilterBuilder(requestBuilder, inputValue);
  // < FilterBuilder would
  be a Modifier
});
```

### Under the hood

`fieldArgs.apply()` uses the `applyInput()` step internally. You don’t normally
call this directly, but you may see `ApplyInput` nodes in plan diagrams.

`applyScope` methods (experimental) can provide additional scope values to be
passed through during applying — these live on input objects or enums at
`extensions.grafast.applyScope()`.

## Choosing between baking and applying

- If you just need to **transform data** into the shape your backend expects,
  use **baking**.
- If you need to **influence behavior** — e.g. tell a step how to filter, sort,
  or paginate — use **applying**.

You can freely mix the two patterns in the same schema depending on what makes
sense for each input.
