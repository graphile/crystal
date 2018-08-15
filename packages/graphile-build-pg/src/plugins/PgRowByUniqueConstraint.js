// @flow
import type { Plugin } from "graphile-build";
import debugFactory from "debug";
const debugSql = debugFactory("graphile-build-pg:sql");

export default (async function PgRowByUniqueConstraint(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      parseResolveInfo,
      pgGetGqlTypeByTypeIdAndModifier,
      pgGetGqlInputTypeByTypeIdAndModifier,
      gql2pg,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      graphql: { GraphQLNonNull },
      inflection,
      pgQueryFromResolveData: queryFromResolveData,
      pgOmit: omit,
    } = build;
    const {
      scope: { isRootQuery },
      fieldWithHooks,
    } = context;
    if (!isRootQuery) {
      return fields;
    }
    return extend(
      fields,
      introspectionResultsByKind.class
        .filter(table => !!table.namespace)
        .filter(table => !omit(table, "read"))
        .reduce((memo, table) => {
          const TableType = pgGetGqlTypeByTypeIdAndModifier(
            table.type.id,
            null
          );
          const sqlFullTableName = sql.identifier(
            table.namespace.name,
            table.name
          );
          if (TableType) {
            const uniqueConstraints = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => con.type === "u" || con.type === "p");
            const attributes = introspectionResultsByKind.attribute
              .filter(attr => attr.classId === table.id)
              .sort((a, b) => a.num - b.num);
            uniqueConstraints.forEach(constraint => {
              if (omit(constraint, "read")) {
                return;
              }
              const keys = constraint.keyAttributeNums.map(num =>
                attributes.find(attr => attr.num === num)
              );
              if (keys.some(key => omit(key, "read"))) {
                return;
              }
              if (!keys.every(_ => _)) {
                throw new Error(
                  "Consistency error: could not find an attribute!"
                );
              }
              const fieldName = inflection.rowByUniqueKeys(
                keys,
                table,
                constraint
              );
              memo[fieldName] = fieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    type: TableType,
                    args: keys.reduce((memo, key) => {
                      const InputType = pgGetGqlInputTypeByTypeIdAndModifier(
                        key.typeId,
                        key.typeModifier
                      );
                      if (!InputType) {
                        throw new Error(
                          `Could not find input type for key '${
                            key.name
                          }' on type '${TableType.name}'`
                        );
                      }
                      memo[inflection.column(key)] = {
                        type: new GraphQLNonNull(InputType),
                      };
                      return memo;
                    }, {}),
                    async resolve(parent, args, { pgClient }, resolveInfo) {
                      const parsedResolveInfoFragment = parseResolveInfo(
                        resolveInfo
                      );
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment,
                        TableType
                      );
                      const query = queryFromResolveData(
                        sqlFullTableName,
                        undefined,
                        resolveData,
                        {},
                        queryBuilder => {
                          keys.forEach(key => {
                            queryBuilder.where(
                              sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                key.name
                              )} = ${gql2pg(
                                args[inflection.column(key)],
                                key.type,
                                key.typeModifier
                              )}`
                            );
                          });
                        }
                      );
                      const { text, values } = sql.compile(query);
                      if (debugSql.enabled) debugSql(text);
                      const {
                        rows: [row],
                      } = await pgClient.query(text, values);
                      return row;
                    },
                  };
                },
                {
                  isPgRowByUniqueConstraintField: true,
                  pgFieldIntrospection: constraint,
                }
              );
            });
          }
          return memo;
        }, {}),
      `Adding "row by unique constraint" fields to root Query type`
    );
  });
}: Plugin);
