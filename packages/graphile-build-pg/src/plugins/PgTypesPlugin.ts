import "graphile-build";
import "./PgBasicsPlugin";
import "../interfaces";

import { TYPES } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface ScopeGraphQLScalarType {}
    interface GraphileBuildSchemaOptions {
      pgUseCustomNetworkScalars?: boolean;
    }
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
        const {
          inflection,
          stringTypeSpec,
          options: { pgUseCustomNetworkScalars },
        } = build;

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

        // A bunch more postgres-specific types
        //
        build.registerScalarType(
          inflection.builtin("InternetAddress"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "An IPv4 or IPv6 host address, and optionally its subnet.",
                "type",
              ),
            ),
          "graphile-build-pg built-in (InternetAddress)",
        );
        build.registerScalarType(
          inflection.builtin("RegProc"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a function name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegProc)",
        );
        build.registerScalarType(
          inflection.builtin("RegProcedure"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a function with argument types",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegProcedure)",
        );
        build.registerScalarType(
          inflection.builtin("RegOper"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for an operator",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegOper)",
        );
        build.registerScalarType(
          inflection.builtin("RegOperator"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for an operator with argument types",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegOperator)",
        );
        build.registerScalarType(
          inflection.builtin("RegClass"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a relation name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegClass)",
        );
        build.registerScalarType(
          inflection.builtin("RegType"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a data type name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegType)",
        );
        build.registerScalarType(
          inflection.builtin("RegRole"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a role name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegRole)",
        );
        build.registerScalarType(
          inflection.builtin("RegNamespace"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a namespace name",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegNamespace)",
        );
        build.registerScalarType(
          inflection.builtin("RegConfig"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a text search configuration",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegConfig)",
        );
        build.registerScalarType(
          inflection.builtin("RegDictionary"),
          {},
          () =>
            stringTypeSpec(
              build.wrapDescription(
                "A builtin object identifier type for a text search dictionary",
                "type",
              ),
            ),
          "graphile-build-pg built-in (RegDictionary)",
        );
        if (pgUseCustomNetworkScalars) {
          build.registerScalarType(
            inflection.builtin("CidrAddress"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("An IPv4 or IPv6 CIDR address.", "type"),
              ),
            "graphile-build-pg built-in (CidrAddress)",
          );
          build.registerScalarType(
            inflection.builtin("MacAddress"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("A 6-byte MAC address.", "type"),
              ),
            "graphile-build-pg built-in (MacAddress)",
          );
          build.registerScalarType(
            inflection.builtin("MacAddress8"),
            {},
            () =>
              stringTypeSpec(
                build.wrapDescription("An 8-byte MAC address.", "type"),
              ),
            "graphile-build-pg built-in (MacAddress8)",
          );
        }

        const typeNameByTYPESKey: { [key in keyof typeof TYPES]: string } = {
          boolean: "Boolean",
          int: "Int",
          bigint: inflection.builtin("BigInt"),
          float: "Float",
          citext: "String",
          text: "String",
          json: inflection.builtin("JSON"),
          jsonb: inflection.builtin("JSON"),
          timestamp: inflection.builtin("Datetime"),
          timestamptz: inflection.builtin("Datetime"),
          date: inflection.builtin("Date"),
          time: inflection.builtin("Time"),
          timetz: inflection.builtin("Time"),
          uuid: inflection.builtin("UUID"),
          inet: inflection.builtin("InternetAddress"),
          regproc: inflection.builtin("RegProc"),
          regprocedure: inflection.builtin("RegProcedure"),
          regoper: inflection.builtin("RegOper"),
          regoperator: inflection.builtin("RegOperator"),
          regclass: inflection.builtin("RegClass"),
          regtype: inflection.builtin("RegType"),
          regrole: inflection.builtin("RegRole"),
          regnamespace: inflection.builtin("RegNamespace"),
          regconfig: inflection.builtin("RegConfig"),
          regdictionary: inflection.builtin("RegDictionary"),

          cidr: pgUseCustomNetworkScalars
            ? inflection.builtin("CidrAddress")
            : "String",
          macaddr: pgUseCustomNetworkScalars
            ? inflection.builtin("MacAddress")
            : "String",
          macaddr8: pgUseCustomNetworkScalars
            ? inflection.builtin("MacAddress8")
            : "String",
        };
        for (const key in typeNameByTYPESKey) {
          build.setGraphQLTypeForPgCodec(
            TYPES[key],
            ["input", "output"],
            typeNameByTYPESKey[key],
          );
        }

        return _;
      },
    },
  },
};
