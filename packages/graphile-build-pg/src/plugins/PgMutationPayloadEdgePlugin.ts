import isString from "lodash/isString";
import { SQL } from "../QueryBuilder";
import { OrderByValue, OrderBySpec } from "./PgConnectionArgOrderBy";
import { PgEntityKind } from "./PgIntrospectionPlugin";

declare global {
  namespace GraphileEngine {
    interface GraphileBuildOptions {
      disableIssue397Fix?: boolean;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgMutationPayloadEdgeField?: boolean;
    }
  }
}

function isOrderBySpecArray(
  specs: OrderBySpec | OrderBySpec[],
): specs is OrderBySpec[] {
  return Array.isArray(specs[0]);
}

export default (function PgMutationPayloadEdgePlugin(
  builder,
  { pgSimpleCollections, disableIssue397Fix },
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        getSafeAliasFromResolveInfo,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        pgSql: sql,
        graphql: {
          GraphQLList,
          GraphQLNonNull,
          getNamedType,
          GraphQLEnumType,
          GraphQLObjectType,
        },
        inflection,
        pgOmit: omit,
        describePgEntity,
        pgField,
      } = build;
      const {
        scope: { isMutationPayload, pgIntrospection, pgIntrospectionTable },
        fieldWithHooks,
        Self,
      } = context;

      const table = pgIntrospectionTable || pgIntrospection;
      if (
        !isMutationPayload ||
        !pgIntrospection ||
        !table ||
        table.kind !== PgEntityKind.CLASS ||
        !table.namespace ||
        !table.isSelectable ||
        (omit(table, "all") && omit(table, "many"))
      ) {
        return fields;
      }
      if (
        pgIntrospection.kind === "procedure" &&
        (pgIntrospection.returnTypeId !== table.typeId ||
          pgIntrospection.returnsSet)
      ) {
        return fields;
      }
      const simpleCollections =
        table.tags.simpleCollections || pgSimpleCollections;
      const hasConnections = simpleCollections !== "only";
      if (!hasConnections && !disableIssue397Fix) {
        return fields;
      }

      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      if (!TableType) {
        return fields;
      }
      const tableTypeName = getNamedType(TableType).name;
      const TableOrderByType = getTypeByName(
        inflection.orderByType(tableTypeName),
      );

      const TableEdgeType = getTypeByName(inflection.edge(tableTypeName));
      if (!TableEdgeType || !(TableEdgeType instanceof GraphQLObjectType)) {
        return fields;
      }

      const primaryKeyConstraint = table.primaryKeyConstraint;
      const primaryKeys =
        primaryKeyConstraint && primaryKeyConstraint.keyAttributes;
      const canOrderBy = !omit(table, "order");

      const fieldName = inflection.edgeField(table);
      const defaultValueEnum =
        canOrderBy &&
        TableOrderByType instanceof GraphQLEnumType &&
        (TableOrderByType.getValues().find(
          (v) => v.name === "PRIMARY_KEY_ASC",
        ) ||
          TableOrderByType.getValues()[0]);
      return extend(
        fields,
        {
          [fieldName]: pgField(
            build,
            fieldWithHooks,
            fieldName,
            {
              description: `An edge for our \`${tableTypeName}\`. May be used by Relay 1.`,
              type: TableEdgeType,
              args:
                canOrderBy && TableOrderByType instanceof GraphQLEnumType
                  ? {
                      orderBy: {
                        description: `The method to use when ordering \`${tableTypeName}\`.`,
                        type: new GraphQLList(
                          new GraphQLNonNull(TableOrderByType),
                        ),

                        defaultValue: defaultValueEnum
                          ? [defaultValueEnum.value]
                          : null,
                      },
                    }
                  : {},
              resolve(data, { orderBy: rawOrderBy }, _context, resolveInfo) {
                if (!data.data) {
                  return null;
                }
                const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                const edge = data.data[safeAlias];
                if (!edge) {
                  return null;
                }
                const orderBy =
                  canOrderBy && rawOrderBy
                    ? Array.isArray(rawOrderBy)
                      ? rawOrderBy
                      : [rawOrderBy]
                    : null;
                const order =
                  orderBy && orderBy.some((item) => item.alias)
                    ? orderBy.filter((item) => item.alias)
                    : null;

                if (!order) {
                  if (edge.__identifiers) {
                    return {
                      ...edge,
                      __cursor: ["primary_key_asc", edge.__identifiers],
                    };
                  } else {
                    return edge;
                  }
                }

                return {
                  ...edge,
                  __cursor:
                    edge[
                      `__order_${order.map((item) => item.alias).join("__")}`
                    ],
                };
              },
            },

            {
              isPgMutationPayloadEdgeField: true,
              pgFieldIntrospection: table,
            },

            false,
            {
              withQueryBuilder(queryBuilder, { parsedResolveInfoFragment }) {
                const {
                  args: { orderBy: rawOrderBy },
                } = parsedResolveInfoFragment;
                const orderBy: OrderByValue[] | null =
                  canOrderBy && rawOrderBy
                    ? Array.isArray(rawOrderBy)
                      ? rawOrderBy
                      : [rawOrderBy]
                    : null;
                if (orderBy != null) {
                  const aliases: string[] = [];
                  const expressions: SQL[] = [];
                  let unique = false;
                  orderBy.forEach((item) => {
                    const { alias, specs, unique: itemIsUnique } = item;
                    unique = unique || itemIsUnique || false;
                    const orders: OrderBySpec[] = isOrderBySpecArray(specs)
                      ? specs
                      : [specs];
                    orders.forEach(([col, _ascending]: OrderBySpec) => {
                      if (!col) {
                        return;
                      }
                      const expr = isString(col)
                        ? sql`${queryBuilder.getTableAlias()}.${sql.identifier(
                            col,
                          )}`
                        : col;
                      expressions.push(expr);
                    });
                    if (alias == null) return;
                    aliases.push(alias);
                  });
                  if (!unique && primaryKeys) {
                    // Add PKs
                    primaryKeys.forEach((key) => {
                      expressions.push(
                        sql`${queryBuilder.getTableAlias()}.${sql.identifier(
                          key.name,
                        )}`,
                      );
                    });
                  }
                  if (aliases.length) {
                    queryBuilder.select(
                      sql`json_build_array(${sql.join(
                        aliases.map((a) => sql`${sql.literal(a)}::text`),
                        ", ",
                      )}, json_build_array(${sql.join(expressions, ", ")}))`,
                      "__order_" + aliases.join("__"),
                    );
                  }
                }
              },
            },
          ),
        },

        `Adding edge field for table ${describePgEntity(
          table,
        )} to mutation payload '${Self.name}'`,
      );
    },
    ["PgMutationPayloadEdge"],
  );
} as GraphileEngine.Plugin);
