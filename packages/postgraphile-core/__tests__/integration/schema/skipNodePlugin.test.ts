import { NodePlugin } from "graphile-build";

import * as core from "./core";

test(
  "prints a schema with the NodePlugin skipped",
  core.test(["a", "b", "c"], {
    skipPlugins: [NodePlugin],
  }),
);
