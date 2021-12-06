import "graphile-build";

import type { WithPgClient } from "@dataplan/pg";
import type { GatherHooks, Plugin, PluginHook } from "graphile-plugin";

import { version } from "../index";
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
} from "../introspection";
import { makeIntrospectionQuery } from "../introspection";
import { PromiseOrDirect } from "graphile-crystal";

declare global {
  namespace GraphileEngine {
    interface GraphileBuildGatherOptions {
      pgDatabases: ReadonlyArray<{
        name: string;
        withClient: WithPgClient;
        listen?(topic: string): AsyncIterable<string>;
      }>;
    }
  }
}

declare module "graphile-plugin" {
  interface GatherHelpers {
    pgIntrospection: {
      getIntrospection(): Promise<Introspection>;
    };
  }

  interface GatherHooks {
    "pgIntrospection:namespace": PluginHook<
      (event: {
        entity: PgNamespace;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgNamespace;
        databaseName: string;
      }>
    >;
    "pgIntrospection:class": PluginHook<
      (event: { entity: PgClass; databaseName: string }) => PromiseOrDirect<{
        entity: PgClass;
        databaseName: string;
      }>
    >;
    "pgIntrospection:attribute": PluginHook<
      (event: {
        entity: PgAttribute;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgAttribute;
        databaseName: string;
      }>
    >;
    "pgIntrospection:constraint": PluginHook<
      (event: {
        entity: PgConstraint;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgConstraint;
        databaseName: string;
      }>
    >;
    "pgIntrospection:proc": PluginHook<
      (event: { entity: PgProc; databaseName: string }) => PromiseOrDirect<{
        entity: PgProc;
        databaseName: string;
      }>
    >;
    "pgIntrospection:role": PluginHook<
      (event: { entity: PgRoles; databaseName: string }) => PromiseOrDirect<{
        entity: PgRoles;
        databaseName: string;
      }>
    >;
    "pgIntrospection:auth_member": PluginHook<
      (event: {
        entity: PgAuthMembers;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgAuthMembers;
        databaseName: string;
      }>
    >;
    "pgIntrospection:type": PluginHook<
      (event: { entity: PgType; databaseName: string }) => PromiseOrDirect<{
        entity: PgType;
        databaseName: string;
      }>
    >;
    "pgIntrospection:enum": PluginHook<
      (event: { entity: PgEnum; databaseName: string }) => PromiseOrDirect<{
        entity: PgEnum;
        databaseName: string;
      }>
    >;
    "pgIntrospection:extension": PluginHook<
      (event: {
        entity: PgExtension;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgExtension;
        databaseName: string;
      }>
    >;
    "pgIntrospection:index": PluginHook<
      (event: { entity: PgIndex; databaseName: string }) => PromiseOrDirect<{
        entity: PgIndex;
        databaseName: string;
      }>
    >;
    "pgIntrospection:language": PluginHook<
      (event: { entity: PgLanguage; databaseName: string }) => PromiseOrDirect<{
        entity: PgLanguage;
        databaseName: string;
      }>
    >;
    "pgIntrospection:range": PluginHook<
      (event: { entity: PgRange; databaseName: string }) => PromiseOrDirect<{
        entity: PgRange;
        databaseName: string;
      }>
    >;
    "pgIntrospection:depend": PluginHook<
      (event: { entity: PgDepend; databaseName: string }) => PromiseOrDirect<{
        entity: PgDepend;
        databaseName: string;
      }>
    >;
    "pgIntrospection:description": PluginHook<
      (event: {
        entity: PgDescription;
        databaseName: string;
      }) => PromiseOrDirect<{
        entity: PgDescription;
        databaseName: string;
      }>
    >;
  }
}

interface Cache {
  introspectionResultsPromise: null | Promise<Introspection>;
}

export const PgIntrospectionPlugin: Plugin = {
  name: "PgIntrospectionPlugin",
  description:
    "Introspects PostgreSQL databases and makes the results available to other plugins",
  version: version,
  gather: {
    namespace: "pgIntrospection" as const,
    initialCache: (): Cache => ({
      introspectionResultsPromise: null,
    }),
    helpers: {
      getIntrospection(info) {
        let introspectionPromise = info.cache.introspectionResultsPromise;
        if (!introspectionPromise) {
          introspectionPromise = info.cache.introspectionResultsPromise =
            Promise.all(
              info.options.pgDatabases.map(async (database) => {
                const introspectionQuery = makeIntrospectionQuery();
                const {
                  rows: [row],
                } = await database.withClient(null, (client) =>
                  client.query<{ introspection: string }>({
                    text: introspectionQuery,
                  }),
                );
                if (!row) {
                  throw new Error("Introspection failed");
                }
                const introspection = JSON.parse(
                  row.introspection,
                ) as Introspection;

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

                function announce<TEvent extends keyof GatherHooks>(
                  eventName: TEvent,
                  entities: GatherHooks[TEvent] extends PluginHook<infer U>
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

                await announce("pgIntrospection:namespace", namespaces);
                await announce("pgIntrospection:class", classes);
                await announce("pgIntrospection:attribute", attributes);
                await announce("pgIntrospection:constraint", constraints);
                await announce("pgIntrospection:proc", procs);
                await announce("pgIntrospection:role", roles);
                await announce("pgIntrospection:auth_member", auth_members);
                await announce("pgIntrospection:type", types);
                await announce("pgIntrospection:enum", enums);
                await announce("pgIntrospection:extension", extensions);
                await announce("pgIntrospection:index", indexes);
                await announce("pgIntrospection:language", languages);
                await announce("pgIntrospection:range", ranges);
                await announce("pgIntrospection:depend", depends);
                await announce("pgIntrospection:description", descriptions);

                return { database, introspection };
              }),
            );
        }
        return introspectionPromise;
      },
    },
    async main(_output, _context, helpers) {
      await helpers.pgIntrospection.getIntrospection();
    },
  },
};
