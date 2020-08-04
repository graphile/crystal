const core = require("./core");

test(
  "prints a schema for geometry",
  core.test(["geometry"], {
    graphileBuildOptions: {
      pgGeometricTypes: true,
    },
  })
);
