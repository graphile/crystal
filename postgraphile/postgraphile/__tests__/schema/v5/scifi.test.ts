import * as core from "./core.js";

test(
  "upper camel case names",
  core.test(__filename, ["scifi"], {
    disablePlugins: ["PgRBACPlugin", "PgIndexBehaviorsPlugin"],
  }),
);
