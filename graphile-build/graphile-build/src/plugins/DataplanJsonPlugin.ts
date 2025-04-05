import "./PgTablesPlugin.js";
import "graphile-config";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      DataplanJsonPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BuildVersions {
      "@dataplan/json": string;
    }
    interface Build {
      /**
       * A copy of `import * from "@dataplan/json"` so that plugins don't need to
       * import it directly.
       */
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      dataplanJson: typeof import("@dataplan/json");
    }
  }
}

export const DataplanJsonPlugin: GraphileConfig.Plugin = {
  name: "DataplanJsonPlugin",
  description: "Loads build.dataplanJson",
  version: version,

  schema: {
    hooks: {
      build(build) {
        const {
          lib: { dataplanJson },
        } = build;
        return build.extend(
          build,
          {
            versions: build.extend(
              build.versions,
              { "@dataplan/json": dataplanJson.version },
              "Adding @dataplan/json to build.versions",
            ),
            dataplanJson,
          },
          "Adding @dataplan/json to build",
        );
      },
    },
  },
};
