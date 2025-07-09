"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.test = void 0;
const graphql_1 = require("graphql");
const consistentlyOrderedSchema_js_1 = require("./consistentlyOrderedSchema.js");
const test = (val) => (0, graphql_1.isSchema)(val);
exports.test = test;
const serialize = (schema) => {
    return (0, graphql_1.printSchema)((0, consistentlyOrderedSchema_js_1.consistentlyOrderedSchema)(schema));
};
exports.serialize = serialize;
//# sourceMappingURL=index.js.map