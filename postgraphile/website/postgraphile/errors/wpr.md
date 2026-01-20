---
title: wrapPlans resolver emulation warning
---

You're probably here because you just saw a warning like:

```
[WARNING]: `wrapPlans(...)` wrapping default plan resolver for coordinate
User.email; if resolver emulation is in use then things may go awry. See
https://err.red/pwpr
```

If you only use Gra*fast* plan resolvers (and do not define traditional
`resolve` or `subscribe` methods), then this warning is irrelevant.

This warning appears when `wrapPlans()` wraps a field that does not have a plan
resolver, so it falls back to the default plan resolver. If resolver emulation
is active because parts of your schema use traditional resolvers, the parent
value for these fields is not a Gra*fast* step. In that case, wrappers that
expect a step-based parent can behave incorrectly.

To resolve this:

1. Add a plan resolver for the field you are wrapping, or
2. Avoid wrapping default plan resolvers in resolver-emulated parts of the
   schema, or
3. Set `warnOnResolverEmulation: false` when calling `wrapPlans()` once you
   have confirmed it is safe for your schema.
