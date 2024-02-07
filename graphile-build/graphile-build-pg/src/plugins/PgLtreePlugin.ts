import type { PgCodec } from "@dataplan/pg";
import { listOfCodec } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";
import sql from "pg-sql2";

import { version } from "../version.js";

interface State {
  ltreeCodec: PgCodec<string, any, any, any, undefined, any, any>;
  ltreeArrayCodec: PgCodec;
}

export const PgLtreePlugin: GraphileConfig.Plugin = {
  name: "PgLtreePlugin",
  version,

  gather: {
    initialState(): State {
      const ltreeCodec: PgCodec<string, any, any, any, undefined, any, any> =
        EXPORTABLE(
          (sql) => ({
            name: "ltree",
            sqlType: sql`ltree`,
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
      const ltreeArrayCodec = EXPORTABLE(
        (listOfCodec, ltreeCodec) => listOfCodec(ltreeCodec),
        [listOfCodec, ltreeCodec],
      );
      return { ltreeCodec, ltreeArrayCodec };
    },
    hooks: {
      async pgCodecs_findPgCodec(info, event) {
        // If another plugin has already supplied a codec; skip
        if (event.pgCodec) return;

        const { serviceName, pgType } = event;

        const ltreeExt = await info.helpers.pgIntrospection.getExtensionByName(
          serviceName,
          "ltree",
        );
        if (!ltreeExt || pgType.typnamespace !== ltreeExt.extnamespace) {
          return;
        }

        if (pgType.typname === "ltree") {
          event.pgCodec = info.state.ltreeCodec;
        } else if (pgType.typname === "_ltree") {
          event.pgCodec = info.state.ltreeArrayCodec;
        }
      },
    },
  },
  schema: {
    hooks: {
      init(_, build) {
        const codec = build.input.pgRegistry.pgCodecs.ltree;
        if (codec) {
          const ltreeTypeName = build.inflection.builtin("LTree");
          build.registerScalarType(
            ltreeTypeName,
            { pgCodec: codec },
            () => ({
              description:
                "Represents an `ltree` hierarchical label tree as outlined in https://www.postgresql.org/docs/current/ltree.html",
              // TODO: specifiedByURL: https://postgraphile.org/scalars/ltree
            }),
            'Adding "LTree" scalar type from PgLtreePlugin.',
          );
          build.setGraphQLTypeForPgCodec(codec, "output", ltreeTypeName);
          build.setGraphQLTypeForPgCodec(codec, "input", ltreeTypeName);
        }
        return _;
      },
    },
  },
};
