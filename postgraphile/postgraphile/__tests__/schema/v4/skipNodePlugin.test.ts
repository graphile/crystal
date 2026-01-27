import { NodePlugin } from "graphile-build";

import * as core from "./core.ts";

test(
  "prints a schema with the NodePlugin skipped",
  core.test(__filename, ["a", "b", "c"], {
    skipPlugins: [NodePlugin],
  }),
);
