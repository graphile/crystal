import type { PgCodec } from "@dataplan/pg";
import { listOfCodec } from "@dataplan/pg";
import { EXPORTABLE, gatherConfig } from "graphile-build";
import sql from "pg-sql2";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgLtree: {};
    }
  }
}

interface Cache {}
interface State {
  ltreeCodec: PgCodec<string, any, any, any, undefined, any, any>;
  ltreeArrayCodec: PgCodec;
}

export const PgLtreePlugin: GraphileConfig.Plugin = {
  name: "PgLtreePlugin",
  version,

  gather: gatherConfig<"pgLtree", State, Cache>({
    namespace: "pgLtree",
    initialState() {
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
  }),
  schema: {
    hooks: {
      init(_, build) {
        const codec = build.input.pgRegistry.pgCodecs.ltree;
        build.setGraphQLTypeForPgCodec(codec, "output", "String");
        build.setGraphQLTypeForPgCodec(codec, "input", "String");
        return _;
      },
    },
  },
};
