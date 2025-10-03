declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgIndexBehaviorsPlugin: true;
    }
  }
  namespace DataplanPg {
    interface PgCodecAttributeExtensions {
      isIndexed?: boolean;
    }
    interface PgCodecRelationExtensions {
      isIndexed?: boolean;
    }
  }
  namespace GraphileBuild {
    interface BehaviorStrings {
      manyToMany: true;
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
          const remoteTable = pgConstraint.getClass()!;
          if (remoteTable.relkind === "v") {
            // Views can't have indexes; give them the benefit of the doubt
            return;
          }
          const remoteIndexes = remoteTable
            .getIndexes()
            .filter((idx) => !idx.indpred);

          const isIndexed = remoteIndexes.some((idx) => {
            const cols = idx.getKeys();
            if (cols.length < referencedAttributes.length) {
              return false;
            }
            const firstColNames = cols.map((k) => k?.attname);
            return referencedAttributes.every((key) =>
              firstColNames.includes(key),
            );
          });
          if (!isIndexed) {
            relation.extensions ??= Object.create(null);
            relation.extensions!.isIndexed = false;
          }
        }
      },

      pgCodecs_attribute(info, event) {
        const { attribute, pgAttribute } = event;

        // If this attribute isn't indexed, remove the filter and order behaviors
        const tbl = pgAttribute.getClass()!;
        if (tbl.relkind === "v") {
          // Views can't have indexes; so stop
          return;
        }
        const isIndexed = tbl.getIndexes().some((idx) => {
          if (idx.indpred) {
            return false;
          }
          const keys = idx.getKeys();
          // From PG18, Postgres can use indexes even if the column is not the
          // first one in the index.
          return keys.some(
            (k) => k != null && k.attname === pgAttribute.attname,
          );
        });
        if (!isIndexed) {
          attribute.extensions ??= Object.create(null);
          attribute.extensions!.isIndexed = false;
        }
      },
    },
  },
  schema: {
    behaviorRegistry: {
      add: {
        // HACK: this impacts a community plugin and isn't part of core.
        manyToMany: {
          entities: ["pgResource", "pgCodecRelation"],
          description: "(Legacy support hack - many-to-many relationship)",
        },
      },
    },
    entityBehavior: {
      pgCodecAttribute: {
        inferred: {
          after: ["inferred"],
          provides: ["postInferred"],
          callback(behavior, [codec, attributeName]) {
            const newBehavior = [behavior];
            const attr = codec.attributes[attributeName];
            if (attr.extensions?.isIndexed === false) {
              newBehavior.push("-filterBy", "-orderBy");
            }
            return newBehavior;
          },
        },
      },
      pgCodecRelation: {
        inferred: {
          after: ["inferred"],
          provides: ["postInferred"],
          callback(behavior, relation) {
            const newBehavior = [behavior];
            if (relation.extensions?.isIndexed === false) {
              newBehavior.push(
                "-select",
                "-list",
                "-connection",
                "-single",

                // HACK: this impacts a community plugin and isn't part of core.
                "-manyToMany",
              );
            }
            return newBehavior;
          },
        },
      },
    },
  },
};
