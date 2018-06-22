// @flow
import type { Plugin } from "graphile-build";
import queryFromResolveData from "../queryFromResolveData";
import debugFactory from "debug";
import omit from "../omit";

const base64Decode = str => new Buffer(String(str), "base64").toString("utf8");
const debugSql = debugFactory("graphile-build-pg:sql");

export default (async function PgRowNode(builder) {
  builder.hook("GraphQLObjectType", (object, build, context) => {
    const {
      addNodeFetcherForTypeName,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      gql2pg,
    } = build;
    const { scope: { isPgRowType, pgIntrospection: table } } = context;
    if (!isPgRowType || !table.namespace || omit(table, "read")) {
      return object;
    }
    const sqlFullTableName = sql.identifier(table.namespace.name, table.name);
    const attributes = introspectionResultsByKind.attribute.filter(
      attr => attr.classId === table.id
    );
    const primaryKeyConstraint = introspectionResultsByKind.constraint
      .filter(con => con.classId === table.id)
      .filter(con => con.type === "p")[0];
    if (!primaryKeyConstraint) {
      return object;
    }
    const primaryKeys =
      primaryKeyConstraint &&
      primaryKeyConstraint.keyAttributeNums.map(
        num => attributes.filter(attr => attr.num === num)[0]
      );
    addNodeFetcherForTypeName(
      object.name,
      async (
        data,
        identifiers,
        { pgClient },
        parsedResolveInfoFragment,
        ReturnType,
        resolveData
      ) => {
        if (identifiers.length !== primaryKeys.length) {
          throw new Error("Invalid ID");
        }
        const query = queryFromResolveData(
          sqlFullTableName,
          undefined,
          resolveData,
          {},
          builder => {
            primaryKeys.forEach((key, idx) => {
              builder.where(
                sql.fragment`${builder.getTableAlias()}.${sql.identifier(
                  key.name
                )} = ${gql2pg(identifiers[idx], primaryKeys[idx].type)}`
              );
            });
          }
        );
        const { text, values } = sql.compile(query);
        if (debugSql.enabled) debugSql(text);
        const { rows: [row] } = await pgClient.query(text, values);
        return row;
      }
    );
    return object;
  });

  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      nodeIdFieldName,
      extend,
      parseResolveInfo,
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      gql2pg,
      getNodeType,
      graphql: { GraphQLNonNull, GraphQLID },
      inflection,
    } = build;
    const { scope: { isRootQuery }, fieldWithHooks } = context;
    if (!isRootQuery || !nodeIdFieldName) {
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
            const attributes = introspectionResultsByKind.attribute.filter(
              attr => attr.classId === table.id
            );
            const primaryKeyConstraint = introspectionResultsByKind.constraint
              .filter(con => con.classId === table.id)
              .filter(con => con.type === "p")[0];
            if (!primaryKeyConstraint) {
              return memo;
            }
            const primaryKeys =
              primaryKeyConstraint &&
              primaryKeyConstraint.keyAttributeNums.map(
                num => attributes.filter(attr => attr.num === num)[0]
              );
            const fieldName = inflection.tableNode(table);
            memo[fieldName] = fieldWithHooks(
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
                  async resolve(parent, args, { pgClient }, resolveInfo) {
                    const nodeId = args[nodeIdFieldName];
                    try {
                      const [alias, ...identifiers] = JSON.parse(
                        base64Decode(nodeId)
                      );
                      const NodeTypeByAlias = getNodeType(alias);
                      if (NodeTypeByAlias !== TableType) {
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
                        builder => {
                          primaryKeys.forEach((key, idx) => {
                            builder.where(
                              sql.fragment`${builder.getTableAlias()}.${sql.identifier(
                                key.name
                              )} = ${gql2pg(
                                identifiers[idx],
                                primaryKeys[idx].type
                              )}`
                            );
                          });
                        }
                      );
                      const { text, values } = sql.compile(query);
                      if (debugSql.enabled) debugSql(text);
                      const { rows: [row] } = await pgClient.query(
                        text,
                        values
                      );
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
            );
          }
          return memo;
        }, {}),
      `Adding "row by node ID" fields to root Query type`
    );
  });
}: Plugin);
