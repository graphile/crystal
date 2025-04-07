import "graphile-config";

import type {
  PgClassSingleStep,
  PgCodecWithAttributes,
  PgDeleteSingleQueryBuilder,
  PgDeleteSingleStep,
  PgResource,
  PgResourceUnique,
  PgUpdateSingleQueryBuilder,
  PgUpdateSingleStep,
} from "@dataplan/pg";
import { pgDeleteSingle, pgUpdateSingle } from "@dataplan/pg";
import type { ExecutableStep, FieldArgs, Maybe } from "grafast";
import {
  __InputObjectStep,
  __TrackedValueStep,
  lambda,
  object,
  ObjectStep,
  specFromNodeId,
} from "grafast";
import type { GraphQLFieldConfigMap, GraphQLObjectType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";
import te, { isSafeObjectPropertyName } from "tamedevil";

import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgMutationUpdateDeletePlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "constraint:resource:update": true;
      "constraint:resource:delete": true;
      "nodeId:resource:update": true;
      "nodeId:resource:delete": true;
      "update:resource:select": true;
      "delete:resource:nodeId": true;
      "delete:resource:select": true;
    }
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
  if (!resource.codec.attributes) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  if (!resource.uniques || resource.uniques.length < 1) return false;
  return !!build.behavior.pgResourceMatches(resource, "resource:update");
};

