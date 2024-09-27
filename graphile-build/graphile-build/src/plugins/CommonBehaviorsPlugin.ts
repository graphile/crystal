import "graphile-config";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface BehaviorStrings {
      // 'connection' and 'list' are for connection-capable collections. If
      // your collection is not connection-capable, it should use 'array'
      // instead.
      connection: true;
      list: true;
      array: true;

      single: true;

      "interface:node": true;
      "type:node": true;
      node: true;
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
          description:
            "represent collection as a list - only use with collections that can be represented as a connection too",
          entities: [],
        },
        array: {
          description:
            "represent an array as a list - use with collections which are not connection-capable (otherwise use list)",
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

        node: {
          description: "should this type implement the Node interface?",
          entities: [],
        },
      },
    },
  },
};
