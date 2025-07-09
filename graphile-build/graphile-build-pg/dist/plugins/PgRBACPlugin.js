"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRBACPlugin = void 0;
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const pg_introspection_1 = require("pg-introspection");
const version_js_1 = require("../version.js");
const EMPTY_OBJECT = Object.freeze({});
exports.PgRBACPlugin = {
    name: "PgRBACPlugin",
    description: "Converts the database GRANT/REVOKE privileges to behaviors. Experimental.",
    experimental: true,
    version: version_js_1.version,
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgRBAC",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState() {
            return EMPTY_OBJECT;
        },
        helpers: {},
        hooks: {
            async pgCodecs_attribute(info, event) {
                const { pgAttribute, serviceName, attribute } = event;
                const pgClass = pgAttribute.getClass();
                if (!pgClass || !["r", "v", "m", "f", "p"].includes(pgClass.relkind)) {
                    return;
                }
                const db = await info.helpers.pgIntrospection.getService(serviceName);
                const { introspection } = db;
                const introspectionRole = introspection.getCurrentUser();
                if (!introspectionRole) {
                    // https://youtu.be/3kx7tgkJbjo?t=11
                    throw new Error("WHO AM I?");
                }
                const attributePermissions = (0, pg_introspection_1.entityPermissions)(introspection, pgAttribute, introspectionRole, true);
                const tablePermissions = (0, pg_introspection_1.entityPermissions)(introspection, pgClass, introspectionRole, true);
                const canSelect = attributePermissions.select || tablePermissions.select;
                const canInsert = attributePermissions.insert || tablePermissions.insert;
                const canUpdate = attributePermissions.update || tablePermissions.update;
                attribute.extensions = attribute.extensions || Object.create(null);
                Object.assign(attribute.extensions, {
                    canSelect,
                    canInsert,
                    canUpdate,
                });
            },
            async pgProcedures_PgResourceOptions(info, event) {
                const { pgProc, serviceName, resourceOptions } = event;
                const db = await info.helpers.pgIntrospection.getService(serviceName);
                const { introspection } = db;
                const introspectionRole = introspection.getCurrentUser();
                if (!introspectionRole) {
                    // https://youtu.be/3kx7tgkJbjo?t=11
                    throw new Error("WHO AM I?");
                }
                const permissions = (0, pg_introspection_1.entityPermissions)(introspection, pgProc, introspectionRole, true);
                resourceOptions.extensions =
                    resourceOptions.extensions || Object.create(null);
                resourceOptions.extensions.canExecute = permissions.execute ?? false;
            },
            async pgTables_PgResourceOptions(info, event) {
                const { pgClass, resourceOptions, serviceName } = event;
                if (!["r", "v", "m", "f", "p"].includes(pgClass.relkind)) {
                    return;
                }
                const db = await info.helpers.pgIntrospection.getService(serviceName);
                const { introspection } = db;
                resourceOptions.extensions =
                    resourceOptions.extensions || Object.create(null);
                const introspectionRole = introspection.getCurrentUser();
                if (!introspectionRole) {
                    // https://youtu.be/3kx7tgkJbjo?t=11
                    throw new Error("WHO AM I?");
                }
                const tablePermissions = (0, pg_introspection_1.entityPermissions)(introspection, pgClass, introspectionRole, true);
                let canSelect = tablePermissions.select ?? false;
                let canInsert = tablePermissions.insert ?? false;
                let canUpdate = tablePermissions.update ?? false;
                const canDelete = tablePermissions.delete ?? false;
                if (!canInsert || !canUpdate || !canSelect) {
                    // PERF: this is computationally expensive; we should really make this more efficient.
                    // Need to check the attributes
                    const attributePermissions = pgClass
                        .getAttributes()
                        .filter((att) => att.attnum > 0)
                        .map((att) => (0, pg_introspection_1.entityPermissions)(introspection, att, introspectionRole, true));
                    for (const attributePermission of attributePermissions) {
                        canSelect = canSelect || (attributePermission.select ?? false);
                        canInsert = canInsert || (attributePermission.insert ?? false);
                        canUpdate = canUpdate || (attributePermission.update ?? false);
                    }
                }
                Object.assign(resourceOptions.extensions, {
                    canSelect,
                    canInsert,
                    canUpdate,
                    canDelete,
                });
            },
        },
    }),
    schema: {
        entityBehavior: {
            pgCodecAttribute: {
                inferred: {
                    after: ["inferred"],
                    provides: ["postInferred"],
                    callback(behavior, [codec, attributeName]) {
                        const attr = codec.attributes[attributeName];
                        const newBehavior = [behavior];
                        if (attr.extensions?.canSelect === false) {
                            // Only remove `select` privileges if at least one sibling attribute has
                            // a grant - otherwise assume that this is behind a function or
                            // similar and all attributes are allowed you just can't select
                            // directly.
                            const hasSiblingWithSelect = Object.entries(codec.attributes).some(([otherAttrName, otherAttr]) => otherAttrName !== attributeName &&
                                otherAttr.extensions?.canSelect !== false);
                            if (hasSiblingWithSelect) {
                                newBehavior.push("-select", "-filterBy", "-orderBy");
                            }
                        }
                        if (attr.extensions?.canInsert === false) {
                            newBehavior.push("-insert");
                        }
                        if (attr.extensions?.canUpdate === false) {
                            newBehavior.push("-update");
                        }
                        return newBehavior;
                    },
                },
            },
            pgCodecRelation: {
                inferred: {
                    after: ["inferred"],
                    provides: ["postInferred"],
                    callback(behavior, relation) {
                        const resource = relation.remoteResource;
                        return modBehaviorForResource(behavior, resource);
                    },
                },
            },
            pgResource: {
                inferred: {
                    after: ["inferred"],
                    provides: ["postInferred"],
                    callback(behavior, resource) {
                        return modBehaviorForResource(behavior, resource);
                    },
                },
            },
            pgResourceUnique: {
                inferred: {
                    after: ["inferred"],
                    provides: ["postInferred"],
                    callback(behavior, [resource, _unique]) {
                        return modBehaviorForResource(behavior, resource);
                    },
                },
            },
        },
    },
};
function modBehaviorForResource(behavior, resource) {
    const newBehavior = [behavior];
    const { canSelect = true, canInsert = true, canUpdate = true, canDelete = true, canExecute = true, } = resource.extensions ?? {};
    if (!canExecute) {
        newBehavior.push("-queryField", "-mutationField", "-typeField", "-orderBy", "-filterBy");
    }
    if (!canSelect) {
        // TODO: just `-select` should be sufficient, but it's not because we
        // don't check it in enough places. Maybe certain behaviors should
        // require others?
        newBehavior.push("-select", "-single", "-list", "-connection", "-typeField", "-queryField", "-mutationField");
    }
    if (!canInsert) {
        newBehavior.push("-insert");
    }
    if (!canUpdate) {
        newBehavior.push("-update");
    }
    if (!canDelete) {
        newBehavior.push("-delete");
    }
    return newBehavior;
}
//# sourceMappingURL=PgRBACPlugin.js.map