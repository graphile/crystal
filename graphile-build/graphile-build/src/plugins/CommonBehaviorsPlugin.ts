import "graphile-config";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface BehaviorStrings {
      connection: true;
      list: true;
      single: true;

      "interface:node": true;
      "type:node": true;
    }
  }
}

export const CommonBehaviorsPlugin: GraphileConfig.Plugin = {
  name: "CommonBehaviorsPlugin",
  version,

  schema: {
    behaviorRegistry: {
      add: {
        connection: {
          description:
            "represent collection as a connection (GraphQL Cursor Pagination Spec)",
          entities: [],
        },
        list: {
          description: "represent collection as a list (simple collections)",
          entities: [],
        },
        single: {
          description: "fetch a single record",
          entities: [],
        },

        "interface:node": {
          description: "should this interface implement the Node interface?",
          entities: [],
        },
        "type:node": {
          description: "should this type implement the Node interface?",
          entities: [],
        },
      },
    },
  },
};
