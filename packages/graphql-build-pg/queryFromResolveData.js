const QueryBuilder = require("./QueryBuilder");

module.exports = (from, fromAlias, resolveData, options, withBuilder) => {
  const { pgQuery } = resolveData;

  const queryBuilder = new QueryBuilder();
  if (!fromAlias) {
    throw new Error("No from alias!");
  }
  queryBuilder.from(from, fromAlias);
  for (const fn of pgQuery || []) {
    fn(queryBuilder);
  }
  if (withBuilder) {
    withBuilder(queryBuilder);
  }
  const query = queryBuilder.build(options);
  return query;
};
