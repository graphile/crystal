import "graphile-build";

import type { WithPgClient } from "@dataplan/pg";
import { PgExecutor } from "@dataplan/pg";
import type { ExecutablePlan, PromiseOrDirect } from "dataplanner";
import { constant, context, object } from "dataplanner";
import type { GatherPluginContext } from "graphile-build";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE } from "graphile-export";
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

import { version } from "../index.js";
import type { KeysOfType } from "../interfaces.js";
import {
  listenWithPgClientFromPgSource,
  withPgClientFromPgSource,
} from "../pgSources.js";
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
    // TODO: Should we move this interface (which is defined in many places) to GraphileConfig?
    interface GraphileBuildGatherOptions {
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
        getIntrospection(): Promise<
          Array<{
            introspection: Introspection;
            database: GraphileConfig.PgDatabaseConfiguration;
          }>
        >;
        getExecutorForDatabase(databaseName: string): PgExecutor;

        getNamespace(
          databaseName: string,
          id: string,
        ): Promise<PgNamespace | undefined>;
        getClasses(databaseName: string): Promise<PgClass[]>;
        getClass(
          databaseName: string,
          id: string,
        ): Promise<PgClass | undefined>;
        getConstraint(
          databaseName: string,
          id: string,
        ): Promise<PgConstraint | undefined>;
        getProc(databaseName: string, id: string): Promise<PgProc | undefined>;
        getRoles(
          databaseName: string,
          id: string,
        ): Promise<PgRoles | undefined>;
        getType(databaseName: string, id: string): Promise<PgType | undefined>;
        getEnum(databaseName: string, id: string): Promise<PgEnum | undefined>;
        getExtension(
          databaseName: string,
          id: string,
        ): Promise<PgExtension | undefined>;
        getIndex(
          databaseName: string,
          id: string,
        ): Promise<PgIndex | undefined>;
        getLanguage(
          databaseName: string,
          id: string,
        ): Promise<PgLanguage | undefined>;

        getAttribute(
          databaseName: string,
          classId: string,
          attributeNumber: number,
        ): Promise<PgAttribute | undefined>;
        // getAuthMembers(
        //   databaseName: string,
        //   id: string,
        // ): Promise<PgAuthMembers | undefined>;
        // getRange(databaseName: string, id: string): Promise<PgRange | undefined>;
        // getDepend(
        //   databaseName: string,
        //   id: string,
        // ): Promise<PgDepend | undefined>;
        // getDescription(
        //   databaseName: string,
        //   id: string,
        // ): Promise<PgDescription | undefined>;

        getAttributesForClass(
          databaseName: string,
          classId: string,
        ): Promise<PgAttribute[]>;
        getConstraintsForClass(
          databaseName: string,
          classId: string,
        ): Promise<PgConstraint[]>;
        getForeignConstraintsForClass(
          databaseName: string,
          classId: string,
        ): Promise<PgConstraint[]>;
        getNamespaceByName(
          databaseName: string,
          namespaceName: string,
        ): Promise<PgNamespace | undefined>;
        getClassByName(
          databaseName: string,
          namespaceName: string,
          tableName: string,
        ): Promise<PgClass | undefined>;
        getTypeByArray(
          databaseName: string,
          arrayId: string,
        ): Promise<PgType | undefined>;
        getEnumsForType(
          databaseName: string,
          typeId: string,
        ): Promise<PgEnum[]>;
        getRangeByType(
          databaseName: string,
          typeId: string,
        ): Promise<PgRange | null>;
      };
    }

    interface GatherHooks {
      pgIntrospection_introspection: PluginHook<
        (event: {
          introspection: Introspection;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_namespace: PluginHook<
        (event: {
          entity: PgNamespace;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_class: PluginHook<
        (event: {
          entity: PgClass;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_attribute: PluginHook<
        (event: {
          entity: PgAttribute;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_constraint: PluginHook<
        (event: {
          entity: PgConstraint;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_proc: PluginHook<
        (event: {
          entity: PgProc;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_role: PluginHook<
        (event: {
          entity: PgRoles;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_auth_member: PluginHook<
        (event: {
          entity: PgAuthMembers;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_type: PluginHook<
        (event: {
          entity: PgType;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_enum: PluginHook<
        (event: {
          entity: PgEnum;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_extension: PluginHook<
        (event: {
          entity: PgExtension;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_index: PluginHook<
        (event: {
          entity: PgIndex;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_language: PluginHook<
        (event: {
          entity: PgLanguage;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_range: PluginHook<
        (event: {
          entity: PgRange;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_depend: PluginHook<
        (event: {
          entity: PgDepend;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
      pgIntrospection_description: PluginHook<
        (event: {
          entity: PgDescription;
          databaseName: string;
        }) => PromiseOrDirect<void>
      >;
    }
  }
}

type IntrospectionResults = Array<{
  database: GraphileConfig.PgDatabaseConfiguration;
  introspection: Introspection;
}>;

interface Cache {
  introspectionResultsPromise: null | Promise<IntrospectionResults>;
}

interface State {
  introspectionResultsPromise: null | Promise<IntrospectionResults>;
  executors: {
    [key: string]: PgExecutor;
  };
}

type PgExecutorContextPlans<TSettings = any> = {
  pgSettings: ExecutablePlan<TSettings>;
  withPgClient: ExecutablePlan<WithPgClient>;
};

async function getDb(
  info: GatherPluginContext<State, Cache>,
  databaseName: string,
) {
  const introspections = await info.helpers.pgIntrospection.getIntrospection();
  const relevant = introspections.find(
    (intro) => intro.database.name === databaseName,
  );
  if (!relevant) {
    throw new Error(`Could not find database '${databaseName}'`);
  }
  return relevant;
}

function makeGetEntity<
  TKey extends KeysOfType<Introspection, Array<PgEntityWithId>>,
>(loc: TKey) {
  return async (
    info: GatherPluginContext<State, Cache>,
    databaseName: string,
    id: string,
  ): Promise<Introspection[TKey][number] | undefined> => {
    const relevant = await getDb(info, databaseName);
    const list = relevant.introspection[loc];
    if (!list) {
      throw new Error(
        `Could not find database '${databaseName}''s introspection results for '${loc}'`,
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
    databaseName: string,
  ): Promise<Introspection[TKey]> => {
    const relevant = await getDb(info, databaseName);
    const list = relevant.introspection[loc];
    if (!list) {
      throw new Error(
        `Could not find database '${databaseName}''s introspection results for '${loc}'`,
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
  // TODO: refactor TypeScript so this isn't necessary; maybe via `makePluginGatherConfig`?
  gather: <GraphileConfig.PluginGatherConfig<"pgIntrospection", State, Cache>>{
    namespace: "pgIntrospection",
    initialCache: (): Cache => ({
      introspectionResultsPromise: null,
    }),
    initialState: (): State => ({
      introspectionResultsPromise: null,
      executors: {},
    }),
    helpers: {
      getExecutorForDatabase(info, databaseName) {
        if (info.state.executors[databaseName]) {
          return info.state.executors[databaseName];
        }
        const database = info.resolvedPreset.pgSources?.find(
          (db) => db.name === databaseName,
        );
        if (!database) {
          throw new Error(`Database '${databaseName}' not found`);
        }
        const { pgSettingsKey, withPgClientKey } = database;
        const executor = EXPORTABLE(
          (
            PgExecutor,
            context,
            databaseName,
            object,
            pgSettingsKey,
            withPgClientKey,
          ) =>
            new PgExecutor({
              name: databaseName,
              context: () => {
                const ctx = context<GraphileBuild.GraphileResolverContext>();
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
            context,
            databaseName,
            object,
            pgSettingsKey as keyof GraphileBuild.GraphileResolverContext,
            withPgClientKey,
          ],
        );
        info.state.executors[databaseName] = executor;
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

      async getAttribute(info, databaseName, classId, attributeNumber) {
        // const pgClass = this.getClass(info, databaseName, classId);
        const attributes = await this.getAttributesForClass(
          info,
          databaseName,
          classId,
        );
        return attributes.find((attr) => attr.attnum === attributeNumber);
      },

      async getAttributesForClass(info, databaseName, classId) {
        // const pgClass = this.getClass(info, databaseName, classId);
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.attributes;
        // TODO: cache
        return list.filter((entity) => entity.attrelid === classId);
      },

      async getConstraintsForClass(info, databaseName, classId) {
        // const pgClass = this.getClass(info, databaseName, classId);
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.constraints;
        // TODO: cache
        return list.filter((entity) => entity.conrelid === classId);
      },

      async getForeignConstraintsForClass(info, databaseName, classId) {
        // const pgClass = this.getClass(info, databaseName, classId);
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.constraints;
        // TODO: cache
        return list.filter((entity) => entity.confrelid === classId);
      },

      async getNamespaceByName(info, databaseName, name) {
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.namespaces;
        return list.find((nsp) => nsp.nspname === name);
      },

      async getClassByName(info, databaseName, schemaName, tableName) {
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.classes;
        return list.find(
          (rel) =>
            rel.getNamespace()!.nspname === schemaName &&
            rel.relname === tableName,
        );
      },

      // TODO: we should maybe use pg_type.typelem and look up by ID directy
      // instead of having this function
      async getTypeByArray(info, databaseName, arrayId) {
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.types;
        return list.find((type) => type.typarray === arrayId);
      },

      async getEnumsForType(info, databaseName, typeId) {
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.enums;
        // TODO: cache
        return list
          .filter((entity) => entity.enumtypid === typeId)
          .sort((a, z) => a.enumsortorder - z.enumsortorder);
      },

      async getRangeByType(info, databaseName, typeId) {
        const relevant = await getDb(info, databaseName);
        const list = relevant.introspection.ranges;
        // TODO: cache
        return list.find((entity) => entity.rngtypid === typeId);
      },

      getIntrospection(info) {
        // IMPORTANT: introspection shouldn't change within a single run (even
        // if the cache does), thus we add it to state.

        if (info.state.introspectionResultsPromise) {
          return info.state.introspectionResultsPromise;
        }

        info.state.introspectionResultsPromise = (async () => {
          if (info.cache.introspectionResultsPromise) {
            return info.cache.introspectionResultsPromise;
          }
          if (!info.resolvedPreset.pgSources) {
            return [];
          }
          // Resolve the promise ASAP so dependents can `getIntrospection()` and then `getClass` or whatever from the result.
          const introspectionPromise = Promise.all(
            info.resolvedPreset.pgSources.map(async (database) => {
              const introspectionQuery = makeIntrospectionQuery();
              const {
                rows: [row],
              } = await withPgClientFromPgSource(database, null, (client) =>
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
              return { database, introspection };
            }),
          );
          info.cache.introspectionResultsPromise = introspectionPromise;
          return introspectionPromise;
        })();

        return info.state.introspectionResultsPromise;
      },
    },

    async watch(info, callback) {
      const unlistens: Array<() => void> = [];
      for (const pgSource of info.resolvedPreset.pgSources ?? []) {
        // install the watch fixtures
        if (info.options.installWatchFixtures ?? true) {
          try {
            await withPgClientFromPgSource(pgSource, null, (client) =>
              client.query({ text: watchFixtures }),
            );
          } catch (e) {
            console.warn(
              `Failed to install watch fixtures into '${pgSource.name}': ${e}`,
            );
          }
        }
        try {
          unlistens.push(
            await listenWithPgClientFromPgSource(
              pgSource,
              "postgraphile_watch",
              (_event) => {
                // Delete the introspection results
                info.cache.introspectionResultsPromise = null;
                // Trigger re-gather
                callback();
              },
            ),
          );
        } catch (e) {
          console.warn(`Failed to watch '${pgSource.name}': ${e}`);
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

    async main(_output, info) {
      const introspections =
        await info.helpers.pgIntrospection.getIntrospection();
      await Promise.all(
        introspections.map(async (result) => {
          const { introspection, database } = result;

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

          function announce<TEvent extends keyof GraphileConfig.GatherHooks>(
            eventName: TEvent,
            entities: GraphileConfig.GatherHooks[TEvent] extends PluginHook<
              infer U
            >
              ? Parameters<U>[0] extends {
                  entity: infer V;
                  databaseName: string;
                }
                ? V[]
                : never
              : never,
          ) {
            const promises: Promise<any>[] = [];
            for (const entity of entities) {
              promises.push(
                (info.process as any)(eventName, {
                  entity: entity,
                  databaseName: database.name,
                }),
              );
            }
            return Promise.all(promises);
          }
          await info.process("pgIntrospection_introspection", {
            introspection,
            databaseName: database.name,
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
    },
  },
};
