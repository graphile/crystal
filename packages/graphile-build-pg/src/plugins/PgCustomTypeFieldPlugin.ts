// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import "./PgProceduresPlugin.js";
import "graphile-config";

import type {
  PgClassSinglePlan,
  PgSelectArgumentSpec,
  PgSelectPlan,
  PgSource,
  PgSourceParameter,
  PgTypeCodec,
  PgTypedExecutablePlan,
} from "@dataplan/pg";
import { pgClassExpression, PgSelectSinglePlan, TYPES } from "@dataplan/pg";
import type {
  __InputObjectPlan,
  __TrackedObjectPlan,
  ExecutablePlan,
  InputPlan,
  TrackedArguments,
  FieldPlanResolver,
  GraphileFieldConfigArgumentMap,
} from "dataplanner";
import { aether } from "dataplanner";
import {
  __ListTransformPlan,
  connection,
  constant,
  object,
  ObjectPlan,
} from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLObjectType, GraphQLOutputType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

declare global {
  namespace GraphileBuild {
    interface InflectionCustomFieldProcedureDetails {
      source: PgSource<any, any, any, PgSourceParameter[]>;
    }
    interface InflectionCustomFieldArgumentDetails {
      source: PgSource<any, any, any, PgSourceParameter[]>;
      param: PgSourceParameter;
      index: number;
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
      computedColumnField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedColumnConnectionField(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedColumnListField(
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
    }
  }
}

function getArgDetailsFromParameters(
  build: GraphileBuild.Build,
  source: PgSource<any, any, any, any>,
  parameters: PgSourceParameter[],
) {
  const {
    graphql: { GraphQLList, GraphQLNonNull },
    getGraphQLTypeByPgCodec,
  } = build;
  const argDetails = parameters.map((param, index) => {
    const argName = build.inflection.argument({
      param,
      source,
      index,
    });
    const paramBaseCodec = param.codec.arrayOfCodec ?? param.codec;
    const baseInputType = getGraphQLTypeByPgCodec(paramBaseCodec, "input");
    if (!baseInputType) {
      throw new Error(
        `Failed to find a suitable type for argument codec '${param.codec.name}'; not adding function field for '${source}'`,
      );
    }

    // Not necessarily a list type... Need to rename this
    // variable.
    const listType = param.codec.arrayOfCodec
      ? new GraphQLList(baseInputType)
      : baseInputType;

    const inputType =
      param.notNull && param.required ? new GraphQLNonNull(listType) : listType;
    return {
      graphqlArgName: argName,
      postgresArgName: param.name,
      pgCodec: param.codec,
      inputType,
      required: param.required,
    };
  });
  return argDetails;
}

function shouldUseCustomConnection(
  pgSource: PgSource<any, any, any, any>,
): boolean {
  // 'setof <scalar>' functions should use a connection based on the function name, not a generic connection
  return !pgSource.codec.columns || pgSource.codec.isAnonymous || false;
}

function defaultProcSourceBehavior(
  s: PgSource<any, any, any, any>,
  options: GraphileBuild.GraphileBuildSchemaOptions,
): string {
  const { simpleCollections } = options;
  const behavior = [];
  if (
    !s.isMutation &&
    s.parameters &&
    // Don't default to this being a query_field if it looks like a computed column function
    !(s as PgSource<any, any, any, PgSourceParameter[]>).parameters[0]?.codec
      ?.columns
  ) {
    behavior.push("query_field");
  } else {
    behavior.push("-query_field");
  }

  if (s.isMutation && s.parameters) {
    behavior.push("mutation_field");
  } else {
    behavior.push("-mutation_field");
  }

  if (s.parameters && s.parameters?.[0]?.codec?.columns && !s.isMutation) {
    behavior.push("type_field");
  } else {
    behavior.push("-type_field");
  }

  if (s.parameters && !s.isUnique) {
    const canUseConnection = !s.sqlPartitionByIndex && !s.isList;
    const defaultBehavior = canUseConnection
      ? simpleCollections === "both"
        ? "connection list"
        : simpleCollections === "only"
        ? "list"
        : "connection"
      : "list";
    behavior.push(defaultBehavior);
  }

  return behavior.join(" ");
}

export const PgCustomTypeFieldPlugin: GraphileConfig.Plugin = {
  name: "PgCustomTypeFieldPlugin",
  description:
    "Adds GraphQL fields based on PostgreSQL functions (in PostGraphile v4 these were called 'custom query functions', 'custom mutation functions' and 'computed column functions'",
  version: version,

  inflection: {
    add: {
      _functionName(options, details) {
        return details.source.extensions?.tags?.name ?? details.source.name;
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
        return this.customQueryField(details);
      },
      customQueryListField(options, details) {
        return this.camelCase(this.customQueryField(details) + "-list");
      },
      computedColumnField(options, details) {
        const explicitName = details.source.extensions?.tags?.fieldName;
        if (typeof explicitName === "string") {
          return this.camelCase(explicitName);
        }
        const name = details.source.name;
        const codecName =
          details.source.parameters[0].codec.extensions?.tags?.originalName;
        const legacyPrefix = codecName + "_";
        if (name.startsWith(legacyPrefix)) {
          return this.camelCase(name.slice(legacyPrefix.length));
        } else {
          return this.camelCase(name);
        }
      },
      computedColumnConnectionField(options, details) {
        return this.computedColumnField(details);
      },
      computedColumnListField(options, details) {
        return this.camelCase(this.computedColumnField(details) + "-list");
      },
      argument(options, details) {
        return this.camelCase(details.param.name || `arg${details.index}`);
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
    },
  },

  schema: {
    hooks: {
      init: {
        after: ["PgCodecs"],
        callback(_, build) {
          const {
            graphql: { GraphQLList, GraphQLString },
            inflection,
            options,
          } = build;
          // Add payload type for mutation functions
          const mutationProcSources = build.input.pgSources.filter(
            (s) =>
              s.isMutation &&
              s.parameters &&
              build.behavior.matches(
                getBehavior(s.extensions),
                "mutation_field",
                "mutation_field",
              ),
          );

          for (const source of mutationProcSources) {
            const inputTypeName = inflection.customMutationInput({
              source,
            });

            build.registerInputObjectType(
              inputTypeName,
              {},
              () => {
                const argDetails = getArgDetailsFromParameters(
                  build,
                  source,
                  source.parameters,
                );

                // Not used for isMutation; that's handled elsewhere
                const fields = argDetails.reduce(
                  (memo, { inputType, graphqlArgName }) => {
                    memo[graphqlArgName] = {
                      type: inputType,
                    };
                    return memo;
                  },
                  {
                    clientMutationId: {
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
                  },
                );

                return {
                  fields,
                };
              },
              "PgCustomTypeFieldPlugin mutation function input type",
            );

            ////////////////////////////////////////

            const payloadTypeName = inflection.customMutationPayload({
              source,
            });

            const isVoid = source.codec === TYPES.void;

            // TODO:
            /*
          const resultFieldName = inflection.functionMutationResultFieldName(
            proc,
            getNamedType(type),
            proc.returnsSet || rawReturnType.isPgArray,
            outputArgNames
          );
          */
            const resultFieldName = `result`;

            build.registerObjectType(
              payloadTypeName,
              {
                isMutationPayload: true,
                pgCodec: source.codec,
              },
              ObjectPlan,
              () => ({
                fields: () => {
                  const fields = {
                    clientMutationId: {
                      type: GraphQLString,
                      plan: EXPORTABLE(
                        (constant) =>
                          function plan($object: ObjectPlan<any>) {
                            return (
                              $object.getPlanForKey("clientMutationId", true) ??
                              constant(undefined)
                            );
                          },
                        [constant],
                      ),
                    },
                  };
                  if (isVoid) {
                    return fields;
                  }
                  const baseType = getFunctionSourceReturnGraphQLType(
                    build,
                    source,
                  );
                  if (!baseType) {
                    console.warn(
                      `Procedure source ${source} has a return type, but we couldn't build it; skipping output field`,
                    );
                    return {};
                  }
                  const type = source.isUnique
                    ? baseType
                    : new GraphQLList(baseType);
                  fields[resultFieldName] = {
                    type,
                    plan: EXPORTABLE(
                      () =>
                        (
                          $object: ObjectPlan<{
                            result: PgClassSinglePlan<any, any, any, any>;
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
          }

          // Add connection type for functions that need it
          const functionSourcesRequiringConnections =
            build.input.pgSources.filter(
              (s) => s.parameters && shouldUseCustomConnection(s),
            );

          for (const pgSource of functionSourcesRequiringConnections) {
            build.recoverable(null, () => {
              const connectionTypeName = pgSource.codec.columns
                ? inflection.recordFunctionConnectionType({ source: pgSource })
                : inflection.scalarFunctionConnectionType({ source: pgSource });
              const edgeTypeName = pgSource.codec.columns
                ? inflection.recordFunctionEdgeType({ source: pgSource })
                : inflection.scalarFunctionEdgeType({ source: pgSource });
              const typeName = pgSource.codec.columns
                ? inflection.tableType(pgSource.codec)
                : build.getGraphQLTypeNameByPgCodec(pgSource.codec, "output");
              if (typeName) {
                build.registerCursorConnection({
                  connectionTypeName,
                  edgeTypeName,
                  typeName,
                  scope: {
                    isPgConnectionRelated: true,
                    pgCodec: pgSource.codec,
                  },
                  nonNullNode: options.pgForbidSetofFunctionsToReturnNull,
                });
              } else {
                console.warn(
                  `Could not find a type for codec ${pgSource}'s codec`,
                );
              }
            });
          }

          return _;
        },
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: {
            GraphQLList,
            GraphQLNonNull,
            GraphQLObjectType,
            GraphQLInputObjectType,
          },
          inflection,
          options,
        } = build;
        const {
          Self,
          scope: { isPgTableType, pgCodec, isRootQuery, isRootMutation },
          fieldWithHooks,
        } = context;
        const SelfName = Self.name;
        if (!(isPgTableType && pgCodec) && !isRootQuery && !isRootMutation) {
          return fields;
        }
        const procSources = (() => {
          // TODO: should we use query:field, mutation:field, type:field rather than underscores for the behaviors?
          if (isRootQuery) {
            // "custom query"
            // Find non-mutation function sources that don't accept a row type
            // as the first argument
            return build.input.pgSources.filter(
              (s) =>
                s.parameters &&
                build.behavior.matches(
                  getBehavior(s.extensions),
                  "query_field",
                  defaultProcSourceBehavior(s, options),
                ),
            );
          } else if (isRootMutation) {
            // "custom mutation"
            // Find mutation function sources
            return build.input.pgSources.filter(
              (s) =>
                s.parameters &&
                build.behavior.matches(
                  getBehavior(s.extensions),
                  "mutation_field",
                  defaultProcSourceBehavior(s, options),
                ),
            );
          } else {
            // "computed column"
            // Find non-mutation function sources that accept a row type of the
            // matching codec as the first argument
            return build.input.pgSources.filter(
              (s) =>
                s.parameters &&
                // TODO: should we allow other forms of computed columns here,
                // e.g. accepting the row id rather than the row itself.
                s.parameters?.[0]?.codec === pgCodec &&
                build.behavior.matches(
                  getBehavior(s.extensions),
                  "type_field",
                  defaultProcSourceBehavior(s, options),
                ),
            );
          }
        })();
        if (procSources.length === 0) {
          return fields;
        }

        return procSources.reduce(
          (memo, source) =>
            build.recoverable(memo, () => {
              // "Computed columns" skip a parameter
              const remainingParameters = (
                isRootMutation || isRootQuery
                  ? source.parameters
                  : source.parameters.slice(1)
              ) as PgSourceParameter[];

              const argDetails = getArgDetailsFromParameters(
                build,
                source,
                remainingParameters,
              );

              // Not used for isMutation; that's handled elsewhere
              const args = argDetails.reduce(
                (memo, { inputType, graphqlArgName }) => {
                  memo[graphqlArgName] = {
                    type: inputType,
                  };
                  return memo;
                },
                {} as GraphileFieldConfigArgumentMap<any, any, any, any>,
              );

              const argDetailsSimple = argDetails.map(
                ({ graphqlArgName, pgCodec, required, postgresArgName }) => ({
                  graphqlArgName,
                  postgresArgName,
                  pgCodec,
                  required,
                }),
              );

              const makeArgs = EXPORTABLE(
                (argDetailsSimple) =>
                  (
                    info: {
                      evaluateArgPlan: (
                        path: string | string[],
                      ) => ExecutablePlan | undefined;
                    },
                    path: string[] = [],
                  ) => {
                    const { evaluateArgPlan } = info;
                    const selectArgs: PgSelectArgumentSpec[] = [];

                    let skipped = false;
                    for (const {
                      graphqlArgName,
                      postgresArgName,
                      pgCodec,
                      required,
                    } of argDetailsSimple) {
                      let plan = evaluateArgPlan([...path, graphqlArgName]);
                      if (plan === undefined) {
                        if (!required) {
                          skipped = true;
                          continue;
                        } else {
                          plan = constant(null);
                        }
                      }

                      if (skipped) {
                        const name = postgresArgName;
                        if (!name) {
                          // TODO: we should handle this above and not skip arguments
                          // if there are additional parameters that are unnamed.
                          throw new Error(
                            "Cannot skip arguments when parameters are unnamed",
                          );
                        }
                        selectArgs.push({
                          plan,
                          pgCodec,
                          name,
                        });
                      } else {
                        selectArgs.push({
                          plan,
                          pgCodec,
                        });
                      }
                    }

                    return selectArgs;
                  },
                [argDetailsSimple],
              );

              const getSelectPlanFromParentAndArgs: FieldPlanResolver<
                any,
                ExecutablePlan,
                any
              > = isRootQuery
                ? // Not computed
                  EXPORTABLE(
                    (source) => ($root, args, info) => {
                      const selectArgs = makeArgs(info);
                      return source.execute(selectArgs);
                    },
                    [source],
                  )
                : isRootMutation
                ? // Mutation uses 'args.input' rather than 'args'
                  EXPORTABLE(
                    (object, source) => ($root, args, info) => {
                      const selectArgs = makeArgs(info, ["input"]);
                      const $result = source.execute(selectArgs);
                      return object({
                        result: $result,
                      });
                    },
                    [object, source],
                  )
                : // Otherwise computed:
                  EXPORTABLE(
                    (PgSelectSinglePlan, pgClassExpression, source) =>
                      ($row, args, info) => {
                        if (!($row instanceof PgSelectSinglePlan)) {
                          throw new Error(
                            `Invalid plan, exepcted 'PgSelectSinglePlan', but found ${$row}`,
                          );
                        }
                        const selectArgs = [
                          { plan: $row.record() },
                          ...makeArgs(info),
                        ];
                        if (
                          source.isUnique &&
                          !source.codec.columns &&
                          typeof source.source === "function"
                        ) {
                          // This is a scalar computed column, let's inline the expression
                          const placeholders = selectArgs.map((arg, i) => {
                            if (i === 0) {
                              return $row.getClassPlan().alias;
                            } else if ("pgCodec" in arg && arg.pgCodec) {
                              return $row.placeholder(arg.plan, arg.pgCodec);
                            } else {
                              return $row.placeholder(
                                arg.plan as PgTypedExecutablePlan<any>,
                              );
                            }
                          });
                          return pgClassExpression(
                            $row,
                            source.codec,
                          )`${source.source(...placeholders)}`;
                        }
                        // TODO: or here, if scalar add select to `$row`?
                        return source.execute(selectArgs);
                      },
                    [PgSelectSinglePlan, pgClassExpression, source],
                  );

              if (isRootMutation) {
                // mutation type
                const fieldName = inflection.customMutationField({ source });
                const payloadTypeName = inflection.customMutationPayload({
                  source,
                });
                const payloadType = build.getTypeByName(payloadTypeName);
                const inputTypeName = inflection.customMutationInput({
                  source,
                });
                const inputType = build.getTypeByName(inputTypeName);
                if (!(payloadType instanceof GraphQLObjectType)) {
                  return memo;
                }
                if (!(inputType instanceof GraphQLInputObjectType)) {
                  return memo;
                }
                memo[fieldName] = fieldWithHooks(
                  { fieldName, fieldBehaviorScope: "mutation_field" },
                  {
                    description: source.description,
                    type: payloadType,
                    args: {
                      input: {
                        type: new GraphQLNonNull(inputType),
                        plan: EXPORTABLE(
                          () =>
                            function plan(_: any, $object: ObjectPlan<any>) {
                              return $object;
                            },
                          [],
                        ),
                      },
                    },
                    plan: getSelectPlanFromParentAndArgs as any,
                  },
                );
              } else if (source.isUnique) {
                const type = getFunctionSourceReturnGraphQLType(build, source);
                if (!type) {
                  return memo;
                }

                const fieldName = isRootQuery
                  ? inflection.customQueryField({ source })
                  : inflection.computedColumnField({ source });
                memo[fieldName] = fieldWithHooks(
                  {
                    fieldName,
                    // TODO: just because it's unique doesn't mean it doesn't
                    // return a list. But even if it does, we can't order it or
                    // filter it... So maybe `single` is fine?
                    fieldBehaviorScope: isRootQuery
                      ? "query_field:single"
                      : "type_field:single",
                  },
                  {
                    description: source.description,
                    type: type!,
                    args,
                    plan: getSelectPlanFromParentAndArgs as any,
                  },
                );
              } else {
                const type = getFunctionSourceReturnGraphQLType(build, source);
                if (!type) {
                  return memo;
                }

                // isUnique is false => this is a 'setof' source.

                // If the source still has an array type, then it's a 'setof
                // foo[]' which __MUST NOT USE__ GraphQL connections; see:
                // https://relay.dev/graphql/connections.htm#sec-Node
                const canUseConnection =
                  !source.sqlPartitionByIndex && !source.isList;

                const behavior = getBehavior(source.extensions);

                const baseScope = isRootQuery ? `query_field` : `type_field`;
                const connectionFieldBehaviorScope = `${baseScope}:connection`;
                const listFieldBehaviorScope = `${baseScope}:list`;
                if (
                  canUseConnection &&
                  build.behavior.matches(
                    behavior,
                    connectionFieldBehaviorScope,
                    defaultProcSourceBehavior(source, options),
                  )
                ) {
                  const fieldName = isRootQuery
                    ? inflection.customQueryConnectionField({ source })
                    : inflection.computedColumnConnectionField({ source });

                  const namedType = build.graphql.getNamedType(type!);
                  const connectionTypeName = shouldUseCustomConnection(source)
                    ? source.codec.columns
                      ? inflection.recordFunctionConnectionType({ source })
                      : inflection.scalarFunctionConnectionType({ source })
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
                              pgSource: source,
                            },
                            {
                              description: source.description,
                              type: ConnectionType,
                              args,
                              plan: EXPORTABLE(
                                (connection, getSelectPlanFromParentAndArgs) =>
                                  function plan(
                                    $parent: ExecutablePlan,
                                    args: TrackedArguments<any>,
                                    info,
                                  ) {
                                    const $select =
                                      getSelectPlanFromParentAndArgs(
                                        $parent,
                                        args,
                                        info,
                                      ) as PgSelectPlan<any, any, any, any>;
                                    return connection(
                                      $select,
                                      ($item) => $item,
                                      ($item: any) =>
                                        $item.getParentPlan
                                          ? $item.getParentPlan().cursor()
                                          : $item.cursor(),
                                    );
                                  },
                                [connection, getSelectPlanFromParentAndArgs],
                              ),
                            },
                          ),
                        },
                        `Adding field '${fieldName}' to '${SelfName}' from function source '${source.name}'`,
                      ),
                    );
                  }
                }

                if (
                  build.behavior.matches(
                    behavior,
                    listFieldBehaviorScope,
                    defaultProcSourceBehavior(source, options),
                  )
                ) {
                  const fieldName = isRootQuery
                    ? inflection.customQueryListField({ source })
                    : source.isList
                    ? inflection.computedColumnField({ source })
                    : inflection.computedColumnListField({ source });
                  memo = build.recoverable(memo, () =>
                    build.extend(
                      memo,
                      {
                        [fieldName]: fieldWithHooks(
                          {
                            fieldName,
                            fieldBehaviorScope: listFieldBehaviorScope,
                          },
                          {
                            description: source.description,
                            // TODO: nullability
                            type: new GraphQLList(type!),
                            args,
                            plan: getSelectPlanFromParentAndArgs as any,
                          },
                        ),
                      },
                      `Adding list field '${fieldName}' to ${SelfName} from function source '${source.name}'`,
                    ),
                  );
                }
              }
              return memo;
            }),
          fields,
        );
      },
    },
  },
};

function getFunctionSourceReturnGraphQLType(
  build: GraphileBuild.Build,
  source: PgSource<any, any, any, any>,
): GraphQLOutputType | null {
  const sourceInnerCodec: PgTypeCodec<any, any, any> =
    source.codec.arrayOfCodec ?? source.codec;
  if (!sourceInnerCodec) {
    return null;
  }
  const isVoid = sourceInnerCodec === TYPES.void;
  const innerType = isVoid
    ? null
    : (build.getGraphQLTypeByPgCodec(sourceInnerCodec, "output") as
        | GraphQLOutputType
        | undefined);
  if (!innerType && !isVoid) {
    console.warn(
      `Failed to find a suitable type for codec '${source.codec.name}'; not adding function field`,
    );
    return null;
  } else if (!innerType) {
    return null;
  }

  // TODO: nullability
  const type =
    innerType && source.codec.arrayOfCodec
      ? new build.graphql.GraphQLList(innerType)
      : innerType;
  return type;
}
