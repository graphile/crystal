import "graphile-config";

import { gatherConfig } from "graphile-build";
import type { PgSmartTagsDict } from "graphile-build-pg/pg-introspection";
import { inspect } from "util";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgV4SmartTagsPlugin: true;
    }

    interface Provides {
      "smart-tags": true;
    }

    interface GatherHelpers {
      pgV4SmartTags: Record<string, never>;
    }
  }
}
const EMPTY_OBJECT = Object.freeze({});

export const PgV4SmartTagsPlugin: GraphileConfig.Plugin = {
  name: "PgV4SmartTagsPlugin",
  description:
    "For compatibility with PostGraphile v4 schemas, this plugin attempts to convert various V4 smart tags (`@omit`, etc) and convert them to V5 behaviors",
  version: "0.0.0",
  before: ["PgFakeConstraintsPlugin", "PgEnumTablesPlugin"],
  provides: ["smart-tags"],

  gather: gatherConfig({
    namespace: "pgV4SmartTags",
    initialCache() {
      return EMPTY_OBJECT;
    },
    initialState() {
      return EMPTY_OBJECT;
    },
    helpers: {},
    hooks: {
      // Run in the 'introspection' phase before anything uses the tags
      pgIntrospection_introspection(info, event) {
        const { introspection } = event;
        // Note the code here relies on the fact that `getTagsAndDescription`
        // memoizes because it mutates the return result; if this changes then
        // the code will no longer achieve its goal.
        for (const pgClass of introspection.classes) {
          processTags(pgClass.getTags());
        }
        for (const pgAttr of introspection.attributes) {
          processTags(pgAttr.getTags());
        }
        for (const pgConstraint of introspection.constraints) {
          processTags(pgConstraint.getTags());

          // In V4, if a attribute has `@omit read` then any constraint that uses that attribute also has `@omit read`
          if (pgConstraint.contype === "f") {
            for (const attr of [
              ...pgConstraint.getAttributes()!,
              ...pgConstraint.getForeignAttributes()!,
            ]) {
              const attrOmit = attr.getTags().omit;
              if (!attrOmit) continue;
              const arr = Array.isArray(attrOmit) ? attrOmit : [attrOmit];
              const omitRead = arr.some(
                (omit) => omit === true || expandOmit(omit).includes("read"),
              );
              if (omitRead) {
                addBehaviorToTags(pgConstraint.getTags(), "-select", true);
              }
            }
          }
        }
        for (const pgProc of introspection.procs) {
          processTags(pgProc.getTags());
        }
        for (const pgType of introspection.types) {
          processTags(pgType.getTags());
        }
      },
      pgFakeConstraints_constraint(info, event) {
        const { entity } = event;
        processTags(entity.getTags());
      },
    },
  }),
};

export default PgV4SmartTagsPlugin;

function processTags(
  tags: Partial<GraphileBuild.PgSmartTagsDict> | undefined,
): void {
  processUniqueKey(tags);
  processOmit(tags);
  convertBoolean(
    tags,
    "sortable",
    "orderBy order resource:connection:backwards",
  );
  convertBoolean(tags, "filterable", "filter filterBy");
  // convertBoolean(tags, "enum", "enum");
  processSimpleCollections(tags);
}

function processSimpleCollections(
  tags: Partial<GraphileBuild.PgSmartTagsDict> | undefined,
) {
  if (tags?.simpleCollections) {
    switch (tags.simpleCollections) {
      case "omit": {
        addBehaviorToTags(tags, "-list +connection", true);
        break;
      }
      case "both": {
        addBehaviorToTags(tags, "+list +connection", true);
        break;
      }
      case "only": {
        addBehaviorToTags(tags, "+list -connection", true);
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
  tags: Partial<GraphileBuild.PgSmartTagsDict> | undefined,
  key: string,
  behavior: string,
): void {
  if (tags && tags[key]) {
    addBehaviorToTags(tags, behavior, true);
  }
}

function processUniqueKey(
  tags: Partial<GraphileBuild.PgSmartTagsDict> | undefined,
) {
  if (tags && typeof tags.uniqueKey === "string") {
    const newUnique = `${tags.uniqueKey}|@behavior -single -update -delete`;
    if (Array.isArray(tags.unique)) {
      tags.unique.push(newUnique);
    } else if (typeof tags.unique === "string") {
      tags.unique = [tags.unique, newUnique];
    } else {
      tags.unique = newUnique;
    }
  }
}

function expandOmit(omit: string) {
  if (omit[0] === ":") {
    // Convert ':' string into longhand
    const letters = omit.slice(1).split("");
    return letters.map((l) => {
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
    });
  }
  const parts = omit.split(",");
  return parts;
}

function processOmit(
  tags: Partial<GraphileBuild.PgSmartTagsDict> | undefined,
): void {
  const omit = tags?.omit;
  if (!omit) {
    return;
  }
  const behavior: string[] = [];
  const processOmit = (rawOmit: true | string): void => {
    const omit =
      rawOmit === true || rawOmit === "*"
        ? "create,read,update,delete,execute,filter,order,all,many,manyToMany"
        : rawOmit;
    if (typeof omit !== "string") {
      throw new Error(
        `Issue in smart tags; expected omit to be true/string/string[], but found something unexpected: ${inspect(
          omit,
        )}`,
      );
    }
    const parts = expandOmit(omit);
    for (const part of parts) {
      switch (part) {
        case "create": {
          behavior.push("-insert");
          break;
        }
        case "read": {
          behavior.push("-select -node -connection -list -array -single");
          break;
        }
        case "update": {
          behavior.push("-update");
          break;
        }
        case "delete": {
          behavior.push("-delete");
          break;
        }
        case "execute": {
          behavior.push("-queryField -mutationField -typeField");
          break;
        }
        case "filter": {
          // ENHANCE: we should figure out which of these to use depending on the circumstance
          behavior.push("-filter -filterBy");
          break;
        }
        case "order": {
          // ENHANCE: we should figure out which of these to use depending on the circumstance
          behavior.push("-order -orderBy");
          break;
        }
        case "all": {
          behavior.push("-query:resource:list -query:resource:connection");
          break;
        }
        case "many": {
          behavior.push(
            "-singularRelation:resource:list -singularRelation:resource:connection -manyRelation:resource:list -manyRelation:resource:connection",
          );
          break;
        }
        case "manyToMany": {
          behavior.push("-manyToMany");
          break;
        }
        case "": {
          // ignore
          break;
        }
        default: {
          // ENHANCE: we should give plugin authors the option of adding other
          // omits here, e.g. `@omit manyToMany`
          console.warn(
            `Option '${part}' in '@omit' string '${omit}' not recognized; assuming -${part} behavior`,
          );
          behavior.push(`-${part}`);
          break;
        }
      }
    }
  };
  if (Array.isArray(omit)) {
    omit.forEach(processOmit);
  } else {
    processOmit(omit);
  }

  addBehaviorToTags(tags, behavior.join(" "), true);
}

function addBehaviorToTags(
  tags: Partial<PgSmartTagsDict>,
  behavior: string,
  prepend = false,
): void {
  if (Array.isArray(tags.behavior)) {
    if (prepend) {
      tags.behavior = [behavior, ...tags.behavior];
    } else {
      tags.behavior = [...tags.behavior, behavior];
    }
  } else if (typeof tags.behavior === "string") {
    tags.behavior = prepend
      ? [behavior, tags.behavior]
      : [tags.behavior, behavior];
  } else if (!tags.behavior) {
    tags.behavior = [behavior];
  } else {
    throw new Error(
      `Did not understand tags.behavior - it wasn't an array or a string`,
    );
  }
}
