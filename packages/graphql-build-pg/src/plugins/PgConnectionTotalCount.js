const { GraphQLInt } = require("graphql");

module.exports = function PgConnectionTotalCount(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      { extend, pgInflection: inflection },
      {
        scope: { isPgRowConnectionType, pgIntrospection: table },
        buildFieldWithHooks,
      }
    ) => {
      if (
        !isPgRowConnectionType ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
        return fields;
      }
      const tableTypeName = inflection.tableType(
        table.name,
        table.namespace.name
      );
      return extend(fields, {
        totalCount: buildFieldWithHooks(
          "totalCount",
          ({ addDataGenerator }) => {
            addDataGenerator(() => {
              return {
                pgCalculateTotalCount: true,
              };
            });
            return {
              description: `The count of *all* \`${tableTypeName}\` you could get from the connection.`,
              type: GraphQLInt,
            };
          }
        ),
      });
    }
  );
};
