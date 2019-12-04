import {
  Build,
  ContextGraphQLObjectTypeFieldsField,
  ScopeGraphQLObjectTypeFieldsField,
  ScopeGraphQLInputObjectTypeFieldsField,
} from "graphile-build";
import { PgType } from "./PgIntrospectionPlugin";
import QueryBuilder, { SQL } from "../QueryBuilder";
import { FieldWithHooksFunction } from "graphile-build";
import { ResolveTree } from "graphql-parse-resolve-info";
import { PgTypeModifier } from "./PgBasicsPlugin";

export { FieldWithHooksFunction };

interface PgFieldOptions {
  pgType?: PgType;
  pgTypeModifier?: PgTypeModifier;
  hoistCursor?: boolean;
  withQueryBuilder?: (
    queryBuilder: QueryBuilder,
    extra: { parsedResolveInfoFragment: ResolveTree }
  ) => void;
}

type FieldSpec = import("graphql").GraphQLFieldConfig<any, any>;

export default function pgField(
  build: Build,
  fieldWithHooks: FieldWithHooksFunction,
  fieldName: string,
  fieldSpecGenerator:
    | ((fieldContext: ContextGraphQLObjectTypeFieldsField) => FieldSpec)
    | FieldSpec,

  inFieldScope: Omit<ScopeGraphQLObjectTypeFieldsField, "fieldName"> = {},
  whereFrom: ((queryBuilder: QueryBuilder) => SQL) | false = false,
  options: PgFieldOptions = {}
) {
  const fieldScope: ScopeGraphQLInputObjectTypeFieldsField = {
    ...inFieldScope,
    fieldName,
  };
  const {
    pgSql: sql,
    pgQueryFromResolveData: queryFromResolveData,
    getSafeAliasFromAlias,
    getSafeAliasFromResolveInfo,
    pgTweakFragmentForTypeAndModifier,
  } = build;
  return fieldWithHooks(
    fieldName,
    fieldContext => {
      const fieldSpec =
        typeof fieldSpecGenerator === "function"
          ? fieldSpecGenerator(fieldContext)
          : fieldSpecGenerator;
      const { type: FieldType } = fieldSpec;
      const nullableType = build.graphql.getNullableType(FieldType);
      const namedType = build.graphql.getNamedType(FieldType);
      const isListType =
        nullableType !== namedType &&
        nullableType.constructor === build.graphql.GraphQLList;
      const isLeafType = build.graphql.isLeafType(FieldType);
      if (isLeafType && !options.pgType) {
        // eslint-disable-next-line no-console
        throw new Error(
          "pgField call omits options.pgType for a leaf type; certain tweaks may not be applied!"
        );
      }
      const {
        getDataFromParsedResolveInfoFragment,
        addDataGenerator,
      } = fieldContext;
      addDataGenerator(parsedResolveInfoFragment => {
        const safeAlias = getSafeAliasFromAlias(
          parsedResolveInfoFragment.alias
        );

        const resolveData = getDataFromParsedResolveInfoFragment(
          parsedResolveInfoFragment,
          FieldType
        );

        return {
          ...(options.hoistCursor &&
          resolveData.usesCursor &&
          resolveData.usesCursor.length
            ? { usesCursor: true }
            : null),
          pgQuery: queryBuilder => {
            queryBuilder.select(() => {
              const tableAlias =
                whereFrom === false
                  ? queryBuilder.getTableAlias()
                  : sql.identifier(Symbol());
              const query = queryFromResolveData(
                whereFrom ? whereFrom(queryBuilder) : sql.identifier(Symbol()),
                isLeafType && options.pgType
                  ? pgTweakFragmentForTypeAndModifier(
                      tableAlias,
                      options.pgType,
                      options.pgTypeModifier,
                      {}
                    )
                  : tableAlias,
                resolveData,
                whereFrom === false
                  ? { onlyJsonField: true }
                  : { asJson: true },
                innerQueryBuilder => {
                  innerQueryBuilder.parentQueryBuilder = queryBuilder;
                  if (typeof options.withQueryBuilder === "function") {
                    options.withQueryBuilder(innerQueryBuilder, {
                      parsedResolveInfoFragment,
                    });
                  }
                },
                queryBuilder.context,
                queryBuilder.rootValue
              );

              return sql.fragment`(${query})`;
            }, safeAlias);
          },
        };
      });

      return {
        resolve(data, _args, _context, resolveInfo) {
          const safeAlias = getSafeAliasFromResolveInfo(resolveInfo);
          if (data.data == null) return null;
          if (isListType) {
            return data.data.map(d => (d != null ? d[safeAlias] : null));
          } else {
            return data.data[safeAlias];
          }
        },
        ...fieldSpec,
      };
    },
    fieldScope
  );
}
