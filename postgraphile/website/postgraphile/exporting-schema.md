# Exporting your schema

One of the major new features of PostGraphile V5 is the ability to export your
schema as executable code. You might use this as a way to "eject" your schema so
that you can take care of writing it yourself, or you could use it to make
startup in production faster by removing the need for introspection and the
plugin systems of graphile-build, or you might just use it to get a better
understanding of how your schema works.

However you plan to use it, it's a powerful and exciting new feature! To use
this feature:

1. build your schema
2. call `exportSchema` on it

Here's a simple example:

```ts
import { makeSchema } from "postgraphile";
import config from "./graphile.config.js";
import * as jsonwebtoken from "jsonwebtoken";

const { schema, contextCallback } = makeSchema(config);
const exportFileLocation = `${__dirname}/exported-schema.mjs`;
exportSchema(schema, exportFileLocation, {
  mode: "graphql-js",
  // or:
  // mode: "typeDefs",
  modules: {
    jsonwebtoken: jsonwebtoken,
  },
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Run this file, and you should see a `exported-schema.mjs` file containing your
executable schema. You'll notice that this schema does not import
graphile-build, graphile-build-pg, etc - it just imports what it needs from
`graphql`, `grafast` and similar runtime modules.
