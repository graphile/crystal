"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageInfoStartEndCursorPlugin = void 0;
require("graphile-config");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PageInfoStartEndCursorPlugin = {
    name: "PageInfoStartEndCursorPlugin",
    description: "Add startCursor/endCursor to the PageInfo type",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLObjectType_fields(fields, build, context) {
                const { extend, getOutputTypeByName, inflection, graphql: { GraphQLString }, } = build;
                const { Self, fieldWithHooks } = context;
                if (Self.name !== inflection.builtin("PageInfo")) {
                    return fields;
                }
                const Cursor = getOutputTypeByName("Cursor") ?? GraphQLString;
                return extend(fields, {
                    startCursor: fieldWithHooks({
                        isPageInfoStartCursorField: true,
                        fieldName: "startCursor",
                    }, () => ({
                        description: build.wrapDescription("When paginating backwards, the cursor to continue.", "field"),
                        type: Cursor,
                        plan: (0, utils_js_1.EXPORTABLE)(() => ($pageInfo) => $pageInfo.startCursor(), []),
                    })),
                    endCursor: fieldWithHooks({
                        isPageInfoEndCursorField: true,
                        fieldName: "endCursor",
                    }, () => ({
                        description: build.wrapDescription("When paginating forwards, the cursor to continue.", "field"),
                        type: Cursor,
                        plan: (0, utils_js_1.EXPORTABLE)(() => ($pageInfo) => $pageInfo.endCursor(), []),
                    })),
                }, `Adding startCursor/endCursor to ${Self.name}`);
            },
        },
    },
};
//# sourceMappingURL=PageInfoStartEndCursorPlugin.js.map