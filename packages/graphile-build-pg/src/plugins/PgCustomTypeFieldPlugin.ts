// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import "./PgProceduresPlugin";

import type {
  PgSelectArgumentSpec,
  PgSource,
  PgSourceParameter,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgClassExpressionPlan } from "@dataplan/pg";
import { PgSelectPlan, PgSelectSinglePlan, TYPES } from "@dataplan/pg";
import type { ExecutablePlan } from "graphile-crystal";
import { __ListTransformPlan, connection } from "graphile-crystal";
import type { TrackedArguments } from "graphile-crystal/src/interfaces";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLOutputType } from "graphql";

import { getBehavior } from "../behavior";
import { version } from "../index";

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

interface ProcedureDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
}
interface ArgumentDetails {
  source: PgSource<any, any, any, PgSourceParameter[]>;
  param: PgSourceParameter;
  index: number;
}

declare global {
  namespace GraphileEngine {
    interface Inflection {
      customMutation(this: Inflection, details: ProcedureDetails): string;
      customMutationPayload(
        this: Inflection,
        details: ProcedureDetails,
      ): string;
      customQuery(this: Inflection, details: ProcedureDetails): string;
      customQueryConnection(
        this: Inflection,
        details: ProcedureDetails,
      ): string;
      customQueryList(this: Inflection, details: ProcedureDetails): string;
      computedColumn(this: Inflection, details: ProcedureDetails): string;
      computedColumnConnection(
        this: Inflection,
        details: ProcedureDetails,
      ): string;
      computedColumnList(this: Inflection, details: ProcedureDetails): string;
      argument(this: Inflection, details: ArgumentDetails): string;
    }
  }
}

