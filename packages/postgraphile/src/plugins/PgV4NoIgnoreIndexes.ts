import { PgSourceUnique } from "@dataplan/pg";
import { addBehaviorToTags } from "graphile-build-pg";

export const PgV4NoIgnoreIndexesPlugin: GraphileConfig.Plugin = {
  name: "PgV4NoIgnoreIndexesPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgRelations_relation(info, event) {
        const { relation, pgConstraint, pgClass } = event;

        // If it's not indexed, remove the list/connection behaviors
        if (relation.isBackwards) {
          const localColumns = relation.localColumns as string[];
          const isIndexed = pgClass.getIndexes().some((idx) => {
            const cols = idx.getKeys();
            if (cols.length < localColumns.length) {
              return false;
            }
            const firstColNames = cols
              .slice(0, localColumns.length)
              .map((k) => k?.attname);
            return localColumns.every((key) => firstColNames.includes(key));
          });
          if (!isIndexed) {
            if (!relation.extensions) {
              relation.extensions = { tags: Object.create(null) };
            }
            if (!relation.extensions.tags) {
              relation.extensions.tags = Object.create(null);
            }
            addBehaviorToTags(relation.extensions.tags, "-list -connection");
          }
        }
      },

      pgCodecs_column(info, event) {
        const { column, pgAttribute } = event;

        // If this column isn't indexed, remove the filter and order behaviors
        const isIndexed = pgAttribute
          .getClass()!
          .getIndexes()
          .some((idx) => {
            const keys = idx.getKeys();
            return keys[0]?.attname === pgAttribute.attname;
          });
        if (!isIndexed) {
          if (!column.extensions) {
            column.extensions = {};
          }
          if (!column.extensions.tags) {
            column.extensions.tags = Object.create(null);
          }
          addBehaviorToTags(column.extensions.tags!, "-filterBy -orderBy");
        }
      },
    },
  },
};
