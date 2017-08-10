// @flow
import type { Plugin } from "graphile-build";
const base64 = str => new Buffer(String(str)).toString("base64");

export default (function PgTablesPlugin(builder, { pgInflection: inflection }) {
  builder.hook(
    "init",
    (
      _,
      {
        getNodeIdForTypeAndIdentifiers,
        nodeIdFieldName,
        newWithHooks,
        pgSql: sql,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        getTypeByName,
        pgGqlTypeByTypeId,
        pgGqlInputTypeByTypeId,
        pg2GqlMapper,
        gql2pg,
        graphql: {
          GraphQLObjectType,
          GraphQLNonNull,
          GraphQLID,
          GraphQLList,
          GraphQLInputObjectType,
        },
      }
    ) => {
      const Cursor = getTypeByName("Cursor");
      introspectionResultsByKind.class.forEach(table => {
        const tablePgType = introspectionResultsByKind.type.filter(
          type =>
            type.type === "c" &&
            type.category === "C" &&
            type.namespaceId === table.namespaceId &&
            type.classId === table.id
        )[0];
        if (!tablePgType) {
          throw new Error("Could not determine the type for this table");
        }
        if (pg2GqlMapper[tablePgType.id]) {
          // Already handled
          return;
        }
        /*
        table =
          { kind: 'class',
            id: '6484790',
            name: 'bundle',
            description: null,
            namespaceId: '6484381',
            typeId: '6484792',
            isSelectable: true,
            isInsertable: true,
            isUpdatable: true,
            isDeletable: true }
        */
        const schema = table.namespace;
        const primaryKeyConstraint = introspectionResultsByKind.constraint
          .filter(con => con.classId === table.id)
          .filter(con => con.type === "p")[0];
        const primaryKeys =
          primaryKeyConstraint &&
          primaryKeyConstraint.keyAttributeNums.map(
            num =>
              introspectionResultsByKind.attributeByClassIdAndNum[table.id][num]
          );
        const attributes = introspectionResultsByKind.attribute
          .filter(attr => attr.classId === table.id)
          .sort((a1, a2) => a1.num - a2.num);
        const tableTypeName = inflection.tableType(
          table.name,
          schema && schema.name
        );
        const shouldHaveNodeId: boolean =
          nodeIdFieldName &&
          table.isSelectable &&
          primaryKeys &&
          primaryKeys.length
            ? true
            : false;
        const TableType = newWithHooks(
          GraphQLObjectType,
          {
            description: table.description || tablePgType.description,
            name: tableTypeName,
            interfaces: () => {
              if (shouldHaveNodeId) {
                return [getTypeByName("Node")];
              } else {
                return [];
              }
            },
            fields: ({ addDataGeneratorForField, Self }) => {
              const fields = {};
              if (shouldHaveNodeId) {
                // Enable nodeId interface
                addDataGeneratorForField(nodeIdFieldName, () => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(
                        sql.fragment`json_build_array(${sql.join(
                          primaryKeys.map(
                            key =>
                              sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                key.name
                              )}`
                          ),
                          ", "
                        )})`,
                        "__identifiers"
                      );
                    },
                  };
                });
                fields[nodeIdFieldName] = {
                  description:
                    "A globally unique identifier. Can be used in various places throughout the system to identify this single value.",
                  type: new GraphQLNonNull(GraphQLID),
                  resolve(data) {
                    return (
                      data.__identifiers &&
                      getNodeIdForTypeAndIdentifiers(
                        Self,
                        ...data.__identifiers
                      )
                    );
                  },
                };
              }
              return fields;
            },
          },
          {
            pgIntrospection: table,
            isPgRowType: table.isSelectable,
            isPgCompoundType: !table.isSelectable,
          }
        );
        const pgInputFields = {};
        const TableInputType = newWithHooks(
          GraphQLInputObjectType,
          {
            description: `An input for mutations affecting \`${tableTypeName}\``,
            name: inflection.inputType(TableType),
          },
          {
            pgIntrospection: table,
            isInputType: true,
            isPgRowType: table.isSelectable,
            isPgCompoundType: !table.isSelectable,
            pgAddSubfield(fieldName, attrName, pgType, spec) {
              pgInputFields[fieldName] = {
                name: attrName,
                type: pgType,
              };
              return spec;
            },
          }
        );

        pg2GqlMapper[tablePgType.id] = {
          map: _ => _,
          unmap: obj => {
            return sql.fragment`row(${sql.join(
              attributes.map(attr => {
                const fieldName = inflection.column(
                  attr.name,
                  table.name,
                  table.namespace.name
                );
                const pgInputField = pgInputFields[fieldName];
                const v = obj[fieldName];
                if (pgInputField && v != null) {
                  const { type } = pgInputField;
                  return sql.fragment`${gql2pg(v, type)}::${sql.identifier(
                    type.namespaceName,
                    type.name
                  )}`;
                } else {
                  return sql.null;
                }
              }),
              ","
            )})::${sql.identifier(
              tablePgType.namespaceName,
              tablePgType.name
            )}`;
          },
        };

        if (table.isSelectable) {
          /* const TablePatchType = */
          newWithHooks(
            GraphQLInputObjectType,
            {
              description: `Represents an update to a \`${tableTypeName}\`. Fields that are set will be updated.`,
              name: inflection.patchType(TableType),
            },
            {
              pgIntrospection: table,
              isPgRowType: table.isSelectable,
              isPgCompoundType: !table.isSelectable,
              isPgPatch: true,
              pgAddSubfield(fieldName, _attrName, _type, spec) {
                // We don't use this currently
                return spec;
              },
            }
          );
          const EdgeType = newWithHooks(
            GraphQLObjectType,
            {
              description: `A \`${tableTypeName}\` edge in the connection.`,
              name: inflection.edge(TableType.name),
              fields: ({ fieldWithHooks, recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("node");
                return {
                  cursor: fieldWithHooks("cursor", ({ addDataGenerator }) => {
                    addDataGenerator(() => ({
                      usesCursor: [true],
                    }));
                    return {
                      description: "A cursor for use in pagination.",
                      type: Cursor,
                      resolve(data) {
                        return (
                          data.__cursor && base64(JSON.stringify(data.__cursor))
                        );
                      },
                    };
                  }),
                  node: {
                    description: `The \`${tableTypeName}\` at the end of the edge.`,
                    type: new GraphQLNonNull(TableType),
                    resolve(data) {
                      return data;
                    },
                  },
                };
              },
            },
            {
              isEdgeType: true,
              isPgRowEdgeType: true,
              nodeType: TableType,
              pgIntrospection: table,
            }
          );
          const PageInfo = getTypeByName("PageInfo");
          /*const ConnectionType = */
          newWithHooks(
            GraphQLObjectType,
            {
              description: `A connection to a list of \`${tableTypeName}\` values.`,
              name: inflection.connection(TableType.name),
              fields: ({ recurseDataGeneratorsForField }) => {
                recurseDataGeneratorsForField("edges");
                recurseDataGeneratorsForField("nodes");
                recurseDataGeneratorsForField("pageInfo");
                return {
                  nodes: {
                    description: `A list of \`${tableTypeName}\` objects.`,
                    type: new GraphQLNonNull(new GraphQLList(TableType)),
                    resolve(data) {
                      return data.data;
                    },
                  },
                  edges: {
                    description: `A list of edges which contains the \`${tableTypeName}\` and cursor to aid in pagination.`,
                    type: new GraphQLNonNull(
                      new GraphQLList(new GraphQLNonNull(EdgeType))
                    ),
                    resolve(data) {
                      return data.data;
                    },
                  },
                  pageInfo: PageInfo && {
                    description: "Information to aid in pagination.",
                    type: new GraphQLNonNull(PageInfo),
                    resolve(data) {
                      return data;
                    },
                  },
                };
              },
            },
            {
              isConnectionType: true,
              isPgRowConnectionType: true,
              edgeType: EdgeType,
              nodeType: TableType,
              pgIntrospection: table,
            }
          );
        }
        pgGqlTypeByTypeId[tablePgType.id] = TableType;
        pgGqlInputTypeByTypeId[tablePgType.id] = TableInputType;
      });
      return _;
    }
  );
}: Plugin);
