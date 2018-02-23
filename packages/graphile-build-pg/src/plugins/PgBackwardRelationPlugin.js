// @flow
import debugFactory from "debug";
import queryFromResolveData from "../queryFromResolveData";
import addStartEndCursor from "./addStartEndCursor";

import type { Plugin } from "graphile-build";

const debug = debugFactory("graphile-build-pg");

const OMIT = 0;
const DEPRECATED = 1;
const ONLY = 2;

export default (function PgBackwardRelationPlugin(
  builder,
  { pgInflection: inflection, pgLegacyRelations }
) {
  const legacyRelationMode =
    {
      only: ONLY,
      deprecated: DEPRECATED,
    }[pgLegacyRelations] || OMIT;
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      {
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeId,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        getAliasFromResolveInfo,
        graphql: { GraphQLNonNull },
      },
      {
        scope: { isPgRowType, pgIntrospection: foreignTable },
        fieldWithHooks,
        Self,
      }
    ) => {
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
          const table =
            introspectionResultsByKind.classById[constraint.classId];
          const tableTypeName = inflection.tableType(
            table.name,
            table.namespace.name
          );
          const gqlTableType = pgGetGqlTypeByTypeId(table.type.id);
          if (!gqlTableType) {
            debug(
              `Could not determine type for table with id ${constraint.classId}`
            );
            return memo;
          }
          const foreignTable =
            introspectionResultsByKind.classById[constraint.foreignClassId];
          const foreignTableTypeName = inflection.tableType(
            foreignTable.name,
            foreignTable.namespace.name
          );
          const gqlForeignTableType = pgGetGqlTypeByTypeId(
            foreignTable.type.id
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

          const simpleKeys = keys.map(k => ({
            column: k.name,
            table: k.class.name,
            schema: k.class.namespace.name,
          }));
          const manyRelationFieldName = inflection.manyRelationByKeys(
            simpleKeys,
            table.name,
            table.namespace.name,
            foreignTable.name,
            foreignTable.namespace.name
          );
          const singleRelationFieldName = isUnique
            ? inflection.singleRelationByKeys(
                simpleKeys,
                table.name,
                table.namespace.name,
                foreignTable.name,
                foreignTable.namespace.name
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

          const shouldAddSingleRelation =
            isUnique && legacyRelationMode !== ONLY;

          const shouldAddManyRelation =
            !isUnique ||
            legacyRelationMode === DEPRECATED ||
            legacyRelationMode === ONLY;

          if (shouldAddSingleRelation) {
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
                      }, parsedResolveInfoFragment.alias);
                    },
                  };
                });
                return {
                  description: `Reads a single \`${tableTypeName}\` that is related to this \`${foreignTableTypeName}\`.`,
                  type: gqlTableType,
                  args: {},
                  resolve: (data, _args, _context, resolveInfo) => {
                    const alias = getAliasFromResolveInfo(resolveInfo);
                    return data[alias];
                  },
                };
              },
              {
                pgFieldIntrospection: table,
              }
            );
          }
          if (shouldAddManyRelation) {
            memo[manyRelationFieldName] = fieldWithHooks(
              manyRelationFieldName,
              ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
                addDataGenerator(parsedResolveInfoFragment => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(() => {
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment,
                          ConnectionType
                        );
                        const tableAlias = sql.identifier(Symbol());
                        const foreignTableAlias = queryBuilder.getTableAlias();
                        const query = queryFromResolveData(
                          sql.identifier(schema.name, table.name),
                          tableAlias,
                          resolveData,
                          {
                            withPagination: true,
                            withPaginationAsFields: false,
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
                      }, parsedResolveInfoFragment.alias);
                    },
                  };
                });
                const ConnectionType = getTypeByName(
                  inflection.connection(gqlTableType.name)
                );
                return {
                  description: `Reads and enables pagination through a set of \`${tableTypeName}\`.`,
                  type: new GraphQLNonNull(ConnectionType),
                  args: {},
                  resolve: (data, _args, _context, resolveInfo) => {
                    const alias = getAliasFromResolveInfo(resolveInfo);
                    return addStartEndCursor(data[alias]);
                  },
                  deprecationReason: isDeprecated
                    ? // $FlowFixMe
                      `Please use ${singleRelationFieldName} instead`
                    : undefined,
                };
              },
              {
                isPgFieldConnection: true,
                pgFieldIntrospection: table,
              }
            );
          }
          return memo;
        }, {}),
        `Adding backward relations for ${Self.name}`
      );
    }
  );
}: Plugin);
