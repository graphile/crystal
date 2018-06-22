// @flow
import type { Plugin } from "graphile-build";
import debugFactory from "debug";
import queryFromResolveData from "../queryFromResolveData";
import omit from "../omit";

const debug = debugFactory("graphile-build-pg");

export default (function PgForwardRelationPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      getSafeAliasFromResolveInfo,
      getSafeAliasFromAlias,
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      inflection,
    } = build;
    const {
      scope: {
        isPgRowType,
        isMutationPayload,
        pgIntrospection,
        pgIntrospectionTable,
      },
      fieldWithHooks,
      Self,
    } = context;
    const table = pgIntrospectionTable || pgIntrospection;
    if (
      !(isPgRowType || isMutationPayload) ||
      !table ||
      table.kind !== "class" ||
      !table.namespace
    ) {
      return fields;
    }
    // This is a relation in which we (table) are local, and there's a foreign table

    const foreignKeyConstraints = introspectionResultsByKind.constraint
      .filter(con => con.type === "f")
      .filter(con => con.classId === table.id);
    const attributes = introspectionResultsByKind.attribute
      .filter(attr => attr.classId === table.id)
      .sort((a, b) => a.num - b.num);

    return extend(
      fields,
      foreignKeyConstraints.reduce((memo, constraint) => {
        if (omit(constraint, "read")) {
          return memo;
        }
        const gqlTableType = pgGetGqlTypeByTypeIdAndModifier(
          table.type.id,
          null
        );
        const tableTypeName = gqlTableType.name;
        if (!gqlTableType) {
          debug(
            `Could not determine type for table with id ${constraint.classId}`
          );
          return memo;
        }
        const foreignTable =
          introspectionResultsByKind.classById[constraint.foreignClassId];
        const gqlForeignTableType = pgGetGqlTypeByTypeIdAndModifier(
          foreignTable.type.id,
          null
        );
        const foreignTableTypeName = gqlForeignTableType.name;
        if (!gqlForeignTableType) {
          debug(
            `Could not determine type for foreign table with id ${
              constraint.foreignClassId
            }`
          );
          return memo;
        }
        if (!foreignTable) {
          throw new Error(
            `Could not find the foreign table (constraint: ${constraint.name})`
          );
        }
        if (omit(foreignTable, "read")) {
          return memo;
        }
        const foreignSchema = introspectionResultsByKind.namespace.filter(
          n => n.id === foreignTable.namespaceId
        )[0];
        const foreignAttributes = introspectionResultsByKind.attribute
          .filter(attr => attr.classId === constraint.foreignClassId)
          .sort((a, b) => a.num - b.num);

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

        const fieldName = inflection.singleRelationByKeys(
          keys,
          foreignTable,
          table,
          constraint
        );

        memo[fieldName] = fieldWithHooks(
          fieldName,
          ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
            addDataGenerator(parsedResolveInfoFragment => {
              return {
                pgQuery: queryBuilder => {
                  queryBuilder.select(() => {
                    const resolveData = getDataFromParsedResolveInfoFragment(
                      parsedResolveInfoFragment,
                      gqlForeignTableType
                    );
                    const foreignTableAlias = sql.identifier(Symbol());
                    const query = queryFromResolveData(
                      sql.identifier(foreignSchema.name, foreignTable.name),
                      foreignTableAlias,
                      resolveData,
                      { asJson: true },
                      innerQueryBuilder => {
                        keys.forEach((key, i) => {
                          innerQueryBuilder.where(
                            sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
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
              description: `Reads a single \`${foreignTableTypeName}\` that is related to this \`${tableTypeName}\`.`,
              type: gqlForeignTableType, // Nullable since RLS may forbid fetching
              resolve: (rawData, _args, _context, resolveInfo) => {
                const data = isMutationPayload ? rawData.data : rawData;
                const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
                return data[safeAlias];
              },
            };
          },
          {
            pgFieldIntrospection: constraint,
            isPgForwardRelationField: true,
          }
        );
        return memo;
      }, {}),
      `Adding forward relations to '${Self.name}'`
    );
  });
}: Plugin);
