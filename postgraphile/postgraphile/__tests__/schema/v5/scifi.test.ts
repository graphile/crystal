import * as core from "./core.ts";

test(
  "upper camel case names",
  core.test(__filename, ["scifi"], {
    disablePlugins: ["PgRBACPlugin", "PgIndexBehaviorsPlugin"],
  }),
);
