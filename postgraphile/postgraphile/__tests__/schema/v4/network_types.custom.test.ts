import * as core from "./core.ts";

test(
  "prints a schema to test network scalars using custom network scalar types",
  core.test(__filename, ["network_types"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  }),
);
