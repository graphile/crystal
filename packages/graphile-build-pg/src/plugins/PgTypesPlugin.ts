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
        const { inflection } = build;

        build.setGraphQLTypeForPgCodec(
          TYPES.boolean,
          ["input", "output"],
          "Boolean",
        );

        build.setGraphQLTypeForPgCodec(TYPES.int, ["input", "output"], "Int");

        build.setGraphQLTypeForPgCodec(
          TYPES.bigint,
          ["input", "output"],
          inflection.builtin("BigInt"),
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.float,
          ["input", "output"],
          "Float",
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.text,
          ["input", "output"],
          "String",
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.json,
          ["input", "output"],
          inflection.builtin("JSON"),
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.jsonb,
          ["input", "output"],
          inflection.builtin("JSON"),
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.timestamptz,
          ["input", "output"],
          inflection.builtin("Datetime"),
        );

        build.setGraphQLTypeForPgCodec(
          TYPES.uuid,
          ["input", "output"],
          inflection.builtin("UUID"),
        );

        return _;
      },
    },
  },
};
