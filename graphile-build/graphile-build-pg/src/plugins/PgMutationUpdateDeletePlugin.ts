import "graphile-config";

import type {
  PgClassSingleStep,
  PgDeleteStep,
  PgResource,
  PgResourceUnique,
  PgTypeColumn,
  PgUpdateStep,
} from "@dataplan/pg";
import { pgDelete, pgUpdate } from "@dataplan/pg";
import type { ExecutableStep, FieldArgs } from "grafast";
import {
  __InputObjectStep,
  __TrackedObjectStep,
  lambda,
  object,
  ObjectStep,
  specFromNodeId,
} from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";
import te, { isSafeObjectPropertyName } from "tamedevil";

import { getBehavior } from "../behavior.js";
import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface ScopeObject {
      isPgUpdatePayloadType?: boolean;
      isPgDeletePayloadType?: boolean;
      pgTypeResource?: PgResource<any, any, any, any, any>;
    }

    interface ScopeObjectFieldsField {
      isPgMutationPayloadDeletedNodeIdField?: boolean;
    }

    interface ScopeInputObject {
      isPgUpdateInputType?: boolean;
      isPgUpdateByKeysInputType?: boolean;
      isPgUpdateNodeInputType?: boolean;
      isPgDeleteInputType?: boolean;
      isPgDeleteByKeysInputType?: boolean;
      isPgDeleteNodeInputType?: boolean;
      pgResource?: PgResource<any, any, any, any, any>;
      pgResourceUnique?: PgResourceUnique;
    }

    interface Inflection {
      updatePayloadType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
        },
      ): string;
      deletePayloadType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
        },
      ): string;

      updateNodeField(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;
      updateNodeInputType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;

      deletedNodeId(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
        },
      ): string;

      deleteNodeField(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;
      deleteNodeInputType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;

      updateByKeysField(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;
      updateByKeysInputType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;

      deleteByKeysField(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;
      deleteByKeysInputType(
        this: Inflection,
        details: {
          resource: PgResource<any, any, any, any, any>;
          unique: PgResourceUnique;
        },
      ): string;

      patchField(this: Inflection, fieldName: string): string;
    }
  }
}

const isUpdatable = (
  build: GraphileBuild.Build,
  resource: PgResource<any, any, any, any, any>,
) => {
  if (resource.parameters) return false;
  if (!resource.codec.columns) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  if (!resource.uniques || resource.uniques.length < 1) return false;
  const behavior = getBehavior([
    resource.codec.extensions,
    resource.extensions,
  ]);
  return !!build.behavior.matches(behavior, "source:update", "update");
};

const isDeletable = (
  build: GraphileBuild.Build,
  resource: PgResource<any, any, any, any, any>,
) => {
  if (resource.parameters) return false;
  if (!resource.codec.columns) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  if (!resource.uniques || resource.uniques.length < 1) return false;
  const behavior = getBehavior([
    resource.codec.extensions,
    resource.extensions,
  ]);
  return !!build.behavior.matches(behavior, "source:delete", "delete");
};

