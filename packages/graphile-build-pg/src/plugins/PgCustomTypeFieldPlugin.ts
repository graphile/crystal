// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import "./PgProceduresPlugin";
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
} from "dataplanner";
import {
  __ListTransformPlan,
  connection,
  constant,
  object,
  ObjectPlan,
} from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLOutputType } from "graphql";

import { getBehavior } from "../behavior";
import { version } from "../index";

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
      customMutation(
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
      customQuery(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customQueryConnection(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      customQueryList(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedColumn(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedColumnConnection(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      computedColumnList(
        this: Inflection,
        details: InflectionCustomFieldProcedureDetails,
      ): string;
      argument(
        this: Inflection,
        details: InflectionCustomFieldArgumentDetails,
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
      argName,
      pgCodec: param.codec,
      inputType,
      required: param.required,
    };
  });
  return argDetails;
}

export const PgCustomTypeFieldPlugin: GraphileConfig.Plugin = {
  name: "PgCustomTypeFieldPlugin",
  description:
    "Adds GraphQL fields based on PostgreSQL functions (in PostGraphile v4 these were called 'custom query functions', 'custom mutation functions' and 'computed column functions'",
  version: version,

  inflection: {
    add: {
      customMutation(options, details) {
        return this.camelCase(
          details.source.extensions?.tags?.name ?? details.source.name,
        );
      },
      customMutationPayload(options, details) {
        return this.upperCamelCase(this.customMutation(details) + "-payload");
      },
      customMutationInput(options, details) {
        return this.inputType(
          this.upperCamelCase(this.customMutation(details)),
        );
      },
      customQuery(options, details) {
        return this.camelCase(
          details.source.extensions?.tags?.name ?? details.source.name,
        );
      },
      customQueryConnection(options, details) {
        return this.customQuery(details);
      },
      customQueryList(options, details) {
        return this.camelCase(this.customQuery(details) + "-list");
      },
      computedColumn(options, details) {
        const explicitName = details.source.extensions?.tags?.name;
        if (explicitName) {
          return this.camelCase(explicitName);
        }
        const name = details.source.name;
        const codecName = details.source.parameters[0].codec.name;
        const legacyPrefix = codecName + "_";
        if (name.startsWith(legacyPrefix)) {
          return this.camelCase(name.slice(legacyPrefix.length));
        } else {
          return this.camelCase(name);
        }
      },
      computedColumnConnection(options, details) {
        return this.computedColumn(details);
      },
      computedColumnList(options, details) {
        return this.camelCase(this.computedColumn(details) + "-list");
      },
      argument(options, details) {
        return this.camelCase(details.param.name || `arg${details.index}`);
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const {
          graphql: { GraphQLList, GraphQLString },
        } = build;
        // Add payload type for mutation functions
        const mutationProcSources = build.input.pgSources.filter(
          (s) =>
            s.isMutation &&
            s.parameters &&
            (getBehavior(s.extensions) ?? ["mutation"]).includes("mutation"),
        );

        for (const source of mutationProcSources) {
          const inputTypeName = build.inflection.customMutationInput({
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
                (memo, { inputType, argName }) => {
                  memo[argName] = {
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

          const payloadTypeName = build.inflection.customMutationPayload({
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

        return _;
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: {
            GraphQLList,
            GraphQLNonNull,
            GraphQLObjectType,
            GraphQLInputObjectType,
          },
          options: { simpleCollections },
        } = build;
        const {
          Self,
          scope: { isPgTableType, pgCodec, isRootQuery, isRootMutation },
          fieldWithHooks,
        } = context;
        if (!(isPgTableType && pgCodec) && !isRootQuery && !isRootMutation) {
          return fields;
        }
        const procSources = (() => {
          if (isRootQuery) {
            // "custom query"
            // Find non-mutation function sources that don't accept a row type
            // as the first argument
            return build.input.pgSources.filter(
              (s) =>
                !s.isMutation &&
                s.parameters &&
                !(s as PgSource<any, any, any, PgSourceParameter[]>)
                  .parameters[0]?.codec?.columns &&
                (getBehavior(s.extensions) ?? ["query_field"]).includes(
                  "query_field",
                ),
            );
          } else if (isRootMutation) {
            // "custom mutation"
            // Find mutation function sources
            return build.input.pgSources.filter(
              (s) =>
                s.isMutation &&
                s.parameters &&
                (getBehavior(s.extensions) ?? ["mutation"]).includes(
                  "mutation",
                ),
            );
          } else {
            // "computed column"
            // Find non-mutation function sources that accept a row type of the
            // matching codec as the first argument
            return build.input.pgSources.filter(
              (s) =>
                !s.isMutation &&
                s.parameters &&
                s.parameters?.[0]?.codec === pgCodec &&
                (getBehavior(s.extensions) ?? ["type_field"]).includes(
                  "type_field",
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
              const args = argDetails.reduce((memo, { inputType, argName }) => {
                memo[argName] = {
                  type: inputType,
                };
                return memo;
              }, {});

              const argDetailsSimple = argDetails.map(
                ({ argName, pgCodec, required }) => ({
                  argName,
                  pgCodec,
                  required,
                }),
              );

              const getSelectPlanFromParentAndArgs = isRootQuery
                ? // Not computed
                  EXPORTABLE(
                    (argDetailsSimple, isNotNullish, source) =>
                      ($root: ExecutablePlan, args: TrackedArguments<any>) => {
                        const selectArgs: PgSelectArgumentSpec[] = [
                          ...argDetailsSimple
                            .map(({ argName, pgCodec, required }) => {
                              const plan = args[argName];
                              if (!required && plan.evalIs(undefined)) {
                                return null;
                              }
                              return { plan, pgCodec };
                            })
                            .filter(isNotNullish),
                        ];
                        return source.execute(selectArgs);
                      },
                    [argDetailsSimple, isNotNullish, source],
                  )
                : isRootMutation
                ? // Mutation uses 'args.input' rather than 'args'
                  EXPORTABLE(
                    (
                        argDetailsSimple,
                        constant,
                        isNotNullish,
                        object,
                        source,
                      ) =>
                      ($root: ExecutablePlan, args: TrackedArguments<any>) => {
                        const selectArgs: PgSelectArgumentSpec[] = [
                          ...argDetailsSimple
                            .map(({ argName, pgCodec, required }) => {
                              const plan = (
                                args.input as
                                  | __TrackedObjectPlan
                                  | __InputObjectPlan
                              ).get(argName);
                              if (!required && plan.evalIs(undefined)) {
                                return null;
                              }
                              return {
                                plan: plan ?? constant(undefined),
                                pgCodec,
                              };
                            })
                            .filter(isNotNullish),
                        ];
                        const $result = source.execute(selectArgs);
                        return object({
                          result: $result,
                        });
                      },
                    [argDetailsSimple, constant, isNotNullish, object, source],
                  )
                : // Otherwise computed:
                  EXPORTABLE(
                    (
                        PgSelectSinglePlan,
                        argDetailsSimple,
                        isNotNullish,
                        pgClassExpression,
                        source,
                      ) =>
                      ($row: ExecutablePlan, args: TrackedArguments<any>) => {
                        if (!($row instanceof PgSelectSinglePlan)) {
                          throw new Error(
                            `Invalid plan, exepcted 'PgSelectSinglePlan', but found ${$row}`,
                          );
                        }
                        const selectArgs: PgSelectArgumentSpec[] = [
                          { plan: $row.record() },
                          ...argDetailsSimple
                            .map(({ argName, pgCodec, required }) => {
                              const plan = args[argName];
                              if (!required && plan.evalIs(undefined)) {
                                return null;
                              }
                              return { plan, pgCodec };
                            })
                            .filter(isNotNullish),
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
                    [
                      PgSelectSinglePlan,
                      argDetailsSimple,
                      isNotNullish,
                      pgClassExpression,
                      source,
                    ],
                  );

              if (isRootMutation) {
                // mutation type
                const fieldName = build.inflection.customMutation({ source });
                const payloadTypeName = build.inflection.customMutationPayload({
                  source,
                });
                const payloadType = build.getTypeByName(payloadTypeName);
                const inputTypeName = build.inflection.customMutationInput({
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
                  { fieldName },
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
                  ? build.inflection.customQuery({ source })
                  : build.inflection.computedColumn({ source });
                memo[fieldName] = fieldWithHooks(
                  { fieldName },
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

                const behavior = getBehavior(source.extensions) ?? [
                  ...(canUseConnection
                    ? simpleCollections === "both"
                      ? ["connection", "list"]
                      : simpleCollections === "only"
                      ? ["list"]
                      : ["connection"]
                    : ["list"]),
                ];

                if (behavior.includes("connection") && canUseConnection) {
                  const fieldName = isRootQuery
                    ? build.inflection.customQueryConnection({ source })
                    : build.inflection.computedColumnConnection({ source });
                  const namedType = build.graphql.getNamedType(type!);
                  const ConnectionType = namedType
                    ? build.getOutputTypeByName(
                        build.inflection.connectionType(namedType.name),
                      )
                    : null;
                  if (ConnectionType) {
                    memo = build.recoverable(memo, () =>
                      build.extend(
                        memo,
                        {
                          [fieldName]: fieldWithHooks(
                            { fieldName },
                            {
                              description: source.description,
                              type: ConnectionType,
                              args,
                              plan: EXPORTABLE(
                                (connection, getSelectPlanFromParentAndArgs) =>
                                  function plan(
                                    $parent: ExecutablePlan,
                                    args: TrackedArguments<any>,
                                  ) {
                                    const $select =
                                      getSelectPlanFromParentAndArgs(
                                        $parent,
                                        args,
                                      ) as PgSelectPlan<any, any, any, any>;
                                    return connection($select);
                                  },
                                [connection, getSelectPlanFromParentAndArgs],
                              ),
                            },
                          ),
                        },
                        `Adding field '${fieldName}' to '${Self.name}' from function source '${source.name}'`,
                      ),
                    );
                  }
                }

                if (behavior.includes("list")) {
                  const fieldName = isRootQuery
                    ? build.inflection.customQueryList({ source })
                    : build.inflection.computedColumnList({ source });
                  memo = build.recoverable(memo, () =>
                    build.extend(
                      memo,
                      {
                        [fieldName]: fieldWithHooks(
                          { fieldName },
                          {
                            description: source.description,
                            // TODO: nullability
                            type: new GraphQLList(type!),
                            args,
                            plan: getSelectPlanFromParentAndArgs as any,
                          },
                        ),
                      },
                      `Adding list field '${fieldName}' to ${Self.name} from function source '${source.name}'`,
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
