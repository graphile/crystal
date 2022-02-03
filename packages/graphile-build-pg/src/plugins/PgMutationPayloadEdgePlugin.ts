import "graphile-build";

import type {
  PgClassSinglePlan,
  PgDeletePlan,
  PgInsertPlan,
  PgSelectSinglePlan,
  PgSource,
  PgSourceRelation,
  PgSourceUnique,
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
import { inspect } from "util";

import { getBehavior } from "../behavior";
import { version } from "../index";
import type { PgClass, PgNamespace } from "../introspection";
import { applyOrderToPlan } from "./PgConnectionArgOrderByPlugin";

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

        const pk = (source.uniques as PgSourceUnique[])?.find(
          (u) => u.isPrimary,
        );
        if (!pk) {
          return fields;
        }
        const pkColumns = pk.columns;

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
                // TODO: review this plan, it feels overly complex and somewhat hacky.
                plan: EXPORTABLE(
                  (
                    EdgePlan,
                    TableOrderByType,
                    applyOrderToPlan,
                    connection,
                    constant,
                    pkColumns,
                    source,
                  ) =>
                    function plan(
                      $mutation: ObjectPlan<{
                        record: PgClassSinglePlan<any, any, any, any>;
                      }>,
                      args: TrackedArguments,
                    ) {
                      const $record = $mutation.getPlanForKey("record", true);
                      if (!$record) return constant(null);

                      const spec = pkColumns.reduce((memo, columnName) => {
                        memo[columnName] = $record.get(columnName);
                        return memo;
                      }, {});
                      const $select = source.find(spec);

                      // Perform ordering
                      const $value = args.orderBy;
                      applyOrderToPlan($select, $value, TableOrderByType);

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
                    applyOrderToPlan,
                    connection,
                    constant,
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
