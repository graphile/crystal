module.exports = function PgConnectionArgs(listener) {
  listener.on(
    "field:args",
    (
      args,
      {
        extend,
        pg: {
          sql,
          introspectionResultsByKind,
          gqlTypeByTypeId,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sqlFragmentGeneratorsForConnectionByClassId,
          generateFieldFragments,
        },
      },
      { scope: { pg: { addClauseForArg } } }
    ) => {
      addClauseForArg("before", "where", (value, tableAlias) => {
        sql.fragment`__cursor < ${sql.value(value)}`;
      });
      return extend(args, {
        before: {
          type: Cursor,
        },
        after: {
          type: Cursor,
        },
      });
    }
  );
};
