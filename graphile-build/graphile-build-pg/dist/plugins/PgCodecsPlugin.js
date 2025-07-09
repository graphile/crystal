"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgCodecsPlugin = void 0;
const pg_1 = require("@dataplan/pg");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.PgCodecsPlugin = {
    name: "PgCodecsPlugin",
    description: "Turns PostgreSQL types into @dataplan/pg codecs",
    version: version_js_1.version,
    after: ["PgIntrospectionPlugin"],
    inflection: {
        add: {
            classCodecName(options, { pgClass, serviceName }) {
                const typeTags = pgClass.getType().getTags();
                const classTags = pgClass.getTags();
                if (typeof typeTags?.name === "string") {
                    return typeTags.name;
                }
                if (typeof classTags?.name === "string") {
                    return classTags.name;
                }
                const pgNamespace = pgClass.getNamespace();
                const schemaPrefix = this._schemaPrefix({ pgNamespace, serviceName });
                return this.camelCase(`${schemaPrefix}${pgClass.relname}`);
            },
            typeCodecName(options, { pgType, serviceName }) {
                const pgNamespace = pgType.getNamespace();
                const schemaPrefix = this._schemaPrefix({ pgNamespace, serviceName });
                const name = pgType.typcategory === "A" && pgType.typname.startsWith("_")
                    ? pgType.typname.substring(1) + "_array"
                    : pgType.typname;
                return this.camelCase(`${schemaPrefix}${name}`);
            },
            scalarCodecTypeName(options, codec) {
                return this.upperCamelCase(this.coerceToGraphQLName(codec.extensions?.tags?.name ?? codec.name));
            },
            enumType(options, codec) {
                return this.scalarCodecTypeName(codec);
            },
            enumValue(options, inValue) {
                let value = inValue;
                if (value === "") {
                    return "_EMPTY_";
                }
                // Some enums use asterisks to signify wildcards - this might be for
                // the whole item, or prefixes/suffixes, or even in the middle.  This
                // is provided on a best efforts basis, if it doesn't suit your
                // purposes then please pass a custom inflector as mentioned below.
                value = value
                    .replace(/\*/g, "_ASTERISK_")
                    .replace(/^(_?)_+ASTERISK/, "$1ASTERISK")
                    .replace(/ASTERISK_(_?)_*$/, "ASTERISK$1");
                // This is a best efforts replacement for common symbols that you
                // might find in enums. Generally we only support enums that are
                // alphanumeric, if these replacements don't work for you, you should
                // pass a custom inflector that replaces this `enumName` method
                // with one of your own chosing.
                value =
                    {
                        // SQL comparison operators
                        ">": "GREATER_THAN",
                        ">=": "GREATER_THAN_OR_EQUAL",
                        "=": "EQUAL",
                        "!=": "NOT_EQUAL",
                        "<>": "DIFFERENT",
                        "<=": "LESS_THAN_OR_EQUAL",
                        "<": "LESS_THAN",
                        // PostgreSQL LIKE shortcuts
                        "~~": "LIKE",
                        "~~*": "ILIKE",
                        "!~~": "NOT_LIKE",
                        "!~~*": "NOT_ILIKE",
                        // '~' doesn't necessarily represent regexps, but the three
                        // operators following it likely do, so we'll use the word TILDE
                        // in all for consistency.
                        "~": "TILDE",
                        "~*": "TILDE_ASTERISK",
                        "!~": "NOT_TILDE",
                        "!~*": "NOT_TILDE_ASTERISK",
                        // A number of other symbols where we're not sure of their
                        // meaning.  We give them common generic names so that they're
                        // suitable for multiple purposes, e.g. favouring 'PLUS' over
                        // 'ADDITION' and 'DOT' over 'FULL_STOP'
                        "%": "PERCENT",
                        "+": "PLUS",
                        "-": "MINUS",
                        "/": "SLASH",
                        "\\": "BACKSLASH",
                        _: "UNDERSCORE",
                        "#": "POUND",
                        "£": "STERLING",
                        $: "DOLLAR",
                        "&": "AMPERSAND",
                        "@": "AT",
                        "'": "APOSTROPHE",
                        '"': "QUOTE",
                        "`": "BACKTICK",
                        ":": "COLON",
                        ";": "SEMICOLON",
                        "!": "EXCLAMATION_POINT",
                        "?": "QUESTION_MARK",
                        ",": "COMMA",
                        ".": "DOT",
                        "^": "CARET",
                        "|": "BAR",
                        "[": "OPEN_BRACKET",
                        "]": "CLOSE_BRACKET",
                        "(": "OPEN_PARENTHESIS",
                        ")": "CLOSE_PARENTHESIS",
                        "{": "OPEN_BRACE",
                        "}": "CLOSE_BRACE",
                    }[value] || value;
                return this.coerceToGraphQLName(value);
            },
            rangeBoundType(options, { underlyingTypeName }) {
                return `${underlyingTypeName}RangeBound`;
            },
            rangeType(options, { underlyingTypeName }) {
                return `${underlyingTypeName}Range`;
            },
        },
    },
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgCodecs",
        initialState: () => ({
            codecByTypeIdByDatabaseName: new Map(),
            codecByClassIdByDatabaseName: new Map(),
        }),
        helpers: {
            getCodecFromClass(info, serviceName, classId) {
                let map = info.state.codecByClassIdByDatabaseName.get(serviceName);
                if (!map) {
                    map = new Map();
                    info.state.codecByClassIdByDatabaseName.set(serviceName, map);
                }
                if (map.has(classId)) {
                    return map.get(classId);
                }
                const promise = (async () => {
                    const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                    if (!pgClass) {
                        return null;
                    }
                    const namespace = await info.helpers.pgIntrospection.getNamespace(serviceName, pgClass.relnamespace);
                    if (!namespace) {
                        throw new Error(`Could not retrieve namespace for table '${pgClass._id}'`);
                    }
                    const attributes = Object.create(null);
                    const allAttributes = await info.helpers.pgIntrospection.getAttributesForClass(serviceName, pgClass._id);
                    const attributeAttributes = allAttributes
                        .filter((attr) => attr.attnum >= 1 && attr.attisdropped != true)
                        .sort((a, z) => a.attnum - z.attnum);
                    let hasAtLeastOneAttribute = false;
                    for (const attributeAttribute of attributeAttributes) {
                        const attributeCodec = await info.helpers.pgCodecs.getCodecFromType(serviceName, attributeAttribute.atttypid, attributeAttribute.atttypmod);
                        const { tags: rawTags, description } = attributeAttribute.getTagsAndDescription();
                        if (attributeCodec) {
                            hasAtLeastOneAttribute = true;
                            // Mutate at will!
                            const tags = JSON.parse(JSON.stringify(rawTags));
                            const extensions = {
                                tags,
                            };
                            if (attributeAttribute.attidentity === "a") {
                                // Generated ALWAYS so no insert/update
                                extensions.isInsertable = false;
                                extensions.isUpdatable = false;
                            }
                            attributes[attributeAttribute.attname] = {
                                description,
                                codec: attributeCodec,
                                notNull: attributeAttribute.attnotnull === true ||
                                    attributeAttribute.getType()?.typnotnull === true,
                                hasDefault: (attributeAttribute.atthasdef ?? undefined) ||
                                    (attributeAttribute.attgenerated != null &&
                                        attributeAttribute.attgenerated !== "") ||
                                    (attributeAttribute.attidentity != null &&
                                        attributeAttribute.attidentity !== "") ||
                                    attributeAttribute.getType()?.typdefault != null,
                                // PERF: identicalVia,
                                extensions,
                            };
                            await info.process("pgCodecs_attribute", {
                                serviceName,
                                pgClass,
                                pgAttribute: attributeAttribute,
                                attribute: attributes[attributeAttribute.attname],
                            });
                        }
                    }
                    if (!hasAtLeastOneAttribute) {
                        console.warn(`Skipped ${pgClass.relname} because we couldn't give it any attributes`);
                        return null;
                    }
                    const nspName = namespace.nspname;
                    const className = pgClass.relname;
                    const codecName = info.inflection.classCodecName({
                        serviceName,
                        pgClass,
                    });
                    const pgType = pgClass.getType();
                    const typeTagsAndDescription = pgType.getTagsAndDescription();
                    const classTagsAndDescription = pgClass.getTagsAndDescription();
                    // Copy tags from the PgClass, but tags on PgType overwrite
                    const tags = Object.assign(Object.create(null), classTagsAndDescription.tags, typeTagsAndDescription.tags);
                    const description = typeTagsAndDescription.description ??
                        classTagsAndDescription.description;
                    // Do NOT mark `extensions` as `EXPORTABLE` otherwise changes
                    // implemented through hooks will not be represented in the export.
                    const extensions = {
                        oid: pgClass.reltype,
                        isTableLike: ["r", "v", "m", "f", "p"].includes(pgClass.relkind),
                        pg: {
                            serviceName,
                            schemaName: pgClass.getNamespace().nspname,
                            name: pgClass.relname,
                            ...(pgClass.relpersistence !== "p"
                                ? {
                                    persistence: pgClass.relpersistence,
                                }
                                : null),
                        },
                        tags,
                    };
                    const executor = info.helpers.pgIntrospection.getExecutorForService(serviceName);
                    const sqlIdent = info.helpers.pgBasics.identifier(nspName, className);
                    (0, utils_js_1.exportNameHint)(sqlIdent, `${codecName}Identifier`);
                    (0, utils_js_1.exportNameHint)(attributes, `${codecName}Attributes`);
                    // Do NOT mark `spec` as `EXPORTABLE` otherwise the changes from
                    // `pgCodecs_recordType_spec` won't be represented in the export.
                    const spec = {
                        name: codecName,
                        identifier: sqlIdent,
                        attributes,
                        description,
                        extensions,
                        executor,
                    };
                    await info.process("pgCodecs_recordType_spec", {
                        serviceName,
                        pgClass,
                        spec,
                    });
                    const codec = (0, graphile_build_1.EXPORTABLE)((recordCodec, spec) => recordCodec(spec), [pg_1.recordCodec, spec], `${spec.name}Codec`);
                    await info.process("pgCodecs_PgCodec", {
                        pgCodec: codec,
                        pgType: pgClass.getType(),
                        pgClass,
                        serviceName,
                    });
                    return codec;
                })();
                map.set(classId, promise);
                return promise;
            },
            getCodecFromType(info, serviceName, typeId, typeModifier) {
                let map = info.state.codecByTypeIdByDatabaseName.get(serviceName);
                if (!map) {
                    map = new Map();
                    info.state.codecByTypeIdByDatabaseName.set(serviceName, map);
                }
                if (map.has(typeId)) {
                    return map.get(typeId);
                }
                const promise = (async () => {
                    const type = await info.helpers.pgIntrospection.getType(serviceName, typeId);
                    if (!type) {
                        return null;
                    }
                    // Class types are handled via getCodecFromClass (they have to add attributes)
                    if (type.typtype === "c") {
                        return info.helpers.pgCodecs.getCodecFromClass(serviceName, type.typrelid);
                    }
                    const event = {
                        pgCodec: null,
                        pgType: type,
                        typeModifier,
                        serviceName,
                    };
                    await info.process("pgCodecs_findPgCodec", event);
                    if (event.pgCodec) {
                        const codec = event.pgCodec;
                        // Be careful not to call this for class codecs!
                        await info.process("pgCodecs_PgCodec", {
                            pgCodec: codec,
                            pgType: type,
                            serviceName,
                        });
                        return codec;
                    }
                    else {
                        console.dir(event);
                        console.warn(`Could not build PgCodec for '${type.getNamespace()?.nspname ?? "??"}.${type.typname}'; maybe you need a plugin implementing gather.hooks.pgCodecs_findPgCodec to add support.`);
                        return null;
                    }
                })();
                map.set(typeId, promise);
                return promise;
            },
        },
        hooks: {
            async pgCodecs_findPgCodec(info, event) {
                if (event.pgCodec) {
                    // Another plugin has already supplied a codec; skip
                    return;
                }
                const { serviceName, pgType: type, typeModifier } = event;
                const namespace = type.getNamespace();
                if (!namespace) {
                    throw new Error(`Could not get namespace '${type.typnamespace}'`);
                }
                const namespaceName = namespace.nspname;
                const pgCatalog = await info.helpers.pgIntrospection.getNamespaceByName(serviceName, "pg_catalog");
                if (!pgCatalog) {
                    return;
                }
                // For the standard pg_catalog types, we have standard handling.
                // (In v4 we used OIDs for this, but using the name is safer for PostgreSQL-likes.)
                if (type.typnamespace == pgCatalog._id) {
                    const knownType = (0, pg_1.getCodecByPgCatalogTypeName)(type.typname);
                    if (knownType) {
                        event.pgCodec = knownType;
                        return;
                    }
                }
                const citextExt = await info.helpers.pgIntrospection.getExtensionByName(serviceName, "citext");
                const hstoreExt = await info.helpers.pgIntrospection.getExtensionByName(serviceName, "hstore");
                if (type.typname === "citext" &&
                    type.typnamespace === citextExt?.extnamespace) {
                    event.pgCodec = pg_1.TYPES.citext;
                    return;
                }
                else if (type.typname === "hstore" &&
                    type.typnamespace === hstoreExt?.extnamespace) {
                    event.pgCodec = pg_1.TYPES.hstore;
                    return;
                }
                // Enum type
                if (type.typtype === "e") {
                    const enumValues = await info.helpers.pgIntrospection.getEnumsForType(serviceName, type._id);
                    const typeName = type.typname;
                    const codecName = info.inflection.typeCodecName({
                        pgType: type,
                        serviceName,
                    });
                    const enumLabels = enumValues.map((e) => e.enumlabel);
                    const { tags, description } = type.getTagsAndDescription();
                    const extensions = {
                        oid: type._id,
                        pg: {
                            serviceName,
                            schemaName: type.getNamespace().nspname,
                            name: type.typname,
                        },
                        tags,
                    };
                    await info.process("pgCodecs_enumType_extensions", {
                        serviceName,
                        pgType: type,
                        extensions,
                    });
                    const sqlIdent = info.helpers.pgBasics.identifier(namespaceName, typeName);
                    event.pgCodec = (0, graphile_build_1.EXPORTABLE)((codecName, description, enumCodec, enumLabels, extensions, sqlIdent) => enumCodec({
                        name: codecName,
                        identifier: sqlIdent,
                        values: enumLabels,
                        description,
                        extensions,
                    }), [
                        codecName,
                        description,
                        pg_1.enumCodec,
                        enumLabels,
                        extensions,
                        sqlIdent,
                    ], `${codecName}Codec`);
                    return;
                }
                // Range type
                if (type.typtype === "r") {
                    const range = await info.helpers.pgIntrospection.getRangeByType(serviceName, type._id);
                    if (!range) {
                        throw new Error(`Failed to get range entry related to '${type._id}'`);
                    }
                    const innerCodec = (await info.helpers.pgCodecs.getCodecFromType(serviceName, range.rngsubtype));
                    const namespaceName = namespace.nspname;
                    const typeName = type.typname;
                    if (!innerCodec) {
                        console.warn(`PgCodec could not build codec for '${namespaceName}.${typeName}', we don't know how to process the subtype`);
                        return;
                    }
                    const codecName = info.inflection.typeCodecName({
                        pgType: type,
                        serviceName,
                    });
                    const { tags, description } = type.getTagsAndDescription();
                    const extensions = {
                        oid: type._id,
                        pg: {
                            serviceName,
                            schemaName: type.getNamespace().nspname,
                            name: type.typname,
                        },
                        tags,
                    };
                    await info.process("pgCodecs_rangeOfCodec_extensions", {
                        serviceName,
                        pgType: type,
                        innerCodec,
                        extensions,
                    });
                    const sqlIdent = info.helpers.pgBasics.identifier(namespaceName, typeName);
                    event.pgCodec = (0, graphile_build_1.EXPORTABLE)((codecName, description, extensions, innerCodec, rangeOfCodec, sqlIdent) => rangeOfCodec(innerCodec, codecName, sqlIdent, {
                        description,
                        extensions,
                    }), [
                        codecName,
                        description,
                        extensions,
                        innerCodec,
                        pg_1.rangeOfCodec,
                        sqlIdent,
                    ], `${codecName}Codec`);
                    return;
                }
                // Domains are wrappers under an underlying type
                if (type.typtype === "d") {
                    const { typnotnull: notNull, typbasetype: baseTypeOid, typtypmod: baseTypeModifier, typndims: _numberOfArrayDimensions, typcollation: _domainCollation, typdefaultbin: _defaultValueNodeTree, } = type;
                    const innerCodec = baseTypeOid
                        ? await info.helpers.pgCodecs.getCodecFromType(serviceName, baseTypeOid, baseTypeModifier)
                        : null;
                    const namespaceName = namespace.nspname;
                    const typeName = type.typname;
                    if (innerCodec) {
                        const { tags, description } = type.getTagsAndDescription();
                        const extensions = {
                            oid: type._id,
                            pg: {
                                serviceName,
                                schemaName: type.getNamespace().nspname,
                                name: type.typname,
                            },
                            tags,
                        };
                        await info.process("pgCodecs_domainOfCodec_extensions", {
                            serviceName,
                            pgType: type,
                            innerCodec,
                            extensions,
                        });
                        const codecName = info.inflection.typeCodecName({
                            pgType: type,
                            serviceName,
                        });
                        const sqlIdent = info.helpers.pgBasics.identifier(namespaceName, typeName);
                        (0, utils_js_1.exportNameHint)(sqlIdent, `${codecName}Identifier`);
                        event.pgCodec = (0, graphile_build_1.EXPORTABLE)((codecName, description, domainOfCodec, extensions, innerCodec, notNull, sqlIdent) => domainOfCodec(innerCodec, codecName, sqlIdent, {
                            description,
                            extensions,
                            notNull,
                        }), [
                            codecName,
                            description,
                            pg_1.domainOfCodec,
                            extensions,
                            innerCodec,
                            notNull,
                            sqlIdent,
                        ], `${codecName}Codec`);
                        return;
                    }
                }
                // Array types are just listOfCodec() of their inner type
                if (type.typcategory === "A") {
                    const innerType = await info.helpers.pgIntrospection.getTypeByArray(serviceName, type._id);
                    if (innerType) {
                        const innerCodec = (await info.helpers.pgCodecs.getCodecFromType(serviceName, innerType._id, typeModifier));
                        if (innerCodec) {
                            const typeDelim = innerType.typdelim;
                            const { tags, description } = type.getTagsAndDescription();
                            const extensions = {
                                oid: type._id,
                                pg: {
                                    serviceName,
                                    schemaName: type.getNamespace().nspname,
                                    name: type.typname,
                                },
                                tags,
                            };
                            await info.process("pgCodecs_listOfCodec_extensions", {
                                serviceName,
                                pgType: type,
                                innerCodec,
                                extensions,
                            });
                            const name = info.inflection.typeCodecName({
                                pgType: type,
                                serviceName,
                            });
                            (0, utils_js_1.exportNameHint)(extensions, `${name}CodecExtensions`);
                            event.pgCodec = (0, graphile_build_1.EXPORTABLE)((description, extensions, innerCodec, listOfCodec, name, typeDelim) => listOfCodec(innerCodec, {
                                extensions,
                                typeDelim,
                                description,
                                name,
                            }), [
                                description,
                                extensions,
                                innerCodec,
                                pg_1.listOfCodec,
                                name,
                                typeDelim,
                            ], `${name}Codec`);
                            return;
                        }
                    }
                    return;
                }
            },
            async pgRegistry_PgRegistryBuilder_pgCodecs(info, event) {
                const { registryBuilder } = event;
                const codecs = new Set();
                // If we get errors from the frozen object then clearly we need to
                // ensure more work has completed before continuing - call other plugin
                // helpers and wait for their events.
                for (const codecByTypeId of info.state.codecByTypeIdByDatabaseName.values()) {
                    for (const codecPromise of codecByTypeId.values()) {
                        const codec = await codecPromise;
                        if (codec) {
                            codecs.add(codec);
                        }
                    }
                }
                for (const codecByClassId of Object.freeze(info.state.codecByClassIdByDatabaseName.values())) {
                    for (const codecPromise of codecByClassId.values()) {
                        const codec = await codecPromise;
                        if (codec) {
                            codecs.add(codec);
                        }
                    }
                }
                for (const codec of codecs) {
                    registryBuilder.addCodec(codec);
                }
            },
        },
    }),
    schema: {
        hooks: {
            build(build) {
                build.allPgCodecs = new Set();
                function walkCodec(codec) {
                    if (build.allPgCodecs.has(codec)) {
                        return;
                    }
                    build.allPgCodecs.add(codec);
                    if (codec.arrayOfCodec) {
                        walkCodec(codec.arrayOfCodec);
                    }
                    if (codec.attributes) {
                        for (const attributeName in codec.attributes) {
                            const attributeCodec = codec.attributes[attributeName].codec;
                            walkCodec(attributeCodec);
                        }
                    }
                    if (codec.domainOfCodec) {
                        walkCodec(codec.domainOfCodec);
                    }
                    if (codec.rangeOfCodec) {
                        walkCodec(codec.rangeOfCodec);
                    }
                }
                // Walk all the codecs, add them to build
                for (const resource of Object.values(build.input.pgRegistry.pgResources)) {
                    walkCodec(resource.codec);
                    if (resource.parameters) {
                        for (const parameter of resource.parameters) {
                            walkCodec(parameter.codec);
                        }
                    }
                }
                if (build.input.pgRegistry.pgCodecs) {
                    for (const codec of Object.values(build.input.pgRegistry.pgCodecs)) {
                        walkCodec(codec);
                    }
                }
                // Ensure all sources are uniquely named
                const knownCodecByName = new Map();
                for (const codec of build.allPgCodecs) {
                    const known = knownCodecByName.get(codec.name);
                    if (known === codec) {
                        throw new Error(`The codec '${codec.name}' was added to build.allPgCodecs twice; this is a bug.`);
                    }
                    if (known) {
                        console.error({
                            error: `Two different codecs were created with the same name:`,
                            first: known,
                            second: codec,
                        });
                        throw new Error(`Two different codecs were created with the same name '${codec.name}'; please ensure all codec names are unique. If you are creating codecs from multiple services, consider prefixing the codec names with the service's name.`);
                    }
                    else {
                        knownCodecByName.set(codec.name, codec);
                    }
                }
                // Now ensure all codecs are uniquely named
                const knownResourceByName = new Map();
                for (const resource of Object.values(build.input.pgRegistry.pgResources)) {
                    const known = knownResourceByName.get(resource.name);
                    if (known) {
                        console.error({
                            error: `Two different resources were created with the same name:`,
                            first: known,
                            second: resource,
                        });
                        throw new Error("Two different resources were created with the same name; please ensure all resource names are unique. If you are creating resources from multiple services, consider prefixing the resource names with the service's name.");
                    }
                    else {
                        knownResourceByName.set(resource.name, resource);
                    }
                }
                return build;
            },
            init: {
                after: ["pg-standard-types"],
                provides: ["PgCodecs"],
                callback: (_, build) => {
                    const { inflection, options: { pgUseCustomNetworkScalars }, graphql: { GraphQLScalarType, GraphQLEnumType, GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, }, } = build;
                    const hstoreTypeName = inflection.builtin("KeyValueHash");
                    const typeNameByTYPESKey = {
                        void: null,
                        boolean: "Boolean",
                        int2: "Int",
                        int: "Int",
                        bigint: inflection.builtin("BigInt"),
                        float: "Float",
                        float4: "Float",
                        money: "Float",
                        numeric: "BigFloat",
                        citext: "String",
                        text: "String",
                        char: "String",
                        bpchar: "String",
                        varchar: "String",
                        name: "String",
                        xml: inflection.builtin("XML"),
                        json: inflection.builtin("JSON"),
                        jsonb: inflection.builtin("JSON"),
                        timestamp: inflection.builtin("Datetime"),
                        timestamptz: inflection.builtin("Datetime"),
                        date: inflection.builtin("Date"),
                        time: inflection.builtin("Time"),
                        timetz: inflection.builtin("Time"),
                        uuid: inflection.builtin("UUID"),
                        interval: {
                            input: inflection.inputType(inflection.builtin("Interval")),
                            output: inflection.builtin("Interval"),
                        },
                        bit: inflection.builtin("BitString"),
                        varbit: inflection.builtin("BitString"),
                        box: {
                            input: inflection.inputType(inflection.builtin("Box")),
                            output: inflection.builtin("Box"),
                        },
                        circle: {
                            input: inflection.inputType(inflection.builtin("Circle")),
                            output: inflection.builtin("Circle"),
                        },
                        line: {
                            input: inflection.inputType(inflection.builtin("Line")),
                            output: inflection.builtin("Line"),
                        },
                        lseg: {
                            input: inflection.inputType(inflection.builtin("LineSegment")),
                            output: inflection.builtin("LineSegment"),
                        },
                        path: {
                            input: inflection.inputType(inflection.builtin("Path")),
                            output: inflection.builtin("Path"),
                        },
                        point: {
                            input: inflection.inputType(inflection.builtin("Point")),
                            output: inflection.builtin("Point"),
                        },
                        polygon: {
                            input: inflection.inputType(inflection.builtin("Polygon")),
                            output: inflection.builtin("Polygon"),
                        },
                        hstore: hstoreTypeName,
                        inet: inflection.builtin("InternetAddress"),
                        regproc: inflection.builtin("RegProc"),
                        regprocedure: inflection.builtin("RegProcedure"),
                        regoper: inflection.builtin("RegOper"),
                        regoperator: inflection.builtin("RegOperator"),
                        regclass: inflection.builtin("RegClass"),
                        regtype: inflection.builtin("RegType"),
                        regrole: inflection.builtin("RegRole"),
                        regnamespace: inflection.builtin("RegNamespace"),
                        regconfig: inflection.builtin("RegConfig"),
                        regdictionary: inflection.builtin("RegDictionary"),
                        cidr: pgUseCustomNetworkScalars !== false
                            ? inflection.builtin("CidrAddress")
                            : "String",
                        macaddr: pgUseCustomNetworkScalars !== false
                            ? inflection.builtin("MacAddress")
                            : "String",
                        macaddr8: pgUseCustomNetworkScalars !== false
                            ? inflection.builtin("MacAddress8")
                            : "String",
                        bytea: inflection.builtin("Base64EncodedBinary"),
                    };
                    for (const rawKey in typeNameByTYPESKey) {
                        const key = rawKey;
                        const val = typeNameByTYPESKey[key];
                        const typeNameSpec = typeof val === "string" ? { input: val, output: val } : val;
                        for (const situation in typeNameSpec) {
                            const typeName = typeNameSpec[situation];
                            // Only register type if the user hasn't already done so
                            if (typeName &&
                                !build.hasGraphQLTypeForPgCodec(pg_1.TYPES[key], situation)) {
                                build.setGraphQLTypeForPgCodec(pg_1.TYPES[key], situation, typeName);
                            }
                        }
                    }
                    // Now walk over all the codecs and ensure that each on has an associated type
                    function prepareTypeForCodec(codec, visited) {
                        if (visited.has(codec)) {
                            return;
                        }
                        visited.add(codec);
                        // Process the inner type of list types, then exit.
                        if (codec.arrayOfCodec) {
                            prepareTypeForCodec(codec.arrayOfCodec, visited);
                            // Array codecs don't get their own type, they just use GraphQLList or connection or whatever.
                            return;
                        }
                        // Process all the attributes (if any), then exit.
                        if (codec.attributes) {
                            for (const attributeName in codec.attributes) {
                                const attributeCodec = codec.attributes[attributeName].codec;
                                prepareTypeForCodec(attributeCodec, visited);
                            }
                            // This will be handled by PgTablesPlugin; ignore.
                            return;
                        }
                        // Process the underlying type for domains (if any)
                        if (codec.domainOfCodec) {
                            prepareTypeForCodec(codec.domainOfCodec, visited);
                        }
                        // Process the underlying type for ranges (if any)
                        if (codec.rangeOfCodec) {
                            prepareTypeForCodec(codec.rangeOfCodec, visited);
                        }
                        if (build.hasGraphQLTypeForPgCodec(codec)) {
                            // This type already has a codec; ignore
                            return;
                        }
                        if (codec === pg_1.TYPES.void) {
                            return;
                        }
                        // There's currently no type registered for this scalar codec; let's sort that out.
                        if ((0, pg_1.isEnumCodec)(codec)) {
                            const typeName = inflection.enumType(codec);
                            const values = codec.values.reduce((memo, value) => {
                                memo[inflection.enumValue(value.value, codec)] = {
                                    value: value.value,
                                    description: value.description,
                                };
                                return memo;
                            }, Object.create(null));
                            build.registerEnumType(typeName, {}, () => ({
                                description: build.wrapDescription(codec.description, "type"),
                                values,
                            }), "PgCodecsPlugin");
                            build.setGraphQLTypeForPgCodec(codec, ["input", "output"], typeName);
                        }
                        else if (codec.rangeOfCodec || codec.domainOfCodec) {
                            const underlyingType = codec.rangeOfCodec ||
                                codec.domainOfCodec?.arrayOfCodec ||
                                codec.domainOfCodec?.rangeOfCodec ||
                                codec.domainOfCodec;
                            // This type is a "domain", so we can mimic the underlying type
                            const underlyingOutputTypeName = build.getGraphQLTypeNameByPgCodec(underlyingType, "output");
                            const underlyingInputTypeName = build.getGraphQLTypeNameByPgCodec(underlyingType, "input");
                            const underlyingOutputMeta = underlyingOutputTypeName
                                ? build.getTypeMetaByName(underlyingOutputTypeName)
                                : null;
                            const underlyingInputMeta = underlyingInputTypeName
                                ? build.getTypeMetaByName(underlyingInputTypeName)
                                : null;
                            const typeName = inflection.scalarCodecTypeName(codec);
                            const isSameInputOutputType = underlyingInputTypeName === underlyingOutputTypeName;
                            if (!underlyingOutputMeta) {
                                console.warn(`Failed to find output meta for '${underlyingOutputTypeName}' (${underlyingType.name})`);
                                return;
                            }
                            if (codec.rangeOfCodec) {
                                const rangeBoundTypeName = inflection.rangeBoundType({
                                    codec: codec,
                                    underlyingTypeName: underlyingOutputTypeName,
                                });
                                const rangeBoundInputTypeName = inflection.inputType(rangeBoundTypeName);
                                const rangeTypeName = inflection.rangeType({
                                    codec: codec,
                                    underlyingTypeName: underlyingOutputTypeName,
                                });
                                const rangeInputTypeName = inflection.inputType(rangeTypeName);
                                if (!build.getTypeMetaByName(rangeBoundTypeName)) {
                                    build.registerObjectType(rangeBoundTypeName, {
                                        isPgRangeBoundType: true,
                                        pgCodec: codec,
                                    }, () => ({
                                        description: build.wrapDescription("The value at one end of a range. A range can either include this value, or not.", "type"),
                                        fields: () => ({
                                            value: {
                                                description: build.wrapDescription("The value at one end of our range.", "field"),
                                                type: new GraphQLNonNull(build.getOutputTypeByName(underlyingOutputTypeName)),
                                            },
                                            inclusive: {
                                                description: build.wrapDescription("Whether or not the value of this bound is included in the range.", "field"),
                                                type: new GraphQLNonNull(GraphQLBoolean),
                                            },
                                        }),
                                    }), `PgCodecsPlugin enum range bound output for codec '${codec.name}'`);
                                }
                                if (!build.getTypeMetaByName(rangeBoundInputTypeName)) {
                                    build.registerInputObjectType(rangeBoundInputTypeName, {
                                        isPgRangeBoundInputType: true,
                                        pgCodec: codec,
                                    }, () => ({
                                        description: build.wrapDescription("The value at one end of a range. A range can either include this value, or not.", "type"),
                                        fields: () => ({
                                            value: {
                                                description: build.wrapDescription("The value at one end of our range.", "field"),
                                                type: new GraphQLNonNull(build.getInputTypeByName(underlyingInputTypeName)),
                                            },
                                            inclusive: {
                                                description: build.wrapDescription("Whether or not the value of this bound is included in the range.", "field"),
                                                type: new GraphQLNonNull(GraphQLBoolean),
                                            },
                                        }),
                                    }), "PgCodecsPlugin enum range bound input");
                                }
                                if (!build.getTypeMetaByName(rangeTypeName)) {
                                    build.registerObjectType(rangeTypeName, {
                                        isPgRangeType: true,
                                        pgCodec: codec,
                                    }, () => ({
                                        description: build.wrapDescription(`A range of \`${underlyingOutputTypeName}\`.`, "type"),
                                        fields: () => ({
                                            start: {
                                                description: build.wrapDescription("The starting bound of our range.", "field"),
                                                type: build.getOutputTypeByName(rangeBoundTypeName),
                                            },
                                            end: {
                                                description: build.wrapDescription("The ending bound of our range.", "field"),
                                                type: build.getOutputTypeByName(rangeBoundTypeName),
                                            },
                                        }),
                                    }), "PgCodecsPlugin enum range output");
                                }
                                if (!build.getTypeMetaByName(rangeInputTypeName)) {
                                    build.registerInputObjectType(rangeInputTypeName, {
                                        isPgRangeInputType: true,
                                        pgCodec: codec,
                                    }, () => ({
                                        description: build.wrapDescription(`A range of \`${underlyingInputTypeName}\`.`, "type"),
                                        fields: () => ({
                                            start: {
                                                description: build.wrapDescription("The starting bound of our range.", "field"),
                                                type: build.getInputTypeByName(rangeBoundInputTypeName),
                                            },
                                            end: {
                                                description: build.wrapDescription("The ending bound of our range.", "field"),
                                                type: build.getInputTypeByName(rangeBoundInputTypeName),
                                            },
                                        }),
                                    }), "PgCodecsPlugin enum range input");
                                }
                                build.setGraphQLTypeForPgCodec(codec, "output", rangeTypeName);
                                build.setGraphQLTypeForPgCodec(codec, "input", rangeInputTypeName);
                            }
                            else if (codec.domainOfCodec) {
                                // We just want to be a copy of the underlying type spec, but with a different name/description
                                const copy = (underlyingTypeName) => () => {
                                    const details = build.getTypeMetaByName(underlyingTypeName);
                                    const baseConfig = details?.specGenerator();
                                    const config = { ...baseConfig };
                                    delete config.name;
                                    delete config.description;
                                    return config;
                                };
                                if (underlyingOutputMeta && underlyingOutputTypeName) {
                                    // Register the GraphQL type
                                    switch (underlyingOutputMeta.Constructor) {
                                        case GraphQLScalarType: {
                                            build.registerScalarType(typeName, {}, copy(underlyingOutputTypeName), "PgCodecsPlugin");
                                            break;
                                        }
                                        case GraphQLEnumType: {
                                            build.registerEnumType(typeName, {}, copy(underlyingOutputTypeName), "PgCodecsPlugin");
                                            break;
                                        }
                                        case GraphQLObjectType: {
                                            build.registerObjectType(typeName, {}, copy(underlyingOutputTypeName), "PgCodecsPlugin");
                                            build.registerCursorConnection?.({
                                                typeName,
                                                // When dealing with scalars, nulls are allowed in setof
                                                nonNullNode: false,
                                                // build.options.pgForbidSetofFunctionsToReturnNull,
                                                scope: {
                                                    isPgConnectionRelated: true,
                                                },
                                            });
                                            break;
                                        }
                                        default: {
                                            console.warn(`PgCodec output type '${codec.name}' not understood, we don't know how to copy a '${underlyingOutputMeta.Constructor?.name}'`);
                                            return;
                                        }
                                    }
                                    // Now link this type to the codec for output (and input if appropriate)
                                    build.setGraphQLTypeForPgCodec(codec, "output", typeName);
                                    if (isSameInputOutputType) {
                                        build.setGraphQLTypeForPgCodec(codec, "input", typeName);
                                    }
                                }
                                if (underlyingInputMeta &&
                                    !isSameInputOutputType &&
                                    underlyingInputTypeName) {
                                    const inputTypeName = inflection.inputType(typeName);
                                    // Register the GraphQL type
                                    switch (underlyingInputMeta.Constructor) {
                                        case GraphQLInputObjectType: {
                                            build.registerInputObjectType(inputTypeName, {}, copy(underlyingInputTypeName), "PgCodecsPlugin");
                                            break;
                                        }
                                        default: {
                                            console.warn(`PgCodec input type '${codec.name}' not understood, we don't know how to copy a '${underlyingInputMeta.Constructor?.name}'`);
                                            return;
                                        }
                                    }
                                    // Now link this type to the codec for input
                                    build.setGraphQLTypeForPgCodec(codec, "input", inputTypeName);
                                }
                            }
                            else {
                                throw new Error("GraphileInternalError<0bcf67df-4c5f-4261-a51c-28c8a916edfe> Fallthrough here should be impossible");
                            }
                        }
                        else {
                            // We have no idea what this is or how to handle it.
                            // TODO: add some default handling, like "behavesLike = TYPES.text"?
                            console.warn(`Do not know how to convert PgCodec '${codec.name}' into a GraphQL type; please use \`build.setGraphQLTypeForPgCodec(codec, mode, typeName)\` inside \`plugin.schema.hooks.init\` for each mode/typeName combo you want to support.`);
                        }
                    }
                    const visited = new Set();
                    for (const codec of build.allPgCodecs) {
                        prepareTypeForCodec(codec, visited);
                    }
                    return _;
                },
            },
        },
        entityBehavior: {
            pgCodecAttribute: {
                inferred(behavior, [codec, attributeName]) {
                    const newBehavior = [behavior];
                    const attr = codec.attributes[attributeName];
                    if (attr.extensions?.isInsertable === false) {
                        newBehavior.push("-attribute:insert");
                    }
                    if (attr.extensions?.isUpdatable === false) {
                        newBehavior.push("-attribute:update");
                    }
                    return newBehavior;
                },
            },
        },
    },
};
//# sourceMappingURL=PgCodecsPlugin.js.map