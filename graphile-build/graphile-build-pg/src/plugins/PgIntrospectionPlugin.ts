import type { KeysOfType, WithPgClient } from "@dataplan/pg";
import { PgExecutor } from "@dataplan/pg";
import type { ExecutableStep, PromiseOrDirect } from "grafast";
import { constant, context, defer, object } from "grafast";
import type { GatherPluginContext } from "graphile-build";
import { EXPORTABLE, gatherConfig } from "graphile-build";
import type {
  Introspection,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDepend,
  PgDescription,
  PgEnum,
  PgExtension,
  PgIndex,
  PgInherits,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgRange,
  PgRoles,
  PgType,
} from "pg-introspection";
import {
  makeIntrospectionQuery,
  parseIntrospectionResults,
} from "pg-introspection";

import {
  withPgClientFromPgService,
  withSuperuserPgClientFromPgService,
} from "../pgServices.js";
import { version } from "../version.js";
import { watchFixtures } from "../watchFixtures.js";

export type PgEntityWithId =
  | PgNamespace
  | PgClass
  | PgConstraint
  | PgProc
  | PgRoles
  | PgType
  | PgEnum
  | PgExtension
  | PgExtension
  | PgIndex
  | PgLanguage;

declare global {
  namespace GraphileBuild {
    interface GatherOptions {
      /**
       * Should we attempt to install the watch fixtures into the database?
       *
       * Default: true
       */
      installWatchFixtures?: boolean;
    }
  }

  namespace GraphileConfig {
    interface GatherHelpers {
      pgIntrospection: {
        getIntrospection(): PromiseOrDirect<IntrospectionResults>;
        getService(serviceName: string): Promise<{
          introspection: Introspection;
          pgService: GraphileConfig.PgServiceConfiguration;
        }>;
        getExecutorForService(serviceName: string): PgExecutor;

        getNamespace(
          serviceName: string,
          id: string,
        ): Promise<PgNamespace | undefined>;
        getClasses(serviceName: string): Promise<PgClass[]>;
        getClass(serviceName: string, id: string): Promise<PgClass | undefined>;
        getConstraint(
          serviceName: string,
          id: string,
        ): Promise<PgConstraint | undefined>;
        getProc(serviceName: string, id: string): Promise<PgProc | undefined>;
        getRoles(serviceName: string, id: string): Promise<PgRoles | undefined>;
        getType(serviceName: string, id: string): Promise<PgType | undefined>;
        getEnum(serviceName: string, id: string): Promise<PgEnum | undefined>;
        getExtension(
          serviceName: string,
          id: string,
        ): Promise<PgExtension | undefined>;
        getIndex(serviceName: string, id: string): Promise<PgIndex | undefined>;
        getLanguage(
          serviceName: string,
          id: string,
        ): Promise<PgLanguage | undefined>;

        getAttribute(
          serviceName: string,
          classId: string,
          attributeNumber: number,
        ): Promise<PgAttribute | undefined>;
        // getAuthMembers(
        //   serviceName: string,
        //   id: string,
        // ): Promise<PgAuthMembers | undefined>;
        // getRange(serviceName: string, id: string): Promise<PgRange | undefined>;
        // getDepend(
        //   serviceName: string,
        //   id: string,
        // ): Promise<PgDepend | undefined>;
        // getDescription(
        //   serviceName: string,
        //   id: string,
        // ): Promise<PgDescription | undefined>;

        getAttributesForClass(
          serviceName: string,
          classId: string,
        ): Promise<PgAttribute[]>;
        getConstraintsForClass(
          serviceName: string,
          classId: string,
        ): Promise<PgConstraint[]>;
        getForeignConstraintsForClass(
          serviceName: string,
          classId: string,
        ): Promise<PgConstraint[]>;
        getInheritedForClass(
          serviceName: string,
          classId: string,
        ): Promise<PgInherits[]>;
        getNamespaceByName(
          serviceName: string,
          namespaceName: string,
        ): Promise<PgNamespace | undefined>;
        getClassByName(
          serviceName: string,
          namespaceName: string,
          tableName: string,
        ): Promise<PgClass | undefined>;
        getTypeByName(
          serviceName: string,
          namespaceName: string,
          typeName: string,
        ): Promise<PgType | undefined>;
        getTypeByArray(
          serviceName: string,
          arrayId: string,
        ): Promise<PgType | undefined>;
        getEnumsForType(serviceName: string, typeId: string): Promise<PgEnum[]>;
        getRangeByType(
          serviceName: string,
          typeId: string,
        ): Promise<PgRange | undefined>;
        getExtensionByName(
          serviceName: string,
          extensionName: string,
        ): Promise<PgExtension | undefined>;
      };
    }

    interface GatherHooks {
      pgIntrospection_introspection(event: {
        introspection: Introspection;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_namespace(event: {
        entity: PgNamespace;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_class(event: {
        entity: PgClass;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_attribute(event: {
        entity: PgAttribute;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_constraint(event: {
        entity: PgConstraint;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_proc(event: {
        entity: PgProc;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_role(event: {
        entity: PgRoles;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_auth_member(event: {
        entity: PgAuthMembers;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_type(event: {
        entity: PgType;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_enum(event: {
        entity: PgEnum;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_extension(event: {
        entity: PgExtension;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_index(event: {
        entity: PgIndex;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_language(event: {
        entity: PgLanguage;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_range(event: {
        entity: PgRange;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_depend(event: {
        entity: PgDepend;
        serviceName: string;
      }): PromiseOrDirect<void>;
      pgIntrospection_description(event: {
        entity: PgDescription;
        serviceName: string;
      }): PromiseOrDirect<void>;
    }
  }
}

type IntrospectionResults = Array<{
  pgService: GraphileConfig.PgServiceConfiguration;
  introspection: Introspection;
}>;

interface Cache {
  introspectionResultsPromise: null | Promise<IntrospectionResults>;
}

interface State {
  introspectionResultsPromise: null | PromiseOrDirect<IntrospectionResults>;
  executors: {
    [key: string]: PgExecutor;
  };
}

type PgExecutorContextPlans<TSettings = any> = {
  pgSettings: ExecutableStep<TSettings>;
  withPgClient: ExecutableStep<WithPgClient>;
};

async function getDb(
  info: GatherPluginContext<State, Cache>,
  serviceName: string,
) {
  const introspections = await info.helpers.pgIntrospection.getIntrospection();
  const relevant = introspections.find(
    (intro) => intro.pgService.name === serviceName,
  );
  if (!relevant) {
    throw new Error(`Could not find database '${serviceName}'`);
  }
  return relevant;
}

function makeGetEntity<
  TKey extends KeysOfType<Introspection, Array<PgEntityWithId>>,
>(loc: TKey) {
  return async (
    info: GatherPluginContext<State, Cache>,
    serviceName: string,
    id: string,
  ): Promise<Introspection[TKey][number] | undefined> => {
    const relevant = await getDb(info, serviceName);
    const list = relevant.introspection[loc];
    if (!list) {
      throw new Error(
        `Could not find database '${serviceName}''s introspection results for '${loc}'`,
      );
    }
    return (list as PgEntityWithId[]).find((entity: PgEntityWithId) =>
      "_id" in entity
        ? entity._id === id
        : "indexrelid" in entity
        ? entity.indexrelid
        : false,
    );
  };
}

function makeGetEntities<
  TKey extends KeysOfType<Introspection, Array<PgEntityWithId>>,
>(loc: TKey) {
  return async (
    info: GatherPluginContext<State, Cache>,
    serviceName: string,
  ): Promise<Introspection[TKey]> => {
    const relevant = await getDb(info, serviceName);
    const list = relevant.introspection[loc];
    if (!list) {
      throw new Error(
        `Could not find database '${serviceName}''s introspection results for '${loc}'`,
      );
    }
    return list as any[];
  };
}

export const PgIntrospectionPlugin: GraphileConfig.Plugin = {
  name: "PgIntrospectionPlugin",
  description:
    "Introspects PostgreSQL databases and makes the results available to other plugins",
  version: version,

  // Run before PgRegistryPlugin because we want all the introspection to be
  // triggered/announced before the registryBuilder is built.
  before: ["PgRegistryPlugin"],

  gather: gatherConfig({
    namespace: "pgIntrospection",
    initialCache: (): Cache => ({
      introspectionResultsPromise: null,
    }),
    initialState: (): State => ({
      introspectionResultsPromise: null,
      executors: Object.create(null),
    }),
    helpers: {
      getExecutorForService(info, serviceName) {
        if (info.state.executors[serviceName]) {
          return info.state.executors[serviceName];
        }
        const pgService = info.resolvedPreset.pgServices?.find(
          (db) => db.name === serviceName,
        );
        if (!pgService) {
          throw new Error(`Database '${serviceName}' not found`);
        }
        const { pgSettingsKey, withPgClientKey } = pgService;
        const executor = EXPORTABLE(
          (
            PgExecutor,
            constant,
            context,
            object,
            pgSettingsKey,
            serviceName,
            withPgClientKey,
          ) =>
            new PgExecutor({
              name: serviceName,
              context: () => {
                const ctx = context<Grafast.Context>();
                return object({
                  pgSettings:
                    pgSettingsKey != null
                      ? ctx.get(pgSettingsKey)
                      : constant(null),
                  withPgClient: ctx.get(withPgClientKey),
                } as PgExecutorContextPlans<any>);
              },
            }),
          [
            PgExecutor,
            constant,
            context,
            object,
            pgSettingsKey,
            serviceName,
            withPgClientKey,
          ],
        );
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

      // TODO: we need getters for these
      // getAuthMembers: makeGetEntity("authMembers"),
      // getRange: makeGetEntity("ranges"),
      // getDepend: makeGetEntity("depends"),
      // getDescription: makeGetEntity("descriptions"),
      //

      async getAttribute(info, serviceName, classId, attributeNumber) {
        // const pgClass = info.helpers.pgIntrospection.getClass(info, serviceName, classId);
        const attributes =
          await info.helpers.pgIntrospection.getAttributesForClass(
            serviceName,
            classId,
          );
        return attributes.find((attr) => attr.attnum === attributeNumber);
      },

      async getAttributesForClass(info, serviceName, classId) {
        // const pgClass = info.helpers.pgIntrospection.getClass(info, serviceName, classId);
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.attributes;
        // TODO: cache
        return list.filter((entity) => entity.attrelid === classId);
      },

      async getConstraintsForClass(info, serviceName, classId) {
        // const pgClass = info.helpers.pgIntrospection.getClass(info, serviceName, classId);
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.constraints;
        // TODO: cache
        return list.filter((entity) => entity.conrelid === classId);
      },

      async getForeignConstraintsForClass(info, serviceName, classId) {
        // const pgClass = info.helpers.pgIntrospection.getClass(info, serviceName, classId);
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.constraints;
        // TODO: cache
        return list.filter((entity) => entity.confrelid === classId);
      },

      async getInheritedForClass(info, serviceName, classId) {
        // const pgClass = info.helpers.pgIntrospection.getClass(info, serviceName, classId);
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.inherits;
        // TODO: cache
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
        return list.find(
          (rel) =>
            rel.getNamespace()!.nspname === schemaName &&
            rel.relname === tableName,
        );
      },

      async getTypeByName(info, serviceName, schemaName, typeName) {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.types;
        return list.find(
          (typ) =>
            typ.getNamespace()!.nspname === schemaName &&
            typ.typname === typeName,
        );
      },

      // TODO: we should maybe use pg_type.typelem and look up by ID directy
      // instead of having this function
      async getTypeByArray(info, serviceName, arrayId) {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.types;
        return list.find((type) => type.typarray === arrayId);
      },

      async getEnumsForType(info, serviceName, typeId) {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.enums;
        // TODO: cache
        return list
          .filter((entity) => entity.enumtypid === typeId)
          .sort((a, z) => a.enumsortorder - z.enumsortorder);
      },

      async getRangeByType(info, serviceName, typeId) {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.ranges;
        // TODO: cache
        return list.find((entity) => entity.rngtypid === typeId);
      },

      async getExtensionByName(info, serviceName, extensionName) {
        const relevant = await getDb(info, serviceName);
        const list = relevant.introspection.extensions;
        // TODO: cache
        return list.find((entity) => entity.extname === extensionName);
      },

      getIntrospection(info) {
        // IMPORTANT: introspection shouldn't change within a single run (even
        // if the cache does), thus we add it to state.

        if (info.state.introspectionResultsPromise) {
          return info.state.introspectionResultsPromise;
        }

        info.state.introspectionResultsPromise =
          info.cache.introspectionResultsPromise ??
          (async () => {
            if (info.cache.introspectionResultsPromise) {
              return info.cache.introspectionResultsPromise;
            }
            if (!info.resolvedPreset.pgServices) {
              return [];
            }
            const seenNames = new Map<string, number>();
            const seenPgSettingsKeys = new Map<string, number>();
            const seenWithPgClientKeys = new Map<string, number>();
            // Resolve the promise ASAP so dependents can `getIntrospection()` and then `getClass` or whatever from the result.
            const introspectionPromise = Promise.all(
              info.resolvedPreset.pgServices.map(async (pgService, i) => {
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
                    throw new Error(
                      `pgServices[${i}] has the same name as pgServices[${existingIndex}] (${JSON.stringify(
                        name,
                      )})`,
                    );
                  }
                  seenNames.set(name, i);
                }
                {
                  const existingIndex =
                    seenWithPgClientKeys.get(withPgClientKey);
                  if (existingIndex != null) {
                    throw new Error(
                      `pgServices[${i}] has the same withPgClientKey as pgServices[${existingIndex}] (${JSON.stringify(
                        withPgClientKey,
                      )})`,
                    );
                  }
                  seenWithPgClientKeys.set(withPgClientKey, i);
                }
                if (pgSettingsKey) {
                  const existingIndex = seenPgSettingsKeys.get(pgSettingsKey);
                  if (existingIndex != null) {
                    throw new Error(
                      `pgServices[${i}] has the same pgSettingsKey as pgServices[${existingIndex}] (${JSON.stringify(
                        pgSettingsKey,
                      )})`,
                    );
                  }
                  seenPgSettingsKeys.set(pgSettingsKey, i);
                }

                // Do the introspection
                const introspectionQuery = makeIntrospectionQuery();
                const {
                  rows: [row],
                } = await withPgClientFromPgService(
                  pgService,
                  pgService.pgSettingsForIntrospection ?? null,
                  (client) =>
                    client.query<{ introspection: string }>({
                      text: introspectionQuery,
                    }),
                );
                if (!row) {
                  throw new Error("Introspection failed");
                }
                const introspection = parseIntrospectionResults(
                  row.introspection,
                );
                return { pgService, introspection };
              }),
            );

            info.cache.introspectionResultsPromise = introspectionPromise;
            // Don't cache errors
            introspectionPromise.then(null, () => {
              info.cache.introspectionResultsPromise = null;
            });

            const introspections = await introspectionPromise;

            // Store the resolved state, so access during announcements doesn't cause the system to hang
            info.state.introspectionResultsPromise = introspections;

            // Announce it
            await Promise.all(
              introspections.map(async (result) => {
                const { introspection, pgService } = result;

                const {
                  namespaces,
                  classes,
                  attributes,
                  constraints,
                  procs,
                  roles,
                  auth_members,
                  types,
                  enums,
                  extensions,
                  indexes,
                  languages,
                  ranges,
                  depends,
                  descriptions,
                } = introspection;

                function announce<
                  TEvent extends keyof GraphileConfig.GatherHooks,
                >(
                  eventName: TEvent,
                  entities: GraphileConfig.GatherHooks[TEvent] extends (
                    firstArg: { entity: infer V; serviceName: string },
                    ...rest: any[]
                  ) => any
                    ? V[]
                    : never,
                ) {
                  const promises: Promise<any>[] = [];
                  for (const entity of entities) {
                    promises.push(
                      (info.process as any)(eventName, {
                        entity: entity,
                        serviceName: pgService.name,
                      }),
                    );
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
              }),
            );

            return introspections;
          })();

        return info.state.introspectionResultsPromise;
      },
      async getService(info, serviceName) {
        const all = await info.helpers.pgIntrospection.getIntrospection();
        const match = all.find((n) => n.pgService.name === serviceName);
        if (!match) {
          throw new Error(
            `Could not find results for database '${serviceName}'`,
          );
        }
        return match;
      },
    },

    hooks: {
      async pgRegistry_PgRegistryBuilder_init(info, _event) {
        await info.helpers.pgIntrospection.getIntrospection();
      },
    },

    async watch(info, callback) {
      const unlistens: Array<() => void> = [];
      for (const pgService of info.resolvedPreset.pgServices ?? []) {
        if (!pgService.pgSubscriber) {
          console.warn(
            `pgService '${pgService.name}' does not have a pgSubscriber, and thus cannot be used for watch mode`,
          );
          continue;
        }
        // install the watch fixtures
        if (info.options.installWatchFixtures ?? true) {
          try {
            await withSuperuserPgClientFromPgService(
              pgService,
              null,
              (client) => client.query({ text: watchFixtures }),
            );
          } catch (e) {
            console.warn(
              `Failed to install watch fixtures into '${pgService.name}'.\nInstalling watch fixtures requires superuser privileges; have you correctly configured a 'superuserConnectionString'?\nYou may also opt to configure 'installWatchFixtures: false' and install them yourself.\n\nPostgres says: ${e}`,
            );
          }
        }
        try {
          const eventStream = await pgService.pgSubscriber.subscribe(
            "postgraphile_watch",
          );
          const $$stop = Symbol("stop");
          const abort = defer<typeof $$stop>();
          unlistens.push(() => abort.resolve($$stop));
          const waitNext = () => {
            const next = Promise.race([abort, eventStream.next()]);
            next.then(
              (event) => {
                if (event === $$stop) {
                  // Terminate the stream
                  if (eventStream.return) {
                    eventStream.return();
                  } else if (eventStream.throw) {
                    eventStream.throw(
                      new Error("Please stop streaming events now."),
                    );
                  }
                } else {
                  try {
                    // Delete the introspection results
                    info.cache.introspectionResultsPromise = null;
                    // Trigger re-gather
                    callback();
                  } finally {
                    // Wait for the next event
                    waitNext();
                  }
                }
              },
              (e) => {
                console.error(
                  `Unexpected error occurred while watching pgService '${pgService.name}' for schema changes.`,
                  e,
                );
                abort.resolve($$stop);
              },
            );
          };
          waitNext();
        } catch (e) {
          console.warn(`Failed to watch '${pgService.name}': ${e}`);
        }
      }
      return () => {
        for (const cb of unlistens) {
          try {
            cb();
          } catch {
            /*nom nom nom*/
          }
        }
      };
    },
  }),
};
