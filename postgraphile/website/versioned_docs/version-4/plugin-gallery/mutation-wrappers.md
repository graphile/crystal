---
sidebar_position: 3
---

# Mutation wrappers

Below you'll find some small plugins that people have written. Larger plugins likely have their own dedicated repositories, these are typically just examples of how to achieve a small goal.

_This is a work in progress, in future these plugins will be automatically tested but we've not got quite that far yet, so my apologies if you come across any issues._

## OverrideArgValuePlugin

```ts
/**
 * This plugin sets the `input.quizPatch.updatedAt` to the current timestamp in
 * the `updateQuiz*` mutations IFF it's not already set.
 */
module.exports = function SetInputObjectDefaultValue(builder) {
  builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
    const {
      scope: { isPgUpdateMutationField, pgFieldIntrospection: table },
    } = context;
    if (
      !isPgUpdateMutationField ||
      table.kind !== "class" ||
      table.name !== "quiz"
    ) {
      return field;
    }

    const oldResolve = field.resolve;

    return {
      ...field,
      resolve(_mutation, args, context, info) {
        // Override the `updatedAt` field if it's not already set.
        if (args.input.quizPatch.updatedAt == null) {
          args.input.quizPatch.updatedAt = new Date().toISOString();
        }
        return oldResolve(_mutation, args, context, info);
      },
    };
  });
};

// Tested via:
// npx postgraphile --append-plugins @graphile-contrib/pg-simplify-inflector,`pwd`/examples/plugins/0300_mutation_wrappers/OverrideArgValuePlugin.js -c graphile_org_demo -s app_public
```
