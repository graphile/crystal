import * as core from "./core.js";

test(
  "prints a schema to test PG11-specific features with custom network scalars",
  core.test(__filename, ["pg11"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  }),
);
