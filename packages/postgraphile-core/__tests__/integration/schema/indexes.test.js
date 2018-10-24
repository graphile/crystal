const core = require("./core");

test(
  "prints a schema respecting indexes for conditions and order by",
  core.test(["a", "b", "c"], { ignoreIndexes: false })
);
