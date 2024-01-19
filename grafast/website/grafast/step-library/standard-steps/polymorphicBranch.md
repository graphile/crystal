# polymorphicBranch

The `polymorphicBranch` step is a utility step to handles generic polymorphic
branching.

:::tip

When building your own steps it may be better to implement the `planForType`
method on your step classes as explained in
[polymorphism](/grafast/polymorphism#polymorphic-capable-steps).

:::

`polymorphicBranch` accepts two parameters:

1. The step representing the data to branch on,
2. A `matchers` object detailing the types supported and how to match them.

## The matchers object

```ts
// This type is for illustrative purposes only; the actual type is slightly
// more complex
type PolymorphicTypeMatchers = {
  [typeName: string]: {
    match?(obj: any): boolean;
    plan?($obj: ExecutableStep): ExecutableStep;
  };
};
```

The matchers object is a map from type names supported (string) to the
associated "matcher" object for that type. For each type name, `typeName`, the
"matcher" object has two properties, both of which are optional:

- `match(obj)` - return `true` if the object `obj` is of the type being matched
  (`typeName`); otherwise `false`
  - If unset, defaults to `(obj) => obj.__typename === typeName`
- `plan($obj)` - assuming the data represented by the step `$obj` is of the
  type being matched, return a step that represents this type
  - If unset, defaults to `($obj) => $obj`

## Example

Imagine we want to represent a database of animals (which we're using an array
to simulate). Since the different types of animal all have a `name` but have
different data, we're going to use an interface to represent `Animal` and then
we'll use `polymorphicBranch` to narrow the object to the right type:

```ts
import { makeGrafastSchema, polymorphicBranch, access, lambda } from "grafast";

// Our database of animals
const ANIMALS = [
  { type: "feline", name: "Artie", colour: "ginger" },
  { type: "feline", name: "Brontie", colour: "tortoise shell" },
  { type: "canine", name: "Captain", wagsTail: true },
  { type: "hamster", data: { name: "Hammy", type: "winter white dwarf" } },
];

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    interface Animal {
      name: String!
    }
    type Cat implements Animal {
      name: String!
      colour: String!
    }
    type Dog implements Animal {
      name: String!
      wagsTail: Boolean!
    }
    type Hamster implements Animal {
      name: String!
      type: String!
    }

    type Query {
      animal(id: Int!): Animal
    }
  `,
  plans: {
    Query: {
      animal(_, { $id }) {
        const $animal = lambda($id, (id) => ANIMALS[id - 1]);
        return polymorphicBranch($animal, {
          Cat: {
            match: (obj) => obj.type === "feline",
          },
          Dog: {
            match: (obj) => obj.type === "canine",
          },
          Hamster: {
            match: (obj) => obj.type === "hamster",
            // Notice the shape of `Hamster` is different, so we need to
            // transform the object to represent a hamster. For other types
            // this might even involve fetching details from a remote data
            // source.
            plan: ($obj) => access($obj, "data"),
          },
        });
      },
    },
  },
});
```
