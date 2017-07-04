const queryFromResolveData = require("../queryFromResolveData");
const {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLObjectType,
} = require("graphql");
const debugSql = require("debug")("graphql-build-pg:sql");

module.exports = async function PgMutationUpdateRowByUniqueConstraintPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        buildObjectWithHooks,
        extend,
        parseResolveInfo,
        getTypeByName,
        gql2pg,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
      },
      { scope: { isRootMutation }, buildFieldWithHooks }
    ) => {
      if (!isRootMutation) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          const TableType = getTypeByName(
            inflection.tableType(table.name, table.namespace.name)
          );
          const sqlFullTableName = sql.identifier(
            table.namespace.name,
            table.name
          );
          if (TableType) {
            const uniqueConstraints = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => ["u", "p"].includes(con.type));
            const attributes = introspectionResultsByKind.attribute
              .filter(attr => attr.classId === table.id)
              .sort((a, b) => a.num - b.num);
            const Table = getTypeByName(
              inflection.tableType(table.name, table.namespace.name)
            );
            const TablePatch = getTypeByName(inflection.patchType(Table.name));
            const PayloadType = buildObjectWithHooks(
              GraphQLObjectType,
              {
                name: inflection.updatePayloadType(
                  table.name,
                  table.namespace.name
                ),
                fields: ({ recurseDataGeneratorsForField }) => {
                  const tableName = inflection.tableName(
                    table.name,
                    table.namespace.name
                  );
                  recurseDataGeneratorsForField(tableName);
                  return {
                    clientMutationId: {
                      type: GraphQLString,
                      resolve(data) {
                        return data.__clientMutationId;
                      },
                    },
                    [tableName]: {
                      type: Table,
                      resolve(data) {
                        return data;
                      },
                    },
                  };
                },
              },
              {
                isMutationPayload: true,
                isPgUpdatePayloadType: true,
                pgIntrospection: table,
              }
            );
            uniqueConstraints.forEach(constraint => {
              const keys = constraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
              if (!keys.every(_ => _)) {
                throw new Error(
                  "Consistency error: could not find an attribute!"
                );
              }
              const simpleKeys = keys.map(k => ({
                column: k.name,
                table: k.class.name,
                schema: k.class.namespace.name,
              }));
              const fieldName = inflection.updateByKeys(
                simpleKeys,
                table.name,
                table.namespace.name
              );
              const InputType = buildObjectWithHooks(
                GraphQLInputObjectType,
                {
                  name: inflection.updateByKeysInputType(
                    simpleKeys,
                    table.name,
                    table.namespace.name
                  ),
                  fields: Object.assign(
                    {
                      clientMutationId: {
                        type: GraphQLString,
                      },
                      [inflection.patchField(
                        inflection.tableName(table.name, table.namespace.name)
                      )]: {
                        type: new GraphQLNonNull(TablePatch),
                      },
                    },
                    keys.reduce((memo, key) => {
                      memo[
                        inflection.column(
                          key.name,
                          key.class.name,
                          key.class.namespace.name
                        )
                      ] = {
                        type: new GraphQLNonNull(
                          gqlInputTypeByTypeId[key.typeId]
                        ),
                      };
                      return memo;
                    }, {})
                  ),
                },
                {
                  isPgUpdateInputType: true,
                  isPgUpdateByKeysInputType: true,
                  pgInflection: table,
                  pgKeys: keys,
                }
              );

              memo[
                fieldName
              ] = buildFieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    type: PayloadType,
                    args: {
                      input: {
                        type: new GraphQLNonNull(InputType),
                      },
                    },
                    async resolve(
                      parent,
                      { input },
                      { pgClient },
                      resolveInfo
                    ) {
                      const parsedResolveInfoFragment = parseResolveInfo(
                        resolveInfo
                      );
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment,
                        PayloadType
                      );
                      const updatedRowAlias = sql.identifier(Symbol());
                      const query = queryFromResolveData(
                        updatedRowAlias,
                        updatedRowAlias,
                        resolveData,
                        {}
                      );
                      const sqlColumns = [];
                      const sqlValues = [];
                      const inputData =
                        input[
                          inflection.patchField(
                            inflection.tableName(
                              table.name,
                              table.namespace.name
                            )
                          )
                        ];
                      introspectionResultsByKind.attribute
                        .filter(attr => attr.classId === table.id)
                        .forEach(attr => {
                          const fieldName = inflection.column(
                            attr.name,
                            table.name,
                            table.namespace.name
                          );
                          const val = inputData[fieldName];
                          if (val != null) {
                            sqlColumns.push(sql.identifier(attr.name));
                            sqlValues.push(gql2pg(val, attr.type));
                          }
                        });
                      if (sqlColumns.length === 0) {
                        return null;
                      }
                      const queryWithUpdate = sql.query`
                        with ${updatedRowAlias} as (
                          update ${sql.identifier(
                            table.namespace.name,
                            table.name
                          )} set ${sql.join(
                        sqlColumns.map(
                          (col, i) => sql.fragment`${col} = ${sqlValues[i]}`
                        ),
                        ", "
                      )}
                          where ${sql.join(
                            keys.map(
                              key =>
                                sql.fragment`${sql.identifier(
                                  key.name
                                )} = ${gql2pg(
                                  input[
                                    inflection.column(
                                      key.name,
                                      key.class.name,
                                      key.class.namespace.name
                                    )
                                  ],
                                  key.type
                                )}`
                            ),
                            " AND "
                          )}
                          returning *
                        ) ${query}
                        `;
                      const { text, values } = sql.compile(queryWithUpdate);
                      if (debugSql.enabled) {
                        debugSql(require("sql-formatter").format(text));
                        debugSql(values);
                      }
                      const { rows: [row] } = await pgClient.query(
                        text,
                        values
                      );
                      console.log(row);
                      return row;
                    },
                  };
                }
              );
            });
          }
          return memo;
        }, {})
      );
    }
  );
};
