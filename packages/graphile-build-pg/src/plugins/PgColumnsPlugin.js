// @flow
import queryFromResolveData from "../queryFromResolveData";
import type { Plugin } from "graphile-build";

const nullableIf = (GraphQLNonNull, condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);

export default (function PgColumnsPlugin(
  builder,
  { pgInflection: inflection }
) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlTypeByTypeId,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      pg2gql,
      graphql: { GraphQLString, GraphQLNonNull },
      getAliasFromResolveInfo,
      pgTweakFragmentForType,
      pgColumnFilter,
    } = build;
    const {
      scope: { isPgRowType, isPgCompoundType, pgIntrospection: table },
      fieldWithHooks,
    } = context;
    if (
      !(isPgRowType || isPgCompoundType) ||
      !table ||
      table.kind !== "class"
    ) {
      return fields;
    }
    return extend(
      fields,
      introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .filter(attr => pgColumnFilter(attr, build, context))
        .reduce((memo, attr) => {
          /*
            attr =
              { kind: 'attribute',
                classId: '6546809',
                num: 21,
                name: 'upstreamName',
                description: null,
                typeId: '6484393',
                isNotNull: false,
                hasDefault: false }
            */
          const fieldName = inflection.column(
            attr.name,
            table.name,
            table.namespaceName
          );
          if (memo[fieldName]) {
            throw new Error(
              `Two columns produce the same GraphQL field name '${fieldName}' on class '${
                table.namespaceName
              }.${table.name}'; one of them is '${attr.name}'`
            );
          }
          memo[fieldName] = fieldWithHooks(
            fieldName,
            ({ getDataFromParsedResolveInfoFragment, addDataGenerator }) => {
              const ReturnType =
                pgGetGqlTypeByTypeId(attr.typeId) || GraphQLString;
              addDataGenerator(parsedResolveInfoFragment => {
                const { alias } = parsedResolveInfoFragment;
                return {
                  pgQuery: queryBuilder => {
                    const getSelectValueForFieldAndType = (
                      sqlFullName,
                      type
                    ) => {
                      if (type.isPgArray) {
                        const ident = sql.identifier(Symbol());
                        return sql.fragment`
                          (
                            case
                            when ${sqlFullName} is null then null
                            when coalesce(array_length(${sqlFullName}, 1), 0) = 0 then '[]'::json
                            else
                              (
                                select json_agg(${getSelectValueForFieldAndType(
                                  ident,
                                  type.arrayItemType
                                )})
                                from unnest(${sqlFullName}) as ${ident}
                              )
                            end
                          )
                        `;
                      } else if (type.type === "c") {
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment,
                          ReturnType
                        );
                        const jsonBuildObject = queryFromResolveData(
                          sql.identifier(Symbol()), // Ignore!
                          sqlFullName,
                          resolveData,
                          { onlyJsonField: true, addNullCase: true }
                        );
                        return jsonBuildObject;
                      } else {
                        return pgTweakFragmentForType(sqlFullName, type);
                      }
                    };
                    queryBuilder.select(
                      getSelectValueForFieldAndType(
                        sql.fragment`(${queryBuilder.getTableAlias()}.${sql.identifier(
                          attr.name
                        )})`, // The brackets are necessary to stop the parser getting confused, ref: https://www.postgresql.org/docs/9.6/static/rowtypes.html#ROWTYPES-ACCESSING
                        attr.type
                      ),
                      alias
                    );
                  },
                };
              });
              return {
                description: attr.description,
                type: nullableIf(
                  GraphQLNonNull,
                  !attr.isNotNull && !attr.type.domainIsNotNull,
                  ReturnType
                ),
                resolve: (data, _args, _context, resolveInfo) => {
                  const alias = getAliasFromResolveInfo(resolveInfo);
                  return pg2gql(data[alias], attr.type);
                },
              };
            },
            { pgFieldIntrospection: attr }
          );
          return memo;
        }, {})
    );
  });
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlInputTypeByTypeId,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      graphql: { GraphQLString, GraphQLNonNull },
      pgColumnFilter,
    } = build;
    const {
      scope: {
        isPgRowType,
        isPgCompoundType,
        isPgPatch,
        pgIntrospection: table,
        pgAddSubfield,
      },
    } = context;
    if (
      !(isPgRowType || isPgCompoundType) ||
      !table ||
      table.kind !== "class"
    ) {
      return fields;
    }
    return extend(
      fields,
      introspectionResultsByKind.attribute
        .filter(attr => attr.classId === table.id)
        .filter(attr => pgColumnFilter(attr, build, context))
        .reduce((memo, attr) => {
          const fieldName = inflection.column(
            attr.name,
            table.name,
            table.namespaceName
          );
          if (memo[fieldName]) {
            throw new Error(
              `Two columns produce the same GraphQL field name '${fieldName}' on input class '${
                table.namespaceName
              }.${table.name}'; one of them is '${attr.name}'`
            );
          }
          memo[fieldName] = pgAddSubfield(fieldName, attr.name, attr.type, {
            description: attr.description,
            type: nullableIf(
              GraphQLNonNull,
              isPgPatch ||
                (!attr.isNotNull && !attr.type.domainIsNotNull) ||
                attr.hasDefault,
              pgGetGqlInputTypeByTypeId(attr.typeId) || GraphQLString
            ),
          });
          return memo;
        }, {})
    );
  });
}: Plugin);
