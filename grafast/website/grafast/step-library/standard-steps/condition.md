# condition

Applies the given (unary or binary) condition to the step(s) and returns a step
representing the boolean result.

Usage:

```ts
// value === null?
function condition(
  operation: "null",
  $value: ExecutableStep,
): ExecutableStep<boolean>;

// value !== null?
function condition(
  operation: "not null",
  $value: ExecutableStep,
): ExecutableStep<boolean>;

// value != null
function condition(
  operation: "exists",
  $value: ExecutableStep,
): ExecutableStep<boolean>;

// value == null
function condition(
  operation: "not exists",
  $value: ExecutableStep,
): ExecutableStep<boolean>;

// a === b
function condition(
  operation: "===",
  $a: ExecutableStep,
  $b: ExecutableStep,
): ExecutableStep<boolean>;

// a !== b
function condition(
  operation: "!==",
  $a: ExecutableStep,
  $b: ExecutableStep,
): ExecutableStep<boolean>;
```
