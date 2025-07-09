"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgNodeIdAttributesPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgNodeIdAttributesPlugin = {
    name: "PgNodeIdAttributesPlugin",
    description: "Adds nodeId attributes to various inputs representing foreign key relations",
    version: version_js_1.version,
    after: ["PgTablesPlugin", "PgAttributesPlugin"],
    inflection: {
        add: {
            nodeIdAttribute(options, details) {
                return this.singleRelation(details);
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "nodeId:insert": {
                    description: "can we insert to the columns represented by this nodeId which represents a table related via foreign key constraint?",
                    entities: ["pgCodecRelation"],
                },
                "nodeId:update": {
                    description: "can we update the columns represented by this nodeId which represents a table related via foreign key constraint?",
                    entities: ["pgCodecRelation"],
                },
                "nodeId:base": {
                    description: 'should we add a nodeId input representing this foreign key constraint to the "base" input type?',
                    entities: ["pgCodecRelation"],
                },
                "nodeId:filterBy": {
                    description: "can we filter by the columns represented by this nodeId which represents a table related via foreign key constraint?",
                    entities: ["pgCodecRelation"],
                },
            },
        },
        entityBehavior: {
            // By default, column attributes will be present, so we don't want this to also be set
            pgCodecRelation: [
                "-nodeId:insert",
                "-nodeId:update",
                "-nodeId:base",
                "-nodeId:filterBy",
            ],
        },
        hooks: {
            GraphQLInputObjectType_fields(fields, build, context) {
                const { extend, inflection, graphql: { GraphQLID }, input: { pgRegistry }, sql, } = build;
                const { scope: { isPgRowType, isPgCompoundType, isPgPatch, isPgBaseInput, pgCodec: rawPgCodec, isPgCondition, }, fieldWithHooks, } = context;
                if (!(isPgRowType || isPgCompoundType || isPgCondition) ||
                    !rawPgCodec ||
                    !rawPgCodec.attributes ||
                    rawPgCodec.isAnonymous) {
                    return fields;
                }
                const pgCodec = rawPgCodec;
                const relationEntries = Object.entries(pgRegistry.pgRelations[pgCodec.name] ?? {}).filter(([_name, relation]) => !relation.isReferencee && relation.isUnique);
                return relationEntries.reduce((memo, [relationName, relation]) => build.recoverable(memo, () => {
                    const typeName = build.getGraphQLTypeNameByPgCodec(relation.remoteResource.codec, "output");
                    if (!typeName)
                        return memo;
                    if (typeName === build.inflection.builtin("Query")) {
                        return memo;
                    }
                    const helpers = build.nodeIdHelpersForCodec(relation.remoteResource.codec);
                    if (!helpers) {
                        return memo;
                    }
                    const { getIdentifiers } = helpers;
                    const action = isPgBaseInput
                        ? "base"
                        : isPgPatch
                            ? "update"
                            : isPgCondition
                                ? "filterBy"
                                : "insert";
                    const fieldBehaviorScope = `nodeId:${action}`;
                    if (!build.behavior.pgCodecRelationMatches(relation, fieldBehaviorScope)) {
                        return memo;
                    }
                    const fieldName = inflection.nodeIdAttribute({
                        registry: pgRegistry,
                        codec: pgCodec,
                        relationName,
                    });
                    const attributes = relation.localAttributes.map((name) => pgCodec.attributes[name]);
                    const anAttributeIsNotNull = attributes.some((attr) => attr.notNull || attr.extensions?.tags?.notNull);
                    const { localAttributes } = relation;
                    const attributeCount = localAttributes.length;
                    const localAttributeCodecs = localAttributes.map((name) => pgCodec.attributes[name].codec);
                    return extend(memo, {
                        [fieldName]: fieldWithHooks({
                            fieldName,
                            fieldBehaviorScope,
                            pgCodec,
                        }, {
                            type: build.nullableIf(isPgBaseInput ||
                                isPgPatch ||
                                isPgCondition ||
                                !anAttributeIsNotNull, GraphQLID),
                            // ENHANCE: if the remote columns are the primary keys
                            // then there's no need to actually fetch the record
                            // (unless we want to check it exists).
                            // ENHANCE: we know nodeId will always be unary, so we
                            // could optimize this SQL at execution time when we know
                            // if it is null or not.
                            apply: isPgCondition
                                ? (0, graphile_build_1.EXPORTABLE)((attributeCount, getIdentifiers, localAttributeCodecs, localAttributes, sql, sqlValueWithCodec, typeName) => function apply(condition, nodeId) {
                                    if (nodeId === undefined) {
                                        return;
                                    }
                                    else if (nodeId === null) {
                                        for (const localName of localAttributes) {
                                            condition.where({
                                                type: "attribute",
                                                attribute: localName,
                                                callback: (expression) => sql `${expression} is null`,
                                            });
                                        }
                                        return;
                                    }
                                    else if (typeof nodeId !== "string") {
                                        throw new Error(`Invalid node identifier for '${typeName}'; expected string`);
                                    }
                                    else {
                                        const identifiers = getIdentifiers(nodeId);
                                        if (identifiers == null) {
                                            throw new Error(`Invalid node identifier for '${typeName}'`);
                                        }
                                        for (let i = 0; i < attributeCount; i++) {
                                            const localName = localAttributes[i];
                                            const value = identifiers[i];
                                            if (value == null) {
                                                condition.where({
                                                    type: "attribute",
                                                    attribute: localName,
                                                    callback: (expression) => sql `${expression} is null`,
                                                });
                                            }
                                            else {
                                                const codec = localAttributeCodecs[i];
                                                const sqlRemoteValue = sqlValueWithCodec(value, codec);
                                                condition.where({
                                                    type: "attribute",
                                                    attribute: localName,
                                                    callback: (expression) => sql `${expression} = ${sqlRemoteValue}`,
                                                });
                                            }
                                        }
                                    }
                                }, [
                                    attributeCount,
                                    getIdentifiers,
                                    localAttributeCodecs,
                                    localAttributes,
                                    sql,
                                    pg_1.sqlValueWithCodec,
                                    typeName,
                                ])
                                : (0, graphile_build_1.EXPORTABLE)((attributeCount, getIdentifiers, localAttributes, typeName) => function plan(record, nodeId) {
                                    if (nodeId === undefined) {
                                        return;
                                    }
                                    else if (nodeId === null) {
                                        for (const localName of localAttributes) {
                                            record.set(localName, null);
                                        }
                                        return;
                                    }
                                    else if (typeof nodeId !== "string") {
                                        throw new Error(`Invalid node identifier for '${typeName}'; expected string`);
                                    }
                                    else {
                                        const identifiers = getIdentifiers(nodeId);
                                        if (identifiers == null) {
                                            console.log(identifiers, nodeId, typeName);
                                            throw new Error(`Invalid node identifier for '${typeName}'`);
                                        }
                                        for (let i = 0; i < attributeCount; i++) {
                                            const localName = localAttributes[i];
                                            record.set(localName, identifiers[i]);
                                        }
                                    }
                                }, [
                                    attributeCount,
                                    getIdentifiers,
                                    localAttributes,
                                    typeName,
                                ]),
                        }),
                    }, `Adding input object 'ID' field to ${pgCodec.name} (action = ${action}) representing relation ${relationName}.`);
                }), fields);
            },
        },
    },
};
//# sourceMappingURL=PgNodeIdAttributesPlugin.js.map