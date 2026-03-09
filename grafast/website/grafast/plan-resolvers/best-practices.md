---
sidebar_position: 5.5
title: "Best practices"
---

# Best practices for plan resolvers

Plan resolvers are **declarative**: they build a graph of steps at plan-time,
and Gra*fast* executes that graph later in batches. Keeping this mental model in
mind leads to cleaner, faster plans. This page collects the most important
recommendations.

## Extract arguments deeply

When accessing nested argument values, prefer extracting the leaf value directly
rather than extracting an intermediate object and then pulling values from it.
This gives Gra*fast* more information about what you actually need, which
enables better optimization.

```graphql
input UserFilter {
  author: String
  publishedAfter: Int
}

type Query {
  bookCount(search: String, filter: UserFilter): Int!
}
```

### Don't: shallow extraction then transform

```ts
function bookCount_plan($parent, fieldArgs) {
  const $filter = fieldArgs.getRaw("filter");
  // ✘ Creates an unnecessary intermediate lambda step
  const $author = lambda($filter, (f) => f?.author);
  // ...
}
```

### Do: deep extraction directly

```ts
function bookCount_plan($parent, fieldArgs) {
  // ✔ One step, directly optimizable
  const $author = fieldArgs.getRaw(["filter", "author"]);
  const $publishedAfter = fieldArgs.getRaw(["filter", "publishedAfter"]);
  // ...
}
```

You can also use the `$`-prefixed shortcut for the same result:

```ts
function bookCount_plan($parent, fieldArgs) {
  const { $search, $filter } = fieldArgs;
  const { $author, $publishedAfter } = $filter;
  // ...
}
```

Both `.getRaw()` with a path array and the `$`-prefixed destructuring give
Gra*fast* direct visibility into exactly which leaf values you need, allowing it
to skip unnecessary work and optimize the plan more aggressively.

## Prefer custom steps over `lambda`

[`lambda()`](../standard-steps/lambda.md) is an escape hatch &mdash; it
processes values **one at a time** rather than in batches. This is fine for
trivial synchronous transforms (string concatenation, simple math), but for
anything more complex you should create a custom step class.

### Why custom steps are better

| | `lambda` | Custom step |
|---|---|---|
| Batching | No &mdash; called once per value | Yes &mdash; `execute()` receives the full batch |
| Deduplication | Only if callback is the same reference | Full control via `deduplicate()` |
| Optimization | None | Can implement `optimize()` |
| Side effects | Not supported (use `sideEffect()`) | Full control via `hasSideEffects` |

### When `lambda` is appropriate

- Concatenating strings: `lambda([$first, $last], ([f, l]) => \`${f} ${l}\`, true)`
- Simple math: `lambda($n, (n) => n + 1, true)`
- Trivial data mapping that doesn't benefit from batching

### When to create a custom step

- The transform involves I/O or async work &mdash; use
  [`loadOne()`](../standard-steps/loadOne.md) /
  [`loadMany()`](../standard-steps/loadMany.md) instead
- You want deduplication (e.g. multiple fields perform the same transform)
- The logic is non-trivial or would benefit from batching

### Example: custom step

```ts
import { UnbatchedStep } from "grafast";

export class FullNameStep extends UnbatchedStep<string> {
  static $$export = {
    moduleName: "my-app",
    exportName: "FullNameStep",
  };
  isSyncAndSafe = true;

  constructor($firstName: ExecutableStep<string>, $lastName: ExecutableStep<string>) {
    super();
    this.addDependency($firstName);
    this.addDependency($lastName);
  }

  // Steps with identical dependencies are candidates for deduplication
  deduplicate(peers: FullNameStep[]): FullNameStep[] {
    return peers;
  }

  unbatchedExecute(_extra: UnbatchedExecutionExtra, firstName: string, lastName: string) {
    return `${firstName} ${lastName}`;
  }
}

export function fullName($first: ExecutableStep<string>, $last: ExecutableStep<string>) {
  return new FullNameStep($first, $last);
}
```

## Define lambda callbacks at file scope

If you do use `lambda`, **always define the callback at file/module scope**
(or import it from another file) rather than inline. Gra*fast* deduplicates
lambda steps by comparing the callback reference &mdash; inline arrow functions
create a new reference on every call, defeating deduplication.

### Don't: inline callback

```ts
const objects = {
  User: {
    plans: {
      fullName($user) {
        const $firstName = $user.get("firstName");
        const $lastName = $user.get("lastName");
        // ✘ New function reference every time — cannot be deduplicated
        return lambda([$firstName, $lastName], ([f, l]) => `${f} ${l}`, true);
      },
    },
  },
};
```

### Do: file-scoped callback

```ts
// ✔ Defined once at module scope — same reference every time
function fullname([firstName, lastName]: [string, string]): string {
  return `${firstName} ${lastName}`;
}

const objects = {
  User: {
    plans: {
      fullName($user) {
        const $firstName = $user.get("firstName");
        const $lastName = $user.get("lastName");
        return lambda([$firstName, $lastName], fullname, true);
      },
    },
  },
};
```

## Don't use `try`/`catch` in plan resolvers

Plan resolvers run at **plan-time**, not execution-time. They build a
declarative graph of steps &mdash; think of them like React component render
functions where steps are like hooks. Using `try`/`catch` introduces imperative
control flow that doesn't fit this model.

### Why it doesn't work

- Plan resolvers don't execute your data-fetching logic &mdash; they only
  **describe** it. A `try` block around step creation doesn't catch runtime
  data errors because those errors happen later, during execution.
- Wrapping step creation in `try`/`catch` can mask plan-time programming
  errors that should be fixed, not caught.
- It suggests a misunderstanding of the plan/execute separation.

### Don't: try/catch around steps

```ts
// ✘ This try/catch is meaningless — runtime errors happen during execution,
// not during planning
function post_author_plan($post) {
  try {
    const $authorId = $post.get("authorId");
    return loadOne($authorId, batchGetAuthorById);
  } catch (e) {
    return constant(null);
  }
}
```

### Do: use flow control steps

Gra*fast* provides declarative flow control for handling errors and null values
at execution-time:

```ts
import { loadOne, trap, inhibitOnNull, TRAP_ERROR } from "grafast";

function post_author_plan($post) {
  const $authorId = $post.get("authorId");

  // Guard against null authorId — skip the load entirely
  const $guardedId = inhibitOnNull($authorId);

  // Load the author; if it errors, convert to null
  const $author = loadOne($guardedId, batchGetAuthorById);
  return trap($author, TRAP_ERROR);
}
```

The key flow control steps are:

- [`inhibitOnNull()`](../standard-steps/inhibitOnNull.mdx) &mdash; suppresses
  downstream work when a value is `null`
- [`assertNotNull()`](../standard-steps/assertNotNull.mdx) &mdash; turns
  `null` into a `SafeError` visible to clients
- [`trap()`](../standard-steps/trap.mdx) &mdash; recovers inhibited or errored
  values back into ordinary data (e.g. `null` or an empty list)

See [Thinking in plans: Flow control](../flow.mdx#flow-control) for more
details on when and how to use these.

## Summary

| Recommendation | Why |
|---|---|
| [Extract arguments deeply](#extract-arguments-deeply) | Fewer intermediate steps, better optimization |
| [Prefer custom steps over `lambda`](#prefer-custom-steps-over-lambda) | Batching, deduplication, optimization |
| [File-scoped lambda callbacks](#define-lambda-callbacks-at-file-scope) | Enables deduplication |
| [No `try`/`catch`](#dont-use-trycatch-in-plan-resolvers) | Plan resolvers are declarative; use flow control steps |
