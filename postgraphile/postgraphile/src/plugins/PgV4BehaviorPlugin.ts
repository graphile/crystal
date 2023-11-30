import "graphile-config";
import "graphile-build-pg";

import type { GenericPgResourceOptions } from "@dataplan/pg";
import type { PgProc } from "graphile-build-pg/pg-introspection";
import { inspect } from "util";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgV4SmartTags: Record<string, never>;
    }
  }
}

const v4ComputedAttributeChecks = (
  _s: GenericPgResourceOptions,
  pgProc: PgProc,
): boolean => {
  const args = pgProc.getArguments();
  const firstArg = args[0];

  // Has to be in same schema
  if (firstArg.type.typnamespace !== pgProc.pronamespace) {
    return false;
  }

  // Has to start with the name prefix
  if (!pgProc.proname.startsWith(firstArg.type.typname + "_")) {
    return false;
  }

  return true;
};

export const PgV4BehaviorPlugin: GraphileConfig.Plugin = {
  name: "PgV4BehaviorPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin updates the default behaviors of certain things.",
  version: "0.0.0",

  gather: {
    hooks: {
      pgProcedures_PgResourceOptions(info, event) {
        const { resourceOptions: s } = event;
        // Apply default behavior
        const behavior = [];
        const firstParameter = s.parameters![0];
        if (s.isMutation && s.parameters) {
          behavior.push("-queryField mutationField -typeField");
        } else if (
          s.parameters &&
          s.parameters?.[0]?.codec?.attributes &&
          !s.isMutation &&
          v4ComputedAttributeChecks(s, event.pgProc)
        ) {
          behavior.push("-queryField -mutationField typeField");
        } else if (
          !s.isMutation &&
          s.parameters &&
          // Don't default to this being a queryField if it looks like a computed attribute function
          (!firstParameter?.codec?.attributes ||
            firstParameter?.codec?.extensions?.isTableLike === false)
        ) {
          behavior.push("queryField -mutationField -typeField");
        } else {
          behavior.push("-queryField -mutationField -typeField");
        }

        if (!s.extensions) {
          s.extensions = Object.create(null);
        }
        if (!s.extensions!.tags) {
          s.extensions!.tags = Object.create(null);
        }
        const b = s.extensions!.tags!.behavior;
        if (!b) {
          s.extensions!.tags!.behavior = behavior;
        } else if (typeof b === "string") {
          s.extensions!.tags!.behavior = [...behavior, b];
        } else if (Array.isArray(b)) {
          s.extensions!.tags!.behavior = [...behavior, ...b];
        } else {
          throw new Error(
            `${s}.extensions.tags.behavior has unknown shape '${inspect(b)}'`,
          );
        }
      },
    },
  },
};
