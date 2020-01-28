module.exports = builder => {
  // This hook adds the 'Toy.categories' field
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      getTypeByName,
      graphql: { GraphQLList },
      getSafeAliasFromAlias,
      getSafeAliasFromResolveInfo,
      pgSql: sql,
      pgQueryFromResolveData: queryFromResolveData,
    } = build;
    const { Self, fieldWithHooks } = context;

    if (Self.name !== "Toy") {
      return fields;
    }

    const Category = getTypeByName("Category");
    return build.extend(fields, {
      categories: fieldWithHooks(
        "categories",
        ({ addDataGenerator, getDataFromParsedResolveInfoFragment }) => {
          addDataGenerator(parsedResolveInfoFragment => {
            return {
              pgQuery: queryBuilder => {
                queryBuilder.select(() => {
                  const resolveData = getDataFromParsedResolveInfoFragment(
                    parsedResolveInfoFragment,
                    Category
                  );
                  const foreignTableAlias = sql.identifier(Symbol());
                  const query = queryFromResolveData(
                    sql.fragment`named_query_builder.categories`,
                    foreignTableAlias,
                    resolveData,
                    {
                      useAsterisk: false,
                      asJsonAggregate: true,
                    },
                    innerQueryBuilder => {
                      innerQueryBuilder.parentQueryBuilder = queryBuilder;
                      const alias = Symbol("toyCategoriesSubquery");
                      const innerInnerQueryBuilder = innerQueryBuilder.buildNamedChildSelecting(
                        "toyCategoriesSubquery",
                        sql.identifier("named_query_builder", "toy_categories"),
                        sql.identifier(alias, "category_id"),
                        sql.identifier(alias)
                      );
                      innerInnerQueryBuilder.where(
                        sql.fragment`${innerInnerQueryBuilder.getTableAlias()}.toy_id = ${queryBuilder.getTableAlias()}.id`
                      );
                      innerQueryBuilder.where(
                        () =>
                          sql.fragment`${innerQueryBuilder.getTableAlias()}.id IN (${innerInnerQueryBuilder.build()})`
                      );
                    },
                    queryBuilder.context,
                    queryBuilder.rootValue
                  );
                  return sql.fragment`(${query})`;
                }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
              },
            };
          });
          return {
            type: new GraphQLList(Category),
            resolve: (data, _args, resolveContext, resolveInfo) => {
              if (!data) return null;
              const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
              return data[safeAlias];
            },
          };
        },
        {
          /* w/e */
        }
      ),
    });
  });

  // NOTE: this could be in a completely different plugin
  // This hook adds the `approved: Boolean` argument to Toy.categories
  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        graphql: { GraphQLBoolean },
        pgSql: sql,
      } = build;
      const {
        Self,
        scope: { fieldName },
        addArgDataGenerator,
      } = context;
      if (Self.name !== "Toy" || fieldName !== "categories") {
        return args;
      }

      addArgDataGenerator(({ approved }) => {
        return {
          pgQuery: queryBuilder => {
            if (approved != null) {
              const toyCategoriesQueryBuilder = queryBuilder.getNamedChild(
                "toyCategoriesSubquery"
              );
              toyCategoriesQueryBuilder.where(
                sql.fragment`${toyCategoriesQueryBuilder.getTableAlias()}.approved = ${sql.value(
                  approved
                )}`
              );
            }
          },
        };
      });

      return build.extend(
        args,
        {
          approved: {
            type: GraphQLBoolean,
          },
        },
        "Test"
      );
    }
  );
};
