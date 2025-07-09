"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgIntrospectionPlugin = void 0;
const pg_1 = require("@dataplan/pg");
const grafast_1 = require("grafast");
const graphile_build_1 = require("graphile-build");
const pg_introspection_1 = require("pg-introspection");
const version_js_1 = require("../version.js");
const watchFixtures_js_1 = require("../watchFixtures.js");
async function getDb(info, serviceName) {
    const introspections = await info.helpers.pgIntrospection.getIntrospection();
    const relevant = introspections.find((intro) => intro.pgService.name === serviceName);
    if (!relevant) {
        throw new Error(`Could not find database '${serviceName}'`);
    }
    return relevant;
}
function makeGetEntity(loc) {
    return async (info, serviceName, id) => {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection[loc];
        if (!list) {
            throw new Error(`Could not find database '${serviceName}''s introspection results for '${loc}'`);
        }
        return list.find((entity) => "_id" in entity
            ? entity._id === id
            : "indexrelid" in entity
                ? entity.indexrelid
                : false);
    };
}
function makeGetEntities(loc) {
    return async (info, serviceName) => {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection[loc];
        if (!list) {
            throw new Error(`Could not find database '${serviceName}''s introspection results for '${loc}'`);
        }
        return list;
    };
}
exports.PgIntrospectionPlugin = {
    name: "PgIntrospectionPlugin",
    description: "Introspects PostgreSQL databases and makes the results available to other plugins",
    version: version_js_1.version,
    // Run before PgRegistryPlugin because we want all the introspection to be
    // triggered/announced before the registryBuilder is built.
    before: ["PgRegistryPlugin"],
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgIntrospection",
        initialCache: () => ({
            introspectionResultsPromise: null,
            dirty: false,
        }),
        initialState: () => ({
            getIntrospectionPromise: null,
            executors: Object.create(null),
        }),
        helpers: {
            getExecutorForService(info, serviceName) {
                if (info.state.executors[serviceName]) {
                    return info.state.executors[serviceName];
                }
                const pgService = info.resolvedPreset.pgServices?.find((db) => db.name === serviceName);
                if (!pgService) {
                    throw new Error(`Database '${serviceName}' not found`);
                }
                const { pgSettingsKey, withPgClientKey } = pgService;
                /* TODO: consider replacing the `withPgClient` with:
                   ```
                   withPgClient: assertNotNull(
                     ctx.get(withPgClientKey),
                     `Server is misconfigured; unable to find '${withPgClientKey}' in context.`,
                   ),
                   ```
                */
                const executor = (0, graphile_build_1.EXPORTABLE)((PgExecutor, constant, context, object, pgSettingsKey, serviceName, withPgClientKey) => new PgExecutor({
                    name: serviceName,
                    context: () => {
                        const ctx = context();
                        return object({
                            pgSettings: pgSettingsKey != null
                                ? ctx.get(pgSettingsKey)
                                : constant(null),
                            withPgClient: ctx.get(withPgClientKey),
                        });
                    },
                }), [
                    pg_1.PgExecutor,
                    grafast_1.constant,
                    grafast_1.context,
                    grafast_1.object,
                    pgSettingsKey,
                    serviceName,
                    withPgClientKey,
                ], serviceName === "main" ? `executor` : `${serviceName}Executor`);
                info.state.executors[serviceName] = executor;
                return executor;
            },
            getNamespace: makeGetEntity("namespaces"),
            getClasses: makeGetEntities("classes"),
            getClass: makeGetEntity("classes"),
            getConstraint: makeGetEntity("constraints"),
            getProc: makeGetEntity("procs"),
            getRoles: makeGetEntity("roles"),
            getType: makeGetEntity("types"),
            getEnum: makeGetEntity("enums"),
            getExtension: makeGetEntity("extensions"),
            getIndex: makeGetEntity("indexes"),
            getLanguage: makeGetEntity("languages"),
            // ENHANCE: we need getters for these
            // getAuthMembers: makeGetEntity("authMembers"),
            // getRange: makeGetEntity("ranges"),
            // getDepend: makeGetEntity("depends"),
            // getDescription: makeGetEntity("descriptions"),
            //
            async getAttribute(info, serviceName, classId, attributeNumber) {
                const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                return pgClass?.getAttribute({ number: attributeNumber });
            },
            async getAttributesForClass(info, serviceName, classId) {
                const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                return pgClass?.getAttributes() ?? [];
            },
            async getConstraintsForClass(info, serviceName, classId) {
                const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                return pgClass?.getConstraints() ?? [];
            },
            async getForeignConstraintsForClass(info, serviceName, classId) {
                const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                return pgClass?.getForeignConstraints() ?? [];
            },
            async getInheritedForClass(info, serviceName, classId) {
                // const pgClass = await info.helpers.pgIntrospection.getClass(serviceName, classId);
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.inherits;
                // PERF: cache
                return list.filter((entity) => entity.inhrelid === classId);
            },
            async getNamespaceByName(info, serviceName, name) {
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.namespaces;
                return list.find((nsp) => nsp.nspname === name);
            },
            async getClassByName(info, serviceName, schemaName, tableName) {
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.classes;
                return list.find((rel) => rel.getNamespace().nspname === schemaName &&
                    rel.relname === tableName);
            },
            async getTypeByName(info, serviceName, schemaName, typeName) {
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.types;
                return list.find((typ) => typ.getNamespace().nspname === schemaName &&
                    typ.typname === typeName);
            },
            // ENHANCE: we should maybe use pg_type.typelem and look up by ID directy
            // instead of having this function
            async getTypeByArray(info, serviceName, arrayId) {
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.types;
                return list.find((type) => type.typarray === arrayId);
            },
            async getEnumsForType(info, serviceName, typeId) {
                const type = await info.helpers.pgIntrospection.getType(serviceName, typeId);
                return type?.getEnumValues() ?? [];
            },
            async getRangeByType(info, serviceName, typeId) {
                const type = await info.helpers.pgIntrospection.getType(serviceName, typeId);
                return type?.getRange();
            },
            async getExtensionByName(info, serviceName, extensionName) {
                const relevant = await getDb(info, serviceName);
                const list = relevant.introspection.extensions;
                // PERF: cache
                return list.find((entity) => entity.extname === extensionName);
            },
            getIntrospection(info) {
                // IMPORTANT: introspection shouldn't change within a single run (even
                // if the cache does), thus we add it to state.
                return (info.state.getIntrospectionPromise ??
                    (info.state.getIntrospectionPromise = (async () => {
                        // If the cache is dirty, clear it now we're about to replace it.
                        if (info.cache.dirty) {
                            info.cache.introspectionResultsPromise = null;
                            info.cache.dirty = false;
                        }
                        // Introspect the database (or read it from CLEAN cache)
                        const introspectionPromise = info.cache.introspectionResultsPromise ??
                            (info.cache.introspectionResultsPromise = introspectPgServices(info.resolvedPreset.pgServices));
                        // Don't cache errors
                        introspectionPromise.then(null, () => {
                            info.cache.introspectionResultsPromise = null;
                        });
                        const rawIntrospections = await introspectionPromise;
                        const introspections = rawIntrospections.map(({ pgService, introspectionText }) => ({
                            pgService,
                            // IMPORTANT: parseIntrospectionResults must NOT be cached, because other plugins mutate it.
                            introspection: (0, pg_introspection_1.parseIntrospectionResults)(introspectionText),
                        }));
                        // Store the resolved state, so access during announcements doesn't cause the system to hang
                        info.state.getIntrospectionPromise = introspections;
                        // Announce the introspection results.
                        // NOTE: we must not *cache* this, because it needs to run on every
                        // gather. We only do it once per gather though, so writing to state
                        // is fine.
                        await Promise.all(introspections.map(async (result) => {
                            const { introspection, pgService } = result;
                            const { namespaces, classes, attributes, constraints, procs, roles, auth_members, types, enums, extensions, indexes, languages, ranges, depends, descriptions, } = introspection;
                            function announce(eventName, entities) {
                                const promises = [];
                                for (const entity of entities) {
                                    promises.push(info.process(eventName, {
                                        entity: entity,
                                        serviceName: pgService.name,
                                    }));
                                }
                                return Promise.all(promises);
                            }
                            await info.process("pgIntrospection_introspection", {
                                introspection,
                                serviceName: pgService.name,
                            });
                            await announce("pgIntrospection_namespace", namespaces);
                            await announce("pgIntrospection_class", classes);
                            await announce("pgIntrospection_attribute", attributes);
                            await announce("pgIntrospection_constraint", constraints);
                            await announce("pgIntrospection_proc", procs);
                            await announce("pgIntrospection_role", roles);
                            await announce("pgIntrospection_auth_member", auth_members);
                            await announce("pgIntrospection_type", types);
                            await announce("pgIntrospection_enum", enums);
                            await announce("pgIntrospection_extension", extensions);
                            await announce("pgIntrospection_index", indexes);
                            await announce("pgIntrospection_language", languages);
                            await announce("pgIntrospection_range", ranges);
                            await announce("pgIntrospection_depend", depends);
                            await announce("pgIntrospection_description", descriptions);
                        }));
                        return introspections;
                    })()));
            },
            async getService(info, serviceName) {
                const all = await info.helpers.pgIntrospection.getIntrospection();
                const match = all.find((n) => n.pgService.name === serviceName);
                if (!match) {
                    throw new Error(`Could not find results for database '${serviceName}'`);
                }
                return match;
            },
        },
        hooks: {
            async pgRegistry_PgRegistryBuilder_init(info, _event) {
                await info.helpers.pgIntrospection.getIntrospection();
            },
            pgRegistry_PgRegistryBuilder_pgExecutors(info, event) {
                for (const pgService of info.resolvedPreset.pgServices ?? []) {
                    const executor = info.helpers.pgIntrospection.getExecutorForService(pgService.name);
                    event.registryBuilder.addExecutor(executor);
                }
            },
        },
        async watch(info, callback) {
            const unlistens = [];
            for (const pgService of info.resolvedPreset.pgServices ?? []) {
                if (!pgService.pgSubscriber) {
                    console.warn(`pgService '${pgService.name}' does not have a pgSubscriber, and thus cannot be used for watch mode`);
                    continue;
                }
                // install the watch fixtures
                if (info.options.installWatchFixtures ?? true) {
                    try {
                        await (0, pg_1.withSuperuserPgClientFromPgService)(pgService, null, (client) => client.query({ text: watchFixtures_js_1.watchFixtures }));
                    }
                    catch (e) {
                        console.warn(`Failed to install watch fixtures into '${pgService.name}'.\nInstalling watch fixtures requires superuser privileges; have you correctly configured a 'superuserConnectionString'?\nYou may also opt to configure 'installWatchFixtures: false' and install them yourself.\n\nPostgres says: ${e}`);
                    }
                }
                try {
                    const eventStream = await pgService.pgSubscriber.subscribe("postgraphile_watch");
                    const $$stop = Symbol("stop");
                    const abort = (0, grafast_1.defer)();
                    unlistens.push(() => abort.resolve($$stop));
                    const waitNext = () => {
                        const next = Promise.race([abort, eventStream.next()]);
                        next.then((event) => {
                            if (event === $$stop) {
                                // Terminate the stream
                                if (eventStream.return) {
                                    eventStream.return();
                                }
                                else if (eventStream.throw) {
                                    eventStream.throw(new Error("Please stop streaming events now."));
                                }
                            }
                            else {
                                try {
                                    // Delete the introspection results
                                    info.cache.introspectionResultsPromise = null;
                                    // Deleting the introspection results is not sufficient since they might be replaced before gather runs again
                                    info.cache.dirty = true;
                                    // Trigger re-gather
                                    callback();
                                }
                                finally {
                                    // Wait for the next event
                                    waitNext();
                                }
                            }
                        }, (e) => {
                            console.error(`Unexpected error occurred while watching pgService '${pgService.name}' for schema changes.`, e);
                            abort.resolve($$stop);
                        });
                    };
                    waitNext();
                }
                catch (e) {
                    console.warn(`Failed to watch '${pgService.name}': ${e}`);
                }
            }
            return () => {
                for (const cb of unlistens) {
                    try {
                        cb();
                    }
                    catch {
                        /*nom nom nom*/
                    }
                }
            };
        },
    }),
};
function introspectPgServices(pgServices) {
    if (!pgServices) {
        return Promise.resolve([]);
    }
    const seenNames = new Map();
    const seenPgSettingsKeys = new Map();
    const seenWithPgClientKeys = new Map();
    // Resolve the promise ASAP so dependents can `getIntrospection()` and then
    // `getClass` or whatever from the result.
    return Promise.all(pgServices.map(async (pgService, i) => {
        // Validate there's no conflicts between pgServices
        const { name, pgSettingsKey, withPgClientKey } = pgService;
        if (!name) {
            throw new Error(`pgServices[${i}] has no name`);
        }
        if (!withPgClientKey) {
            throw new Error(`pgServices[${i}] has no withPgClientKey`);
        }
        {
            const existingIndex = seenNames.get(name);
            if (existingIndex != null) {
                throw new Error(`pgServices[${i}] has the same name as pgServices[${existingIndex}] (${JSON.stringify(name)})`);
            }
            seenNames.set(name, i);
        }
        {
            const existingIndex = seenWithPgClientKeys.get(withPgClientKey);
            if (existingIndex != null) {
                throw new Error(`pgServices[${i}] has the same withPgClientKey as pgServices[${existingIndex}] (${JSON.stringify(withPgClientKey)})`);
            }
            seenWithPgClientKeys.set(withPgClientKey, i);
        }
        if (pgSettingsKey) {
            const existingIndex = seenPgSettingsKeys.get(pgSettingsKey);
            if (existingIndex != null) {
                throw new Error(`pgServices[${i}] has the same pgSettingsKey as pgServices[${existingIndex}] (${JSON.stringify(pgSettingsKey)})`);
            }
            seenPgSettingsKeys.set(pgSettingsKey, i);
        }
        // Do the introspection
        const introspectionQuery = (0, pg_introspection_1.makeIntrospectionQuery)();
        const { rows: [row], } = await (0, pg_1.withPgClientFromPgService)(pgService, pgService.pgSettingsForIntrospection ?? null, (client) => client.query({
            text: introspectionQuery,
        }));
        if (!row) {
            throw new Error("Introspection failed");
        }
        return { pgService, introspectionText: row.introspection };
    }));
}
//# sourceMappingURL=PgIntrospectionPlugin.js.map