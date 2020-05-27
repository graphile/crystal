import * as core from "./core";
import { NodePlugin } from "graphile-build";

test(
  "prints a schema with the NodePlugin skipped",
  core.test(["a", "b", "c"], {
    skipPlugins: [NodePlugin],
  }),
);
