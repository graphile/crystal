import "graphile-config";
import "graphile-build-pg";

import type { PgSmartTagsDict } from "graphile-build-pg";
import { inspect } from "util";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgV4SmartTagsOmit: Record<string, never>;
    }
  }
}

export const PgV4SmartTagsOmitPlugin: GraphileConfig.Plugin = {
  name: "PgV4SmartTagsOmitPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin attempts to take the `@omit` smart tags on a resource and turn them into behaviours",
  version: "0.0.0",
  after: ["PgSmartCommentsPlugin"],

  gather: {
    namespace: "pgV4SmartTagsOmit",
    helpers: {},
    hooks: {
      pgTables_unique(info, event) {
        processOmit(event.unique.extensions?.tags);
      },
      pgTables_PgSourceBuilder_options(info, event) {
        processOmit(event.options.extensions?.tags);
      },
      pgRelations_relation(info, event) {
        processOmit(event.relation.extensions?.tags);
      },
      pgCodecs_column(info, event) {
        processOmit(event.column.extensions?.tags);
      },
      pgCodecs_recordType_extensions(info, event) {
        processOmit(event.extensions?.tags);
      },
      pgCodecs_rangeOfCodec_extensions(info, event) {
        processOmit(event.extensions?.tags);
      },
      pgCodecs_domainOfCodec_extensions(info, event) {
        processOmit(event.extensions?.tags);
      },
      pgCodecs_listOfCodec_extensions(info, event) {
        processOmit(event.extensions?.tags);
      },
      pgProcedures_functionSource_options(info, event) {
        processOmit(event.options.extensions?.tags);
      },
      pgProcedures_PgSource_options(info, event) {
        processOmit(event.options.extensions?.tags);
      },
    },
  },
};

export default PgV4SmartTagsOmitPlugin;

function processOmit(tags: Partial<PgSmartTagsDict> | undefined) {
  const omit = tags?.omit;
  if (!omit) {
    return;
  }
  const behavior: string[] = [];
  const processOmit = (omit: true | string): void => {
    if (omit === true) {
      behavior.push("-*");
      return;
    }
    if (typeof omit !== "string") {
      throw new Error(
        `Issue in smart tags; expected omit to be true/string/string[], but found something unexpected: ${inspect(
          tags.omit,
        )}`,
      );
    }
    if (omit[0] === ":") {
      // Convert ':' string into longhand
      const letters = omit.slice(1).split("");
      const string = letters
        .map((l) => {
          switch (l) {
            case "C":
              return "create";
            case "R":
              return "read";
            case "U":
              return "update";
            case "D":
              return "delete";
            case "X":
              return "execute";
            case "F":
              return "filter";
            case "O":
              return "order";
            case "A":
              return "all";
            case "M":
              return "many";
            default:
              console.warn(
                `Abbreviation '${l}' in '@omit' string '${omit}' not recognized.`,
              );
              return l;
          }
        })
        .join(",");
      return processOmit(string);
    }
    const parts = omit.split(",");
    for (const part of parts) {
      switch (part) {
        case "create": {
          behavior.push("-insert");
          return;
        }
        case "read": {
          behavior.push("-select");
          return;
        }
        case "update": {
          behavior.push("-update");
          return;
        }
        case "delete": {
          behavior.push("-delete");
          return;
        }
        case "execute": {
          behavior.push("-query_field -mutation_field -type_field");
          return;
        }
        case "filter": {
          // TODO: we should figure out which of these to use depending on the circumstance
          behavior.push("-filter -filterBy");
          return;
        }
        case "order": {
          // TODO: we should figure out which of these to use depending on the circumstance
          behavior.push("-order -orderBy");
          return;
        }
        case "all": {
          behavior.push("-query:list -query:connection");
          return;
        }
        case "many": {
          behavior.push(
            "-singularRelation:list -singularRelation:connection -manyRelation:list -manyRelation:connection",
          );
          return;
        }
        case "": {
          // ignore
          return;
        }
        default: {
          // TODO: we should give plugin authors the option of adding other
          // omits here, e.g. `@omit manyToMany`
          console.warn(
            `Option '${part}' in '@omit' string '${omit}' not recognized.`,
          );
          return;
        }
      }
    }
  };
  if (Array.isArray(omit)) {
    omit.forEach(processOmit);
  } else {
    processOmit(omit);
  }

  // Merge the omit behaviors into the existing ones.
  if (behavior.length > 0) {
    if (Array.isArray(tags.behavior)) {
      tags.behavior.push(...behavior);
    } else if (typeof tags.behavior === "string") {
      tags.behavior = [tags.behavior, ...behavior];
    } else {
      tags.behavior = behavior;
    }
  }
}
