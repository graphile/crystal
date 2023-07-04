import type {} from "graphile-config";

import { stringScalarSpec } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface ScopeScalar extends Scope {
      isCursorType?: boolean;
    }
  }
}

export const CursorTypePlugin: GraphileConfig.Plugin = {
  name: "CursorTypePlugin",
  description: "Registers the 'Cursor' scalar type for cursor pagination",
  version,
  schema: {
    hooks: {
      init: {
        callback: (_, build) => {
          const { registerScalarType, inflection } = build;

          registerScalarType(
            inflection.builtin("Cursor"),
            { isCursorType: true },
            () => ({
              ...stringScalarSpec,
              description:
                "A location in a connection that can be used for resuming pagination.",
            }),
            "graphile-build built-in (Cursor type)",
          );

          return _;
        },
        provides: ["Cursor"],
      },
    },
  },
};
