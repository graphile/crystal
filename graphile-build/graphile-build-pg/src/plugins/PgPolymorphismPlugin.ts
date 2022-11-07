import "graphile-config";
import "./PgCodecsPlugin.js";
import "./PgProceduresPlugin.js";
import "./PgRelationsPlugin.js";
import "./PgTablesPlugin.js";

import { version } from "../index.js";
import { parseSmartTagsOptsString } from "../utils.js";
import {
  PgTypeCodecPolymorphismSingle,
  PgTypeCodecPolymorphismSingleTypeColumnSpec,
} from "@dataplan/pg";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgPolymorphism: Record<string, never>;
    }
  }
}

function parseColumn(
  colSpec: string,
): PgTypeCodecPolymorphismSingleTypeColumnSpec<any> {
  let spec = colSpec;
  let isNotNull = false;
  if (spec.endsWith("!")) {
    spec = spec.substring(0, spec.length - 1);
    isNotNull = true;
  }
  const [a, b] = spec.split(">");
  return {
    column: a,
    isNotNull,
    rename: b,
  };
}

export const PgPolymorphismPlugin: GraphileConfig.Plugin = {
  name: "PgPolymorphismPlugin",
  description: "Adds polymorphism",
  version,
  after: ["PgSmartCommentsPlugin", "PgV4SmartTagsPlugin"],
  gather: {
    namespace: "pgPolymorphism",
    helpers: {},
    hooks: {
      pgCodecs_recordType_extensions(info, event) {
        const { pgClass, extensions } = event;
        const interfaceTag =
          extensions.tags.interface ??
          pgClass.getTagsAndDescription().tags.interface;
        if (interfaceTag) {
          if (typeof interfaceTag !== "string") {
            throw new Error(
              "Invalid 'interface' smart tag; string expected. Did you add too many?",
            );
          }
          const { params } = parseSmartTagsOptsString<"type" | "mode" | "name">(
            interfaceTag,
            0,
          );
          console.dir(params);
          switch (params.mode) {
            case "single": {
              const { type = "type" } = params;
              const attr = pgClass.getAttribute({ name: type });
              if (!attr) {
                throw new Error(
                  `Invalid '@interface' smart tag - there is no '${type}' column on ${
                    pgClass.getNamespace()!.nspname
                  }.${pgClass.relname}`,
                );
              }

              const rawTypeTags = extensions.tags.type;
              const typeTags = Array.isArray(rawTypeTags)
                ? rawTypeTags.map((t) => String(t))
                : [String(rawTypeTags)];

              const attributeNames = pgClass
                .getAttributes()
                .filter((a) => a.attnum >= 1)
                .map((a) => a.attname);

              const types: PgTypeCodecPolymorphismSingle<any>["types"] =
                Object.create(null);
              const specificColumns = new Set<string>();
              for (const typeTag of typeTags) {
                const {
                  args: [typeValue],
                  params: { name, columns },
                } = parseSmartTagsOptsString(typeTag, 1);
                if (!name) {
                  throw new Error(`Every type must have a name`);
                }
                types[typeValue] = {
                  name,
                  columns: columns?.split(",").map(parseColumn) ?? [],
                };
                for (const col of types[typeValue].columns) {
                  specificColumns.add(col.column);
                }
              }

              const commonColumns = attributeNames.filter(
                (n) => !specificColumns.has(n),
              );
              extensions.polymorphism = {
                mode: "single",
                commonColumns,
                typeColumns: [type],
                types,
              };
              console.dir(extensions.polymorphism);
              break;
            }
            case "relational": {
              break;
            }
            case "union": {
              break;
            }
            default: {
              throw new Error(`Unsupported (or not provided) @interface mode`);
            }
          }
        }
      },
    },
  },
};
