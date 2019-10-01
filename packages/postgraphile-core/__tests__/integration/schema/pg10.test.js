const core = require("./core");

test(
  "prints a schema to test PG10-specific features with default options",
  core.test(["pg10"])
);
test(
  "prints a schema to test PG10-specific features with custom network scalars",
  core.test(["pg10"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  })
);
