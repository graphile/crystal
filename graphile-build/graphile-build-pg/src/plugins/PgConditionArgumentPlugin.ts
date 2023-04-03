import "./PgTablesPlugin.js";
import "graphile-config";

import type {
  PgCodecWithColumns,
  PgConditionStep,
  PgSelectParsedCursorStep,
  PgSelectSingleStep,
  PgSelectStep,
} from "@dataplan/pg";
import type { ConnectionStep } from "grafast";
import { EXPORTABLE } from "graphile-export";
import type { GraphQLInputObjectType, GraphQLInputType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      conditionType(this: Inflection, typeName: string): string;
    }
    interface ScopeInputObject {
      isPgCondition?: boolean;
    }
    interface ScopeInputObjectFieldsField {
      isPgConnectionConditionInputField?: boolean;
    }
  }
}

export const PgConditionArgumentPlugin: GraphileConfig.Plugin = {
  name: "PgConditionArgumentPlugin",
  description: "Adds the 'condition' argument to connections and lists",
  version: version,

  inflection: {
    add: {
      conditionType(options, typeName) {
        return this.upperCamelCase(`${typeName}-condition`);
      },
    },
  },

  schema: {
    hooks: {
      init(_, build) {
        const { inflection, sql } = build;
        for (const rawCodec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            // Ignore scalar codecs
            if (!rawCodec.columns || rawCodec.isAnonymous) {
              return;
            }
            const codec = rawCodec as PgCodecWithColumns;

            const behavior = getBehavior(codec.extensions);
            // TODO: do we want this filter here? E.g. we might want to enable a bulk delete mutation without allowing any selects?
            if (!build.behavior.matches(behavior, "select", "select")) {
              return;
            }

            const tableTypeName = inflection.tableType(codec);
            const conditionName = inflection.conditionType(tableTypeName);
            /* const TableConditionType = */
            build.registerInputObjectType(
              conditionName,
              {
                isPgCondition: true,
                pgCodec: codec,
              },

              () => ({
                description: build.wrapDescription(
                  `A condition to be used against \`${tableTypeName}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
                  "type",
                ),
                fields: (context) => {
                  const { fieldWithHooks } = context;
                  const columns = codec.columns;
                  // TODO: move this to a separate plugin
                  return Object.entries(columns).reduce(
                    (memo, [columnName, column]) => {
                      const behavior = getBehavior([
                        codec.extensions,
                        column.extensions,
                      ]);
                      if (
                        !build.behavior.matches(
                          behavior,
                          "attribute:filterBy",
                          "filterBy",
                        )
                      ) {
                        return memo;
                      }

                      // TODO: add `attribute:filterBy:array`/`:range` ?

                      const fieldName = inflection.column({
                        columnName,
                        codec,
                      });
                      const type = build.getGraphQLTypeByPgCodec(
                        column.codec,
                        "input",
                      );
                      if (!type) {
                        return memo;
                      }
                      memo = build.extend(
                        memo,
                        {
                          [fieldName]: fieldWithHooks(
                            {
                              fieldName,
                              fieldBehaviorScope: "attribute:filterBy",
                              isPgConnectionConditionInputField: true,
                            },
                            {
                              description: build.wrapDescription(
                                `Checks for equality with the object’s \`${fieldName}\` field.`,
                                "field",
                              ),
                              type: type as GraphQLInputType,
                              applyPlan: EXPORTABLE(
                                (column, columnName, sql) =>
                                  function plan(
                                    $condition: PgConditionStep<
                                      PgSelectStep<any>
                                    >,
                                    val,
                                  ) {
                                    if (val.getRaw().evalIs(null)) {
                                      $condition.where({
                                        type: "attribute",
                                        attribute: columnName,
                                        callback: (expression) =>
                                          sql`${expression} is null`,
                                      });
                                    } else {
                                      $condition.where({
                                        type: "attribute",
                                        attribute: columnName,
                                        callback: (expression) =>
                                          sql`${expression} = ${$condition.placeholder(
                                            val.get(),
                                            column.codec,
                                          )}`,
                                      });
                                    }
                                  },
                                [column, columnName, sql],
                              ),
                            },
                          ),
                        },
                        `Adding condition argument for ${codec.name}' ${columnName} column`,
                      );
                      return memo;
                    },
                    Object.create(null),
                  );
                },
              }),
              `Adding condition type for ${codec.name}.`,
              // TODO:
              /* `You can rename the table's GraphQL type via a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                table,
                {
                  name: "newNameHere",
                },
              )}`, */
            );
          });
        }
        return _;
      },

      GraphQLObjectType_fields_field_args(args, build, context) {
        const { scope, Self } = context;

        const {
          fieldName,
          fieldBehaviorScope,
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgResource,
          pgFieldCodec,
        } = scope;

        const shouldAddCondition =
          isPgFieldConnection || isPgFieldSimpleCollection;

        const codec = pgFieldCodec ?? pgResource?.codec;
        const isSuitableSource =
          pgResource && pgResource.codec.columns && !pgResource.isUnique;
        const isSuitableCodec =
          codec &&
          (isSuitableSource ||
            (!pgResource && codec?.polymorphism?.mode === "union")) &&
          codec.columns;

        if (!shouldAddCondition || !isSuitableCodec) {
          return args;
        }

        const behavior = getBehavior([
          scope,
          codec?.extensions,
          pgResource?.extensions,
        ]);
        if (
          !build.behavior.matches(
            behavior,
            fieldBehaviorScope ? `${fieldBehaviorScope}:filter` : `filter`,
            pgResource?.parameters ? "" : "filter",
          )
        ) {
          return args;
        }

        const tableTypeName = build.inflection.tableType(codec);
        const tableConditionTypeName =
          build.inflection.conditionType(tableTypeName);
        const tableConditionType = build.getTypeByName(
          tableConditionTypeName,
        ) as GraphQLInputObjectType | undefined;
        if (!tableConditionType) {
          return args;
        }

        return build.extend(
          args,
          {
            condition: {
              description: build.wrapDescription(
                "A condition to be used in determining which values should be returned by the collection.",
                "arg",
              ),
              type: tableConditionType,
              applyPlan: isPgFieldConnection
                ? (
                    _condition,
                    $connection: ConnectionStep<
                      PgSelectSingleStep<any>,
                      PgSelectParsedCursorStep,
                      PgSelectStep<any>
                    >,
                  ) => {
                    const $select = $connection.getSubplan();
                    return $select.wherePlan();
                  }
                : (_condition, $select: PgSelectStep<any>) => {
                    return $select.wherePlan();
                  },
            },
          },
          `Adding condition to connection field '${fieldName}' of '${Self.name}'`,
        );
      },
    },
  },
};
