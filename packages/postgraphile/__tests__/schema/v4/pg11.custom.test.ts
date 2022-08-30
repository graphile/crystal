const core = require("./core");

test(
  "prints a schema to test PG11-specific features with custom network scalars",
  core.test(__filename, ["pg11"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  })
);
