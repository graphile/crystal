import "graphile-config";
import "./PgCodecsPlugin.js";
import "./PgProceduresPlugin.js";
import "./PgRelationsPlugin.js";
import "./PgTablesPlugin.js";

import type {
  PgAttribute,
  PgClass,
  PgConstraint,
  PgProc,
  PgType,
} from "pg-introspection";

import { version } from "../index.js";
import type { PgSmartTagsDict } from "../interfaces.js";
import { mergeTags } from "../mergeTags.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgSmartComments: Record<string, never>;
    }
  }
}

export const PgSmartCommentsPlugin: GraphileConfig.Plugin = {
  name: "PgSmartCommentsPlugin",
  description: "Applies smart comments and descriptions to various resources",
  version,
  gather: {
    namespace: "pgSmartComments",
    helpers: {},
    hooks: {
      pgTables_unique(info, event) {
        const { pgConstraint, unique } = event;
        applyTags(pgConstraint, unique);
      },

      pgTables_PgSourceBuilder_options(info, event) {
        const { pgClass, options } = event;
        applyTags(pgClass, options);
      },

      pgRelations_relation(info, event) {
        const { pgConstraint, relation } = event;
        const { tags } = pgConstraint.getTagsAndDescription();
        relation.extensions = relation.extensions || {
          tags: Object.create(null),
        };
        relation.extensions.tags =
          relation.extensions.tags || Object.create(null);
        // Clone the tags because we use the same tags on both relations
        // (in both directions) but don't want modifications made to one
        // to affect the other.
        mergeTags(relation.extensions.tags, JSON.parse(JSON.stringify(tags)));
      },

      pgCodecs_column(info, event) {
        const { pgAttribute, column } = event;
        applyTags(pgAttribute, column);
      },

      pgCodecs_recordType_extensions(info, event) {
        const { pgClass, extensions } = event;
        const typeTagsAndDescription = pgClass
          .getType()!
          .getTagsAndDescription();
        const classTagsAndDescription = pgClass.getTagsAndDescription();

        if (!extensions.description) {
          extensions.description =
            typeTagsAndDescription.description ||
            classTagsAndDescription.description;
        }
        extensions.tags = extensions.tags || Object.create(null);
        mergeTags(extensions.tags, typeTagsAndDescription.tags);
        mergeTags(extensions.tags, classTagsAndDescription.tags);
      },

      pgCodecs_rangeOfCodec_extensions(info, event) {
        const { pgType, extensions } = event;
        applyTagsToExtensions(pgType, extensions);
      },

      pgCodecs_domainOfCodec_extensions(info, event) {
        const { pgType, extensions } = event;
        applyTagsToExtensions(pgType, extensions);
      },

      pgCodecs_listOfCodec_extensions(info, event) {
        const { pgType, extensions } = event;
        applyTagsToExtensions(pgType, extensions);
      },

      pgProcedures_functionSource_options(info, event) {
        const { pgProc, options } = event;
        applyTags(pgProc, options);
      },

      pgProcedures_PgSource_options(info, event) {
        const { pgProc, options } = event;
        applyTags(pgProc, options);
      },
    },
  },
};

function applyTags(
  entity: PgClass | PgConstraint | PgAttribute | PgType | PgProc,
  config: {
    extensions?: { description?: string; tags?: Partial<PgSmartTagsDict> };
  },
): void {
  config.extensions = config.extensions || { tags: Object.create(null) };
  applyTagsToExtensions(entity, config.extensions);
}

function applyTagsToExtensions(
  entity: PgClass | PgConstraint | PgAttribute | PgType | PgProc,
  extensions: {
    description?: string;
    tags?: Partial<PgSmartTagsDict>;
  },
): void {
  const { tags, description } = entity.getTagsAndDescription();

  extensions.tags = extensions.tags || Object.create(null);
  if (!extensions.description) {
    extensions.description = description;
  }
  mergeTags(extensions.tags!, tags);
}
