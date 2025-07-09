"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPreset = exports.GraphileBuildPgLibPreset = void 0;
const tslib_1 = require("tslib");
require("graphile-config");
const dataplanPg = tslib_1.__importStar(require("@dataplan/pg"));
const pg_1 = require("@dataplan/pg");
const pg_sql2_1 = tslib_1.__importStar(require("pg-sql2"));
const PgAllRowsPlugin_js_1 = require("./plugins/PgAllRowsPlugin.js");
const PgAttributeDeprecationPlugin_js_1 = require("./plugins/PgAttributeDeprecationPlugin.js");
const PgAttributesPlugin_js_1 = require("./plugins/PgAttributesPlugin.js");
const PgBasicsPlugin_js_1 = require("./plugins/PgBasicsPlugin.js");
const PgCodecsPlugin_js_1 = require("./plugins/PgCodecsPlugin.js");
const PgConditionArgumentPlugin_js_1 = require("./plugins/PgConditionArgumentPlugin.js");
const PgConditionCustomFieldsPlugin_js_1 = require("./plugins/PgConditionCustomFieldsPlugin.js");
const PgConnectionArgOrderByDefaultValuePlugin_js_1 = require("./plugins/PgConnectionArgOrderByDefaultValuePlugin.js");
const PgConnectionArgOrderByPlugin_js_1 = require("./plugins/PgConnectionArgOrderByPlugin.js");
const PgConnectionTotalCountPlugin_js_1 = require("./plugins/PgConnectionTotalCountPlugin.js");
const PgCustomTypeFieldPlugin_js_1 = require("./plugins/PgCustomTypeFieldPlugin.js");
const PgEnumTablesPlugin_js_1 = require("./plugins/PgEnumTablesPlugin.js");
const PgFakeConstraintsPlugin_js_1 = require("./plugins/PgFakeConstraintsPlugin.js");
const PgFirstLastBeforeAfterArgsPlugin_js_1 = require("./plugins/PgFirstLastBeforeAfterArgsPlugin.js");
const PgIndexBehaviorsPlugin_js_1 = require("./plugins/PgIndexBehaviorsPlugin.js");
const PgInterfaceModeUnionAllRowsPlugin_js_1 = require("./plugins/PgInterfaceModeUnionAllRowsPlugin.js");
const PgIntrospectionPlugin_js_1 = require("./plugins/PgIntrospectionPlugin.js");
const PgJWTPlugin_js_1 = require("./plugins/PgJWTPlugin.js");
const PgLtreePlugin_js_1 = require("./plugins/PgLtreePlugin.js");
const PgMutationCreatePlugin_js_1 = require("./plugins/PgMutationCreatePlugin.js");
const PgMutationPayloadEdgePlugin_js_1 = require("./plugins/PgMutationPayloadEdgePlugin.js");
const PgMutationUpdateDeletePlugin_js_1 = require("./plugins/PgMutationUpdateDeletePlugin.js");
const PgNodeIdAttributesPlugin_js_1 = require("./plugins/PgNodeIdAttributesPlugin.js");
const PgOrderAllAttributesPlugin_js_1 = require("./plugins/PgOrderAllAttributesPlugin.js");
const PgOrderByPrimaryKeyPlugin_js_1 = require("./plugins/PgOrderByPrimaryKeyPlugin.js");
const PgOrderCustomFieldsPlugin_js_1 = require("./plugins/PgOrderCustomFieldsPlugin.js");
const PgPolymorphismOnlyArgumentPlugin_js_1 = require("./plugins/PgPolymorphismOnlyArgumentPlugin.js");
const PgPolymorphismPlugin_js_1 = require("./plugins/PgPolymorphismPlugin.js");
const PgProceduresPlugin_js_1 = require("./plugins/PgProceduresPlugin.js");
const PgRBACPlugin_js_1 = require("./plugins/PgRBACPlugin.js");
const PgRefsPlugin_js_1 = require("./plugins/PgRefsPlugin.js");
const PgRegistryPlugin_js_1 = require("./plugins/PgRegistryPlugin.js");
const PgRelationsPlugin_js_1 = require("./plugins/PgRelationsPlugin.js");
const PgRemoveExtensionResourcesPlugin_js_1 = require("./plugins/PgRemoveExtensionResourcesPlugin.js");
const PgRowByUniquePlugin_js_1 = require("./plugins/PgRowByUniquePlugin.js");
const PgTableNodePlugin_js_1 = require("./plugins/PgTableNodePlugin.js");
const PgTablesPlugin_js_1 = require("./plugins/PgTablesPlugin.js");
const PgTypesPlugin_js_1 = require("./plugins/PgTypesPlugin.js");
const version_js_1 = require("./version.js");
exports.GraphileBuildPgLibPreset = {
    lib: {
        versions: {
            "graphile-build-pg": version_js_1.version,
            "@dataplan/pg": dataplanPg.version,
            "pg-sql2": pg_sql2_1.version,
        },
        dataplanPg,
        sql: pg_sql2_1.default,
    },
};
// TODO: version this.
exports.defaultPreset = {
    extends: [exports.GraphileBuildPgLibPreset],
    plugins: [
        PgBasicsPlugin_js_1.PgBasicsPlugin,
        PgLtreePlugin_js_1.PgLtreePlugin,
        PgCodecsPlugin_js_1.PgCodecsPlugin,
        pg_1.PgContextPlugin,
        PgTypesPlugin_js_1.PgTypesPlugin,
        PgRefsPlugin_js_1.PgRefsPlugin,
        PgIntrospectionPlugin_js_1.PgIntrospectionPlugin,
        PgTablesPlugin_js_1.PgTablesPlugin,
        PgMutationCreatePlugin_js_1.PgMutationCreatePlugin,
        PgProceduresPlugin_js_1.PgProceduresPlugin,
        PgAttributesPlugin_js_1.PgAttributesPlugin,
        PgNodeIdAttributesPlugin_js_1.PgNodeIdAttributesPlugin,
        PgAllRowsPlugin_js_1.PgAllRowsPlugin,
        PgRowByUniquePlugin_js_1.PgRowByUniquePlugin,
        PgConnectionTotalCountPlugin_js_1.PgConnectionTotalCountPlugin,
        PgRelationsPlugin_js_1.PgRelationsPlugin,
        PgAttributeDeprecationPlugin_js_1.PgAttributeDeprecationPlugin,
        PgCustomTypeFieldPlugin_js_1.PgCustomTypeFieldPlugin,
        PgFirstLastBeforeAfterArgsPlugin_js_1.PgFirstLastBeforeAfterArgsPlugin,
        PgConnectionArgOrderByPlugin_js_1.PgConnectionArgOrderByPlugin,
        PgConditionArgumentPlugin_js_1.PgConditionArgumentPlugin,
        PgConditionCustomFieldsPlugin_js_1.PgConditionCustomFieldsPlugin,
        PgFakeConstraintsPlugin_js_1.PgFakeConstraintsPlugin,
        PgOrderByPrimaryKeyPlugin_js_1.PgOrderByPrimaryKeyPlugin,
        PgOrderAllAttributesPlugin_js_1.PgOrderAllAttributesPlugin,
        PgOrderCustomFieldsPlugin_js_1.PgOrderCustomFieldsPlugin,
        PgConnectionArgOrderByDefaultValuePlugin_js_1.PgConnectionArgOrderByDefaultValuePlugin,
        PgTableNodePlugin_js_1.PgTableNodePlugin,
        PgMutationPayloadEdgePlugin_js_1.PgMutationPayloadEdgePlugin,
        PgMutationUpdateDeletePlugin_js_1.PgMutationUpdateDeletePlugin,
        PgJWTPlugin_js_1.PgJWTPlugin,
        PgRemoveExtensionResourcesPlugin_js_1.PgRemoveExtensionResourcesPlugin,
        PgEnumTablesPlugin_js_1.PgEnumTablesPlugin,
        PgPolymorphismPlugin_js_1.PgPolymorphismPlugin,
        PgInterfaceModeUnionAllRowsPlugin_js_1.PgInterfaceModeUnionAllRowsPlugin,
        PgRBACPlugin_js_1.PgRBACPlugin,
        PgIndexBehaviorsPlugin_js_1.PgIndexBehaviorsPlugin,
        PgRegistryPlugin_js_1.PgRegistryPlugin,
        PgPolymorphismOnlyArgumentPlugin_js_1.PgPolymorphismOnlyArgumentPlugin,
    ],
};
//# sourceMappingURL=preset.js.map