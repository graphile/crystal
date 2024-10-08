import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecRelation,
  PgCodecWithAttributes,
  PgConditionStep,
  PgRegistry,
  PgSelectStep,
} from "@dataplan/pg";
import type { SetterStep } from "grafast";
import { assertNotNull, condition, trap, TRAP_INHIBITED } from "grafast";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgNodeIdAttributesPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "nodeId:insert": true;
      "nodeId:update": true;
      "nodeId:base": true;
      "nodeId:filterBy": true;
    }
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
    behaviorRegistry: {
      add: {
        "nodeId:insert": {
          description:
            "can we insert to the columns represented by this nodeId which represents a table related via foreign key constraint?",
          entities: ["pgCodecRelation"],
        },
        "nodeId:update": {
          description:
            "can we update the columns represented by this nodeId which represents a table related via foreign key constraint?",
          entities: ["pgCodecRelation"],
        },
        "nodeId:base": {
          description:
            'should we add a nodeId input representing this foreign key constraint to the "base" input type?',
          entities: ["pgCodecRelation"],
        },
        "nodeId:filterBy": {
          description:
            "can we filter by the columns represented by this nodeId which represents a table related via foreign key constraint?",
          entities: ["pgCodecRelation"],
        },
      },
    },

    entityBehavior: {
      // By default, column attributes will be present, so we don't want this to also be set
      pgCodecRelation: [
        "-nodeId:insert",
        "-nodeId:update",
        "-nodeId:base",
        "-nodeId:filterBy",
      ],
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

              const fieldBehaviorScope = `nodeId:${action}` as const;
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
              const localAttributeCodecs = localAttributes.map(
                (name) => pgCodec.attributes[name].codec,
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
                      // ENHANCE: we know nodeId will always be unary, so we
                      // could optimize this SQL at execution time when we know
                      // if it is null or not.
                      applyPlan: isPgCondition
                        ? EXPORTABLE(
                            (
                              TRAP_INHIBITED,
                              assertNotNull,
                              condition,
                              getSpec,
                              localAttributeCodecs,
                              localAttributes,
                              remoteAttributes,
                              sql,
                              trap,
                              typeName,
                            ) =>
                              function plan(
                                $condition: PgConditionStep<PgSelectStep<any>>,
                                val,
                              ) {
                                const $nodeId = val.get();
                                const $nodeIdExists = condition(
                                  "exists",
                                  $nodeId,
                                );
                                const spec = getSpec($nodeId);
                                for (
                                  let i = 0, l = localAttributes.length;
                                  i < l;
                                  i++
                                ) {
                                  const localName = localAttributes[i];
                                  const codec = localAttributeCodecs[i];
                                  const remoteName = remoteAttributes[i];
                                  // Set `null` if invalid
                                  const $rawValue = trap(
                                    spec[remoteName],
                                    TRAP_INHIBITED,
                                  );
                                  // If `null` but `$nodeId` wasn't null, throw an error: invalid Node ID!
                                  const $value = assertNotNull(
                                    $rawValue,
                                    `Invalid node identifier for '${typeName}'`,
                                    { if: $nodeIdExists },
                                  );
                                  const sqlRemoteValue = $condition.placeholder(
                                    $value,
                                    codec,
                                  );
                                  $condition.where({
                                    type: "attribute",
                                    attribute: localName,
                                    callback: (expression) =>
                                      sql`((${sqlRemoteValue} is null and ${expression} is null) or (${sqlRemoteValue} is not null and ${expression} = ${sqlRemoteValue}))`,
                                  });
                                }
                              },
                            [
                              TRAP_INHIBITED,
                              assertNotNull,
                              condition,
                              getSpec,
                              localAttributeCodecs,
                              localAttributes,
                              remoteAttributes,
                              sql,
                              trap,
                              typeName,
                            ],
                          )
                        : EXPORTABLE(
                            (
                              TRAP_INHIBITED,
                              assertNotNull,
                              condition,
                              getSpec,
                              localAttributes,
                              remoteAttributes,
                              trap,
                              typeName,
                            ) =>
                              function plan(
                                $insert: SetterStep<any, any>,
                                val,
                              ) {
                                const $nodeId = val.get();
                                const $nodeIdExists = condition(
                                  "exists",
                                  $nodeId,
                                );
                                const spec = getSpec($nodeId);
                                for (
                                  let i = 0, l = localAttributes.length;
                                  i < l;
                                  i++
                                ) {
                                  const localName = localAttributes[i];
                                  const remoteName = remoteAttributes[i];
                                  // Set `null` if invalid
                                  const $rawValue = trap(
                                    spec[remoteName],
                                    TRAP_INHIBITED,
                                  );
                                  // If `null` but `$nodeId` wasn't null, throw an error: invalid Node ID!
                                  const $value = assertNotNull(
                                    $rawValue,
                                    `Invalid node identifier for '${typeName}'`,
                                    { if: $nodeIdExists },
                                  );
                                  $insert.set(localName, $value);
                                }
                              },
                            [
                              TRAP_INHIBITED,
                              assertNotNull,
                              condition,
                              getSpec,
                              localAttributes,
                              remoteAttributes,
                              trap,
                              typeName,
                            ],
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
