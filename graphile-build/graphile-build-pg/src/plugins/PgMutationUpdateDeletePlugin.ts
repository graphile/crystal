import "graphile-config";

import type {
  PgClassSingleStep,
  PgDeleteStep,
  PgSource,
  PgSourceUnique,
  PgTypeColumn,
  PgUpdateStep,
} from "@dataplan/pg";
import { pgDelete, pgUpdate } from "@dataplan/pg";
import type { ExecutableStep, FieldArgs } from "grafast";
import {
  __InputObjectStep,
  __TrackedObjectStep,
  evalSafeProperty,
  isSafeObjectPropertyName,
  lambda,
  object,
  ObjectStep,
  specFromNodeId,
} from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import { tagToString } from "../utils.js";

declare global {
  namespace GraphileBuild {
    interface ScopeObject {
      isPgUpdatePayloadType?: boolean;
      isPgDeletePayloadType?: boolean;
      pgTypeSource?: PgSource<any, any, any, any>;
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
      pgSource?: PgSource<any, any, any, any>;
      pgSourceUnique?: PgSourceUnique;
    }

    interface Inflection {
      updatePayloadType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
        },
      ): string;
      deletePayloadType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
        },
      ): string;

      updateNodeField(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;
      updateNodeInputType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;

      deletedNodeId(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
        },
      ): string;

      deleteNodeField(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;
      deleteNodeInputType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;

      updateByKeysField(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;
      updateByKeysInputType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;

      deleteByKeysField(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;
      deleteByKeysInputType(
        this: Inflection,
        details: {
          source: PgSource<any, any, any, any>;
          unique: PgSourceUnique;
        },
      ): string;

      patchField(this: Inflection, fieldName: string): string;
    }
  }
}

const isUpdatable = (
  build: GraphileBuild.Build,
  source: PgSource<any, any, any, any>,
) => {
  if (source.parameters) return false;
  if (!source.codec.columns) return false;
  if (source.codec.polymorphism) return false;
  if (source.codec.isAnonymous) return false;
  if (!source.uniques || source.uniques.length < 1) return false;
  const behavior = getBehavior(source.extensions);
  return !!build.behavior.matches(behavior, "update", "update");
};

const isDeletable = (
  build: GraphileBuild.Build,
  source: PgSource<any, any, any, any>,
) => {
  if (source.parameters) return false;
  if (!source.codec.columns) return false;
  if (source.codec.polymorphism) return false;
  if (source.codec.isAnonymous) return false;
  if (!source.uniques || source.uniques.length < 1) return false;
  const behavior = getBehavior(source.extensions);
  return !!build.behavior.matches(behavior, "delete", "delete");
};

