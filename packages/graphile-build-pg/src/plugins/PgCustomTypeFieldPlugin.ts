// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import "./PgProceduresPlugin";

import type {
  PgSelectArgumentSpec,
  PgSelectPlan,
  PgSelectSinglePlan,
  PgSource,
  PgSourceParameter,
  PgTypeCodec,
} from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import { connection } from "graphile-crystal";
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
        if (!isPgTableType || !pgCodec) {
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

        return build.extend(
          fields,
          procSources.reduce((memo, source) => {
            const sourceInnerCodec: PgTypeCodec<any, any, any> =
              source.codec.arrayOfCodec ?? source.codec;
            if (!sourceInnerCodec) {
              return memo;
            }
            const isVoid = sourceInnerCodec === TYPES.void;
            const innerType = isVoid
              ? null
              : (getGraphQLTypeByPgCodec(sourceInnerCodec, "output") as
                  | GraphQLOutputType
                  | undefined);
            if (!innerType && !isVoid) {
              console.warn(
                `Failed to find a suitable type for codec '${
                  sql.compile(source.codec.sqlType).text
                }'; not adding function field`,
              );
              return memo;
            }

            // TODO: nullability
            const type =
              innerType && source.codec.arrayOfCodec
                ? new GraphQLList(innerType)
                : innerType;

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
              const baseInputType = getGraphQLTypeByPgCodec(
                param.codec,
                "input",
              );
              const inputType =
                param.notNull && param.required
                  ? new GraphQLNonNull(baseInputType!)
                  : baseInputType;
              return {
                argName,
                pgCodec: param.codec,
                inputType,
                required: param.required,
              };
            });
            const args = argDetails.reduce((memo, { argName, inputType }) => {
              memo[argName] = {
                type: inputType,
              };
              return memo;
            }, {});

            const getSelectPlanFromRowAndArgs = EXPORTABLE(
              (argDetails, isNotNullish, source) =>
                (
                  $row: PgSelectSinglePlan<any, any, any, any>,
                  args: TrackedArguments<any>,
                ) => {
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
              [argDetails, isNotNullish, source],
            );

            if (isRootMutation) {
              // mutation type
              const fieldName = build.inflection.customMutation({ source });
              const payloadTypeName = build.inflection.customMutationPayload({
                source,
              });
              const payloadType = build.getOutputTypeByName(payloadTypeName);
              if (!payloadType) {
                return memo;
              }
              memo[fieldName] = fieldWithHooks(
                { fieldName },
                {
                  description: source.description,
                  type: payloadType,
                  args,
                  plan: getSelectPlanFromRowAndArgs,
                },
              );
            } else if (source.isUnique) {
              const fieldName = isRootQuery
                ? build.inflection.customQuery({ source })
                : build.inflection.computedColumn({ source });
              memo[fieldName] = fieldWithHooks(
                { fieldName },
                {
                  description: source.description,
                  type: type!,
                  args,
                  plan: getSelectPlanFromRowAndArgs,
                },
              );
            } else {
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
                        (connection, getSelectPlanFromRowAndArgs) =>
                          function plan(
                            $row: PgSelectSinglePlan<any, any, any, any>,
                            args: TrackedArguments<any>,
                          ) {
                            const $select = getSelectPlanFromRowAndArgs(
                              $row,
                              args,
                            ) as PgSelectPlan<any, any, any, any>;
                            return connection(
                              $select,
                              ($item) => $item,
                              ($item: PgSelectSinglePlan<any, any, any, any>) =>
                                $item.cursor(),
                            );
                          },
                        [connection, getSelectPlanFromRowAndArgs],
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
                    plan: getSelectPlanFromRowAndArgs as any,
                  },
                );
              }
            }
            return memo;
          }, {}),
          `Adding custom type field for ${Self.name}`,
        );
      },
    },
  },
};
