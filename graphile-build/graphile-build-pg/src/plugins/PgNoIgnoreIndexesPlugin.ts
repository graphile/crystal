import { addBehaviorToTags } from "graphile-build-pg";

export const PgNoIgnoreIndexesPlugin: GraphileConfig.Plugin = {
  name: "PgNoIgnoreIndexesPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgRelations_relation(info, event) {
        const { relation, pgConstraint } = event;

        if (pgConstraint._id.startsWith("FAKE_")) {
          // Pretend fake constraints are indexed.
          return;
        }

        // If it's not indexed, remove the list/connection behaviors
        if (relation.isReferencee) {
          const referencedColumns = pgConstraint
            .getAttributes()!
            .map((att) => att.attname);
          const remoteIndexes = pgConstraint
            .getClass()!
            .getIndexes()
            .filter((idx) => !idx.indpred);

          const isIndexed = remoteIndexes.some((idx) => {
            const cols = idx.getKeys();
            if (cols.length < referencedColumns.length) {
              return false;
            }
            const firstColNames = cols
              .slice(0, referencedColumns.length)
              .map((k) => k?.attname);
            return referencedColumns.every((key) =>
              firstColNames.includes(key),
            );
          });
          if (!isIndexed) {
            if (!relation.extensions) {
              relation.extensions = { tags: Object.create(null) };
            }
            if (!relation.extensions.tags) {
              relation.extensions.tags = Object.create(null);
            }
            addBehaviorToTags(
              relation.extensions.tags,
              "-list -connection -single -manyToMany",
              true,
            );
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
            if (idx.indpred) {
              return false;
            }
            const keys = idx.getKeys();
            return keys[0]?.attname === pgAttribute.attname;
          });
        if (!isIndexed) {
          if (!column.extensions) {
            column.extensions = Object.create(null);
          }
          if (!column.extensions!.tags) {
            column.extensions!.tags = Object.create(null);
          }
          addBehaviorToTags(
            column.extensions!.tags!,
            "-filterBy -orderBy",
            true,
          );
        }
      },
    },
  },
};
