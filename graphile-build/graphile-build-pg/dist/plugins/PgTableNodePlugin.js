"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgTableNodePlugin = void 0;
const tslib_1 = require("tslib");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PgTableNodePlugin = {
    name: "PgTableNodePlugin",
    description: "Add the 'Node' interface to table types",
    version: version_js_1.version,
    after: ["PgTablesPlugin", "PgPolymorphismPlugin"],
    schema: {
        behaviorRegistry: {
            add: {
                "type:node": {
                    entities: ["pgCodec"],
                    description: "should the GraphQLObjectType (`type`) this codec represents implement the GraphQL Global Object Identification specification",
                },
            },
        },
        entityBehavior: {
            pgCodec: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred"],
                    callback(behavior, codec, build) {
                        const newBehavior = [behavior];
                        if (!codec.isAnonymous &&
                            !!codec.attributes &&
                            (!codec.polymorphism ||
                                codec.polymorphism.mode === "single" ||
                                codec.polymorphism.mode === "relational")) {
                            const resource = build.pgTableResource(codec);
                            if (resource && resource.uniques?.length >= 1) {
                                if (codec.polymorphism) {
                                    newBehavior.push("interface:node");
                                }
                                else {
                                    newBehavior.push("type:node");
                                }
                            }
                            else {
                                // Meh
                            }
                        }
                        return newBehavior;
                    },
                },
            },
        },
        hooks: {
            init(_, build) {
                if (!build.registerNodeIdHandler) {
                    return _;
                }
                const { grafast: { access, constant, inhibitOnNull, list }, } = build;
                const tableResources = Object.values(build.input.pgRegistry.pgResources).filter((resource) => {
                    // TODO: if (!resourceCanSupportNode(resource)) return false;
                    // Needs the 'select' and 'node' behaviours for compatibility
                    return (!resource.parameters &&
                        !resource.isUnique &&
                        !resource.isVirtual &&
                        !!build.behavior.pgCodecMatches(resource.codec, "type:node") &&
                        !!build.behavior.pgResourceMatches(resource, "resource:select"));
                });
                const resourcesByCodec = new Map();
                for (const resource of tableResources) {
                    let resourcesList = resourcesByCodec.get(resource.codec);
                    if (!resourcesList) {
                        resourcesList = [];
                        resourcesByCodec.set(resource.codec, resourcesList);
                    }
                    resourcesList.push(resource);
                }
                for (const [codec, resources] of resourcesByCodec.entries()) {
                    const tableTypeName = build.inflection.tableType(codec);
                    const meta = build.getTypeMetaByName(tableTypeName);
                    if (!meta) {
                        console.trace(`Attempted to register node handler for '${tableTypeName}' (codec=${codec.name}), but that type wasn't registered (yet)`);
                        continue;
                    }
                    if (meta.Constructor !== build.graphql.GraphQLObjectType) {
                        // Must be an interface? Skip!
                        continue;
                    }
                    if (resources.length !== 1) {
                        console.warn(`Found multiple table resources for codec '${codec.name}'; we don't currently support that but we _could_ - get in touch if you need this.`);
                        continue;
                    }
                    const pgResource = resources[0];
                    const primaryKey = pgResource.uniques.find((u) => u.isPrimary === true);
                    if (!primaryKey) {
                        continue;
                    }
                    const pk = primaryKey.attributes;
                    const identifier = 
                    // Yes, this behaviour in V4 was ridiculous. Alas.
                    build.options.pgV4UseTableNameForNodeIdentifier &&
                        pgResource.extensions?.pg?.name
                        ? build.inflection.pluralize(pgResource.extensions.pg.name)
                        : tableTypeName;
                    const clean = (0, tamedevil_1.isSafeObjectPropertyName)(identifier) &&
                        pk.every((attributeName) => (0, tamedevil_1.isSafeObjectPropertyName)(attributeName));
                    const firstSource = resources.find((s) => !s.parameters);
                    build.registerNodeIdHandler({
                        typeName: tableTypeName,
                        codec: build.getNodeIdCodec("base64JSON"),
                        deprecationReason: (0, utils_js_1.tagToString)(codec.extensions?.tags?.deprecation ??
                            firstSource?.extensions?.tags?.deprecated),
                        plan: clean
                            ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (list, constant) {
  return $record => list([constant(${tamedevil_1.default.lit(identifier)}, false), ${tamedevil_1.default.join(pk.map((attributeName) => (0, tamedevil_1.default) `$record.get(${tamedevil_1.default.lit(attributeName)})`), ", ")}]);
}`, [list, constant])
                            : (0, graphile_build_1.EXPORTABLE)((constant, identifier, list, pk) => ($record) => {
                                return list([
                                    constant(identifier, false),
                                    ...pk.map((attribute) => $record.get(attribute)),
                                ]);
                            }, [constant, identifier, list, pk]),
                        getSpec: clean
                            ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (access, inhibitOnNull) {
  return $list => ({ ${tamedevil_1.default.join(pk.map((attributeName, index) => (0, tamedevil_1.default) `${tamedevil_1.default.safeKeyOrThrow(attributeName)}: inhibitOnNull(access($list, [${tamedevil_1.default.lit(index + 1)}]))`), ", ")} });
}`, [access, inhibitOnNull])
                            : (0, graphile_build_1.EXPORTABLE)((access, inhibitOnNull, pk) => ($list) => {
                                const spec = pk.reduce((memo, attribute, index) => {
                                    memo[attribute] = inhibitOnNull(access($list, [index + 1]));
                                    return memo;
                                }, Object.create(null));
                                return spec;
                            }, [access, inhibitOnNull, pk]),
                        getIdentifiers: (0, graphile_build_1.EXPORTABLE)(() => (value) => value.slice(1), []),
                        get: (0, graphile_build_1.EXPORTABLE)((pgResource) => (spec) => pgResource.get(spec), [pgResource]),
                        match: (0, graphile_build_1.EXPORTABLE)((identifier) => (obj) => {
                            return obj[0] === identifier;
                        }, [identifier]),
                    });
                }
                return _;
            },
        },
    },
};
//# sourceMappingURL=PgTableNodePlugin.js.map