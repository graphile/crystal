import "graphile-build";
import "./PgBasicsPlugin";
import "../interfaces";

import type { PgTypeCodec } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";

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
        const { inflection, stringTypeSpec } = build;

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
