import { EXPORTABLE } from "graphile-export";
import "graphile-plugin";
import type { GraphQLScalarLiteralParser } from "graphql";

import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface ScopeScalar {}
    interface GraphileBuildSchemaOptions {
      /**
       * Set 'true' if you want JSON values to be stringified.
       */
      jsonScalarAsString?: boolean;
    }
  }
}

export const CommonTypesPlugin: GraphilePlugin.Plugin = {
  name: "CommonTypesPlugin",
  description:
    "Registers common GraphQL utility types like BigInt, Datetime, UUID",
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
        build.registerCursorConnection({
          typeName: "BigInt",
          scope: {},
          nonNullNode: false,
        });

        build.registerScalarType(
          inflection.builtin("BigFloat"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A floating point number that requires more precision than IEEE 754 binary 64",
                "type",
              ),
            ),
          "graphile-build built-in (BigFloat type)",
        );
        build.registerCursorConnection({
          typeName: "BigFloat",
          scope: {},
          nonNullNode: false,
        });

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
        build.registerCursorConnection({
          typeName: "Datetime",
          scope: {},
          nonNullNode: false,
        });

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
        build.registerCursorConnection({
          typeName: "Date",
          scope: {},
          nonNullNode: false,
        });

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
        build.registerCursorConnection({
          typeName: "UUID",
          scope: {},
          nonNullNode: false,
        });

        if (jsonScalarAsString !== true) {
          const parseLiteral: GraphQLScalarLiteralParser<any> = EXPORTABLE(
            (Kind) => {
              const parseLiteralToObject: GraphQLScalarLiteralParser<any> = (
                ast,
                variables,
              ): any => {
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
                      value[field.name.value] = parseLiteralToObject(
                        field.value,
                        variables,
                      );
                    });

                    return value;
                  }
                  case Kind.LIST:
                    return ast.values.map((n) =>
                      parseLiteralToObject(n, variables),
                    );
                  case Kind.NULL:
                    return null;
                  case Kind.VARIABLE: {
                    const name = ast.name.value;
                    return variables ? variables[name] : undefined;
                  }
                  default:
                    return undefined;
                }
              };
              const parseLiteral: GraphQLScalarLiteralParser<any> = (
                ast,
                variables,
              ): any => {
                const obj = parseLiteralToObject(ast, variables);
                return JSON.stringify(obj);
              };

              return parseLiteral;
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
              serialize: EXPORTABLE(
                () => (value) =>
                  value == null ? value : JSON.parse(String(value)),
                [],
              ),
              parseValue: EXPORTABLE(
                () => (value) => JSON.stringify(value),
                [],
              ),
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
        build.registerCursorConnection({
          typeName: "JSON",
          scope: {},
          nonNullNode: false,
        });

        build.registerScalarType(
          inflection.builtin("XML"),
          {},
          () =>
            stringTypeSpec(build.wrapDescription("An XML document", "type")),
          "graphile-build built-in (XML type)",
        );
        build.registerCursorConnection({
          typeName: "XML",
          scope: {},
          nonNullNode: false,
        });

        return _;
      },
    },
  },
};
