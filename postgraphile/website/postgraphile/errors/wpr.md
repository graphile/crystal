---
title: wrapPlans resolver emulation warning
---

You're probably here because you just saw a warning like:

```
[WARNING]: `wrapPlans(...)` wrapping default plan resolver for coordinate
User.email; if resolver emulation is in use then things may go awry. See
https://err.red/pwpr
```

## Plan resolvers vs traditional resolvers

Gra*fast*, the GraphQL engine powering PostGraphile, runs on the basis of [plan
resolvers](https://grafast.org/grafast/plan-resolvers/#default-plan-resolver).
Everything built in to PostGraphile uses these plan resolvers - by default,
PostGraphile produced a "pure" Gra*fast* schema.

However, Gra*fast* also supports emulating traditional resolvers (see [Using
with existing
schema](https://grafast.org/grafast/getting-started/existing-schema#replacing-resolvers-with-plans)
in the Gra*fast* docs) for compatibility with traditional GraphQL.js-style
schemas, and it's possible to add these traditional resolvers to a PostGraphile
schema via `extendSchema()` or other methods. Adding traditional resolvers to a
Gra*fast* schema makes the schema "impure" - it should still work fine, but
it's less performant and there are caveats to be aware of, such as this one.

## Pure Gra*fast* schemas

If you have a pure Gra*fast* schema - a schema that only uses plan resolvers (no
`resolve` or `subscribe` traditional resolvers) - then you can safely ignore
this warning, and can even prevent it being emitted using
`disableResolverEmulationWarnings: true`.

## Impure Gra*fast* schemas

When a traditional resolver is seen, Gra*fast* enters "resolver emulation" mode.
In this mode, among other changes it no longer uses the [default plan
resolver](https://grafast.org/grafast/plan-resolvers/#default-plan-resolver)
when a field has no plan.

However, `wrapPlans()` will always ensure the field has a plan, and if there is
no plan to wrap then it will default to wrapping the
[`defaultPlanResolver`](https://github.com/graphile/crystal/blob/2fa986c69d0275ac69636eec872a2ecf934cd0b1/grafast/grafast/src/engine/lib/defaultPlanResolver.ts).

Adding a plan to a field that was called in resolver emulation mode will change
the data to be fed into the resolver, thereby causing breakage.

Since plan wrapping occurs at schema build time, not at runtime, PostGraphile
cannot know whether or not resolver emulation will be enabled. Since the issues
this cause can be hard to track down otherwise, out of an abundance of caution we
raise this warning for users who are applying very broad plan wrapping logic to
help them know which specific fields might surface an issue.

## Resolution

To resolve this:

1. Add a (non-default) plan resolver for the field you are wrapping, or
2. Avoid wrapping the default plan resolver, or
3. Set `warnOnResolverEmulation: false` when calling `wrapPlans()` once you
   have confirmed it is safe for your schema.

### Avoid wrapping default plan resolvers

To avoid wrapping the default plan resolver, consider logic like this:

```ts
const MyPlugin = wrapPlans(
  (context, build, field) => {
    const {
      grafast: { defaultPlanResolver },
    } = build;
    const plan = field.extensions?.grafast?.plan ?? defaultPlanResolver;
    // Don't wrap the default plan resolver
    if (plan === defaultPlanResolver) return null;

    // ...
  },
  // ...
);
```

### Disable the warning

If you're sure this part of the schema won't be impacted by resolver emulation,
you can disable the warning:

```ts
const MyPlanWrapperPlugin = wrapPlans(rules, {
  name: "MyPlanWrapperPlugin",
  disableResolverEmulationWarnings: true,
});
// Or:
const MyOtherPlanWrapperPlugin = wrapPlans(filterFn, ruleFn, {
  name: "MyOtherPlanWrapperPlugin",
  disableResolverEmulationWarnings: true,
});
```
