import "graphile-config";
import "graphile-build-pg";

import type { PgSmartTagsDict } from "graphile-build-pg";
import { inspect } from "util";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgV4SmartTags: Record<string, never>;
    }
  }
}

export const PgV4SmartTagsPlugin: GraphileConfig.Plugin = {
  name: "PgV4SmartTagsPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin attempts to convert various V4 smart tags (`@omit`, etc) and convert them to V5 behaviors",
  version: "0.0.0",
  after: ["PgSmartCommentsPlugin", "PgEnumTablesPlugin"],
  before: ["PgFakeConstraintsPlugin"],

  gather: {
    namespace: "pgV4SmartTags",
    helpers: {},
    hooks: {
      // Run in the 'introspection' phase before anything uses the tags
      pgIntrospection_introspection(info, event) {
        const { introspection } = event;
        // Note the code here relies on the fact that `getTagsAndDescription`
        // memoizes because it mutates the return result; if this changes then
        // the code will no longer achieve its goal.
        for (const pgClass of introspection.classes) {
          processTags(pgClass.getTagsAndDescription().tags);
        }
        for (const pgAttr of introspection.attributes) {
          processTags(pgAttr.getTagsAndDescription().tags);
        }
        for (const pgConstraint of introspection.constraints) {
          processTags(pgConstraint.getTagsAndDescription().tags);
        }
        for (const pgProc of introspection.procs) {
          processTags(pgProc.getTagsAndDescription().tags);
        }
        for (const pgType of introspection.types) {
          processTags(pgType.getTagsAndDescription().tags);
        }
      },
    },
  },
};

export default PgV4SmartTagsPlugin;

function processTags(tags: Partial<PgSmartTagsDict> | undefined): void {
  processOmit(tags);
  convertBoolean(tags, "sortable", "orderBy order");
  convertBoolean(tags, "filterable", "filter filterBy");
  convertBoolean(tags, "enum", "enum");
  processSimpleCollections(tags);
}

function processSimpleCollections(tags: Partial<PgSmartTagsDict> | undefined) {
  if (tags?.simpleCollections) {
    switch (tags.simpleCollections) {
      case "omit": {
        addBehaviors(tags, ["-list +connection"]);
        break;
      }
      case "both": {
        addBehaviors(tags, ["+list +connection"]);
        break;
      }
      case "only": {
        addBehaviors(tags, ["+list -connection"]);
        break;
      }
      default: {
        console.warn(
          `Did not understand @simpleCollections argument '${tags.simpleCollections}'`,
        );
      }
    }
  }
}

function convertBoolean(
  tags: Partial<PgSmartTagsDict> | undefined,
  key: string,
  behavior: string,
): void {
  if (tags && tags[key]) {
    addBehaviors(tags, [behavior]);
  }
}

function processOmit(tags: Partial<PgSmartTagsDict> | undefined): void {
  const omit = tags?.omit;
  if (!omit) {
    return;
  }
  const behavior: string[] = [];
  const processOmit = (omit: true | string): void => {
    if (omit === true || omit === "*") {
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

  addBehaviors(tags, behavior);
}

// Merge the behaviors into the existing ones.
function addBehaviors(tags: Partial<PgSmartTagsDict>, behavior: string[]) {
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
