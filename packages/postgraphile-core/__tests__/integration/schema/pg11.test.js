const core = require("./core");

test(
  "prints a schema to test PG11-specific features with default options",
  core.test(["pg11"])
);
test(
  "prints a schema to test PG11-specific features with custom network scalars",
  core.test(["pg11"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  })
);
