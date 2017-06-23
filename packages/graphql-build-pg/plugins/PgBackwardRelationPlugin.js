module.exports = function PgBackwardRelationPlugin(listener) {
  listener.on(
    "objectType:fields",
    (
      fields,
      {
        inflection,
        extend,
        pg: {
          gqlTypeByTypeId,
          gqlTypeByClassId,
          gqlConnectionTypeByClassId,
          introspectionResultsByKind,
          sqlFragmentGeneratorsByClassIdAndFieldName,
          sql,
          generateFieldFragments,
        },
      },
      { scope }
    ) => {
      if (
        !scope.pg ||
        !scope.pg.isRowType ||
        !scope.pg.introspection ||
        scope.pg.introspection.kind !== "class"
      ) {
        return;
      }
      // This is a relation in which WE are foreign
      const foreignTable = scope.pg.introspection;

      const foreignKeyConstraints = introspectionResultsByKind.constraint
        .filter(con => ["f"].includes(con.type))
        .filter(con => con.foreignClassId === foreignTable.id);
      const foreignAttributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === foreignTable.id)
        .sort((a, b) => a.num - b.num);

      return extend(
        fields,
        foreignKeyConstraints.reduce((memo, constraint) => {
          const gqlTableType = gqlTypeByClassId[constraint.classId];
          if (!gqlTableType) {
            console.warn(
              `Could not determine type for table with id ${constraint.classId}`
            );
            return memo;
          }
          const gqlForeignTableType =
            gqlTypeByClassId[constraint.foreignClassId];
          if (!gqlForeignTableType) {
            console.warn(
              `Could not determine type for foreign table with id ${constraint.foreignClassId}`
            );
            return memo;
          }
          const table = introspectionResultsByKind.class.filter(
            cls => cls.id === constraint.classId
          )[0];
          if (!table) {
            throw new Error(
              `Could not find the table that referenced us (constraint: ${constraint.name})`
            );
          }
          const schema = introspectionResultsByKind.namespace.filter(
            n => n.id === table.namespaceId
          )[0];

          const attributes = introspectionResultsByKind.attribute
            .filter(attr => attr.classId === constraint.classId)
            .sort((a, b) => a.num - b.num);

          const keys = constraint.keyAttributeNums.map(
            num => attributes.filter(attr => attr.num === num)[0]
          );
          const foreignKeys = constraint.foreignKeyAttributeNums.map(
            num => foreignAttributes.filter(attr => attr.num === num)[0]
          );
          if (!keys.every(_ => _) || !foreignKeys.every(_ => _)) {
            throw new Error("Could not find key columns!");
          }

          const fieldName = inflection.field(
            `${pluralize(table.name)}-by-${keys.map(k => k.name).join("-and-")}`
          );

          sqlFragmentGeneratorsByClassIdAndFieldName[foreignTable.id][
            fieldName
          ] = (
            parsedResolveInfoFragment,
            { tableAlias: foreignTableAlias }
          ) => {
            const tableAlias = Symbol();
            const conditions = keys.map(
              (key, i) =>
                sql.fragment`${sql.identifier(
                  tableAlias,
                  key.name
                )} = ${sql.identifier(foreignTableAlias, foreignKeys[i].name)}`
            );
            const fragments = generateFieldFragments(
              parsedResolveInfoFragment,
              sqlFragmentGeneratorsByClassIdAndFieldName[table.id],
              { tableAlias }
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
            return [
              {
                alias: parsedResolveInfoFragment.alias,
                sqlFragment: sql.fragment`
                  (
                    select json_agg(${sqlJsonBuildObjectFromFragments(
                      fragments
                    )})
                    from ${sql.identifier(
                      schema.name,
                      table.name
                    )} as ${sql.identifier(tableAlias)}
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
                  )
                `,
              },
            ];
          };
          memo[fieldName] = {
            type: nullableIf(
              !keys.every(key => key.isNotNull),
              gqlConnectionTypeByClassId[table.id]
            ),
            resolve: (data, _args, _context, resolveInfo) => {
              const { alias } = parseResolveInfo(resolveInfo, {
                deep: false,
              });
              return data[alias];
            },
          };
          return memo;
        }, {})
      );
    }
  );
};
