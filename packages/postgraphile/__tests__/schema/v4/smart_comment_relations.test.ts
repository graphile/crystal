import * as core from "./core.js";

test(
  "prints a schema for smart_comment_relations",
  core.test(__filename, ["smart_comment_relations"], {}),
);
