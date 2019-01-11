const core = require("./core");
import { makeAddInflectorsPlugin } from "graphile-utils";

test(
  "prints a schema with the core types inflected",
  core.test(["a", "b", "c"], {
    appendPlugins: [
      makeAddInflectorsPlugin(
        {
          query: () => "Q",
          mutation: () => "M",
          subscription: () => "S",
          node: () => "N",
          pageInfo: () => "PI",

          // Postgres type names
          pgIntervalType: () => "I",
          pgIntervalInputType: () => "II",
          pgPointType: () => "P",
          pgPointInputType: () => "PP",
        },
        true
      ),
    ],
  })
);
