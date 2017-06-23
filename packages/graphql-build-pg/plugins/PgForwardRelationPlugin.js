module.exports = function PgForwardRelationPlugin(listener) {
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
      const table = scope.pg.introspection;
      // This is a relation in which we (table) are local, and there's a foreign table

      const foreignKeyConstraints = introspectionResultsByKind.constraint
        .filter(con => ["f"].includes(con.type))
        .filter(con => con.classId === table.id);
      const attributes = introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
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
          const foreignTable = introspectionResultsByKind.class.filter(
            cls => cls.id === constraint.foreignClassId
          )[0];
          if (!foreignTable) {
            throw new Error(
              `Could not find the foreign table (constraint: ${constraint.name})`
            );
          }
          const foreignSchema = introspectionResultsByKind.namespace.filter(
            n => n.id === foreignTable.namespaceId
          )[0];
          const foreignAttributes = introspectionResultsByKind.attribute
            .filter(attr => attr.classId === constraint.foreignClassId)
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
            `${foreignTable.name}-by-${keys.map(k => k.name).join("-and-")}`
          );

          sqlFragmentGeneratorsByClassIdAndFieldName[table.id][fieldName] = (
            parsedResolveInfoFragment,
            { tableAlias }
          ) => {
            const foreignTableAlias = Symbol();
            const conditions = keys.map(
              (key, i) =>
                sql.fragment`${sql.identifier(
                  tableAlias,
                  key.name
                )} = ${sql.identifier(foreignTableAlias, foreignKeys[i].name)}`
            );
            const fragments = generateFieldFragments(
              parsedResolveInfoFragment,
              sqlFragmentGeneratorsByClassIdAndFieldName[foreignTable.id],
              { tableAlias: foreignTableAlias }
            );
            return [
              {
                alias: parsedResolveInfoFragment.alias,
                sqlFragment: sql.fragment`
                  (
                    select ${sqlJsonBuildObjectFromFragments(fragments)}
                    from ${sql.identifier(
                      foreignSchema.name,
                      foreignTable.name
                    )} as ${sql.identifier(foreignTableAlias)}
                    where (${sql.join(conditions, ") and (")})
                  )
                `,
              },
            ];
          };
          memo[fieldName] = {
            type: nullableIf(
              !keys.every(key => key.isNotNull),
              gqlForeignTableType
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
