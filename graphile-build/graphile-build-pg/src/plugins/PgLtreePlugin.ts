import assert from "node:assert";

import type { PgCodec } from "@dataplan/pg";
import { gatherConfig } from "graphile-build";

// !Hide
import { version } from "../version.ts";

interface State {
  ltreeCodec: PgCodec<string, any, any, any, undefined, any, any>;
  ltreeArrayCodec: PgCodec;
}
interface Cache {}

// Optional: declaration merge the plugin name so users get autocomplete in `disablePlugins: [...]`
declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgLtreePlugin: true;
    }
  }
}

export const PgLtreePlugin: GraphileConfig.Plugin = {
  name: "PgLtreePlugin",
  // !Hide
  version,

  gather: gatherConfig<never, State, Cache>({
    initialState(cache, { lib }) {
      const {
        dataplanPg: { listOfCodec },
        graphileBuild: { EXPORTABLE },
        sql,
      } = lib;
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
        const typname = pgType.typname;
        if (typname !== "ltree" && typname !== "_ltree") return;

        const ltreeExt = await info.helpers.pgIntrospection.getExtensionByName(
          serviceName,
          "ltree",
        );
        if (!ltreeExt || pgType.typnamespace !== ltreeExt.extnamespace) {
          return;
        } else if (typname === "ltree") {
          event.pgCodec = info.state.ltreeCodec;
        } else {
          assert(typname === "_ltree");
          event.pgCodec = info.state.ltreeArrayCodec;
        }
      },
    },
  }),
  schema: {
    hooks: {
      init(_, build) {
        const codec = build.pgCodecs.ltree;
        if (codec) {
          // Highly recommended you use your own inflector here, choosing
          // `builtin` will mean your users may get conflicts which they cannot
          // then resolve through inflection.
          const ltreeTypeName = build.inflection.builtin("LTree");

          build.registerScalarType(
            ltreeTypeName,
            { pgCodec: codec },
            () => ({
              description: build.wrapDescription(
                "Represents an `ltree` hierarchical label tree as outlined in https://www.postgresql.org/docs/current/ltree.html",
                "type",
              ),
              // !Hide
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
