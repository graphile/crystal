// @flow
import type { Plugin } from "graphile-build";

const nullableIf = (GraphQLNonNull, condition, Type) =>
  condition ? Type : new GraphQLNonNull(Type);

export default (function PgColumnsPlugin(builder) {
  builder.hook("build", build => {
    const {
      pgSql: sql,
      pgTweakFragmentForTypeAndModifier,
      pgQueryFromResolveData: queryFromResolveData,
    } = build;
    const getSelectValueForFieldAndTypeAndModifier = (
      ReturnType,
      fieldScope,
      parsedResolveInfoFragment,
      sqlFullName,
      type,
      typeModifier
    ) => {
      const { getDataFromParsedResolveInfoFragment } = fieldScope;
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
                  ReturnType,
                  fieldScope,
                  parsedResolveInfoFragment,
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
    return build.extend(build, {
      pgGetSelectValueForFieldAndTypeAndModifier: getSelectValueForFieldAndTypeAndModifier,
    });
  });

  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlTypeByTypeIdAndModifier,
      pgSql: sql,
      pg2gql,
      graphql: { GraphQLString, GraphQLNonNull },
      pgColumnFilter,
      inflection,
      pgOmit: omit,
      pgGetSelectValueForFieldAndTypeAndModifier: getSelectValueForFieldAndTypeAndModifier,
      describePgEntity,
      sqlCommentByAddingTags,
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
      table.attributes.reduce((memo, attr) => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!pgColumnFilter(attr, build, context)) return memo;
        if (omit(attr, "read")) return memo;

        const fieldName = inflection.column(attr);
        if (memo[fieldName]) {
          throw new Error(
            `Two columns produce the same GraphQL field name '${fieldName}' on class '${
              table.namespaceName
            }.${table.name}'; one of them is '${attr.name}'`
          );
        }
        memo = extend(
          memo,
          {
            [fieldName]: fieldWithHooks(
              fieldName,
              fieldContext => {
                const { addDataGenerator } = fieldContext;
                const ReturnType =
                  pgGetGqlTypeByTypeIdAndModifier(
                    attr.typeId,
                    attr.typeModifier
                  ) || GraphQLString;
                addDataGenerator(parsedResolveInfoFragment => {
                  return {
                    pgQuery: queryBuilder => {
                      queryBuilder.select(
                        getSelectValueForFieldAndTypeAndModifier(
                          ReturnType,
                          fieldContext,
                          parsedResolveInfoFragment,
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
                    !attr.isNotNull &&
                      !attr.type.domainIsNotNull &&
                      !attr.tags.notNull,
                    ReturnType
                  ),
                  resolve: (data, _args, _context, _resolveInfo) => {
                    return pg2gql(data[fieldName], attr.type);
                  },
                };
              },
              { pgFieldIntrospection: attr }
            ),
          },
          `Adding field for ${describePgEntity(
            attr
          )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
            attr,
            {
              name: "newNameHere",
            }
          )}`
        );
        return memo;
      }, {}),
      `Adding columns to '${describePgEntity(table)}'`
    );
  });
  builder.hook("GraphQLInputObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgGetGqlInputTypeByTypeIdAndModifier,
      graphql: { GraphQLString, GraphQLNonNull },
      pgColumnFilter,
      inflection,
      pgOmit: omit,
      describePgEntity,
      sqlCommentByAddingTags,
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
      table.attributes.reduce((memo, attr) => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (!pgColumnFilter(attr, build, context)) return memo;
        const action = isPgBaseInput ? "base" : isPgPatch ? "update" : "create";
        if (omit(attr, action)) return memo;
        if (attr.identity === "a") return memo;

        const fieldName = inflection.column(attr);
        if (memo[fieldName]) {
          throw new Error(
            `Two columns produce the same GraphQL field name '${fieldName}' on input class '${
              table.namespaceName
            }.${table.name}'; one of them is '${attr.name}'`
          );
        }
        memo = extend(
          memo,
          {
            [fieldName]: fieldWithHooks(
              fieldName,
              pgAddSubfield(
                fieldName,
                attr.name,
                attr.type,
                {
                  description: attr.description,
                  type: nullableIf(
                    GraphQLNonNull,
                    isPgBaseInput ||
                      isPgPatch ||
                      (!attr.isNotNull &&
                        (!attr.type.domainIsNotNull ||
                          attr.type.domainHasDefault) &&
                        !attr.tags.notNull) ||
                      attr.hasDefault ||
                      attr.identity === "d",
                    pgGetGqlInputTypeByTypeIdAndModifier(
                      attr.typeId,
                      attr.typeModifier
                    ) || GraphQLString
                  ),
                },
                attr.typeModifier
              ),
              { pgFieldIntrospection: attr }
            ),
          },
          `Adding input object field for ${describePgEntity(
            attr
          )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
            attr,
            {
              name: "newNameHere",
            }
          )}`
        );
        return memo;
      }, {}),
      `Adding columns to input object for ${describePgEntity(table)}`
    );
  });
}: Plugin);
