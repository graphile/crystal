import "graphile-config";
import "graphile-build-pg";

import type { PgCodecRelation } from "@dataplan/pg";

import { version } from "../version.js";

const RELAY_HIDDEN_COLUMN_BEHAVIORS = [
  "-select",
  "-update",
  "-base",
  "-filterBy",
  "-orderBy",
] as const;

/** @experimental */
export const PgRelayPlugin: GraphileConfig.Plugin = {
  name: "PgRelayPlugin",
  description:
    "[EXPERIMENTAL] Adds behaviors, inflectors, and other accomodations to better hone your schema for Relay usage",
  version,

  after: ["PostGraphileV4CompatibilityPlugin"],

  inflection: {
    replace: {
      nodeIdFieldName() {
        return "id";
      },
      attribute(previous, options, details) {
        const name = previous!.call(this, details);
        if (name === "id") return "rowId";
        return name;
      },
    },
    ignoreReplaceIfNotExists: ["attribute"],
  },

  schema: {
    globalBehavior: `\
+node \
+connection -list \
-query:resource:single \
+nodeId:filterBy \
+nodeId:resource:update -constraint:resource:update \
+nodeId:resource:delete -constraint:resource:delete \
+nodeId:insert \
+nodeId:update \
+nodeId:base \
`,
    entityBehavior: {
      pgCodecAttribute(behavior, [codec, attributeName], build) {
        const newBehavior = [behavior];

        const resource = Object.values(build.input.pgRegistry.pgResources).find(
          (r) => {
            if (r.codec !== codec) return false;
            if (r.parameters) return false;
            if (r.isVirtual) return false;
            if (r.isUnique) return false;
            if (r.uniques.length === 0) return false;
            return true;
          },
        );
        const pk = resource?.uniques.find((u) => u.isPrimary);

        // If the column is a primary key, don't include it (since it will be in the NodeID instead)
        if (pk?.attributes.includes(attributeName)) {
          // Do not include this column in the schema (other than for create)
          newBehavior.push(...RELAY_HIDDEN_COLUMN_BEHAVIORS);
        } else {
          // If the column is available via a singular relation, don't include the column itself
          const relationsMap = build.input.pgRegistry.pgRelations[codec.name];
          const relations = relationsMap
            ? (Object.values(
                build.input.pgRegistry.pgRelations[codec.name] ?? {},
              ) as PgCodecRelation[])
            : [];
          const singularRelationsUsingThisColumn = relations.filter((r) => {
            // NOTE: We do this even if the end table is not visible, because
            // otherwise making the end table visible would be a breaking schema
            // change. Users should make sure these columns are hidden from the
            // schema if they are also hiding the target table.
            if (!r.isUnique) return false;
            if (r.isReferencee) return false;
            if (!r.localAttributes.includes(attributeName)) return false;
            return true;
          });
          if (singularRelationsUsingThisColumn.length > 0) {
            // Do not include this column in the schema (other than for create)
            newBehavior.push(...RELAY_HIDDEN_COLUMN_BEHAVIORS);
          }
        }

        const relations = (
          Object.values(
            build.input.pgRegistry.pgRelations[codec.name] ?? {},
          ) as PgCodecRelation[]
        ).filter((r) => !r.isReferencee && r.isUnique);
        const isPartOfRelation = relations.some((r) =>
          r.localAttributes.includes(attributeName),
        );
        if (isPartOfRelation) {
          // `nodeId:filterBy` handles this
          newBehavior.push(`-attribute:filterBy`);
          // `nodeId:insert` handles this
          newBehavior.push(`-attribute:insert`);
          // `nodeId:update` handles this
          newBehavior.push(`-attribute:update`);
          // `nodeId:base` handles this
          newBehavior.push(`-attribute:base`);
        }

        return newBehavior;
      },
    },
  },
};

/** @experimental */
export const PostGraphileRelayPreset: GraphileConfig.Preset = {
  plugins: [PgRelayPlugin],
  schema: {
    pgMutationPayloadRelations: false,
    pgFunctionsPreferNodeId: true,
  },
};

/** @deprecated use PostGraphileRelayPreset */
export const PgRelayPreset = PostGraphileRelayPreset;
