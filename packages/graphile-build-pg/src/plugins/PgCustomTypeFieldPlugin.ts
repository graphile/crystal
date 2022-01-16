// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import type {
  PgSelectArgumentSpec,
  PgSelectPlan,
  PgSelectSinglePlan,
  PgSource,
  PgSourceParameter,
} from "@dataplan/pg";
import { pgSelect } from "@dataplan/pg";
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

interface ComputedColumnDetails {
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
      computedColumn(this: Inflection, details: ComputedColumnDetails): string;
      computedColumnConnection(
        this: Inflection,
        details: ComputedColumnDetails,
      ): string;
      computedColumnList(
        this: Inflection,
        details: ComputedColumnDetails,
      ): string;
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
            computedColumn(details) {
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
                details.param.name ?? `arg${details.index}`,
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
          graphql: { GraphQLList },
        } = build;
        const {
          Self,
          scope: { isPgTableType, pgCodec },
          fieldWithHooks,
        } = context;
        if (!isPgTableType || !pgCodec) {
          return fields;
        }
        const procSources = build.input.pgSources.filter(
          (s) =>
            s.parameters?.[0]?.codec === pgCodec &&
            (getBehavior(s.extensions) ?? ["type_field"]).includes(
              "type_field",
            ),
        );
        if (procSources.length === 0) {
          return fields;
        }

        return build.extend(
          fields,
          procSources.reduce((memo, source) => {
            const innerType = getGraphQLTypeByPgCodec(
              source.codec.arrayOfCodec ?? source.codec,
              "output",
            ) as GraphQLOutputType | undefined;
            if (!innerType) {
              console.warn(
                `Failed to find a suitable type for codec '${
                  sql.compile(source.codec.sqlType).text
                }'; not adding function field`,
              );
              return memo;
            }

            // TODO: nullability
            const type = source.codec.arrayOfCodec
              ? new GraphQLList(innerType)
              : innerType;

            const argDetails = (source.parameters as PgSourceParameter[])
              .slice(1)
              .map((param, index) => {
                const argName = build.inflection.argument({
                  param,
                  source,
                  index,
                });
                // TODO: nullability
                const inputType = getGraphQLTypeByPgCodec(param.codec, "input");
                return {
                  argName,
                  pgCodec: param.codec,
                  inputType,
                };
              });
            const args = argDetails.reduce((memo, { argName, inputType }) => {
              memo[argName] = {
                type: inputType,
              };
              return memo;
            }, {});

            const getSelectPlanFromRowAndArgs = EXPORTABLE(
              (argDetails, isNotNullish, pgSelect, source) =>
                (
                  $row: PgSelectSinglePlan<any, any, any, any>,
                  args: TrackedArguments<any>,
                ): PgSelectPlan<any, any, any, any> => {
                  const selectArgs: PgSelectArgumentSpec[] = [
                    { plan: $row.record() },
                    ...argDetails
                      .map(({ argName, pgCodec }) => {
                        const plan = args[argName];
                        if (!plan) {
                          return null;
                        }
                        return { plan, pgCodec };
                      })
                      .filter(isNotNullish),
                  ];
                  return pgSelect({
                    source,
                    identifiers: [],
                    args: selectArgs,
                  });
                },
              [argDetails, isNotNullish, pgSelect, source],
            );

            const isScalar = !source.codec.columns;
            if (source.isUnique) {
              const fieldName = build.inflection.computedColumn({ source });
              memo[fieldName] = fieldWithHooks(
                { fieldName },
                {
                  description: source.description,
                  type,
                  args,
                  plan: EXPORTABLE(
                    (getSelectPlanFromRowAndArgs) =>
                      function plan(
                        $row: PgSelectSinglePlan<any, any, any, any>,
                        args: TrackedArguments<any>,
                      ) {
                        const $select = getSelectPlanFromRowAndArgs($row, args);
                        return $select.single();
                      },
                    [getSelectPlanFromRowAndArgs],
                  ),
                },
              );
            } else {
              const behavior = getBehavior(source.extensions) ?? [
                source.codec.arrayOfCodec ? "list" : "connection",
              ];
              if (behavior.includes("connection")) {
                const fieldName = build.inflection.computedColumnConnection({
                  source,
                });
                const namedType = build.graphql.getNamedType(type);
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
                            );
                            return connection($select);
                          },
                        [connection, getSelectPlanFromRowAndArgs],
                      ),
                    },
                  );
                }
              }
              if (behavior.includes("list")) {
                const fieldName = build.inflection.computedColumnList({
                  source,
                });
                memo[fieldName] = fieldWithHooks(
                  { fieldName },
                  {
                    description: source.description,
                    // TODO: nullability
                    type: new build.graphql.GraphQLList(type),
                    args,
                    plan: EXPORTABLE(
                      (getSelectPlanFromRowAndArgs) =>
                        function plan(
                          $row: PgSelectSinglePlan<any, any, any, any>,
                          args: TrackedArguments<any>,
                        ) {
                          const $select = getSelectPlanFromRowAndArgs(
                            $row,
                            args,
                          );
                          return $select;
                        },
                      [getSelectPlanFromRowAndArgs],
                    ),
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
