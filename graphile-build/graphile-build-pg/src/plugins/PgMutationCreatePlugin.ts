import "graphile-config";

import type { PgInsertSingleStep, PgResource } from "@dataplan/pg";
import { pgInsertSingle } from "@dataplan/pg";
import type { FieldArgs, ObjectStep } from "grafast";
import { assertExecutableStep, constant, object } from "grafast";
import type { GraphQLOutputType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgMutationCreatePlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "insert:resource:select": true;
      record: true;
    }
    interface ScopeObject {
      isPgCreatePayloadType?: boolean;
    }
    interface Inflection {
      createField(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
      createInputType(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
      createPayloadType(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
      tableFieldName(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
    }
  }
}

const isInsertable = (
  build: GraphileBuild.Build,
  resource: PgResource<any, any, any, any, any>,
) => {
  if (resource.parameters) return false;
  if (!resource.codec.attributes) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  return build.behavior.pgResourceMatches(resource, "resource:insert") === true;
};

export const PgMutationCreatePlugin: GraphileConfig.Plugin = {
  name: "PgMutationCreatePlugin",
  description: "Adds 'create' mutation for supported table-like sources",
  version: version,
  after: ["smart-tags"],

  inflection: {
    add: {
      createField(options, resource) {
        return this.camelCase(`create-${this.tableType(resource.codec)}`);
      },
      createInputType(options, resource) {
        return this.upperCamelCase(`${this.createField(resource)}-input`);
      },
      createPayloadType(options, resource) {
        return this.upperCamelCase(`${this.createField(resource)}-payload`);
      },
      tableFieldName(options, resource) {
        return this.camelCase(`${this.tableType(resource.codec)}`);
      },
    },
  },

  schema: {
    behaviorRegistry: {
      add: {
        "insert:resource:select": {
          description:
            "can select the row that was inserted (on the mutation payload)",
          entities: ["pgResource"],
        },
        record: {
          description: "record type used for insert",
          entities: ["pgResource"],
        },
      },
    },

    entityBehavior: {
      pgResource: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, resource) {
          const newBehavior: GraphileBuild.BehaviorString[] = [
            behavior,
            "insert:resource:select",
          ];
          if (
            !resource.parameters &&
            !!resource.codec.attributes &&
            !resource.codec.polymorphism &&
            !resource.codec.isAnonymous
          ) {
            newBehavior.unshift("insert");
            newBehavior.unshift("record");
          }
          return newBehavior;
        },
      },
    },
    hooks: {
      init(_, build) {
        const {
          inflection,
          graphql: { GraphQLString, GraphQLNonNull },
        } = build;
        const insertableResources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((resource) => isInsertable(build, resource));

        insertableResources.forEach((resource) => {
          build.recoverable(null, () => {
            const tableTypeName = inflection.tableType(resource.codec);
            const inputTypeName = inflection.createInputType(resource);
            const tableFieldName = inflection.tableFieldName(resource);
            build.registerInputObjectType(
              inputTypeName,
              { isMutationInput: true },
              () => ({
                description: `All input for the create \`${tableTypeName}\` mutation.`,
                fields: ({ fieldWithHooks }) => {
                  const TableInput = build.getGraphQLTypeByPgCodec(
                    resource.codec,
                    "input",
                  );
                  return {
                    clientMutationId: {
                      type: GraphQLString,
                      autoApplyAfterParentApplyPlan: true,
                      applyPlan: EXPORTABLE(
                        () =>
                          function plan($input: ObjectStep<any>, val) {
                            $input.set("clientMutationId", val.get());
                          },
                        [],
                      ),
                    },
                    ...(TableInput
                      ? {
                          [tableFieldName]: fieldWithHooks(
                            {
                              fieldName: tableFieldName,
                              fieldBehaviorScope: `insert:input:record`,
                            },
                            () => ({
                              description: build.wrapDescription(
                                `The \`${tableTypeName}\` to be created by this mutation.`,
                                "field",
                              ),
                              type: new GraphQLNonNull(TableInput),
                              autoApplyAfterParentApplyPlan: true,
                              applyPlan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgInsertSingleStep;
                                    }>,
                                  ) {
                                    const $record =
                                      $object.getStepForKey("result");
                                    return $record.setPlan();
                                  },
                                [],
                              ),
                            }),
                          ),
                        }
                      : null),
                  };
                },
              }),
              `PgMutationCreatePlugin input for ${resource.name}`,
            );

            const payloadTypeName = inflection.createPayloadType(resource);
            build.registerObjectType(
              payloadTypeName,
              {
                isMutationPayload: true,
                isPgCreatePayloadType: true,
                pgTypeResource: resource,
              },
              () => ({
                assertStep: assertExecutableStep,
                description: `The output of our create \`${tableTypeName}\` mutation.`,
                fields: ({ fieldWithHooks }) => {
                  const TableType = build.getGraphQLTypeByPgCodec(
                    resource.codec,
                    "output",
                  ) as GraphQLOutputType | undefined;
                  const fieldBehaviorScope = `insert:resource:select`;
                  return {
                    clientMutationId: {
                      type: GraphQLString,
                      plan: EXPORTABLE(
                        (constant) =>
                          function plan($mutation: ObjectStep<any>) {
                            return (
                              $mutation.getStepForKey(
                                "clientMutationId",
                                true,
                              ) ?? constant(null)
                            );
                          },
                        [constant],
                      ),
                    },
                    ...(TableType &&
                    build.behavior.pgResourceMatches(
                      resource,
                      fieldBehaviorScope,
                    )
                      ? {
                          [tableFieldName]: fieldWithHooks(
                            {
                              fieldName: tableFieldName,
                              fieldBehaviorScope,
                            },
                            {
                              description: `The \`${tableTypeName}\` that was created by this mutation.`,
                              type: TableType,
                              plan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgInsertSingleStep;
                                    }>,
                                  ) {
                                    return $object.get("result");
                                  },
                                [],
                              ),
                              deprecationReason: tagToString(
                                resource.extensions?.tags?.deprecated,
                              ),
                            },
                          ),
                        }
                      : null),
                  };
                },
              }),
              `PgMutationCreatePlugin payload for ${resource.name}`,
            );
          });
        });

        return _;
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          inflection,
          graphql: { GraphQLNonNull },
        } = build;
        const {
          scope: { isRootMutation },
          fieldWithHooks,
        } = context;
        if (!isRootMutation) {
          return fields;
        }

        const insertableSources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((resource) => isInsertable(build, resource));
        return insertableSources.reduce((memo, resource) => {
          return build.recoverable(memo, () => {
            const createFieldName = inflection.createField(resource);
            const payloadTypeName = inflection.createPayloadType(resource);
            const payloadType = build.getOutputTypeByName(payloadTypeName);
            const mutationInputType = build.getInputTypeByName(
              inflection.createInputType(resource),
            );

            return build.extend(
              memo,
              {
                [createFieldName]: fieldWithHooks(
                  {
                    fieldName: createFieldName,
                    fieldBehaviorScope: "resource:insert",
                  },
                  {
                    args: {
                      input: {
                        type: new GraphQLNonNull(mutationInputType),
                        autoApplyAfterParentPlan: true,
                        applyPlan: EXPORTABLE(
                          () =>
                            function plan(
                              _: any,
                              $object: ObjectStep<{
                                result: PgInsertSingleStep;
                              }>,
                            ) {
                              return $object;
                            },
                          [],
                        ),
                      },
                    },
                    type: payloadType,
                    description: `Creates a single \`${inflection.tableType(
                      resource.codec,
                    )}\`.`,
                    deprecationReason: tagToString(
                      resource.extensions?.tags?.deprecated,
                    ),
                    plan: EXPORTABLE(
                      (object, pgInsertSingle, resource) =>
                        function plan(_: any, args: FieldArgs) {
                          const plan = object({
                            result: pgInsertSingle(
                              resource,
                              Object.create(null),
                            ),
                          });
                          args.apply(plan);
                          return plan;
                        },
                      [object, pgInsertSingle, resource],
                    ),
                  },
                ),
              },
              `Adding create mutation for ${resource.name}`,
            );
          });
        }, fields);
      },
    },
  },
};
