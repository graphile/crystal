const { GraphQLInt } = require("graphql");

module.exports = function PgConnectionTotalCount(builder) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      { extend },
      { scope: { isPgRowConnectionType, pgIntrospection: table } }
    ) => {
      if (!isPgRowConnectionType || !table || table.kind !== "class") {
        return fields;
      }
      return extend(fields, {
        totalCount: {
          type: GraphQLInt,
        },
      });
    }
  );
};
