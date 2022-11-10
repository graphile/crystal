import { PgSourceRefPath } from "@dataplan/pg";
import { version } from "../index.js";
import { parseSmartTagsOptsString } from "../utils.js";

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRefs: Record<string, never>;
    }
  }
}

interface State {}
interface Cache {}

export const PgRefsPlugin: GraphileConfig.Plugin = {
  name: "PgRefsPlugin",
  description:
    "Looks for `@ref` and `@refVia` smart tags and registers the given refs",
  version: version,
  after: ["smart-tags", "PgRelationsPlugin"],

  gather: {
    namespace: "pgRefs",
    helpers: {},
    initialState: () => ({}),
    hooks: {
      async pgTables_PgSource(info, event) {
        const { source, pgClass } = event;

        const { tags } = pgClass.getTagsAndDescription();

        const rawRefs = Array.isArray(tags.ref)
          ? tags.ref
          : tags.ref
          ? [tags.ref]
          : null;
        const rawRefVias = Array.isArray(tags.refVia)
          ? tags.refVia
          : tags.refVia
          ? [tags.refVia]
          : null;

        if (!rawRefs) {
          if (rawRefVias) {
            throw new Error(`@refVia without matching @ref is invalid`);
          }
          return;
        }

        const refs = rawRefs.map((ref) => parseSmartTagsOptsString(ref, 1));
        const refVias =
          rawRefVias?.map((refVia) => parseSmartTagsOptsString(refVia, 1)) ??
          [];

        for (const ref of refs) {
          const {
            args: [name],
            params: {
              to,
              plural: rawPlural,
              singular: rawSingular,
              via: rawVia,
              behavior,
            },
          } = ref;
          const singular = rawSingular != null;
          if (singular && rawPlural != null) {
            throw new Error(
              `Both singular and plural were set on ref '${name}'; this isn't valid`,
            );
          }
          const relevantVias = refVias.filter((v) => v.args[0] === name);
          const vias = [
            ...(rawVia ? [rawVia] : []),
            ...relevantVias.map((v) => v.params.via).filter(isNotNullish),
          ];

          const paths = vias.map((via) => {
            const path: PgSourceRefPath = [];
            const parts = via.split(";");
            for (const rawPart of parts) {
              const part = rawPart.trim();
              // TODO: allow whitespace
              const matches = part.match(
                /^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/,
              );

              if (matches) {
                const [, localCols, targetTable, maybeTargetCols] = matches;
                console.log({ localCols, targetTable, maybeTargetCols });
              } else {
                const targetTable = part;
                console.log({ targetTable });
              }
            }
            console.log(via);
            return path;
          });

          if (vias.length === 0) {
            if (!tags.interface) {
              // console.dir({ refs, refVias, rawRefs, rawRefVias });
              console.warn(`@ref ${name} has no 'via' on ${source.name}`);
            }
            return;
          }
          if (source.refs[name]) {
            throw new Error(
              `@ref ${name} already registered in ${source.name}`,
            );
          }
          source.refs[name] = {
            singular,
            graphqlType: to,
            paths,
            extensions: {
              tags: {
                behavior,
              },
            },
          };
        }
      },
    },
  } as GraphileConfig.PluginGatherConfig<"pgRefs", State, Cache>,
};
