# node

`node(possibleTypes, $id)` decodes a GraphQL global ID and determines which
object type it references. The step resolves to either `null` or an object of
shape `{ __typename, specifier }`. The `specifier` is the decoded payload for
that handler and should be fed into your abstract type’s `planType()` logic to
produce the concrete step for the matching object type.

This step never fetches the underlying record; it only performs ID
classification. Many resolvers can skip `node()` entirely by using
`specFromNodeId()` (see below) when the target type is already known.

## NodeIdHandler

A `NodeIdHandler` describes how a single object type encodes and decodes its
Global Object Identifier. Handlers are plain objects; the essential fields are:

- `typeName` – GraphQL object type name the handler supports.
- `codec` – a `NodeIdCodec` responsible for turning the specifier into an ID
  string and back again.
- `match(decoded)` – returns `true` when the decoded payload belongs to this
  type.
- `getIdentifiers(decoded)` – extracts the identifier tuple (helpful for
  logging or auditing).
- `plan($node)` – takes a step representing the object and returns a step that
  produces the encoded payload (later fed into `codec.encode`).
- `getSpec($decoded)` – converts the decoded payload into whatever “specifier”
  shape your data layer expects (commonly an object describing primary keys).
- `get(spec)` – returns a step that loads the entity identified by the given
  specifier (or whatever representation your schema uses).
- `deprecationReason` (optional) – signals that the type is deprecated.

```ts
import { constant, list } from "grafast";
import type { NodeIdHandler } from "grafast";
import { base64JSONCodec } from "./nodeIdCodecs"; // see NodeIdCodec section

export const userHandler: NodeIdHandler<[number]> = {
  typeName: "User",
  codec: base64JSONCodec,
  match(decoded) {
    return decoded?.type === "User";
  },
  getIdentifiers(decoded) {
    return [decoded.id];
  },
  plan($user) {
    return list([constant("User"), $user.get("id")]);
  },
  getSpec($decoded) {
    return { id: $decoded.get("id") };
  },
  get(spec) {
    return userResource.get(spec);
  },
};
```

### Registering handlers

Build a map from type name to handler and pass it to `node()` or use it when
constructing abstract types:

```ts
const handlers = {
  User: userHandler,
  Article: articleHandler,
};

const $node = node(handlers, fieldArgs.getRaw("id"));
```

Within an abstract type’s `planType()` you can inspect `$node` to dispatch to
`handlers[$__typename].get(specifier)` or whatever planning logic you prefer.

## NodeIdCodec

`NodeIdCodec` objects are responsible for converting a specifier to a string and
back again. Implement `{ name, encode, decode }` and set
`encode.isSyncAndSafe = true` / `decode.isSyncAndSafe = true` when the
operations are synchronous and side-effect free so Grafast can inline them.

Here are three common patterns you can adapt:

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

Choose the codec that fits your data model: base64 for opaque IDs or pipe
strings for readable tuples. You can provide additional codecs following the
same structure.

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
