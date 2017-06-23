module.exports = async function PgAllRows(builder) {
  builder.hook(
    "objectType:fields",
    (
      fields,
      {
        buildFieldWithHooks,
        inflection,
        extend,
        pg: {
          gqlTypeByClassId,
          gqlTypeByTypeId,
          gqlConnectionTypeByClassId,
          introspectionResultsByKind,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sqlFragmentGeneratorsForConnectionByClassId,
          sql,
          generateFieldFragments,
        },
      },
      { scope: { isRootQuery } }
    ) => {
      if (!isRootQuery) {
        return;
      }
      return extend(
        fields,
        introspectionResultsByKind.class.reduce((memo, table) => {
          const type = gqlTypeByClassId[table.id];
          const connectionType = gqlConnectionTypeByClassId[table.id];
          const schema = introspectionResultsByKind.namespace.filter(
            n => n.id === table.namespaceId
          )[0];
          if (!schema) {
            console.warn(
              `Could not find the schema for table '${table.name}'; skipping`
            );
            return memo;
          }
          const sqlFullTableName = sql.identifier(schema.name, table.name);
          if (type && connectionType) {
            const clauses = {};
            memo[
              inflection.field(`all-${pluralize(table.name)}`)
            ] = buildFieldWithHooks(
              {
                type: connectionType,
                args: {},
                async resolve(parent, args, { pgClient }, resolveInfo) {
                  const parsedResolveInfoFragment = parseResolveInfo(
                    resolveInfo
                  );
                  const { alias, fields } = parsedResolveInfoFragment;
                  const tableAlias = Symbol();
                  const fragments = generateFieldFragments(
                    parsedResolveInfoFragment,
                    sqlFragmentGeneratorsForConnectionByClassId[table.id],
                    { tableAlias }
                  );
                  const sqlFields = sql.join(
                    fragments.map(
                      ({ sqlFragment, alias }) =>
                        sql.fragment`${sqlFragment} as ${sql.identifier(alias)}`
                    ),
                    ", "
                  );
                  const primaryKeyConstraint = introspectionResultsByKind.constraint
                    .filter(con => con.classId === table.id)
                    .filter(con => ["p"].includes(con.type))[0];
                  const attributes = introspectionResultsByKind.attribute
                    .filter(attr => attr.classId === table.id)
                    .sort((a, b) => a.num - b.num);
                  const primaryKeys =
                    primaryKeyConstraint &&
                    primaryKeyConstraint.keyAttributeNums.map(
                      num => attributes.filter(attr => attr.num === num)[0]
                    );
                  const query = sql.query`
                    select ${sqlFields}
                    from ${sqlFullTableName} as ${sql.identifier(tableAlias)}
                    order by ${primaryKeys
                      ? sql.join(
                          primaryKeys.map(
                            key =>
                              sql.fragment`${sql.identifier(
                                tableAlias,
                                key.name
                              )} asc`
                          ),
                          ", "
                        )
                      : sql.literal(1)}
                  `;
                  const { text, values } = sql.compile(query);
                  console.log(text);
                  const { rows } = await pgClient.query(text, values);
                  return rows;
                },
              },
              {
                pg: {
                  isConnection: true,
                  addClauseForArg: (arg, clauseType, fragGen) => {
                    clauses[arg] = clauses[arg] || {};
                    clauses[arg][clauseType] = clauses[arg][clauseType] || [];
                    clauses[arg][clauseType].push(fragGen);
                  },
                },
              }
            );
          }
          return memo;
        }, {})
      );
    }
  );
};
