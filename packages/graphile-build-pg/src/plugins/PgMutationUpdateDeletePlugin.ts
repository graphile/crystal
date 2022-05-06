import type {
  PgClassSinglePlan,
  PgDeletePlan,
  PgSource,
  PgSourceUnique,
  PgTypeColumn,
  PgUpdatePlan,
} from "@dataplan/pg";
import { pgDelete, pgUpdate } from "@dataplan/pg";
import type {
  __InputObjectPlan,
  __TrackedObjectPlan,
  ExecutablePlan,
  InputPlan,
  TrackedArguments,
} from "dataplanner";
import { lambda, object, ObjectPlan } from "dataplanner";
import { EXPORTABLE, isSafeIdentifier } from "graphile-export";
import type { Plugin } from "graphile-plugin";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "graphql";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileBuild {
    interface ScopeGraphQLObjectType {
      isPgUpdatePayloadType?: boolean;
      isPgDeletePayloadType?: boolean;
      pgSource?: PgSource<any, any, any, any>;
    }

    interface ScopeGraphQLObjectTypeFieldsField {
      isPgMutationPayloadDeletedNodeIdField?: boolean;
    }

    interface ScopeGraphQLInputObjectType {
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

const isUpdatable = (source: PgSource<any, any, any, any>) => {
  if (source.parameters) return false;
  if (!source.codec.columns) return false;
  if (source.codec.isAnonymous) return false;
  if (!source.uniques || source.uniques.length < 1) return false;
  const behavior = getBehavior(source.extensions);
  if (behavior && !behavior.includes("update")) {
    return false;
  }
  return true;
};

const isDeletable = (source: PgSource<any, any, any, any>) => {
  if (source.parameters) return false;
  if (!source.codec.columns) return false;
  if (source.codec.isAnonymous) return false;
  if (!source.uniques || source.uniques.length < 1) return false;
  const behavior = getBehavior(source.extensions);
  if (behavior && !behavior.includes("delete")) {
    return false;
  }
  return true;
};

export const PgMutationUpdateDeletePlugin: Plugin = {
  name: "PgMutationUpdateDeletePlugin",
  description: "Adds 'update' and 'delete' mutations for supported sources",
  version: version,

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
          `update-${this._singularizedSourceName(source)}-by-${unique.columns
            .map((columnName) =>
              this.column({
                columnName,
                codec: source.codec,
                column: source.codec.columns[columnName],
              }),
            )
            .join("-and-")}`,
        );
      },
      updateByKeysInputType(options, details) {
        return this.upperCamelCase(`${this.updateByKeysField(details)}-input`);
      },

      deleteByKeysField(options, { source, unique }) {
        return this.camelCase(
          `delete-${this._singularizedSourceName(source)}-by-${unique.columns
            .map((columnName) =>
              this.column({
                columnName,
                codec: source.codec,
                column: source.codec.columns[columnName],
              }),
            )
            .join("-and-")}`,
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
              pgSource: source,
            },
            ObjectPlan,
            () => {
              return {
                description: build.wrapDescription(
                  `The output of our ${mode} \`${tableTypeName}\` mutation.`,
                  "type",
                ),
                fields: ({ fieldWithHooks }) => {
                  const tableName = inflection.tableFieldName(source);
                  // This should really be `-node-id` but for compatibility with PostGraphQL v3 we haven't made that change.
                  const deletedNodeIdFieldName = inflection.deletedNodeId({
                    source,
                  });
                  const TableType = build.getGraphQLTypeByPgCodec(
                    source.codec,
                    "output",
                  ) as GraphQLObjectType | undefined;
                  const handler = TableType
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
                    ...(mode === "update" && TableType
                      ? {
                          [tableName]: fieldWithHooks(
                            {
                              fieldName: tableName,
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
                                    $object: ObjectPlan<{
                                      result:
                                        | PgUpdatePlan<any, any, any>
                                        | PgDeletePlan<any, any, any>;
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
                    ...(mode === "delete" && handler && nodeIdCodec
                      ? {
                          [deletedNodeIdFieldName]: fieldWithHooks(
                            {
                              fieldName: deletedNodeIdFieldName,
                              isPgMutationPayloadDeletedNodeIdField: true,
                            },
                            () => {
                              return {
                                type: GraphQLID,
                                plan: EXPORTABLE(
                                  (handler, lambda, nodeIdCodec) =>
                                    function plan(
                                      $object: ObjectPlan<{
                                        result: PgClassSinglePlan<
                                          any,
                                          any,
                                          any,
                                          any
                                        >;
                                      }>,
                                    ) {
                                      const $record =
                                        $object.getPlanForKey("result");
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
                          plan: EXPORTABLE(
                            () =>
                              function plan(
                                $input: ObjectPlan<any>,
                                value: InputPlan,
                              ) {
                                $input.set("clientMutationId", value);
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
                                    column,
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
                              plan: EXPORTABLE(
                                () =>
                                  function plan(
                                    $object: ObjectPlan<{
                                      result: PgUpdatePlan<any, any, any>;
                                    }>,
                                  ) {
                                    const $record =
                                      $object.getPlanForKey("result");
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

        const updatableSources = build.input.pgSources.filter(isUpdatable);
        const deletableSources = build.input.pgSources.filter(isDeletable);

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
        if (!isRootMutation) {
          return fields;
        }

        const updatableSources = build.input.pgSources.filter(isUpdatable);
        const deletableSources = build.input.pgSources.filter(isDeletable);

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
                const mutationInputType =
                  build.getInputTypeByName(inputTypeName);

                const uniqueColumns = (unique.columns as string[]).map(
                  (columnName) => [
                    columnName,
                    inflection.column({
                      columnName,
                      codec: source.codec,
                      column: source.codec.columns[columnName],
                    }),
                  ],
                );

                /**
                 * If every column is a safe identifier then we can create an
                 * optimised function, otherwise we must play it safe and not
                 * do that.
                 */
                const clean = uniqueColumns.every(
                  ([columnName, fieldName]) =>
                    isSafeIdentifier(columnName) && isSafeIdentifier(fieldName),
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
                          `${columnName}: args.input.get(${JSON.stringify(
                            fieldName,
                          )})`,
                      )
                      .join(", ")} }`
                  : null;

                /**
                 * The fallback to `specFromArgsString`; builds a
                 * pgUpdate/pgDelete spec describing the row to update/delete.
                 */
                const specFromArgs = EXPORTABLE(
                  (uniqueColumns) => (args: TrackedArguments) => {
                    return uniqueColumns.reduce(
                      (memo, [columnName, fieldName]) => {
                        memo[columnName] = (
                          args.input as __TrackedObjectPlan | __InputObjectPlan
                        ).get(fieldName);
                        return memo;
                      },
                      {},
                    );
                  },
                  [uniqueColumns],
                );

                return build.extend(
                  fields,
                  {
                    [fieldName]: fieldWithHooks(
                      { fieldName },
                      {
                        args: {
                          input: {
                            type: new GraphQLNonNull(mutationInputType),
                            plan: EXPORTABLE(
                              () =>
                                function plan(
                                  _: any,
                                  $object: ObjectPlan<{
                                    result:
                                      | PgUpdatePlan<any, any, any>
                                      | PgDeletePlan<any, any, any>;
                                  }>,
                                ) {
                                  return $object;
                                },
                              [],
                            ),
                          },
                        },
                        type: payloadType,
                        plan:
                          mode === "update"
                            ? specFromArgsString
                              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                EXPORTABLE(
                                  new Function(
                                    "object",
                                    "pgUpdate",
                                    "source",
                                    `return (_$root, args) => object({result: pgUpdate(source, ${specFromArgsString})})`,
                                  ) as any,
                                  [object, pgUpdate, source],
                                )
                              : (EXPORTABLE(
                                  (object, pgUpdate, source, specFromArgs) =>
                                    function plan(
                                      _$root: ExecutablePlan,
                                      args: TrackedArguments,
                                    ) {
                                      return object({
                                        result: pgUpdate(
                                          source,
                                          specFromArgs(args),
                                        ),
                                      });
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
                                  `return (_$root, args) => object({result: pgDelete(source, ${specFromArgsString})})`,
                                ) as any,
                                [object, pgDelete, source],
                              )
                            : (EXPORTABLE(
                                (object, pgDelete, source, specFromArgs) =>
                                  function plan(
                                    _$root: ExecutablePlan,
                                    args: TrackedArguments,
                                  ) {
                                    return object({
                                      result: pgDelete(
                                        source,
                                        specFromArgs(args),
                                      ),
                                    });
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