export const PgMutationUpdateDeletePlugin: GraphileConfig.Plugin = {
  name: "PgMutationUpdateDeletePlugin",
  description: "Adds 'update' and 'delete' mutations for supported sources",
  version: version,
  after: ["smart-tags", "PgTablesPlugin", "PgCodecsPlugin", "PgTypesPlugin"],

  inflection: {
    add: {
      updatePayloadType(options, { resource }) {
        return this.upperCamelCase(
          `update-${this._singularizedResourceName(resource)}-payload`,
        );
      },
      deletePayloadType(options, { resource }) {
        return this.upperCamelCase(
          `delete-${this._singularizedResourceName(resource)}-payload`,
        );
      },

      updateNodeField(options, { resource, unique: _unique }) {
        return this.camelCase(
          `update-${this._singularizedResourceName(resource)}`,
        );
      },
      updateNodeInputType(options, details) {
        return this.upperCamelCase(`${this.updateNodeField(details)}-input`);
      },

      deletedNodeId(options, { resource }) {
        return this.camelCase(
          `deleted-${this._singularizedResourceName(
            resource,
          )}-${this.nodeIdFieldName()}`,
        );
      },

      deleteNodeField(options, { resource, unique: _unique }) {
        return this.camelCase(
          `delete-${this._singularizedResourceName(resource)}`,
        );
      },
      deleteNodeInputType(options, details) {
        return this.upperCamelCase(`${this.deleteNodeField(details)}-input`);
      },

      updateByKeysField(options, { resource, unique }) {
        return this.camelCase(
          `update-${this._singularizedResourceName(
            resource,
          )}-by-${this._joinColumnNames(resource.codec, unique.columns)}`,
        );
      },
      updateByKeysInputType(options, details) {
        return this.upperCamelCase(`${this.updateByKeysField(details)}-input`);
      },

      deleteByKeysField(options, { resource, unique }) {
        return this.camelCase(
          `delete-${this._singularizedResourceName(
            resource,
          )}-by-${this._joinColumnNames(resource.codec, unique.columns)}`,
        );
      },
      deleteByKeysInputType(options, details) {
        return this.upperCamelCase(`${this.deleteByKeysField(details)}-input`);
      },

      patchField(options, fieldName) {
        return this.camelCase(`${fieldName}-patch`);
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const {
          inflection,
          graphql: { GraphQLString, GraphQLNonNull, GraphQLID },
        } = build;

        const process = (
          resource: PgResource<any, any, any, any, any>,
          mode: "source:update" | "source:delete",
        ) => {
          const modeText = mode === "source:update" ? "update" : "delete";
          const tableTypeName = inflection.tableType(resource.codec);

          const payloadTypeName =
            mode === "source:update"
              ? inflection.updatePayloadType({ resource })
              : inflection.deletePayloadType({ resource });

          // Payload type is shared independent of the keys used
          build.registerObjectType(
            payloadTypeName,
            {
              isMutationPayload: true,
              isPgUpdatePayloadType: mode === "source:update",
              isPgDeletePayloadType: mode === "source:delete",
              pgTypeResource: resource,
            },
            ObjectStep,
            () => {
              return {
                description: build.wrapDescription(
                  `The output of our ${modeText} \`${tableTypeName}\` mutation.`,
                  "type",
                ),
                fields: ({ fieldWithHooks }) => {
                  const tableName = inflection.tableFieldName(resource);
                  const behavior = getBehavior([
                    resource.codec.extensions,
                    resource.extensions,
                  ]);
                  const deletedNodeIdFieldName =
                    build.getNodeIdHandler !== undefined
                      ? inflection.deletedNodeId({
                          resource,
                        })
                      : null;
                  const TableType = build.getGraphQLTypeByPgCodec(
                    resource.codec,
                    "output",
                  ) as GraphQLObjectType | undefined;
                  const handler =
                    TableType && build.getNodeIdHandler
                      ? build.getNodeIdHandler(TableType.name)
                      : null;
                  const nodeIdCodec = handler
                    ? build.getNodeIdCodec(handler.codecName)
                    : null;
                  return {
                    clientMutationId: {
                      description: build.wrapDescription(
                        "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
                        "field",
                      ),
                      type: GraphQLString,
                    },
                    // TODO: default to `...(mode === "source:update" && TableType`; we only want the record on delete for v4 compatibility
                    ...(TableType
                      ? {
                          [tableName]: fieldWithHooks(
                            {
                              fieldName: tableName,
                              fieldBehaviorScope: `update:payload:record`,
                            },
                            () => ({
                              description: build.wrapDescription(
                                `The \`${tableTypeName}\` that was ${modeText}d by this mutation.`,
                                "field",
                              ),
                              type: TableType,
                              plan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result:
                                        | PgUpdateStep<any>
                                        | PgDeleteStep<any>;
                                    }>,
                                  ) {
                                    return $object.get("result");
                                  },
                                [],
                              ),
                            }),
                          ),
                        }
                      : {}),
                    ...(mode === "source:delete" &&
                    deletedNodeIdFieldName &&
                    handler &&
                    nodeIdCodec &&
                    build.behavior.matches(behavior, "node", "node")
                      ? {
                          [deletedNodeIdFieldName]: fieldWithHooks(
                            {
                              fieldName: deletedNodeIdFieldName,
                              // TODO: fieldBehaviorScope: `...`,
                              isPgMutationPayloadDeletedNodeIdField: true,
                            },
                            () => {
                              return {
                                type: GraphQLID,
                                plan: EXPORTABLE(
                                  (handler, lambda, nodeIdCodec) =>
                                    function plan(
                                      $object: ObjectStep<{
                                        result: PgClassSingleStep<any>;
                                      }>,
                                    ) {
                                      const $record =
                                        $object.getStepForKey("result");
                                      const specifier = handler.plan($record);
                                      return lambda(
                                        specifier,
                                        nodeIdCodec.encode,
                                      );
                                    },
                                  [handler, lambda, nodeIdCodec],
                                ),
                              };
                            },
                          ),
                        }
                      : null),
                  };
                },
              };
            },
            `Creating ${mode} payload for ${resource} from PgMutationUpdateDeletePlugin`,
          );

          const primaryUnique = resource.uniques.find(
            (u: PgResourceUnique) => u.isPrimary,
          );
          const specs = [
            ...(primaryUnique && build.getNodeIdCodec !== undefined
              ? [{ unique: primaryUnique, uniqueMode: "node" }]
              : []),
            ...resource.uniques.map((unique: PgResourceUnique) => ({
              unique,
              uniqueMode: "keys",
            })),
          ];
          for (const spec of specs) {
            const { uniqueMode, unique } = spec;
            const details = {
              resource,
              unique,
            };
            if (uniqueMode === "node" && !build.getNodeIdHandler) {
              continue;
            }
            build.recoverable(null, () => {
              const tablePatchName = build.getGraphQLTypeNameByPgCodec(
                resource.codec,
                "patch",
              );
              if (!tablePatchName && mode === "source:update") {
                return;
              }
              const inputTypeName =
                mode === "source:update"
                  ? uniqueMode === "node"
                    ? inflection.updateNodeInputType(details)
                    : inflection.updateByKeysInputType(details)
                  : uniqueMode === "node"
                  ? inflection.deleteNodeInputType(details)
                  : inflection.deleteByKeysInputType(details);
              const fieldName =
                mode === "source:update"
                  ? uniqueMode === "node"
                    ? inflection.updateNodeField(details)
                    : inflection.updateByKeysField(details)
                  : uniqueMode === "node"
                  ? inflection.deleteNodeField(details)
                  : inflection.deleteByKeysField(details);
              const nodeIdFieldName =
                uniqueMode === "node" ? inflection.nodeIdFieldName() : null;

              build.registerInputObjectType(
                inputTypeName,
                {
                  isPgUpdateInputType: mode === "source:update",
                  isPgUpdateByKeysInputType:
                    mode === "source:update" && uniqueMode === "keys",
                  isPgUpdateNodeInputType:
                    mode === "source:update" && uniqueMode === "node",
                  isPgDeleteInputType: mode === "source:delete",
                  isPgDeleteByKeysInputType:
                    mode === "source:delete" && uniqueMode === "keys",
                  isPgDeleteNodeInputType:
                    mode === "source:delete" && uniqueMode === "node",
                  pgResource: resource,
                  pgResourceUnique: unique,
                  isMutationInput: true,
                },
                () => {
                  const TablePatch =
                    mode === "source:update"
                      ? build.getInputTypeByName(tablePatchName!)!
                      : null;
                  return {
                    description: build.wrapDescription(
                      `All input for the \`${fieldName}\` mutation.`,
                      "type",
                    ),
                    fields: Object.assign(
                      {
                        clientMutationId: {
                          description: build.wrapDescription(
                            "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
                            "field",
                          ),
                          type: GraphQLString,
                          applyPlan: EXPORTABLE(
                            () =>
                              function plan(
                                $input: ObjectStep<any>,
                                val: FieldArgs,
                              ) {
                                $input.set("clientMutationId", val.get());
                              },
                            [],
                          ),
                        },
                        ...(uniqueMode === "node"
                          ? {
                              [nodeIdFieldName!]: {
                                description: build.wrapDescription(
                                  `The globally unique \`ID\` which will identify a single \`${tableTypeName}\` to be ${modeText}d.`,
                                  "field",
                                ),
                                type: new GraphQLNonNull(GraphQLID),
                              },
                            }
                          : (unique.columns as string[]).reduce(
                              (memo, columnName) => {
                                const column = resource.codec.columns[
                                  columnName
                                ] as PgTypeColumn;
                                memo[
                                  inflection.column({
                                    columnName,
                                    codec: resource.codec,
                                  })
                                ] = {
                                  description: column.description,
                                  type: new GraphQLNonNull(
                                    build.getGraphQLTypeByPgCodec(
                                      column.codec,
                                      "input",
                                    )!,
                                  ),
                                };
                                return memo;
                              },
                              Object.create(null),
                            )),
                      },
                      mode === "source:update"
                        ? {
                            [inflection.patchField(
                              inflection.tableFieldName(resource),
                            )]: {
                              description: build.wrapDescription(
                                `An object where the defined keys will be set on the \`${tableTypeName}\` being ${modeText}d.`,
                                "field",
                              ),
                              type: new GraphQLNonNull(TablePatch!),
                              applyPlan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgUpdateStep<any>;
                                    }>,
                                  ) {
                                    const $record =
                                      $object.getStepForKey("result");
                                    return $record.setPlan();
                                  },
                                [],
                              ),
                            },
                          }
                        : null,
                    ),
                  };
                },
                `Creating ${mode} input by ${uniqueMode} for ${unique.columns.join(
                  ",",
                )} of ${resource} from PgMutationUpdateDeletePlugin`,
              );
            });
          }
        };

        const allResources = Object.values(build.input.pgRegistry.pgResources);
        const updatableResources = allResources.filter((resource) =>
          isUpdatable(build, resource),
        );
        const deletableResources = allResources.filter((resource) =>
          isDeletable(build, resource),
        );

        updatableResources.forEach((resource) => {
          process(resource, "source:update");
        });

        deletableResources.forEach((resource) => {
          process(resource, "source:delete");
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
        const nodeIdFieldName = build.inflection.nodeIdFieldName?.();
        if (!isRootMutation) {
          return fields;
        }

        const allSources = Object.values(build.input.pgRegistry.pgResources);
        const updatableSources = allSources.filter((resource) =>
          isUpdatable(build, resource),
        );
        const deletableSources = allSources.filter((resource) =>
          isDeletable(build, resource),
        );

        const process = (
          fields: GraphQLFieldConfigMap<any, any>,
          resources: PgResource<any, any, any, any, any>[],
          mode: "source:update" | "source:delete",
        ) => {
          const modeShort = mode === "source:update" ? "update" : "delete";
          for (const resource of resources) {
            const payloadTypeName =
              mode === "source:update"
                ? inflection.updatePayloadType({ resource })
                : inflection.deletePayloadType({ resource });
            const primaryUnique = resource.uniques.find(
              (u: PgResourceUnique) => u.isPrimary,
            );
            const constraintMode = `constraint:${mode}`;
            const specs = [
              ...(primaryUnique && !!build.getNodeIdHandler
                ? [{ unique: primaryUnique, uniqueMode: "node" }]
                : []),
              ...resource.uniques.map((unique: PgResourceUnique) => ({
                unique,
                uniqueMode: "keys",
              })),
            ].filter((spec) => {
              const unique = spec.unique as PgResourceUnique;
              const behavior = getBehavior([
                resource.codec.extensions,
                resource.extensions,
                unique.extensions,
              ]);
              return !!build.behavior.matches(
                behavior,
                constraintMode,
                modeShort,
              );
            });
            for (const spec of specs) {
              const { uniqueMode, unique } = spec;
              const details = {
                resource,
                unique,
              };
              fields = build.recoverable(fields, () => {
                const fieldName =
                  mode === "source:update"
                    ? uniqueMode === "node"
                      ? inflection.updateNodeField(details)
                      : inflection.updateByKeysField(details)
                    : uniqueMode === "node"
                    ? inflection.deleteNodeField(details)
                    : inflection.deleteByKeysField(details);
                const inputTypeName =
                  mode === "source:update"
                    ? uniqueMode === "node"
                      ? inflection.updateNodeInputType(details)
                      : inflection.updateByKeysInputType(details)
                    : uniqueMode === "node"
                    ? inflection.deleteNodeInputType(details)
                    : inflection.deleteByKeysInputType(details);

                const payloadType = build.getOutputTypeByName(payloadTypeName);
                const mutationInputType = build.getTypeByName(inputTypeName);
                if (!mutationInputType) {
                  return fields;
                }
                if (!build.graphql.isInputObjectType(mutationInputType)) {
                  throw new Error(
                    `Expected '${inputTypeName}' to be an input object type`,
                  );
                }

                const uniqueColumns = (unique.columns as string[]).map(
                  (columnName) => [
                    columnName,
                    inflection.column({
                      columnName,
                      codec: resource.codec,
                    }),
                  ],
                );

                /**
                 * If every column is a safe identifier then we can create an
                 * optimised function, otherwise we must play it safe and not
                 * do that.
                 */
                const clean =
                  uniqueMode === "keys" &&
                  uniqueColumns.every(
                    ([columnName, fieldName]) =>
                      isSafeObjectPropertyName(columnName) &&
                      isSafeObjectPropertyName(fieldName),
                  );

                /**
                 * Builds a pgUpdate/pgDelete spec describing the row to
                 * update/delete as a string containing raw JS code if it's
                 * safe to do so. This enables us to create an optimised
                 * function for the plan resolver, especially good for the
                 * exported schema.
                 */
                const specFromArgsString = clean
                  ? te`{ ${te.join(
                      uniqueColumns.map(
                        ([columnName, fieldName]) =>
                          te`${te.dangerousKey(
                            columnName,
                          )}: args.get(['input', ${te.lit(fieldName)}])`,
                      ),
                      ", ",
                    )} }`
                  : null;

                const tableTypeName = inflection.tableType(resource.codec);
                const handler = build.getNodeIdHandler
                  ? build.getNodeIdHandler(tableTypeName)
                  : null;
                const codec = handler
                  ? build.getNodeIdCodec(handler.codecName)
                  : null;

                if (uniqueMode !== "keys" && (!codec || !handler)) {
                  return fields;
                }

                /**
                 * The fallback to `specFromArgsString`; builds a
                 * pgUpdate/pgDelete spec describing the row to update/delete.
                 */
                const specFromArgs =
                  uniqueMode === "keys"
                    ? EXPORTABLE(
                        (uniqueColumns) => (args: FieldArgs) => {
                          return uniqueColumns.reduce(
                            (memo, [columnName, fieldName]) => {
                              memo[columnName] = args.get(["input", fieldName]);
                              return memo;
                            },
                            Object.create(null),
                          );
                        },
                        [uniqueColumns],
                      )
                    : EXPORTABLE(
                        (codec, handler, nodeIdFieldName, specFromNodeId) =>
                          (args: FieldArgs) => {
                            const $nodeId = args.get([
                              "input",
                              nodeIdFieldName,
                            ]);
                            return specFromNodeId(codec!, handler!, $nodeId);
                          },
                        [codec, handler, nodeIdFieldName, specFromNodeId],
                      );

                return build.extend(
                  fields,
                  {
                    [fieldName]: fieldWithHooks(
                      { fieldName, fieldBehaviorScope: constraintMode },
                      {
                        args: {
                          input: {
                            type: new GraphQLNonNull(mutationInputType),
                            applyPlan: EXPORTABLE(
                              () =>
                                function plan(
                                  _: any,
                                  $object: ObjectStep<{
                                    result:
                                      | PgUpdateStep<any>
                                      | PgDeleteStep<any>;
                                  }>,
                                ) {
                                  return $object;
                                },
                              [],
                            ),
                          },
                        },
                        type: payloadType,
                        description: `${
                          mode === "source:update" ? "Updates" : "Deletes"
                        } a single \`${inflection.tableType(
                          resource.codec,
                        )}\` ${
                          uniqueMode === "keys"
                            ? "using a unique key"
                            : "using its globally unique id"
                        }${mode === "source:update" ? " and a patch" : ""}.`,
                        deprecationReason: tagToString(
                          resource.extensions?.tags?.deprecated,
                        ),
                        plan:
                          mode === "source:update"
                            ? specFromArgsString
                              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                EXPORTABLE(
                                  te.run`\
return function(object, pgUpdate, resource) {
return (_$root, args) => {
  const plan = object({ result: pgUpdate(resource, ${specFromArgsString}) });
  args.apply(plan);
  return plan;
}
}` as any,
                                  [object, pgUpdate, resource],
                                )
                              : (EXPORTABLE(
                                  (object, pgUpdate, resource, specFromArgs) =>
                                    function plan(
                                      _$root: ExecutableStep,
                                      args: FieldArgs,
                                    ) {
                                      const plan = object({
                                        result: pgUpdate(
                                          resource,
                                          specFromArgs(args),
                                        ),
                                      });
                                      args.apply(plan);
                                      return plan;
                                    },
                                  [object, pgUpdate, resource, specFromArgs],
                                ) as any)
                            : specFromArgsString
                            ? // eslint-disable-next-line graphile-export/exhaustive-deps
                              EXPORTABLE(
                                te.run`\
return function (object, pgDelete, resource) {
return (_$root, args) => {
  const plan = object({ result: pgDelete(resource, ${specFromArgsString}) });
  args.apply(plan);
  return plan;
}
}` as any,
                                [object, pgDelete, resource],
                              )
                            : (EXPORTABLE(
                                (object, pgDelete, resource, specFromArgs) =>
                                  function plan(
                                    _$root: ExecutableStep,
                                    args: FieldArgs,
                                  ) {
                                    const plan = object({
                                      result: pgDelete(
                                        resource,
                                        specFromArgs(args),
                                      ),
                                    });
                                    args.apply(plan);
                                    return plan;
                                  },
                                [object, pgDelete, resource, specFromArgs],
                              ) as any),
                      },
                    ),
                  },
                  `Adding ${mode} mutation for ${resource}`,
                );
              });
            }
          }
          return fields;
        };

        return process(
          process(fields, updatableSources, "source:update"),
          deletableSources,
          "source:delete",
        );
      },
    },
  },
};
