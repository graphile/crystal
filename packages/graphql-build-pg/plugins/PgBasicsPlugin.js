const sql = require("../sql");

module.exports = function PgBasicsPlugin(builder) {
  builder.hook("build", build => {
    return build.extend(build, {
      pgSql: sql,
      pgAddPaginationToQuery(query, resolveData, { asFields = false } = {}) {
        const fields = [
          [sql.fragment`(${query})`, "data"],
          [sql.literal(true), "hasNextPage"],
          [sql.literal(false), "hasPreviousPage"],
        ];
        if (asFields) {
          return sql.fragment`select ${sql.join(
            fields.map(
              ([expr, alias]) =>
                sql.fragment`${expr} as ${sql.identifier(alias)}`
            ),
            ", "
          )}`;
        } else {
          return sql.fragment`select json_build_object(${sql.join(
            fields.map(
              ([expr, alias]) => sql.fragment`${sql.literal(alias)}, ${expr}`
            ),
            ", "
          )})`;
        }
      },
    });
  });
};
