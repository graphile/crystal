import "graphile-config";

import { stringTypeSpec } from "../utils.js";
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

          const cursorTypeName = inflection.builtin("Cursor");
          registerScalarType(
            cursorTypeName,
            { isCursorType: true },
            () =>
              stringTypeSpec(
                "A location in a connection that can be used for resuming pagination.",
                undefined,
                cursorTypeName,
              ),
            "graphile-build built-in (Cursor type)",
          );

          return _;
        },
        provides: ["Cursor"],
      },
    },
  },
};
