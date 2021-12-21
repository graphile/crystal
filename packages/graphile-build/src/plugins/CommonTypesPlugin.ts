import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";

import { version } from "../index.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType {}
  }
}

export const CommonTypesPlugin: Plugin = {
  name: "CommonTypesPlugin",
  description: "Registers common utility types like BigInt, Datetime, UUID",
  version: version,

  schema: {
    hooks: {
      // TODO: add "specifiedBy" configuration
      init(_, build) {
        const { inflection, stringTypeSpec } = build;

        build.registerScalarType(
          inflection.builtin("BigInt"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A signed eight-byte integer. The upper big integer values are greater than the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers.",
                "type",
              ),
            ),
          "graphile-build built-in (BigInt type)",
        );

        build.registerScalarType(
          inflection.builtin("Datetime"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.",
                "type",
              ),
            ),
          "graphile-build built-in (Datetime type)",
        );

        build.registerScalarType(
          inflection.builtin("UUID"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).",
                "type",
              ),
              EXPORTABLE(
                () => (string) => {
                  if (
                    !/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(
                      string,
                    )
                  ) {
                    throw new Error(
                      "Invalid UUID, expected 32 hexadecimal characters, optionally with hypens",
                    );
                  }
                  return string;
                },
                [],
              ),
            ),
          "graphile-build built-in (UUID type)",
        );

        return _;
      },
    },
  },
};
