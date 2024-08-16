import { addBehaviorToTags } from "../utils.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgIndexBehaviorsPlugin: true;
    }
  }
}

export const PgIndexBehaviorsPlugin: GraphileConfig.Plugin = {
  name: "PgIndexBehaviorsPlugin",
  version: "0.0.0",
  // We want the "prepend" of addBehaviorToTags to prepend to a position
  // _before_ anything added by smart tags (where the user has overridden
  // things) - so we have to run _after_ that.
  after: ["smart-tags"],

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
          const referencedAttributes = pgConstraint
            .getAttributes()!
            .map((att) => att.attname);
          const remoteIndexes = pgConstraint
            .getClass()!
            .getIndexes()
            .filter((idx) => !idx.indpred);

          const isIndexed = remoteIndexes.some((idx) => {
            const cols = idx.getKeys();
            if (cols.length < referencedAttributes.length) {
              return false;
            }
            const firstColNames = cols
              .slice(0, referencedAttributes.length)
              .map((k) => k?.attname);
            return referencedAttributes.every((key) =>
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

      pgCodecs_attribute(info, event) {
        const { attribute, pgAttribute } = event;

        // If this attribute isn't indexed, remove the filter and order behaviors
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
          if (!attribute.extensions) {
            attribute.extensions = Object.create(null);
          }
          if (!attribute.extensions!.tags) {
            attribute.extensions!.tags = Object.create(null);
          }
          addBehaviorToTags(
            attribute.extensions!.tags!,
            "-filterBy -orderBy",
            true,
          );
        }
      },
    },
  },
};