export const PgMutationUpdateDeletePlugin: GraphileConfig.Plugin = {
  name: "PgMutationUpdateDeletePlugin",
  description: "Adds 'update' and 'delete' mutations for supported sources",
  version: version,
  after: ["smart-tags"],

  inflection: {
    add: {
      updatePayloadType(options, { source }) {
        return this.upperCamelCase(
          `update-${this._singularizedSourceName(source)}-payload`,
        );
      },
      deletePayloadType(options, { source }) {
        return this.upperCamelCase(
          `delete-${this._singularizedSourceName(source)}-payload`,
        );
      },

      updateNodeField(options, { source, unique: _unique }) {
        return this.camelCase(`update-${this._singularizedSourceName(source)}`);
      },
      updateNodeInputType(options, details) {
        return this.upperCamelCase(`${this.updateNodeField(details)}-input`);
      },

      deletedNodeId(options, { source }) {
        return this.camelCase(
          `deleted-${this._singularizedSourceName(
            source,
          )}-${this.nodeIdFieldName()}`,
        );
      },

      deleteNodeField(options, { source, unique: _unique }) {
        return this.camelCase(`delete-${this._singularizedSourceName(source)}`);
      },
      deleteNodeInputType(options, details) {
        return this.upperCamelCase(`${this.deleteNodeField(details)}-input`);
      },

      updateByKeysField(options, { source, unique }) {
        return this.camelCase(
          `update-${this._singularizedSourceName(
            source,
          )}-by-${this._joinColumnNames(source.codec, unique.columns)}`,
        );
      },
      updateByKeysInputType(options, details) {
        return this.upperCamelCase(`${this.updateByKeysField(details)}-input`);
      },

      deleteByKeysField(options, { source, unique }) {
        return this.camelCase(
          `delete-${this._singularizedSourceName(
            source,
          )}-by-${this._joinColumnNames(source.codec, unique.columns)}`,
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
          source: PgSource<any, any, any, any>,
          mode: "update" | "delete",
        ) => {
          const tableTypeName = inflection.tableType(source.codec);

          const payloadTypeName =
            mode === "update"
              ? inflection.updatePayloadType({ source })
              : inflection.deletePayloadType({ source });

          // Payload type is shared independent of the keys used
          build.registerObjectType(
            payloadTypeName,
            {
              isMutationPayload: true,
              isPgUpdatePayloadType: mode === "update",
              isPgDeletePayloadType: mode === "delete",
              pgTypeSource: source,
            },
            ObjectStep,
            () => {
              return {
                description: build.wrapDescription(
                  `The output of our ${mode} \`${tableTypeName}\` mutation.`,
                  "type",
                ),
                fields: ({ fieldWithHooks }) => {
                  const tableName = inflection.tableFieldName(source);
                  const behavior = getBehavior([
                    source.codec.extensions,
                    source.extensions,
                  ]);
                  const deletedNodeIdFieldName = inflection.deletedNodeId({
                    source,
                  });
                  const TableType = build.getGraphQLTypeByPgCodec(
                    source.codec,
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
                    // TODO: default to `...(mode === "update" && TableType`; we only want the record on delete for v4 compatibility
                    ...(TableType
                      ? {
                          [tableName]: fieldWithHooks(
                            {
                              fieldName: tableName,
                              fieldBehaviorScope: `update:payload:record`,
                            },
                            () => ({
                              description: build.wrapDescription(
                                `The \`${tableTypeName}\` that was ${mode}d by this mutation.`,
                                "field",
                              ),
                              type: TableType,
                              plan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result:
                                        | PgUpdateStep<any, any, any>
                                        | PgDeleteStep<any, any, any>;
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
                    ...(mode === "delete" &&
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
                                        result: PgClassSingleStep<
                                          any,
                                          any,
                                          any,
                                          any
                                        >;
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
            `Creating ${mode} payload for ${source} from PgMutationUpdateDeletePlugin`,
          );

          const primaryUnique = source.uniques.find(
            (u: PgSourceUnique) => u.isPrimary,
          );
          const specs = [
            ...(primaryUnique
              ? [{ unique: primaryUnique, uniqueMode: "node" }]
              : []),
            ...source.uniques.map((unique: PgSourceUnique) => ({
              unique,
              uniqueMode: "keys",
            })),
          ];
          for (const spec of specs) {
            const { uniqueMode, unique } = spec;
            const details = {
              source,
              unique,
            };
            build.recoverable(null, () => {
              const tablePatchName = build.getGraphQLTypeNameByPgCodec(
                source.codec,
                "patch",
              );
              if (!tablePatchName && mode === "update") {
                return;
              }
              const inputTypeName =
                mode === "update"
                  ? uniqueMode === "node"
                    ? inflection.updateNodeInputType(details)
                    : inflection.updateByKeysInputType(details)
                  : uniqueMode === "node"
                  ? inflection.deleteNodeInputType(details)
                  : inflection.deleteByKeysInputType(details);
              const fieldName =
                mode === "update"
                  ? uniqueMode === "node"
                    ? inflection.updateNodeField(details)
                    : inflection.updateByKeysField(details)
                  : uniqueMode === "node"
                  ? inflection.deleteNodeField(details)
                  : inflection.deleteByKeysField(details);
              const nodeIdFieldName = inflection.nodeIdFieldName();

              build.registerInputObjectType(
                inputTypeName,
                {
                  isPgUpdateInputType: mode === "update",
                  isPgUpdateByKeysInputType:
                    mode === "update" && uniqueMode === "keys",
                  isPgUpdateNodeInputType:
                    mode === "update" && uniqueMode === "node",
                  isPgDeleteInputType: mode === "delete",
                  isPgDeleteByKeysInputType:
                    mode === "delete" && uniqueMode === "keys",
                  isPgDeleteNodeInputType:
                    mode === "delete" && uniqueMode === "node",
                  pgSource: source,
                  pgSourceUnique: unique,
                  isMutationInput: true,
                },
                () => {
                  const TablePatch =
                    mode === "update"
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
                              [nodeIdFieldName]: {
                                description: build.wrapDescription(
                                  `The globally unique \`ID\` which will identify a single \`${tableTypeName}\` to be ${mode}d.`,
                                  "field",
                                ),
                                type: new GraphQLNonNull(GraphQLID),
                              },
                            }
                          : (unique.columns as string[]).reduce(
                              (memo, columnName) => {
                                const column = source.codec.columns[
                                  columnName
                                ] as PgTypeColumn;
                                memo[
                                  inflection.column({
                                    columnName,
                                    codec: source.codec,
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
                              {},
                            )),
                      },
                      mode === "update"
                        ? {
                            [inflection.patchField(
                              inflection.tableFieldName(source),
                            )]: {
                              description: build.wrapDescription(
                                `An object where the defined keys will be set on the \`${tableTypeName}\` being ${mode}d.`,
                                "field",
                              ),
                              type: new GraphQLNonNull(TablePatch!),
                              applyPlan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectStep<{
                                      result: PgUpdateStep<any, any, any>;
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
                )} of ${source} from PgMutationUpdateDeletePlugin`,
              );
            });
          }
        };

        const updatableSources = build.input.pgSources.filter((source) =>
          isUpdatable(build, source),
        );
        const deletableSources = build.input.pgSources.filter((source) =>
          isDeletable(build, source),
        );

        updatableSources.forEach((source) => {
          process(source, "update");
        });

        deletableSources.forEach((source) => {
          process(source, "delete");
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

        const updatableSources = build.input.pgSources.filter((source) =>
          isUpdatable(build, source),
        );
        const deletableSources = build.input.pgSources.filter((source) =>
          isDeletable(build, source),
        );

        const process = (
          fields: GraphQLFieldConfigMap<any, any>,
          sources: PgSource<any, any, any, any>[],
          mode: "update" | "delete",
        ) => {
          for (const source of sources) {
            const payloadTypeName =
              mode === "update"
                ? inflection.updatePayloadType({ source })
                : inflection.deletePayloadType({ source });
            const primaryUnique = source.uniques.find(
              (u: PgSourceUnique) => u.isPrimary,
            );
            const specs = [
              ...(primaryUnique
                ? [{ unique: primaryUnique, uniqueMode: "node" }]
                : []),
              ...source.uniques.map((unique: PgSourceUnique) => ({
                unique,
                uniqueMode: "keys",
              })),
            ];
            for (const spec of specs) {
              const { uniqueMode, unique } = spec;
              const details = {
                source,
                unique,
              };
              fields = build.recoverable(fields, () => {
                const fieldName =
                  mode === "update"
                    ? uniqueMode === "node"
                      ? inflection.updateNodeField(details)
                      : inflection.updateByKeysField(details)
                    : uniqueMode === "node"
                    ? inflection.deleteNodeField(details)
                    : inflection.deleteByKeysField(details);
                const inputTypeName =
                  mode === "update"
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
                      codec: source.codec,
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
                  ? `{ ${uniqueColumns
                      .map(
                        ([columnName, fieldName]) =>
                          `${evalSafeProperty(
                            columnName,
                          )}: args.get(['input', ${JSON.stringify(
                            fieldName,
                          )}])`,
                      )
                      .join(", ")} }`
                  : null;

                const tableTypeName = inflection.tableType(source.codec);
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
                      { fieldName, fieldBehaviorScope: mode },
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
                                      | PgUpdateStep<any, any, any>
                                      | PgDeleteStep<any, any, any>;
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
                          mode === "update" ? "Updates" : "Deletes"
                        } a single \`${inflection.tableType(source.codec)}\` ${
                          uniqueMode === "keys"
                            ? "using a unique key"
                            : "using its globally unique id"
                        }${mode === "update" ? " and a patch" : ""}.`,
                        deprecationReason: tagToString(
                          source.extensions?.tags?.deprecated,
                        ),
                        plan:
                          mode === "update"
                            ? specFromArgsString
                              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                EXPORTABLE(
                                  new Function(
                                    "object",
                                    "pgUpdate",
                                    "source",
                                    `\
return (_$root, args) => {
  const plan = object({result: pgUpdate(source, ${specFromArgsString})});
  args.apply(plan);
  return plan;
}`,
                                  ) as any,
                                  [object, pgUpdate, source],
                                )
                              : (EXPORTABLE(
                                  (object, pgUpdate, source, specFromArgs) =>
                                    function plan(
                                      _$root: ExecutableStep,
                                      args: FieldArgs,
                                    ) {
                                      const plan = object({
                                        result: pgUpdate(
                                          source,
                                          specFromArgs(args),
                                        ),
                                      });
                                      args.apply(plan);
                                      return plan;
                                    },
                                  [object, pgUpdate, source, specFromArgs],
                                ) as any)
                            : specFromArgsString
                            ? // eslint-disable-next-line graphile-export/exhaustive-deps
                              EXPORTABLE(
                                new Function(
                                  "object",
                                  "pgDelete",
                                  "source",
                                  `\
return (_$root, args) => {
  const plan = object({result: pgDelete(source, ${specFromArgsString})});
  args.apply(plan);
  return plan
}`,
                                ) as any,
                                [object, pgDelete, source],
                              )
                            : (EXPORTABLE(
                                (object, pgDelete, source, specFromArgs) =>
                                  function plan(
                                    _$root: ExecutableStep,
                                    args: FieldArgs,
                                  ) {
                                    const plan = object({
                                      result: pgDelete(
                                        source,
                                        specFromArgs(args),
                                      ),
                                    });
                                    args.apply(plan);
                                    return plan;
                                  },
                                [object, pgDelete, source, specFromArgs],
                              ) as any),
                      },
                    ),
                  },
                  `Adding ${mode} mutation for ${source}`,
                );
              });
            }
          }
          return fields;
        };

        return process(
          process(fields, updatableSources, "update"),
          deletableSources,
          "delete",
        );
      },
    },
  },
};
