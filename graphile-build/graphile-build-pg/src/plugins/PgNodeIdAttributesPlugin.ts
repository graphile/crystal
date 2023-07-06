import "./PgTablesPlugin.js";
import "../interfaces.js";
import "graphile-config";

import type {
  PgCodecRelation,
  PgCodecWithAttributes,
  PgRegistry,
  PgSelectSingleStep,
} from "@dataplan/pg";
import type { SetterStep } from "grafast";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      /**
       * The name of the attribute used as an `ID` input representing a related
       * record ultimately representing the underlying keys.
       */
      nodeIdAttribute(
        this: Inflection,
        details: {
          registry: PgRegistry;
          codec: PgCodecWithAttributes;
          relationName: string;
        },
      ): string;
    }
  }
}

export const PgNodeIdAttributesPlugin: GraphileConfig.Plugin = {
  name: "PgNodeIdAttributesPlugin",
  description:
    "Adds nodeId attributes to various inputs representing foreign key relations",
  version: version,
  after: ["PgTablesPlugin", "PgAttributesPlugin"],

  inflection: {
    add: {
      nodeIdAttribute(options, details) {
        return this.singleRelation(details);
      },
    },
  },

  schema: {
    entityBehavior: {
      // By default, column attributes will be present, so we don't want this to also be set
      pgCodecRelation: "-nodeId:insert -nodeId:update -nodeId:base",
    },
    hooks: {
      GraphQLInputObjectType_fields(fields, build, context) {
        const {
          extend,
          inflection,
          graphql: { GraphQLID },
          input: { pgRegistry },
        } = build;
        const {
          scope: {
            isPgRowType,
            isPgCompoundType,
            isPgPatch,
            isPgBaseInput,
            pgCodec: rawPgCodec,
          },
          fieldWithHooks,
        } = context;
        if (
          !(isPgRowType || isPgCompoundType) ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return fields;
        }
        const pgCodec = rawPgCodec as PgCodecWithAttributes;

        const relationEntries = (
          Object.entries(pgRegistry.pgRelations[pgCodec.name] ?? {}) as [
            string,
            PgCodecRelation,
          ][]
        ).filter(
          ([_name, relation]) => !relation.isReferencee && relation.isUnique,
        );

        return relationEntries.reduce(
          (memo, [relationName, relation]) =>
            build.recoverable(memo, () => {
              const typeName = build.getGraphQLTypeNameByPgCodec(
                relation.remoteResource.codec,
                "output",
              );
              if (!typeName) return memo;
              if (typeName === build.inflection.builtin("Query")) {
                return memo;
              }
              const action = isPgBaseInput
                ? "base"
                : isPgPatch
                ? "update"
                : "insert";

              const fieldBehaviorScope = `nodeId:${action}`;
              if (
                !build.behavior.pgCodecRelationMatches(
                  relation,
                  fieldBehaviorScope,
                )
              ) {
                return memo;
              }

              const fieldName = inflection.nodeIdAttribute({
                registry: pgRegistry,
                codec: pgCodec,
                relationName,
              });
              const attributes = relation.localAttributes.map(
                (name) => pgCodec.attributes[name],
              );
              const anAttributeIsNotNull = attributes.some(
                (attr) => attr.notNull || attr.extensions?.tags?.notNull,
              );
              const { localAttributes, remoteAttributes } = relation;
              const fetcher = build.nodeFetcherByTypeName(typeName);
              return extend(
                memo,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope,
                      pgCodec,
                    },
                    {
                      type: build.nullableIf(
                        isPgBaseInput || isPgPatch || !anAttributeIsNotNull,
                        GraphQLID,
                      ),
                      deprecationReason: fetcher.deprecationReason,
                      autoApplyAfterParentInputPlan: true,
                      autoApplyAfterParentApplyPlan: true,
                      applyPlan: EXPORTABLE(
                        (fetcher, localAttributes, remoteAttributes) =>
                          function plan($insert: SetterStep<any, any>, val) {
                            const $record = fetcher(
                              val.get(),
                            ) as PgSelectSingleStep;
                            for (
                              let i = 0, l = localAttributes.length;
                              i < l;
                              i++
                            ) {
                              const $val = $record.get(remoteAttributes[i]);
                              $insert.set(localAttributes[i], $val);
                            }
                          },
                        [fetcher, localAttributes, remoteAttributes],
                      ),
                    },
                  ),
                },
                `Adding input object 'ID' field to ${pgCodec.name} (action = ${action}) representing relation ${relationName}.`,
              );
            }),
          fields,
        );
      },
    },
  },
};
