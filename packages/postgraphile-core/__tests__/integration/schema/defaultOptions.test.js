const core = require("./core");

test("prints a schema with the default options", core.test(["a", "b", "c"]));
test(
  "should be same with subscriptions option set",
  core.test(["a", "b", "c"], { subscriptions: true })
);
