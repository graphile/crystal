import * as core from "./core.js";

test(
  "prints a schema involving partitioned tables",
  core.test(__filename, ["partitions"]),
);
