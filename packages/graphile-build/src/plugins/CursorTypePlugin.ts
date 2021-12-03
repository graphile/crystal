import type { Plugin } from "graphile-plugin";
import { version } from "../index.js";
import { stringScalarSpec } from "../utils.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType extends Scope {
      isCursorType?: boolean;
    }
  }
}

export const CursorTypePlugin: Plugin = {
  name: "CursorTypePlugin",
  description: "",
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
