import type {
  PgConditionPlan,
  PgSelectPlan,
  PgSource,
  PgSourceParameter,
} from "@dataplan/pg";
import type { InputPlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { Plugin } from "graphile-plugin";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileBuild {
    interface ScopeGraphQLInputObjectTypeFieldsField {
      isPgConnectionConditionInputField?: boolean;
      pgFieldSource?: PgSource<any, any, any, any>;
    }
  }
}

export const PgConditionCustomFieldsPlugin: Plugin = {
  name: "PgConditionCustomFieldsPlugin",
  description:
    "Add GraphQL conditions based on 'filterable' PostgreSQL functions",
  version: version,

  schema: {
    hooks: {
      GraphQLInputObjectType_fields(fields, build, context) {
        const { inflection, sql } = build;
        const {
          scope: { isPgCondition, pgCodec },
          fieldWithHooks,
        } = context;
        if (
          !isPgCondition ||
          !pgCodec ||
          !pgCodec.columns ||
          pgCodec.isAnonymous
        ) {
          return fields;
        }

        const functionSources = build.input.pgSources.filter((source) => {
          if (source.codec.columns) return false;
          if (source.codec.arrayOfCodec) return false;
          if (source.codec.rangeOfCodec) return false;
          const parameters: PgSourceParameter[] | undefined = source.parameters;
          if (!parameters) return false;
          if (parameters.filter((p) => p.required).length !== 1) return false;
          if (parameters[0].codec !== pgCodec) return false;
          if (!source.isUnique) return false;
          const behavior = getBehavior(source.extensions);
          if (behavior && !behavior.includes("filterBy")) {
            return false;
          }
          return true;
        });

        return build.extend(
          fields,
          functionSources.reduce((memo, pgFieldSource) => {
            const fieldName = inflection.computedColumn({
              source: pgFieldSource,
            });
            const type = build.getGraphQLTypeByPgCodec(
              pgFieldSource.codec,
              "input",
            );
            if (!type) return memo;
            memo = build.extend(
              memo,
              {
                [fieldName]: fieldWithHooks(
                  {
                    fieldName,
                    isPgConnectionConditionInputField: true,
                    pgFieldSource,
                  },
                  {
                    description: build.wrapDescription(
                      `Checks for equality with the object’s \`${fieldName}\` field.`,
                      "field",
                    ),
                    type,
                    plan: EXPORTABLE(
                      (pgFieldSource, sql) =>
                        function plan(
                          $condition: PgConditionPlan<
                            PgSelectPlan<any, any, any, any>
                          >,
                          $value: InputPlan,
                        ) {
                          if (typeof pgFieldSource.source !== "function") {
                            throw new Error("Invalid computed column source");
                          }
                          const expression = sql`${pgFieldSource.source(
                            $condition.alias,
                          )}`;
                          if ($value.evalIs(null)) {
                            $condition.where(sql`${expression} is null`);
                          } else {
                            $condition.where(
                              sql`${expression} = ${$condition.placeholder(
                                $value,
                                pgFieldSource.codec,
                              )}`,
                            );
                          }
                        },
                      [pgFieldSource, sql],
                    ),
                  },
                ),
              },
              `Adding computed column condition argument for ${pgCodec.name}`,
            );
            return memo;
          }, {}),
          `Adding computed column filterable functions to condition for '${pgCodec.name}'`,
        );

        return fields;
      },
    },
  },
};
