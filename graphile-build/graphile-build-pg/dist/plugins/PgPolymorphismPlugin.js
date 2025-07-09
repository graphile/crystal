"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPolymorphismPlugin = void 0;
const tslib_1 = require("tslib");
require("graphile-config");
require("./PgCodecsPlugin.js");
require("./PgProceduresPlugin.js");
require("./PgRelationsPlugin.js");
require("./PgTablesPlugin.js");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const behavior_js_1 = require("../behavior.js");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
function isNotNullish(v) {
    return v != null;
}
function parseAttribute(colSpec) {
    let spec = colSpec;
    let isNotNull = false;
    if (spec.endsWith("!")) {
        spec = spec.substring(0, spec.length - 1);
        isNotNull = true;
    }
    const [a, b] = spec.split(">");
    return {
        attribute: a,
        isNotNull,
        rename: b,
    };
}
const EMPTY_OBJECT = Object.freeze({});
exports.PgPolymorphismPlugin = {
    name: "PgPolymorphismPlugin",
    description: "Adds polymorphism",
    version: version_js_1.version,
    after: ["smart-tags", "PgTablesPlugin", "PgCodecsPlugin", "PgBasicsPlugin"],
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgPolymorphism",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState() {
            return EMPTY_OBJECT;
        },
        helpers: {},
        hooks: {
            async pgCodecs_recordType_spec(info, event) {
                const { pgClass, spec, serviceName } = event;
                const extensions = spec.extensions ?? Object.create(null);
                if (!spec.extensions) {
                    spec.extensions = extensions;
                }
                const interfaceTag = extensions.tags.interface ?? pgClass.getTags().interface;
                if (interfaceTag) {
                    if (typeof interfaceTag !== "string") {
                        throw new Error("Invalid 'interface' smart tag; string expected. Did you add too many?");
                    }
                    const { params } = (0, utils_js_1.parseSmartTagsOptsString)(interfaceTag, 0);
                    switch (params.mode) {
                        case "single": {
                            const { type = "type" } = params;
                            const attr = pgClass.getAttribute({ name: type });
                            if (!attr) {
                                throw new Error(`Invalid '@interface' smart tag - there is no '${type}' attribute on ${pgClass.getNamespace().nspname}.${pgClass.relname}`);
                            }
                            const rawTypeTags = extensions.tags.type;
                            const typeTags = Array.isArray(rawTypeTags)
                                ? rawTypeTags.map((t) => String(t))
                                : [String(rawTypeTags)];
                            const attributeNames = pgClass
                                .getAttributes()
                                .filter((a) => a.attnum >= 1)
                                .map((a) => a.attname);
                            const types = Object.create(null);
                            const specificAttributes = new Set();
                            for (const typeTag of typeTags) {
                                const { args: [typeValue], params: { name, attributes }, } = (0, utils_js_1.parseSmartTagsOptsString)(typeTag, 1);
                                if (!name) {
                                    throw new Error(`Every type must have a name`);
                                }
                                types[typeValue] = {
                                    name,
                                    attributes: attributes?.split(",").map(parseAttribute) ?? [],
                                };
                                for (const col of types[typeValue].attributes) {
                                    specificAttributes.add(col.attribute);
                                }
                            }
                            const commonAttributes = attributeNames.filter((n) => !specificAttributes.has(n));
                            spec.polymorphism = {
                                mode: "single",
                                commonAttributes,
                                typeAttributes: [type],
                                types,
                            };
                            break;
                        }
                        case "relational": {
                            const { type = "type" } = params;
                            const attr = pgClass.getAttribute({ name: type });
                            if (!attr) {
                                throw new Error(`Invalid '@interface' smart tag - there is no '${type}' attribute on ${pgClass.getNamespace().nspname}.${pgClass.relname}`);
                            }
                            const rawTypeTags = extensions.tags.type;
                            const typeTags = Array.isArray(rawTypeTags)
                                ? rawTypeTags.map((t) => String(t))
                                : [String(rawTypeTags)];
                            const types = Object.create(null);
                            for (const typeTag of typeTags) {
                                const { args: [typeValue], params: { references }, } = (0, utils_js_1.parseSmartTagsOptsString)(typeTag, 1);
                                if (!references) {
                                    throw new Error(`@type of an @interface(mode:relational) must have a 'references:' parameter`);
                                }
                                const [namespaceName, tableName] = (0, utils_js_1.parseDatabaseIdentifier)(references, 2, pgClass.getNamespace()?.nspname);
                                const referencedClass = await info.helpers.pgIntrospection.getClassByName(serviceName, namespaceName, tableName);
                                if (!referencedClass) {
                                    throw new Error(`Could not find referenced class '${namespaceName}.${tableName}'`);
                                }
                                const pk = pgClass
                                    .getConstraints()
                                    .find((c) => c.contype === "p");
                                const remotePk = referencedClass
                                    .getConstraints()
                                    .find((c) => c.contype === "p");
                                if (!pk || !remotePk) {
                                    throw new Error("Could not build polymorphic reference due to missing primary key");
                                }
                                const pgConstraint = referencedClass
                                    .getConstraints()
                                    .find((c) => c.contype === "f" &&
                                    c.confrelid === pgClass._id &&
                                    (0, grafast_1.arraysMatch)(c.getAttributes(), remotePk.getAttributes()) &&
                                    (0, grafast_1.arraysMatch)(c.getForeignAttributes(), pk.getAttributes()));
                                if (!pgConstraint) {
                                    throw new Error(`Could not build polymorphic reference from '${pgClass.getNamespace()?.nspname}.${pgClass.relname}' to '${referencedClass.getNamespace()?.nspname}.${referencedClass.relname}' due to missing foreign key constraint. Please create a foreign key constraint on the latter table's primary key, pointing to the former table.`);
                                }
                                const codec = (await info.helpers.pgCodecs.getCodecFromClass(serviceName, referencedClass._id));
                                if (!codec.extensions) {
                                    codec.extensions = Object.create(null);
                                }
                                codec.extensions.relationalInterfaceCodecName = spec.name;
                                types[typeValue] = {
                                    name: info.inflection.tableType(codec),
                                    references,
                                    relationName: info.inflection.resourceRelationName({
                                        serviceName,
                                        isReferencee: true,
                                        isUnique: true,
                                        localClass: pgClass,
                                        localAttributes: pk.getAttributes(),
                                        foreignClass: referencedClass,
                                        foreignAttributes: remotePk.getAttributes(),
                                        pgConstraint,
                                    }),
                                };
                            }
                            spec.polymorphism = {
                                mode: "relational",
                                typeAttributes: [type],
                                types,
                            };
                            break;
                        }
                        case "union": {
                            spec.polymorphism = {
                                mode: "union",
                            };
                            break;
                        }
                        default: {
                            throw new Error(`Unsupported (or not provided) @interface mode`);
                        }
                    }
                }
            },
            async pgRegistry_PgRegistryBuilder_finalize(info, event) {
                const { registryBuilder } = event;
                const registryConfig = registryBuilder.getRegistryConfig();
                for (const resource of Object.values(registryConfig.pgResources)) {
                    if (resource.parameters || !resource.codec.attributes) {
                        continue;
                    }
                    if (!resource.extensions?.pg) {
                        continue;
                    }
                    const { schemaName: resourceSchemaName, serviceName, name: resourceClassName, } = resource.extensions.pg;
                    const pgClass = await info.helpers.pgIntrospection.getClassByName(serviceName, resourceSchemaName, resourceClassName);
                    if (!pgClass) {
                        continue;
                    }
                    const poly = resource.codec.polymorphism;
                    if (poly?.mode === "relational") {
                        // Copy common attributes to implementations
                        for (const spec of Object.values(poly.types)) {
                            const [schemaName, tableName] = (0, utils_js_1.parseDatabaseIdentifier)(spec.references, 2, resourceSchemaName);
                            const pgRelatedClass = await info.helpers.pgIntrospection.getClassByName(serviceName, schemaName, tableName);
                            if (!pgRelatedClass) {
                                throw new Error(`Invalid reference to '${spec.references}' - cannot find that table (${schemaName}.${tableName})`);
                            }
                            const otherCodec = await info.helpers.pgCodecs.getCodecFromClass(serviceName, pgRelatedClass._id);
                            if (!otherCodec || !otherCodec.attributes) {
                                continue;
                            }
                            const pk = pgRelatedClass
                                .getConstraints()
                                .find((c) => c.contype === "p");
                            if (!pk) {
                                throw new Error(`Invalid polymorphic relation; ${pgRelatedClass.relname} has no primary key`);
                            }
                            const remotePk = pgClass
                                .getConstraints()
                                .find((c) => c.contype === "p");
                            if (!remotePk) {
                                throw new Error(`Invalid polymorphic relation; ${pgClass.relname} has no primary key`);
                            }
                            const pgConstraint = pgRelatedClass
                                .getConstraints()
                                .find((c) => c.contype === "f" &&
                                c.confrelid === pgClass._id &&
                                (0, grafast_1.arraysMatch)(c.getForeignAttributes(), remotePk.getAttributes()) &&
                                (0, grafast_1.arraysMatch)(c.getAttributes(), pk.getAttributes()));
                            if (!pgConstraint) {
                                throw new Error(`Invalid polymorphic relation; could not find matching relation between ${pgClass.relname} and ${pgRelatedClass.relname}`);
                            }
                            const sharedRelationName = info.inflection.resourceRelationName({
                                serviceName,
                                isReferencee: false,
                                isUnique: true,
                                localClass: pgRelatedClass,
                                localAttributes: pk.getAttributes(),
                                foreignClass: pgClass,
                                foreignAttributes: remotePk.getAttributes(),
                                pgConstraint,
                            });
                            for (const [colName, colSpec] of Object.entries(resource.codec.attributes)) {
                                if (otherCodec.attributes[colName]) {
                                    otherCodec.attributes[colName].identicalVia =
                                        sharedRelationName;
                                }
                                else {
                                    otherCodec.attributes[colName] = {
                                        codec: colSpec.codec,
                                        notNull: colSpec.notNull,
                                        hasDefault: colSpec.hasDefault,
                                        via: sharedRelationName,
                                        restrictedAccess: colSpec.restrictedAccess,
                                        description: colSpec.description,
                                        extensions: { ...colSpec.extensions },
                                    };
                                }
                            }
                        }
                    }
                }
            },
            async pgRegistry_PgRegistry(info, event) {
                // We're creating 'refs' for the polymorphism. This needs to use the
                // same relationship names as we will in the GraphQL schema, so we need
                // to use the final PgRegistry, not the PgRegistryBuilder.
                const { registry } = event;
                for (const rawResource of Object.values(registry.pgResources)) {
                    if (rawResource.parameters || !rawResource.codec.attributes) {
                        continue;
                    }
                    const resource = rawResource;
                    if (!resource.extensions?.pg) {
                        continue;
                    }
                    const { schemaName: resourceSchemaName, serviceName, name: resourceClassName, } = resource.extensions.pg;
                    const pgClass = await info.helpers.pgIntrospection.getClassByName(serviceName, resourceSchemaName, resourceClassName);
                    if (!pgClass) {
                        continue;
                    }
                    const relations = registry.pgRelations[resource.codec.name];
                    const poly = resource.codec.polymorphism;
                    if (poly?.mode === "relational") {
                        const polyRelationNames = Object.values(poly.types).map((t) => t.relationName);
                        // Copy common attributes to implementations
                        for (const spec of Object.values(poly.types)) {
                            const [schemaName, tableName] = (0, utils_js_1.parseDatabaseIdentifier)(spec.references, 2, resourceSchemaName);
                            const pgRelatedClass = await info.helpers.pgIntrospection.getClassByName(serviceName, schemaName, tableName);
                            if (!pgRelatedClass) {
                                throw new Error(`Invalid reference to '${spec.references}' - cannot find that table (${schemaName}.${tableName})`);
                            }
                            const otherCodec = await info.helpers.pgCodecs.getCodecFromClass(serviceName, pgRelatedClass._id);
                            if (!otherCodec) {
                                continue;
                            }
                            const pk = pgRelatedClass
                                .getConstraints()
                                .find((c) => c.contype === "p");
                            if (!pk) {
                                throw new Error(`Invalid polymorphic relation; ${pgRelatedClass.relname} has no primary key`);
                            }
                            const remotePk = pgClass
                                .getConstraints()
                                .find((c) => c.contype === "p");
                            if (!remotePk) {
                                throw new Error(`Invalid polymorphic relation; ${pgClass.relname} has no primary key`);
                            }
                            const pgConstraint = pgRelatedClass
                                .getConstraints()
                                .find((c) => c.contype === "f" &&
                                c.confrelid === pgClass._id &&
                                (0, grafast_1.arraysMatch)(c.getForeignAttributes(), remotePk.getAttributes()) &&
                                (0, grafast_1.arraysMatch)(c.getAttributes(), pk.getAttributes()));
                            if (!pgConstraint) {
                                throw new Error(`Invalid polymorphic relation; could not find matching relation between ${pgClass.relname} and ${pgRelatedClass.relname}`);
                            }
                            const sharedRelationName = info.inflection.resourceRelationName({
                                serviceName,
                                isReferencee: false,
                                isUnique: true,
                                localClass: pgRelatedClass,
                                localAttributes: pk.getAttributes(),
                                foreignClass: pgClass,
                                foreignAttributes: remotePk.getAttributes(),
                                pgConstraint,
                            });
                            const otherResourceOptions = await info.helpers.pgTables.getResourceOptions(serviceName, pgRelatedClass);
                            for (const [relationName, relationSpec] of Object.entries(relations)) {
                                // Skip over the polymorphic relations
                                if (polyRelationNames.includes(relationName))
                                    continue;
                                // TODO: normally we wouldn't call `getBehavior` anywhere
                                // except in an entityBehavior definition... Should this be
                                // solved a different way?
                                const behavior = (0, behavior_js_1.getBehavior)([
                                    relationSpec.remoteResource.codec.extensions,
                                    relationSpec.remoteResource.extensions,
                                    relationSpec.extensions,
                                ]);
                                const relationDetails = {
                                    registry: resource.registry,
                                    codec: resource.codec,
                                    relationName,
                                };
                                const singleRecordFieldName = relationSpec.isReferencee
                                    ? info.inflection.singleRelationBackwards(relationDetails)
                                    : info.inflection.singleRelation(relationDetails);
                                const connectionFieldName = info.inflection.manyRelationConnection(relationDetails);
                                const listFieldName = info.inflection.manyRelationList(relationDetails);
                                const definition = {
                                    singular: relationSpec.isUnique,
                                    singleRecordFieldName,
                                    listFieldName,
                                    connectionFieldName,
                                    extensions: {
                                        tags: {
                                            behavior,
                                        },
                                    },
                                };
                                const ref = {
                                    definition,
                                    paths: [
                                        [
                                            {
                                                relationName: sharedRelationName,
                                            },
                                            { relationName },
                                        ],
                                    ],
                                };
                                if (!otherResourceOptions.codec.refs) {
                                    otherResourceOptions.codec.refs = Object.create(null);
                                }
                                otherResourceOptions.codec.refs[relationName] = ref;
                            }
                        }
                    }
                }
            },
        },
    }),
    schema: {
        behaviorRegistry: {
            add: {
                "interface:node": {
                    description: "should this codec representing a polymorphic interface implement the Node interface?",
                    entities: ["pgCodec"],
                },
            },
        },
        entityBehavior: {
            pgCodec: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred", "override"],
                    callback(behavior, codec) {
                        return [
                            "select",
                            "table",
                            ...(!codec.isAnonymous
                                ? ["insert", "update"]
                                : []),
                            behavior,
                        ];
                    },
                },
            },
            pgCodecRelation: {
                inferred: {
                    provides: ["inferred"],
                    after: ["default", "PgRelationsPlugin"],
                    callback(behavior, entity, build) {
                        const { input: { pgRegistry: { pgRelations }, }, grafast: { arraysMatch }, } = build;
                        const { localCodec, remoteResource, isUnique, isReferencee } = entity;
                        const remoteCodec = remoteResource.codec;
                        // Hide relation from a concrete type back to the abstract root table.
                        if (isUnique &&
                            !isReferencee &&
                            remoteCodec.polymorphism?.mode === "relational") {
                            const localTypeName = build.inflection.tableType(localCodec);
                            const polymorphicTypeDefinitionEntry = Object.entries(remoteCodec.polymorphism.types).find(([, val]) => val.name === localTypeName);
                            if (polymorphicTypeDefinitionEntry) {
                                const [, { relationName }] = polymorphicTypeDefinitionEntry;
                                const relation = pgRelations[remoteCodec.name]?.[relationName];
                                if (arraysMatch(relation.remoteAttributes, entity.localAttributes)) {
                                    return [behavior, "-connection", "-list", "-single"];
                                }
                            }
                        }
                        // Hide relation from abstract root table to related elements
                        if (isReferencee &&
                            localCodec.polymorphism?.mode === "relational") {
                            const relations = Object.values(localCodec.polymorphism.types).map((t) => pgRelations[localCodec.name]?.[t.relationName]);
                            if (relations.includes(entity)) {
                                return [behavior, "-connection", "-list", "-single"];
                            }
                        }
                        return behavior;
                    },
                },
            },
            pgCodecAttribute: {
                inferred(behavior, [codec, attributeName], build) {
                    // If this is the primary key of a related table of a
                    // `@interface mode:relational` table, then omit it from the schema
                    const tbl = build.pgTableResource(codec);
                    if (tbl) {
                        const pk = tbl.uniques.find((u) => u.isPrimary);
                        if (pk && pk.attributes.includes(attributeName)) {
                            const fkeys = Object.values(tbl.getRelations()).filter((r) => (0, grafast_1.arraysMatch)(r.localAttributes, pk.attributes));
                            const myName = build.inflection.tableType(codec);
                            for (const fkey of fkeys) {
                                if (fkey.remoteResource.codec.polymorphism?.mode ===
                                    "relational" &&
                                    Object.values(fkey.remoteResource.codec.polymorphism.types).find((t) => t.name === myName) &&
                                    !fkey.remoteResource.codec.attributes[attributeName]) {
                                    return [
                                        behavior,
                                        "-attribute:select",
                                        "-attribute:update",
                                        "-attribute:filterBy",
                                        "-attribute:orderBy",
                                    ];
                                }
                            }
                        }
                    }
                    return behavior;
                },
            },
            pgResource: {
                inferred(behavior, resource, build) {
                    // Disable insert/update/delete on relational tables
                    const newBehavior = [behavior];
                    if (!resource.parameters &&
                        !resource.isUnique &&
                        !resource.isVirtual) {
                        if (resource.codec.polymorphism) {
                            // This is a polymorphic type
                            newBehavior.push("-resource:insert", "-resource:update", "-resource:delete");
                        }
                        else {
                            const resourceTypeName = build.inflection.tableType(resource.codec);
                            const relations = resource.getRelations();
                            const pk = resource.uniques?.find((u) => u.isPrimary);
                            if (pk) {
                                const remotePkAttributes = pk.attributes;
                                const pkRelations = Object.values(relations).filter((r) => (0, grafast_1.arraysMatch)(r.localAttributes, remotePkAttributes));
                                if (pkRelations.some((r) => r.remoteResource.codec.polymorphism?.mode ===
                                    "relational" &&
                                    Object.values(r.remoteResource.codec.polymorphism.types).some((t) => t.name === resourceTypeName))) {
                                    // This is part of a relational polymorphic type
                                    newBehavior.push("-resource:insert", "-resource:update", "-resource:delete");
                                }
                            }
                        }
                    }
                    return newBehavior;
                },
            },
        },
        hooks: {
            build(build) {
                const { input, inflection } = build;
                const pgRegistry = input.pgRegistry;
                const pgResourcesByPolymorphicTypeName = Object.create(null);
                const allResources = Object.values(pgRegistry.pgResources);
                for (const resource of allResources) {
                    if (resource.parameters)
                        continue;
                    if (typeof resource.from === "function")
                        continue;
                    if (!resource.codec.extensions?.tags)
                        continue;
                    const { implements: implementsTag } = resource.codec.extensions.tags;
                    /*
                    const { unionMember } = resource.codec.extensions.tags;
                    if (unionMember) {
                      const unions = Array.isArray(unionMember)
                        ? unionMember
                        : [unionMember];
                      for (const union of unions) {
                        if (!resourcesByPolymorphicTypeName[union]) {
                          resourcesByPolymorphicTypeName[union] = {
                            resources: [resource as PgResource],
                            type: "union",
                          };
                        } else {
                          if (resourcesByPolymorphicTypeName[union].type !== "union") {
                            throw new Error(`Inconsistent polymorphism`);
                          }
                          resourcesByPolymorphicTypeName[union].resources.push(
                            resource as PgResource,
                          );
                        }
                      }
                    }
                    */
                    if (implementsTag) {
                        const interfaces = Array.isArray(implementsTag)
                            ? implementsTag
                            : [implementsTag];
                        for (const interfaceName of interfaces) {
                            if (!pgResourcesByPolymorphicTypeName[interfaceName]) {
                                pgResourcesByPolymorphicTypeName[interfaceName] = {
                                    resources: [resource],
                                    type: "interface",
                                };
                            }
                            else {
                                if (pgResourcesByPolymorphicTypeName[interfaceName].type !==
                                    "interface") {
                                    throw new Error(`Inconsistent polymorphism`);
                                }
                                pgResourcesByPolymorphicTypeName[interfaceName].resources.push(resource);
                            }
                        }
                    }
                }
                const pgCodecByPolymorphicUnionModeTypeName = Object.create(null);
                for (const codec of Object.values(pgRegistry.pgCodecs)) {
                    if (!codec.polymorphism)
                        continue;
                    if (codec.polymorphism.mode !== "union")
                        continue;
                    const interfaceTypeName = inflection.tableType(codec);
                    pgCodecByPolymorphicUnionModeTypeName[interfaceTypeName] = codec;
                    // Explicitly allow zero implementations.
                    if (!pgResourcesByPolymorphicTypeName[interfaceTypeName]) {
                        pgResourcesByPolymorphicTypeName[interfaceTypeName] = {
                            resources: [],
                            type: "interface",
                        };
                    }
                }
                return build.extend(build, {
                    pgResourcesByPolymorphicTypeName,
                    pgCodecByPolymorphicUnionModeTypeName,
                    nodeIdHelpersForCodec(codec) {
                        const table = build.pgTableResource(codec);
                        if (!table) {
                            return null;
                        }
                        const tablePk = table.uniques.find((u) => u.isPrimary);
                        if (!tablePk) {
                            return null;
                        }
                        const tablePkAttributes = tablePk.attributes;
                        if (codec.polymorphism?.mode === "relational") {
                            const details = [];
                            for (const spec of Object.values(codec.polymorphism.types)) {
                                const relation = table.getRelation(spec.relationName);
                                const typeName = build.inflection.tableType(relation.remoteResource.codec);
                                const handler = build.getNodeIdHandler?.(typeName);
                                if (!handler) {
                                    return null;
                                }
                                const pk = relation.remoteResource.uniques.find((u) => u.isPrimary);
                                if (!pk) {
                                    return null;
                                }
                                details.push({
                                    remotePkAttributes: pk.attributes,
                                    handler,
                                });
                            }
                            const handlers = details.map((d) => d.handler);
                            return {
                                getSpec: makeGetRelationalSpec(details, tablePkAttributes),
                                getIdentifiers: makeGetIdentifiers(handlers),
                            };
                        }
                        else if (codec.polymorphism?.mode === "single") {
                            // Lots of type names, but they all relate to the same table
                            const handlers = [];
                            for (const spec of Object.values(codec.polymorphism.types)) {
                                const typeName = spec.name;
                                const handler = build.getNodeIdHandler?.(typeName);
                                if (!handler) {
                                    return null;
                                }
                                handlers.push(handler);
                            }
                            return {
                                getSpec: makeGetSingleSpec(handlers, tablePkAttributes),
                                getIdentifiers: makeGetIdentifiers(handlers),
                            };
                        }
                        else if (codec.polymorphism) {
                            throw new Error(`Don't know how to get the spec for nodeId for codec with polymorphism mode '${codec.polymorphism.mode}'`);
                        }
                        else {
                            const typeName = build.inflection.tableType(codec);
                            const handler = build.getNodeIdHandler?.(typeName);
                            const { specForHandler } = build;
                            if (!handler || !specForHandler) {
                                return null;
                            }
                            return {
                                getSpec: (0, graphile_build_1.EXPORTABLE)((handler, lambda, specForHandler) => ($nodeId) => {
                                    // TODO: should change this to a common method like
                                    // `const $decoded = getDecodedNodeIdForHandler(handler, $nodeId)`
                                    const $decoded = lambda($nodeId, specForHandler(handler));
                                    return handler.getSpec($decoded);
                                }, [handler, grafast_1.lambda, specForHandler]),
                                getIdentifiers: makeGetIdentifiers([handler]),
                            };
                        }
                    },
                    nodeIdSpecForCodec(codec) {
                        const helpers = build.nodeIdHelpersForCodec(codec);
                        return helpers ? helpers.getSpec : null;
                    },
                }, "Adding PgPolmorphismPlugin helpers to Build");
            },
            init(_, build, _context) {
                const { inflection, options: { pgForbidSetofFunctionsToReturnNull }, setGraphQLTypeForPgCodec, grafast: { list, constant, access, inhibitOnNull }, } = build;
                const unionsToRegister = new Map();
                for (const codec of build.pgCodecMetaLookup.keys()) {
                    if (!codec.attributes) {
                        // Only apply to codecs that define attributes
                        continue;
                    }
                    // We're going to scan for interfaces, and then unions. Each block is
                    // separately recoverable so an interface failure doesn't cause
                    // unions to fail.
                    // Detect interface
                    build.recoverable(null, () => {
                        const polymorphism = codec.polymorphism;
                        if (!polymorphism) {
                            // Don't build polymorphic types as objects
                            return;
                        }
                        const isTable = build.behavior.pgCodecMatches(codec, "table");
                        if (!isTable || codec.isAnonymous) {
                            return;
                        }
                        const selectable = build.behavior.pgCodecMatches(codec, "select");
                        if (selectable) {
                            if (polymorphism.mode === "single" ||
                                polymorphism.mode === "relational") {
                                const nodeable = build.behavior.pgCodecMatches(codec, "interface:node");
                                const interfaceTypeName = inflection.tableType(codec);
                                build.registerInterfaceType(interfaceTypeName, {
                                    pgCodec: codec,
                                    isPgPolymorphicTableType: true,
                                    pgPolymorphism: polymorphism,
                                    // Since this comes from a table, if the table has the `node` interface then so should the interface
                                    supportsNodeInterface: nodeable,
                                }, () => ({
                                    description: codec.description,
                                }), `PgPolymorphismPlugin single/relational interface type for ${codec.name}`);
                                setGraphQLTypeForPgCodec(codec, ["output"], interfaceTypeName);
                                build.registerCursorConnection({
                                    typeName: interfaceTypeName,
                                    connectionTypeName: inflection.tableConnectionType(codec),
                                    edgeTypeName: inflection.tableEdgeType(codec),
                                    scope: {
                                        isPgConnectionRelated: true,
                                        pgCodec: codec,
                                    },
                                    nonNullNode: pgForbidSetofFunctionsToReturnNull,
                                });
                                const resource = build.pgTableResource(codec);
                                const primaryKey = resource
                                    ? resource.uniques.find((u) => u.isPrimary === true)
                                    : undefined;
                                const pk = primaryKey?.attributes;
                                for (const [typeIdentifier, spec] of Object.entries(polymorphism.types)) {
                                    const tableTypeName = spec.name;
                                    if (polymorphism.mode === "single" &&
                                        build.behavior.pgCodecMatches(codec, "interface:node")) {
                                        build.registerObjectType(tableTypeName, {
                                            pgCodec: codec,
                                            isPgClassType: true,
                                            pgPolymorphism: polymorphism,
                                            pgPolymorphicSingleTableType: {
                                                typeIdentifier,
                                                name: spec.name,
                                                attributes: spec.attributes,
                                            },
                                        }, () => ({
                                            assertStep: pg_1.assertPgClassSingleStep,
                                            description: codec.description,
                                            interfaces: () => [
                                                build.getTypeByName(interfaceTypeName),
                                            ],
                                        }), `PgPolymorphismPlugin single table type for ${codec.name}`);
                                        build.registerCursorConnection({
                                            typeName: tableTypeName,
                                            connectionTypeName: inflection.connectionType(tableTypeName),
                                            edgeTypeName: inflection.edgeType(tableTypeName),
                                            scope: {
                                                isPgConnectionRelated: true,
                                                pgCodec: codec,
                                            },
                                            nonNullNode: pgForbidSetofFunctionsToReturnNull,
                                        });
                                        if (build.registerNodeIdHandler && resource && pk) {
                                            const clean = (0, tamedevil_1.isSafeObjectPropertyName)(tableTypeName) &&
                                                pk.every((attributeName) => (0, tamedevil_1.isSafeObjectPropertyName)(attributeName));
                                            build.registerNodeIdHandler({
                                                typeName: tableTypeName,
                                                codec: build.getNodeIdCodec("base64JSON"),
                                                deprecationReason: (0, utils_js_1.tagToString)(codec.extensions?.tags?.deprecation ??
                                                    resource?.extensions?.tags?.deprecated),
                                                plan: clean
                                                    ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                                        (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (list, constant) {
  return $record => list([constant(${tamedevil_1.default.lit(tableTypeName)}, false), ${tamedevil_1.default.join(pk.map((attributeName) => (0, tamedevil_1.default) `$record.get(${tamedevil_1.default.lit(attributeName)})`), ", ")}]);
}`, [list, constant])
                                                    : (0, graphile_build_1.EXPORTABLE)((constant, list, pk, tableTypeName) => ($record) => {
                                                        return list([
                                                            constant(tableTypeName, false),
                                                            ...pk.map((attribute) => $record.get(attribute)),
                                                        ]);
                                                    }, [constant, list, pk, tableTypeName]),
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
                                                getIdentifiers(value) {
                                                    return value.slice(1);
                                                },
                                                get: (0, graphile_build_1.EXPORTABLE)((resource) => (spec) => resource.get(spec), [resource]),
                                                match: (0, graphile_build_1.EXPORTABLE)((tableTypeName) => (obj) => {
                                                    return obj[0] === tableTypeName;
                                                }, [tableTypeName]),
                                            });
                                        }
                                    }
                                }
                            }
                            else if (polymorphism.mode === "union") {
                                const interfaceTypeName = inflection.tableType(codec);
                                const nodeable = build.behavior.pgCodecMatches(codec, "interface:node");
                                build.registerInterfaceType(interfaceTypeName, {
                                    pgCodec: codec,
                                    isPgPolymorphicTableType: true,
                                    pgPolymorphism: polymorphism,
                                    supportsNodeInterface: nodeable,
                                }, () => ({
                                    description: codec.description,
                                }), `PgPolymorphismPlugin union interface type for ${codec.name}`);
                                setGraphQLTypeForPgCodec(codec, ["output"], interfaceTypeName);
                                build.registerCursorConnection({
                                    typeName: interfaceTypeName,
                                    connectionTypeName: inflection.tableConnectionType(codec),
                                    edgeTypeName: inflection.tableEdgeType(codec),
                                    scope: {
                                        isPgConnectionRelated: true,
                                        pgCodec: codec,
                                    },
                                    nonNullNode: pgForbidSetofFunctionsToReturnNull,
                                });
                            }
                        }
                    });
                    // Detect union membership
                    build.recoverable(null, () => {
                        const rawUnionMember = codec.extensions?.tags?.unionMember;
                        if (rawUnionMember) {
                            const memberships = Array.isArray(rawUnionMember)
                                ? rawUnionMember
                                : [rawUnionMember];
                            for (const membership of memberships) {
                                // Register union
                                const unionName = membership.trim();
                                const list = unionsToRegister.get(unionName);
                                if (!list) {
                                    unionsToRegister.set(unionName, [codec]);
                                }
                                else {
                                    list.push(codec);
                                }
                            }
                        }
                    });
                }
                for (const [unionName, codecs] of unionsToRegister.entries()) {
                    build.recoverable(null, () => {
                        build.registerUnionType(unionName, { isPgUnionMemberUnion: true }, () => ({
                            types: () => codecs
                                .map((codec) => build.getTypeByName(build.inflection.tableType(codec)))
                                .filter(isNotNullish),
                        }), "PgPolymorphismPlugin @unionMember unions");
                        build.registerCursorConnection({
                            typeName: unionName,
                            scope: { isPgUnionMemberUnionConnection: true },
                        });
                    });
                }
                return _;
            },
            GraphQLObjectType_interfaces(interfaces, build, context) {
                const { inflection } = build;
                const { scope: { pgCodec, isPgClassType }, } = context;
                const rawImplements = pgCodec?.extensions?.tags?.implements;
                if (rawImplements && isPgClassType) {
                    const interfaceNames = Array.isArray(rawImplements)
                        ? rawImplements
                        : [rawImplements];
                    for (const interfaceName of interfaceNames) {
                        const interfaceType = build.getTypeByName(String(interfaceName));
                        if (!interfaceType) {
                            console.error(`'${interfaceName}' type not found`);
                        }
                        else if (!build.graphql.isInterfaceType(interfaceType)) {
                            console.error(`'${interfaceName}' is not an interface type (it's a ${interfaceType.constructor.name})`);
                        }
                        else {
                            interfaces.push(interfaceType);
                        }
                    }
                }
                for (const codec of build.pgCodecMetaLookup.keys()) {
                    const polymorphism = codec.polymorphism;
                    if (!codec.attributes ||
                        !polymorphism ||
                        polymorphism.mode !== "relational") {
                        continue;
                    }
                    const typeNames = Object.values(polymorphism.types).map((t) => t.name);
                    if (typeNames.includes(context.Self.name)) {
                        const interfaceTypeName = inflection.tableType(codec);
                        interfaces.push(build.getTypeByName(interfaceTypeName));
                    }
                }
                return interfaces;
            },
            GraphQLSchema_types: {
                before: ["CollectReferencedTypesPlugin"],
                callback(types, build, _context) {
                    for (const type of Object.values(build.getAllTypes())) {
                        if (build.graphql.isInterfaceType(type)) {
                            const scope = build.scopeByType.get(type);
                            if (scope) {
                                const polymorphism = scope.pgPolymorphism;
                                if (polymorphism) {
                                    switch (polymorphism.mode) {
                                        case "relational":
                                        case "single": {
                                            for (const type of Object.values(polymorphism.types)) {
                                                // Force the type to be built
                                                const t = build.getTypeByName(type.name);
                                                types.push(t);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return types;
                },
            },
        },
    },
};
function makeGetIdentifiers(handlers) {
    const decodeNodeId = (0, graphile_build_1.EXPORTABLE)((handlers, makeDecodeNodeIdRuntime) => makeDecodeNodeIdRuntime(handlers), [handlers, grafast_1.makeDecodeNodeIdRuntime]);
    return (0, graphile_build_1.EXPORTABLE)((decodeNodeId, handlers) => (nodeId) => {
        const specifier = decodeNodeId(nodeId);
        if (specifier == null)
            return null;
        for (const handler of handlers) {
            const value = specifier?.[handler.codec.name];
            const match = value != null ? handler.match(value) : false;
            if (match) {
                return handler.getIdentifiers(value);
            }
        }
        return null;
    }, [decodeNodeId, handlers]);
}
function makeGetRelationalSpec(details, tablePkAttributes) {
    const handlers = details.map((d) => d.handler);
    const decodeNodeId = (0, graphile_build_1.EXPORTABLE)((handlers, makeDecodeNodeId) => makeDecodeNodeId(handlers), [handlers, grafast_1.makeDecodeNodeId]);
    return (0, graphile_build_1.EXPORTABLE)((access, decodeNodeId, details, lambda, list, object, tablePkAttributes) => ($nodeId) => {
        const $specifier = decodeNodeId($nodeId);
        const $handlerMatches = list(details.map(({ handler, remotePkAttributes }) => {
            const spec = handler.getSpec(access($specifier, handler.codec.name));
            return object({
                match: lambda($specifier, (specifier) => {
                    const value = specifier?.[handler.codec.name];
                    return value != null ? handler.match(value) : false;
                }),
                pks: list(remotePkAttributes.map((n) => spec[n])),
            });
        }));
        const $pkValues = lambda($handlerMatches, (handlerMatches) => {
            const match = handlerMatches.find((pk) => pk.match);
            return match?.pks;
        }, true);
        return tablePkAttributes.reduce((memo, pkAttribute, i) => {
            memo[pkAttribute] = access($pkValues, i);
            return memo;
        }, Object.create(null));
    }, [grafast_1.access, decodeNodeId, details, grafast_1.lambda, grafast_1.list, grafast_1.object, tablePkAttributes]);
}
function makeGetSingleSpec(handlers, tablePkAttributes) {
    const decodeNodeId = (0, graphile_build_1.EXPORTABLE)((handlers, makeDecodeNodeId) => makeDecodeNodeId(handlers), [handlers, grafast_1.makeDecodeNodeId]);
    return (0, graphile_build_1.EXPORTABLE)((access, decodeNodeId, handlers, lambda, list, object, tablePkAttributes) => ($nodeId) => {
        const $specifier = decodeNodeId($nodeId);
        const $handlerMatches = list(handlers.map((handler) => {
            const spec = handler.getSpec(access($specifier, handler.codec.name));
            return object({
                match: lambda($specifier, (specifier) => {
                    const value = specifier?.[handler.codec.name];
                    return value != null ? handler.match(value) : false;
                }),
                pks: list(tablePkAttributes.map((n) => spec[n])),
            });
        }));
        const $pkValues = lambda($handlerMatches, (handlerMatches) => {
            // Explicit typing because TypeScript has lost the
            // plot.
            const match = handlerMatches.find((pk) => pk.match);
            return match?.pks;
        }, true);
        return tablePkAttributes.reduce((memo, pkAttribute, i) => {
            memo[pkAttribute] = access($pkValues, i);
            return memo;
        }, Object.create(null));
    }, [grafast_1.access, decodeNodeId, handlers, grafast_1.lambda, grafast_1.list, grafast_1.object, tablePkAttributes]);
}
//# sourceMappingURL=PgPolymorphismPlugin.js.map