import * as core from "./core.ts";

test(
  "prints a schema with the NodePlugin skipped",
  core.test(__filename, ["polymorphic"], {
    disablePlugins: ["NodePlugin", "PgRBACPlugin", "PgIndexBehaviorsPlugin"],
  }),
);