export const PgCustomTypeFieldPlugin: Plugin = {
  name: "PgCustomTypeFieldPlugin",
  description:
    "Adds fields to types for custom type field functions (aka 'computed column functions')",
  version: version,
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend(
          inflection,
          {
            customMutation(details) {
              return this.camelCase(
                details.source.extensions?.tags?.name ?? details.source.name,
              );
            },
            customMutationPayload(details) {
              return this.camelCase(this.customMutation(details) + "-payload");
            },
            customQuery(details) {
              return this.camelCase(
                details.source.extensions?.tags?.name ?? details.source.name,
              );
            },
            customQueryConnection(details) {
              return this.customQuery(details);
            },
            customQueryList(details) {
              return this.camelCase(this.customQuery(details) + "-list");
            },
            computedColumn(details) {
              // TODO: remove prefix from name?
              return this.camelCase(
                details.source.extensions?.tags?.name ?? details.source.name,
              );
            },
            computedColumnConnection(details) {
              return this.computedColumn(details);
            },
            computedColumnList(details) {
              return this.camelCase(this.computedColumn(details) + "-list");
            },
            argument(details) {
              return this.camelCase(
                details.param.name || `arg${details.index}`,
              );
            },
          },
          "Adding inflectors for PgCustomTypeFieldPlugin",
        );
      },

      init(_, build) {
        const {
          graphql: { GraphQLList },
        } = build;
        // Add payload type for mutation functions
        const mutationProcSources = build.input.pgSources.filter(
          (s) =>
            s.isMutation &&
            s.parameters &&
            (getBehavior(s.extensions) ?? ["mutation"]).includes("mutation"),
        );

        for (const source of mutationProcSources) {
          const payloadTypeName = build.inflection.customMutationPayload({
            source,
          });

          const ExpectedPlan = source.isUnique
            ? source.codec.columns
              ? PgSelectSinglePlan
              : PgClassExpressionPlan
            : source.sqlPartitionByIndex
            ? __ListTransformPlan
            : PgSelectPlan;

          const isVoid = source.codec === TYPES.void;

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
            ExpectedPlan as { new (...args: any[]): ExecutablePlan },
            () => ({
              fields: isVoid
                ? {}
                : () => {
                    const baseType = getFunctionSourceReturnGraphQLType(
                      build,
                      source,
                    );
                    if (!baseType) {
                      return {};
                    }
                    const type = source.isUnique
                      ? baseType
                      : new GraphQLList(baseType);
                    return {
                      [resultFieldName]: {
                        type,
                        plan: EXPORTABLE(
                          () => ($parent) => {
                            return $parent;
                          },
                          [],
                        ),
                      },
                    };
                  },
            }),
            "PgCustomTypeFieldPlugin mutation function payload type",
          );
        }

        return _;
      },

      GraphQLObjectType_fields(fields, build, context) {
        const {
          getGraphQLTypeByPgCodec,
          sql,
          graphql: { GraphQLList, GraphQLNonNull },
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
        if (isRootQuery) {
          console.log(`${procSources.length} query sources`);
        }
        if (isRootMutation) {
          console.log(`${procSources.length} mutation sources`);
        }
        if (procSources.length === 0) {
          return fields;
        }

        return build.extend(
          fields,
          procSources.reduce(
            (memo, source) =>
              build.recoverable(memo, () => {
                // "Computed columns" skip a parameter
                const remainingParameters = (
                  isRootMutation || isRootQuery
                    ? source.parameters
                    : source.parameters.slice(1)
                ) as PgSourceParameter[];

                const argDetails = remainingParameters.map((param, index) => {
                  const argName = build.inflection.argument({
                    param,
                    source,
                    index,
                  });
                  const paramBaseCodec =
                    param.codec.arrayOfCodec ?? param.codec;
                  const baseInputType = getGraphQLTypeByPgCodec(
                    paramBaseCodec,
                    "input",
                  );
                  if (!baseInputType) {
                    throw new Error(
                      `Failed to find a suitable type for argument codec '${
                        sql.compile(param.codec.sqlType).text
                      }'; not adding function field for '${source}'`,
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
                    argName,
                    pgCodec: param.codec,
                    inputType,
                    required: param.required,
                  };
                });
                const args = argDetails.reduce(
                  (memo, { inputType, argName }) => {
                    memo[argName] = {
                      type: inputType,
                    };
                    return memo;
                  },
                  {},
                );

                const getSelectPlanFromParentAndArgs =
                  isRootQuery || isRootMutation
                    ? // Not computed
                      EXPORTABLE(
                        (argDetails, isNotNullish, source) =>
                          (
                            $root: ExecutablePlan,
                            args: TrackedArguments<any>,
                          ) => {
                            const selectArgs: PgSelectArgumentSpec[] = [
                              ...argDetails
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
                        [argDetails, isNotNullish, source],
                      )
                    : // Otherwise computed:
                      EXPORTABLE(
                        (
                            PgSelectSinglePlan,
                            argDetails,
                            isNotNullish,
                            source,
                          ) =>
                          (
                            $row: ExecutablePlan,
                            args: TrackedArguments<any>,
                          ) => {
                            if (!($row instanceof PgSelectSinglePlan)) {
                              throw new Error(
                                `Invalid plan, exepcted 'PgSelectSinglePlan', but found ${$row}`,
                              );
                            }
                            const selectArgs: PgSelectArgumentSpec[] = [
                              { plan: $row.record() },
                              ...argDetails
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
                        [PgSelectSinglePlan, argDetails, isNotNullish, source],
                      );

                if (isRootMutation) {
                  // mutation type
                  const fieldName = build.inflection.customMutation({ source });
                  const payloadTypeName =
                    build.inflection.customMutationPayload({
                      source,
                    });
                  const payloadType =
                    build.getOutputTypeByName(payloadTypeName);
                  if (!payloadType) {
                    return memo;
                  }
                  memo[fieldName] = fieldWithHooks(
                    { fieldName },
                    {
                      description: source.description,
                      type: payloadType,
                      args,
                      plan: getSelectPlanFromParentAndArgs as any,
                    },
                  );
                } else if (source.isUnique) {
                  const type = getFunctionSourceReturnGraphQLType(
                    build,
                    source,
                  );
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
                  const type = getFunctionSourceReturnGraphQLType(
                    build,
                    source,
                  );
                  if (!type) {
                    return memo;
                  }

                  // isUnique is false => this is a 'setof' source.

                  // If the source still has an array type, then it's a 'setof
                  // foo[]' which __MUST NOT USE__ GraphQL connections; see:
                  // https://relay.dev/graphql/connections.htm#sec-Node
                  const canUseConnection = !source.sqlPartitionByIndex;

                  const behavior = getBehavior(source.extensions) ?? [
                    canUseConnection ? "connection" : "list",
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
                      memo[fieldName] = fieldWithHooks(
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
                                const $select = getSelectPlanFromParentAndArgs(
                                  $parent,
                                  args,
                                ) as PgSelectPlan<any, any, any, any>;
                                return connection(
                                  $select,
                                  ($item) => $item,
                                  (
                                    $item: PgSelectSinglePlan<
                                      any,
                                      any,
                                      any,
                                      any
                                    >,
                                  ) => $item.cursor(),
                                );
                              },
                            [connection, getSelectPlanFromParentAndArgs],
                          ),
                        },
                      );
                    }
                  }

                  if (behavior.includes("list")) {
                    const fieldName = isRootQuery
                      ? build.inflection.customQueryList({ source })
                      : build.inflection.computedColumnList({ source });
                    memo[fieldName] = fieldWithHooks(
                      { fieldName },
                      {
                        description: source.description,
                        // TODO: nullability
                        type: new build.graphql.GraphQLList(type!),
                        args,
                        plan: getSelectPlanFromParentAndArgs as any,
                      },
                    );
                  }
                }
                return memo;
              }),
            {},
          ),
          `Adding custom type field for ${Self.name}`,
        );
      },
    },
  },
};

function getFunctionSourceReturnGraphQLType(
  build: GraphileEngine.Build,
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
      `Failed to find a suitable type for codec '${
        build.sql.compile(source.codec.sqlType).text
      }'; not adding function field`,
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
