import { isSafeObjectPropertyName } from "tamedevil";

import { version } from "../version.ts";

function pojoify(obj: Record<string, any> | null | undefined) {
  if (obj == null) return;
  if (Object.getPrototypeOf(obj) !== null) return;
  const names = Object.keys(obj);
  if (names.every(isSafeObjectPropertyName)) {
    // Convert from null prototype object to POJO
    Object.setPrototypeOf(obj, Object.prototype);
  }
}

function tidyTags(tags: Record<string, any> | null | undefined) {
  if (tags == null) return;
  delete tags.omit;
  delete tags.behavior;
  delete tags.deprecated;
  delete tags.name;
  delete tags.resultFieldName;
  delete tags.uniqueKey;
  delete tags.unique;
  delete tags.foreignKey;
  delete tags.notNull;
  delete tags.arg0variant;
  delete tags.simpleCollections;
  delete tags.forwardDescription;
  delete tags.backwardDescription;
  delete tags.sortable;
  delete tags.filterable;
}

function tidyExtensions(obj: {
  extensions?: Record<string, any> | null | undefined;
}) {
  if (obj.extensions == null) return;
  const { extensions } = obj;

  delete extensions.pg;
  delete extensions.isInsertable;
  delete extensions.isUpdatable;
  delete extensions.isDeletable;
  delete extensions.isTableLike;
  delete extensions.isEnumTableEnum;
  delete extensions.enumTableEnumDetails;
  delete extensions.singleOutputParameterName;
  delete extensions.variant;

  if (extensions.tags) {
    tidyTags(extensions.tags);
    if (Object.keys(extensions.tags).length === 0) {
      delete extensions.tags;
    }
    pojoify(extensions.tags);
  }
  pojoify(extensions);
  if (Object.keys(extensions).length === 0) {
    delete obj.extensions;
  }
}

export const PgRegistryReductionPlugin: GraphileConfig.Plugin = {
  name: "PgRegistryReductionPlugin",
  description:
    "[EXPERIMENTAL] Strips extensions from pgRegistry to reduce export size",
  version,

  schema: {
    hooks: {
      finalize(schema, build) {
        const {
          input: { pgRegistry },
        } = build;
        const { pgCodecs, pgResources, pgRelations } = pgRegistry;

        pojoify(pgCodecs);
        for (const codec of Object.values(pgCodecs)) {
          tidyExtensions(codec);
          if (codec.attributes) {
            for (const attr of Object.values(codec.attributes)) {
              delete attr.extensions?.argIndex;
              delete attr.extensions?.argName;
              tidyExtensions(attr);
            }
            pojoify(codec.attributes);
          }
        }

        pojoify(pgResources);
        for (const resource of Object.values(pgResources)) {
          tidyExtensions(resource);
          if (resource.uniques) {
            for (const unique of resource.uniques) {
              tidyExtensions(unique);
            }
          }
          if (resource.parameters) {
            for (const param of resource.parameters) {
              tidyExtensions(param);
            }
          }
        }

        pojoify(pgRelations);
        for (const codecRelations of Object.values(pgRelations)) {
          pojoify(codecRelations);
          tidyExtensions(codecRelations);
          for (const relation of Object.values(codecRelations)) {
            tidyExtensions(relation);
          }
        }

        return schema;
      },
    },
  },
};
