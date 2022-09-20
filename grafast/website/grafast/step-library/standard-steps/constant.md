# constant

Converts a constant value (e.g. a string/number/etc) into a step; every value
returned by this step will be the given constant value.

Usage:

```ts
const $one = constant(1);
const $str = constant`My string here`;
```
