import type { PgCodec } from "@dataplan/pg";
import { gatherConfig } from "graphile-build";

// !Hide
import { version } from "../version.ts";

interface State {
  tsvectorCodec: PgCodec<string, any, any, any, undefined, any, any>;
  tsvectorArrayCodec: PgCodec;
  tsqueryCodec: PgCodec<string, any, any, any, undefined, any, any>;
  tsqueryArrayCodec: PgCodec;
}
interface Cache {}

// Optional: declaration merge the plugin name so users get autocomplete in `disablePlugins: [...]`
declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgTextSearchPlugin: true;
    }
  }
}

export const PgTextSearchPlugin: GraphileConfig.Plugin = {
  name: "PgTextSearchPlugin",
  description:
    "Adds codecs and GraphQL scalar types for the PostgreSQL built-in `tsvector` and `tsquery` full-text search types.",
  // !Hide
  version,

  gather: gatherConfig<never, State, Cache>({
    initialState(cache, { lib }) {
      const {
        dataplanPg: { listOfCodec },
        graphileBuild: { EXPORTABLE },
        sql,
      } = lib;

      const tsvectorCodec: PgCodec<string, any, any, any, undefined, any, any> =
        EXPORTABLE(
          (sql) => ({
            name: "tsvector",
            sqlType: sql`tsvector`,
            toPg(str) {
              return str;
            },
            fromPg(str) {
              return str;
            },
            executor: null,
            attributes: undefined,
          }),
          [sql],
        );
      const tsvectorArrayCodec = EXPORTABLE(
        (listOfCodec, tsvectorCodec) => listOfCodec(tsvectorCodec),
        [listOfCodec, tsvectorCodec],
      );

      const tsqueryCodec: PgCodec<string, any, any, any, undefined, any, any> =
        EXPORTABLE(
          (sql) => ({
            name: "tsquery",
            sqlType: sql`tsquery`,
            toPg(str) {
              return str;
            },
            fromPg(str) {
              return str;
            },
            executor: null,
            attributes: undefined,
          }),
          [sql],
        );
      const tsqueryArrayCodec = EXPORTABLE(
        (listOfCodec, tsqueryCodec) => listOfCodec(tsqueryCodec),
        [listOfCodec, tsqueryCodec],
      );

      return {
        tsvectorCodec,
        tsvectorArrayCodec,
        tsqueryCodec,
        tsqueryArrayCodec,
      };
    },
    hooks: {
      pgCodecs_findPgCodec(info, event) {
        // If another plugin has already supplied a codec; skip
        if (event.pgCodec) return;

        const { pgType } = event;
        const typname = pgType.typname;

        // tsvector and tsquery are built-in PostgreSQL types; no extension
        // check is required.
        if (typname === "tsvector") {
          event.pgCodec = info.state.tsvectorCodec;
        } else if (typname === "_tsvector") {
          event.pgCodec = info.state.tsvectorArrayCodec;
        } else if (typname === "tsquery") {
          event.pgCodec = info.state.tsqueryCodec;
        } else if (typname === "_tsquery") {
          event.pgCodec = info.state.tsqueryArrayCodec;
        }
      },
    },
  }),

  schema: {
    hooks: {
      init(_, build) {
        const tsvectorCodec = build.pgCodecs.tsvector;
        if (tsvectorCodec) {
          const tsvectorTypeName = build.inflection.builtin("TsVector");
          build.registerScalarType(
            tsvectorTypeName,
            { pgCodec: tsvectorCodec },
            () => ({
              description: build.wrapDescription(
                "A PostgreSQL full-text search document (`tsvector`). See https://www.postgresql.org/docs/current/datatype-textsearch.html",
                "type",
              ),
            }),
            'Adding "TsVector" scalar type from PgTextSearchPlugin.',
          );
          build.setGraphQLTypeForPgCodec(
            tsvectorCodec,
            "output",
            tsvectorTypeName,
          );
          build.setGraphQLTypeForPgCodec(
            tsvectorCodec,
            "input",
            tsvectorTypeName,
          );
        }

        const tsqueryCodec = build.pgCodecs.tsquery;
        if (tsqueryCodec) {
          const tsqueryTypeName = build.inflection.builtin("TsQuery");
          build.registerScalarType(
            tsqueryTypeName,
            { pgCodec: tsqueryCodec },
            () => ({
              description: build.wrapDescription(
                "A PostgreSQL full-text search query (`tsquery`). See https://www.postgresql.org/docs/current/datatype-textsearch.html",
                "type",
              ),
            }),
            'Adding "TsQuery" scalar type from PgTextSearchPlugin.',
          );
          build.setGraphQLTypeForPgCodec(
            tsqueryCodec,
            "output",
            tsqueryTypeName,
          );
          build.setGraphQLTypeForPgCodec(
            tsqueryCodec,
            "input",
            tsqueryTypeName,
          );
        }

        return _;
      },
    },
  },
};
