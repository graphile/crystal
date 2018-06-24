// @flow
import type { Plugin } from "graphile-build";
import isString from "lodash/isString";

export default (function PgMutationPayloadEdgePlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      getTypeByName,
      pgGetGqlTypeByTypeIdAndModifier,
      pgSql: sql,
      graphql: { GraphQLList, GraphQLNonNull },
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      inflection,
      pgOmit: omit,
    } = build;
    const {
      scope: { isMutationPayload, pgIntrospection, pgIntrospectionTable },
      fieldWithHooks,
      recurseDataGeneratorsForField,
      Self,
    } = context;
    const table = pgIntrospectionTable || pgIntrospection;
    if (
      !isMutationPayload ||
      !table ||
      table.kind !== "class" ||
      !table.namespace ||
      !table.isSelectable ||
      (omit(table, "all") && omit(table, "many"))
    ) {
      return fields;
    }
    const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
    const tableTypeName = TableType.name;
    const TableOrderByType = getTypeByName(
      inflection.orderByType(tableTypeName)
    );
    const TableEdgeType = getTypeByName(inflection.edge(tableTypeName));
    if (!TableEdgeType) {
      return fields;
    }

    const attributes = introspectionResultsByKind.attribute.filter(
      attr => attr.classId === table.id
    );
    const primaryKeyConstraint = introspectionResultsByKind.constraint
      .filter(con => con.classId === table.id)
      .filter(con => con.type === "p")[0];
    const primaryKeys =
      primaryKeyConstraint &&
      primaryKeyConstraint.keyAttributeNums.map(
        num => attributes.filter(attr => attr.num === num)[0]
      );
    const canOrderBy = !omit(table, "order");

    const fieldName = inflection.edgeField(table);
    recurseDataGeneratorsForField(fieldName);
    return extend(
      fields,
      {
        [fieldName]: fieldWithHooks(
          fieldName,
          ({ addArgDataGenerator }) => {
            addArgDataGenerator(function connectionOrderBy({
              orderBy: rawOrderBy,
            }) {
              const orderBy =
                canOrderBy && rawOrderBy
                  ? Array.isArray(rawOrderBy) ? rawOrderBy : [rawOrderBy]
                  : null;
              return {
                pgQuery: queryBuilder => {
                  if (orderBy != null) {
                    const aliases = [];
                    const expressions = [];
                    let unique = false;
                    orderBy.forEach(item => {
                      const { alias, specs, unique: itemIsUnique } = item;
                      unique = unique || itemIsUnique;
                      const orders = Array.isArray(specs[0]) ? specs : [specs];
                      orders.forEach(([col, _ascending]) => {
                        if (!col) {
                          return;
                        }
                        const expr = isString(col)
                          ? sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                              col
                            )}`
                          : col;
                        expressions.push(expr);
                      });
                      if (alias == null) return;
                      aliases.push(alias);
                    });
                    if (!unique && primaryKeys) {
                      // Add PKs
                      primaryKeys.forEach(key => {
                        expressions.push(
                          sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                            key.name
                          )}`
                        );
                      });
                    }
                    if (aliases.length) {
                      queryBuilder.select(
                        sql.fragment`json_build_array(${sql.join(
                          aliases.map(
                            a => sql.fragment`${sql.literal(a)}::text`
                          ),
                          ", "
                        )}, json_build_array(${sql.join(expressions, ", ")}))`,
                        "__order_" + aliases.join("__")
                      );
                    }
                  }
                },
              };
            });

            const defaultValueEnum =
              canOrderBy &&
              (TableOrderByType.getValues().find(
                v => v.name === "PRIMARY_KEY_ASC"
              ) ||
                TableOrderByType.getValues()[0]);
            return {
              description: `An edge for our \`${tableTypeName}\`. May be used by Relay 1.`,
              type: TableEdgeType,
              args: canOrderBy
                ? {
                    orderBy: {
                      description: `The method to use when ordering \`${tableTypeName}\`.`,
                      type: new GraphQLList(
                        new GraphQLNonNull(TableOrderByType)
                      ),
                      defaultValue: defaultValueEnum && defaultValueEnum.value,
                    },
                  }
                : {},
              resolve(data, { orderBy: rawOrderBy }) {
                const orderBy =
                  canOrderBy && rawOrderBy
                    ? Array.isArray(rawOrderBy) ? rawOrderBy : [rawOrderBy]
                    : null;
                const order =
                  orderBy && orderBy.some(item => item.alias)
                    ? orderBy.filter(item => item.alias)
                    : null;

                if (!order) {
                  if (data.data.__identifiers) {
                    return Object.assign({}, data.data, {
                      __cursor: ["primary_key_asc", data.data.__identifiers],
                    });
                  } else {
                    return data.data;
                  }
                }
                return Object.assign({}, data.data, {
                  __cursor:
                    data.data[
                      `__order_${order.map(item => item.alias).join("__")}`
                    ],
                });
              },
            };
          },
          {
            isPgMutationPayloadEdgeField: true,
            pgFieldIntrospection: table,
          }
        ),
      },
      `Adding edge field to mutation payload '${Self.name}'`
    );
  });
}: Plugin);
