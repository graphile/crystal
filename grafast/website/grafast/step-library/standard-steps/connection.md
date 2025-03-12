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

  setFirst($step: Step<Maybe<number>> | number): void;
  setLast($step: Step<Maybe<number>> | number): void;
  setOffset($step: Step<Maybe<number>> | number): void;

  parseCursor($step: Step<Maybe<string>>): TCursorStep;
  setBefore($step: TCursorStep): void;
  setAfter($step: TCursorStep): void;
```

TODO: the documentation for this is terrible. Sorry.

```ts
export function connection<
  TItemStep extends Step,
  TCursorStep extends Step,
  TStep extends ConnectionCapableStep<TItemStep, TCursorStep>,
  TNodeStep extends Step = Step,
>(
  $collection: TStep,
  itemPlan?: ($item: TItemStep) => TNodeStep,
  cursorPlan?: ($item: TItemStep) => Step<string | null>,
): ConnectionStep<TItemStep, TCursorStep, TStep, TNodeStep>;
```
