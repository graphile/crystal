---
sidebar_position: 3
title: EXPORTABLE
---

# Using EXPORTABLE

Our ESLint plugin isn't smart enough to actually `import` the `EXPORTABLE`
helper, so after running the autofix you might end up with "undefined variable
`EXPORTABLE`" errors. You can either
`import { EXPORTABLE } from "graphile-export"`, or you can copy this definition
into your code:

```ts
export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
  nameHint?: string,
): T {
  const fn: T = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}
```

(Or, if you're using plain JavaScript:

```js
export function EXPORTABLE(factory, args, nameHint) {
  const fn = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}
```

)
