const sql = require("./sql");

exports.sqlJsonBuildObjectFromFragments = fragments => {
  return sql.fragment`
    json_build_object(
      ${sql.join(
        fragments.map(
          ({ sqlFragment, alias }) =>
            sql.fragment`${sql.literal(alias)}, ${sqlFragment}`
        ),
        ",\n"
      )}
    )`;
};
