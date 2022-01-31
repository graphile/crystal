import "graphile-build";

import { inspect } from "util";
import type {
  PgClassSinglePlan,
  PgDeletePlan,
  PgInsertPlan,
  PgSelectSinglePlan,
  PgSource,
  PgSourceRelation,
  PgTypeCodec,
  PgUpdatePlan,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import type { ObjectPlan, TrackedArguments } from "graphile-crystal";
import {
  connection,
  EdgePlan,
  first,
  getEnumValueConfig,
  ListPlan,
} from "graphile-crystal";
import { access, constant, list } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import type {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";
import sql from "pg-sql2";

import { getBehavior } from "../behavior";
import { version } from "../index";
import type { PgClass, PgNamespace } from "../introspection";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      // TODO: move this somewhere more shared
      edgeField(this: Inflection, typeName: string): string;
    }

    interface ScopeGraphQLObjectTypeFieldsField {
      isPgMutationPayloadEdgeField?: boolean;
    }
  }
}

interface State {}
interface Cache {}

export const PgMutationPayloadEdgePlugin: Plugin = {
  name: "PgMutationPayloadEdgePlugin",
  description:
    "Adds 'edge' field to mutation payloads to aid with Relay pagination",
  version: version,

  inflection: {
    add: {
      edgeField(options, typeName) {
        return this.camelCase(this.edgeType(typeName));
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          extend,
          getTypeByName,
          sql,
          graphql: { GraphQLList, GraphQLNonNull },
          inflection,
        } = build;
        const {
          scope: { isMutationPayload, pgCodec },
          fieldWithHooks,
          Self,
        } = context;

        if (
          !isMutationPayload ||
          !pgCodec ||
          !pgCodec.columns ||
          pgCodec.isAnonymous
        ) {
          return fields;
        }

        const behavior = getBehavior(pgCodec.extensions);
        if (behavior && !behavior.includes("connection")) {
          return fields;
        }

        const sources = build.input.pgSources.filter((source) => {
          if (source.codec !== pgCodec) return false;
          if (source.parameters) return false;
          return true;
        });

        if (sources.length !== 1) {
          return fields;
        }

        const source = sources[0];

        const pkColumns = source.uniques?.[0] as string[] | undefined;
        if (!pkColumns) {
          return fields;
        }

        const TableType = build.getGraphQLTypeByPgCodec(pgCodec, "output") as
          | GraphQLObjectType<any, any>
          | undefined;
        if (!TableType) {
          return fields;
        }

        const tableTypeName = TableType.name;
        const TableOrderByType = getTypeByName(
          inflection.orderByType(tableTypeName),
        ) as GraphQLEnumType | undefined;
        if (!TableOrderByType) {
          return fields;
        }
        const TableEdgeType = getTypeByName(
          inflection.edgeType(tableTypeName),
        ) as GraphQLObjectType | undefined;
        if (!TableEdgeType) {
          return fields;
        }

        const fieldName = inflection.edgeField(tableTypeName);
        const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
        const defaultValueEnum =
          TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
          TableOrderByType.getValues()[0];

        return extend(
          fields,
          {
            [fieldName]: fieldWithHooks(
              {
                fieldName,
                isPgMutationPayloadEdgeField: true,
                pgCodec: pgCodec,
              },
              () => ({
                description: build.wrapDescription(
                  `An edge for our \`${tableTypeName}\`. May be used by Relay 1.`,
                  "field",
                ),
                type: TableEdgeType,
                args: {
                  orderBy: {
                    description: build.wrapDescription(
                      `The method to use when ordering \`${tableTypeName}\`.`,
                      "arg",
                    ),
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(TableOrderByType)),
                    ),
                    defaultValue: defaultValueEnum
                      ? [defaultValueEnum.value]
                      : null,
                  },
                },
                plan: EXPORTABLE(
                  (
                    EdgePlan,
                    TableOrderByType,
                    connection,
                    constant,
                    getEnumValueConfig,
                    pkColumns,
                    source,
                  ) =>
                    function plan(
                      $mutation: ObjectPlan<{
                        record: PgClassSinglePlan<any, any, any, any>;
                      }>,
                      args: TrackedArguments,
                    ) {
                      // TODO: review this plan, it feels overly complex and somewhat hacky.

                      const $record = $mutation.getPlanForKey("record", true);
                      if (!$record) {
                        return constant(null);
                      }
                      const spec = pkColumns.reduce((memo, columnName) => {
                        memo[columnName] = $record.get(columnName);
                        return memo;
                      }, {});
                      const $select = source.find(spec);

                      // Perform ordering
                      const $value = args.orderBy;
                      const val = $value.eval();
                      if (!Array.isArray(val)) {
                        throw new Error("Invalid!");
                      }
                      val.forEach((order) => {
                        const config = getEnumValueConfig(
                          TableOrderByType,
                          order,
                        );
                        const plan = config?.extensions?.graphile?.plan;
                        if (typeof plan !== "function") {
                          console.error(
                            `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
                              plan,
                            )}`,
                          );
                          throw new Error(
                            "Internal server error: invalid orderBy configuration",
                          );
                        }
                        plan($select);
                      });

                      const $connection = connection(
                        $select,
                        ($item) => $item,
                        ($item: PgSelectSinglePlan<any, any, any, any>) =>
                          $item.cursor(),
                      ) as any;
                      const $single = $select.single();
                      return new EdgePlan($connection, $single);
                    },
                  [
                    EdgePlan,
                    TableOrderByType,
                    connection,
                    constant,
                    getEnumValueConfig,
                    pkColumns,
                    source,
                  ],
                ),
              }),
            ),
          },
          `Adding edge field for table ${pgCodec.name} to mutation payload '${Self.name}'`,
        );
      },
    },
  },
};
