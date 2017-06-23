const QueryBuilder = require("./QueryBuilder");

module.exports = (from, fromAlias, resolveData) => {
  const { pgQuery } = resolveData;

  const queryBuilder = new QueryBuilder();
  queryBuilder.from(from, fromAlias);
  for (const fn of pgQuery || []) {
    fn(queryBuilder);
  }
  const query = queryBuilder.build();
  return query;
};
