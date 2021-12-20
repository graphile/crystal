import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type { Plugin } from "graphile-plugin";

import { version } from "../index";
import {
  getCodecMetaLookupFromInput,
  PgTypeCodecMetaLookup,
} from "../inputUtils";
import { PgTypeCodec } from "@dataplan/pg";
import sql from "pg-sql2";
import { GraphQLType } from "graphql";

type GetGraphQLTypeByPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  variant: string,
) => GraphQLType | null;

declare global {
  namespace GraphileEngine {
    interface Build {
      pgCodecMetaLookup: PgTypeCodecMetaLookup;
      getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
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
        return build.extend(
          build,
          {
            pgCodecMetaLookup,
            getGraphQLTypeByPgCodec,
          },
          "Adding helpers from PgBasicsPlugin",
        );
      },
    },
  },
};
