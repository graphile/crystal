# connection

Wraps a collection fetch to provide the utilities for working with GraphQL
cursor connections. It only requires one argument which is a step that
represents a collection of records; this step should support the connection
methods, specifically:

```ts
  /**
   * Clone the plan; it's recommended that you add `$connection` as a
   * dependency so that you can abort execution early in the case of errors
   * (e.g. if the cursors cannot be parsed).
   */
  connectionClone(
    $connection: ConnectionStep<TItemStep, TCursorStep, any, any>,
    ...args: any[]
  ): ConnectionCapableStep<TItemStep, TCursorStep>;

  pageInfo(
    $connection: ConnectionStep<
      TItemStep,
      TCursorStep,
      ConnectionCapableStep<TItemStep, TCursorStep>,
      any
    >,
  ): PageInfoCapableStep;

  setFirst($step: ExecutableStep | number): void;
  setLast($step: ExecutableStep | number): void;
  setOffset($step: ExecutableStep | number): void;

  parseCursor($step: ExecutableStep): TCursorStep | null | undefined;
  setBefore($step: TCursorStep): void;
  setAfter($step: TCursorStep): void;
```

TODO: the documentation for this is terrible. Sorry.

```ts
export function connection<
  TItemStep extends ExecutableStep,
  TCursorStep extends ExecutableStep,
  TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
  TNodeStep extends ExecutableStep = ExecutableStep,
>(
  $collection: TStep,
  itemPlan?: ($item: TItemStep) => TNodeStep,
  cursorPlan?: ($item: TItemStep) => ExecutableStep<string | null>,
): ConnectionStep<TItemStep, TCursorStep, TStep, TNodeStep>;
```
