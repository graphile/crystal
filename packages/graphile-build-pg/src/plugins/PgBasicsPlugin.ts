import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type { Plugin } from "graphile-plugin";

import { version } from "../index";
import {
  getCodecMetaLookupFromInput,
  PgTypeCodecMetaLookup,
} from "../inputUtils";
import { PgTypeCodec, TYPES } from "@dataplan/pg";
import sql from "pg-sql2";
import { GraphQLType } from "graphql";

type GetGraphQLTypeByPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  variant: string,
) => GraphQLType | null;
type SetGraphQLTypeForPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  variant: string,
  typeName: string,
) => void;

declare global {
  namespace GraphileEngine {
    interface Build {
      pgCodecMetaLookup: PgTypeCodecMetaLookup;
      getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
      setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec;
    }
  }
}

export const PgBasicsPlugin: Plugin = {
  name: "PgBasicsPlugin",
  description:
    "Basic utilities required by many other graphile-build-pg plugins.",
  version: version,

  schema: {
    hooks: {
      build(build) {
        const pgCodecMetaLookup = getCodecMetaLookupFromInput(build.input);

        const getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec = (
          codec,
          variant,
        ) => {
          const meta = pgCodecMetaLookup.get(codec);
          if (!meta) {
            throw new Error("That codec is not known");
          }
          const typeName = meta.typeNameByVariant[variant] ?? null;
          if (typeName == null) {
            return null;
          }
          const type = build.getTypeByName(typeName);
          if (type == null) {
            throw new Error(
              `Codec ${
                sql.compile(codec.sqlType).text
              } variant '${variant}' expected GraphQL type '${typeName}' but no type with that name exists. This is a bug in a Graphile Build plugin (likely a third-party plugin).`,
            );
          }
          return type;
        };

        const setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec = (
          codec,
          variant,
          typeName,
        ) => {
          const meta = pgCodecMetaLookup.get(codec);
          if (!meta) {
            throw new Error("That codec is not known");
          }
          if (meta.typeNameByVariant[variant] != null) {
            // TODO: allow this?
            throw new Error("Type already set");
          }
          meta.typeNameByVariant[variant] = typeName;
        };

        return build.extend(
          build,
          {
            pgCodecMetaLookup,
            getGraphQLTypeByPgCodec,
            setGraphQLTypeForPgCodec,
          },
          "Adding helpers from PgBasicsPlugin",
        );
      },
      init(_, build) {
        // Register common types
        build.setGraphQLTypeForPgCodec(TYPES.text, "input", "String");
        build.setGraphQLTypeForPgCodec(TYPES.text, "output", "String");
        build.setGraphQLTypeForPgCodec(TYPES.timestamptz, "input", "String");
        build.setGraphQLTypeForPgCodec(TYPES.timestamptz, "output", "String");
        build.setGraphQLTypeForPgCodec(TYPES.uuid, "input", "String");
        build.setGraphQLTypeForPgCodec(TYPES.uuid, "output", "String");
        return _;
      },
    },
  },
};
