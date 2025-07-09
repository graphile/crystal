"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRelationsPlugin = void 0;
const tslib_1 = require("tslib");
require("./PgTablesPlugin.js");
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const tamedevil_1 = tslib_1.__importStar(require("tamedevil"));
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const ref_connection = tamedevil_1.default.ref(grafast_1.connection, "connection");
const ref_sql = tamedevil_1.default.ref(pg_sql2_1.default, "sql");
const EMPTY_OBJECT = Object.freeze({});
// TODO: split this into one plugin for gathering and another for schema
exports.PgRelationsPlugin = {
    name: "PgRelationsPlugin",
    description: "Creates relationships between the @dataplan/pg resources, and mirrors these relationships into the GraphQL schema",
    version: version_js_1.version,
    after: ["smart-tags", "PgFakeConstraintsPlugin", "PgTablesPlugin"],
    inflection: {
        add: {
            resourceRelationName(options, { serviceName, pgConstraint, localClass: _localClass, localAttributes, foreignClass, foreignAttributes, isUnique, isReferencee, }) {
                const { tags } = pgConstraint.getTagsAndDescription();
                if (!isReferencee && typeof tags.fieldName === "string") {
                    return tags.fieldName;
                }
                if (isReferencee && typeof tags.foreignFieldName === "string") {
                    return tags.foreignFieldName;
                }
                const remoteName = this.tableResourceName({
                    serviceName,
                    pgClass: foreignClass,
                });
                const attributes = !isReferencee
                    ? // We have a attribute referencing another table
                        localAttributes
                    : // The other table has a constraint that references us; this is the backwards relation.
                        foreignAttributes;
                const attributeNames = attributes.map((col) => col.attname);
                return this.camelCase(`${isUnique ? remoteName : this.pluralize(remoteName)}-by-${isReferencee ? "their" : "my"}-${attributeNames.join("-and-")}`);
            },
            _singleRelationRaw(options, details) {
                const { registry, codec, relationName } = details;
                const relation = registry.pgRelations[codec.name]?.[relationName];
                //const codec = relation.remoteResource.codec;
                if (typeof relation.extensions?.tags.fieldName === "string") {
                    return relation.extensions.tags.fieldName;
                }
                // E.g. posts(author_id) references users(id)
                const remoteType = this.tableType(relation.remoteResource.codec);
                const localAttributes = relation.localAttributes;
                return `${remoteType}-by-${this._joinAttributeNames(codec, localAttributes)}`;
            },
            singleRelation(options, details) {
                return this.camelCase(this._singleRelationRaw(details));
            },
            _singleRelationBackwardsRaw(options, details) {
                const { registry, codec, relationName } = details;
                const relation = registry.pgRelations[codec.name]?.[relationName];
                if (typeof relation.extensions?.tags.foreignSingleFieldName === "string") {
                    return relation.extensions.tags.foreignSingleFieldName;
                }
                if (typeof relation.extensions?.tags.foreignFieldName === "string") {
                    return relation.extensions.tags.foreignFieldName;
                }
                // E.g. posts(author_id) references users(id)
                const remoteType = this.tableType(relation.remoteResource.codec);
                const remoteAttributes = relation.remoteAttributes;
                return `${remoteType}-by-${this._joinAttributeNames(relation.remoteResource.codec, remoteAttributes)}`;
            },
            singleRelationBackwards(options, details) {
                return this.camelCase(this._singleRelationBackwardsRaw(details));
            },
            _manyRelationRaw(options, details) {
                const { registry, codec, relationName } = details;
                const relation = registry.pgRelations[codec.name]?.[relationName];
                const baseOverride = relation.extensions?.tags.foreignFieldName;
                if (typeof baseOverride === "string") {
                    return baseOverride;
                }
                // E.g. users(id) references posts(author_id)
                const remoteType = this.tableType(relation.remoteResource.codec);
                const remoteAttributes = relation.remoteAttributes;
                return `${this.pluralize(remoteType)}-by-${this._joinAttributeNames(relation.remoteResource.codec, remoteAttributes)}`;
            },
            _manyRelation(options, details) {
                return this.camelCase(this._manyRelationRaw(details));
            },
            manyRelationConnection(options, details) {
                const { registry, codec, relationName } = details;
                const relation = registry.pgRelations[codec.name]?.[relationName];
                const override = relation.extensions?.tags.foreignConnectionFieldName;
                if (typeof override === "string") {
                    return override;
                }
                return this.connectionField(this._manyRelation(details));
            },
            manyRelationList(options, details) {
                const { registry, codec, relationName } = details;
                const relation = registry.pgRelations[codec.name]?.[relationName];
                const override = relation.extensions?.tags.foreignSimpleFieldName;
                if (typeof override === "string") {
                    return override;
                }
                return this.listField(this._manyRelation(details));
            },
        },
    },
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgRelations",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState: () => Object.create(null),
        helpers: {
            async addRelation(info, event, pgConstraint, isReferencee = false) {
                const pgClass = isReferencee
                    ? pgConstraint.getForeignClass()
                    : pgConstraint.getClass();
                const foreignClass = isReferencee
                    ? pgConstraint.getClass()
                    : pgConstraint.getForeignClass();
                if (!pgClass || !foreignClass) {
                    throw new Error(`Invalid introspection`);
                }
                const localAttributeNumbers = isReferencee
                    ? pgConstraint.confkey
                    : pgConstraint.conkey;
                const foreignAttributeNumbers = isReferencee
                    ? pgConstraint.conkey
                    : pgConstraint.confkey;
                const isUnique = !isReferencee
                    ? true
                    : (() => {
                        // This relationship is unique if the REFERENCED table (not us!)
                        // has a unique constraint on the remoteAttributes the relationship
                        // specifies (or a subset thereof).
                        const foreignUniqueAttributeOnlyConstraints = foreignClass
                            .getConstraints()
                            .filter((c) => ["u", "p"].includes(c.contype) &&
                            c.conkey?.every((k) => k > 0));
                        const foreignUniqueAttributeNumberCombinations = foreignUniqueAttributeOnlyConstraints.map((c) => c.conkey);
                        const isUnique = foreignUniqueAttributeNumberCombinations.some((foreignUniqueAttributeNumbers) => {
                            return foreignUniqueAttributeNumbers.every((n) => n > 0 && pgConstraint.conkey.includes(n));
                        });
                        return isUnique;
                    })();
                const { serviceName } = event;
                const localAttributes = await Promise.all(localAttributeNumbers.map((key) => info.helpers.pgIntrospection.getAttribute(serviceName, pgClass._id, key)));
                const localCodec = await info.helpers.pgCodecs.getCodecFromClass(serviceName, pgClass._id);
                const foreignAttributes = await Promise.all(foreignAttributeNumbers.map((key) => info.helpers.pgIntrospection.getAttribute(serviceName, foreignClass._id, key)));
                const foreignResourceOptions = (await info.helpers.pgTables.getResourceOptions(serviceName, foreignClass));
                if (!localCodec ||
                    !foreignResourceOptions ||
                    foreignResourceOptions.isVirtual) {
                    return;
                }
                const relationName = info.inflection.resourceRelationName({
                    serviceName,
                    pgConstraint,
                    localClass: pgClass,
                    localAttributes: localAttributes,
                    foreignClass,
                    foreignAttributes: foreignAttributes,
                    isUnique,
                    isReferencee,
                });
                const registryBuilder = await info.helpers.pgRegistry.getRegistryBuilder();
                const { codec } = event.resourceOptions;
                let localCodecPolymorphicTypes = undefined;
                if (codec.polymorphism?.mode === "single") {
                    const poly = codec.polymorphism;
                    if (localAttributes.every((attr) => poly.commonAttributes.includes(attr.attname))) {
                        // Common to all types
                    }
                    else {
                        if (isReferencee) {
                            // ENHANCE: consider supporting backward relationships for single
                            // table polymorphic types. It's not immediately clear what the
                            // user would want in these cases: is it separate fields for each
                            // type (that would inflate the schema), or is it a relation to
                            // the underlying polymorphic type even though we know certain
                            // concrete types from it will never appear? For now we're
                            // skipping it entirely because then we can add whatever makes
                            // sense later.
                            return;
                        }
                        localCodecPolymorphicTypes = [];
                        for (const [typeKey, typeDetails] of Object.entries(poly.types)) {
                            if (localAttributes.every((attr) => poly.commonAttributes.includes(attr.attname) ||
                                typeDetails.attributes.some((a) => a.attribute === attr.attname))) {
                                // MATCH!
                                localCodecPolymorphicTypes.push(typeKey);
                            }
                        }
                    }
                }
                const existingRelation = registryBuilder.getRegistryConfig().pgRelations[codec.name]?.[relationName];
                const { tags: rawTags, description: constraintDescription } = pgConstraint.getTagsAndDescription();
                // Clone the tags because we use the same tags on both relations
                // (in both directions) but don't want modifications made to one
                // to affect the other.
                const tags = JSON.parse(JSON.stringify(rawTags));
                const description = isReferencee
                    ? tags.backwardDescription
                    : (tags.forwardDescription ?? constraintDescription);
                const baseBehavior = tags.behavior;
                const specificBehavior = isReferencee
                    ? tags.backwardBehavior
                    : tags.forwardBehavior;
                const behavior = combineBehaviors(baseBehavior, specificBehavior);
                const newRelation = {
                    localCodec: localCodec,
                    localCodecPolymorphicTypes,
                    localAttributes: localAttributes.map((c) => c.attname),
                    remoteAttributes: foreignAttributes.map((c) => c.attname),
                    remoteResourceOptions: foreignResourceOptions,
                    isUnique,
                    isReferencee,
                    description: typeof description === "string" ? description : undefined,
                    extensions: {
                        tags: {
                            ...tags,
                            behavior,
                        },
                    },
                };
                await info.process("pgRelations_relation", {
                    serviceName,
                    pgClass,
                    pgConstraint,
                    relation: newRelation,
                });
                if (existingRelation) {
                    const isEquivalent = existingRelation.isUnique === newRelation.isUnique &&
                        existingRelation.isReferencee === newRelation.isReferencee &&
                        (0, grafast_1.arraysMatch)(existingRelation.localAttributes, newRelation.localAttributes) &&
                        (0, grafast_1.arraysMatch)(existingRelation.remoteAttributes, newRelation.remoteAttributes) &&
                        existingRelation.remoteResourceOptions ===
                            newRelation.remoteResourceOptions;
                    const message = `Attempted to add a ${isReferencee ? "backwards" : "forwards"} relation named '${relationName}' to '${pgClass.relname}' for ${isEquivalent ? "equivalent " : ""}constraint '${pgConstraint.conname}' on '${pgClass.getNamespace().nspname}.${pgClass.relname}', but a relation by that name already exists; consider renaming the relation by overriding the 'sourceRelationName' inflector`;
                    if (isEquivalent) {
                        console.warn(message);
                        return;
                    }
                    else {
                        throw new Error(message);
                    }
                }
                registryBuilder.addRelation(codec, relationName, newRelation.remoteResourceOptions, newRelation);
            },
        },
        hooks: {
            async pgTables_PgResourceOptions_relations(info, event) {
                const { pgClass, serviceName } = event;
                const constraints = await info.helpers.pgIntrospection.getConstraintsForClass(serviceName, pgClass._id);
                const foreignConstraints = await info.helpers.pgIntrospection.getForeignConstraintsForClass(serviceName, pgClass._id);
                for (const constraint of constraints) {
                    if (constraint.contype === "f") {
                        await info.helpers.pgRelations.addRelation(event, constraint);
                    }
                }
                for (const constraint of foreignConstraints) {
                    if (constraint.contype === "f") {
                        await info.helpers.pgRelations.addRelation(event, constraint, true);
                    }
                }
            },
        },
    }),
    schema: {
        behaviorRegistry: {
            add: {
                "resource:select": {
                    description: "can we select records via this relationship/ref?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
                "singularRelation:resource:single": {
                    description: "can we get a single one of these (resource) from a type?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
                "singularRelation:resource:list": {
                    description: "should we add a list field to navigate this singular relationship (when we know there can be at most one)?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
                "singularRelation:resource:connection": {
                    description: "should we add a connection field to navigate this singular relationship (when we know there can be at most one)?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
                "manyRelation:resource:list": {
                    description: "should we add a list field to navigate this relationship?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
                "manyRelation:resource:connection": {
                    description: "should we add a connection field to navigate this relationship?",
                    entities: ["pgCodecRelation", "pgCodecRef"],
                },
            },
        },
        entityBehavior: {
            pgCodecRelation: {
                inferred(behavior, entity) {
                    if (entity.isUnique) {
                        return [
                            "resource:select",
                            behavior,
                            "single",
                            "-singularRelation:resource:list",
                            "-singularRelation:resource:connection",
                        ];
                    }
                    else {
                        return ["resource:select", behavior];
                    }
                },
            },
            pgCodecRef: {
                inferred(behavior, [codec, refName]) {
                    const ref = codec.refs?.[refName];
                    if (ref?.definition.singular) {
                        return [
                            "resource:select",
                            behavior,
                            "single",
                            "-singularRelation:resource:list",
                            "-singularRelation:resource:connection",
                        ];
                    }
                    else {
                        return [
                            "resource:select",
                            behavior,
                            "-single",
                            "manyRelation:resource:connection",
                            "manyRelation:resource:list",
                        ];
                    }
                },
            },
            pgRefDefinition: {
                inferred(behavior, entity) {
                    if (entity.singular) {
                        return [
                            "resource:select",
                            behavior,
                            "single",
                            "-singularRelation:resource:list",
                            "-singularRelation:resource:connection",
                        ];
                    }
                    else {
                        return ["resource:select", behavior];
                    }
                },
            },
        },
        hooks: {
            GraphQLInterfaceType_fields: addRelations,
            GraphQLObjectType_fields: addRelations,
        },
    },
};
function makeSpecString(identifier, localAttributes, remoteAttributes) {
    return (0, tamedevil_1.default) `{ ${tamedevil_1.default.join(remoteAttributes.map((remoteAttributeName, i) => (0, tamedevil_1.default) `${tamedevil_1.default.safeKeyOrThrow(remoteAttributeName)}: ${identifier}.get(${tamedevil_1.default.lit(localAttributes[i])})`), ", ")} }`;
}
function makeRelationPlans(localAttributes, remoteAttributes, otherSource, isMutationPayload) {
    const recordOrResult = isMutationPayload
        ? (0, tamedevil_1.default) `$record.get("result")`
        : (0, tamedevil_1.default) `$record`;
    const clean = remoteAttributes.every((remoteAttributeName) => typeof remoteAttributeName === "string" &&
        (0, tamedevil_1.isSafeObjectPropertyName)(remoteAttributeName)) &&
        localAttributes.every((localAttributeName) => typeof localAttributeName === "string" &&
            (0, tamedevil_1.isSafeObjectPropertyName)(localAttributeName));
    const specString = clean
        ? makeSpecString(recordOrResult, localAttributes, remoteAttributes)
        : null;
    const specFromRecord = (0, graphile_build_1.EXPORTABLE)((localAttributes, remoteAttributes) => ($record) => {
        return remoteAttributes.reduce((memo, remoteAttributeName, i) => {
            memo[remoteAttributeName] = $record.get(localAttributes[i]);
            return memo;
        }, Object.create(null));
    }, [localAttributes, remoteAttributes]);
    const singleRecordPlan = clean && specString
        ? // Optimise function for both execution and export.
            // eslint-disable-next-line graphile-export/exhaustive-deps
            (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (otherSource) {
  return $record => otherSource.get(${specString});
}`, [otherSource])
        : isMutationPayload
            ? (0, graphile_build_1.EXPORTABLE)((otherSource, specFromRecord) => function plan($in) {
                const $record = $in.get("result");
                return otherSource.get(specFromRecord($record));
            }, [otherSource, specFromRecord])
            : (0, graphile_build_1.EXPORTABLE)((otherSource, specFromRecord) => function plan($record) {
                return otherSource.get(specFromRecord($record));
            }, [otherSource, specFromRecord]);
    const listPlan = clean && specString
        ? // eslint-disable-next-line graphile-export/exhaustive-deps
            (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (otherSource) {
  return $record => otherSource.find(${specString});
}`, [otherSource])
        : isMutationPayload
            ? (0, graphile_build_1.EXPORTABLE)((otherSource, specFromRecord) => function plan($in) {
                const $record = $in.get("result");
                return otherSource.find(specFromRecord($record));
            }, [otherSource, specFromRecord])
            : (0, graphile_build_1.EXPORTABLE)((otherSource, specFromRecord) => function plan($record) {
                return otherSource.find(specFromRecord($record));
            }, [otherSource, specFromRecord]);
    const connectionPlan = clean && specString
        ? // eslint-disable-next-line graphile-export/exhaustive-deps
            (0, graphile_build_1.EXPORTABLE)(tamedevil_1.default.run `\
return function (otherSource, connection) {
  return $record => {
    const $records = otherSource.find(${specString});
    return connection($records);
  }
}`, [otherSource, grafast_1.connection])
        : isMutationPayload
            ? (0, graphile_build_1.EXPORTABLE)((connection, otherSource, specFromRecord) => function plan($in) {
                const $record = $in.get("result");
                return connection(otherSource.find(specFromRecord($record)));
            }, [grafast_1.connection, otherSource, specFromRecord])
            : (0, graphile_build_1.EXPORTABLE)((connection, otherSource, specFromRecord) => function plan($record) {
                return connection(otherSource.find(specFromRecord($record)));
            }, [grafast_1.connection, otherSource, specFromRecord]);
    return { singleRecordPlan, listPlan, connectionPlan };
}
function addRelations(fields, build, context) {
    const { extend, graphql: { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLUnionType, GraphQLInterfaceType, }, } = build;
    const { Self, scope, fieldWithHooks } = context;
    // const objectMode = context.type === "GraphQLObjectType";
    const { pgCodec } = scope;
    const isPgClassType = "isPgClassType" in scope ? scope.isPgClassType : undefined;
    const pgTypeResource = "pgTypeResource" in scope ? scope.pgTypeResource : undefined;
    const isMutationPayload = "isMutationPayload" in scope ? scope.isMutationPayload : undefined;
    const pgPolymorphism = "pgPolymorphism" in scope ? scope.pgPolymorphism : undefined;
    const pgPolymorphicSingleTableType = "pgPolymorphicSingleTableType" in scope
        ? scope.pgPolymorphicSingleTableType
        : undefined;
    const codec = (pgTypeResource?.codec ?? pgCodec);
    if ((isMutationPayload && !build.options.pgMutationPayloadRelations) ||
        !(isPgClassType || isMutationPayload || pgPolymorphism) ||
        !codec ||
        !codec.attributes) {
        return fields;
    }
    const resource = pgTypeResource ?? build.pgTableResource(codec);
    const relations = (build.input.pgRegistry
        .pgRelations[codec.name] ?? Object.create(null));
    if (resource && resource.parameters && !resource.isUnique) {
        return fields;
    }
    // Don't use refs on mutation payloads
    const refDefinitionList = isMutationPayload
        ? []
        : codec.refs
            ? Object.entries(codec.refs)
                .filter(([, spec]) => !spec.definition.sourceGraphqlType ||
                spec.definition.sourceGraphqlType === context.Self.name)
                .map(([refName, spec]) => ({
                codec,
                refName,
                refDefinition: spec.definition,
                ref: spec,
            }))
            : Object.entries(codec.extensions?.refDefinitions ??
                Object.create(null))
                .filter(([, refDefinition]) => !refDefinition.sourceGraphqlType ||
                refDefinition.sourceGraphqlType === context.Self.name)
                .map(([refName, refDefinition]) => ({
                codec,
                refName,
                refDefinition,
            }));
    const digests = [];
    if (relations) {
        // Digest relations
        for (const [relationName, relation] of Object.entries(relations)) {
            const { localCodecPolymorphicTypes, localAttributes, remoteAttributes, remoteResource, isReferencee, } = relation;
            if (isMutationPayload && isReferencee) {
                // Don't add backwards relations to mutation payloads
                continue;
            }
            if (localCodecPolymorphicTypes) {
                if (!pgPolymorphicSingleTableType) {
                    if (context.type === "GraphQLInterfaceType") {
                        // Ignore on interface
                        continue;
                    }
                    else {
                        throw new Error(`Relationship indicates it only relates to certain polymorphic subtypes, but this type doesn't seem to be polymorphic?`);
                    }
                }
                if (!localCodecPolymorphicTypes.some((t) => t === pgPolymorphicSingleTableType.typeIdentifier)) {
                    // Does not apply to this polymorphic subtype; skip.
                    continue;
                }
            }
            const isUnique = relation.isUnique;
            const otherCodec = remoteResource.codec;
            const typeName = build.inflection.tableType(otherCodec);
            const connectionTypeName = build.inflection.tableConnectionType(otherCodec);
            const deprecationReason = (0, utils_js_1.tagToString)(relation.extensions?.tags?.deprecated) ??
                (0, utils_js_1.tagToString)(relation.remoteResource.extensions?.tags?.deprecated);
            const relationDetails = {
                registry: build.input.pgRegistry,
                codec,
                relationName,
            };
            const { singleRecordPlan, listPlan, connectionPlan } = makeRelationPlans(localAttributes, remoteAttributes, remoteResource, isMutationPayload ?? false);
            const singleRecordFieldName = relation.isReferencee
                ? build.inflection.singleRelationBackwards(relationDetails)
                : build.inflection.singleRelation(relationDetails);
            const connectionFieldName = build.inflection.manyRelationConnection(relationDetails);
            const listFieldName = build.inflection.manyRelationList(relationDetails);
            const relationTypeScope = isUnique ? `singularRelation` : `manyRelation`;
            const shouldAddSingleField = isUnique &&
                build.behavior.pgCodecRelationMatches(relation, `${relationTypeScope}:resource:single`);
            const shouldAddConnectionField = build.behavior.pgCodecRelationMatches(relation, `${relationTypeScope}:resource:connection`);
            const shouldAddListField = build.behavior.pgCodecRelationMatches(relation, `${relationTypeScope}:resource:list`);
            const digest = {
                identifier: relationName,
                isReferencee: relation.isReferencee ?? false,
                relationTypeScope,
                shouldAddSingleField,
                shouldAddConnectionField,
                shouldAddListField,
                isUnique,
                typeName,
                connectionTypeName,
                deprecationReason,
                singleRecordPlan,
                listPlan,
                connectionPlan,
                singleRecordFieldName,
                listFieldName,
                connectionFieldName,
                description: relation.description,
                pgResource: remoteResource,
                pgCodec: remoteResource.codec,
                pgRelationDetails: relationDetails,
                relatedTypeName: build.inflection.tableType(codec),
                isNonNull: relation.extensions?.tags?.notNull,
            };
            digests.push(digest);
        }
    }
    // Digest refs
    for (const { codec, refName: identifier, refDefinition: refSpec, ref, } of refDefinitionList) {
        const isUnique = !!refSpec.singular;
        let hasReferencee;
        let sharedCodec = undefined;
        let sharedSource = undefined;
        let behavior;
        let typeName;
        let singleRecordPlan;
        let listPlan;
        let connectionPlan;
        if (ref && resource) {
            const paths = ref.paths.map((path) => (0, utils_js_1.resolveResourceRefPath)(resource, path));
            if (paths.length === 0)
                continue;
            const firstSource = paths[0].resource;
            const hasExactlyOneSource = paths.every((p) => p.resource === firstSource);
            const firstCodec = firstSource.codec;
            const hasExactlyOneCodec = paths.every((p) => p.resource.codec === firstCodec);
            hasReferencee = paths.some((p) => p.hasReferencee);
            if (isMutationPayload && (paths.length !== 1 || hasReferencee)) {
                // Don't add backwards relations to mutation payloads
                continue;
            }
            typeName =
                refSpec.graphqlType ??
                    (hasExactlyOneCodec ? build.inflection.tableType(firstCodec) : null);
            if (!typeName) {
                continue;
            }
            const type = build.getTypeByName(typeName);
            if (!type) {
                continue;
            }
            if (refSpec.graphqlType) {
                // If this is a union/interface, can we find the associated codec?
                const scope = build.scopeByType.get(type);
                if (scope) {
                    if ("pgCodec" in scope) {
                        sharedCodec = scope.pgCodec;
                    }
                }
            }
            else if (hasExactlyOneCodec) {
                sharedCodec = firstCodec;
            }
            if (hasExactlyOneSource) {
                sharedSource = firstSource;
            }
            // TEST: if there's only one path do we still need union?
            const needsPgUnionAll = sharedCodec?.polymorphism?.mode === "union" || paths.length > 1;
            // If we're pulling from a shared codec into a PgUnionAllStep then we can
            // use that codec's attributes as shared attributes; otherwise there are not
            // shared attributes (equivalent to a GraphQL union).
            const unionAttributes = sharedCodec?.attributes;
            // const isUnique = paths.every((p) => p.isUnique);
            const behaviorObj = build.behavior.getCombinedBehaviorForEntities("pgCodecRef", {
                ...(sharedCodec ? { pgCodec: sharedCodec } : null),
                ...(hasExactlyOneSource ? { pgResource: firstSource } : null),
                pgCodecRef: [codec, identifier],
            });
            behavior = behaviorObj.behaviorString;
            // Shortcut simple relation alias
            ({ singleRecordPlan, listPlan, connectionPlan } = (() => {
                // Add forbidden names here
                if (ref.paths.length === 1 && ref.paths[0].length === 1) {
                    const relation = resource.getRelation(ref.paths[0][0].relationName);
                    const remoteResource = relation.remoteResource;
                    return makeRelationPlans(relation.localAttributes, relation.remoteAttributes, remoteResource, isMutationPayload ?? false);
                }
                else if (!needsPgUnionAll) {
                    // Definitely just one chain
                    const path = paths[0];
                    const makePlanResolver = (mode) => {
                        const single = mode === "singleRecord";
                        const isConnection = mode === "connection";
                        const idents = new tamedevil_1.Idents();
                        idents.forbid([
                            "$list",
                            "$in",
                            "$record",
                            "$entry",
                            "$tuple",
                            "list",
                            "sql",
                        ]);
                        const functionLines = [];
                        if (isMutationPayload) {
                            functionLines.push((0, tamedevil_1.default) `return function PgRelationsPlugin_mutation_payload_relation($in) {`);
                            functionLines.push((0, tamedevil_1.default) `  const $record = $in.get("result");`);
                        }
                        else {
                            functionLines.push((0, tamedevil_1.default) `return function PgRelationsPlugin_relation($record) {`);
                        }
                        const finalLayer = path.layers[path.layers.length - 1];
                        const ref_finalLayerResource = tamedevil_1.default.ref(finalLayer.resource, finalLayer.resource.name);
                        const collectionIdentifier = tamedevil_1.default.identifier(`$` + build.inflection.pluralize(finalLayer.resource.name));
                        functionLines.push((0, tamedevil_1.default) `  const ${collectionIdentifier} = ${ref_finalLayerResource}.find();`);
                        // NOTE: do we ever need to make the above `DISTINCT ON (primary key)`?
                        functionLines.push((0, tamedevil_1.default) `  let previousAlias = ${collectionIdentifier}.alias;`);
                        // Process each layer
                        for (let i = path.layers.length - 1; i >= 1; i--) {
                            const layer = path.layers[i];
                            const resource = path.layers[i - 1].resource;
                            const { localAttributes, remoteAttributes } = layer;
                            const ref_resource = tamedevil_1.default.ref(resource, resource.name);
                            const layerAlias = tamedevil_1.default.identifier(resource.name + "Alias");
                            functionLines.push((0, tamedevil_1.default) `  const ${layerAlias} = ${ref_sql}.identifier(Symbol(${tamedevil_1.default.lit(resource.name)}));`);
                            functionLines.push((0, tamedevil_1.default) `  ${collectionIdentifier}.join({
    type: "inner",
    from: ${ref_resource}.from,
    alias: ${layerAlias},
    conditions: [
      ${tamedevil_1.default.join(remoteAttributes.map((remoteAttrName, i) => {
                                return (0, tamedevil_1.default) `${ref_sql}\`\${previousAlias}.\${${ref_sql}.identifier(${tamedevil_1.default.lit(remoteAttrName)})} = \${${layerAlias}}.\${${ref_sql}.identifier(${tamedevil_1.default.lit(localAttributes[i])})}\``;
                            }), ",\n      ")}
    ]
  });`);
                            functionLines.push((0, tamedevil_1.default) `  previousAlias = ${layerAlias};`);
                        }
                        // Now apply `$record`
                        {
                            const firstLayer = path.layers[0];
                            const { localAttributes, remoteAttributes } = firstLayer;
                            remoteAttributes.forEach((remoteAttrName, i) => {
                                functionLines.push((0, tamedevil_1.default) `  ${collectionIdentifier}.where(${ref_sql}\`\${previousAlias}.\${${ref_sql}.identifier(${tamedevil_1.default.lit(remoteAttrName)})} = \${${collectionIdentifier}.placeholder($record.get(${tamedevil_1.default.lit(localAttributes[i])}))}\`);`);
                            });
                        }
                        if (single) {
                            functionLines.push((0, tamedevil_1.default) `  return ${collectionIdentifier}.single();`);
                        }
                        else if (isConnection) {
                            functionLines.push((0, tamedevil_1.default) `  return ${ref_connection}(${collectionIdentifier});`);
                        }
                        else {
                            functionLines.push((0, tamedevil_1.default) `  return ${collectionIdentifier};`);
                        }
                        functionLines.push(tamedevil_1.default.cache `}`);
                        return tamedevil_1.default.runExportable `${tamedevil_1.default.join(functionLines, "\n")}`;
                    };
                    const singleRecordPlan = makePlanResolver("singleRecord");
                    const listPlan = makePlanResolver("list");
                    const connectionPlan = makePlanResolver("connection");
                    return { singleRecordPlan, listPlan, connectionPlan };
                }
                else {
                    // Needs pgUnionAll
                    const makePlanResolver = (mode) => {
                        const single = mode === "singleRecord";
                        const isConnection = mode === "connection";
                        const attributes = unionAttributes ?? {};
                        const resourceByTypeName = Object.create(null);
                        const members = [];
                        for (const path of paths) {
                            const [firstLayer, ...rest] = path.layers;
                            const memberPath = [];
                            let finalResource = firstLayer.resource;
                            for (const layer of rest) {
                                const { relationName } = layer;
                                memberPath.push({ relationName });
                                finalResource = layer.resource;
                            }
                            const typeName = build.inflection.tableType(finalResource.codec);
                            const member = {
                                resource: firstLayer.resource,
                                typeName,
                                path: memberPath,
                            };
                            members.push(member);
                            if (!resourceByTypeName[typeName]) {
                                resourceByTypeName[typeName] = finalResource;
                            }
                        }
                        return (0, graphile_build_1.EXPORTABLE)((attributes, connection, identifier, isConnection, isMutationPayload, members, paths, pgUnionAll, resourceByTypeName, single) => ($parent) => {
                            const $record = isMutationPayload
                                ? $parent.get("result")
                                : $parent;
                            for (let i = 0, l = paths.length; i < l; i++) {
                                const path = paths[i];
                                const firstLayer = path.layers[0];
                                const member = members[i];
                                member.match = firstLayer.localAttributes.reduce((memo, col, idx) => {
                                    memo[firstLayer.remoteAttributes[idx]] = {
                                        step: $record.get(col),
                                    };
                                    return memo;
                                }, Object.create(null));
                            }
                            const $list = pgUnionAll({
                                attributes,
                                resourceByTypeName,
                                members,
                                name: identifier,
                            });
                            if (isConnection) {
                                return connection($list);
                            }
                            else if (single) {
                                return $list.single();
                            }
                            else {
                                return $list;
                            }
                        }, [
                            attributes,
                            grafast_1.connection,
                            identifier,
                            isConnection,
                            isMutationPayload,
                            members,
                            paths,
                            pg_1.pgUnionAll,
                            resourceByTypeName,
                            single,
                        ]);
                    };
                    const singleRecordPlan = makePlanResolver("singleRecord");
                    const listPlan = makePlanResolver("list");
                    const connectionPlan = makePlanResolver("connection");
                    return {
                        singleRecordPlan,
                        listPlan,
                        connectionPlan,
                    };
                }
            })());
        }
        else {
            hasReferencee = true;
            behavior = build.behavior.pgRefDefinitionBehavior(refSpec);
            typeName = refSpec.graphqlType;
            if (!typeName) {
                // ENHANCE: remove this restriction
                throw new Error(`@ref on polymorphic type must declare to:TargetType`);
            }
            const type = build.getTypeByName(typeName);
            if (!type) {
                continue;
            }
            if (refSpec.graphqlType) {
                // If this is a union/interface, can we find the associated codec?
                const scope = build.scopeByType.get(type);
                if (scope) {
                    if ("pgCodec" in scope) {
                        sharedCodec = scope.pgCodec;
                    }
                }
            }
        }
        const connectionTypeName = sharedCodec
            ? build.inflection.tableConnectionType(sharedCodec)
            : build.inflection.connectionType(typeName);
        const singleRecordFieldName = build.inflection.refSingle({
            refDefinition: refSpec,
            identifier,
        });
        const connectionFieldName = build.inflection.refConnection({
            refDefinition: refSpec,
            identifier,
        });
        const listFieldName = build.inflection.refList({
            refDefinition: refSpec,
            identifier,
        });
        if (!hasReferencee && !refSpec.singular) {
            console.warn(`Ignoring non-singular '@ref' with no "referencee" - this probably means you forgot to add 'singular' to your '@ref' spec even though it looks like a "belongs to" relationship. [type: ${Self.name}, codec: ${codec.name}, ref: ${identifier}${codec.extensions?.pg
                ? `, pg: ${codec.extensions?.pg?.serviceName}/${codec.extensions?.pg?.schemaName}.${codec.extensions?.pg?.name}`
                : ``}]`);
        }
        const relationTypeScope = isUnique ? `singularRelation` : `manyRelation`;
        const shouldAddSingleField = isUnique &&
            build.behavior.stringMatches(behavior, `${relationTypeScope}:resource:single`);
        const shouldAddConnectionField = build.behavior.stringMatches(behavior, `${relationTypeScope}:resource:connection`);
        const shouldAddListField = build.behavior.stringMatches(behavior, `${relationTypeScope}:resource:list`);
        const pgRefDetails = ref
            ? {
                registry: build.input.pgRegistry,
                codec,
                ref: ref,
            }
            : undefined;
        const digest = {
            identifier,
            isReferencee: hasReferencee,
            pgCodec: sharedCodec,
            pgResource: sharedSource,
            isUnique,
            relationTypeScope,
            shouldAddSingleField,
            shouldAddConnectionField,
            shouldAddListField,
            typeName,
            connectionTypeName,
            singleRecordFieldName,
            connectionFieldName,
            listFieldName,
            singleRecordPlan,
            listPlan,
            connectionPlan,
            pgRefDetails,
            relatedTypeName: context.Self.name,
            isNonNull: ref?.extensions?.tags.notNull,
        };
        digests.push(digest);
    }
    return digests.reduce((memo, digest) => {
        const { isUnique, relationTypeScope, shouldAddSingleField, shouldAddConnectionField, shouldAddListField, typeName, connectionTypeName, deprecationReason, singleRecordFieldName, listFieldName, connectionFieldName, singleRecordPlan, listPlan, connectionPlan, isReferencee, identifier, description, pgResource: pgFieldResource, pgCodec: pgFieldCodec, pgRelationDetails, pgRefDetails, relatedTypeName, } = digest;
        const OtherType = build.getTypeByName(typeName);
        if (!OtherType ||
            !(OtherType instanceof GraphQLObjectType ||
                OtherType instanceof GraphQLInterfaceType ||
                OtherType instanceof GraphQLUnionType)) {
            return memo;
        }
        let fields = memo;
        if (isUnique && shouldAddSingleField) {
            const fieldName = singleRecordFieldName;
            fields = extend(fields, {
                [fieldName]: fieldWithHooks({
                    fieldName,
                    fieldBehaviorScope: `${relationTypeScope}:resource:single`,
                    isPgSingleRelationField: true,
                    pgRelationDetails,
                    pgRefDetails,
                }, {
                    description: description ??
                        `Reads a single \`${typeName}\` that is related to this \`${relatedTypeName}\`.`,
                    // Defaults to nullable due to RLS
                    type: build.nullableIf(!digest.isNonNull, OtherType),
                    plan: singleRecordPlan,
                    deprecationReason,
                }),
            }, `Adding field to GraphQL type '${Self.name}' for singular relation '${identifier}'`, "recoverable");
        }
        if (isReferencee && shouldAddConnectionField) {
            const ConnectionType = build.getTypeByName(connectionTypeName);
            if (ConnectionType) {
                const fieldName = connectionFieldName;
                fields = extend(fields, {
                    [fieldName]: fieldWithHooks({
                        fieldName,
                        fieldBehaviorScope: `${relationTypeScope}:resource:connection`,
                        pgFieldResource: pgFieldResource,
                        pgFieldCodec,
                        isPgFieldConnection: true,
                        isPgManyRelationConnectionField: true,
                        pgRelationDetails,
                        pgRefDetails,
                    }, {
                        description: description ??
                            `Reads and enables pagination through a set of \`${typeName}\`.`,
                        type: new GraphQLNonNull(ConnectionType),
                        plan: connectionPlan,
                        deprecationReason,
                    }),
                }, `Adding '${identifier}' many relation connection field to ${Self.name}`, "recoverable");
            }
            else {
                console.log(`Could not find connection type '${connectionTypeName}'`);
            }
        }
        if (isReferencee && shouldAddListField) {
            const fieldName = listFieldName;
            fields = extend(fields, {
                [fieldName]: fieldWithHooks({
                    fieldName,
                    fieldBehaviorScope: `${relationTypeScope}:resource:list`,
                    pgFieldResource: pgFieldResource,
                    pgFieldCodec,
                    isPgFieldSimpleCollection: true,
                    isPgManyRelationListField: true,
                    pgRelationDetails,
                    pgRefDetails,
                }, {
                    description: description ??
                        `Reads and enables pagination through a set of \`${typeName}\`.`,
                    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(OtherType))),
                    plan: listPlan,
                    deprecationReason,
                }),
            }, `Adding '${identifier}' many relation list field to ${Self.name}`, "recoverable");
        }
        return fields;
    }, fields);
}
function combineBehaviors(a, b) {
    const aArr = Array.isArray(a) ? a : a ? [a] : [];
    const bArr = Array.isArray(b) ? b : b ? [b] : [];
    return [...aArr, ...bArr];
}
//# sourceMappingURL=PgRelationsPlugin.js.map