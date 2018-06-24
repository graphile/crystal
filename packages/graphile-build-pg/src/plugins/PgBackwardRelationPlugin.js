// @flow
import debugFactory from "debug";

import type { Plugin } from "graphile-build";

const debug = debugFactory("graphile-build-pg");

const OMIT = 0;
const DEPRECATED = 1;
const ONLY = 2;

export default (function PgBackwardRelationPlugin(
  builder,
  { pgLegacyRelations, pgSimpleCollections }
) {
  const hasConnections = pgSimpleCollections !== "only";
  const hasSimpleCollections =
    pgSimpleCollections === "only" || pgSimpleCollections === "both";
  const legacyRelationMode =
    {
      only: ONLY,
      deprecated: DEPRECATED,
    }[pgLegacyRelations] || OMIT;
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      getTypeByName,
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      getSafeAliasFromResolveInfo,
      getSafeAliasFromAlias,
      graphql: { GraphQLNonNull, GraphQLList },
      inflection,
      pgQueryFromResolveData: queryFromResolveData,
      pgAddStartEndCursor: addStartEndCursor,
      pgOmit: omit,
    } = build;
    const {
      scope: { isPgRowType, pgIntrospection: foreignTable },
      fieldWithHooks,
      Self,
    } = context;
    if (!isPgRowType || !foreignTable || foreignTable.kind !== "class") {
      return fields;
    }
    // This is a relation in which WE are foreign
    const foreignKeyConstraints = introspectionResultsByKind.constraint
      .filter(con => con.type === "f")
      .filter(con => con.foreignClassId === foreignTable.id);
    const foreignAttributes = introspectionResultsByKind.attribute
      .filter(attr => attr.classId === foreignTable.id)
      .sort((a, b) => a.num - b.num);

    return extend(
      fields,
      foreignKeyConstraints.reduce((memo, constraint) => {
        if (omit(constraint, "read")) {
          return memo;
        }
        const table = introspectionResultsByKind.classById[constraint.classId];
        const tableTypeName = inflection.tableType(table);
        const gqlTableType = pgGetGqlTypeByTypeIdAndModifier(
          table.type.id,
          null
        );
        if (!gqlTableType) {
          debug(
            `Could not determine type for table with id ${constraint.classId}`
          );
          return memo;
        }
        const foreignTable =
          introspectionResultsByKind.classById[constraint.foreignClassId];
        const foreignTableTypeName = inflection.tableType(foreignTable);
        const gqlForeignTableType = pgGetGqlTypeByTypeIdAndModifier(
          foreignTable.type.id,
          null
        );
        if (!gqlForeignTableType) {
          debug(
            `Could not determine type for foreign table with id ${
              constraint.foreignClassId
            }`
          );
          return memo;
        }
        if (!table) {
          throw new Error(
            `Could not find the table that referenced us (constraint: ${
              constraint.name
            })`
          );
        }
        const schema = table.namespace;

        const attributes = introspectionResultsByKind.attribute.filter(
          attr => attr.classId === table.id
        );

        const keys = constraint.keyAttributeNums.map(
          num => attributes.filter(attr => attr.num === num)[0]
        );
        const foreignKeys = constraint.foreignKeyAttributeNums.map(
          num => foreignAttributes.filter(attr => attr.num === num)[0]
        );
        if (!keys.every(_ => _) || !foreignKeys.every(_ => _)) {
          throw new Error("Could not find key columns!");
        }
        if (keys.some(key => omit(key, "read"))) {
          return memo;
        }
        if (foreignKeys.some(key => omit(key, "read"))) {
          return memo;
        }
        const singleKey = keys.length === 1 ? keys[0] : null;
        const isUnique = !!(
          singleKey &&
          introspectionResultsByKind.constraint.find(
            c =>
              c.classId === singleKey.classId &&
              c.keyAttributeNums.length === 1 &&
              c.keyAttributeNums[0] === singleKey.num &&
              (c.type === "p" || c.type === "u")
          )
        );

        const isDeprecated = isUnique && legacyRelationMode === DEPRECATED;

        const singleRelationFieldName = isUnique
          ? inflection.singleRelationByKeys(
              keys,
              table,
              foreignTable,
              constraint
            )
          : null;

        const primaryKeyConstraint = introspectionResultsByKind.constraint
          .filter(con => con.classId === table.id)
          .filter(con => con.type === "p")[0];
        const primaryKeys =
          primaryKeyConstraint &&
          primaryKeyConstraint.keyAttributeNums.map(
            num => attributes.filter(attr => attr.num === num)[0]
          );

        const shouldAddSingleRelation = isUnique && legacyRelationMode !== ONLY;

        const shouldAddManyRelation =
          !isUnique ||
          legacyRelationMode === DEPRECATED ||
          legacyRelationMode === ONLY;

        if (shouldAddSingleRelation && !omit(table, "read")) {
          memo[singleRelationFieldName] = fieldWithHooks(
            singleRelationFieldName,
            ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
              addDataGenerator(parsedResolveInfoFragment => {
                return {
                  pgQuery: queryBuilder => {
                    queryBuilder.select(() => {
                      const resolveData = getDataFromParsedResolveInfoFragment(
                        parsedResolveInfoFragment,
                        gqlTableType
                      );
                      const tableAlias = sql.identifier(Symbol());
                      const foreignTableAlias = queryBuilder.getTableAlias();
                      const query = queryFromResolveData(
                        sql.identifier(schema.name, table.name),
                        tableAlias,
                        resolveData,
                        {
                          asJson: true,
                          addNullCase: true,
                          withPagination: false,
                        },
                        innerQueryBuilder => {
                          keys.forEach((key, i) => {
                            innerQueryBuilder.where(
                              sql.fragment`${tableAlias}.${sql.identifier(
                                key.name
                              )} = ${foreignTableAlias}.${sql.identifier(
                                foreignKeys[i].name
                              )}`
                            );
                          });
                        }
                      );
                      return sql.fragment`(${query})`;
                    }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
                  },
                };
              });
              return {
                description: `Reads a single \`${tableTypeName}\` that is related to this \`${foreignTableTypeName}\`.`,
                type: gqlTableType,
                args: {},
                resolve: (data, _args, _context, resolveInfo) => {
                  const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                  return data[safeAlias];
                },
              };
            },
            {
              pgFieldIntrospection: table,
            }
          );
        }
        function makeFields(isConnection) {
          if (isUnique && !isConnection) {
            // Don't need this, use the singular instead
            return;
          }
          if (shouldAddManyRelation && !omit(table, "many")) {
            const manyRelationFieldName = isConnection
              ? inflection.manyRelationByKeys(
                  keys,
                  table,
                  foreignTable,
                  constraint
                )
              : inflection.manyRelationByKeysSimple(
                  keys,
                  table,
                  foreignTable,
                  constraint
                );

            memo[manyRelationFieldName] = fieldWithHooks(
              manyRelationFieldName,
              ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
                addDataGenerator(parsedResolveInfoFragment => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(() => {
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment,
                          isConnection ? ConnectionType : TableType
                        );
                        const tableAlias = sql.identifier(Symbol());
                        const foreignTableAlias = queryBuilder.getTableAlias();
                        const query = queryFromResolveData(
                          sql.identifier(schema.name, table.name),
                          tableAlias,
                          resolveData,
                          {
                            withPagination: isConnection,
                            withPaginationAsFields: false,
                            asJsonAggregate: !isConnection,
                          },
                          innerQueryBuilder => {
                            if (primaryKeys) {
                              innerQueryBuilder.beforeLock("orderBy", () => {
                                // append order by primary key to the list of orders
                                if (!innerQueryBuilder.isOrderUnique(false)) {
                                  innerQueryBuilder.data.cursorPrefix = [
                                    "primary_key_asc",
                                  ];
                                  primaryKeys.forEach(key => {
                                    innerQueryBuilder.orderBy(
                                      sql.fragment`${innerQueryBuilder.getTableAlias()}.${sql.identifier(
                                        key.name
                                      )}`,
                                      true
                                    );
                                  });
                                  innerQueryBuilder.setOrderIsUnique();
                                }
                              });
                            }

                            keys.forEach((key, i) => {
                              innerQueryBuilder.where(
                                sql.fragment`${tableAlias}.${sql.identifier(
                                  key.name
                                )} = ${foreignTableAlias}.${sql.identifier(
                                  foreignKeys[i].name
                                )}`
                              );
                            });
                          }
                        );
                        return sql.fragment`(${query})`;
                      }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
                    },
                  };
                });
                const ConnectionType = getTypeByName(
                  inflection.connection(gqlTableType.name)
                );
                const TableType = pgGetGqlTypeByTypeIdAndModifier(
                  table.type.id,
                  null
                );
                return {
                  description: `Reads and enables pagination through a set of \`${tableTypeName}\`.`,
                  type: isConnection
                    ? new GraphQLNonNull(ConnectionType)
                    : new GraphQLNonNull(
                        new GraphQLList(new GraphQLNonNull(TableType))
                      ),
                  args: {},
                  resolve: (data, _args, _context, resolveInfo) => {
                    const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                    if (isConnection) {
                      return addStartEndCursor(data[safeAlias]);
                    } else {
                      return data[safeAlias];
                    }
                  },
                  deprecationReason: isDeprecated
                    ? // $FlowFixMe
                      `Please use ${singleRelationFieldName} instead`
                    : undefined,
                };
              },
              {
                isPgFieldConnection: isConnection,
                isPgFieldSimpleCollection: !isConnection,
                isPgBackwardRelationField: true,
                pgFieldIntrospection: table,
              }
            );
          }
        }
        if (hasConnections) {
          makeFields(true);
        }
        if (hasSimpleCollections) {
          makeFields(false);
        }
        return memo;
      }, {}),
      `Adding backward relations for ${Self.name}`
    );
  });
}: Plugin);
