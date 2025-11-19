# condition

Applies the given (unary or binary) condition to the step(s) and returns a step
representing the boolean result.

Usage:

```ts
// value === null?
function condition(operation: "null", $value: Step): Step<boolean>;

// value !== null?
function condition(operation: "not null", $value: Step): Step<boolean>;

// value != null
function condition(operation: "exists", $value: Step): Step<boolean>;

// value == null
function condition(operation: "not exists", $value: Step): Step<boolean>;

// a === b
function condition(operation: "===", $a: Step, $b: Step): Step<boolean>;

// a !== b
function condition(operation: "!==", $a: Step, $b: Step): Step<boolean>;
```
