// @flow
import type { Plugin } from "graphile-build";
import queryFromResolveData from "../queryFromResolveData";
import debugFactory from "debug";
import viaTemporaryTable from "./viaTemporaryTable";

const debug = debugFactory("graphile-build-pg");

export default (function PgMutationCreatePlugin(
  builder,
  { pgInflection: inflection, pgDisableDefaultMutations }
) {
  if (pgDisableDefaultMutations) {
    return;
  }
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, { scope: { isRootMutation }, fieldWithHooks }) => {
      const {
        extend,
        newWithHooks,
        parseResolveInfo,
        pgIntrospectionResultsByKind,
        pgGetGqlTypeByTypeId,
        pgGetGqlInputTypeByTypeId,
        pgSql: sql,
        gql2pg,
        graphql: {
          GraphQLObjectType,
          GraphQLInputObjectType,
          GraphQLNonNull,
          GraphQLString,
        },
        pgColumnFilter,
      } = build;
      if (!isRootMutation) {
        return fields;
      }

      return extend(
        fields,
        pgIntrospectionResultsByKind.class
          .filter(table => !!table.namespace)
          .filter(table => table.isSelectable)
          .filter(table => table.isInsertable)
          .reduce((memo, table) => {
            const Table = pgGetGqlTypeByTypeId(table.type.id);
            if (!Table) {
              debug(
                `There was no table type for table '${table.namespace
                  .name}.${table.name}', so we're not generating a create mutation for it.`
              );
              return memo;
            }
            const TableInput = pgGetGqlInputTypeByTypeId(table.type.id);
            if (!TableInput) {
              debug(
                `There was no input type for table '${table.namespace
                  .name}.${table.name}', so we're not generating a create mutation for it.`
              );
              return memo;
            }
            const tableTypeName = inflection.tableType(
              table.name,
              table.namespace.name
            );
            const InputType = newWithHooks(
              GraphQLInputObjectType,
              {
                name: inflection.createInputType(
                  table.name,
                  table.namespace.name
                ),
                description: `All input for the create \`${tableTypeName}\` mutation.`,
                fields: {
                  clientMutationId: {
                    description:
                      "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
                    type: GraphQLString,
                  },
                  [inflection.tableName(table.name, table.namespace.name)]: {
                    description: `The \`${tableTypeName}\` to be created by this mutation.`,
                    type: new GraphQLNonNull(TableInput),
                  },
                },
              },
              {
                isPgCreateInputType: true,
                pgInflection: table,
              }
            );
            const PayloadType = newWithHooks(
              GraphQLObjectType,
              {
                name: inflection.createPayloadType(
                  table.name,
                  table.namespace.name
                ),
                description: `The output of our create \`${tableTypeName}\` mutation.`,
                fields: ({ recurseDataGeneratorsForField }) => {
                  const tableName = inflection.tableName(
                    table.name,
                    table.namespace.name
                  );
                  recurseDataGeneratorsForField(tableName);
                  return {
                    clientMutationId: {
                      description:
                        "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
                      type: GraphQLString,
                    },
                    [tableName]: {
                      description: `The \`${tableTypeName}\` that was created by this mutation.`,
                      type: Table,
                      resolve(data) {
                        return data.data;
                      },
                    },
                  };
                },
              },
              {
                isMutationPayload: true,
                isPgCreatePayloadType: true,
                pgIntrospection: table,
              }
            );
            const fieldName = inflection.createField(
              table.name,
              table.namespace.name
            );
            memo[fieldName] = fieldWithHooks(
              fieldName,
              context => {
                const { getDataFromParsedResolveInfoFragment } = context;
                return {
                  description: `Creates a single \`${tableTypeName}\`.`,
                  type: PayloadType,
                  args: {
                    input: {
                      type: new GraphQLNonNull(InputType),
                    },
                  },
                  async resolve(data, { input }, { pgClient }, resolveInfo) {
                    const parsedResolveInfoFragment = parseResolveInfo(
                      resolveInfo
                    );
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment,
                      PayloadType
                    );
                    const insertedRowAlias = sql.identifier(Symbol());
                    const query = queryFromResolveData(
                      insertedRowAlias,
                      insertedRowAlias,
                      resolveData,
                      {}
                    );
                    const sqlColumns = [];
                    const sqlValues = [];
                    const inputData =
                      input[
                        inflection.tableName(table.name, table.namespace.name)
                      ];
                    pgIntrospectionResultsByKind.attribute
                      .filter(attr => attr.classId === table.id)
                      .filter(attr => pgColumnFilter(attr, build, context))
                      .forEach(attr => {
                        const fieldName = inflection.column(
                          attr.name,
                          table.name,
                          table.namespace.name
                        );
                        const val = inputData[fieldName];
                        if (
                          Object.prototype.hasOwnProperty.call(
                            inputData,
                            fieldName
                          )
                        ) {
                          sqlColumns.push(sql.identifier(attr.name));
                          sqlValues.push(gql2pg(val, attr.type));
                        }
                      });

                    const mutationQuery = sql.query`
                    insert into ${sql.identifier(
                      table.namespace.name,
                      table.name
                    )} ${sqlColumns.length
                      ? sql.fragment`(
                        ${sql.join(sqlColumns, ", ")}
                      ) values(${sql.join(sqlValues, ", ")})`
                      : sql.fragment`default values`} returning *`;

                    let row;
                    try {
                      await pgClient.query("SAVEPOINT graphql_mutation");
                      const result = await viaTemporaryTable(
                        pgClient,
                        sql.identifier(table.namespace.name, table.name),
                        mutationQuery,
                        insertedRowAlias,
                        query
                      );
                      row = result.rows[0];
                      await pgClient.query(
                        "RELEASE SAVEPOINT graphql_mutation"
                      );
                    } catch (e) {
                      await pgClient.query(
                        "ROLLBACK TO SAVEPOINT graphql_mutation"
                      );
                      throw e;
                    }
                    return {
                      clientMutationId: input.clientMutationId,
                      data: row,
                    };
                  },
                };
              },
              {
                pgFieldIntrospection: table,
                isPgCreateMutationField: true,
              }
            );
            return memo;
          }, {})
      );
    }
  );
}: Plugin);
