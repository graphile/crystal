const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const queryFromResolveData = require("../queryFromResolveData");
const debugSql = require("debug")("graphql-build-pg:sql");

module.exports = function PgMutationCreatePlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        extend,
        getTypeByName,
        buildObjectWithHooks,
        parseResolveInfo,
        pgIntrospectionResultsByKind,
        pgSql: sql,
        gql2pg,
      },
      { scope: { isRootMutation }, buildFieldWithHooks }
    ) => {
      if (!isRootMutation) {
        return fields;
      }

      return extend(
        fields,
        pgIntrospectionResultsByKind.class
          .filter(table => table.isSelectable)
          .filter(table => table.isInsertable)
          .reduce((memo, table) => {
            const Table = getTypeByName(
              inflection.tableType(table.name, table.namespace.name)
            );
            if (!Table) {
              console.warn(
                `There was no table type for table '${table.namespace
                  .name}.${table.name}', so we're not generating a create mutation for it.`
              );
              return memo;
            }
            const TableInput = getTypeByName(inflection.inputType(Table.name));
            if (!TableInput) {
              console.warn(
                `There was no input type for table '${table.namespace
                  .name}.${table.name}', so we're not generating a create mutation for it.`
              );
              return memo;
            }
            const InputType = buildObjectWithHooks(
              GraphQLInputObjectType,
              {
                name: inflection.createInputType(
                  table.name,
                  table.namespace.name
                ),
                fields: {
                  clientMutationId: {
                    type: GraphQLString,
                  },
                  [inflection.tableName(table.name, table.namespace.name)]: {
                    type: new GraphQLNonNull(TableInput),
                  },
                },
              },
              {
                isPgCreateInputType: true,
                pgInflection: table,
              }
            );
            const PayloadType = buildObjectWithHooks(
              GraphQLObjectType,
              {
                name: inflection.createPayloadType(
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
                        return data.data;
                      },
                    },
                  };
                },
              },
              {
                isMutationPayload: true,
                isPgCreatePayloadType: true,
                pgIntrospection: table,
              }
            );
            const fieldName = inflection.createField(
              table.name,
              table.namespace.name
            );
            memo[
              fieldName
            ] = buildFieldWithHooks(
              fieldName,
              ({ getDataFromParsedResolveInfoFragment }) => ({
                type: PayloadType,
                args: {
                  input: {
                    type: new GraphQLNonNull(InputType),
                  },
                },
                async resolve(data, { input }, { pgClient }, resolveInfo) {
                  const parsedResolveInfoFragment = parseResolveInfo(
                    resolveInfo
                  );
                  const resolveData = getDataFromParsedResolveInfoFragment(
                    parsedResolveInfoFragment,
                    PayloadType
                  );
                  const insertedRowAlias = sql.identifier(Symbol());
                  const query = queryFromResolveData(
                    insertedRowAlias,
                    insertedRowAlias,
                    resolveData,
                    {}
                  );
                  const sqlColumns = [];
                  const sqlValues = [];
                  const inputData =
                    input[
                      inflection.tableName(table.name, table.namespace.name)
                    ];
                  pgIntrospectionResultsByKind.attribute
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
                  const queryWithInsert = sql.query`
                    with ${insertedRowAlias} as (
                      insert into ${sql.identifier(
                        table.namespace.name,
                        table.name
                      )} ${sqlColumns.length
                    ? sql.fragment`(
                        ${sql.join(sqlColumns, ", ")}
                      ) values(${sql.join(sqlValues, ", ")})`
                    : sql.fragment`default values`}
                      returning *
                    ) ${query}
                    `;
                  const { text, values } = sql.compile(queryWithInsert);
                  if (debugSql.enabled)
                    debugSql(require("sql-formatter").format(text));
                  const { rows: [row] } = await pgClient.query(text, values);
                  return {
                    __clientMutationId: input.clientMutationId,
                    data: row,
                  };
                },
              })
            );
            return memo;
          }, {})
      );
    }
  );
};
