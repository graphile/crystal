const sql = require("../sql");

module.exports = function PgBasicsPlugin(builder) {
  builder.hook("build", build => {
    return build.extend(build, {
      pgSql: sql,
    });
  });
};
