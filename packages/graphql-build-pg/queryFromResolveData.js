const QueryBuilder = require("./QueryBuilder");

module.exports = (from, fromAlias, resolveData, options, withBuilder) => {
  const { pgQuery } = resolveData;

  const queryBuilder = new QueryBuilder();
  queryBuilder.from(from, fromAlias);
  for (const fn of pgQuery || []) {
    fn(queryBuilder, resolveData);
  }
  if (withBuilder) {
    withBuilder(queryBuilder);
  }
  const query = queryBuilder.build(options);
  return query;
};
