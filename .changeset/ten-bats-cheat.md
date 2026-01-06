---
"graphile-utils": patch
"postgraphile": patch
---

Fix a bug where `apply()` couldn't be added to enum values via `extendSchema()`.
This is a breaking fix - if you add non-scalar enum values to your schema via
`extendSchema()` then you will now need to use an object wrapper to set them
instead (see example below). An error will be thrown if we suspect this of being
the case, to ensure we don't incorrectly build your schema.

```diff
 extendSchema({
   typeDefs: `enum SomeEnum { FOO, BAR }`,
   enums: {
     SomeEnum: {
       values: {
+        // Scalar values can be specified directly
         FOO: 7,

+        // Non-scalars look like enum specification (`value`, `apply()`,
+        // `extensions`, etc), so must be specified via a wrapper object:
-        BAR: { mol: 42 },
+        BAR: {
+          value: { mol: 42 },
+        },
       }
     }
   }
 })
```
