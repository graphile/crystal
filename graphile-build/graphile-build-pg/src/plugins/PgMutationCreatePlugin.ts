import "graphile-config";

import type { PgInsertStep, PgResource } from "@dataplan/pg";
import { pgInsert } from "@dataplan/pg";
import type { FieldArgs, ObjectStep } from "grafast";
import { constant, ExecutableStep, object } from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLOutputType } from "graphql";

import { getBehavior } from "../behavior.js";
import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
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
  if (!resource.codec.columns) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  const behavior = getBehavior([
    resource.codec.extensions,
    resource.extensions,
  ]);
  return build.behavior.matches(behavior, "source:insert", "insert") === true;
};

export const PgMutationCreatePlugin: GraphileConfig.Plugin = {
  name: "PgMutationCreatePlugin",
  description: "Adds 'create' mutation for supported table-like sources",
  version: version,
  after: ["smart-tags"],

  inflection: {
    add: {
      createField(options, source) {
        return this.camelCase(`create-${this.tableType(source.codec)}`);
      },
      createInputType(options, source) {
        return this.upperCamelCase(`${this.createField(source)}-input`);
      },
      createPayloadType(options, source) {
        return this.upperCamelCase(`${this.createField(source)}-payload`);
      },
      tableFieldName(options, source) {
        return this.camelCase(`${this.tableType(source.codec)}`);
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const {
          inflection,
          graphql: { GraphQLString, GraphQLNonNull },
        } = build;
        const insertableSources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((source) => isInsertable(build, source));

        insertableSources.forEach((source) => {
          build.recoverable(null, () => {
            const tableTypeName = inflection.tableType(source.codec);
            const inputTypeName = inflection.createInputType(source);
            const tableFieldName = inflection.tableFieldName(source);
            build.registerInputObjectType(
              inputTypeName,
              { isMutationInput: true },
              () => ({
                description: `All input for the create \`${tableTypeName}\` mutation.`,
                fields: ({ fieldWithHooks }) => {
                  const TableInput = build.getGraphQLTypeByPgCodec(
                    source.codec,
                    "input",
                  );
                  return {
                    clientMutationId: {
                      type: GraphQLString,
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
                              applyPlan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgInsertStep<any>;
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
              `PgMutationCreatePlugin input for ${source.name}`,
            );

            const payloadTypeName = inflection.createPayloadType(source);
            const behavior = getBehavior([
              source.codec.extensions,
              source.extensions,
            ]);
            build.registerObjectType(
              payloadTypeName,
              {
                isMutationPayload: true,
                // TODO: isPgCreatePayloadType: true,
                pgTypeResource: source,
              },
              ExecutableStep as any,
              () => ({
                description: `The output of our create \`${tableTypeName}\` mutation.`,
                fields: ({ fieldWithHooks }) => {
                  const TableType = build.getGraphQLTypeByPgCodec(
                    source.codec,
                    "output",
                  ) as GraphQLOutputType | undefined;
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
                    build.behavior.matches(
                      behavior,
                      "insert:payload:record",
                      "record",
                    )
                      ? {
                          [tableFieldName]: fieldWithHooks(
                            {
                              fieldName: tableFieldName,
                              fieldBehaviorScope: `insert:payload:record`,
                            },
                            {
                              description: `The \`${tableTypeName}\` that was created by this mutation.`,
                              type: TableType,
                              plan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgInsertStep<any>;
                                    }>,
                                  ) {
                                    return $object.get("result");
                                  },
                                [],
                              ),
                              deprecationReason: tagToString(
                                source.extensions?.tags?.deprecated,
                              ),
                            },
                          ),
                        }
                      : null),
                  };
                },
              }),
              `PgMutationCreatePlugin payload for ${source.name}`,
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
        ).filter((source) => isInsertable(build, source));
        return insertableSources.reduce((memo, source) => {
          return build.recoverable(memo, () => {
            const createFieldName = inflection.createField(source);
            const payloadTypeName = inflection.createPayloadType(source);
            const payloadType = build.getOutputTypeByName(payloadTypeName);
            const mutationInputType = build.getInputTypeByName(
              inflection.createInputType(source),
            );

            return build.extend(
              memo,
              {
                [createFieldName]: fieldWithHooks(
                  {
                    fieldName: createFieldName,
                    fieldBehaviorScope: "source:insert",
                  },
                  {
                    args: {
                      input: {
                        type: new GraphQLNonNull(mutationInputType),
                        applyPlan: EXPORTABLE(
                          () =>
                            function plan(
                              _: any,
                              $object: ObjectStep<{
                                result: PgInsertStep<any>;
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
                      source.codec,
                    )}\`.`,
                    deprecationReason: tagToString(
                      source.extensions?.tags?.deprecated,
                    ),
                    plan: EXPORTABLE(
                      (object, pgInsert, source) =>
                        function plan(_: any, args: FieldArgs) {
                          const plan = object({
                            result: pgInsert(source, Object.create(null)),
                          });
                          args.apply(plan);
                          return plan;
                        },
                      [object, pgInsert, source],
                    ),
                  },
                ),
              },
              `Adding create mutation for ${source.name}`,
            );
          });
        }, fields);
      },
    },
  },
};
