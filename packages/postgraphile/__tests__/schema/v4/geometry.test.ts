const core = require("./core");

test(
  "prints a schema for geometry",
  core.test(__filename, ["geometry"], {
    graphileBuildOptions: {
      pgGeometricTypes: true,
    },
  })
);
