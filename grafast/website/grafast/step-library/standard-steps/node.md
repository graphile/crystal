# node

A step to get a Node by it's global object identifier (string). Accepts two parameters:

- `handlers`: a map from typeName to handler spec (codec to use, how to find the record, etc) - see below
- `$id`: the step (typically supplied from a field argument) representing the Node ID

Returns a polymorphic-capable step representing the record this `$id` represents.

Usage:

```ts
const $nodeIdString = fieldArgs.get("id");
const $node = node(handlers, $nodeIdString);
```

## codecs

A node identifier is a string that uniquely identifies an entity in the GraphQL
schema for the lifetime of that entity.

A codec is responsible for parsing and deparsing this string. There are many
different ways of encoding node identifiers, so we allow for many different
codecs.

A code is made of a `name` (string) and two methods:

- `encode` takes an intermediate representation and turns it into the final node identifier string
- `decode` takes the final node identifier string and turns it back into an intermediate representation

This intermediate representation is produced by and consumed by the handlers
(see below).

Here's an example `base64JSONCodec` which simply JSON stringifies the
intermediate representation and then base64 encodes it:

```js
function base64JSONEncode(value: any): string | null {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}
base64JSONEncode.isSyncAndSafe = true; // Optimization

function base64JSONDecode(value: string): any {
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}
base64JSONDecode.isSyncAndSafe = true; // Optimization

const base64JSONCodec = {
  name: "base64JSON",
  encode: base64JSONEncode,
  decode: base64JSONDecode,
};
```

## handlers

Each GraphQL object type that supports the `Node` interface must have its own
`NodeIdHandler`. This handler specifies:

- `typeName` - the GraphQL object type name to which the handler applies
- `codec` - the NodeID codec (see above) to use with this handler
- `match` - determines whether a given intermediate representation of a node
  identifier string (i.e. the result of `codec.decode()`) relates to this type
  or not
- `plan` - takes an entity of the given object type and return a step
  representing the intermediate representation for this entity (ready to be fed
  to `codec.encode()`)
- `getSpec` - builds a "specification" of the entity from a step representing a
  matching intermediate representation
- `get` - given the specification from `getSpec` above, returns a step
  representing the entity identified by the matching node identifier string, if
  it exists

Specifications (returned from `getSpec`) may differ for each object type. They
could be something simple like just a step that represents the numeric primary
key in the database, or they may be more complex such as an object with
multiple keys where each key's value is a step representing a related value to
match in the remote source.

Here's an example of a `userHandler`, which could be used across a schema when
handling node identifiers for the `User` type:

```js
const USER = "User";

const userHandler = {
  typeName: USER,

  codec: base64JSONCodec,

  // Given a User record, return a step describing the data to be encoded by
  // the codec:
  plan($user: PgSelectSingleStep) {
    return list([constant(USER), $user.get("id")]);
  },

  // Given the data decoded by the codec, determine if the data is for our
  // type. In this particular handler, the check looks at the first entry in
  // the list to see if it matches our type name.
  match(list) {
    return list[0] === USER;
  },

  // Given a step representing decoded data that passes the `match` test above,
  // return a specifier object that can be used to retrieve or reference
  // this entity.
  getSpec($list: ListStep<any[]>) {
    return {
      id: access($list, 1),
    };
  },

  // Given a spec (the result of `getSpec` above), return a step that resolves
  // to the entity (if found).
  get(spec: any) {
    return pgResource.get(spec);
  },
};

const handlers = {
  User: userHandler,
  // Add more handlers here
};
```

## specFromNodeId

Given you have a Node ID represented by the step `$id` and you already know
what type it should be (e.g. for an `updateUser` mutation you might know that
the `$id` should represent a `User`), you can use `specFromNodeId` passing the
relevant handler to get a specification for the entity in question. This is
typically useful when you want to mutate an entity without having to actually
retrieve it (if you want to retrieve it then use `node()` above instead).

If the handler doesn't match then the executable steps inside the resulting
spec will resolve to null-ish values (or maybe raise an error).

```ts
function specFromNodeId(
  handler: NodeIdHandler<any>,
  $id: ExecutableStep<string>,
): any;
```

Here's an example of an `updateUser` mutation that uses the `userHandler`
example handler from above:

```js
const typeDefs = /* GraphQL */ `
  extend type Mutation {
    updateUser(id: ID!, patch: UserPatch!): UpdateUserPayload
  }
`;

const plans = {
  Mutation: {
    updateUser(parent, { $id }) {
      // Turn the $id into a specifier:
      const spec = specFromNodeId(userHandler, $id);

      // Now use this specifier to plan an update for this user:
      const $result = pgUpdateSingle(userSource, spec);

      // Leave space in our result so we can add more properties later:
      const $payload = object({ result: $result });

      // Apply all the plans from the 'patch' argument (omitted for brevity):
      fieldArgs.apply($payload);

      // Return the payload plan:
      return $payload;
    },
  },
};
```
