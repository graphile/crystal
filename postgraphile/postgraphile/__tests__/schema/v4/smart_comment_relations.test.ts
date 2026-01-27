import * as core from "./core.ts";

test(
  "prints a schema for smart_comment_relations",
  core.test(__filename, ["smart_comment_relations"], {}),
);
