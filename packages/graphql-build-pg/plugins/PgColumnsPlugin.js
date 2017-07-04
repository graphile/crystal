const { GraphQLNonNull, GraphQLString } = require("graphql");
const queryFromResolveData = require("../queryFromResolveData");

const nullableIf = (condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);

module.exports = function PgColumnsPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        extend,
        pgGqlTypeByTypeId: gqlTypeByTypeId,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        pg2gql,
        parseResolveInfo,
        pgTweakFragmentForType,
      },
      {
        scope: { isPgRowType, isPgCompoundType, pgIntrospection: table },
        buildFieldWithHooks,
      }
    ) => {
      if (
        !(isPgRowType || isPgCompoundType) ||
        !table ||
        table.kind !== "class"
      ) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .reduce((memo, attr) => {
            /*
            attr =
              { kind: 'attribute',
                classId: '6546809',
                num: 21,
                name: 'upstreamName',
                description: null,
                typeId: '6484393',
                isNotNull: false,
                hasDefault: false }
            */
            const fieldName = inflection.column(
              attr.name,
              table.name,
              table.namespace.name
            );
            memo[
              fieldName
            ] = buildFieldWithHooks(
              fieldName,
              ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
                const ReturnType =
                  gqlTypeByTypeId[attr.typeId] || GraphQLString;
                addDataGenerator(parsedResolveInfoFragment => {
                  const { alias } = parsedResolveInfoFragment;
                  if (attr.type.type === "c") {
                    return {
                      pgQuery: queryBuilder => {
                        // json_build_object
                        /*
                        queryBuilder.select(
                          sql.identifier(queryBuilder.getTableAlias(), attr.name),
                          alias
                        );
                        */
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment,
                          ReturnType
                        );
                        const jsonBuildObject = queryFromResolveData(
                          Symbol(), // Ignore!
                          sql.fragment`(${queryBuilder.getTableAlias()}.${sql.identifier(
                            attr.name
                          )})`, // The brackets are necessary to stop the parser getting confused, ref: https://www.postgresql.org/docs/9.6/static/rowtypes.html#ROWTYPES-ACCESSING
                          resolveData,
                          { onlyJsonField: true }
                        );
                        queryBuilder.select(jsonBuildObject, alias);
                      },
                    };
                  } else {
                    return {
                      pgQuery: queryBuilder => {
                        queryBuilder.select(
                          pgTweakFragmentForType(
                            sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                              attr.name
                            )}`,
                            attr.type
                          ),
                          alias
                        );
                      },
                    };
                  }
                });
                return {
                  type: nullableIf(!attr.isNotNull, ReturnType),
                  resolve: (data, _args, _context, resolveInfo) => {
                    const alias = parseResolveInfo(resolveInfo, {
                      aliasOnly: true,
                    });
                    return pg2gql(data[alias], attr.type);
                  },
                };
              }
            );
            return memo;
          }, {})
      );
    }
  );
  builder.hook(
    "GraphQLInputObjectType:fields",
    (
      fields,
      {
        extend,
        pgGqlInputTypeByTypeId: gqlInputTypeByTypeId,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      },
      {
        scope: {
          isPgRowType,
          isPgCompoundType,
          isPgPatch,
          pgIntrospection: table,
          pgAddSubfield,
        },
      }
    ) => {
      if (
        !(isPgRowType || isPgCompoundType) ||
        !table ||
        table.kind !== "class"
      ) {
        return fields;
      }
      return extend(
        fields,
        introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .reduce((memo, attr) => {
            const fieldName = inflection.column(
              attr.name,
              table.name,
              table.namespace.name
            );
            memo[fieldName] = pgAddSubfield(fieldName, attr.name, attr.type, {
              type: nullableIf(
                isPgPatch || !attr.isNotNull || attr.hasDefault,
                gqlInputTypeByTypeId[attr.typeId] || GraphQLString
              ),
            });
            return memo;
          }, {})
      );
    }
  );
};
