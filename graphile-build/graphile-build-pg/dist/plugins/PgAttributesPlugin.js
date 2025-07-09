"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgAttributesPlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
function processAttribute(fields, build, context, attributeName, overrideName, isNotNull) {
    const { extend, inflection } = build;
    const { scope: { pgCodec: rawPgCodec }, Self, } = context;
    if (!rawPgCodec || !rawPgCodec.attributes) {
        return;
    }
    const pgCodec = rawPgCodec;
    const isInterface = context.type === "GraphQLInterfaceType";
    const attribute = pgCodec.attributes[attributeName];
    if (!build.behavior.pgCodecAttributeMatches([pgCodec, attributeName], "attribute:select")) {
        // Don't allow selecting this attribute.
        return;
    }
    const attributeFieldName = overrideName ??
        inflection.attribute({
            attributeName,
            codec: pgCodec,
        });
    const resolveResult = build.pgResolveOutputType(attribute.codec, isNotNull || attribute.notNull || attribute.extensions?.tags?.notNull);
    if (!resolveResult) {
        console.warn(`Couldn't find a 'output' variant for PgCodec ${pgCodec.name}'s '${attributeName}' attribute (${attribute.codec.name}; array=${!!attribute.codec.arrayOfCodec}, domain=${!!attribute.codec
            .domainOfCodec}, enum=${!!attribute.codec.values})`);
        return;
    }
    const [baseCodec, type] = resolveResult;
    const fieldSpec = {
        description: attribute.description,
        type: type,
    };
    const resource = baseCodec.attributes
        ? build.pgTableResource(baseCodec, false)
        : null;
    if (baseCodec.attributes && !resource) {
        // We can't load codecs with attributes unless we know the executor.
        return;
    }
    if (!isInterface) {
        const makePlan = () => {
            // See if there's a resource to pull record types from (e.g. for relations/etc)
            if (!baseCodec.attributes) {
                // Simply get the value
                if (attributeName === attributeFieldName) {
                    // Use default getter
                    return undefined;
                }
                return (0, graphile_build_1.EXPORTABLE)((attributeName) => ($record) => {
                    return $record.get(attributeName);
                }, [attributeName]);
            }
            else {
                if (!resource) {
                    // This error only exists to satisfy TypeScript
                    throw new Error("This should be unreachable");
                }
                // ENHANCE: this is pretty horrible in the export; we should fix that.
                if (!attribute.codec.arrayOfCodec) {
                    const notNull = attribute.notNull || attribute.codec.notNull;
                    // Single record from resource
                    /*
                     * ENHANCE: if we refactor `PgSelectSingleStep` we can probably
                     * optimise this to do inline selection and still join against
                     * the base table using e.g. `(table.column).attribute =
                     * joined_thing.column`
                     */
                    return (0, graphile_build_1.EXPORTABLE)((attributeName, notNull, pgSelectSingleFromRecord, resource) => ($record) => {
                        const $plan = $record.get(attributeName);
                        const $select = pgSelectSingleFromRecord(resource, $plan);
                        if (notNull) {
                            $select.coalesceToEmptyObject();
                        }
                        $select.getClassStep().setTrusted();
                        return $select;
                    }, [attributeName, notNull, pg_1.pgSelectSingleFromRecord, resource]);
                }
                else if (attribute.codec.arrayOfCodec.arrayOfCodec?.arrayOfCodec) {
                    throw new Error("Triple nested arrays are currently unsupported... Feel free to send a PR that refactors this whole section!");
                }
                else if (attribute.codec.arrayOfCodec.arrayOfCodec) {
                    return (0, graphile_build_1.EXPORTABLE)((attributeName, each, pgSelectFromRecords, resource) => ($record) => {
                        const $val = $record.get(attributeName);
                        return each($val, ($list) => {
                            const $select = pgSelectFromRecords(resource, $list);
                            $select.setTrusted();
                            return $select;
                        });
                    }, [attributeName, grafast_1.each, pg_1.pgSelectFromRecords, resource]);
                }
                else {
                    // atrribute.codec.arrayOfCodec is set
                    // Many records from resource
                    return (0, graphile_build_1.EXPORTABLE)((attributeName, pgSelectFromRecords, resource) => ($record) => {
                        const $val = $record.get(attributeName);
                        const $select = pgSelectFromRecords(resource, $val);
                        $select.setTrusted();
                        return $select;
                    }, [attributeName, pg_1.pgSelectFromRecords, resource]);
                }
            }
        };
        fieldSpec.plan = makePlan();
    }
    fields = extend(fields, {
        [attributeFieldName]: context.fieldWithHooks({
            fieldName: attributeFieldName,
            pgFieldAttribute: attribute,
        }, fieldSpec),
    }, `Adding '${attributeName}' attribute field to GraphQL type '${Self.name}' (representing PgCodec '${pgCodec.name}')`);
}
exports.PgAttributesPlugin = {
    name: "PgAttributesPlugin",
    description: "Adds PostgreSQL attributes (columns) to the relevant GraphQL object/input object types",
    version: version_js_1.version,
    after: ["PgTablesPlugin"],
    inflection: {
        add: {
            _attributeName(options, { attributeName, codec, skipRowId }) {
                const attribute = codec.attributes[attributeName];
                const name = attribute.extensions?.tags?.name || attributeName;
                // Avoid conflict with 'id' field used for Relay.
                const nonconflictName = !skipRowId && name === "id" && !codec.isAnonymous ? "row_id" : name;
                return this.coerceToGraphQLName(nonconflictName);
            },
            _joinAttributeNames(options, codec, names) {
                return names
                    .map((attributeName) => this._attributeName({ attributeName, codec }))
                    .join("-and-");
            },
            attribute(options, details) {
                return this.camelCase(this._attributeName(details));
            },
        },
    },
    schema: {
        behaviorRegistry: {
            add: {
                "attribute:select": {
                    description: "can this attribute be selected?",
                    entities: ["pgCodecAttribute"],
                },
                "attribute:insert": {
                    description: "can this attribute be written on create?",
                    entities: ["pgCodecAttribute"],
                },
                "attribute:update": {
                    description: "can this attribute be updated?",
                    entities: ["pgCodecAttribute"],
                },
                "attribute:base": {
                    description: "should we add this attribute to the 'base' input type?",
                    entities: ["pgCodecAttribute"],
                },
                "attribute:filterBy": {
                    description: "can we filter by this attribute?",
                    entities: ["pgCodecAttribute"],
                },
                "condition:attribute:filterBy": {
                    description: "can we filter by this attribute in the `condition` argument?",
                    entities: ["pgCodecAttribute"],
                },
                "attribute:orderBy": {
                    description: "can we order by this attribute?",
                    entities: ["pgCodecAttribute"],
                },
            },
        },
        entityBehavior: {
            pgCodecAttribute: {
                inferred: {
                    provides: ["default"],
                    before: ["inferred", "override"],
                    callback(behavior, [codec, attributeName]) {
                        const behaviors = new Set([
                            "select",
                            "base",
                            "update",
                            "insert",
                            "filterBy",
                            "orderBy",
                        ]);
                        const attribute = codec.attributes[attributeName];
                        function walk(codec) {
                            if (codec.arrayOfCodec) {
                                behaviors.add("-condition:attribute:filterBy");
                                behaviors.add(`-attribute:orderBy`);
                                walk(codec.arrayOfCodec);
                            }
                            else if (codec.rangeOfCodec) {
                                behaviors.add(`-condition:attribute:filterBy`);
                                behaviors.add(`-attribute:orderBy`);
                                walk(codec.rangeOfCodec);
                            }
                            else if (codec.domainOfCodec) {
                                // No need to add a behavior for domain
                                walk(codec.domainOfCodec);
                            }
                            else if (codec.attributes) {
                                behaviors.add(`-condition:attribute:filterBy`);
                                behaviors.add(`-attribute:orderBy`);
                            }
                            else if (codec.isBinary) {
                                // Never filter, not in condition plugin nor any other
                                behaviors.add(`-attribute:filterBy`);
                                behaviors.add(`-attribute:orderBy`);
                            }
                            else {
                                // Done
                            }
                        }
                        walk(attribute.codec);
                        return [...behaviors, behavior];
                    },
                },
            },
        },
        hooks: {
            build(build) {
                return build.extend(build, {
                    pgResolveOutputType(codec, notNull) {
                        return resolveOutputType(build, codec, notNull);
                    },
                }, "Adding helpers from PgAttributesPlugin");
            },
            GraphQLInterfaceType_fields(fields, build, context) {
                const { scope: { pgCodec, pgPolymorphism }, } = context;
                if (!pgPolymorphism || !pgCodec?.attributes) {
                    return fields;
                }
                for (const attributeName in pgCodec.attributes) {
                    switch (pgPolymorphism.mode) {
                        case "single": {
                            if (!pgPolymorphism.commonAttributes.includes(attributeName)) {
                                continue;
                            }
                            break;
                        }
                        case "relational": {
                            break;
                        }
                        case "union": {
                            break;
                        }
                        default: {
                            const never = pgPolymorphism;
                            throw new Error(`Unhandled polymorphism mode ${never.mode}}`);
                        }
                    }
                    processAttribute(fields, build, context, attributeName);
                }
                return fields;
            },
            GraphQLObjectType_fields(fields, build, context) {
                const { scope: { pgCodec, isPgClassType, pgPolymorphism, pgPolymorphicSingleTableType, }, } = context;
                if (!isPgClassType || !pgCodec?.attributes) {
                    return fields;
                }
                for (const attributeName in pgCodec.attributes) {
                    let overrideName = undefined;
                    let isNotNull = undefined;
                    if (pgPolymorphism) {
                        switch (pgPolymorphism.mode) {
                            case "single": {
                                const match = pgPolymorphicSingleTableType?.attributes.find((c) => c.attribute === attributeName);
                                if (!pgPolymorphism.commonAttributes.includes(attributeName) &&
                                    !match) {
                                    continue;
                                }
                                if (match?.rename) {
                                    overrideName = match.rename;
                                }
                                isNotNull = match?.isNotNull;
                                break;
                            }
                            case "relational": {
                                break;
                            }
                            case "union": {
                                break;
                            }
                            default: {
                                const never = pgPolymorphism;
                                throw new Error(`Unhandled polymorphism mode ${never.mode}}`);
                            }
                        }
                    }
                    processAttribute(fields, build, context, attributeName, overrideName, isNotNull);
                }
                return fields;
            },
            GraphQLInputObjectType_fields(fields, build, context) {
                const { extend, inflection, sql, graphql: { isInputType }, } = build;
                const { scope: { isPgRowType, isPgCompoundType, isPgPatch, isPgBaseInput, pgCodec: rawPgCodec, isPgCondition, }, fieldWithHooks, } = context;
                if (!(isPgRowType || isPgCompoundType || isPgCondition) ||
                    !rawPgCodec ||
                    !rawPgCodec.attributes ||
                    rawPgCodec.isAnonymous) {
                    return fields;
                }
                const pgCodec = rawPgCodec;
                const allAttributes = pgCodec.attributes;
                const allowedAttributes = pgCodec.polymorphism?.mode === "single"
                    ? [
                        ...pgCodec.polymorphism.commonAttributes,
                        // ENHANCE: add condition input type for the underlying concrete types, which should also include something like:
                        /*
                          ...(pgPolymorphicSingleTableType
                            ? pgCodec.polymorphism.types[
                                pgPolymorphicSingleTableType.typeIdentifier
                              ].attributes.map(
                                (attr) =>
                                  // FIX*ME: we should be factoring in the attr.rename
                                  attr.attribute,
                              )
                            : []),
                          */
                    ]
                    : null;
                const attributes = allowedAttributes
                    ? Object.fromEntries(Object.entries(allAttributes).filter(([attrName, _attr]) => allowedAttributes.includes(attrName)))
                    : allAttributes;
                return Object.entries(attributes).reduce((memo, [attributeName, attribute]) => build.recoverable(memo, () => {
                    const fieldBehaviorScope = isPgBaseInput
                        ? `attribute:base`
                        : isPgPatch
                            ? `attribute:update`
                            : isPgCondition
                                ? `condition:attribute:filterBy`
                                : `attribute:insert`;
                    if (!build.behavior.pgCodecAttributeMatches([pgCodec, attributeName], fieldBehaviorScope)) {
                        return memo;
                    }
                    const fieldName = inflection.attribute({
                        attributeName,
                        codec: pgCodec,
                    });
                    if (memo[fieldName]) {
                        throw new Error(`Two attributes produce the same GraphQL field name '${fieldName}' on input PgCodec '${pgCodec.name}'; one of them is '${attributeName}'`);
                    }
                    const attributeCodec = attribute.codec;
                    const attributeType = build.getGraphQLTypeByPgCodec(attributeCodec, "input");
                    if (!attributeType) {
                        return memo;
                    }
                    if (!isInputType(attributeType)) {
                        throw new Error(`Expected ${attributeType} to be an input type`);
                    }
                    return extend(memo, {
                        [fieldName]: fieldWithHooks({
                            fieldName,
                            fieldBehaviorScope,
                            pgCodec,
                            pgAttribute: attribute,
                            isPgConnectionConditionInputField: isPgCondition,
                        }, {
                            description: isPgCondition
                                ? build.wrapDescription(`Checks for equality with the object’s \`${fieldName}\` field.`, "field")
                                : attribute.description,
                            type: build.nullableIf(isPgBaseInput ||
                                isPgPatch ||
                                isPgCondition ||
                                (!attribute.notNull &&
                                    !attribute.extensions?.tags?.notNull) ||
                                attribute.hasDefault ||
                                Boolean(attribute.extensions?.tags?.hasDefault), attributeType),
                            apply: isPgCondition
                                ? (0, graphile_build_1.EXPORTABLE)((attributeCodec, attributeName, sql, sqlValueWithCodec) => function plan($condition, val) {
                                    $condition.where({
                                        type: "attribute",
                                        attribute: attributeName,
                                        callback: (expression) => val === null
                                            ? sql `${expression} is null`
                                            : sql `${expression} = ${sqlValueWithCodec(val, attributeCodec)}`,
                                    });
                                }, [
                                    attributeCodec,
                                    attributeName,
                                    sql,
                                    pg_1.sqlValueWithCodec,
                                ])
                                : (0, graphile_build_1.EXPORTABLE)((attributeName, bakedInputRuntime) => function plan(obj, val, { field, schema }) {
                                    obj.set(attributeName, bakedInputRuntime(schema, field.type, val));
                                }, [attributeName, grafast_1.bakedInputRuntime]),
                        }),
                    }, `Adding input object field for ${pgCodec.name}.`);
                }), fields);
            },
        },
    },
};
function resolveOutputType(build, codec, notNull) {
    const { getGraphQLTypeByPgCodec, graphql: { GraphQLList, GraphQLNonNull, getNullableType, isOutputType }, } = build;
    if (codec.arrayOfCodec) {
        const resolvedResult = resolveOutputType(build, codec.arrayOfCodec);
        if (!resolvedResult) {
            return null;
        }
        const [innerCodec, innerType] = resolvedResult;
        const nullableType = new GraphQLList(innerType);
        const type = notNull || codec.notNull
            ? new GraphQLNonNull(nullableType)
            : nullableType;
        return [innerCodec, type];
    }
    else {
        const baseType = getGraphQLTypeByPgCodec(codec, "output");
        if (!baseType || !isOutputType(baseType)) {
            return null;
        }
        const type = notNull || codec.notNull
            ? new GraphQLNonNull(getNullableType(baseType))
            : baseType;
        return [codec, type];
    }
}
//# sourceMappingURL=PgAttributesPlugin.js.map