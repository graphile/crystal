"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRemoveExtensionResourcesPlugin = void 0;
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
const EMPTY_OBJECT = Object.freeze({});
exports.PgRemoveExtensionResourcesPlugin = {
    name: "PgRemoveExtensionResourcesPlugin",
    description: "Removes resources that come from Postgres extensions, typically you don't want these utility types and functions in your GraphQL API",
    version: version_js_1.version,
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgRemoveExtensionResources",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState() {
            return {
                extensionProcs: [],
                extensionClasses: [],
            };
        },
        helpers: {},
        hooks: {
            pgIntrospection_introspection(info, event) {
                const { introspection } = event;
                const oidByCatalog = Object.create(null);
                for (const oid in introspection.catalog_by_oid) {
                    oidByCatalog[introspection.catalog_by_oid[oid]] = oid;
                }
                // 'pg_catalog.pg_extension'::pg_catalog.regclass
                const pgExtensionId = oidByCatalog["pg_extension"];
                // 'pg_catalog.pg_proc'::pg_catalog.regclass
                const pgProcId = oidByCatalog["pg_proc"];
                // 'pg_catalog.pg_class'::pg_catalog.regclass
                const pgClassId = oidByCatalog["pg_class"];
                for (const dep of introspection.depends) {
                    if (dep.refclassid === pgExtensionId && dep.deptype === "e") {
                        switch (dep.classid) {
                            case pgProcId: {
                                const procId = dep.objid;
                                const pgProc = introspection.procs.find((p) => p._id === procId);
                                if (pgProc) {
                                    info.state.extensionProcs.push(pgProc);
                                }
                                // ...
                                break;
                            }
                            case pgClassId: {
                                const relId = dep.objid;
                                const pgClass = introspection.classes.find((p) => p._id === relId);
                                if (pgClass) {
                                    info.state.extensionClasses.push(pgClass);
                                }
                                // ...
                                break;
                            }
                            default: {
                                /* ignore */
                            }
                        }
                    }
                }
            },
            async pgProcedures_PgResourceOptions(info, event) {
                if (info.state.extensionProcs.includes(event.pgProc)) {
                    if (!event.resourceOptions.extensions) {
                        event.resourceOptions.extensions = Object.create(null);
                    }
                    event.resourceOptions.extensions.isFromExtension = true;
                }
            },
            async pgTables_PgResourceOptions(info, event) {
                if (info.state.extensionClasses.includes(event.pgClass)) {
                    if (!event.resourceOptions.extensions) {
                        event.resourceOptions.extensions = Object.create(null);
                    }
                    event.resourceOptions.extensions.isFromExtension = true;
                }
            },
        },
    }),
    schema: {
        entityBehavior: {
            pgResource: {
                inferred: {
                    after: ["inferred"],
                    provides: ["postInferred"],
                    callback(behavior, resource) {
                        if (resource.extensions?.isFromExtension) {
                            return [behavior, "-*"];
                        }
                        return behavior;
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=PgRemoveExtensionResourcesPlugin.js.map