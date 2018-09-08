const core = require("./core");

test("prints a schema to test PG10-specific features", core.test(["pg10"]));
