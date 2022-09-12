import * as core from "./core.js";

test(
  "Simple schema print (no ordering)",
  core.test(
    __filename,
    ["a", "b", "c"],
    { subscriptions: true },
    undefined,
    undefined,
    false,
  ),
);
