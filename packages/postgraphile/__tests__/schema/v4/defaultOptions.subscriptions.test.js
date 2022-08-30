const core = require("./core");

test(
  "should be same with subscriptions option set",
  core.test(__filename, ["a", "b", "c"], {
    subscriptions: true,
  })
);
