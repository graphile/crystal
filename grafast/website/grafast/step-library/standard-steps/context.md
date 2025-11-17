# context

Returns a step representing the GraphQL contextValue.

Usage:

```ts
const $context = context();
```

## Example

Imagine you have a GraphQL context that indicates the current user's ID:

```ts
const preset: GraphileConfig.Preset = {
  grafast: {
    context(requestContext) {
      // Extract the userId from your Express v4 middleware
      const userId = requestContext?.expressv4?.req.user?.id;
      return { userId };
    },
  },
};
```

You can get a step representing the current user ID from context in a plan
resolver:

```ts
const $context = context();
const $userId = $context.get("userId");
```

## TypeScript

TypeScript declaration merging should be used to detail the properties you are
making available on GraphQL context such that usage of this step is type safe in
plan resolvers. For example:

```ts
declare global {
  namespace Grafast {
    interface Context {
      userId?: number;
    }
  }
}
```

The code above would mean that `context().get("userId")` returns
`Step<number | undefined>`, thereby making its usage in plan resolvers type
safe.
