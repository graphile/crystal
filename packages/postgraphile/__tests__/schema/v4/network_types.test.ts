import * as core from "./core.js";

test(
  "prints a schema to test network scalars without using custom network scalar types",
  core.test(__filename, ["network_types"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: false,
    },
  }),
);
