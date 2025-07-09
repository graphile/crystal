"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPreset = exports.GraphileBuildLibPreset = void 0;
const tslib_1 = require("tslib");
require("./interfaces.js");
require("graphile-config");
const grafast = tslib_1.__importStar(require("grafast"));
const graphql = tslib_1.__importStar(require("grafast/graphql"));
const index_js_1 = require("./plugins/index.js");
const utils_js_1 = require("./utils.js");
const version_js_1 = require("./version.js");
exports.GraphileBuildLibPreset = {
    lib: {
        versions: {
            grafast: grafast.version,
            graphql: graphql.version,
            "graphile-build": version_js_1.version,
        },
        graphql,
        grafast,
        graphileBuild: {
            EXPORTABLE: utils_js_1.EXPORTABLE,
            EXPORTABLE_OBJECT_CLONE: utils_js_1.EXPORTABLE_OBJECT_CLONE,
            exportNameHint: utils_js_1.exportNameHint,
        },
    },
};
// TODO: version this
exports.defaultPreset = {
    extends: [exports.GraphileBuildLibPreset],
    plugins: [
        // Must come first
        index_js_1.CollectReferencedTypesPlugin,
        index_js_1.QueryPlugin,
        index_js_1.MutationPlugin,
        index_js_1.SubscriptionPlugin,
        // StreamDeferPlugin,
        index_js_1.CommonBehaviorsPlugin,
        index_js_1.ClientMutationIdDescriptionPlugin,
        index_js_1.MutationPayloadQueryPlugin,
        index_js_1.CursorTypePlugin,
        index_js_1.CommonTypesPlugin,
        index_js_1.NodePlugin,
        index_js_1.ConnectionPlugin,
        index_js_1.PageInfoStartEndCursorPlugin,
        index_js_1.BuiltinScalarConnectionsPlugin,
        index_js_1.TrimEmptyDescriptionsPlugin,
        index_js_1.AddNodeInterfaceToSuitableTypesPlugin,
        index_js_1.NodeIdCodecBase64JSONPlugin,
        index_js_1.NodeIdCodecPipeStringPlugin,
        index_js_1.RegisterQueryNodePlugin,
        index_js_1.NodeAccessorPlugin,
        index_js_1.AddInterfaceSubtypesToTypesPlugin,
    ],
};
//# sourceMappingURL=preset.js.map