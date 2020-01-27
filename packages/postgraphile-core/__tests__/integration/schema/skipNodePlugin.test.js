const core = require("./core");
const { NodePlugin } = require("graphile-build");

test(
  "prints a schema with the NodePlugin skipped",
  core.test(["a", "b", "c"], {
    skipPlugins: [NodePlugin],
  })
);
