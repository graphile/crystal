// This used to be called "computed columns", but they're not the same as
// Postgres' own computed columns, and they're not necessarily column-like
// (e.g. they can be relations to other tables), so we've renamed them.

import type {
  PgSelectSinglePlan,
  PgSource,
  PgSourceParameter,
} from "@dataplan/pg";
import { pgSelect } from "@dataplan/pg";
import type { Plugin } from "graphile-plugin";
import type { GraphQLOutputType } from "graphql";
import type { PgSelectArgumentSpec } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-exporter";

import { getBehavior } from "../behavior";
import { version } from "../index";
import { TrackedArguments } from "graphile-crystal/src/interfaces";

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
        const { getGraphQLTypeByPgCodec } = build;
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
            const type = getGraphQLTypeByPgCodec(source.codec, "output") as
              | GraphQLOutputType
              | undefined;
            if (!type) {
              return memo;
            }
            const fieldName = build.inflection.computedColumn({ source });
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
            memo[fieldName] = fieldWithHooks(
              {
                fieldName,
              },
              {
                description: source.description,
                type,
                args,
                plan: EXPORTABLE(
                  (argDetails, isNotNullish, pgSelect, source) =>
                    function plan(
                      $row: PgSelectSinglePlan<any, any, any, any>,
                      args: TrackedArguments<any>,
                    ) {
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
                      })
                        .single()
                        .getSelfNamed();
                    },
                  [argDetails, isNotNullish, pgSelect, source],
                ),
              },
            );
            return memo;
          }, {}),
          `Adding custom type field for ${Self.name}`,
        );
      },
    },
  },
};
