import * as core from "./core.ts";

test(
  "prints a schema with JS reserved words used throughout",
  core.test(__filename, "js_reserved", {
    subscriptions: true,
    simpleCollections: "both",
  }),
);
