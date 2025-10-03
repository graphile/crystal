# node

`node(possibleTypes, $id)` decodes a GraphQL global ID and identifies which
object type it references. The step resolves to either `null` or an object:
`{ __typename, specifier }`. The `specifier` is whatever the matching
`NodeIdHandler` returned from `codec.decode()`, ready to be fed into your
abstract type's `planType()` logic.

This step does **not** fetch the record. Its only job is to discriminate the ID
so that your abstract type can decide how to plan the concrete branch.

## specFromNodeId

If you already know which object type the ID should represent (for example in
`updateUser(id: ID!, ...)`), prefer using `specFromNodeId(handler, $id)`. It
returns the handler's specifier directly, bypassing the polymorphic layer:

```ts
import { specFromNodeId } from "grafast";

const $specifier = specFromNodeId(userHandler, $id);
const $update = userResource.update($specifier, $changes);
return $update;
```

`node()` is only required when you genuinely need to dispatch between multiple
handlers at runtime, such as inside the built-in `Query.node` field.
