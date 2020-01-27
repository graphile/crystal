const core = require("./core");

test(
  "prints a schema to test network scalars without using custom network scalar types",
  core.test(["network_types"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: false,
    },
  })
);
test(
  "prints a schema to test network scalars using custom network scalar types",
  core.test(["network_types"], {
    graphileBuildOptions: {
      pgUseCustomNetworkScalars: true,
    },
  })
);
