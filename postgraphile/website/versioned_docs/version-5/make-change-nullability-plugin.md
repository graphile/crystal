---
title: makeChangeNullabilityPlugin
---

Use this plugin to easily change the nullability of fields and arguments in
your GraphQL schema.

For more information about nullability in PostGraphile in general (and to help
determine if the change that you want to make is wise or misguided), see the
FAQ question ["Why is it nullable?"](./why-nullable)

## Function signature

The `makeChangeNullabilityPlugin` function accepts one parameter, a rules object:

```ts
function makeChangeNullabilityPlugin(
  rules: ChangeNullabilityRules,
): GraphileConfig.Plugin;

interface ChangeNullabilityRules {
  [typeName: string]: {
    [fieldName: string]:
      | NullabilitySpecString
      | {
          type?: NullabilitySpecString;
          args?: {
            [argName: string]: NullabilitySpecString;
          };
        };
  };
}
```

Note that the format allows you to indicate the nullability for a field
directly, or to pass an object in which you can indicate the field nullability
and the nullability of that field's arguments at the same time.

The `NullabilitySpecString` uses syntax similar to GraphQL's SDL to define the
nullability of a field, including control over lists and nested lists:

```ts
export type NullabilitySpecString =
  | "" // nullable
  | "!" // non-nullable
  | "[]" // nullable list of nullables
  | "[]!" // non-nullable list of nullables
  | "[!]" // nullable list of non-nullables
  | "[!]!"
  | "[[]]"
  | "[[]]!"
  | "[[]!]"
  | "[[]!]!"
  | "[[!]]"
  | "[[!]]!"
  | "[[!]!]"
  | "[[!]!]!";
```

## Example

To indicate that `UsersConnection.nodes` should be a non-nullable list of
non-nullables you would do:

```ts
import { makeChangeNullabilityPlugin } from "postgraphile/utils";

const MyNullabilityPlugin = makeChangeNullabilityPlugin({
  UsersConnection: {
    nodes: "[!]!",
  },
});
```