const isDeletable = (
  build: GraphileBuild.Build,
  resource: PgResource<any, any, any, any, any>,
) => {
  if (resource.parameters) return false;
  if (!resource.codec.attributes) return false;
  if (resource.codec.polymorphism) return false;
  if (resource.codec.isAnonymous) return false;
  if (!resource.uniques || resource.uniques.length < 1) return false;
  return !!build.behavior.pgResourceMatches(resource, "resource:delete");
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
          )}-by-${this._joinAttributeNames(resource.codec, unique.attributes)}`,
        );
      },
      updateByKeysInputType(options, details) {
        return this.upperCamelCase(`${this.updateByKeysField(details)}-input`);
      },

      deleteByKeysField(options, { resource, unique }) {
        return this.camelCase(
          `delete-${this._singularizedResourceName(
            resource,
          )}-by-${this._joinAttributeNames(resource.codec, unique.attributes)}`,
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
    behaviorRegistry: {
      add: {
        "constraint:resource:update": {
          description: "can update a record by this constraint",
          entities: ["pgResourceUnique"],
        },
        "constraint:resource:delete": {
          description: "can delete a record by this constraint",
          entities: ["pgResourceUnique"],
        },
        "nodeId:resource:update": {
          description: "can update a record by this nodeId",
          entities: ["pgResourceUnique"],
        },
        "nodeId:resource:delete": {
          description: "can delete a record by this nodeId",
          entities: ["pgResourceUnique"],
        },
        // TODO: should this exist?! Perhaps the `-nodeId` behavior should imply `-nodeId:*:*` in the behavior registry?
        "delete:resource:nodeId": {
          description: "can delete a record by its Node ID",
          entities: ["pgResource"],
        },
        "update:resource:select": {
          description:
            "can you select the record that was updated on the mutation payload?",
          entities: ["pgResource"],
        },
        "delete:resource:select": {
          description:
            "can you select the record that was deleted on the mutation payload?",
          entities: ["pgResource"],
        },
      },
    },
    entityBehavior: {
      pgResource: [
        "update",
        "delete",
        "update:resource:select",
        "delete:resource:nodeId",
        "-delete:resource:select",
      ],
      pgResourceUnique: ["update", "delete"],
    },

    hooks: {
      init(_, build) {
        const {
          inflection,
          graphql: { GraphQLString, GraphQLNonNull, GraphQLID },
        } = build;

        const process = (
          resource: PgResource<any, PgCodecWithAttributes, any, any, any>,
          mode: "resource:update" | "resource:delete",
        ) => {
          const modeText = mode === "resource:update" ? "update" : "delete";
          const tableTypeName = inflection.tableType(resource.codec);

          const payloadTypeName =
            mode === "resource:update"
              ? inflection.updatePayloadType({ resource })
              : inflection.deletePayloadType({ resource });

          // Payload type is shared (across the resource) independent of the keys used
          build.registerObjectType(
            payloadTypeName,
            {
              isMutationPayload: true,
              isPgUpdatePayloadType: mode === "resource:update",
              isPgDeletePayloadType: mode === "resource:delete",
              pgTypeResource: resource,
            },
            () => {
              return {
                assertStep: ObjectStep,
                description: build.wrapDescription(
                  `The output of our ${modeText} \`${tableTypeName}\` mutation.`,
                  "type",
                ),
                fields: ({ fieldWithHooks }) => {
                  const tableName = inflection.tableFieldName(resource);
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
                  const nodeIdCodec = handler?.codec;
                  const fieldBehaviorScope =
                    mode === "resource:update"
                      ? `update:resource:select`
                      : `delete:resource:select`;
                  return {
                    clientMutationId: {
                      description: build.wrapDescription(
                        "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
                        "field",
                      ),
                      type: GraphQLString,
                      plan: EXPORTABLE(
                        () =>
                          function plan(
                            $mutation: ObjectStep<{
                              result: PgUpdateSingleStep | PgDeleteSingleStep;
                            }>,
                          ) {
                            const $result = $mutation.getStepForKey("result");
                            return $result.getMeta("clientMutationId");
                          },
                        [],
                      ),
                    },
                    ...(TableType &&
                    build.behavior.pgResourceMatches(
                      resource,
                      fieldBehaviorScope,
                    )
                      ? {
                          [tableName]: fieldWithHooks(
                            {
                              fieldName: tableName,
                              fieldBehaviorScope,
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
                                        | PgUpdateSingleStep
                                        | PgDeleteSingleStep;
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
                    ...(mode === "resource:delete" &&
                    deletedNodeIdFieldName &&
                    handler &&
                    nodeIdCodec &&
                    build.behavior.pgCodecMatches(
                      resource.codec,
                      "type:node",
                    ) &&
                    build.behavior.pgResourceMatches(
                      resource,
                      "delete:resource:nodeId",
                    )
                      ? {
                          [deletedNodeIdFieldName]: fieldWithHooks(
                            {
                              fieldName: deletedNodeIdFieldName,
                              fieldBehaviorScope: "delete:resource:nodeId",
                              isPgMutationPayloadDeletedNodeIdField: true,
                            },
                            () => {
                              return {
                                type: GraphQLID,
                                plan: EXPORTABLE(
                                  (handler, lambda, nodeIdCodec) =>
                                    function plan(
                                      $object: ObjectStep<{
                                        result: PgClassSingleStep;
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

          const specs = getSpecs(build, resource, mode);
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
              if (!tablePatchName && mode === "resource:update") {
                return;
              }
              const inputTypeName =
                mode === "resource:update"
                  ? uniqueMode === "node"
                    ? inflection.updateNodeInputType(details)
                    : inflection.updateByKeysInputType(details)
                  : uniqueMode === "node"
                    ? inflection.deleteNodeInputType(details)
                    : inflection.deleteByKeysInputType(details);
              const fieldName =
                mode === "resource:update"
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
                  isPgUpdateInputType: mode === "resource:update",
                  isPgUpdateByKeysInputType:
                    mode === "resource:update" && uniqueMode === "keys",
                  isPgUpdateNodeInputType:
                    mode === "resource:update" && uniqueMode === "node",
                  isPgDeleteInputType: mode === "resource:delete",
                  isPgDeleteByKeysInputType:
                    mode === "resource:delete" && uniqueMode === "keys",
                  isPgDeleteNodeInputType:
                    mode === "resource:delete" && uniqueMode === "node",
                  pgResource: resource,
                  pgResourceUnique: unique,
                  isMutationInput: true,
                },
                () => {
                  return {
                    description: build.wrapDescription(
                      `All input for the \`${fieldName}\` mutation.`,
                      "type",
                    ),
                    fields() {
                      const TablePatch =
                        mode === "resource:update"
                          ? build.getInputTypeByName(tablePatchName!)!
                          : null;
                      return Object.assign(
                        {
                          clientMutationId: {
                            description: build.wrapDescription(
                              "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
                              "field",
                            ),
                            type: GraphQLString,
                            apply: EXPORTABLE(
                              () =>
                                function apply(
                                  qb:
                                    | PgUpdateSingleQueryBuilder
                                    | PgDeleteSingleQueryBuilder,
                                  val: string | null,
                                ) {
                                  qb.setMeta("clientMutationId", val);
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
                            : (unique.attributes as string[]).reduce(
                                (memo, attributeName) => {
                                  const attribute =
                                    resource.codec.attributes[attributeName];
                                  memo[
                                    inflection.attribute({
                                      attributeName,
                                      codec: resource.codec,
                                    })
                                  ] = {
                                    description: attribute.description,
                                    type: new GraphQLNonNull(
                                      build.getGraphQLTypeByPgCodec(
                                        attribute.codec,
                                        "input",
                                      )!,
                                    ),
                                  };
                                  return memo;
                                },
                                Object.create(null),
                              )),
                        },
                        mode === "resource:update" && TablePatch
                          ? {
                              [inflection.patchField(
                                inflection.tableFieldName(resource),
                              )]: {
                                description: build.wrapDescription(
                                  `An object where the defined keys will be set on the \`${tableTypeName}\` being ${modeText}d.`,
                                  "field",
                                ),
                                type: new GraphQLNonNull(TablePatch!),
                                apply: EXPORTABLE(
                                  () =>
                                    function plan(
                                      qb: PgUpdateSingleQueryBuilder,
                                      arg: any,
                                    ) {
                                      if (arg != null) {
                                        return qb.setBuilder();
                                      }
                                    },
                                  [],
                                ),
                              },
                            }
                          : null,
                      );
                    },
                  };
                },
                `Creating ${mode} input by ${uniqueMode} for ${unique.attributes.join(
                  ",",
                )} of ${resource} from PgMutationUpdateDeletePlugin`,
              );
            });
          }
        };

        const allResources = Object.values(
          build.input.pgRegistry.pgResources,
        ) as PgResource<any, any, any, any, any>[];
        const updatableResources = allResources.filter(
          (
            resource,
          ): resource is PgResource<
            any,
            PgCodecWithAttributes,
            any,
            any,
            any
          > => isUpdatable(build, resource),
        );
        const deletableResources = allResources.filter(
          (
            resource,
          ): resource is PgResource<
            any,
            PgCodecWithAttributes,
            any,
            any,
            any
          > => isDeletable(build, resource),
        );

        updatableResources.forEach((resource) => {
          process(resource, "resource:update");
        });

        deletableResources.forEach((resource) => {
          process(resource, "resource:delete");
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
          mode: "resource:update" | "resource:delete",
        ) => {
          for (const resource of resources) {
            const payloadTypeName =
              mode === "resource:update"
                ? inflection.updatePayloadType({ resource })
                : inflection.deletePayloadType({ resource });
            const specs = getSpecs(build, resource, mode);
            for (const spec of specs) {
              const { uniqueMode, unique } = spec;
              const details = {
                resource,
                unique,
              };
              fields = build.recoverable(fields, () => {
                const fieldName =
                  mode === "resource:update"
                    ? uniqueMode === "node"
                      ? inflection.updateNodeField(details)
                      : inflection.updateByKeysField(details)
                    : uniqueMode === "node"
                      ? inflection.deleteNodeField(details)
                      : inflection.deleteByKeysField(details);
                const inputTypeName =
                  mode === "resource:update"
                    ? uniqueMode === "node"
                      ? inflection.updateNodeInputType(details)
                      : inflection.updateByKeysInputType(details)
                    : uniqueMode === "node"
                      ? inflection.deleteNodeInputType(details)
                      : inflection.deleteByKeysInputType(details);

                const fieldBehaviorScope =
                  uniqueMode === "node"
                    ? `nodeId:${mode}`
                    : `constraint:${mode}`;

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

                const uniqueAttributes = (unique.attributes as string[]).map(
                  (attributeName) => [
                    attributeName,
                    inflection.attribute({
                      attributeName,
                      codec: resource.codec,
                    }),
                  ],
                );

                /**
                 * If every attribute is a safe identifier then we can create an
                 * optimised function, otherwise we must play it safe and not
                 * do that.
                 */
                const clean =
                  uniqueMode === "keys" &&
                  uniqueAttributes.every(
                    ([attributeName, fieldName]) =>
                      isSafeObjectPropertyName(attributeName) &&
                      isSafeObjectPropertyName(fieldName),
                  );

                /**
                 * Builds a pgUpdateSingle/pgDeleteSingle spec describing the row to
                 * update/delete as a string containing raw JS code if it's
                 * safe to do so. This enables us to create an optimised
                 * function for the plan resolver, especially good for the
                 * exported schema.
                 */
                const specFromArgsString = clean
                  ? te`{ ${te.join(
                      uniqueAttributes.map(
                        ([attributeName, fieldName]) =>
                          te`${te.safeKeyOrThrow(
                            attributeName,
                          )}: args.getRaw(['input', ${te.lit(fieldName)}])`,
                      ),
                      ", ",
                    )} }`
                  : null;

                const tableTypeName = inflection.tableType(resource.codec);
                const handler = build.getNodeIdHandler
                  ? build.getNodeIdHandler(tableTypeName)
                  : null;

                if (uniqueMode !== "keys" && !handler) {
                  return fields;
                }

                /**
                 * The fallback to `specFromArgsString`; builds a
                 * pgUpdateSingle/pgDeleteSingle spec describing the row to update/delete.
                 */
                const specFromArgs =
                  uniqueMode === "keys"
                    ? EXPORTABLE(
                        (uniqueAttributes) => (args: FieldArgs) => {
                          return uniqueAttributes.reduce(
                            (memo, [attributeName, fieldName]) => {
                              memo[attributeName] = args.getRaw([
                                "input",
                                fieldName,
                              ]);
                              return memo;
                            },
                            Object.create(null),
                          );
                        },
                        [uniqueAttributes],
                        `specFromArgs_${tableTypeName}`,
                      )
                    : EXPORTABLE(
                        (handler, nodeIdFieldName, specFromNodeId) =>
                          (args: FieldArgs) => {
                            const $nodeId = args.getRaw([
                              "input",
                              nodeIdFieldName,
                            ]) as ExecutableStep<Maybe<string>>;
                            return specFromNodeId(handler!, $nodeId);
                          },
                        [handler, nodeIdFieldName, specFromNodeId],
                        `specFromArgs_${handler!.typeName}`,
                      );

                return build.extend(
                  fields,
                  {
                    [fieldName]: fieldWithHooks(
                      { fieldName, fieldBehaviorScope },
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
                                      | PgUpdateSingleStep
                                      | PgDeleteSingleStep;
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
                          mode === "resource:update" ? "Updates" : "Deletes"
                        } a single \`${inflection.tableType(
                          resource.codec,
                        )}\` ${
                          uniqueMode === "keys"
                            ? "using a unique key"
                            : "using its globally unique id"
                        }${mode === "resource:update" ? " and a patch" : ""}.`,
                        deprecationReason: tagToString(
                          resource.extensions?.tags?.deprecated,
                        ),
                        plan:
                          mode === "resource:update"
                            ? specFromArgsString
                              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                EXPORTABLE(
                                  te.run`\
return function(object, pgUpdateSingle, resource) {
return (_$root, args) => {
  const $update = pgUpdateSingle(resource, ${specFromArgsString});
  args.apply($update);
  return object({ result: $update });
}
}` as any,
                                  [object, pgUpdateSingle, resource],
                                )
                              : (EXPORTABLE(
                                  (
                                    object,
                                    pgUpdateSingle,
                                    resource,
                                    specFromArgs,
                                  ) =>
                                    function plan(
                                      _$root: ExecutableStep,
                                      args: FieldArgs,
                                    ) {
                                      const $update = pgUpdateSingle(
                                        resource,
                                        specFromArgs(args),
                                      );
                                      args.apply($update);
                                      return object({
                                        result: $update,
                                      });
                                    },
                                  [
                                    object,
                                    pgUpdateSingle,
                                    resource,
                                    specFromArgs,
                                  ],
                                ) as any)
                            : specFromArgsString
                              ? // eslint-disable-next-line graphile-export/exhaustive-deps
                                EXPORTABLE(
                                  te.run`\
return function (object, pgDeleteSingle, resource) {
return (_$root, args) => {
  const $delete = pgDeleteSingle(resource, ${specFromArgsString});
  args.apply($delete);
  return object({ result: $delete });
}
}` as any,
                                  [object, pgDeleteSingle, resource],
                                )
                              : (EXPORTABLE(
                                  (
                                    object,
                                    pgDeleteSingle,
                                    resource,
                                    specFromArgs,
                                  ) =>
                                    function plan(
                                      _$root: ExecutableStep,
                                      args: FieldArgs,
                                    ) {
                                      const $delete = pgDeleteSingle(
                                        resource,
                                        specFromArgs(args),
                                      );
                                      args.apply($delete);
                                      return object({
                                        result: $delete,
                                      });
                                    },
                                  [
                                    object,
                                    pgDeleteSingle,
                                    resource,
                                    specFromArgs,
                                  ],
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
          process(fields, updatableSources, "resource:update"),
          deletableSources,
          "resource:delete",
        );
      },
    },
  },
};

function getSpecs(
  build: GraphileBuild.Build,
  resource: PgResource<any, PgCodecWithAttributes, any, any, any>,
  mode: "resource:update" | "resource:delete",
) {
  const primaryUnique = resource.uniques.find(
    (u: PgResourceUnique) => u.isPrimary,
  );
  const constraintMode = `constraint:${mode}` as const;
  const specs = [
    ...(primaryUnique &&
    build.getNodeIdCodec !== undefined &&
    build.behavior.pgCodecMatches(resource.codec, `nodeId:${mode}` as const)
      ? [{ unique: primaryUnique, uniqueMode: "node" }]
      : []),
    ...resource.uniques
      .filter((unique: PgResourceUnique) => {
        return build.behavior.pgResourceUniqueMatches(
          [resource, unique],
          constraintMode,
        );
      })
      .map((unique: PgResourceUnique) => ({
        unique,
        uniqueMode: "keys",
      })),
  ];
  return specs;
}
