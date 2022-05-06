import "graphile-build";

import type { PgClassSinglePlan, PgSourceUnique } from "@dataplan/pg";
import type { ObjectPlan, TrackedArguments } from "dataplanner";
import { connection, constant, EdgePlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { Plugin } from "graphile-plugin";
import type {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

import { getBehavior } from "../behavior";
import { version } from "../index";
import { applyOrderToPlan } from "./PgConnectionArgOrderByPlugin";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      // TODO: move this somewhere more shared
      edgeField(this: Inflection, typeName: string): string;
    }

    interface ScopeGraphQLObjectTypeFieldsField {
      isPgMutationPayloadEdgeField?: boolean;
    }
  }
}

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
          graphql: { GraphQLList, GraphQLNonNull },
          inflection,
          options: { simpleCollections },
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

        const behavior =
          getBehavior(pgCodec.extensions) ??
          (simpleCollections === "both"
            ? ["connection", "list"]
            : simpleCollections === "only"
            ? ["list"]
            : ["connection"]);
        if (!behavior.includes("connection")) {
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
        const tableOrderByTypeName = inflection.orderByType(tableTypeName);
        const TableOrderByType = getTypeByName(tableOrderByTypeName) as
          | GraphQLEnumType
          | undefined;
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
                    applyOrderToPlan,
                    connection,
                    constant,
                    pkColumns,
                    source,
                    tableOrderByTypeName,
                  ) =>
                    function plan(
                      $mutation: ObjectPlan<{
                        record: PgClassSinglePlan<any, any, any, any>;
                      }>,
                      args: TrackedArguments,
                      info: { schema: GraphQLSchema },
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
                      applyOrderToPlan(
                        $select,
                        $value,
                        info.schema.getType(
                          tableOrderByTypeName,
                        ) as GraphQLEnumType,
                      );

                      const $connection = connection($select) as any;
                      const $single = $select.single();
                      return new EdgePlan($connection, $single);
                    },
                  [
                    EdgePlan,
                    applyOrderToPlan,
                    connection,
                    constant,
                    pkColumns,
                    source,
                    tableOrderByTypeName,
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
