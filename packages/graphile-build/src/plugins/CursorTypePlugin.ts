import { stringScalarSpec } from "../utils.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType extends Scope {
      isCursorType?: boolean;
    }
  }
}

export const CursorTypePlugin: GraphileEngine.Plugin =
  function CursorTypePlugin(builder) {
    builder.hook(
      "init",
      (_, build) => {
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
      ["Cursor"],
    );
  };
