import * as core from "./core.ts";

test(
  "prints a schema for geometry",
  core.test(__filename, ["geometry"], {
    graphileBuildOptions: {
      pgGeometricTypes: true,
    },
  }),
);
