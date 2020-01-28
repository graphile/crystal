import { Plugin } from "graphile-build";
import debugFactory from "debug";
import { stringTag } from "./PgBasicsPlugin";

declare module "graphile-build" {
  interface ScopeGraphQLObjectTypeFieldsField {
    isPgForwardRelationField?: boolean;
  }
}

const debug = debugFactory("graphile-build-pg");

export default (function PgForwardRelationPlugin(builder, { subscriptions }) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        getSafeAliasFromResolveInfo,
        getSafeAliasFromAlias,
        pgGetGqlTypeByTypeIdAndModifier,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
        inflection,
        pgQueryFromResolveData: queryFromResolveData,
        pgOmit: omit,
        sqlCommentByAddingTags,
        describePgEntity,
        graphql: { getNamedType },
      } = build;
      const {
        scope: {
          isPgRowType,
          isPgCompositeType,
          isMutationPayload,
          pgIntrospection,
          pgIntrospectionTable,
        },

        fieldWithHooks,
        Self,
      } = context;

      const table = pgIntrospectionTable || pgIntrospection;
      if (
        !pgIntrospection ||
        !(isPgRowType || isMutationPayload || isPgCompositeType) ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
        return fields;
      }
      if (
        isMutationPayload &&
        pgIntrospection.kind === "procedure" &&
        (pgIntrospection.returnTypeId !== table.typeId ||
          pgIntrospection.returnsSet)
      ) {
        return fields;
      }
      // This is a relation in which we (table) are local, and there's a foreign table

      const foreignKeyConstraints = table.constraints.filter(
        con => con.type === "f"
      );

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

          if (!gqlTableType) {
            debug(
              `Could not determine type for table with id ${constraint.classId}`
            );

            return memo;
          }
          const tableTypeName = getNamedType(gqlTableType).name;
          const foreignTable = constraint.foreignClassId
            ? introspectionResultsByKind.classById[constraint.foreignClassId]
            : null;
          if (!foreignTable) {
            return memo;
          }
          const gqlForeignTableType = pgGetGqlTypeByTypeIdAndModifier(
            foreignTable.type.id,
            null
          );

          if (!gqlForeignTableType) {
            debug(
              `Could not determine type for foreign table with id ${constraint.foreignClassId}`
            );

            return memo;
          }
          const foreignTableTypeName = getNamedType(gqlForeignTableType).name;
          if (omit(foreignTable, "read")) {
            return memo;
          }
          const foreignSchema = foreignTable.namespace;

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

          const fieldName = inflection.singleRelationByKeys(
            keys,
            foreignTable,
            table,
            constraint
          );

          memo = extend(
            memo,
            {
              [fieldName]: fieldWithHooks(
                fieldName,
                ({
                  getDataFromParsedResolveInfoFragment,
                  addDataGenerator,
                }) => {
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
                            sql.identifier(
                              foreignSchema.name,
                              foreignTable.name
                            ),

                            foreignTableAlias,
                            resolveData,
                            {
                              useAsterisk: false, // Because it's only a single relation, no need
                              asJson: true,
                            },

                            innerQueryBuilder => {
                              innerQueryBuilder.parentQueryBuilder = queryBuilder;
                              if (subscriptions && table.primaryKeyConstraint) {
                                queryBuilder.selectIdentifiers(table);
                              }
                              if (
                                subscriptions &&
                                foreignTable.primaryKeyConstraint
                              ) {
                                innerQueryBuilder.selectIdentifiers(
                                  foreignTable
                                );
                              }
                              keys.forEach((key, i) => {
                                innerQueryBuilder.where(
                                  sql.fragment`${queryBuilder.getTableAlias()}.${sql.identifier(
                                    key.name
                                  )} = ${foreignTableAlias}.${sql.identifier(
                                    foreignKeys[i].name
                                  )}`
                                );
                              });
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
                    description:
                      stringTag(constraint, "forwardDescription") ||
                      `Reads a single \`${foreignTableTypeName}\` that is related to this \`${tableTypeName}\`.`,
                    type: gqlForeignTableType, // Nullable since RLS may forbid fetching
                    resolve: (rawData, _args, _resolveContext, resolveInfo) => {
                      const data = isMutationPayload ? rawData.data : rawData;
                      if (!data) return null;
                      const safeAlias = getSafeAliasFromResolveInfo(
                        resolveInfo
                      );

                      const record = data[safeAlias];
                      const liveRecord =
                        resolveInfo.rootValue &&
                        resolveInfo.rootValue.liveRecord;
                      if (record && liveRecord) {
                        liveRecord("pg", foreignTable, record.__identifiers);
                      }
                      return record;
                    },
                  };
                },
                {
                  pgFieldIntrospection: constraint,
                  isPgForwardRelationField: true,
                }
              ),
            },

            `Forward relation for ${describePgEntity(
              constraint
            )}. To rename this relation with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              constraint,
              {
                fieldName: "newNameHere",
              }
            )}`
          );

          return memo;
        }, {}),
        `Adding forward relations to '${Self.name}'`
      );
    },
    ["PgForwardRelation"]
  );
} as Plugin);
