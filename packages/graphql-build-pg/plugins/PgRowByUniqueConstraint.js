module.exports = async function PgRowByUniqueConstraint(listener) {
  listener.on(
    "objectType:fields",
    (
      spec,
      {
        inflection,
        extend,
        pg: {
          gqlTypeByClassId,
          gqlTypeByTypeId,
          introspectionResultsByKind,
          sqlFragmentGeneratorsByClassIdAndFieldName,
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
        spec,
        introspectionResultsByKind.class.reduce((memo, table) => {
          const type = gqlTypeByClassId[table.id];
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
          if (type) {
            const uniqueConstraints = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => ["u", "p"].includes(con.type));
            const attributes = introspectionResultsByKind.attribute
              .filter(attr => attr.classId === table.id)
              .sort((a, b) => a.num - b.num);
            uniqueConstraints.forEach(constraint => {
              const keys = constraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
              if (!keys.every(_ => _)) {
                throw new Error(
                  "Consistency error: could not find an attribute!"
                );
              }
              memo[
                inflection.field(
                  `${table.name}-by-${keys.map(key => key.name).join("-and-")}`
                )
              ] = {
                type: type,
                args: keys.reduce((memo, key) => {
                  memo[inflection.field(key.name)] = {
                    type: gqlTypeByTypeId[key.typeId],
                  };
                  return memo;
                }, {}),
                async resolve(parent, args, { pgClient }, resolveInfo) {
                  const parsedResolveInfoFragment = parseResolveInfo(
                    resolveInfo
                  );
                  const { alias, fields } = parsedResolveInfoFragment;
                  const tableAlias = Symbol();
                  const conditions = keys.map(
                    key =>
                      sql.fragment`${sql.identifier(
                        tableAlias,
                        key.name
                      )} = ${sql.value(args[inflection.field(key.name)])}`
                  );
                  const fragments = generateFieldFragments(
                    parsedResolveInfoFragment,
                    sqlFragmentGeneratorsByClassIdAndFieldName[table.id],
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
                      where (${sql.join(conditions, ") and (")})
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
                  const { rows: [row] } = await pgClient.query(text, values);
                  return row;
                },
              };
            });
          }
          return memo;
        }, {})
      );
    }
  );
};
