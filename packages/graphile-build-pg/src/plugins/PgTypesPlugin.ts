import "graphile-build";
import "./PgBasicsPlugin";
import "../interfaces";

import { TYPES } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType {}
  }
}

export const PgTypesPlugin: Plugin = {
  name: "PgTypesPlugin",
  description: "Registers some standard types",
  version: version,
  after: ["CommonTypesPlugin", "PgBasicsPlugin"],

  schema: {
    hooks: {
      // Register common types
      init(_, build) {
        const { inflection, stringTypeSpec } = build;

        function setInOutTypeName(
          key: keyof typeof TYPES,
          typeName: string,
        ): void {
          build.setGraphQLTypeForPgCodec(
            TYPES[key],
            ["input", "output"],
            typeName,
          );
        }

        // Time is a weird type; we only really want it for Postgres (which is
        // why it's not global).
        build.registerScalarType(
          inflection.builtin("Time"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "The exact time of day, does not include the date. May or may not have a timezone offset.",
                "type",
              ),
            ),
          "graphile-build-pg built-in (Time)",
        );

        for (const key of Object.keys(TYPES) as Array<keyof typeof TYPES>) {
          switch (key) {
            case "boolean": {
              setInOutTypeName(key, "Boolean");
              break;
            }
            case "int": {
              setInOutTypeName(key, "Int");
              break;
            }
            case "bigint": {
              setInOutTypeName(key, inflection.builtin("BigInt"));
              break;
            }
            case "float": {
              setInOutTypeName(key, "Float");
              break;
            }
            case "citext":
            case "text": {
              setInOutTypeName(key, "String");
              break;
            }

            case "json":
            case "jsonb": {
              setInOutTypeName(key, inflection.builtin("JSON"));
              break;
            }

            case "timestamp":
            case "timestamptz": {
              setInOutTypeName(key, inflection.builtin("Datetime"));
              break;
            }

            case "date": {
              setInOutTypeName(key, inflection.builtin("Date"));
              break;
            }

            case "time":
            case "timetz": {
              setInOutTypeName(key, inflection.builtin("Time"));
              break;
            }

            case "uuid": {
              setInOutTypeName(key, inflection.builtin("UUID"));
              break;
            }

            default: {
              const never: never = key;
              console.warn(`Unhandled builtin TYPES.${never}`);
              break;
            }
          }
        }

        return _;
      },
    },
  },
};
