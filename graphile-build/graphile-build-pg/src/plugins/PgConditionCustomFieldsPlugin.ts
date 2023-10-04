import "graphile-config";

import type {
  DefaultPgResource,
  PgConditionStep,
  PgResource,
  PgResourceParameter,
  PgSelectStep,
} from "@dataplan/pg";
import { EXPORTABLE } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface ScopeInputObjectFieldsField {
      isPgConnectionConditionInputField?: boolean;
      pgFieldSource?: PgResource<any, any, any, any, any>;
    }
  }
}

/**
 * Returns true for function sources that have at least one argument, all
 * arguments except the first are nullable, the first argument is a composite
 * type, and the result is a simple scalar type.
 */
export function isSimpleScalarComputedColumnLike(resource: DefaultPgResource) {
  if (resource.codec.attributes) return false;
  if (resource.codec.arrayOfCodec) return false;
  if (resource.codec.rangeOfCodec) return false;
  const parameters = resource.parameters;
  if (!parameters || parameters.length < 1) return false;
  if (parameters.some((p, i) => i > 0 && p.required)) return false;
  if (!parameters[0].codec.attributes) return false;
  if (!resource.isUnique) return false;
  return true;
}

export const PgConditionCustomFieldsPlugin: GraphileConfig.Plugin = {
  name: "PgConditionCustomFieldsPlugin",
  description:
    "Add GraphQL conditions based on 'filterable' PostgreSQL functions",
  version: version,
  after: ["PgAttributesPlugin"],

  schema: {
    entityBehavior: {
      pgResource: {
        provides: ["inferred"],
        after: ["default"],
        before: ["override"],
        callback(behavior, entity) {
          if (isSimpleScalarComputedColumnLike(entity)) {
            return [behavior, "-proc:filterBy"];
          } else {
            return behavior;
          }
        },
      },
    },
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
          !pgCodec.attributes ||
          pgCodec.isAnonymous
        ) {
          return fields;
        }

        const functionSources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((resource) => {
          if (!isSimpleScalarComputedColumnLike(resource)) return false;
          if (resource.parameters![0].codec !== pgCodec) return false;
          return build.behavior.pgResourceMatches(resource, "proc:filterBy");
        });

        return build.extend(
          fields,
          functionSources.reduce(
            (memo, rawPgFieldSource: DefaultPgResource) => {
              const pgFieldSource = rawPgFieldSource;
              const fieldName = inflection.computedAttributeField({
                resource: pgFieldSource,
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
                      fieldBehaviorScope: "proc:filterBy",
                      isPgConnectionConditionInputField: true,
                      pgFieldSource,
                    },
                    {
                      description: build.wrapDescription(
                        `Checks for equality with the object’s \`${fieldName}\` field.`,
                        "field",
                      ),
                      type,
                      applyPlan: EXPORTABLE(
                        (pgFieldSource, sql) =>
                          function plan(
                            $condition: PgConditionStep<PgSelectStep<any>>,
                            val,
                          ) {
                            if (typeof pgFieldSource.from !== "function") {
                              throw new Error(
                                "Invalid computed attribute 'from'",
                              );
                            }
                            const expression = sql`${pgFieldSource.from({
                              placeholder: $condition.alias,
                            })}`;
                            if (val.getRaw().evalIs(null)) {
                              $condition.where(sql`${expression} is null`);
                            } else {
                              $condition.where(
                                sql`${expression} = ${$condition.placeholder(
                                  val.get(),
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
                `Adding computed attribute condition argument for ${pgCodec.name}`,
              );
              return memo;
            },
            Object.create(null),
          ),
          `Adding computed attribute filterable functions to condition for '${pgCodec.name}'`,
        );
      },
    },
  },
};
