const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

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
        pgIntrospectionResultsByKind,
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
              GraphQLObjectType,
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
                fields: {
                  clientMutationId: {
                    type: GraphQLString,
                  },
                  [inflection.tableName(table.name, table.namespace.name)]: {
                    type: Table,
                  },
                },
              },
              {
                isPgCreatePayloadType: true,
                pgInflection: table,
              }
            );
            const fieldName = inflection.createField(
              table.name,
              table.namespace.name
            );
            memo[fieldName] = buildFieldWithHooks(fieldName, {
              type: PayloadType,
              args: {
                input: {
                  type: new GraphQLNonNull(InputType),
                },
              },
              resolve() {
                throw new Error("Unimplemented");
              },
            });
            return memo;
          })
      );
    }
  );
};
