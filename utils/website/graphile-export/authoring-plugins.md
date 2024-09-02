---
sidebar_position: 3
title: Authoring plugins
---

As explained in [how it works](./how-it-works.md), plugins must be made compatible to work with graphile export. *This applies to external (npm) plugins and internal (your own) plugins*.

Generally speaking there are 2 methods of acheiving this, used in unison:

1. All functions and all their dependency functions need to be wrapped in EXPORTABLE
2. Dependencies are injected via context at runtime

<!-- todo: i'm not sure how to explain when to use which approach -->

## Using EXPORTABLE

<!-- todo -->

<!-- todo: mention eslint plugin -->

## Using context

<!-- todo -->

# Troubleshooting

## undefined variable `EXPORTABLE`

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
