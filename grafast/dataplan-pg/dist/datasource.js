"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgResource = void 0;
exports.EXPORTABLE = EXPORTABLE;
exports.makeRegistry = makeRegistry;
exports.makeRegistryBuilder = makeRegistryBuilder;
exports.makePgResourceOptions = makePgResourceOptions;
const tslib_1 = require("tslib");
/* eslint-disable graphile-export/export-instances */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const codecs_js_1 = require("./codecs.js");
const inspect_js_1 = require("./inspect.js");
const pgSelect_js_1 = require("./steps/pgSelect.js");
function EXPORTABLE(factory, args, nameHint) {
    const fn = factory(...args);
    if ((typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
        !("$exporter$factory" in fn)) {
        Object.defineProperties(fn, {
            $exporter$args: { value: args },
            $exporter$factory: { value: factory },
            $exporter$name: { writable: true, value: nameHint },
        });
    }
    return fn;
}
/**
 * PgResource represents any resource of SELECT-able data in Postgres: tables,
 * views, functions, etc.
 */
class PgResource {
    /**
     * @param from - the SQL for the `FROM` clause (without any
     * aliasing). If this is a subquery don't forget to wrap it in parens.
     * @param name - a nickname for this resource. Doesn't need to be unique
     * (but should be). Used for making the SQL query and debug messages easier
     * to understand.
     */
    constructor(registry, options) {
        // TODO: make a public interface for this information
        /**
         * If present, implies that the resource represents a `setof composite[]` (i.e.
         * an array of arrays) - and thus is not appropriate to use for GraphQL
         * Cursor Connections.
         *
         * @experimental
         */
        this.sqlPartitionByIndex = null;
        const { codec, executor, name, identifier, from, uniques, extensions, parameters, description, isUnique, sqlPartitionByIndex, isMutation, hasImplicitOrder, selectAuth, isList, isVirtual, } = options;
        this.registry = registry;
        this.extensions = extensions;
        this.codec = codec;
        this.executor = executor;
        this.name = name;
        this.identifier = identifier ?? name;
        this.from = from;
        this.uniques = uniques ?? [];
        this.parameters = parameters;
        this.description = description;
        this.isUnique = !!isUnique;
        this.sqlPartitionByIndex = sqlPartitionByIndex ?? null;
        this.isMutation = !!isMutation;
        this.hasImplicitOrder = hasImplicitOrder ?? false;
        this.isList = !!isList;
        this.isVirtual = isVirtual ?? false;
        this.selectAuth = selectAuth;
        // parameters is null iff from is not a function
        const sourceIsFunction = typeof this.from === "function";
        if (this.parameters == null && sourceIsFunction) {
            throw new Error(`Resource ${this} is invalid - it's a function but without a parameters array. If the function accepts no parameters please pass an empty array.`);
        }
        if (this.parameters != null && !sourceIsFunction) {
            throw new Error(`Resource ${this} is invalid - parameters can only be specified when the resource is a function.`);
        }
        if (this.codec.arrayOfCodec?.attributes) {
            throw new Error(`Resource ${this} is invalid - creating a resource that returns an array of a composite type is forbidden; please \`unnest\` the array.`);
        }
        if (this.isUnique && this.sqlPartitionByIndex) {
            throw new Error(`Resource ${this} is invalid - cannot be unique and also partitionable`);
        }
    }
    /**
     * Often you can access table records from a table directly but also from a
     * view or materialized view.  This method makes it convenient to construct
     * multiple datasources that all represent the same underlying table
     * type/relations/etc.
     */
    static alternativeResourceOptions(baseOptions, overrideOptions) {
        const { name, identifier, from, uniques, extensions } = overrideOptions;
        const { codec, executor, selectAuth } = baseOptions;
        return {
            codec,
            executor,
            name,
            identifier,
            from,
            uniques,
            parameters: undefined,
            extensions,
            selectAuth,
        };
    }
    /**
     * Often you can access table records from a table directly but also from a
     * number of functions. This method makes it convenient to construct multiple
     * datasources that all represent the same underlying table
     * type/relations/etc but pull their rows from functions.
     */
    static functionResourceOptions(baseOptions, overrideOptions) {
        const { codec, executor, selectAuth: originalSelectAuth } = baseOptions;
        const { name, identifier, from: fnFrom, parameters, returnsSetof, returnsArray, uniques, extensions, isMutation, hasImplicitOrder, selectAuth: overrideSelectAuth, description, } = overrideOptions;
        const selectAuth = overrideSelectAuth === null
            ? null
            : (overrideSelectAuth ?? originalSelectAuth);
        if (!returnsArray) {
            // This is the easy case
            return {
                codec,
                executor,
                name,
                identifier,
                from: fnFrom,
                uniques,
                parameters,
                extensions,
                isUnique: !returnsSetof,
                isMutation: Boolean(isMutation),
                hasImplicitOrder,
                selectAuth,
                description,
            };
        }
        else if (!returnsSetof) {
            // This is a `composite[]` function; convert it to a `setof composite` function:
            const from = EXPORTABLE((fnFrom, sql) => (...args) => sql `unnest(${fnFrom(...args)})`, [fnFrom, pg_sql2_1.default], `${name}_from`);
            return {
                codec,
                executor,
                name,
                identifier,
                from: from,
                uniques,
                parameters,
                extensions,
                isUnique: false, // set now, not unique
                isMutation: Boolean(isMutation),
                hasImplicitOrder,
                selectAuth,
                isList: true,
                description,
            };
        }
        else {
            // This is a `setof composite[]` function; convert it to `setof composite` and indicate that we should partition it.
            const sqlTmp = pg_sql2_1.default.identifier(Symbol(`${name}_tmp`));
            const sqlPartitionByIndex = pg_sql2_1.default.identifier(Symbol(`${name}_idx`));
            const from = EXPORTABLE((fnFrom, sql, sqlPartitionByIndex, sqlTmp) => (...args) => sql `${fnFrom(...args)} with ordinality as ${sqlTmp} (arr, ${sqlPartitionByIndex}) cross join lateral unnest (${sqlTmp}.arr)`, [fnFrom, pg_sql2_1.default, sqlPartitionByIndex, sqlTmp], `${name}_from`);
            return {
                codec,
                executor,
                name,
                identifier,
                from: from,
                uniques,
                parameters,
                extensions,
                isUnique: false, // set now, not unique
                sqlPartitionByIndex,
                isMutation: Boolean(isMutation),
                hasImplicitOrder,
                selectAuth,
                description,
            };
        }
    }
    toString() {
        return chalk_1.default.bold.blue(`PgResource(${this.name})`);
    }
    getRelations() {
        return (this.registry.pgRelations[this.codec.name] ??
            Object.create(null));
    }
    getRelation(name) {
        return this.getRelations()[name];
    }
    resolveVia(via, attr) {
        if (!via) {
            throw new Error("No via to resolve");
        }
        if (typeof via === "string") {
            // Check
            const relation = this.getRelation(via);
            if (!relation) {
                throw new Error(`Unknown relation '${via}' in ${this}`);
            }
            if (!relation.remoteResource.codec.attributes[attr]) {
                throw new Error(`${this} relation '${via}' does not have attribute '${attr}'`);
            }
            return { relation: via, attribute: attr };
        }
        else {
            return via;
        }
    }
    // PERF: this needs optimization.
    getReciprocal(otherCodec, otherRelationName) {
        if (this.parameters) {
            throw new Error(".getReciprocal() cannot be used with functional resources; please use .execute()");
        }
        const otherRelation = this.registry.pgRelations[otherCodec.name]?.[otherRelationName];
        const relations = this.getRelations();
        const reciprocal = Object.entries(relations).find(([_relationName, relation]) => {
            if (relation.remoteResource.codec !== otherCodec) {
                return false;
            }
            if (!(0, grafast_1.arraysMatch)(relation.localAttributes, otherRelation.remoteAttributes)) {
                return false;
            }
            if (!(0, grafast_1.arraysMatch)(relation.remoteAttributes, otherRelation.localAttributes)) {
                return false;
            }
            return true;
        });
        return reciprocal || null;
    }
    get(spec, 
    // This is internal, it's an optimisation we can use but you shouldn't.
    _internalOptionsDoNotPass) {
        if (this.parameters) {
            throw new Error(".get() cannot be used with functional resources; please use .execute()");
        }
        if (!spec) {
            throw new Error(`Cannot ${this}.get without a valid spec`);
        }
        const keys = Object.keys(spec);
        if (!this.uniques.some((uniq) => uniq.attributes.every((key) => keys.includes(key)))) {
            throw new Error(`Attempted to call ${this}.get({${keys.join(", ")}}) at child field (TODO: which one?) but that combination of attributes is not unique (uniques: ${JSON.stringify(this.uniques)}). Did you mean to call .find() instead?`);
        }
        return this.find(spec).single(_internalOptionsDoNotPass);
    }
    find(spec = Object.create(null)) {
        if (this.parameters) {
            throw new Error(".get() cannot be used with functional resources; please use .execute()");
        }
        if (!this.codec.attributes) {
            throw new Error("Cannot call find if there's no attributes");
        }
        const attributes = this.codec.attributes;
        const keys = Object.keys(spec); /* as Array<keyof typeof attributes>*/
        const invalidKeys = keys.filter((key) => attributes[key] == null);
        if (invalidKeys.length > 0) {
            throw new Error(`Attempted to call ${this}.get({${keys.join(", ")}}) but that request included attributes that we don't know about: '${invalidKeys.join("', '")}'`);
        }
        const identifiers = keys.map((key) => {
            const attribute = attributes[key];
            if ("via" in attribute && attribute.via) {
                throw new Error(`Attribute '${String(key)}' is defined with a 'via' and thus cannot be used as an identifier for '.find()' or '.get()' calls (requested keys: '${keys.join("', '")}').`);
            }
            const { codec } = attribute;
            const stepOrConstant = spec[key];
            if (stepOrConstant == undefined) {
                throw new Error(`Attempted to call ${this}.find({${keys.join(", ")}}) but failed to provide a plan for '${String(key)}'`);
            }
            return {
                step: stepOrConstant instanceof grafast_1.ExecutableStep
                    ? stepOrConstant
                    : (0, grafast_1.constant)(stepOrConstant, false),
                codec,
                matches: (alias) => typeof attribute.expression === "function"
                    ? attribute.expression(alias)
                    : (0, pg_sql2_1.default) `${alias}.${pg_sql2_1.default.identifier(key)}`,
            };
        });
        return (0, pgSelect_js_1.pgSelect)({ resource: this, identifiers });
    }
    execute(args = [], mode = this.isMutation ? "mutation" : "normal") {
        const $select = (0, pgSelect_js_1.pgSelect)({
            resource: this,
            identifiers: [],
            args,
            mode,
        });
        if (this.isUnique) {
            return $select.single();
        }
        const sqlPartitionByIndex = this.sqlPartitionByIndex;
        if (sqlPartitionByIndex) {
            // We're a setof array of composite type function, e.g. `setof users[]`, so we need to reconstitute the plan.
            return (0, grafast_1.partitionByIndex)($select, ($row) => $row.select(sqlPartitionByIndex, codecs_js_1.TYPES.int, true), 
            // Ordinality is 1-indexed but we want a 0-indexed number
            1);
        }
        else {
            return $select;
        }
    }
    applyAuthorizationChecksToPlan($step) {
        if (this.selectAuth) {
            this.selectAuth($step);
        }
        // e.g. $step.where(sql`user_id = ${me}`);
        return;
    }
    /**
     * @deprecated Please use `.executor.context()` instead - all resources for the
     * same executor must use the same context to allow for SQL inlining, unions,
     * etc.
     */
    context() {
        return this.executor.context();
    }
    /** @internal */
    executeWithCache(values, options) {
        return this.executor.executeWithCache(values, options);
    }
    /** @internal */
    executeWithoutCache(values, options) {
        return this.executor.executeWithoutCache(values, options);
    }
    /** @internal */
    executeStream(values, options) {
        return this.executor.executeStream(values, options);
    }
    /** @internal */
    executeMutation(options) {
        return this.executor.executeMutation(options);
    }
    /**
     * Returns an SQL fragment that evaluates to `'true'` (string) if the row is
     * non-null and `'false'` or `null` otherwise.
     *
     * @see {@link PgCodec.notNullExpression}
     *
     * @internal
     */
    getNullCheckExpression(alias) {
        if (this.codec.notNullExpression) {
            // Use the user-provided check
            return this.codec.notNullExpression(alias);
        }
        else {
            // Every column in a primary key is non-nullable; so just see if one is null
            const pk = this.uniques.find((u) => u.isPrimary);
            const nonNullableAttribute = (this.codec.attributes
                ? Object.entries(this.codec.attributes).find(([_attributeName, spec]) => !spec.via && !spec.expression && spec.notNull)?.[0]
                : null) ?? pk?.attributes[0];
            if (nonNullableAttribute) {
                const firstAttribute = (0, pg_sql2_1.default) `${alias}.${pg_sql2_1.default.identifier(nonNullableAttribute)}`;
                return (0, pg_sql2_1.default) `(not (${firstAttribute} is null))::text`;
            }
            else {
                // Fallback
                // NOTE: we cannot use `is distinct from null` here because it's
                // commonly used for `select * from ((select my_table.composite).*)`
                // and the rows there _are_ distinct from null even if the underlying
                // data is not.
                return (0, pg_sql2_1.default) `(not (${alias} is null))::text`;
            }
        }
    }
}
exports.PgResource = PgResource;
(0, grafast_1.exportAs)("@dataplan/pg", PgResource, "PgResource");
function makeRegistry(config) {
    const registry = {
        pgExecutors: Object.create(null),
        pgCodecs: Object.create(null),
        pgResources: Object.create(null),
        pgRelations: Object.create(null),
    };
    // Tell the system to read the built pgCodecs, pgResources, pgRelations from the registry
    Object.defineProperties(registry.pgExecutors, {
        $exporter$args: { value: [registry] },
        $exporter$factory: {
            value: (registry) => registry.pgExecutors,
        },
    });
    Object.defineProperties(registry.pgCodecs, {
        $exporter$args: { value: [registry] },
        $exporter$factory: {
            value: (registry) => registry.pgCodecs,
        },
    });
    Object.defineProperties(registry.pgResources, {
        $exporter$args: { value: [registry] },
        $exporter$factory: {
            value: (registry) => registry.pgResources,
        },
    });
    Object.defineProperties(registry.pgRelations, {
        $exporter$args: { value: [registry] },
        $exporter$factory: {
            value: (registry) => registry.pgRelations,
        },
    });
    let addExecutorForbidden = false;
    function addExecutor(executor) {
        if (addExecutorForbidden) {
            throw new Error(`It's too late to call addExecutor now`);
        }
        const executorName = executor.name;
        if (registry.pgExecutors[executorName]) {
            if (registry.pgExecutors[executorName] !== executor) {
                console.dir({
                    existing: registry.pgExecutors[executorName],
                    new: executor,
                });
                throw new Error(`Executor named '${executorName}' is already registered; you cannot have two executors with the same name`);
            }
            return executor;
        }
        else {
            // Custom spec, pin it back to the registry
            registry.pgExecutors[executorName] = executor;
            if (!executor.$$export && !executor.$exporter$factory) {
                // Tell the system to read the built executor from the registry
                Object.defineProperties(executor, {
                    $exporter$args: { value: [registry, executorName] },
                    $exporter$factory: {
                        value: (registry, executorName) => registry.pgExecutors[executorName],
                    },
                });
            }
            return executor;
        }
    }
    let addCodecForbidden = false;
    function addCodec(codec) {
        if (addCodecForbidden) {
            throw new Error(`It's too late to call addCodec now`);
        }
        const codecName = codec.name;
        if (registry.pgCodecs[codecName]) {
            if (registry.pgCodecs[codecName] !== codec) {
                console.dir({
                    existing: registry.pgCodecs[codecName],
                    new: codec,
                });
                throw new Error(`Codec named '${codecName}' is already registered; you cannot have two codecs with the same name`);
            }
            return codec;
        }
        else if (codec.$$export || codec.$exporter$factory) {
            registry.pgCodecs[codecName] = codec;
            return codec;
        }
        else {
            // Custom spec, pin it back to the registry
            registry.pgCodecs[codecName] = codec;
            if (codec.attributes) {
                const prevCols = codec.attributes;
                for (const col of Object.values(prevCols)) {
                    addCodec(col.codec);
                }
            }
            if (codec.arrayOfCodec) {
                addCodec(codec.arrayOfCodec);
            }
            if (codec.domainOfCodec) {
                addCodec(codec.domainOfCodec);
            }
            if (codec.rangeOfCodec) {
                addCodec(codec.rangeOfCodec);
            }
            // Tell the system to read the built codec from the registry
            Object.defineProperties(codec, {
                $exporter$args: { value: [registry, codecName] },
                $exporter$factory: {
                    value: (registry, codecName) => registry.pgCodecs[codecName],
                },
            });
            return codec;
        }
    }
    for (const [executorName, executor] of Object.entries(config.pgExecutors)) {
        if (executorName !== executor.name) {
            throw new Error(`Executor added to registry with wrong name; ${JSON.stringify(executorName)} !== ${JSON.stringify(executor.name)}`);
        }
        addExecutor(executor);
    }
    for (const [codecName, codec] of Object.entries(config.pgCodecs)) {
        if (codecName !== codec.name) {
            throw new Error(`Codec added to registry with wrong name`);
        }
        addCodec(codec);
    }
    for (const [resourceName, rawConfig] of Object.entries(config.pgResources)) {
        const resourceConfig = {
            ...rawConfig,
            executor: addExecutor(rawConfig.executor),
            codec: addCodec(rawConfig.codec),
            parameters: rawConfig.parameters
                ? rawConfig.parameters.map((p) => ({
                    ...p,
                    codec: addCodec(p.codec),
                }))
                : rawConfig.parameters,
        };
        const resource = new PgResource(registry, resourceConfig);
        // This is the magic that breaks the circular reference: rather than
        // building PgResource via a factory we tell the system to just retrieve it
        // from the already build registry.
        Object.defineProperties(resource, {
            $exporter$args: { value: [registry, resourceName] },
            $exporter$factory: {
                value: (registry, resourceName) => registry.pgResources[resourceName],
            },
        });
        registry.pgResources[resourceName] = resource;
    }
    // Ensure all the relation codecs are also added
    for (const codecName of Object.keys(config.pgRelations)) {
        const relations = config.pgRelations[codecName];
        if (!relations) {
            continue;
        }
        for (const relationName of Object.keys(relations)) {
            const relationConfig = relations[relationName];
            if (relationConfig) {
                addCodec(relationConfig.localCodec);
            }
        }
    }
    // DO NOT CALL addCodec BELOW HERE
    addCodecForbidden = true;
    addExecutorForbidden = true;
    /**
     * If the user uses a codec with attributes as a column type (or an array of
     * the codec is the column type, etc) then we need to have a resource for
     * processing this codec. So we add all table-like codecs here, then we
     * remove the ones that already have resources, then we build resources for the
     * remainder.
     */
    const tableLikeCodecsWithoutTableLikeResources = new Set();
    const walkCodec = (codec, isAccessibleViaAttribute = false, seen = new Set()) => {
        if (seen.has(codec)) {
            return;
        }
        seen.add(codec);
        if (isAccessibleViaAttribute &&
            codec.attributes &&
            codec.executor &&
            !codec.isAnonymous) {
            tableLikeCodecsWithoutTableLikeResources.add(codec);
        }
        if (codec.attributes) {
            for (const col of Object.values(codec.attributes)) {
                if (isAccessibleViaAttribute) {
                    walkCodec(col.codec, isAccessibleViaAttribute, seen);
                }
                else {
                    walkCodec(col.codec, true, new Set());
                }
            }
        }
        if (codec.arrayOfCodec) {
            walkCodec(codec.arrayOfCodec, isAccessibleViaAttribute, seen);
        }
        if (codec.rangeOfCodec) {
            walkCodec(codec.rangeOfCodec, isAccessibleViaAttribute, seen);
        }
        if (codec.domainOfCodec) {
            walkCodec(codec.domainOfCodec, isAccessibleViaAttribute, seen);
        }
    };
    // Add table-like codecs used within attributes
    for (const codec of Object.values(registry.pgCodecs)) {
        walkCodec(codec);
    }
    // Remove from these those codecs that already have resources
    for (const resource of Object.values(registry.pgResources)) {
        if (!resource.parameters) {
            tableLikeCodecsWithoutTableLikeResources.delete(resource.codec);
        }
    }
    // Now add resources for the table-like codecs that don't have them already
    for (const codec of tableLikeCodecsWithoutTableLikeResources) {
        if (codec.executor) {
            const resourceName = `frmcdc_${codec.name}`;
            const resource = new PgResource(registry, {
                name: resourceName,
                executor: codec.executor,
                from: (0, pg_sql2_1.default) `(select 1/0 /* codec-only resource; should not select directly */)`,
                codec,
                identifier: resourceName,
                isVirtual: true,
                extensions: {
                    tags: {
                        behavior: "-*",
                    },
                },
            });
            Object.defineProperties(resource, {
                $exporter$args: { value: [registry, resourceName] },
                $exporter$factory: {
                    value: (registry, resourceName) => registry.pgResources[resourceName],
                },
            });
            registry.pgResources[resourceName] = resource;
        }
    }
    for (const codecName of Object.keys(config.pgRelations)) {
        const relations = config.pgRelations[codecName];
        if (!relations) {
            continue;
        }
        const builtRelations = Object.create(null);
        // Tell the system to read the built relations from the registry
        Object.defineProperties(builtRelations, {
            $exporter$args: { value: [registry, codecName] },
            $exporter$factory: {
                value: (registry, codecName) => registry.pgRelations[codecName],
            },
        });
        for (const relationName of Object.keys(relations)) {
            const relationConfig = relations[relationName];
            if (!relationConfig) {
                continue;
            }
            const { localCodec, remoteResourceOptions, ...rest } = relationConfig;
            const builtRelation = {
                ...rest,
                localCodec,
                remoteResource: registry.pgResources[remoteResourceOptions.name],
            };
            // Tell the system to read the built relation from the registry
            Object.defineProperties(builtRelation, {
                $exporter$args: { value: [registry, codecName, relationName] },
                $exporter$factory: {
                    value: (registry, codecName, relationName) => registry.pgRelations[codecName][relationName],
                },
            });
            builtRelations[relationName] = builtRelation;
        }
        registry.pgRelations[codecName] = builtRelations;
    }
    validateRelations(registry);
    return registry;
}
(0, grafast_1.exportAs)("@dataplan/pg", makeRegistry, "makeRegistry");
function validateRelations(registry) {
    // PERF: skip this if not isDev?
    const reg = registry;
    for (const codec of Object.values(reg.pgCodecs)) {
        // Check that all the `via` and `identicalVia` match actual relations.
        const relationKeys = Object.keys(reg.pgRelations[codec.name] ?? {});
        if (codec.attributes) {
            Object.entries(codec.attributes).forEach(([attributeName, col]) => {
                const { via, identicalVia } = col;
                if (via != null) {
                    if (typeof via === "string") {
                        if (!relationKeys.includes(via)) {
                            throw new Error(`${codec.name} claims attribute '${attributeName}' is via relation '${via}', but there is no such relation.`);
                        }
                    }
                    else {
                        if (!relationKeys.includes(via.relation)) {
                            throw new Error(`${codec.name} claims attribute '${attributeName}' is via relation '${via.relation}', but there is no such relation.`);
                        }
                    }
                }
                if (identicalVia) {
                    if (typeof identicalVia === "string") {
                        if (!relationKeys.includes(identicalVia)) {
                            throw new Error(`${codec.name} claims attribute '${attributeName}' is identicalVia relation '${identicalVia}', but there is no such relation.`);
                        }
                    }
                    else {
                        if (!relationKeys.includes(identicalVia.relation)) {
                            throw new Error(`${codec.name} claims attribute '${attributeName}' is identicalVia relation '${identicalVia.relation}', but there is no such relation.`);
                        }
                    }
                }
            });
        }
    }
}
// eslint-disable-next-line @typescript-eslint/ban-types
function makeRegistryBuilder() {
    const registryConfig = {
        pgExecutors: Object.create(null),
        pgCodecs: Object.create(null),
        pgResources: Object.create(null),
        pgRelations: Object.create(null),
    };
    const builder = {
        getRegistryConfig() {
            return registryConfig;
        },
        addExecutor(executor) {
            const existing = registryConfig.pgExecutors[executor.name];
            if (existing) {
                if (existing !== executor) {
                    throw new Error(`Attempted to add a second executor named '${executor.name}' (existing: ${(0, inspect_js_1.inspect)(existing)}, new: ${(0, inspect_js_1.inspect)(executor)})`);
                }
                return builder;
            }
            registryConfig.pgExecutors[executor.name] = executor;
            return builder;
        },
        addCodec(codec) {
            const existing = registryConfig.pgCodecs[codec.name];
            if (existing) {
                if (existing !== codec) {
                    throw new Error(`Attempted to add a second codec named '${codec.name}' (existing: ${(0, inspect_js_1.inspect)(existing)}, new: ${(0, inspect_js_1.inspect)(codec)})`);
                }
                return builder;
            }
            registryConfig.pgCodecs[codec.name] = codec;
            if (codec.arrayOfCodec) {
                this.addCodec(codec.arrayOfCodec);
            }
            if (codec.domainOfCodec) {
                this.addCodec(codec.domainOfCodec);
            }
            if (codec.rangeOfCodec) {
                this.addCodec(codec.rangeOfCodec);
            }
            if (codec.attributes) {
                for (const col of Object.values(codec.attributes)) {
                    this.addCodec(col.codec);
                }
            }
            return builder;
        },
        addResource(resource) {
            this.addExecutor(resource.executor);
            const existing = registryConfig.pgResources[resource.name];
            if (existing) {
                if (existing !== resource) {
                    throw new Error(`Attempted to add a second resource named '${resource.name}':\n  First represented ${printResourceFrom(existing)}.\n  Second represents ${printResourceFrom(resource)}.\n  Details: ${chalk_1.default.bold.blue.underline `https://err.red/p2rc`}`);
                }
                return builder;
            }
            this.addCodec(resource.codec);
            registryConfig.pgResources[resource.name] = resource;
            return builder;
        },
        addRelation(localCodec, relationName, remoteResourceOptions, relation) {
            if (!registryConfig.pgCodecs[localCodec.name]) {
                throw new Error(`Adding a relation before adding the codec is forbidden.`);
            }
            if (!registryConfig.pgResources[remoteResourceOptions.name]) {
                throw new Error(`Adding a relation before adding the resource is forbidden.`);
            }
            if (!registryConfig.pgRelations[localCodec.name]) {
                registryConfig.pgRelations[localCodec.name] = Object.create(null);
            }
            registryConfig.pgRelations[localCodec.name][relationName] = {
                localCodec,
                remoteResourceOptions,
                ...relation,
            };
            return builder;
        },
        build() {
            return EXPORTABLE((makeRegistry, registryConfig) => makeRegistry(registryConfig), [makeRegistry, registryConfig], "registry");
        },
    };
    return builder;
}
(0, grafast_1.exportAs)("@dataplan/pg", makeRegistryBuilder, "makeRegistryBuilder");
function makePgResourceOptions(options) {
    return options;
}
(0, grafast_1.exportAs)("@dataplan/pg", makePgResourceOptions, "makePgResourceOptions");
function printResourceFrom(resource) {
    if (typeof resource.from === "function") {
        return `a function accepting ${resource.parameters?.length} parameters and returning SQL type '${pg_sql2_1.default.compile(resource.codec.sqlType).text}'`;
    }
    else {
        return `a table/view/etc called '${pg_sql2_1.default.compile(resource.from).text}'`;
    }
}
//# sourceMappingURL=datasource.js.map