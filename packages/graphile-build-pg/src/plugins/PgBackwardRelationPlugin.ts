import debugFactory from "debug";

import { Plugin } from "graphile-build";
import { stringTag } from "./PgBasicsPlugin";
import { PgEntityKind } from "./PgIntrospectionPlugin";

declare module "graphile-build" {
  interface GraphileBuildOptions {
    pgLegacyRelations?: "only" | "deprecated" | "omit";
  }
  interface ScopeGraphQLObjectTypeFieldsField {
    isPgBackwardSingleRelationField?: boolean;
    isPgBackwardRelationField?: boolean;
  }
}

const debug = debugFactory("graphile-build-pg");

const OMIT = 0;
const DEPRECATED = 1;
const ONLY = 2;

export default (function PgBackwardRelationPlugin(
  builder,
  { pgLegacyRelations, pgSimpleCollections, subscriptions },
) {
  const legacyRelationMode =
    {
      only: ONLY,
      deprecated: DEPRECATED,
    }[pgLegacyRelations || ""] || OMIT;
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        getSafeAliasFromResolveInfo,
        getSafeAliasFromAlias,
        graphql: {
          GraphQLNonNull,
          GraphQLList,
          getNamedType,
          GraphQLObjectType,
        },
        inflection,
        pgQueryFromResolveData: queryFromResolveData,
        pgAddStartEndCursor: addStartEndCursor,
        pgOmit: omit,
        sqlCommentByAddingTags,
        describePgEntity,
      } = build;
      const {
        scope: { isPgRowType, pgIntrospection },
        fieldWithHooks,
        Self,
      } = context;
      if (
        !isPgRowType ||
        !pgIntrospection ||
        pgIntrospection.kind !== PgEntityKind.CLASS
      ) {
        return fields;
      }
      const foreignTable = pgIntrospection;
      // This is a relation in which WE are foreign
      const foreignKeyConstraints = foreignTable.foreignConstraints.filter(
        con => con.type === "f",
      );

      const foreignTableTypeName = inflection.tableType(foreignTable);
      const gqlForeignTableType = pgGetGqlTypeByTypeIdAndModifier(
        foreignTable.type.id,
        null,
      );

      if (!gqlForeignTableType) {
        debug(
          `Could not determine type for foreign table with id ${foreignTable.type.id}`,
        );

        return fields;
      }

      return extend(
        fields,
        foreignKeyConstraints.reduce((memo, constraint) => {
          if (omit(constraint, "read")) {
            return memo;
          }
          const table =
            introspectionResultsByKind.classById[constraint.classId];
          if (!table) {
            throw new Error(
              `Could not find the table that referenced us (constraint: ${constraint.name})`,
            );
          }
          if (!table.isSelectable) {
            // Could be a composite type
            return memo;
          }
          const tableTypeName = inflection.tableType(table);
          const gqlTableType = pgGetGqlTypeByTypeIdAndModifier(
            table.type.id,
            null,
          );

          if (!gqlTableType) {
            debug(
              `Could not determine type for table with id ${constraint.classId}`,
            );

            return memo;
          }
          const schema = table.namespace;

          const keys = constraint.keyAttributes;
          const foreignKeys = constraint.foreignKeyAttributes;
          if (!keys.every(_ => _) || !foreignKeys.every(_ => _)) {
            throw new Error("Could not find key columns!");
          }
          if (keys.some(key => omit(key, "read"))) {
            return memo;
          }
          if (foreignKeys.some(key => omit(key, "read"))) {
            return memo;
          }
          const isUnique = !!table.constraints.find(
            c =>
              (c.type === "p" || c.type === "u") &&
              c.keyAttributeNums.length === keys.length &&
              c.keyAttributeNums.every((n, i) => keys[i].num === n),
          );

          const isDeprecated = isUnique && legacyRelationMode === DEPRECATED;

          const singleRelationFieldName = isUnique
            ? inflection.singleRelationByKeysBackwards(
                keys,
                table,
                foreignTable,
                constraint,
              )
            : null;

          const primaryKeyConstraint = table.primaryKeyConstraint;
          const primaryKeys =
            primaryKeyConstraint && primaryKeyConstraint.keyAttributes;

          const shouldAddSingleRelation =
            isUnique && legacyRelationMode !== ONLY;

          const shouldAddManyRelation =
            !isUnique ||
            legacyRelationMode === DEPRECATED ||
            legacyRelationMode === ONLY;

          if (
            shouldAddSingleRelation &&
            !omit(table, "read") &&
            singleRelationFieldName
          ) {
            memo = extend(
              memo,
              {
                [singleRelationFieldName]: fieldWithHooks(
                  singleRelationFieldName,
                  ({
                    getDataFromParsedResolveInfoFragment,
                    addDataGenerator,
                  }) => {
                    const sqlFrom = sql.identifier(schema.name, table.name);
                    addDataGenerator(parsedResolveInfoFragment => {
                      return {
                        pgQuery: queryBuilder => {
                          queryBuilder.select(() => {
                            const resolveData = getDataFromParsedResolveInfoFragment(
                              parsedResolveInfoFragment,
                              gqlTableType,
                            );

                            const tableAlias = sql.identifier(Symbol());
                            const foreignTableAlias = queryBuilder.getTableAlias();
                            const query = queryFromResolveData(
                              sqlFrom,
                              tableAlias,
                              resolveData,
                              {
                                useAsterisk: false, // Because it's only a single relation, no need
                                asJson: true,
                                addNullCase: true,
                                withPagination: false,
                              },

                              innerQueryBuilder => {
                                innerQueryBuilder.parentQueryBuilder = queryBuilder;
                                if (
                                  subscriptions &&
                                  table.primaryKeyConstraint
                                ) {
                                  innerQueryBuilder.selectIdentifiers(table);
                                }
                                keys.forEach((key, i) => {
                                  innerQueryBuilder.where(
                                    sql`${tableAlias}.${sql.identifier(
                                      key.name,
                                    )} = ${foreignTableAlias}.${sql.identifier(
                                      foreignKeys[i].name,
                                    )}`,
                                  );
                                });
                              },
                              queryBuilder.context,
                              queryBuilder.rootValue,
                            );

                            return sql`(${query})`;
                          }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
                        },
                      };
                    });
                    return {
                      description:
                        stringTag(constraint, "backwardDescription") ||
                        `Reads a single \`${tableTypeName}\` that is related to this \`${foreignTableTypeName}\`.`,
                      type: gqlTableType,
                      args: {},
                      resolve: (data, _args, _resolveContext, resolveInfo) => {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo,
                        );

                        const record = data[safeAlias];
                        const liveRecord =
                          resolveInfo.rootValue &&
                          resolveInfo.rootValue.liveRecord;
                        if (record && liveRecord) {
                          liveRecord("pg", table, record.__identifiers);
                        }
                        return record;
                      },
                    };
                  },
                  {
                    pgFieldIntrospection: table,
                    isPgBackwardSingleRelationField: true,
                  },
                ),
              },

              `Backward relation (single) for ${describePgEntity(
                constraint,
              )}. To rename this relation with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                constraint,
                {
                  foreignSingleFieldName: "newNameHere",
                },
              )}`,
            );
          }
          function makeFields(isConnection: boolean) {
            const manyRelationFieldName = isConnection
              ? inflection.manyRelationByKeys(
                  keys,
                  table,
                  foreignTable,
                  constraint,
                )
              : inflection.manyRelationByKeysSimple(
                  keys,
                  table,
                  foreignTable,
                  constraint,
                );

            memo = extend(
              memo,
              {
                [manyRelationFieldName]: fieldWithHooks(
                  manyRelationFieldName,
                  ({
                    getDataFromParsedResolveInfoFragment,
                    addDataGenerator,
                  }) => {
                    const sqlFrom = sql.identifier(schema.name, table.name);
                    const queryOptions = {
                      useAsterisk: table.canUseAsterisk,
                      withPagination: isConnection,
                      withPaginationAsFields: false,
                      asJsonAggregate: !isConnection,
                    };

                    addDataGenerator(parsedResolveInfoFragment => {
                      return {
                        pgQuery: queryBuilder => {
                          queryBuilder.select(() => {
                            const resolveData = getDataFromParsedResolveInfoFragment(
                              parsedResolveInfoFragment,
                              isConnection ? ConnectionType : TableType,
                            );

                            const tableAlias = sql.identifier(Symbol());
                            const foreignTableAlias = queryBuilder.getTableAlias();
                            const query = queryFromResolveData(
                              sqlFrom,
                              tableAlias,
                              resolveData,
                              queryOptions,
                              innerQueryBuilder => {
                                innerQueryBuilder.parentQueryBuilder = queryBuilder;
                                if (subscriptions) {
                                  innerQueryBuilder.makeLiveCollection(table);
                                  innerQueryBuilder.addLiveCondition(
                                    data => record => {
                                      return keys.every(
                                        key =>
                                          record[key.name] === data[key.name],
                                      );
                                    },
                                    keys.reduce((memo, key, i) => {
                                      memo[
                                        key.name
                                      ] = sql`${foreignTableAlias}.${sql.identifier(
                                        foreignKeys[i].name,
                                      )}`;
                                      return memo;
                                    }, {}),
                                  );
                                }
                                if (primaryKeys) {
                                  if (
                                    subscriptions &&
                                    !isConnection &&
                                    table.primaryKeyConstraint
                                  ) {
                                    innerQueryBuilder.selectIdentifiers(table);
                                  }
                                  innerQueryBuilder.beforeLock(
                                    "orderBy",
                                    () => {
                                      // append order by primary key to the list of orders
                                      if (
                                        !innerQueryBuilder.isOrderUnique(false)
                                      ) {
                                        innerQueryBuilder.data.cursorPrefix = [
                                          "primary_key_asc",
                                        ];

                                        primaryKeys.forEach(key => {
                                          innerQueryBuilder.orderBy(
                                            sql`${innerQueryBuilder.getTableAlias()}.${sql.identifier(
                                              key.name,
                                            )}`,
                                            true,
                                          );
                                        });
                                        innerQueryBuilder.setOrderIsUnique();
                                      }
                                    },
                                  );
                                }

                                keys.forEach((key, i) => {
                                  innerQueryBuilder.where(
                                    sql`${tableAlias}.${sql.identifier(
                                      key.name,
                                    )} = ${foreignTableAlias}.${sql.identifier(
                                      foreignKeys[i].name,
                                    )}`,
                                  );
                                });
                              },
                              queryBuilder.context,
                              queryBuilder.rootValue,
                            );

                            return sql`(${query})`;
                          }, getSafeAliasFromAlias(parsedResolveInfoFragment.alias));
                        },
                      };
                    });

                    if (!gqlTableType) {
                      throw new Error(
                        `Could not determine getTableType for table '${table.name}'`,
                      );
                    }

                    const ConnectionTypeOrNull = getTypeByName(
                      inflection.connection(getNamedType(gqlTableType).name),
                    );
                    if (
                      !ConnectionTypeOrNull ||
                      !(ConnectionTypeOrNull instanceof GraphQLObjectType)
                    ) {
                      throw new Error(
                        `Could not determine ConnectionType for table '${table.name}'`,
                      );
                    }
                    const ConnectionType = ConnectionTypeOrNull;

                    const TableTypeOrNull = pgGetGqlTypeByTypeIdAndModifier(
                      table.type.id,
                      null,
                    );
                    if (!TableTypeOrNull) {
                      throw new Error(
                        `Could not determine TableType for table '${table.name}'`,
                      );
                    }
                    const TableType = TableTypeOrNull;

                    return {
                      description:
                        stringTag(constraint, "backwardDescription") ||
                        `Reads and enables pagination through a set of \`${tableTypeName}\`.`,
                      type: isConnection
                        ? new GraphQLNonNull(ConnectionType)
                        : new GraphQLNonNull(
                            new GraphQLList(new GraphQLNonNull(TableType)),
                          ),
                      args: {},
                      resolve: (data, _args, _resolveContext, resolveInfo) => {
                        const safeAlias = getSafeAliasFromResolveInfo(
                          resolveInfo,
                        );
                        const liveCollection =
                          resolveInfo.rootValue &&
                          resolveInfo.rootValue.liveCollection;
                        const liveConditions =
                          resolveInfo.rootValue &&
                          resolveInfo.rootValue.liveConditions;
                        if (
                          subscriptions &&
                          liveCollection &&
                          liveConditions &&
                          data.__live
                        ) {
                          const { __id, ...rest } = data.__live;
                          const condition = liveConditions[__id];
                          const checker = condition(rest);

                          liveCollection("pg", table, checker);
                        }
                        if (isConnection) {
                          return addStartEndCursor(data[safeAlias]);
                        } else {
                          const records = data[safeAlias];
                          const liveRecord =
                            resolveInfo.rootValue &&
                            resolveInfo.rootValue.liveRecord;
                          if (primaryKeys && subscriptions && liveRecord) {
                            records.forEach(
                              (r: any) =>
                                r &&
                                r.__identifiers &&
                                liveRecord("pg", table, r.__identifiers),
                            );
                          }
                          return records;
                        }
                      },
                      ...(isDeprecated
                        ? {
                            deprecationReason: singleRelationFieldName
                              ? `Please use ${singleRelationFieldName} instead`
                              : `Please use singular instead`, // This should never happen
                          }
                        : null),
                    };
                  },
                  {
                    isPgFieldConnection: isConnection,
                    isPgFieldSimpleCollection: !isConnection,
                    isPgBackwardRelationField: true,
                    pgFieldIntrospection: table,
                  },
                ),
              },

              `Backward relation (${
                isConnection ? "connection" : "simple collection"
              }) for ${describePgEntity(
                constraint,
              )}. To rename this relation with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                constraint,
                {
                  [isConnection
                    ? "foreignFieldName"
                    : "foreignSimpleFieldName"]: "newNameHere",
                },
              )}`,
            );
          }
          if (
            shouldAddManyRelation &&
            !omit(table, "many") &&
            !omit(constraint, "many")
          ) {
            const simpleCollections =
              constraint.tags.simpleCollections ||
              table.tags.simpleCollections ||
              pgSimpleCollections;
            const hasConnections = simpleCollections !== "only";
            const hasSimpleCollections =
              simpleCollections === "only" || simpleCollections === "both";
            if (hasConnections) {
              makeFields(true);
            }
            if (
              hasSimpleCollections &&
              !isUnique // if unique, use the singular instead
            ) {
              makeFields(false);
            }
          }
          return memo;
        }, {}),
        `Adding backward relations for ${Self.name}`,
      );
    },
    ["PgBackwardRelation"],
  );
} as Plugin);
