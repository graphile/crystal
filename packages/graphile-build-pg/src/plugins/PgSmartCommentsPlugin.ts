import "graphile-config";
import { PgClass, PgConstraint } from "pg-introspection";

import { version } from "../index.js";
import { PgSmartTagsDict } from "../interfaces.js";
import { mergeTags } from "../mergeTags.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgSmartComments: {};
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
    },
  },
};

function applyTags(
  entity: PgClass | PgConstraint,
  config: {
    extensions?: { description?: string; tags?: Partial<PgSmartTagsDict> };
  },
): void {
  const { tags, description } = entity.getTagsAndDescription();
  config.extensions = config.extensions || { tags: Object.create(null) };
  config.extensions.tags = config.extensions.tags || Object.create(null);
  if (!config.extensions.description) {
    config.extensions.description = description;
  }
  mergeTags(config.extensions.tags!, tags);
}
