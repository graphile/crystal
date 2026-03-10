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
Gra*fast* direct visibility into exactly which leaf values you need. While
current optimizations (such as the "eliminate eval" pass) reduce the impact of
shallow extraction, deep extraction remains a good habit — it makes your intent
explicit and may become more significant again in future optimizations.

## Prefer custom steps over `lambda`

[`lambda()`](../standard-steps/lambda.md) is an escape hatch &mdash; it
processes values **one at a time** rather than in batches. This is fine for
trivial synchronous transforms (string concatenation, simple math), but for
anything more complex you should use a batch step such as `loadOne()`,
`loadMany()`, or a custom class.

### Why custom steps are better

| | `lambda` | `loadOne` | Custom step |
|---|---|---|
| Batching | No &mdash; called once per value | Yes, batched and uniqued |  Yes with full control |
| Deduplication | Only if callback is the same reference | Only if callback is the same reference | Full control via `deduplicate()` |
| Optimization | None | Many automatic optimizations | Full control via `optimize()` / `finalize()` / `execute()` |

:::note[Batching may not be relevant to mutations/side effects]

According to
[the GraphQL spec](https://spec.graphql.org/September2025/#sel-GANVLDCB-BBqFxyV),
side effects may only occur in `Mutation` fields, and these fields are
executed serially. This gives no opportunity for batching. Typically
`sideEffect()` (like `lambda()`, but with side effects) is suitable for
a mutation field plan resolver, and no other steps should be needed.

Side-effects should not happen in other (non-Mutation) plan resolvers,
however any step can be marked as having side effects via:

```ts
$step.hasSideEffects = true;

### When `lambda` is appropriate

- Concatenating strings: `lambda([$first, $last], ([f, l]) => \`${f} ${l}\`, true)`
- Simple math: `lambda($n, (n) => n + 1, true)`
- Trivial data mapping that doesn't benefit from batching

### When to use loadOne/loadMany

Use [`loadOne()`](../standard-steps/loadOne.md) to loading a single record for each input, or [`loadMany()`](../standard-steps/loadMany.md) to load a collection of records for each input, when:

- you have async work (except mutations),
- you have I/O work (except mutations), or
- the code would benefit from batching.

### When to create a custom step

Custom steps can be used for any purpose, typically you'll want
to build your own step classes if:

- You want to expose your own helper APIs (e.g. custom methods on your step)
- You want full control over execution (e.g. if loadOne/loadMany's optimizations don't fit your needs)
- You want full control over deduplication (reducing redundant work)
- You want full control over plan optimization (in particular eliminating over- and under- fetching by communicating with other steps)
- You want to do custom work one time only for your step (custom `finalize()`)

### Example: custom step

This example wraps the
[Google Drive files.list](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list)
API into a custom step that batches multiple file-ID lookups into a single HTTP
request and uses the
[`fields` parameter](https://developers.google.com/workspace/drive/api/guides/fields-parameter)
to fetch only the data the GraphQL query actually needs.

```ts
import { ExecutableStep, ExecutionExtra, access } from "grafast";

/** Loads Google Drive file metadata, batching multiple IDs into one API call. */
export class GoogleDriveFileStep extends ExecutableStep<GoogleDriveFile> {
  static $$export = {
    moduleName: "my-app",
    exportName: "GoogleDriveFileStep",
  };

  // Track which fields the plan actually needs
  private fieldPaths: Set<string> = new Set(["id"]);

  constructor($fileId: ExecutableStep<string>) {
    super();
    this.addDependency($fileId);
  }

  /**
   * Helper: declare that downstream steps need a particular field.
   * Returns an access step that reads the field from the result.
   */
  getField(name: string): ExecutableStep {
    this.fieldPaths.add(name);
    return access(this, name);
  }

  /**
   * Helper: declare that downstream steps need a nested field.
   */
  getNestedField(parent: string, child: string): ExecutableStep {
    this.fieldPaths.add(`${parent}(${child})`);
    return access(this, [parent, child]);
  }

  // Deduplicate steps that request the same file ID
  deduplicate(peers: GoogleDriveFileStep[]): GoogleDriveFileStep[] {
    return peers;
  }

  // Merge requested fields from deduplicated peers
  deduplicatedWith(peers: GoogleDriveFileStep[]): void {
    for (const peer of peers) {
      for (const field of peer.fieldPaths) {
        this.fieldPaths.add(field);
      }
    }
  }

  // Execute once for the entire batch
  async execute(
    _extra: ExecutionExtra,
    [fileIds]: [string[]],
  ): Promise<(GoogleDriveFile | null)[]> {
    const uniqueIds = [...new Set(fileIds)];
    const fields = `files(${[...this.fieldPaths].join(",")})`;

    // One HTTP request for the whole batch
    const url = new URL("https://www.googleapis.com/drive/v3/files");
    url.searchParams.set("q", uniqueIds.map((id) => `'${id}'`).join(" or "));
    url.searchParams.set("fields", fields);

    const response = await fetch(url);
    const { files } = await response.json();

    // Build a lookup map and return results in the original order
    const byId = new Map(files.map((f: GoogleDriveFile) => [f.id, f]));
    return fileIds.map((id) => byId.get(id) ?? null);
  }
}

export function googleDriveFile($fileId: ExecutableStep<string>) {
  return new GoogleDriveFileStep($fileId);
}
```

Usage in a plan resolver:

```ts
function file_plan($parent) {
  const $fileId = $parent.get("driveFileId");
  const $file = googleDriveFile($fileId);

  // Only the fields actually requested by the GraphQL query are fetched
  const $name = $file.getField("name");
  const $ownerEmail = $file.getNestedField("owners", "emailAddress");
  // ...
}
```

## Define callbacks at file scope

Many step functions accept a callback. **Always define these callbacks at
file/module scope** (or import them from another file) rather than inline.
Gra*fast* deduplicates steps by comparing the callback reference &mdash; inline
arrow functions create a new reference on every call, defeating deduplication.
Named functions also produce more readable debug output and `explain` plans.

This applies to the following functions, in order of importance:

**Most important** &mdash; commonly used in nearly every schema:

- [`lambda()`](../standard-steps/lambda.md)
- [`loadOne()`](../standard-steps/loadOne.md)
- [`loadMany()`](../standard-steps/loadMany.md)
- [`applyInput()`](../standard-steps/applyInput.md)

**Also recommended** &mdash; less common, but the same principle applies:

- [`each()`](../standard-steps/each.md)
- [`filter()`](../standard-steps/filter.md)
- [`groupBy()`](../standard-steps/groupBy.md)
- [`partitionByIndex()`](../standard-steps/partitionByIndex.md)
- [`sideEffect()`](../standard-steps/sideEffect.md)

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

Plan resolvers run at **plan-time**, before any input values are known and
before any data has been fetched. They build a declarative graph of steps
that will be executed later. Since they run at plan-time, `try`/`catch`
will only catch planning errors (which shouldn't really happen!) - it will
not catch execution-time errors (i.e. errors resulting from
fetching/manipulating real data).

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

### Do: use `maskError` or similar to process errors

GraphQL is designed to continue in the face of errors, allowing for
"partial success"; however, you may wish to relabel an error when
presenting it to a user. To do so, use Grafserv's `maskError`
functionality, or similar methods that come with your server of choice.

### If necessary: use flow control steps

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
  return trap($author, TRAP_ERROR, { valueForError: "NULL" });
}
```

The key flow control steps are:

- [`inhibitOnNull()`](../standard-steps/inhibitOnNull.mdx) &mdash; suppresses
  downstream work when a value is `null`
- [`assertNotNull()`](../standard-steps/assertNotNull.mdx) &mdash; turns
  `null` into a `SafeError` visible to clients
- [`trap()`](../standard-steps/trap.mdx) &mdash; recovers inhibited or errored
  values back into ordinary data (e.g. `null`, an empty list, or the error as
  a simple "data value" rather than an exception)

See [Thinking in plans: Flow control](../flow.mdx#flow-control) for more
details on when and how to use these.

## Summary

| Recommendation | Why |
|---|---|
| [Extract arguments deeply](#extract-arguments-deeply) | Fewer intermediate steps, better optimization |
| [Avoid `lambda`, except for inexpensive synchronous work](#prefer-custom-steps-over-lambda) | Batching, deduplication, optimization |
| [File-scoped callbacks](#define-lambda-callbacks-at-file-scope) | Enables deduplication |
| [No plan resolver `try`/`catch`](#dont-use-trycatch-in-plan-resolvers) | Plan resolvers are declarative; use `maskError` or flow control steps |
