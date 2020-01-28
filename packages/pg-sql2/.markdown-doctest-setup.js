const sql = require(".");
module.exports = {
  require: {
    "pg-sql2": sql,
  },
  globals: {
    sql,
  },
};
