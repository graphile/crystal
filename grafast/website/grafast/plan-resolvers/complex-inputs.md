---
sidebar_position: 6
---

# Handling complex inputs

:::info[Optional helpers for advanced tasks]

It’s normal and recommended to take the raw input values (arguments) and pass
them from plan resolvers directly into steps to be processed at execution time;
and if you're doing this and it's not causing you any issues then you can likely
skip this page.

However, sometimes your input data is complex, and repeating your handling code
can get untidy. If you're finding this, this page is for you: optional features
for more advanced use cases, helping keep your code clean, composable, and
easier to reason about.

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
`extensions.grafast.baked(input, info)` method, which is an
`InputObjectTypeBakedResolver`:

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
- Call `info.applyChildren(parent)` if you want to recurse with a different
  parent object; this uses the “applying” runtime behaviors seen below

Return value becomes the “baked” representation.
If you don’t implement `baked`, the raw input passes through unchanged.

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
`inputField.extensions.grafast.apply(target, input, info)` method, which is an `InputObjectFieldApplyResolver`:

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

The apply method is expected to mutate `target`, either directly, or by
returning a Modifier (see [fan-out and fan-in](#fan-out-and-fan-in) below).

The apply method may return `undefined`, a new parent object to use with
children when recursing, or (for list types) a factory function which is called
for each list item to produce a parent object for that item to use. Returning a
factory function (e.g. `() => new Thing()`) enables patterns like `OR` filters
where each entry in a list gets its own sub-condition.

#### Example

Simplified from `postgraphile-plugin-connection-filter`:

```ts
fields["or"] = {
  apply(
    parent: PgCondition,
    value: ReadonlyArray<LogicalOperatorInput> | null,
  ) {
    if (value == null) return;
    const orCondition = parent.orPlan();
    // Each list entry is added to `orCondition` only once the entry itself is
    // fully processed - if an individual entry produces many clauses, they must be
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

### Plan resolver

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
  return new FilterBuilder(requestBuilder, inputValue); // < a Modifier
});
```

### Applyable steps

```ts
// Simplified types
type ApplyableStep = Step & {
  apply($cb: Step<(arg: any) => void>): void;
};
```

For applying to work, the `$target` you pass to `fieldArgs.apply($target)` must
be an **applyable step** — i.e. a step that supports input-driven modifications
at runtime.

An applyable step has two responsibilities to ensure all inputs get a chance to
mutate the builder before the step executes its action:

#### Collecting callback steps at planning time

The step must implement an `apply($cb: Step<(parent: any) => void>)` method.
This should register `$cb` as a unary dependency. Since multiple arguments
may apply to the same step, you should expect multiple calls to `.apply()`
and thus store all dependency IDs in an array:

```ts
class MyRequestStep extends Step {
  applyDepIds: number[] = [];

  apply($cb: Step<(parent: any) => void>) {
    this.applyDepIds.push(this.addUnaryDependency($cb));
  }

  // ...
}
```

#### Executing the collected callbacks at runtime

In `execute()`, the step should prepare its internal object (e.g. a request
builder). This object **must not** be a `Modifier`; it should be the mutable
thing you want modified. Then iterate through the collected callbacks and
invoke them in order, passing in this object. Finally, carry out the request
using the fully-populated builder:

```ts
class MyRequestStep extends Step {
  // ...

  async execute(details) {
    const { values, indexMap } = details;
    const builder = {
      //...
      // Populate your request builder with the things you already know
    };

    // Apply the changes from all the `.apply($cb)` calls
    for (const applyDepId of this.applyDepIds) {
      const applyCallback = values[applyDepId].unaryValue();
      applyCallback(builder);
    }

    // Execute the underlying request, and tie the results back
    const results = await builder.execute();
    return indexMap((batchIndex) => results.getResultForIndex(batchIndex));
  }
}
```

Here's an example demonstrating how to use `.apply()` to dynamically change the
order of results from a database based on user input:

```ts
import { Step, ExecutionDetails, GrafastResultsList, Maybe } from "grafast";

interface MyQueryBuilder {
  orderBy(columnName: string, ascending?: boolean): void;
}

type Callback = (builder: MyQueryBuilder) => void;

class MyQueryStep extends Step {
  private applyDepIds: number[] = [];

  // [...]
  //   this.foreignKeyDepId = this.addDependency($fkey);
  // [...]

  // Handling `Step<Callback>` is enough for some use cases, but
  // handling this combination is the most flexible.
  apply($cb: Step<Maybe<Callback | ReadonlyArray<Callback>>>) {
    this.applyDepIds.push(this.addUnaryDependency($cb));
  }

  async execute(
    executionDetails: ExecutionDetails,
  ): Promise<GrafastResultsList<Record<string, any>>> {
    const { values, indexMap } = executionDetails;
    const foreignKeyEV = values[this.foreignKeyDepId];

    // Create a query builder to collect together the orderBy values
    const orderBys: string[] = [];
    const builder: MyQueryBuilder = {
      orderBy(columnName, asc = true) {
        orderBys.push(`${columnName} ${asc ? "ASC" : "DESC"}`);
      },
    };

    // For each of the `apply()` callbacks, run it against the query builder
    for (const applyDepId of this.applyDepIds) {
      const callback = values[applyDepId].unaryValue();
      if (Array.isArray(callback)) {
        callback.forEach((cb) => cb(builder));
      } else if (callback != null) {
        callback(builder);
      }
    }

    // Now we can use `orderBys` to build a query:
    const query = `
      select *
      from my_table
      where foreign_key = any($1)
      order by ${orderBys}
    `;

    // Then we can fetch the data:
    const allForeignKeys = indexMap((i) => foreignKeyEV.at(i));
    const rows = await runQuery(query, [allForeignKeys]);

    // And return the right data to go with each input value:
    return indexMap((i) => {
      const foreignKey = foreignKeyEV.at(i);
      return rows.filter((r) => r.foreign_key === foreignKey);
    });
  }
}
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

## Complete example

The following example is runnable and demonstrates:

- Baking with `fieldArgs.getBaked("patch")` plus `inputObject.baked`.
- Applying with `fieldArgs.apply($request, "filter")`.
- Fan-out/fan-in via `Modifier` for an `or: [UserFilterInput!]` list.

import complexInputsSource from "!!raw-loader!@site/../grafast/examples/complexInputs.mts";
import CodeBlock from "@theme/CodeBlock";

<CodeBlock language="ts">
{complexInputsSource.trim()}
</CodeBlock>
