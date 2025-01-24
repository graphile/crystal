# Exporting Your Schema

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
import { exportSchema } from "graphile-export";
import { postgraphile } from "postgraphile";
import config from "./graphile.config.js";
import * as jsonwebtoken from "jsonwebtoken";

const pgl = postgraphile(config);
async function main() {
  const { schema, resolvedPreset } = await pgl.getSchemaResult();
  const exportFileLocation = `${__dirname}/exported-schema.mjs`;
  await exportSchema(schema, exportFileLocation, {
    mode: "graphql-js",
    // or:
    // mode: "typeDefs",
    modules: {
      jsonwebtoken: jsonwebtoken,
    },
  });
}

main()
  .finally(() => pgl.release())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
```

Run this file, and you should see a `exported-schema.mjs` file containing your
executable schema. You'll notice that this schema does not import
graphile-build, graphile-build-pg, etc — it just imports what it needs from
`graphql`, `grafast` and similar runtime modules.

:::warning For a schema to be exported, all plugins must support exporting

Not all PostGraphile plugins support exporting the schema, if you use plugins
that don't support exporting then your exported schema is likely to have
runtime or even security issues. It is essential that you thoroughly test
your exported schema before relying on it.

:::

:::warning Test your exported schema thoroughly

Exporting a GraphQL schema is error-prone, so you should test your exported
schema thoroughly. The main failure mode for exported schemas is runtime errors
or incorrect variable references when an exported function attempts to
reference a variable in the parent scope and that variable wasn't correctly
handled via the `EXPORTABLE()` function from `graphile-export`. Using
`eslint-plugin-graphile-export` will help catch most of these kinds of errors,
but you should be careful to ensure that every function that will be exported
is either wrapped with `EXPORTABLE` (with the correct args) or is from a
declared module — see the `graphile-export` documentation.

TODO: update this warning, since this is less of an issue now that
graphile-export does its own internal consistency checks.

:::

:::tip Use your exported schema in dev and CI too

If you will be exporting your GraphQL schema we **highly recommend** that you
adopt the exported schema into every facet of your development lifecycle: you
should use the exported schema in development, you should use it when running
tests, and you should use it on your staging environments. This will give lots
of opportunity for you and your QA engineer colleagues to catch any bugs in the
export.

:::

:::tip Use eslint-plugin-graphile-export when writing plugins

We **highly recommend** that plugin authors (both for internal project plugins
and plugins distributed via `npm`) consult the
[graphile-export](https://star.graphile.org/graphile-export/) documentation in
full. In particular, you should use the
[`eslint-plugin-graphile-export`](http://www.npmjs.com/package/eslint-plugin-graphile-export)
rules to help ensure that the plan resolvers and similar that you add are
themselves exportable. (This plugin is still experimental so we recommend that
you only enable this ruleset on the files that contain PostGraphile plugins,
and that you commit early and often so that any unintended changes to your
codebase can be reverted.)

:::

:::tip

You may get value from running ESLint, TypeScript, and/or other code validation
tooling against the exported code to ensure there are no undefined variable
references or similar.

:::

## Running the export

```ts title="run-exported.mjs"
import { grafserv } from "postgraphile/grafserv/node";
import { createServer } from "node:http";
import preset from "./graphile.config.js";
import { schema } from "./exported-schema.mjs";

const server = createServer();
const serv = grafserv({ preset, schema });
serv.addTo(server);
server.listen(5555);
console.log("Listening on http://localhost:5555/");
```

:::note Only import what you need!

You'll notice that we import the `node` grafserv adaptor, our exported schema,
and our preset, but no other PostGraphile-specific imports. The schema export
itself will pull in a few other modules, but there should be no need to import
`postgraphile` itself or the `graphile-build` system, since the schema has
already built. This helps to keep runtime memory usage down, and importing
less code should make for faster startup (and smaller bundles if you bundle
your server, e.g. for serverless applications).

:::
