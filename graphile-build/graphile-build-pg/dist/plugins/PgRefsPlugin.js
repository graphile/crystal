"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRefsPlugin = void 0;
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const EMPTY_OBJECT = Object.freeze({});
exports.PgRefsPlugin = {
    name: "PgRefsPlugin",
    description: "Looks for `@ref` and `@refVia` smart tags and registers the given refs",
    version: version_js_1.version,
    after: ["smart-tags", "PgRelationsPlugin"],
    inflection: {
        add: {
            refSingle(stuff, { refDefinition, identifier }) {
                return (refDefinition.singleRecordFieldName ?? this.singularize(identifier));
            },
            refList(stuff, { refDefinition, identifier }) {
                return (refDefinition.listFieldName ??
                    this.listField(this.pluralize(this.singularize(identifier))));
            },
            refConnection(stuff, { refDefinition, identifier }) {
                return (refDefinition.connectionFieldName ??
                    this.connectionField(this.pluralize(this.singularize(identifier))));
            },
        },
    },
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgRefs",
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState() {
            return EMPTY_OBJECT;
        },
        helpers: {},
        hooks: {
            async pgCodecs_PgCodec(info, event) {
                const { pgCodec, pgClass } = event;
                if (!pgClass) {
                    return;
                }
                const { tags } = pgClass.getTagsAndDescription();
                const rawRefs = Array.isArray(tags.ref)
                    ? tags.ref
                    : tags.ref
                        ? [tags.ref]
                        : null;
                if (!rawRefs) {
                    return;
                }
                const refs = rawRefs.map((ref) => (0, utils_js_1.parseSmartTagsOptsString)(ref, 1));
                const extensions = pgCodec.extensions ?? Object.create(null);
                pgCodec.extensions = extensions;
                const refDefinitions = extensions.refDefinitions ?? Object.create(null);
                extensions.refDefinitions = refDefinitions;
                for (const ref of refs) {
                    const { args: [name], params: { to, from, plural: rawPlural, singular: rawSingular, via: rawVia, behavior, }, } = ref;
                    const singular = rawSingular != null;
                    if (singular && rawPlural != null) {
                        throw new Error(`Both singular and plural were set on ref '${name}'; this isn't valid`);
                    }
                    if (refDefinitions[name]) {
                        throw new Error(`@ref ${name} already registered in ${pgCodec.name}`);
                    }
                    refDefinitions[name] = {
                        singular,
                        graphqlType: to,
                        sourceGraphqlType: from,
                        extensions: {
                            via: rawVia,
                            tags: {
                                behavior,
                            },
                        },
                    };
                }
            },
            async pgTables_PgResourceOptions_relations_post(info, event) {
                const { serviceName, resourceOptions, pgClass } = event;
                const getCodecForTableName = async (targetTableIdentifier) => {
                    const nsp = pgClass.getNamespace();
                    if (!nsp) {
                        throw new Error(`Couldn't determine namespace for '${pgClass.relname}'`);
                    }
                    const [targetSchemaName, targetTableName] = (0, utils_js_1.parseDatabaseIdentifier)(targetTableIdentifier, 2, nsp.nspname);
                    const targetPgClass = await info.helpers.pgIntrospection.getClassByName(serviceName, targetSchemaName, targetTableName);
                    if (!targetPgClass) {
                        return null;
                    }
                    const targetCodec = await info.helpers.pgCodecs.getCodecFromClass(serviceName, targetPgClass._id);
                    return targetCodec;
                };
                const { tags } = pgClass.getTagsAndDescription();
                const rawRefVias = Array.isArray(tags.refVia)
                    ? tags.refVia
                    : tags.refVia
                        ? [tags.refVia]
                        : null;
                const refDefinitions = resourceOptions.codec.extensions
                    ?.refDefinitions;
                if (!refDefinitions) {
                    if (rawRefVias) {
                        throw new Error(`@refVia without matching @ref is invalid`);
                    }
                    return;
                }
                const refVias = rawRefVias?.map((refVia) => (0, utils_js_1.parseSmartTagsOptsString)(refVia, 1)) ??
                    [];
                for (const [refName, refDefinition] of Object.entries(refDefinitions)) {
                    const relevantVias = refVias.filter((v) => v.args[0] === refName);
                    const relevantViaStrings = relevantVias
                        .map((v) => v.params.via)
                        .filter((via) => {
                        if (!via) {
                            console.warn(`Invalid '@refVia' detected on '${pgClass.getNamespace().nspname}.${pgClass.relname}'; no 'via:' parameter.`);
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                    const rawVia = refDefinition.extensions?.via;
                    const vias = [...(rawVia ? [rawVia] : []), ...relevantViaStrings];
                    const paths = [];
                    if (vias.length === 0) {
                        if (!tags.interface) {
                            console.warn(`@ref ${refName} has no valid 'via' on ${resourceOptions.name}`);
                            continue;
                        }
                    }
                    const registryBuilder = await info.helpers.pgRegistry.getRegistryBuilder();
                    const registryConfig = registryBuilder.getRegistryConfig();
                    outerLoop: for (const via of vias) {
                        const path = [];
                        const parts = via.split(";");
                        let currentResourceOptions = resourceOptions;
                        for (const rawPart of parts) {
                            const relations = registryConfig.pgRelations[currentResourceOptions.codec.name];
                            const relationEntries = relations
                                ? Object.entries(relations)
                                : [];
                            const part = rawPart.trim();
                            // ENHANCE: allow whitespace
                            const matches = part.match(/^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/);
                            let relationEntry;
                            if (matches) {
                                const [, rawLocalCols, targetTableIdentifier, maybeRawTargetCols,] = matches;
                                const localAttributes = (0, utils_js_1.parseDatabaseIdentifiers)(rawLocalCols, 1).map((i) => i[0]);
                                const maybeTargetAttributes = maybeRawTargetCols
                                    ? (0, utils_js_1.parseDatabaseIdentifiers)(maybeRawTargetCols, 1).map((i) => i[0])
                                    : null;
                                const targetCodec = await getCodecForTableName(targetTableIdentifier);
                                if (!targetCodec) {
                                    console.error(`Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a resource for. Please be sure to indicate the schema if required.`);
                                    continue outerLoop;
                                }
                                relationEntry = relationEntries.find(([, rel]) => {
                                    if (rel.remoteResourceOptions.codec !== targetCodec) {
                                        return false;
                                    }
                                    if (!(0, grafast_1.arraysMatch)(rel.localAttributes, localAttributes)) {
                                        return false;
                                    }
                                    if (maybeTargetAttributes) {
                                        if (!(0, grafast_1.arraysMatch)(rel.remoteAttributes, maybeTargetAttributes)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            }
                            else {
                                const targetTableIdentifier = part;
                                const targetCodec = await getCodecForTableName(targetTableIdentifier);
                                if (!targetCodec) {
                                    console.error(`Ref ${refName} has bad via '${via}' which references table '${targetTableIdentifier}' which we either cannot find, or have not generated a resource for. Please be sure to indicate the schema if required.`);
                                    continue outerLoop;
                                }
                                relationEntry = relationEntries.find(([, rel]) => {
                                    return rel.remoteResourceOptions.codec === targetCodec;
                                });
                            }
                            if (relationEntry) {
                                path.push({
                                    relationName: relationEntry[0],
                                });
                                const nextSource = relationEntry[1].remoteResourceOptions;
                                currentResourceOptions = nextSource;
                            }
                            else {
                                console.warn(`When processing ref for resource '${resourceOptions.name}', could not find matching relation for via:'${via}'${rawPart === via
                                    ? ""
                                    : ` (from: '${currentResourceOptions.name}', path: '${rawPart}')`}`);
                                continue outerLoop;
                            }
                        }
                        paths.push(path);
                    }
                    if (!resourceOptions.codec.refs) {
                        resourceOptions.codec.refs = Object.create(null);
                    }
                    if (resourceOptions.codec.refs[refName]) {
                        throw new Error(`@ref ${refName} already registered in ${resourceOptions.codec.name}`);
                    }
                    resourceOptions.codec.refs[refName] = {
                        definition: refDefinition,
                        paths,
                    };
                }
            },
        },
    }),
};
//# sourceMappingURL=PgRefsPlugin.js.map