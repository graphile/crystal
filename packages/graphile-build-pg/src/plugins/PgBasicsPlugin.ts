import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type { PgTypeCodec } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";
import type { GraphQLType } from "graphql";
import sql from "pg-sql2";

import { version } from "../index";
import type { PgTypeCodecMetaLookup } from "../inputUtils";
import {
  getCodecMetaLookupFromInput,
  makePgTypeCodecMeta,
} from "../inputUtils";

type GetGraphQLTypeByPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  variant: string,
) => GraphQLType | null;
type SetGraphQLTypeForPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  variants: string | string[],
  typeName: string,
) => void;

declare global {
  namespace GraphileEngine {
    interface Build {
      pgCodecMetaLookup: PgTypeCodecMetaLookup;
      getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
      setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec;
      sql: typeof sql;
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
          return type ?? null;
        };

        const setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec = (
          codec,
          variants,
          typeName,
        ) => {
          build.assertTypeName(typeName);

          let meta = pgCodecMetaLookup.get(codec);
          if (!meta) {
            meta = makePgTypeCodecMeta(codec);
            pgCodecMetaLookup.set(codec, meta);
          }

          const variants_ = Array.isArray(variants) ? variants : [variants];
          for (const variant of variants_) {
            if (meta.typeNameByVariant[variant] != null) {
              // TODO: allow this?
              throw new Error("Type already set");
            }
            meta.typeNameByVariant[variant] = typeName;
          }
        };

        return build.extend(
          build,
          {
            pgCodecMetaLookup,
            getGraphQLTypeByPgCodec,
            setGraphQLTypeForPgCodec,
            sql,
            // For slightly better backwards compatibility with v4.
            pgSql: sql,
          },
          "Adding helpers from PgBasicsPlugin",
        );
      },
    },
  },
};
