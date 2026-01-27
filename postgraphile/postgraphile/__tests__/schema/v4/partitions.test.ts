import * as core from "./core.ts";

test(
  "prints a schema involving partitioned tables",
  core.test(__filename, ["partitions"]),
);
