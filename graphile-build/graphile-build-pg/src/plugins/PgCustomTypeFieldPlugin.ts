// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import "./PgProceduresPlugin.js";
import "graphile-config";

import type {
  PgClassExpressionStep,
  PgClassSingleStep,
  PgCodec,
  PgDeleteSingleStep,
  PgInsertSingleStep,
  PgResource,
  PgResourceParameter,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  PgSelectQueryBuilder,
  PgTypedStep,
  PgUpdateSingleStep,
} from "@dataplan/pg";
import {
  pgClassExpression,
  pgFromExpression,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  PgSelectStep,
  TYPES,
} from "@dataplan/pg";
import type {
  __InputObjectStep,
  __TrackedValueStep,
  ExecutableStep,
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  GrafastFieldConfig,
  GrafastInputFieldConfigMap,
  Maybe,
} from "grafast";
import {
  __ListTransformStep,
  bakedInput,
  connection,
  constant,
  object,
  ObjectStep,
  stepAMayDependOnStepB,
} from "grafast";
import type { GraphQLInputType, GraphQLOutputType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { tagToString } from "../utils.js";
import { version } from "../version.js";

const $$rootQuery = Symbol("PgCustomTypeFieldPluginRootQuerySources");
const $$rootMutation = Symbol("PgCustomTypeFieldPluginRootMutationSources");
const $$computed = Symbol("PgCustomTypeFieldPluginComputedSources");

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgCustomTypeFieldPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      queryField: true;
      mutationField: true;
      typeField: true;
      "typeField:resource:connection": true;
      "typeField:resource:list": true;
      "typeField:resource:array": true;
      "queryField:resource:connection": true;
      "queryField:resource:list": true;
      "queryField:resource:array": true;
      "typeField:single": true;
      "queryField:single": true;
    }
    interface Build {
      pgGetArgDetailsFromParameters(
        resource: PgResource<any, any, any, any, any>,
        parameters?: readonly PgResourceParameter[],
      ): {
        makeFieldArgs(): {
          [graphqlArgName: string]: {
            type: GraphQLInputType;
            description?: string;
          };
        };
        makeArgs(args: FieldArgs, path?: string[]): PgSelectArgumentSpec[];
        argDetails: Array<{
          graphqlArgName: string;
          postgresArgName: string | null;
          pgCodec: PgCodec;
          inputType: GraphQLInputType;
          required: boolean;
        }>;
      };
    }

    interface InflectionCustomFieldProcedureDetails {
      resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
    }
    interface InflectionCustomFieldArgumentDetails {
      resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
      param: PgResourceParameter;
      index: number;
    }
    interface InflectionCustomFieldMutationResult {
      resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
      returnGraphQLTypeName: string;
    }

    interface Inflection {
      _functionName(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customMutationField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customMutationPayload(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customMutationInput(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customQueryField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customQueryConnectionField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customQueryListField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedAttributeField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedAttributeConnectionField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedAttributeListField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      argument(
        this: Inflection,
        details: InflectionCustomFieldArgumentDetails,
      ): string;
      recordFunctionConnectionType(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      scalarFunctionConnectionType(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      recordFunctionEdgeType(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      scalarFunctionEdgeType(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      functionMutationResultFieldName(
        this: Inflection,
        details: InflectionCustomFieldMutationResult,
      ): string;
    }
    interface SchemaOptions {
      pgFunctionsPreferNodeId?: boolean;
    }
  }
}

function shouldUseCustomConnection(
  pgResource: PgResource<any, any, any, any, any>,
): boolean {
  const { codec } = pgResource;
  // 'setof <scalar>' functions should use a connection based on the function name, not a generic connection
  const setOrArray = !pgResource.isUnique || !!codec.arrayOfCodec;
  const scalarOrAnonymous = !codec.attributes || !!codec.isAnonymous;
  return setOrArray && scalarOrAnonymous;
}

function defaultProcSourceBehavior(
  s: PgResource<any, any, any, any, any>,
): GraphileBuild.BehaviorString {
  const behavior: GraphileBuild.BehaviorString[] = ["-array"];
  const firstParameter = (
    s as PgResource<any, any, any, readonly PgResourceParameter[], any>
  ).parameters[0];
  if (
    !s.isMutation &&
    s.parameters &&
    // Don't default to this being a queryField if it looks like a computed attribute function
    (!firstParameter?.codec?.attributes ||
      firstParameter?.codec?.extensions?.isTableLike === false ||
      firstParameter?.extensions?.variant === "nodeId")
  ) {
    behavior.push("queryField");
  } else {
    behavior.push("-queryField");
  }

  if (s.isMutation && s.parameters) {
    behavior.push("mutationField");
  } else {
    behavior.push("-mutationField");
  }

  if (
    s.parameters &&
    !s.isMutation &&
    firstParameter?.codec?.attributes &&
    firstParameter.extensions?.variant !== "nodeId"
  ) {
    behavior.push("typeField");
  } else {
    behavior.push("-typeField");
  }

  if (s.parameters && !s.isUnique) {
    const canUseConnection =
      !s.sqlPartitionByIndex && !s.isList && !s.codec.arrayOfCodec;
    if (!canUseConnection) {
      behavior.push("-connection", "-list", "array");
    }
  }

  return behavior.join(" ") as GraphileBuild.BehaviorString;
}

function hasRecord(
  $row: ExecutableStep,
): $row is
  | PgSelectSingleStep
  | PgInsertSingleStep
  | PgUpdateSingleStep
  | PgDeleteSingleStep {
  return "record" in $row && typeof ($row as any).record === "function";
}

declare global {
  namespace GraphileBuild {
    interface Build {
      [$$rootQuery]: Array<PgResource<any, any, any, any, any>>;
      [$$rootMutation]: Array<PgResource<any, any, any, any, any>>;
      [$$computed]: Map<
        PgCodec<any, any, any, any, any, any, any>,
        Array<PgResource<any, any, any, any, any>>
      >;
    }
  }
}

export const PgCustomTypeFieldPlugin: GraphileConfig.Plugin = {
  name: "PgCustomTypeFieldPlugin",
  description:
    "Adds GraphQL fields based on PostgreSQL functions (in PostGraphile v4 these were called 'custom query functions', 'custom mutation functions' and 'computed column functions'",
  version: version,

  inflection: {
    add: {
      _functionName(options, details) {
        return details.resource.extensions?.tags?.name ?? details.resource.name;
      },
      customMutationField(options, details) {
        return this.camelCase(this._functionName(details));
      },
      customMutationPayload(options, details) {
        return this.upperCamelCase(this._functionName(details) + "-payload");
      },
      customMutationInput(options, details) {
        return this.inputType(this.upperCamelCase(this._functionName(details)));
      },
      customQueryField(options, details) {
        return this.camelCase(this._functionName(details));
      },
      customQueryConnectionField(options, details) {
        return this.connectionField(this.customQueryField(details));
      },
      customQueryListField(options, details) {
        return this.listField(this.camelCase(this.customQueryField(details)));
      },
      computedAttributeField(options, details) {
        const explicitName = details.resource.extensions?.tags?.fieldName;
        if (typeof explicitName === "string") {
          return explicitName;
        }
        const name =
          details.resource.extensions?.pg?.name ?? details.resource.name;
        const codecName =
          details.resource.parameters[0].codec.extensions?.pg?.name ??
          details.resource.parameters[0].codec.name;
        const legacyPrefix = codecName + "_";
        if (name.startsWith(legacyPrefix)) {
          return this.camelCase(name.slice(legacyPrefix.length));
        } else {
          return this.camelCase(name);
        }
      },
      computedAttributeConnectionField(options, details) {
        return this.connectionField(this.computedAttributeField(details));
      },
      computedAttributeListField(options, details) {
        return this.listField(this.computedAttributeField(details));
      },
      argument(options, details) {
        return this.coerceToGraphQLName(
          this.camelCase(details.param.name || `arg${details.index}`),
        );
      },
      recordFunctionConnectionType(options, details) {
        return this.connectionType(
          this.upperCamelCase(this._functionName(details)),
        );
      },
      scalarFunctionConnectionType(options, details) {
        return this.connectionType(
          this.upperCamelCase(this._functionName(details)),
        );
      },
      recordFunctionEdgeType(options, details) {
        return this.edgeType(this.upperCamelCase(this._functionName(details)));
      },
      scalarFunctionEdgeType(options, details) {
        return this.edgeType(this.upperCamelCase(this._functionName(details)));
      },
      functionMutationResultFieldName(_options, details) {
        return details.resource.extensions?.tags?.resultFieldName ?? "result";
      },
    },
  },

  schema: {
    behaviorRegistry: {
      add: {
        queryField: {
          description: 'a "custom query function"',
          entities: ["pgResource"],
        },
        mutationField: {
          description: 'a "custom mutation function"',
          entities: ["pgResource"],
        },
        typeField: {
          description:
            'a "custom field function" - add it to a specific type (aka "computed column")',
          entities: ["pgResource"],
        },
        "typeField:resource:connection": {
          description: "",
          entities: ["pgResource"],
        },
        "typeField:resource:list": {
          description: "",
          entities: ["pgResource"],
        },
        "typeField:resource:array": {
          description: "",
          entities: ["pgResource"],
        },
        "queryField:resource:connection": {
          description: "",
          entities: ["pgResource"],
        },
        "queryField:resource:list": {
          description: "",
          entities: ["pgResource"],
        },
        "queryField:resource:array": {
          description: "",
          entities: ["pgResource"],
        },
        "typeField:single": {
          description: "",
          entities: ["pgResource"],
        },
        "queryField:single": {
          description: "",
          entities: ["pgResource"],
        },
      },
    },
    entityBehavior: {
      pgResource: {
        inferred(behavior, entity) {
          if (entity.parameters) {
            return [behavior, defaultProcSourceBehavior(entity)];
          } else {
            return behavior;
          }
        },
      },
    },
    hooks: {
      build: {
        callback(build) {
          build[$$rootQuery] = [];
          build[$$rootMutation] = [];
          build[$$computed] = new Map();
          const {
            graphql: { GraphQLID, GraphQLList, GraphQLNonNull, isInputType },
            options: { pgFunctionsPreferNodeId },
          } = build;
          build.pgGetArgDetailsFromParameters = (
            resource,
            parameters = resource.parameters,
          ) => {
            const finalBuild = build as GraphileBuild.Build;
            const argDetails = parameters.map((param, index) => {
              const argName = finalBuild.inflection.argument({
                param,
                resource,
                index,
              });
              const paramBaseCodec = param.codec.arrayOfCodec ?? param.codec;
              const variant =
                param.extensions?.variant ??
                (pgFunctionsPreferNodeId &&
                !resource.isMutation &&
                param.codec.attributes &&
                finalBuild.behavior.pgCodecMatches(param.codec, "type:node")
                  ? "nodeId"
                  : "input");
              if (variant === "nodeId" && !param.codec.attributes) {
                throw new Error(
                  `Argument is marked as nodeId, but it doesn't seem to be a record type. Lists of nodeIds are not yet supported.`,
                );
              }
              const baseInputType =
                variant === "nodeId"
                  ? GraphQLID
                  : finalBuild.getGraphQLTypeByPgCodec!(
                      paramBaseCodec,
                      variant,
                    );
              if (variant === "nodeId" && !finalBuild.nodeIdSpecForCodec) {
                // ERRORS: tell them how to turn the nodeId variant off
                throw new Error(
                  `Argument is configured to use nodeId variant, but build is not configured with Node support - there is no 'build.nodeFetcherByTypeName'. Did you skip NodePlugin?`,
                );
              }
              const getSpec =
                variant === "nodeId"
                  ? finalBuild.nodeIdSpecForCodec(paramBaseCodec)
                  : null;
              if (variant === "nodeId" && !getSpec) {
                // ERRORS: tell them how to turn the nodeId variant off
                throw new Error(
                  `Argument is configured to use nodeId variant, but we don't know how to get the spec for codec '${paramBaseCodec.name}'`,
                );
              }
              const codecResource =
                variant === "nodeId"
                  ? finalBuild.pgTableResource(paramBaseCodec)
                  : null;
              if (variant === "nodeId" && !codecResource) {
                // ERRORS: tell them how to turn the nodeId variant off
                throw new Error(
                  `Argument is configured to use nodeId variant, but we couldn't find a suitable resource to pull a '${paramBaseCodec.name}' record from`,
                );
              }
              const fetcher =
                getSpec && codecResource
                  ? EXPORTABLE(
                      (codecResource, getSpec) =>
                        ($nodeId: ExecutableStep<Maybe<string>>) =>
                          codecResource.get(getSpec($nodeId)),
                      [codecResource, getSpec],
                    )
                  : null;
              if (!baseInputType) {
                const hint =
                  variant === "input"
                    ? ' (perhaps you used "-insert" behavior instead of "-resource:insert")'
                    : "";
                // ERRORS: convert this to a diagnostic
                throw new Error(
                  `Failed to find a suitable type for argument codec '${param.codec.name}' variant '${variant}'${hint}; not adding function field for '${resource}'`,
                );
              }
              if (!isInputType(baseInputType)) {
                // ERRORS: convert this to a diagnostic
                throw new Error(
                  `Variant '${variant}' for codec '${param.codec.name}' returned type '${baseInputType}', but that's not an input type so we cannot use it for an argument; not adding function field for '${resource}'`,
                );
              }

              // Not necessarily a list type... Need to rename this
              // variable.
              const listType = param.codec.arrayOfCodec
                ? new GraphQLList(baseInputType)
                : baseInputType;

              const inputType =
                param.notNull && param.required
                  ? new GraphQLNonNull(listType)
                  : listType;
              return {
                graphqlArgName: argName,
                postgresArgName: param.name,
                pgCodec: param.codec,
                inputType,
                required: param.required,
                fetcher,
              };
            });

            // Not used for isMutation; that's handled elsewhere.
            // This is a factory because we don't want mutations to one set
            // of args to affect the others!
            const makeFieldArgs = () =>
              argDetails.reduce(
                (memo, { inputType, graphqlArgName }) => {
                  memo[graphqlArgName] = {
                    type: inputType,
                  };
                  return memo;
                },
                Object.create(null) as {
                  [graphqlArgName: string]: { type: GraphQLInputType };
                },
              );

            const argDetailsSimple = argDetails.map(
              ({
                graphqlArgName,
                pgCodec,
                required,
                postgresArgName,
                fetcher,
              }) => ({
                graphqlArgName,
                postgresArgName,
                pgCodec,
                required,
                fetcher,
              }),
            );
            let indexAfterWhichAllArgsAreNamed = 0;
            const argDetailsLength = argDetails.length;
            for (let i = 0; i < argDetailsLength; i++) {
              if (!argDetails[i].postgresArgName) {
                indexAfterWhichAllArgsAreNamed = i + 1;
              }
            }

            const makeArgs = EXPORTABLE(
              (argDetailsSimple, bakedInput) =>
                (args: FieldArgs, path: string[] = []) =>
                  argDetailsSimple.map((details, i): PgSelectArgumentSpec => {
                    const {
                      graphqlArgName,
                      postgresArgName,
                      pgCodec,
                      fetcher,
                    } = details;
                    const fullPath = [...path, graphqlArgName];
                    const $raw = args.getRaw(fullPath) as __TrackedValueStep;
                    const step = fetcher
                      ? (
                          fetcher(
                            $raw as ExecutableStep<Maybe<string>>,
                          ) as PgSelectSingleStep
                        ).record()
                      : bakedInput(args.typeAt(fullPath), $raw);

                    return {
                      step,
                      pgCodec,
                      name: postgresArgName ?? undefined,
                    };
                  }),
              [argDetailsSimple, bakedInput],
            );

            return {
              argDetails,
              makeArgs,
              makeFieldArgs,
            };
          };

          return build;
        },
      },
      init: {
        after: ["PgCodecs"],
        callback(_, build) {
          const {
            graphql: { GraphQLList, GraphQLString, getNamedType },
            inflection,
            options,
            pgGetArgDetailsFromParameters,
          } = build;

          // Loop through all the sources and add them to the relevant
          // collection(s) on build. Note that if we have an error creating a
          // payload type for a mutation (for example) then that mutation
          // should not be added - it would not make sense to add the mutation
          // anyway but using the previously declared mutation payload for a
          // different field - this is why we later use this information in the
          // fields hook to determine which fields to add.
          for (const someSource of Object.values(
            build.input.pgRegistry.pgResources,
          )) {
            build.recoverable(null, () => {
              // Add connection type for functions that need it
              const isFunctionSourceRequiringConnection =
                someSource.parameters &&
                !someSource.isMutation &&
                !someSource.codec.arrayOfCodec &&
                shouldUseCustomConnection(someSource);

              if (isFunctionSourceRequiringConnection) {
                const resource = someSource as PgResource<
                  any,
                  any,
                  any,
                  readonly PgResourceParameter[],
                  any
                >;
                const connectionTypeName = resource.codec.attributes
                  ? inflection.recordFunctionConnectionType({
                      resource,
                    })
                  : inflection.scalarFunctionConnectionType({
                      resource,
                    });
                const edgeTypeName = resource.codec.attributes
                  ? inflection.recordFunctionEdgeType({ resource })
                  : inflection.scalarFunctionEdgeType({ resource });
                const typeName = resource.codec.attributes
                  ? inflection.tableType(resource.codec)
                  : build.getGraphQLTypeNameByPgCodec(resource.codec, "output");
                if (typeName) {
                  build.registerCursorConnection({
                    connectionTypeName,
                    edgeTypeName,
                    typeName,
                    scope: {
                      isPgConnectionRelated: true,
                      pgCodec: resource.codec,
                    },
                    // When dealing with scalars, nulls are allowed in setof
                    nonNullNode: resource.codec.attributes
                      ? options.pgForbidSetofFunctionsToReturnNull
                      : false,
                  });
                } else {
                  // Skip this entirely
                  throw new Error(
                    `Could not find a type for codec ${resource}'s codec`,
                  );
                }
              }

              // "custom query"
              // Find non-mutation function sources that don't accept a row type
              // as the first argument
              const isQuerySource =
                someSource.parameters &&
                build.behavior.pgResourceMatches(someSource, "queryField");
              if (isQuerySource) {
                build.recoverable(null, () => {
                  build[$$rootQuery].push(someSource);
                });
              }

              // "custom mutation"
              // Find mutation function sources
              const isMutationProcSource =
                // someSource.isMutation &&
                someSource.parameters &&
                build.behavior.pgResourceMatches(someSource, "mutationField");
              // Add payload type for mutation functions
              if (isMutationProcSource) {
                const resource = someSource as PgResource<
                  any,
                  any,
                  any,
                  readonly PgResourceParameter[],
                  any
                >;
                build.recoverable(null, () => {
                  const inputTypeName = inflection.customMutationInput({
                    resource,
                  });

                  const fieldName = inflection.customMutationField({
                    resource,
                  });
                  build.registerInputObjectType(
                    inputTypeName,
                    { isMutationInput: true },
                    () => {
                      return {
                        description: `All input for the \`${fieldName}\` mutation.`,
                        fields: () => {
                          const { argDetails } = pgGetArgDetailsFromParameters(
                            resource,
                            resource.parameters,
                          );

                          // Not used for isMutation; that's handled elsewhere
                          return argDetails.reduce(
                            (memo, { inputType, graphqlArgName }) => {
                              memo[graphqlArgName] = {
                                type: inputType,
                              };
                              return memo;
                            },
                            Object.assign(Object.create(null), {
                              clientMutationId: {
                                type: GraphQLString,
                                apply: EXPORTABLE(
                                  () =>
                                    function apply(
                                      qb: PgSelectQueryBuilder,
                                      val: string | null,
                                    ) {
                                      qb.setMeta("clientMutationId", val);
                                    },
                                  [],
                                ),
                              },
                            }) as GrafastInputFieldConfigMap<any>,
                          );
                        },
                      };
                    },
                    "PgCustomTypeFieldPlugin mutation function input type",
                  );

                  ////////////////////////////////////////

                  const payloadTypeName = inflection.customMutationPayload({
                    resource,
                  });

                  const isVoid = resource.codec === TYPES.void;

                  build.registerObjectType(
                    payloadTypeName,
                    {
                      isMutationPayload: true,
                      pgCodec: resource.codec,
                      pgTypeResource: resource,
                    },
                    () => ({
                      assertStep: ObjectStep,
                      description: `The output of our \`${fieldName}\` mutation.`,
                      fields: () => {
                        const fields = Object.assign(Object.create(null), {
                          clientMutationId: {
                            type: GraphQLString,
                            plan: EXPORTABLE(
                              () =>
                                function plan(
                                  $object: ObjectStep<{
                                    result:
                                      | PgSelectStep
                                      | PgSelectSingleStep
                                      | PgClassExpressionStep<any, any>;
                                  }>,
                                ) {
                                  const $result =
                                    $object.getStepForKey("result");
                                  return $result.getMeta("clientMutationId");
                                },
                              [],
                            ),
                          },
                        }) as Record<
                          string,
                          GrafastFieldConfig<any, any, any, any>
                        >;
                        if (isVoid) {
                          return fields;
                        }
                        const baseType = getFunctionSourceReturnGraphQLType(
                          build,
                          resource,
                        );
                        if (!baseType) {
                          console.warn(
                            `Procedure resource ${resource} has a return type, but we couldn't build it; skipping output field`,
                          );
                          return fields;
                        }
                        const returnGraphQLTypeName =
                          getNamedType(baseType).name;
                        const resultFieldName =
                          inflection.functionMutationResultFieldName({
                            resource,
                            returnGraphQLTypeName,
                          });
                        const type = resource.isUnique
                          ? baseType
                          : new GraphQLList(
                              build.nullableIf(
                                // When dealing with scalars, nulls are allowed in setof
                                build.graphql.isLeafType(
                                  build.graphql.getNamedType(baseType),
                                ) ||
                                  !options.pgForbidSetofFunctionsToReturnNull,
                                baseType,
                              ),
                            );
                        fields[resultFieldName] = {
                          type: build.nullableIf(
                            !resource.extensions?.tags?.notNull,
                            type,
                          ),
                          plan: EXPORTABLE(
                            () =>
                              (
                                $object: ObjectStep<{
                                  result: PgClassSingleStep;
                                }>,
                              ) => {
                                return $object.get("result");
                              },
                            [],
                          ),
                        };
                        return fields;
                      },
                    }),
                    "PgCustomTypeFieldPlugin mutation function payload type",
                  );
                  build[$$rootMutation].push(resource);
                });
              }

              // "computed column"
              // Find non-mutation function sources that accept a row type of the
              // matching codec as the first argument
              const isComputedSource =
                someSource.parameters &&
                build.behavior.pgResourceMatches(someSource, "typeField");
              if (isComputedSource) {
                // ENHANCE: should we allow other forms of computed attributes here,
                // e.g. accepting the row id rather than the row itself.
                const pgCodec = someSource.parameters?.[0]?.codec;
                if (pgCodec) {
                  const list = build[$$computed].get(pgCodec) ?? [];
                  list.push(someSource);
                  build[$$computed].set(pgCodec, list);
                }
              }

              return;
            });
          }

          return _;
        },
      },

      GraphQLObjectType_fields(fields, build, context) {
        return modFields(fields, build, context, false);
      },
      GraphQLInterfaceType_fields(fields, build, context) {
        return modFields(fields, build, context, true);
      },
    },
  },
};

function modFields(
  fields: GraphileBuild.GrafastFieldConfigMap<any>,
  build: GraphileBuild.Build,
  context:
    | GraphileBuild.ContextObjectFields
    | GraphileBuild.ContextInterfaceFields,
  isInterface: boolean,
) {
  const {
    graphql: {
      GraphQLList,
      GraphQLNonNull,
      GraphQLObjectType,
      GraphQLInputObjectType,
    },
    inflection,
    options,
    pgGetArgDetailsFromParameters,
  } = build;
  const { Self, scope, fieldWithHooks } = context;
  const {
    // Shared
    pgCodec,

    // Object:
    isPgClassType,
    isRootQuery,
    isRootMutation,

    // Interface:
    isPgPolymorphicTableType,
    pgPolymorphism,
  } = scope as Partial<GraphileBuild.ScopeObjectFields> &
    Partial<GraphileBuild.ScopeInterfaceFields>;
  const SelfName = Self.name;
  if (isInterface) {
    if (!isPgPolymorphicTableType || !pgPolymorphism) {
      return fields;
    }
    if (
      pgPolymorphism.mode !== "single" &&
      pgPolymorphism.mode !== "relational"
    ) {
      return fields;
    }
    // TODO: remove this and fix issue where computed columns are not added to polymorphic types
    return fields;
  } else {
    if (!(isPgClassType && pgCodec) && !isRootQuery && !isRootMutation) {
      return fields;
    }
  }

  // TODO: factor in where computed column is added to `mode:relational` base (shared) table
  const procSources = isRootQuery
    ? build[$$rootQuery]
    : isRootMutation
    ? build[$$rootMutation]
    : pgCodec
    ? build[$$computed].get(pgCodec) ?? []
    : [];
  if (procSources.length === 0) {
    return fields;
  }

  return procSources.reduce(
    (memo, resource) =>
      build.recoverable(memo, () => {
        // "Computed attributes" skip a parameter
        const remainingParameters = (
          isRootMutation || isRootQuery
            ? resource.parameters
            : resource.parameters.slice(1)
        ) as PgResourceParameter[];

        const { makeArgs, makeFieldArgs } = pgGetArgDetailsFromParameters(
          resource,
          remainingParameters,
        );

        const getSelectPlanFromParentAndArgs: FieldPlanResolver<
          any,
          ExecutableStep,
          any
        > = isRootQuery
          ? // Not computed
            EXPORTABLE(
              (makeArgs, resource) => ($root, args, _info) => {
                const selectArgs = makeArgs(args);
                return resource.execute(selectArgs);
              },
              [makeArgs, resource],
            )
          : isRootMutation
          ? // Mutation uses 'args.input' rather than 'args'
            EXPORTABLE(
              (makeArgs, object, resource) => ($root, args, _info) => {
                const selectArgs = makeArgs(args, ["input"]);
                const $result = resource.execute(selectArgs, "mutation");
                return object({
                  result: $result,
                });
              },
              [makeArgs, object, resource],
            )
          : // Otherwise computed:
            EXPORTABLE(
              (
                PgSelectSingleStep,
                hasRecord,
                makeArgs,
                pgClassExpression,
                pgFromExpression,
                pgSelectSingleFromRecord,
                resource,
                stepAMayDependOnStepB,
              ) =>
                ($in, args, _info) => {
                  if (!hasRecord($in)) {
                    throw new Error(
                      `Invalid plan, exepcted 'PgSelectSingleStep', 'PgInsertSingleStep', 'PgUpdateSingleStep' or 'PgDeleteSingleStep', but found ${$in}`,
                    );
                  }
                  const extraSelectArgs = makeArgs(args);
                  /**
                   * An optimisation - if all our dependencies are
                   * compatible with the expression's class plan then we
                   * can inline ourselves into that, otherwise we must
                   * issue the query separately.
                   */
                  const canUseExpressionDirectly =
                    $in instanceof PgSelectSingleStep &&
                    extraSelectArgs.every((a) =>
                      stepAMayDependOnStepB($in.getClassStep(), a.step),
                    );
                  const $row = canUseExpressionDirectly
                    ? $in
                    : pgSelectSingleFromRecord($in.resource, $in.record());
                  const selectArgs: PgSelectArgumentSpec[] = [
                    { step: $row.record() },
                    ...extraSelectArgs,
                  ];
                  if (
                    resource.isUnique &&
                    !resource.codec.attributes &&
                    typeof resource.from === "function"
                  ) {
                    // This is a scalar computed attribute, let's inline the expression
                    const newSelectArgs = selectArgs.map(
                      (
                        arg,
                        i,
                      ): PgSelectArgumentSpec | PgSelectArgumentDigest => {
                        if (i === 0) {
                          const { step, ...rest } = arg;
                          return {
                            ...rest,
                            placeholder: $row.getClassStep().alias,
                          };
                        } else {
                          return arg;
                        }
                      },
                    );
                    const from = pgFromExpression(
                      $row,
                      resource.from,
                      resource.parameters,
                      newSelectArgs,
                    );
                    return pgClassExpression(
                      $row,
                      resource.codec,
                      undefined,
                    )`${from}`;
                  }
                  // PERF: or here, if scalar add select to `$row`?
                  return resource.execute(selectArgs);
                },
              [
                PgSelectSingleStep,
                hasRecord,
                makeArgs,
                pgClassExpression,
                pgFromExpression,
                pgSelectSingleFromRecord,
                resource,
                stepAMayDependOnStepB,
              ],
            );

        if (isRootMutation) {
          // mutation type
          const fieldName = inflection.customMutationField({
            resource,
          });
          const payloadTypeName = inflection.customMutationPayload({
            resource,
          });
          const payloadType = build.getTypeByName(payloadTypeName);
          const inputTypeName = inflection.customMutationInput({
            resource,
          });
          const inputType = build.getTypeByName(inputTypeName);
          if (!(payloadType instanceof GraphQLObjectType)) {
            return memo;
          }
          if (!(inputType instanceof GraphQLInputObjectType)) {
            return memo;
          }
          memo[fieldName] = fieldWithHooks(
            { fieldName, fieldBehaviorScope: "mutationField" },
            {
              description: resource.description,
              deprecationReason: tagToString(
                resource.extensions?.tags?.deprecated,
              ),
              type: payloadType,
              args: {
                input: {
                  type: new GraphQLNonNull(inputType),
                  applyPlan: EXPORTABLE(
                    (PgSelectStep) =>
                      function plan(
                        _: any,
                        $object: ObjectStep<{
                          result:
                            | PgSelectStep
                            | PgSelectSingleStep
                            | PgClassExpressionStep<any, any>;
                        }>,
                        arg,
                      ) {
                        // We might have any number of step types here; we need
                        // to get back to the underlying pgSelect.
                        const $result = $object.getStepForKey("result");
                        const $parent =
                          "getParentStep" in $result
                            ? ($result.getParentStep() as PgSelectSingleStep)
                            : $result;
                        const $pgSelect =
                          "getClassStep" in $parent
                            ? $parent.getClassStep()
                            : $parent;
                        if ($pgSelect instanceof PgSelectStep) {
                          // Mostly so `clientMutationId` works!
                          arg.apply($pgSelect);
                        } else {
                          throw new Error(
                            `Could not determine PgSelectStep for ${$result}`,
                          );
                        }
                      },
                    [PgSelectStep],
                  ),
                },
              },
              plan: getSelectPlanFromParentAndArgs as any,
            },
          );
        } else if (resource.isUnique) {
          // NOTE: just because it's unique doesn't mean it doesn't
          // return a list.

          const type = getFunctionSourceReturnGraphQLType(build, resource);
          if (!type) {
            return memo;
          }

          const fieldName = isRootQuery
            ? inflection.customQueryField({ resource })
            : inflection.computedAttributeField({ resource });
          memo[fieldName] = fieldWithHooks(
            {
              fieldName,
              fieldBehaviorScope: isRootQuery
                ? "queryField:single"
                : "typeField:single",
            },
            {
              description: resource.description,
              deprecationReason: tagToString(
                resource.extensions?.tags?.deprecated,
              ),
              type: build.nullableIf(
                !resource.extensions?.tags?.notNull,
                type!,
              ),
              args: makeFieldArgs(),
              plan: getSelectPlanFromParentAndArgs as any,
            },
          );
        } else {
          const type = getFunctionSourceReturnGraphQLType(build, resource);
          if (!type) {
            return memo;
          }

          // isUnique is false => this is a 'setof' resource.

          // If the resource still has an array type, then it's a 'setof
          // foo[]' which __MUST NOT USE__ GraphQL connections; see:
          // https://relay.dev/graphql/connections.htm#sec-Node
          const canUseConnection =
            !resource.sqlPartitionByIndex && !resource.isList;

          const baseScope = isRootQuery ? `queryField` : `typeField`;
          const connectionFieldBehaviorScope =
            `${baseScope}:resource:connection` as const;
          const listFieldBehaviorScope = canUseConnection
            ? (`${baseScope}:resource:list` as const)
            : (`${baseScope}:resource:array` as const);
          if (
            canUseConnection &&
            build.behavior.pgResourceMatches(
              resource,
              connectionFieldBehaviorScope,
            )
          ) {
            const fieldName = isRootQuery
              ? inflection.customQueryConnectionField({
                  resource,
                })
              : inflection.computedAttributeConnectionField({
                  resource,
                });

            const namedType = build.graphql.getNamedType(type!);
            const connectionTypeName = shouldUseCustomConnection(resource)
              ? resource.codec.attributes
                ? inflection.recordFunctionConnectionType({
                    resource,
                  })
                : inflection.scalarFunctionConnectionType({
                    resource,
                  })
              : resource.codec.attributes
              ? inflection.tableConnectionType(resource.codec)
              : namedType
              ? inflection.connectionType(namedType.name)
              : null;

            const ConnectionType = connectionTypeName
              ? build.getOutputTypeByName(connectionTypeName)
              : null;

            if (ConnectionType) {
              memo = build.recoverable(memo, () =>
                build.extend(
                  memo,
                  {
                    [fieldName]: fieldWithHooks(
                      {
                        fieldName,
                        fieldBehaviorScope: connectionFieldBehaviorScope,
                        isPgFieldConnection: true,
                        pgFieldResource: resource,
                      },
                      {
                        description:
                          resource.description ??
                          `Reads and enables pagination through a set of \`${inflection.tableType(
                            resource.codec,
                          )}\`.`,
                        deprecationReason: tagToString(
                          resource.extensions?.tags?.deprecated,
                        ),
                        type: build.nullableIf(
                          isRootQuery ?? false,
                          ConnectionType,
                        ),
                        args: makeFieldArgs(),
                        plan: EXPORTABLE(
                          (connection, getSelectPlanFromParentAndArgs) =>
                            function plan(
                              $parent: ExecutableStep,
                              args: FieldArgs,
                              info: FieldInfo,
                            ) {
                              const $select = getSelectPlanFromParentAndArgs(
                                $parent,
                                args,
                                info,
                              ) as PgSelectStep;
                              return connection($select, {
                                // nodePlan: ($item) => $item,
                                cursorPlan: ($item: any) =>
                                  $item.getParentStep
                                    ? $item.getParentStep().cursor()
                                    : $item.cursor(),
                              });
                            },
                          [connection, getSelectPlanFromParentAndArgs],
                        ),
                      },
                    ),
                  },
                  `Adding field '${fieldName}' to '${SelfName}' from function resource '${resource.name}'`,
                ),
              );
            }
          }

          if (
            build.behavior.pgResourceMatches(resource, listFieldBehaviorScope)
          ) {
            const fieldName = isRootQuery
              ? resource.isList
                ? inflection.customQueryField({ resource })
                : inflection.customQueryListField({ resource })
              : resource.isList
              ? inflection.computedAttributeField({ resource })
              : inflection.computedAttributeListField({
                  resource,
                });
            memo = build.recoverable(memo, () =>
              build.extend(
                memo,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope: listFieldBehaviorScope,
                      isPgFieldSimpleCollection: resource.isList
                        ? false // No pagination if it returns an array - just return it.
                        : true,
                      pgFieldResource: resource,
                    },
                    {
                      description: resource.description,
                      deprecationReason: tagToString(
                        resource.extensions?.tags?.deprecated,
                      ),
                      type: build.nullableIf(
                        !resource.extensions?.tags?.notNull,
                        new GraphQLList(
                          build.nullableIf(
                            !resource.extensions?.tags?.notNull &&
                              (resource.isList ||
                                !options.pgForbidSetofFunctionsToReturnNull),
                            type!,
                          ),
                        ),
                      ),
                      args: makeFieldArgs(),
                      plan: getSelectPlanFromParentAndArgs as any,
                    },
                  ),
                },
                `Adding list field '${fieldName}' to ${SelfName} from function resource '${resource.name}'`,
              ),
            );
          }
        }
        return memo;
      }),
    fields,
  );
}

function getPreferredType(
  build: GraphileBuild.Build,
  rawInnerType: GraphQLOutputType,
  preferredTypeName: string,
): GraphQLOutputType {
  const {
    graphql: {
      GraphQLList,
      GraphQLNonNull,
      GraphQLUnionType,
      GraphQLInterfaceType,
      GraphQLObjectType,
    },
    getOutputTypeByName,
  } = build;
  if (rawInnerType instanceof GraphQLNonNull) {
    const preferred = getPreferredType(
      build,
      rawInnerType.ofType,
      preferredTypeName,
    );
    if (preferred === rawInnerType.ofType) {
      return rawInnerType;
    } else {
      return new GraphQLNonNull(preferred);
    }
  } else if (rawInnerType instanceof GraphQLList) {
    const preferred = getPreferredType(
      build,
      rawInnerType.ofType,
      preferredTypeName,
    );
    if (preferred === rawInnerType.ofType) {
      return rawInnerType;
    } else {
      return new GraphQLList(preferred);
    }
  } else if (rawInnerType.name === preferredTypeName) {
    return rawInnerType;
  } else if (rawInnerType instanceof GraphQLInterfaceType) {
    const type = getOutputTypeByName(preferredTypeName);
    if (
      type instanceof GraphQLObjectType &&
      type.getInterfaces().includes(rawInnerType)
    ) {
      return type;
    } else {
      throw new Error(
        `Don't know how to turn interface type '${rawInnerType}' into '${preferredTypeName}'`,
      );
    }
  } else if (rawInnerType instanceof GraphQLUnionType) {
    const type = rawInnerType
      .getTypes()
      .find((t) => t.name === preferredTypeName);
    if (type) {
      return type;
    } else {
      throw new Error(
        `Don't know how to turn union type '${rawInnerType}' into '${preferredTypeName}'`,
      );
    }
  } else {
    throw new Error(
      `Don't know how to turn '${rawInnerType}' into '${preferredTypeName}'`,
    );
  }
}

function getFunctionSourceReturnGraphQLType(
  build: GraphileBuild.Build,
  resource: PgResource<any, any, any, any, any>,
): GraphQLOutputType | null {
  const resourceInnerCodec: PgCodec<any, any, any, any, undefined, any, any> =
    resource.codec.arrayOfCodec ?? resource.codec;
  if (!resourceInnerCodec) {
    return null;
  }
  const isVoid = resourceInnerCodec === TYPES.void;
  const rawInnerType = isVoid
    ? null
    : (build.getGraphQLTypeByPgCodec(resourceInnerCodec, "output") as
        | GraphQLOutputType
        | undefined);
  if (!rawInnerType && !isVoid) {
    console.warn(
      `Failed to find a suitable type for codec '${resource.codec.name}'; not adding function field`,
    );
    return null;
  } else if (!rawInnerType) {
    return null;
  }

  const preferredType = resource.extensions?.tags?.returnType;
  const innerType = preferredType
    ? getPreferredType(build, rawInnerType, preferredType)
    : rawInnerType;

  // TODO: nullability
  const type =
    innerType && resource.codec.arrayOfCodec
      ? new build.graphql.GraphQLList(innerType)
      : innerType;
  return type;
}
