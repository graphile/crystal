import UrlParam from "@site/src/components/UrlParam";

# Argument applyPlan

You've received this error because the `applyPlan` method on one of your
arguments (<UrlParam param="coord" fallback="see the error message to identify
which one" />) has returned a value. Doing so was meaningful during part of
Grafast's beta phase, but it was determined that this led to bad patterns and
thus it was removed.

It's likely that you just returned a value by accident and did not mean for it
to be meaningful. If so, simply remove the `return`.

However, if you are migrating from an early version of Grafast and this is
meaningful then instead of returning something from your existing code:

```ts
// Code that produces the error:
function applyPlan($parent, $field, fieldArg, info) {
  // [...]
  return $target;
}
```

you likely want to directly apply the fieldArg to it:

```ts
function applyPlan($parent, $field, fieldArg, info) {
  // [...]
  fieldArg.apply($target);
}
```

See [handling complex inputs](/grafast/plan-resolvers/complex-inputs) for
details of how this works. Note that applying inputs like this happens at
runtime (rather than plantime) since the inputs could be variables and we don't
want to fork the plans based on runtime values; thus the mechanics have changed
a bit.
