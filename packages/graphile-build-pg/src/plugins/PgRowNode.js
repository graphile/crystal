// @flow
import type { Plugin } from "graphile-build";
import debugSql from "./debugSql";

export default (async function PgRowNode(builder, { subscriptions }) {
  builder.hook("GraphQLObjectType", (object, build, context) => {
    const {
      addNodeFetcherForTypeName,
      pgSql: sql,
      gql2pg,
      pgQueryFromResolveData: queryFromResolveData,
      pgOmit: omit,
    } = build;
    const {
      scope: { isPgRowType, pgIntrospection: table },
    } = context;

    if (!addNodeFetcherForTypeName) {
      // Node plugin must be disabled.
      return object;
    }
    if (!isPgRowType || !table.namespace || omit(table, "read")) {
      return object;
    }
    const sqlFullTableName = sql.identifier(table.namespace.name, table.name);
    const primaryKeyConstraint = table.primaryKeyConstraint;
    if (!primaryKeyConstraint) {
      return object;
    }
    const primaryKeys =
      primaryKeyConstraint && primaryKeyConstraint.keyAttributes;

    addNodeFetcherForTypeName(
      object.name,
      async (
        data,
        identifiers,
        resolveContext,
        parsedResolveInfoFragment,
        ReturnType,
        resolveData
      ) => {
        const { pgClient, liveRecord } = resolveContext;
        if (identifiers.length !== primaryKeys.length) {
          throw new Error("Invalid ID");
        }
        const query = queryFromResolveData(
          sqlFullTableName,
          undefined,
          resolveData,
          {},
          queryBuilder => {
            if (subscriptions && table.primaryKeyConstraint) {
              queryBuilder.selectIdentifiers(table);
            }
            primaryKeys.forEach((key, idx) => {
              queryBuilder.where(
                sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                  key.name
                )} = ${gql2pg(
                  identifiers[idx],
                  primaryKeys[idx].type,
                  primaryKeys[idx].typeModifier
                )}`
              );
            });
          },
          resolveContext
        );
        const { text, values } = sql.compile(query);
        if (debugSql.enabled) debugSql(text);
        const {
          rows: [row],
        } = await pgClient.query(text, values);
        if (subscriptions && liveRecord && row) {
          liveRecord("pg", table, row.__identifiers);
        }
        return row;
      }
    );
    return object;
  });

  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      nodeIdFieldName,
      getTypeAndIdentifiersFromNodeId,
      extend,
      parseResolveInfo,
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      gql2pg,
      graphql: { GraphQLNonNull, GraphQLID },
      inflection,
      pgQueryFromResolveData: queryFromResolveData,
      pgOmit: omit,
      describePgEntity,
      sqlCommentByAddingTags,
    } = build;
    const {
      scope: { isRootQuery },
      fieldWithHooks,
    } = context;

    if (!isRootQuery || !nodeIdFieldName) {
      return fields;
    }

    return extend(
      fields,
      introspectionResultsByKind.class.reduce((memo, table) => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!table.namespace) return memo;
        if (omit(table, "read")) return memo;

        const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
        const sqlFullTableName = sql.identifier(
          table.namespace.name,
          table.name
        );
        if (TableType) {
          const primaryKeyConstraint = table.primaryKeyConstraint;
          if (!primaryKeyConstraint) {
            return memo;
          }
          const primaryKeys =
            primaryKeyConstraint && primaryKeyConstraint.keyAttributes;
          const fieldName = inflection.tableNode(table);
          memo = extend(
            memo,
            {
              [fieldName]: fieldWithHooks(
                fieldName,
                ({ getDataFromParsedResolveInfoFragment }) => {
                  return {
                    description: `Reads a single \`${
                      TableType.name
                    }\` using its globally unique \`ID\`.`,
                    type: TableType,
                    args: {
                      [nodeIdFieldName]: {
                        description: `The globally unique \`ID\` to be used in selecting a single \`${
                          TableType.name
                        }\`.`,
                        type: new GraphQLNonNull(GraphQLID),
                      },
                    },
                    async resolve(parent, args, resolveContext, resolveInfo) {
                      const { pgClient, liveRecord } = resolveContext;
                      const nodeId = args[nodeIdFieldName];
                      try {
                        const {
                          Type,
                          identifiers,
                        } = getTypeAndIdentifiersFromNodeId(nodeId);
                        if (Type !== TableType) {
                          throw new Error("Mismatched type");
                        }
                        if (identifiers.length !== primaryKeys.length) {
                          throw new Error("Invalid ID");
                        }

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
                            if (subscriptions && table.primaryKeyConstraint) {
                              queryBuilder.selectIdentifiers(table);
                            }
                            primaryKeys.forEach((key, idx) => {
                              queryBuilder.where(
                                sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                  key.name
                                )} = ${gql2pg(
                                  identifiers[idx],
                                  primaryKeys[idx].type,
                                  primaryKeys[idx].typeModifier
                                )}`
                              );
                            });
                          },
                          resolveContext
                        );
                        const { text, values } = sql.compile(query);
                        if (debugSql.enabled) debugSql(text);
                        const {
                          rows: [row],
                        } = await pgClient.query(text, values);
                        if (liveRecord && row) {
                          liveRecord("pg", table, row.__identifiers);
                        }
                        return row;
                      } catch (e) {
                        return null;
                      }
                    },
                  };
                },
                {
                  isPgNodeQuery: true,
                  pgFieldIntrospection: table,
                }
              ),
            },
            `Adding row by globally unique identifier field for ${describePgEntity(
              table
            )}. You can rename this table via:\n\n  ${sqlCommentByAddingTags(
              table,
              { name: "newNameHere" }
            )}`
          );
        }
        return memo;
      }, {}),
      `Adding "row by node ID" fields to root Query type`
    );
  });
}: Plugin);
