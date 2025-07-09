"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgBasicsPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const graphile_build_1 = require("graphile-build");
const behavior_js_1 = require("../behavior.js");
const inputUtils_js_1 = require("../inputUtils.js");
const version_js_1 = require("../version.js");
const FILTER_DEF = {
    description: "can we filter this resource/codec",
    entities: ["pgCodec", "pgResource"],
};
exports.PgBasicsPlugin = {
    name: "PgBasicsPlugin",
    description: "Basic utilities required by many other graphile-build-pg plugins.",
    version: version_js_1.version,
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgBasics",
        helpers: {
            identifier(info, ...parts) {
                const { sql, graphileBuild: { EXPORTABLE }, } = info.lib;
                switch (info.options.pgIdentifiers) {
                    case "unqualified": {
                        // strip the schema
                        const [, ...partsWithoutSchema] = parts;
                        return EXPORTABLE((partsWithoutSchema, sql) => sql.identifier(...partsWithoutSchema), [partsWithoutSchema, sql]);
                    }
                    case "qualified":
                    case undefined: {
                        return EXPORTABLE((parts, sql) => sql.identifier(...parts), [parts, sql]);
                    }
                    default: {
                        throw new Error(`Setting preset.gather.pgIdentifiers had unsupported value '${info.options.pgIdentifiers}'; please use a supported value: 'qualified' or 'unqualified'.`);
                    }
                }
            },
        },
    }),
    schema: {
        globalBehavior: ["connection", "-list"],
        behaviorRegistry: {
            add: {
                select: {
                    description: "can select this resource/column/etc. Note this does not necessarily mean you can do `select * from users` but it might mean that it's possible to see details about a `users` when it's returned by a function or similar. (In this case the `codec` has `select` but the `resource` has `-select`.)",
                    entities: [
                        "pgCodec",
                        "pgCodecAttribute",
                        "pgCodecRelation",
                        "pgResource",
                    ],
                },
                insert: {
                    description: "can insert into this resource/column/etc",
                    entities: [],
                },
                update: {
                    description: "can update a record in a resource/a column/etc",
                    entities: [],
                },
                delete: {
                    description: "can delete a record in a resource",
                    entities: [],
                },
                base: {
                    description: 'should we add this attribute to the "base" input type?',
                    entities: [],
                },
                filter: FILTER_DEF,
                "query:resource:list:filter": FILTER_DEF,
                "query:resource:connection:filter": FILTER_DEF,
                "manyRelation:resource:list:filter": FILTER_DEF,
                "manyRelation:resource:connection:filter": FILTER_DEF,
                "singularRelation:resource:list:filter": FILTER_DEF,
                "singularRelation:resource:connection:filter": FILTER_DEF,
                "typeField:resource:list:filter": FILTER_DEF,
                "typeField:resource:connection:filter": FILTER_DEF,
                "queryField:resource:list:filter": FILTER_DEF,
                "queryField:resource:connection:filter": FILTER_DEF,
                filterBy: { description: "can we filter by this thing?", entities: [] },
                order: {
                    description: "can we order these results?",
                    entities: ["pgCodec", "pgResource"],
                },
                orderBy: {
                    description: "can we order by this thing?",
                    entities: ["pgCodecAttribute", "pgResource" /* < computed column */],
                },
                connection: {
                    description: "should we use a connection field for this?",
                    entities: [
                        "pgCodec",
                        "pgCodecRelation",
                        "pgResource",
                        "pgResourceUnique",
                    ],
                },
                list: {
                    description: "should we use a list field for this?",
                    entities: [
                        "pgCodec",
                        "pgCodecRelation",
                        "pgResource",
                        "pgResourceUnique",
                    ],
                },
                "resource:connection": {
                    description: "should we use a connection field for this?",
                    entities: [
                        "pgCodec",
                        "pgCodecRelation",
                        "pgResource",
                        "pgResourceUnique",
                    ],
                },
                "resource:list": {
                    description: "should we use a list field for this?",
                    entities: [
                        "pgCodec",
                        "pgCodecRelation",
                        "pgResource",
                        "pgResourceUnique",
                    ],
                },
                "resource:array": {
                    description: "should we use a list field for this non-connection-capable thing?",
                    entities: ["pgCodec", "pgResource", "pgResourceUnique"],
                },
                "resource:single": {
                    description: "can we get one of this thing?",
                    entities: [
                        "pgCodec",
                        "pgCodecRelation",
                        "pgResource",
                        "pgResourceUnique",
                    ],
                },
            },
        },
        entityBehavior: {
            pgCodec: {
                override(behavior, codec) {
                    return [behavior, (0, behavior_js_1.getBehavior)(codec.extensions)];
                },
            },
            pgCodecAttribute: {
                override(behavior, [codec, attributeName]) {
                    if (typeof attributeName !== "string") {
                        throw new Error(`pgCodecAttribute no longer accepts (codec, attribute) - it now accepts (codec, attributeName). Please update your code. Sorry! (Changed in PostGraphile V5 alpha 13.)`);
                    }
                    const attribute = codec.attributes[attributeName];
                    return [
                        behavior,
                        (0, behavior_js_1.getBehavior)([attribute.codec.extensions, attribute.extensions]),
                    ];
                },
            },
            pgResource: {
                override(behavior, resource) {
                    return [
                        behavior,
                        (0, behavior_js_1.getBehavior)(resource.parameters
                            ? // Functions should not inherit from their codec
                                [resource.extensions]
                            : [resource.codec.extensions, resource.extensions]),
                    ];
                },
            },
            pgResourceUnique: {
                override(behavior, [resource, unique]) {
                    return [
                        behavior,
                        (0, behavior_js_1.getBehavior)([
                            resource.codec.extensions,
                            resource.extensions,
                            unique.extensions,
                        ]),
                    ];
                },
            },
            pgCodecRelation: {
                override(behavior, relationSpec) {
                    return [
                        behavior,
                        // The behavior is the relation behavior PLUS the remote table
                        // behavior. But the relation settings win.
                        (0, behavior_js_1.getBehavior)([
                            relationSpec.remoteResource.codec.extensions,
                            relationSpec.remoteResource.extensions,
                            relationSpec.extensions,
                        ]),
                    ];
                },
            },
            pgCodecRef: {
                override(behavior, [codec, refName]) {
                    const ref = codec.refs?.[refName];
                    if (!ref) {
                        throw new Error(`Codec ${codec.name} has no ref '${refName}'`);
                    }
                    return [
                        behavior,
                        (0, behavior_js_1.getBehavior)([ref.definition.extensions, ref.extensions]),
                    ];
                },
            },
            pgRefDefinition: {
                override(behavior, refSpec) {
                    return [behavior, (0, behavior_js_1.getBehavior)(refSpec.extensions)];
                },
            },
        },
        hooks: {
            build(build) {
                const { graphql: { GraphQLList, GraphQLNonNull }, lib: { dataplanPg, sql }, } = build;
                const pgCodecMetaLookup = (0, inputUtils_js_1.getCodecMetaLookupFromInput)(build.input);
                const getGraphQLTypeNameByPgCodec = (codec, situation) => {
                    if (codec.arrayOfCodec) {
                        throw new Error("Do not use getGraphQLTypeNameByPgCodec with an array type, find the underlying type instead");
                    }
                    const meta = pgCodecMetaLookup.get(codec);
                    if (!meta) {
                        throw new Error(`Codec '${codec.name}' does not have an entry in pgCodecMetaLookup, someone needs to call setGraphQLTypeForPgCodec passing this codec.`);
                    }
                    const typeName = meta.typeNameBySituation[situation] ?? null;
                    return typeName ?? null;
                };
                const getGraphQLTypeByPgCodec = (codec, situation) => {
                    if (!build.status.isInitPhaseComplete) {
                        throw new Error(`Calling build.getGraphQLTypeByPgCodec before the 'init' phase has completed is not allowed.`);
                    }
                    if (codec.arrayOfCodec) {
                        const type = getGraphQLTypeByPgCodec(codec.arrayOfCodec, situation);
                        const nonNull = codec.extensions?.listItemNonNull;
                        return type
                            ? new GraphQLList(nonNull ? new GraphQLNonNull(type) : type)
                            : null;
                    }
                    const typeName = getGraphQLTypeNameByPgCodec(codec, situation);
                    return typeName ? (build.getTypeByName(typeName) ?? null) : null;
                };
                const hasGraphQLTypeForPgCodec = (codec, situation) => {
                    const meta = pgCodecMetaLookup.get(codec);
                    if (!meta) {
                        return false;
                    }
                    if (situation != null) {
                        const typeName = meta.typeNameBySituation[situation] ?? null;
                        return typeName != null;
                    }
                    else {
                        return Object.keys(meta.typeNameBySituation).length > 0;
                    }
                };
                const setGraphQLTypeForPgCodec = (codec, variants, typeName) => {
                    build.assertTypeName(typeName);
                    let meta = pgCodecMetaLookup.get(codec);
                    if (!meta) {
                        meta = (0, inputUtils_js_1.makePgCodecMeta)(codec);
                        pgCodecMetaLookup.set(codec, meta);
                    }
                    const situations_ = Array.isArray(variants) ? variants : [variants];
                    for (const situation of situations_) {
                        if (meta.typeNameBySituation[situation] != null) {
                            // TODO: allow this?
                            throw new Error("Type already set");
                        }
                        meta.typeNameBySituation[situation] = typeName;
                    }
                };
                const resourceByCodecCacheUnstrict = new Map();
                const resourceByCodecCacheStrict = new Map();
                const pgTableResource = (codec, strict = true) => {
                    const resourceByCodecCache = strict
                        ? resourceByCodecCacheStrict
                        : resourceByCodecCacheUnstrict;
                    if (resourceByCodecCache.has(codec)) {
                        return resourceByCodecCache.get(codec);
                    }
                    const resources = Object.values(build.input.pgRegistry.pgResources).filter((r) => r.codec === codec &&
                        !r.parameters &&
                        r.executor === codec.executor &&
                        (!strict || (!r.isVirtual && !r.isUnique)));
                    if (resources.length < 1) {
                        resourceByCodecCache.set(codec, null);
                        return null;
                    }
                    else if (resources.length > 1) {
                        console.warn(`[WARNING]: detected more than one table-like resource for codec '${codec.name}'; returning nothing to avoid ambiguity.`);
                        resourceByCodecCache.set(codec, null);
                        return null;
                    }
                    else {
                        resourceByCodecCache.set(codec, resources[0]);
                        return resources[0];
                    }
                };
                return build.extend(build, {
                    versions: build.extend(build.versions, {
                        "graphile-build-pg": version_js_1.version,
                        "@dataplan/pg": dataplanPg.version,
                    }, "Adding graphile-build-pg and @dataplan/pg version to build.versions"),
                    dataplanPg,
                    pgCodecMetaLookup,
                    getGraphQLTypeNameByPgCodec,
                    getGraphQLTypeByPgCodec,
                    hasGraphQLTypeForPgCodec,
                    setGraphQLTypeForPgCodec,
                    sql,
                    pgGetBehavior: behavior_js_1.getBehavior,
                    // For slightly better backwards compatibility with v4.
                    pgSql: sql,
                    pgTableResource,
                }, "Adding helpers from PgBasicsPlugin");
            },
        },
    },
};
//# sourceMappingURL=PgBasicsPlugin.js.map