"use strict";
// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgProceduresPlugin = void 0;
const pg_1 = require("@dataplan/pg");
const graphile_build_1 = require("graphile-build");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
const EMPTY_OBJECT = Object.freeze({});
function argTypeName(arg) {
    const nsp = arg.type.getNamespace();
    if (["pg_catalog", "public"].includes(nsp.nspname)) {
        return arg.type.typname;
    }
    else {
        return `${nsp.nspname}.${arg.type.typname}`;
    }
}
exports.PgProceduresPlugin = {
    name: "PgProceduresPlugin",
    description: "Generates @dataplan/pg resources for the PostgreSQL functions/procedures it finds",
    version: version_js_1.version,
    inflection: {
        add: {
            functionResourceName(options, { serviceName, pgProc }) {
                const { tags } = pgProc.getTagsAndDescription();
                if (typeof tags.name === "string") {
                    return tags.name;
                }
                const pgNamespace = pgProc.getNamespace();
                const schemaPrefix = this._schemaPrefix({ serviceName, pgNamespace });
                return `${schemaPrefix}${pgProc.proname}`;
            },
            functionRecordReturnCodecName(options, details) {
                return this.upperCamelCase(this.functionResourceName(details) + "-record");
            },
        },
    },
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgProcedures",
        helpers: {
            async getResourceOptions(info, serviceName, pgProc) {
                const { sql } = info.lib;
                let resourceOptionsByPgProc = info.state.resourceOptionsByPgProcByService.get(serviceName);
                if (!resourceOptionsByPgProc) {
                    resourceOptionsByPgProc = new Map();
                    info.state.resourceOptionsByPgProcByService.set(serviceName, resourceOptionsByPgProc);
                }
                let resourceOptionsPromise = resourceOptionsByPgProc.get(pgProc);
                if (resourceOptionsPromise) {
                    return resourceOptionsPromise;
                }
                resourceOptionsPromise = (async () => {
                    const pgService = info.resolvedPreset.pgServices?.find((db) => db.name === serviceName);
                    if (!pgService) {
                        throw new Error(`Could not find pgService '${serviceName}' in pgServices`);
                    }
                    const schemas = pgService.schemas ?? ["public"];
                    const namespace = pgProc.getNamespace();
                    if (!namespace) {
                        return null;
                    }
                    if (!schemas.includes(namespace.nspname)) {
                        return null;
                    }
                    /**
                     * The types of all the arguments that the function has, including
                     * both input, output, inout, variadic and table arguments.
                     *
                     * @remarks If all arguments are 'in' arguments, proallargtypes will
                     * be null and we fall back to proargtypes.  Note: proargnames and
                     * proargmodes are both indexed off of proallargtypes, but sometimes
                     * that's null so we assume in those cases it's actually indexed off
                     * of proargtypes - this may be a small oversight in the Postgres
                     * docs.
                     */
                    const allArgTypes = pgProc.proallargtypes ?? pgProc.proargtypes ?? [];
                    /**
                     * If there's two or more OUT or inout arguments INOUT, or any TABLE
                     * arguments then we'll need to generate a codec for the payload.
                     */
                    const outOrInoutOrTableArgModes = pgProc.proargmodes?.filter((m) => m === "o" || m === "b" || m === "t") ?? [];
                    const isRecordReturnType = pgProc.prorettype === "2249"; /* OID of the 'record' type */
                    const needsPayloadCodecToBeGenerated = outOrInoutOrTableArgModes.length > 1;
                    const debugProcName = `${namespace.nspname}.${pgProc.proname}`;
                    if (isRecordReturnType && !needsPayloadCodecToBeGenerated) {
                        // We do not support anonymous 'record' return type
                        return null;
                    }
                    const executor = info.helpers.pgIntrospection.getExecutorForService(serviceName);
                    const name = info.inflection.functionResourceName({
                        serviceName,
                        pgProc,
                    });
                    const identifier = `${serviceName}.${namespace.nspname}.${pgProc.proname}(${pgProc.getArguments().map(argTypeName).join(",")})`;
                    const { tags: rawTags, description } = pgProc.getTagsAndDescription();
                    const tags = JSON.parse(JSON.stringify(rawTags));
                    const makeCodecFromReturn = async () => {
                        // We're building a PgCodec to represent specifically the
                        // return type of this function.
                        const numberOfArguments = allArgTypes.length ?? 0;
                        const attributes = Object.create(null);
                        for (let i = 0, l = numberOfArguments; i < l; i++) {
                            // i for IN arguments, o for OUT arguments, b for INOUT arguments,
                            // v for VARIADIC arguments, t for TABLE arguments
                            const argMode = (pgProc.proargmodes?.[i] ?? "i");
                            if (argMode === "o" || argMode === "b" || argMode === "t") {
                                const argType = allArgTypes[i];
                                const trueArgName = pgProc.proargnames?.[i];
                                const argName = trueArgName || `column${i + 1}`;
                                const tag = tags[`arg${i}modifier`];
                                const typeModifier = typeof tag === "string"
                                    ? /^[0-9]+$/.test(tag)
                                        ? parseInt(tag, 10)
                                        : tag
                                    : undefined;
                                // This argument exists on the record type output
                                // NOTE: we treat `OUT foo`, `INOUT foo` and
                                // `RETURNS TABLE (foo ...)` as the same.
                                const attributeCodec = await info.helpers.pgCodecs.getCodecFromType(serviceName, argType, typeModifier);
                                if (!attributeCodec) {
                                    console.warn(`Could not make codec for '${debugProcName}' argument '${argName}' which has type ${argType} (${(await info.helpers.pgIntrospection.getType(serviceName, argType)).typname}); skipping function`);
                                    return null;
                                }
                                attributes[argName] = {
                                    notNull: false,
                                    codec: attributeCodec,
                                    extensions: {
                                        argIndex: i,
                                        argName: trueArgName,
                                    },
                                    // ENHANCE: could use "param" smart tag in function to add extensions here?
                                };
                            }
                        }
                        const recordCodecName = info.inflection.functionRecordReturnCodecName({
                            pgProc,
                            serviceName,
                        });
                        return (0, graphile_build_1.EXPORTABLE)((attributes, executor, recordCodec, recordCodecName, sql) => recordCodec({
                            name: recordCodecName,
                            identifier: sql `ANONYMOUS_TYPE_DO_NOT_REFERENCE`,
                            attributes,
                            description: undefined,
                            extensions: {
                            /* `The return type of our \`${name}\` ${
                              pgProc.provolatile === "v" ? "mutation" : "query"
                            }.`, */
                            },
                            executor,
                            isAnonymous: true,
                        }), [attributes, executor, pg_1.recordCodec, recordCodecName, sql]);
                    };
                    const returnCodec = needsPayloadCodecToBeGenerated
                        ? await makeCodecFromReturn()
                        : await info.helpers.pgCodecs.getCodecFromType(serviceName, pgProc.prorettype);
                    if (!returnCodec) {
                        console.warn(`Could not make return codec for '${debugProcName}'; skipping function`);
                        return null;
                    }
                    const parameters = [];
                    // const processedFirstInputArg = false;
                    // "v" is for "volatile"; but let's just say anything that's not
                    // _i_mmutable or _s_table is volatile
                    const isMutation = pgProc.provolatile !== "i" && pgProc.provolatile !== "s";
                    const numberOfArguments = allArgTypes.length ?? 0;
                    const numberOfArgumentsWithDefaults = pgProc.pronargdefaults ?? 0;
                    const isStrict = pgProc.proisstrict ?? false;
                    const isStrictish = isStrict || info.options.pgStrictFunctions === true;
                    const numberOfInputArguments = pgProc.pronargs ?? 0;
                    const numberOfRequiredArguments = numberOfInputArguments - numberOfArgumentsWithDefaults;
                    /** Because only input arguments count against pronargdefaults */
                    let inputIndex = -1;
                    for (let i = 0, l = numberOfArguments; i < l; i++) {
                        const argType = allArgTypes[i];
                        const argName = pgProc.proargnames?.[i] ?? null;
                        const typeModifierTag = tags[`arg${i}modifier`];
                        const typeModifier = typeof typeModifierTag === "string"
                            ? /^[0-9]+$/.test(typeModifierTag)
                                ? parseInt(typeModifierTag, 10)
                                : typeModifierTag
                            : undefined;
                        const tag = tags[`arg${i}variant`];
                        const variant = typeof tag === "string" ? tag : undefined;
                        // i for IN arguments, o for OUT arguments, b for INOUT arguments,
                        // v for VARIADIC arguments, t for TABLE arguments
                        const argMode = (pgProc.proargmodes?.[i] ?? "i");
                        if (argMode === "v") {
                            // We don't currently support variadic arguments
                            return null;
                        }
                        if (argMode === "i" || argMode === "b") {
                            // This is an input argument, not an output argument
                            inputIndex++;
                            // Generate a parameter for this argument
                            const argCodec = await info.helpers.pgCodecs.getCodecFromType(serviceName, argType, typeModifier);
                            if (!argCodec) {
                                console.warn(`Could not make codec for '${debugProcName}' argument '${argName}' which has type ${argType} (${(await info.helpers.pgIntrospection.getType(serviceName, argType)).typname}); skipping function`);
                                return null;
                            }
                            const required = inputIndex < numberOfRequiredArguments;
                            const notNull = isStrict || (isStrictish && required);
                            /*
                            if (!processedFirstInputArg) {
                              processedFirstInputArg = true;
                              if (argCodec.attributes && !isMutation) {
                                // Computed attribute!
                                required = true;
                                notNull = true;
                              }
                            }
                            */
                            parameters.push({
                                name: argName,
                                required,
                                notNull,
                                codec: argCodec,
                                ...(variant
                                    ? {
                                        extensions: {
                                            variant,
                                        },
                                    }
                                    : null),
                            });
                        }
                    }
                    const returnsSetof = pgProc.proretset;
                    const namespaceName = namespace.nspname;
                    const procName = pgProc.proname;
                    // TODO: use smart tags to override this one way or the other?
                    // Perhaps `@forceOrder` or `@ignoreOrder`?
                    const hasImplicitOrder = returnsSetof;
                    const sqlIdent = info.helpers.pgBasics.identifier(namespaceName, procName);
                    (0, utils_js_1.exportNameHint)(sqlIdent, `${procName}FunctionIdentifer`);
                    const fromCallback = (0, graphile_build_1.EXPORTABLE)((sql, sqlFromArgDigests, sqlIdent) => (...args) => sql `${sqlIdent}(${sqlFromArgDigests(args)})`, [sql, pg_1.sqlFromArgDigests, sqlIdent]);
                    const extensions = {
                        pg: {
                            serviceName,
                            schemaName: pgProc.getNamespace().nspname,
                            name: pgProc.proname,
                        },
                        tags,
                    };
                    if (outOrInoutOrTableArgModes.length === 1) {
                        const outOrInoutArg = (() => {
                            for (let i = 0, l = numberOfArguments; i < l; i++) {
                                const trueArgName = pgProc.proargnames?.[i];
                                const argMode = pgProc.proargmodes?.[i] ?? "i";
                                if (argMode === "b" || argMode === "o" || argMode === "t") {
                                    return trueArgName;
                                }
                            }
                        })();
                        if (outOrInoutArg) {
                            extensions.singleOutputParameterName = outOrInoutArg;
                        }
                    }
                    if (!returnCodec.isAnonymous &&
                        (returnCodec.attributes || returnCodec.arrayOfCodec?.attributes)) {
                        const returnPgType = await info.helpers.pgIntrospection.getType(serviceName, pgProc.prorettype);
                        if (!returnPgType) {
                            console.log(`Failed to get returnPgType for '${debugProcName}'`);
                            return null;
                        }
                        const returnsArray = !!returnCodec.arrayOfCodec;
                        const pgType = returnsArray
                            ? await info.helpers.pgIntrospection.getType(serviceName, returnPgType.typelem)
                            : returnPgType;
                        if (!pgType)
                            return null;
                        const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, pgType.typrelid);
                        if (!pgClass)
                            return null;
                        const resourceOptions = await info.helpers.pgTables.getResourceOptions(serviceName, pgClass);
                        const resourceConfig = await (async () => {
                            if (resourceOptions) {
                                return resourceOptions;
                            }
                            else {
                                // No resourceOptions for this; presumably the table is not exposed. Create one for the codec instead.
                                const codec = await info.helpers.pgCodecs.getCodecFromClass(serviceName, pgClass._id);
                                if (!codec) {
                                    return null;
                                }
                                const executor = info.helpers.pgIntrospection.getExecutorForService(serviceName);
                                return { codec, executor };
                            }
                        })();
                        if (!resourceConfig) {
                            return null;
                        }
                        const options = {
                            name,
                            identifier,
                            from: fromCallback,
                            parameters,
                            returnsArray,
                            returnsSetof,
                            isMutation,
                            hasImplicitOrder,
                            extensions,
                            description,
                        };
                        await info.process("pgProcedures_functionResourceOptions", {
                            serviceName,
                            pgProc,
                            baseResourceOptions: resourceConfig,
                            functionResourceOptions: options,
                        });
                        const finalResourceOptions = (0, graphile_build_1.EXPORTABLE)((PgResource, options, resourceConfig) => PgResource.functionResourceOptions(resourceConfig, options), [pg_1.PgResource, options, resourceConfig]);
                        await info.process("pgProcedures_PgResourceOptions", {
                            serviceName,
                            pgProc,
                            resourceOptions: finalResourceOptions,
                        });
                        return (0, graphile_build_1.EXPORTABLE)((finalResourceOptions, makePgResourceOptions) => makePgResourceOptions(finalResourceOptions), [finalResourceOptions, pg_1.makePgResourceOptions]);
                    }
                    else {
                        const options = (0, graphile_build_1.EXPORTABLE)((description, executor, extensions, fromCallback, hasImplicitOrder, identifier, isMutation, name, parameters, returnCodec, returnsSetof) => ({
                            executor,
                            name,
                            identifier,
                            from: fromCallback,
                            parameters,
                            isUnique: !returnsSetof,
                            codec: returnCodec,
                            uniques: [],
                            isMutation,
                            hasImplicitOrder,
                            extensions,
                            description,
                        }), [
                            description,
                            executor,
                            extensions,
                            fromCallback,
                            hasImplicitOrder,
                            identifier,
                            isMutation,
                            name,
                            parameters,
                            returnCodec,
                            returnsSetof,
                        ]);
                        await info.process("pgProcedures_PgResourceOptions", {
                            serviceName,
                            pgProc,
                            resourceOptions: options,
                        });
                        return (0, graphile_build_1.EXPORTABLE)((makePgResourceOptions, options) => makePgResourceOptions(options), [pg_1.makePgResourceOptions, options]);
                    }
                })().then((resourceOptions) => {
                    if (resourceOptions) {
                        registryBuilder.addResource(resourceOptions);
                    }
                    return resourceOptions;
                });
                resourceOptionsByPgProc.set(pgProc, resourceOptionsPromise);
                const registryBuilder = await info.helpers.pgRegistry.getRegistryBuilder();
                return resourceOptionsPromise;
            },
        },
        initialCache() {
            return EMPTY_OBJECT;
        },
        initialState: () => ({
            resourceOptionsByPgProcByService: new Map(),
        }),
        hooks: {
            async pgIntrospection_proc({ helpers, resolvedPreset }, event) {
                const { entity: pgProc, serviceName } = event;
                const pgService = resolvedPreset.pgServices?.find((db) => db.name === serviceName);
                if (!pgService) {
                    throw new Error(`Could not find '${serviceName}' in 'pgServices'`);
                }
                const schemas = pgService.schemas ?? ["public"];
                // Only process procedures from one of the published namespaces
                const namespace = pgProc.getNamespace();
                if (!namespace || !schemas.includes(namespace.nspname)) {
                    return;
                }
                // Do not select procedures that create range types. These are utility
                // functions that really don’t need to be exposed in an API.
                const introspection = (await helpers.pgIntrospection.getIntrospection()).find((n) => n.pgService.name === serviceName).introspection;
                const rangeType = introspection.types.find((t) => t.typnamespace === pgProc.pronamespace &&
                    t.typname === pgProc.proname &&
                    t.typtype === "r");
                if (rangeType) {
                    return;
                }
                // Do not expose trigger functions (type trigger has oid 2279)
                if (pgProc.prorettype === "2279") {
                    return;
                }
                // We don't want functions that will clash with GraphQL (treat them as private)
                if (pgProc.proname.startsWith("__")) {
                    return;
                }
                // We also don’t want procedures that have been defined in our namespace
                // twice. This leads to duplicate fields in the API which throws an
                // error. In the future we may support this case. For now though, it is
                // too complex.
                const overload = introspection.procs.find((p) => p.pronamespace === pgProc.pronamespace &&
                    p.proname === pgProc.proname &&
                    p._id !== pgProc._id);
                if (overload) {
                    return;
                }
                await helpers.pgProcedures.getResourceOptions(serviceName, pgProc);
            },
        },
    }),
    schema: {
        behaviorRegistry: {
            add: {
                "resource:connection:backwards": {
                    description: "can we paginate backwards through this collection's connection?",
                    entities: ["pgResource"],
                },
            },
        },
        entityBehavior: {
            pgResource: {
                inferred: {
                    provides: ["default"],
                    before: [
                        // By running before this, we actually override it because it
                        // prefixes further back in the behavior chain
                        "PgFirstLastBeforeAfterArgsPlugin",
                        "inferred",
                        "override",
                    ],
                    callback(behavior, resource) {
                        if (resource.parameters) {
                            // Default to no backwards pagination for functions
                            return [
                                "-resource:connection:backwards",
                                "-filter",
                                "-order",
                                behavior,
                            ];
                        }
                        else {
                            return behavior;
                        }
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=PgProceduresPlugin.js.map