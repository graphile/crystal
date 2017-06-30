const { GraphQLInt } = require("graphql");

module.exports = function PgConnectionTotalCount(builder) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      { extend },
      {
        scope: { isPgRowConnectionType, pgIntrospection: table },
        buildFieldWithHooks,
      }
    ) => {
      if (!isPgRowConnectionType || !table || table.kind !== "class") {
        return fields;
      }
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
              type: GraphQLInt,
            };
          }
        ),
      });
    }
  );
};
