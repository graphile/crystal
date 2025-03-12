---
sidebar_position: 2
---

# Types

Below you'll find some small plugins that people have written. Larger plugins likely have their own dedicated repositories, these are typically just examples of how to achieve a small goal.

_This is a work in progress, in future these plugins will be automatically tested but we've not got quite that far yet, so my apologies if you come across any issues._

## PgNumericToFloatPlugin

```ts
/**
 * Use of this plugin is NOT recommended, please see
 * PgSmallNumericToFloatPlugin for a more appropriate replacement if you need
 * one.
 *
 * This plugin will have PostGraphile use `GraphQLFloat` instead of `BigFloat`
 * for *all* DECIMAL / NUMERIC values, for making PostGraphile v4 slightly more
 * backwards-compatible with v3.
 *
 * It's generally a bad idea to use floating point numbers to represent
 * arbitrary precision numbers such as NUMERIC because loss of precision can
 * occur.
 */
module.exports = function PgNumericToFloatPlugin(builder) {
  builder.hook("build", (build) => {
    // Register a type handler for NUMERIC / DECIMAL (oid = 1700), always
    // returning the GraphQLFloat type
    build.pgRegisterGqlTypeByTypeId("1700", () => build.graphql.GraphQLFloat);
    return build;
  });
};
```

Resulting GraphQL schema diff:

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -1,8 +1,3 @@
-"""
-A floating point number that requires more precision than IEEE 754 binary 64
-"""
-scalar BigFloat
-
 """All input for the create `Forum` mutation."""
 input CreateForumInput {
   """
@@ -1863,8 +1858,8 @@
   id: Int!
   name: String!
   updatedAt: Datetime!
-  precision12Scale2: BigFloat
-  precision200Scale100: BigFloat
+  precision12Scale2: Float
+  precision200Scale100: Float

   """Reads and enables pagination through a set of `QuizEntry`."""
   quizEntries(
@@ -1910,10 +1905,10 @@
   updatedAt: Datetime

   """Checks for equality with the object’s `precision12Scale2` field."""
-  precision12Scale2: BigFloat
+  precision12Scale2: Float

   """Checks for equality with the object’s `precision200Scale100` field."""
-  precision200Scale100: BigFloat
+  precision200Scale100: Float
 }

 """A connection to a list of `QuizEntry` values."""
@@ -2129,8 +2124,8 @@
   id: Int
   name: String!
   updatedAt: Datetime
-  precision12Scale2: BigFloat
-  precision200Scale100: BigFloat
+  precision12Scale2: Float
+  precision200Scale100: Float
 }

 """Represents an update to a `Quiz`. Fields that are set will be updated."""
@@ -2138,8 +2133,8 @@
   id: Int
   name: String
   updatedAt: Datetime
-  precision12Scale2: BigFloat
-  precision200Scale100: BigFloat
+  precision12Scale2: Float
+  precision200Scale100: Float
 }

 """A connection to a list of `Quiz` values."""
```

## PgSmallNumericToFloatPlugin

```ts
/**
 * This plugin will have PostGraphile use `GraphQLFloat` instead of `BigFloat`
 * for DECIMAL / NUMERIC values that have a precision and scale under the given
 * limits (currently 12 and 2 respectively).
 *
 * It's generally a bad idea to use floating point numbers to represent
 * arbitrary precision numbers such as NUMERIC because loss of precision can
 * occur; however some systems are okay with this compromise.
 */
module.exports = function PgSmallNumericToFloatPlugin(
  builder,
  { pgNumericToFloatPrecisionCap = 12, pgNumericToFloatScaleCap = 2 },
) {
  builder.hook("build", (build) => {
    // Register a type handler for NUMERIC / DECIMAL (oid = 1700)
    build.pgRegisterGqlTypeByTypeId("1700", (_set, modifier) => {
      if (modifier && typeof modifier === "number" && modifier > 0) {
        // Ref: https://stackoverflow.com/a/3351120/141284
        const precision = ((modifier - 4) >> 16) & 65535;
        const scale = (modifier - 4) & 65535;
        if (
          precision <= pgNumericToFloatPrecisionCap &&
          scale <= pgNumericToFloatScaleCap
        ) {
          // This number is no more precise than our cap, so we're declaring
          // that we can handle it as a float:
          return build.graphql.GraphQLFloat;
        }
      }
      // If all else fails, let PostGraphile do it's default handling - i.e.
      // BigFloat
      return null;
    });

    // We didn't modify _init, but we still must return it.
    return build;
  });
};
```

Resulting GraphQL Schema diff:

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -1863,7 +1863,7 @@
   id: Int!
   name: String!
   updatedAt: Datetime!
-  precision12Scale2: BigFloat
+  precision12Scale2: Float
   precision200Scale100: BigFloat

   """Reads and enables pagination through a set of `QuizEntry`."""
@@ -1910,7 +1910,7 @@
   updatedAt: Datetime

   """Checks for equality with the object’s `precision12Scale2` field."""
-  precision12Scale2: BigFloat
+  precision12Scale2: Float

   """Checks for equality with the object’s `precision200Scale100` field."""
   precision200Scale100: BigFloat
@@ -2129,7 +2129,7 @@
   id: Int
   name: String!
   updatedAt: Datetime
-  precision12Scale2: BigFloat
+  precision12Scale2: Float
   precision200Scale100: BigFloat
 }

@@ -2138,7 +2138,7 @@
   id: Int
   name: String
   updatedAt: Datetime
-  precision12Scale2: BigFloat
+  precision12Scale2: Float
   precision200Scale100: BigFloat
 }
```

## SetInputObjectDefaultValue

```ts
/**
 * This plugin sets a defaultValue on all input object fields that match the
 * given criteria (specifically the 'create' input types, for columns named
 * 'name')
 */
module.exports = function SetInputObjectDefaultValue(builder) {
  builder.hook(
    "GraphQLInputObjectType:fields:field",
    (field, build, context) => {
      const {
        scope: {
          isPgRowType,
          isInputType,
          isPgPatch,
          pgFieldIntrospection: attr,
        },
      } = context;
      if (
        !isPgRowType ||
        !isInputType ||
        isPgPatch ||
        !attr ||
        attr.kind !== "attribute" ||
        attr.name !== "name"
      ) {
        return field;
      }

      return {
        ...field,
        type: build.graphql.getNamedType(field.type), // Since it has a default, it can be nullable
        defaultValue:
          // attr.tags.defaultValue: enables overriding this with a
          // `@defaultValue Alice Smith` smart comment
          attr.tags.defaultValue || "Bobby Tables",
      };
    },
  );
};
```

Resulting GraphQL Schema diff:

```diff
--- Original GraphQL Schema
+++ Modified GraphQL Schema
@@ -968,7 +968,7 @@
   slug: String!

   """The name of the `Forum` (indicates its subject matter)."""
-  name: String!
+  name: String = "Bobby Tables"

   """A brief description of the `Forum` including it's purpose."""
   description: String
@@ -2127,7 +2127,7 @@
 """An input for mutations affecting `Quiz`"""
 input QuizInput {
   id: Int
-  name: String!
+  name: String = "Bobby Tables"
   updatedAt: Datetime
   precision12Scale2: BigFloat
   precision200Scale100: BigFloat
@@ -3343,7 +3343,7 @@
   username: String!

   """Public-facing name (or pseudonym) of the user."""
-  name: String
+  name: String = "Bobby Tables"

   """Optional avatar URL."""
   avatarUrl: String
```
