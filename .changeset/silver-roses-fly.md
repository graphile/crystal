---
"grafast": patch
---

When you `this.addUnaryDependency(...)` you may now specify a `nonUnaryMessage`
to be used if the dependency turns out to not be unary; helping to customise the
errors to be more useful to the consumer.
