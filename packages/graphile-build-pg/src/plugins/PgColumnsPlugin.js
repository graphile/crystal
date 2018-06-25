// @flow
import type { Plugin } from "graphile-build";

const nullableIf = (GraphQLNonNull, condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);

export default (function PgColumnsPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      pgSql: sql,
      pg2gql,
      graphql: { GraphQLString, GraphQLNonNull },
      pgTweakFragmentForTypeAndModifier,
      pgColumnFilter,
      inflection,
      pgQueryFromResolveData: queryFromResolveData,
      pgOmit: omit,
    } = build;
    const {
      scope: { isPgRowType, isPgCompoundType, pgIntrospection: table },
      fieldWithHooks,
      Self,
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
        .filter(attr => !omit(attr, "read"))
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
          const fieldName = inflection.column(attr);
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
                pgGetGqlTypeByTypeIdAndModifier(
                  attr.typeId,
                  attr.typeModifier
                ) || GraphQLString;
              addDataGenerator(parsedResolveInfoFragment => {
                return {
                  pgQuery: queryBuilder => {
                    const getSelectValueForFieldAndTypeAndModifier = (
                      sqlFullName,
                      type,
                      typeModifier
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
                                select json_agg(${getSelectValueForFieldAndTypeAndModifier(
                                  ident,
                                  type.arrayItemType,
                                  typeModifier
                                )})
                                from unnest(${sqlFullName}) as ${ident}
                              )
                            end
                          )
                        `;
                      } else {
                        const resolveData = getDataFromParsedResolveInfoFragment(
                          parsedResolveInfoFragment,
                          ReturnType
                        );
                        if (type.type === "c") {
                          const jsonBuildObject = queryFromResolveData(
                            sql.identifier(Symbol()), // Ignore!
                            sqlFullName,
                            resolveData,
                            { onlyJsonField: true, addNullCase: true }
                          );
                          return jsonBuildObject;
                        } else {
                          return pgTweakFragmentForTypeAndModifier(
                            sqlFullName,
                            type,
                            typeModifier,
                            resolveData
                          );
                        }
                      }
                    };
                    queryBuilder.select(
                      getSelectValueForFieldAndTypeAndModifier(
                        sql.fragment`(${queryBuilder.getTableAlias()}.${sql.identifier(
                          attr.name
                        )})`, // The brackets are necessary to stop the parser getting confused, ref: https://www.postgresql.org/docs/9.6/static/rowtypes.html#ROWTYPES-ACCESSING
                        attr.type,
                        attr.typeModifier
                      ),
                      fieldName
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
                resolve: (data, _args, _context, _resolveInfo) => {
                  return pg2gql(data[fieldName], attr.type);
                },
              };
            },
            { pgFieldIntrospection: attr }
          );
          return memo;
        }, {}),
      `Adding columns to '${Self.name}'`
    );
  });
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlInputTypeByTypeIdAndModifier,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      graphql: { GraphQLString, GraphQLNonNull },
      pgColumnFilter,
      inflection,
      pgOmit: omit,
    } = build;
    const {
      scope: {
        isPgRowType,
        isPgCompoundType,
        isPgPatch,
        isPgBaseInput,
        pgIntrospection: table,
        pgAddSubfield,
      },
      fieldWithHooks,
      Self,
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
        .filter(
          attr =>
            !omit(
              attr,
              isPgBaseInput ? "base" : isPgPatch ? "update" : "create"
            )
        )
        .reduce((memo, attr) => {
          const fieldName = inflection.column(attr);
          if (memo[fieldName]) {
            throw new Error(
              `Two columns produce the same GraphQL field name '${fieldName}' on input class '${
                table.namespaceName
              }.${table.name}'; one of them is '${attr.name}'`
            );
          }
          memo[fieldName] = fieldWithHooks(
            fieldName,
            pgAddSubfield(fieldName, attr.name, attr.type, {
              description: attr.description,
              type: nullableIf(
                GraphQLNonNull,
                isPgBaseInput ||
                  isPgPatch ||
                  (!attr.isNotNull && !attr.type.domainIsNotNull) ||
                  attr.hasDefault,
                pgGetGqlInputTypeByTypeIdAndModifier(
                  attr.typeId,
                  attr.typeModifier
                ) || GraphQLString
              ),
            }),
            { pgFieldIntrospection: attr }
          );
          return memo;
        }, {}),
      `Adding columns to input object '${Self.name}'`
    );
  });
}: Plugin);
