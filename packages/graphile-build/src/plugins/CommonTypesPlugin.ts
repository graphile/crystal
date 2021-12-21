import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLScalarLiteralParser } from "graphql";

import { version } from "../index.js";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType {}
    interface GraphileBuildSchemaOptions {
      /**
       * Set 'true' if you want JSON values to be stringified.
       */
      jsonScalarAsString?: boolean;
    }
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
        const {
          options: { jsonScalarAsString },
          inflection,
          stringTypeSpec,
          graphql: { Kind },
        } = build;

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
          inflection.builtin("Date"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A calendar date in YYYY-MM-DD format.",
                "type",
              ),
            ),
          "graphile-build built-in (Datetype)",
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

        if (jsonScalarAsString !== true) {
          const parseLiteral: GraphQLScalarLiteralParser<any> = EXPORTABLE(
            (Kind) => (ast, variables) => {
              switch (ast.kind) {
                case Kind.STRING:
                case Kind.BOOLEAN:
                  return ast.value;
                case Kind.INT:
                case Kind.FLOAT:
                  return parseFloat(ast.value);
                case Kind.OBJECT: {
                  const value = Object.create(null);
                  ast.fields.forEach((field) => {
                    value[field.name.value] = parseLiteral(
                      field.value,
                      variables,
                    );
                  });

                  return value;
                }
                case Kind.LIST:
                  return ast.values.map((n) => parseLiteral(n, variables));
                case Kind.NULL:
                  return null;
                case Kind.VARIABLE: {
                  const name = ast.name.value;
                  return variables ? variables[name] : undefined;
                }
                default:
                  return undefined;
              }
            },
            [Kind],
          );
          build.registerScalarType(
            inflection.builtin("JSON"),
            {},
            () => ({
              description:
                `Represents JSON values as specified by ` +
                "[ECMA-404](http://www.ecma-international.org/" +
                "publications/files/ECMA-ST/ECMA-404.pdf).",
              serialize: (value) => value,
              parseValue: (value) => value,
              parseLiteral,
            }),
            "graphile-build built-in (JSON type; extended)",
          );
        } else {
          build.registerScalarType(
            inflection.builtin("JSON"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription(
                  "A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).",
                  "type",
                ),
              ),
            "graphile-build built-in (JSON type; simple)",
          );
        }

        return _;
      },
    },
  },
};
