import "graphile-config";

import type { PgSmartTagsDict } from "pg-introspection";

import { version } from "../index.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRemoveExtensionResources: Record<string, never>;
    }
  }
}

interface State {}
interface Cache {}

export const PgRemoveExtensionResourcesPlugin: GraphileConfig.Plugin = {
  name: "PgRemoveExtensionResourcesPlugin",
  description:
    "Removes resources that come from Postgres extensions, typically you don't want these utility types and functions in your GraphQL API",
  version: version,

  gather: {
    namespace: "pgRemoveExtensionResources",
    helpers: {},
    hooks: {
      pgIntrospection_introspection(info, event) {
        const { introspection } = event;
        const oidByCatalog = {};
        for (const oid in introspection.catalog_by_oid) {
          oidByCatalog[introspection.catalog_by_oid[oid]] = oid;
        }

        // 'pg_catalog.pg_extension'::pg_catalog.regclass
        const pgExtensionId = oidByCatalog["pg_extension"];

        // 'pg_catalog.pg_proc'::pg_catalog.regclass
        const pgProcId = oidByCatalog["pg_proc"];

        // 'pg_catalog.pg_class'::pg_catalog.regclass
        const pgClassId = oidByCatalog["pg_class"];

        for (const dep of introspection.depends) {
          if (dep.refclassid === pgExtensionId && dep.deptype === "e") {
            switch (dep.classid) {
              case pgProcId: {
                const procId = dep.objid;
                const pgProc = introspection.procs.find(
                  (p) => p._id === procId,
                );
                if (pgProc) {
                  addBehaviorToTags(pgProc.getTagsAndDescription().tags, "-*");
                }
                // ...
                break;
              }
              case pgClassId: {
                const relId = dep.objid;
                const pgClass = introspection.classes.find(
                  (p) => p._id === relId,
                );
                if (pgClass) {
                  addBehaviorToTags(pgClass.getTagsAndDescription().tags, "-*");
                }
                // ...
                break;
              }
              default: {
                /* ignore */
              }
            }
          }
        }
      },
    },
  } as GraphileConfig.PluginGatherConfig<
    "pgRemoveExtensionResources",
    State,
    Cache
  >,
};

function addBehaviorToTags(tags: PgSmartTagsDict, behavior: string): void {
  if (Array.isArray(tags.behavior)) {
    tags.behavior.push(behavior);
  } else if (typeof tags.behavior === "string") {
    tags.behavior = [tags.behavior, behavior];
  } else {
    tags.behavior = behavior;
  }
}
