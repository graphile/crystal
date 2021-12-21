import "graphile-build";
import "./PgBasicsPlugin";
import "../interfaces";

import type { PgTypeCodec } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLScalarTypeConfig } from "graphql";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType {
      pgCodec: PgTypeCodec<any, any, any>;
    }
  }
}

export const PgTypesPlugin: Plugin = {
  name: "PgTypesPlugin",
  description: "Registers some standard types",
  version: version,
  // TODO: depends on PgBasicsPlugin

  schema: {
    hooks: {
      // Register common types
      init(_, build) {
        const {
          graphql: { Kind },
          inflection,
        } = build;

        /**
         * Generates the spec for a GraphQLScalar (except the name) with the
         * given description/coercion.
         */
        const stringTypeSpec = (
          description: string,
          coerce?: (input: string) => string,
        ): Omit<GraphQLScalarTypeConfig<any, any>, "name"> => ({
          description,
          serialize: (value) => String(value),
          parseValue: coerce
            ? EXPORTABLE((coerce) => (value) => coerce(String(value)), [coerce])
            : EXPORTABLE(() => (value) => String(value), []),
          parseLiteral: coerce
            ? EXPORTABLE(
                (Kind, coerce) => (ast) => {
                  if (ast.kind !== Kind.STRING) {
                    throw new Error("Can only parse string values");
                  }
                  return coerce(ast.value);
                },
                [Kind, coerce],
              )
            : EXPORTABLE((Kind) => (ast) => {
                if (ast.kind !== Kind.STRING) {
                  throw new Error("Can only parse string values");
                }
                return ast.value;
              }, [Kind]),
        });

        build.setGraphQLTypeForPgCodec(
          TYPES.text,
          ["input", "output"],
          "String",
        );

        const datetimeTypeName = inflection.builtin("Datetime");
        build.registerScalarType(
          datetimeTypeName,
          { pgCodec: TYPES.timestamptz },
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.",
                "type",
              ),
            ),
          "graphile-build-pg builtin",
        );
        build.setGraphQLTypeForPgCodec(
          TYPES.timestamptz,
          ["input", "output"],
          datetimeTypeName,
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.uuid,
          ["input", "output"],
          "String",
        );

        return _;
      },
    },
  },
};
