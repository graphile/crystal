import * as core from "./core.ts";

test(
  "prints a schema to test PG11-specific features with custom network scalars",
  core.test(__filename, ["pg11"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  }),
);
