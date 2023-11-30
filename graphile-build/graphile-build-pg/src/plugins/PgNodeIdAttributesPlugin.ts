import "./PgTablesPlugin.js";
import "../interfaces.js";
import "graphile-config";

import type {
  GenericPgCodec,
  GenericPgRegistry,
  PgConditionStep,
  PgSelectStep,
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
          registry: GenericPgRegistry;
          codec: GenericPgCodec;
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
      pgCodecRelation:
        "-nodeId:insert -nodeId:update -nodeId:base -nodeId:filterBy",
    },
    hooks: {
      GraphQLInputObjectType_fields(fields, build, context) {
        const {
          extend,
          inflection,
          graphql: { GraphQLID },
          input: { pgRegistry },
          sql,
        } = build;
        const {
          scope: {
            isPgRowType,
            isPgCompoundType,
            isPgPatch,
            isPgBaseInput,
            pgCodec: rawPgCodec,
            isPgCondition,
          },
          fieldWithHooks,
        } = context;
        if (
          !(isPgRowType || isPgCompoundType || isPgCondition) ||
          !rawPgCodec ||
          !rawPgCodec.attributes ||
          rawPgCodec.isAnonymous
        ) {
          return fields;
        }
        const pgCodec = rawPgCodec;

        const relationEntries = Object.entries(
          pgRegistry.pgRelations[pgCodec.name] ?? {},
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
              const getSpec = build.nodeIdSpecForCodec?.(
                relation.remoteResource.codec,
              );
              if (!getSpec) {
                return memo;
              }
              const action = isPgBaseInput
                ? "base"
                : isPgPatch
                ? "update"
                : isPgCondition
                ? "filterBy"
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
                (name) => pgCodec.attributes![name],
              );
              const anAttributeIsNotNull = attributes.some(
                (attr) => attr.notNull || attr.extensions?.tags?.notNull,
              );
              const { localAttributes, remoteAttributes } = relation;
              const localAttributeCodecs = localAttributes.map(
                (name) => pgCodec.attributes![name].codec,
              );
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
                        isPgBaseInput ||
                          isPgPatch ||
                          isPgCondition ||
                          !anAttributeIsNotNull,
                        GraphQLID,
                      ),
                      autoApplyAfterParentInputPlan: true,
                      autoApplyAfterParentApplyPlan: true,
                      // ENHANCE: if the remote columns are the primary keys
                      // then there's no need to actually fetch the record
                      // (unless we want to check it exists).
                      applyPlan: isPgCondition
                        ? EXPORTABLE(
                            (
                              getSpec,
                              localAttributeCodecs,
                              localAttributes,
                              remoteAttributes,
                              sql,
                            ) =>
                              function plan(
                                $condition: PgConditionStep<PgSelectStep<any>>,
                                val,
                              ) {
                                if (val.getRaw().evalIs(null)) {
                                  for (
                                    let i = 0, l = localAttributes.length;
                                    i < l;
                                    i++
                                  ) {
                                    const localName = localAttributes[i];
                                    $condition.where({
                                      type: "attribute",
                                      attribute: localName,
                                      callback: (expression) =>
                                        sql`${expression} is null`,
                                    });
                                  }
                                } else {
                                  const spec = getSpec(val.get());
                                  for (
                                    let i = 0, l = localAttributes.length;
                                    i < l;
                                    i++
                                  ) {
                                    const localName = localAttributes[i];
                                    const codec = localAttributeCodecs[i];
                                    const remoteName = remoteAttributes[i];
                                    $condition.where({
                                      type: "attribute",
                                      attribute: localName,
                                      callback: (expression) =>
                                        sql`${expression} = ${$condition.placeholder(
                                          spec[remoteName],
                                          codec,
                                        )}`,
                                    });
                                  }
                                }
                              },
                            [
                              getSpec,
                              localAttributeCodecs,
                              localAttributes,
                              remoteAttributes,
                              sql,
                            ],
                          )
                        : EXPORTABLE(
                            (getSpec, localAttributes, remoteAttributes) =>
                              function plan(
                                $insert: SetterStep<any, any>,
                                val,
                              ) {
                                const spec = getSpec(val.get());
                                for (
                                  let i = 0, l = localAttributes.length;
                                  i < l;
                                  i++
                                ) {
                                  const localName = localAttributes[i];
                                  const remoteName = remoteAttributes[i];
                                  const $val = spec[remoteName];
                                  $insert.set(localName, $val);
                                }
                              },
                            [getSpec, localAttributes, remoteAttributes],
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
