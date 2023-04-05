import * as core from "./core.js";

test(
  "prints a schema with the NodePlugin skipped",
  core.test(__filename, ["a", "b", "c"], {
    disablePlugins: ["NodePlugin", "PgRBACPlugin", "PgIndexBehaviorsPlugin"],
  }),
);
