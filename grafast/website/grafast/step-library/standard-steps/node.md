# node

A plan to get a Node by it's global object identifier (string). Accepts an
object specifying the supported codecs, an object map detailing the typeNames
supported and their details (codec to use, how to find the record, etc), and
finally the Node id string plan.

Usage:

```ts
const $nodeIdString = fieldArgs.get("id");
const $node = node(codecs, handlers, $nodeIdString);
```

TODO: actually detail what codecs and handlers are!
