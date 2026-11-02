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

const TRIMMABLE = new Set<string>([
  "omit",
  "behavior",
  "deprecated",
  "name",
  "resultFieldName",
  "uniqueKey",
  "unique",
  "foreignKey",
  "notNull",
  "simpleCollections",
  "forwardDescription",
  "backwardDescription",
  "sortable",
  "filterable",
  // For performance, we'll add these to the set too
  "arg0description",
  "arg1description",
  "arg2description",
  "arg3description",
  "arg4description",
  "arg5description",
  "arg6description",
  "arg7description",
  "arg8description",
  "arg9description",
  "arg0variant",
  "arg1variant",
  "arg2variant",
  "arg3variant",
  "arg4variant",
  "arg5variant",
  "arg6variant",
  "arg7variant",
  "arg8variant",
  "arg9variant",
]);

const ARG_DESC_OR_VARIANT = /^arg[0-9]+(description|variant)$/;

function tidyTags(tags: Record<string, any> | null | undefined) {
  if (tags == null) return;
  const keys = Object.keys(tags);
  for (const key of keys) {
    if (TRIMMABLE.has(key) || ARG_DESC_OR_VARIANT.test(key)) {
      delete tags[key];
    }
  }
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
  delete extensions.oid;
  delete extensions.canSelect;
  delete extensions.canInsert;
  delete extensions.canUpdate;
  delete extensions.canDelete;
  delete extensions.canExecute;

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

  // **IMPORTANT**: this is a _schema_ hook not a _gather_ hook because if we
  // trim these things out during the gather phase before we build the schema,
  // a different schema will be built. This is not the intention of this
  // plugin, instead the intent is that when the registry and schema are output
  // to be executed at runtime, unnecessary resources are removed.
  schema: {
    hooks: {
      finalize(schema, build) {
        const {
          input: { pgRegistry },
          options: {
            minifyDropsDescriptions = true,
            // minifyDropsDeprecationReasons = true,
          },
        } = build;
        const { pgCodecs, pgResources, pgRelations } = pgRegistry;

        function delDesc<T extends { readonly description?: unknown }>(
          obj: T,
        ): T {
          if (!minifyDropsDescriptions) return obj;
          if ("description" in obj) {
            delete (obj as { description?: unknown }).description;
          }
          return obj;
        }

        pojoify(pgCodecs);
        for (const codec of Object.values(pgCodecs)) {
          tidyExtensions(codec);
          if (codec.attributes) {
            for (const attr of Object.values(codec.attributes)) {
              delete attr.extensions?.argIndex;
              delete attr.extensions?.argName;
              tidyExtensions(attr);
              delDesc(attr);
            }
            pojoify(codec.attributes);
          }
          delDesc(codec);
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
              delDesc(param);
            }
          }
          delDesc(resource);
        }

        pojoify(pgRelations);
        for (const codecRelations of Object.values(pgRelations)) {
          pojoify(codecRelations);
          tidyExtensions(codecRelations);
          for (const relation of Object.values(codecRelations)) {
            tidyExtensions(relation);
            delDesc(relation);
          }
        }

        return schema;
      },
    },
  },
};
