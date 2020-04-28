import { Plugin, ContextGraphQLObjectTypeFieldsField } from "graphile-build";
import { ResolveTree } from "graphql-parse-resolve-info";
import { PgTypeModifier } from "./PgBasicsPlugin";
import { PgType } from "./PgIntrospectionPlugin";
import QueryBuilder, { SQL } from "../QueryBuilder";
import { nullableIf } from "../utils";

type PgGetSelectValueForFieldAndTypeAndModifier = (
  ReturnType: import("graphql").GraphQLOutputType,
  fieldContext: ContextGraphQLObjectTypeFieldsField,
  parsedResolveInfoFragment: ResolveTree,
  sqlFullName: SQL,
  type: PgType,
  typeModifier: PgTypeModifier,
  parentQueryBuilder: QueryBuilder,
) => SQL;

declare module "graphile-build" {
  interface Build {
    pgGetSelectValueForFieldAndTypeAndModifier: PgGetSelectValueForFieldAndTypeAndModifier;
  }
}

export default (function PgColumnsPlugin(builder) {
  builder.hook(
    "build",
    build => {
      const {
        pgSql: sql,
        pgTweakFragmentForTypeAndModifier,
        pgQueryFromResolveData: queryFromResolveData,
      } = build;
      if (!sql || !queryFromResolveData || !pgTweakFragmentForTypeAndModifier) {
        throw new Error("Required Build properties were not present");
      }
      const getSelectValueForFieldAndTypeAndModifier: PgGetSelectValueForFieldAndTypeAndModifier = (
        ReturnType,
        fieldContext,
        parsedResolveInfoFragment,
        sqlFullName,
        type,
        typeModifier,
        parentQueryBuilder,
      ) => {
        const { getDataFromParsedResolveInfoFragment } = fieldContext;
        if (type.isPgArray && type.arrayItemType) {
          const ident = sql.identifier(Symbol());
          return sql`(\
case
when ${sqlFullName} is null then null
when coalesce(array_length(${sqlFullName}, 1), 0) = 0 then '[]'::json
else (
  select json_agg(${getSelectValueForFieldAndTypeAndModifier(
    ReturnType,
    fieldContext,
    parsedResolveInfoFragment,
    ident,
    type.arrayItemType,
    typeModifier,
    parentQueryBuilder,
  )}) from unnest(${sqlFullName}) as ${ident}
)
end
)`;
        } else {
          const resolveData = getDataFromParsedResolveInfoFragment(
            parsedResolveInfoFragment,
            ReturnType,
          );

          if (type.type === "c") {
            const isDefinitelyNotATable =
              type.class && !type.class.isSelectable;
            const jsonBuildObject = queryFromResolveData(
              sql.identifier(Symbol()), // Ignore!
              sqlFullName,
              resolveData,
              {
                onlyJsonField: true,
                addNullCase: !isDefinitelyNotATable,
                addNotDistinctFromNullCase: !!isDefinitelyNotATable,
              },
              null,
              parentQueryBuilder ? parentQueryBuilder.context : (null as any),
              parentQueryBuilder ? parentQueryBuilder.rootValue : null,
            );

            return jsonBuildObject;
          } else {
            return pgTweakFragmentForTypeAndModifier(
              sqlFullName,
              type,
              typeModifier,
              resolveData,
            );
          }
        }
      };
      return build.extend(
        build,
        {
          pgGetSelectValueForFieldAndTypeAndModifier: getSelectValueForFieldAndTypeAndModifier,
        },
        "Adding pgGetSelectValueForFieldAndTypeAndModifier in PgColumnsPlugin",
      );
    },
    ["PgColumns"],
    [],
    ["PgTypes"],
  );

  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        pgGetGqlTypeByTypeIdAndModifier,
        pgSql: sql,
        pg2gqlForType,
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
        !pgColumnFilter ||
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
              `Two columns produce the same GraphQL field name '${fieldName}' on class '${table.namespaceName}.${table.name}'; one of them is '${attr.name}'`,
            );
          }
          memo = extend(
            memo,
            {
              [fieldName]: fieldWithHooks(
                fieldName,
                fieldContext => {
                  const { type, typeModifier } = attr;
                  const sqlColumn = sql.identifier(attr.name);
                  const { addDataGenerator } = fieldContext;
                  const ReturnType =
                    pgGetGqlTypeByTypeIdAndModifier(
                      attr.typeId,
                      attr.typeModifier,
                    ) || GraphQLString;
                  addDataGenerator(parsedResolveInfoFragment => {
                    return {
                      pgQuery: queryBuilder => {
                        queryBuilder.select(
                          getSelectValueForFieldAndTypeAndModifier(
                            ReturnType,
                            fieldContext,
                            parsedResolveInfoFragment,
                            sql`(${queryBuilder.getTableAlias()}.${sqlColumn})`, // The brackets are necessary to stop the parser getting confused, ref: https://www.postgresql.org/docs/9.6/static/rowtypes.html#ROWTYPES-ACCESSING
                            type,
                            typeModifier,
                            queryBuilder,
                          ),

                          fieldName,
                        );
                      },
                    };
                  });
                  const convertFromPg = pg2gqlForType(type);
                  return {
                    description: attr.description || null,
                    type: nullableIf(
                      GraphQLNonNull,
                      !attr.isNotNull &&
                        !attr.type.domainIsNotNull &&
                        !attr.tags.notNull,
                      ReturnType,
                    ),

                    resolve: (data, _args, _context, _resolveInfo) => {
                      return convertFromPg(data[fieldName]);
                    },
                  };
                },
                { pgFieldIntrospection: attr },
              ),
            },

            `Adding field for ${describePgEntity(
              attr,
            )}. You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              attr,
              {
                name: "newNameHere",
              },
            )}`,
          );

          return memo;
        }, {}),
        `Adding columns to '${describePgEntity(table)}'`,
      );
    },
    ["PgColumns"],
  );

  builder.hook(
    "GraphQLInputObjectType:fields",
    (fields, build, context) => {
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
        !pgColumnFilter ||
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
          const action = isPgBaseInput
            ? "base"
            : isPgPatch
            ? "update"
            : "create";
          if (omit(attr, action)) return memo;
          if (attr.identity === "a") return memo;

          const fieldName = inflection.column(attr);
          if (memo[fieldName]) {
            throw new Error(
              `Two columns produce the same GraphQL field name '${fieldName}' on input class '${table.namespaceName}.${table.name}'; one of them is '${attr.name}'`,
            );
          }
          if (!pgAddSubfield) {
            throw new Error("Cannot add subfield");
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
                    description: attr.description || null,
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
                        attr.typeModifier,
                      ) || GraphQLString,
                    ),
                  },

                  attr.typeModifier,
                ),

                { pgFieldIntrospection: attr },
              ),
            },

            `Adding input object field for ${describePgEntity(
              attr,
            )}. You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
              attr,
              {
                name: "newNameHere",
              },
            )}`,
          );

          return memo;
        }, {}),
        `Adding columns to input object for ${describePgEntity(table)}`,
      );
    },
    ["PgColumns"],
  );
} as Plugin);
