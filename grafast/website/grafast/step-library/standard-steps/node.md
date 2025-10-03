# node

`node(possibleTypes, $id)` decodes a GraphQL global ID and determines which
object type it references. The step resolves to either `null` or an object of
shape `{ __typename, specifier }`. The `specifier` is the decoded payload for
that handler and should be fed into your abstract type’s `planType()` logic to
produce the concrete step for the matching object type.

This step doesn't fetch the underlying record; it only performs ID
classification. Many resolvers can skip `node()` entirely by using
`specFromNodeId()` (see below) when the target type is already known.

## specFromNodeId

If you already know which object type the ID should represent (for example in a
mutation such as `updateUser(id: ID!, ...)`), prefer using
`specFromNodeId(handler, $id)`. It returns the handler’s specifier directly and
skips the polymorphic dispatch:

```ts
import { specFromNodeId } from "grafast";

const $specifier = specFromNodeId(userHandler, $id);
const $update = userResource.update($specifier, $changes);
return $update;
```

`node()` is only needed when a field genuinely needs to branch between multiple
handlers at runtime, such as the standard `Query.node` field.

## NodeIdHandler

A `NodeIdHandler` describes how a single object type encodes and decodes its
Global Object Identifier. Handlers are plain objects; the essential fields are:

- `typeName` – GraphQL object type name this handler serves.
- `codec` – the `NodeIdCodec` (see below) used to encode/decode the NodeID string.
- `match(decoded)` – returns `true` when the decoded value belongs to this
  type.
- `getIdentifiers(decoded)` – extracts the underlying identifier tuple from the
  decoded value.
- `plan($node)` – produces the value that will be passed to `codec.encode`.
  Feeding the result into `match` should yield `true`.
- `getSpec($decoded)` – converts the decoded value into whatever specifier your
  application expects. Useful for referencing a node without fetching it.
- `get(spec)` – given the specifier from `getSpec`, returns a step that resolves
  to the original node.
- `deprecationReason` (optional) – indicates that the Node implementation is
  deprecated.

Here's an example `NodeIdHandler` for a `User` type where the NodeID encodes a
tuple of `["User", userId]` using a base64-encoded JSON array:

```ts
import { constant, list } from "grafast";
import type { NodeIdHandler } from "grafast";
import { base64JSONCodec } from "./nodeIdCodecs"; // see NodeIdCodec section

export const userHandler: NodeIdHandler<[number]> = {
  typeName: "User",
  codec: base64JSONCodec,
  match(decoded) {
    return decoded[0] === "User";
  },
  getIdentifiers(decoded) {
    const [typeName, id] = decoded;
    return [id];
  },
  plan($user) {
    return list([constant("User", true), $user.get("id")]);
  },
  getSpec($decoded) {
    return { id: inhibitOnNull(access($decoded, 1)) };
  },
  get(spec) {
    return userResource.get(spec);
  },
};
```

Here's how we might retrieve a user from a UserID:

```ts
const $id = constant("WyJVc2VyIiwxMjNd"); // base64(JSON.stringify(["User",123"]))
const spec = specFromNodeId(userHandler, $id);
const $user = userHandler.get(spec);
```

And given that we now have a User in `$user`, we can get back to the `$id`:

```ts
const $specifier = handler.plan($user);
const $id = lambda($specifier, userHandler.codec.encode);
```

:::note[Encoding, decoding, and matching happen at execution time]

Matching an ID:

```ts
const id = "WyJVc2VyIiwxMjNd"; // base64(JSON.stringify(["User", 123]))
const decoded = userHandler.codec.decode(id); // ["User", 123]
const isMatch = userHandler.match(decoded); // true
const identifiers = userHandler.getIdentifiers(decoded); // [123]
```

Encoding an ID:

```ts
const planResult = ["User", 123];
const id = userHandler.codec.encode(planResult); // "WyJVc2VyIiwxMjNd"
```

:::

## NodeIdCodec

`NodeIdCodec` objects are responsible for converting a specifier to a string and
back again. Implement `{ name, encode, decode }` and set
`encode.isSyncAndSafe = true` / `decode.isSyncAndSafe = true` when the
operations are synchronous and side-effect free so Grafast can inline them.

Typically the same codec will be used for all IDs across your schema, but that
is not a requirement. If in doubt, `base64JSONCodec` is a good default.

### base64JSONCodec

This is a fairly popular and safe way of encoding IDs; essentially it's a base64
encoded JSON-stringified value, and should work with all identifiers.

```ts
export const base64JSONCodec = {
  name: "base64JSON",
  encode(value: any) {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  },
  decode(value: string) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
  },
};
base64JSONCodec.encode.isSyncAndSafe = true;
base64JSONCodec.decode.isSyncAndSafe = true;
```

e.g. `WyJVc2VyIiwxMjNd` might encode a `User` identified by `123`.

### pipeStringCodec

This is a more concise and less opaque encoding, using a pipe symbol to separate
the various components, but it is not appropriate to use if any of the
components may themselves contain a pipe symbol. It is purely presented as an
example, not a recommendation.

```ts
export const pipeStringCodec = {
  name: "pipeString",
  encode(values: any[]) {
    return Array.isArray(values) ? values.join("|") : null;
  },
  decode(value: string) {
    return typeof value === "string" ? value.split("|") : null;
  },
};
pipeStringCodec.encode.isSyncAndSafe = true;
pipeStringCodec.decode.isSyncAndSafe = true;
```

e.g. `User|123` might encode a `User` identified by `123`.

## Possible types

The `possibleTypes` object is a generally useful object to have around your
schema, a single place in which to look up all of your NodeIdHandlers. It's
simply a map from type name to handler:

```ts
const handlers = {
  User: userHandler,
  Article: articleHandler,
};
```

You can then pass it to `node()`:

```ts
const $node = node(handlers, $id);
```
