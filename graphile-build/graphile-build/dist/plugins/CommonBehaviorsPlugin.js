"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonBehaviorsPlugin = void 0;
require("graphile-config");
const version_js_1 = require("../version.js");
exports.CommonBehaviorsPlugin = {
    name: "CommonBehaviorsPlugin",
    version: version_js_1.version,
    schema: {
        behaviorRegistry: {
            add: {
                connection: {
                    description: "represent collection as a connection (GraphQL Cursor Pagination Spec)",
                    entities: [],
                },
                list: {
                    description: "represent collection as a list - only use with collections that can be represented as a connection too",
                    entities: [],
                },
                array: {
                    description: "represent an array as a list - use with collections which are not connection-capable (otherwise use list)",
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
//# sourceMappingURL=CommonBehaviorsPlugin.js.map