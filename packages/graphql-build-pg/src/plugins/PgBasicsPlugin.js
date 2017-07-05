const sql = require("pg-sql2");

module.exports = function PgBasicsPlugin(builder) {
  builder.hook("build", build => {
    return build.extend(build, {
      pgSql: sql,
    });
  });
};
