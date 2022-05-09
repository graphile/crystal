import "graphile-build";
import "./PgTablesPlugin";
import "../interfaces";

import type { PgTypeCodec } from "@dataplan/pg";
import "graphile-plugin";
import type { GraphQLType } from "graphql";
import sql from "pg-sql2";

import { version } from "../index";
import type { PgTypeCodecMetaLookup } from "../inputUtils";
import {
  getCodecMetaLookupFromInput,
  makePgTypeCodecMeta,
} from "../inputUtils";

type HasGraphQLTypeForPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  situation?: string,
) => boolean;
type GetGraphQLTypeByPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  situation: string,
) => GraphQLType | null;
type GetGraphQLTypeNameByPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  situation: string,
) => string | null;
type SetGraphQLTypeForPgCodec = (
  codec: PgTypeCodec<any, any, any>,
  situations: string | string[],
  typeName: string,
) => void;

declare global {
  namespace GraphileBuild {
    interface Build {
      /**
       * A store of metadata for given codecs. Currently internal as this API
       * may change.
       *
       * @internal
       */
      pgCodecMetaLookup: PgTypeCodecMetaLookup;

      /**
       * Do we already have a GraphQL type to use for the given codec in the
       * given situation?
       */
      hasGraphQLTypeForPgCodec: HasGraphQLTypeForPgCodec;
      /**
       * Get the GraphQL type for the given codec in the given situation.
       */
      getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
      /**
       * Get the GraphQL type name (string) for the given codec in the given
       * situation.
       */
      getGraphQLTypeNameByPgCodec: GetGraphQLTypeNameByPgCodec;
      /**
       * Set the GraphQL type to use for the given codec in the given
       * situation. If this has already been set, will throw an error.
       */
      setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec;

      /**
       * pg-sql2 access on Build to avoid duplicate module issues.
       */
      sql: typeof sql;
    }
  }
}

export const PgBasicsPlugin: GraphilePlugin.Plugin = {
  name: "PgBasicsPlugin",
  description:
    "Basic utilities required by many other graphile-build-pg plugins.",
  version: version,

  schema: {
    hooks: {
      build(build) {
        const pgCodecMetaLookup = getCodecMetaLookupFromInput(build.input);

        const getGraphQLTypeNameByPgCodec: GetGraphQLTypeNameByPgCodec = (
          codec,
          situation,
        ) => {
          const meta = pgCodecMetaLookup.get(codec);
          if (!meta) {
            throw new Error(
              `Codec '${codec.name}' does not have an entry in pgCodecMetaLookup, someone needs to call setGraphQLTypeForPgCodec passing this codec.`,
            );
          }
          const typeName = meta.typeNameBySituation[situation] ?? null;
          return typeName ?? null;
        };

        const getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec = (
          codec,
          situation,
        ) => {
          const typeName = getGraphQLTypeNameByPgCodec(codec, situation);
          return typeName ? build.getTypeByName(typeName) ?? null : null;
        };

        const hasGraphQLTypeForPgCodec: HasGraphQLTypeForPgCodec = (
          codec,
          situation,
        ) => {
          const meta = pgCodecMetaLookup.get(codec);
          if (!meta) {
            return false;
          }
          if (situation != null) {
            const typeName = meta.typeNameBySituation[situation] ?? null;
            return typeName != null;
          } else {
            return Object.keys(meta.typeNameBySituation).length > 0;
          }
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

          const situations_ = Array.isArray(variants) ? variants : [variants];
          for (const situation of situations_) {
            if (meta.typeNameBySituation[situation] != null) {
              // TODO: allow this?
              throw new Error("Type already set");
            }
            meta.typeNameBySituation[situation] = typeName;
          }
        };

        return build.extend(
          build,
          {
            pgCodecMetaLookup,
            getGraphQLTypeNameByPgCodec,
            getGraphQLTypeByPgCodec,
            hasGraphQLTypeForPgCodec,
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
