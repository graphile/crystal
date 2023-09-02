import "graphile-config";
import "graphile-build-pg";

import type { PgResource, PgResourceOptions } from "@dataplan/pg";
import type { PgProc } from "graphile-build-pg/pg-introspection";
import { inspect } from "util";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgV4SmartTags: Record<string, never>;
    }
  }
}

const v4ComputedAttributeChecks = (s: PgResource): boolean => {
  const firstArg = s.parameters![0];

  // Has to be in same schema
  if (
    firstArg.codec.extensions?.pg?.schemaName !== s.extensions?.pg?.schemaName
  ) {
    console.log(
      `v4compcheck1 ${s.name} (${s.extensions?.pg?.schemaName}.${s.extensions?.pg?.name}) -- ${firstArg.codec.extensions?.pg?.schemaName} !== ${s.extensions?.pg?.schemaName}`,
    );
    return false;
  }

  // Has to start with the name prefix
  if (
    !s.extensions?.pg?.name.startsWith(
      firstArg.codec.extensions?.pg?.name + "_",
    )
  ) {
    console.log(
      `v4compcheck2 ${s.extensions?.pg?.name} doesn't start with ${firstArg.codec.extensions?.pg?.name}`,
    );
    return false;
  }

  return true;
};

export const PgV4BehaviorPlugin: GraphileConfig.Plugin = {
  name: "PgV4BehaviorPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin updates the default behaviors of certain things.",
  version: "0.0.0",

  schema: {
    entityBehavior: {
      pgResource: {
        provides: ["inferred"],
        after: ["default"],
        before: ["overrides", "PgCustomTypeFieldPlugin"],
        callback(behavior, s, build) {
          if (!s.parameters) {
            return behavior;
          }
          // Apply default behavior
          const newBehavior = [];
          const firstParameter = s.parameters![0];
          if (s.isMutation && s.parameters) {
            newBehavior.push("-queryField mutationField -typeField");
          } else if (
            s.parameters &&
            s.parameters?.[0]?.codec?.attributes &&
            !s.isMutation &&
            v4ComputedAttributeChecks(s)
          ) {
            newBehavior.push("-queryField -mutationField typeField");
          } else if (
            !s.isMutation &&
            s.parameters &&
            // Don't default to this being a queryField if it looks like a computed attribute function
            (!firstParameter?.codec?.attributes ||
              firstParameter?.codec?.extensions?.isTableLike === false)
          ) {
            // console.log(s.name);
            newBehavior.push("queryField -mutationField -typeField");
          } else {
            newBehavior.push("-queryField -mutationField -typeField");
          }

          newBehavior.push(behavior);
          return newBehavior;
        },
      },
    },
  },
};
