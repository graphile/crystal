// @flow
import type { Plugin } from "graphile-build";
import { getComputedColumnDetails } from "./PgComputedColumnsPlugin";
import assert from "assert";
function getCompatibleComputedColumns(build, table) {
  const {
    pgIntrospectionResultsByKind: introspectionResultsByKind,
    pgOmit: omit,
  } = build;
  return introspectionResultsByKind.procedure.reduce((memo, proc) => {
    /* ALSO SEE PgOrderComputedColumnsPlugin */
    // Must be marked @filterable
    if (!proc.tags.filterable) return memo;

    // Must not be omitted
    if (omit(proc, "execute")) return memo;

    // Must be a computed column
    const computedColumnDetails = getComputedColumnDetails(build, table, proc);
    if (!computedColumnDetails) return memo;
    const { pseudoColumnName } = computedColumnDetails;

    // Must have only one required argument
    const nonOptionalArgumentsCount = proc.inputArgsCount - proc.argDefaultsNum;
    if (nonOptionalArgumentsCount > 1) {
      return memo;
    }

    // Must return a scalar
    if (proc.returnsSet) return memo;
    const returnType = introspectionResultsByKind.typeById[proc.returnTypeId];
    if (returnType.isPgArray) return memo;
    const returnTypeTable =
      introspectionResultsByKind.classById[returnType.classId];
    if (returnTypeTable) return memo;
    const isRecordLike = returnType.id === "2249";
    if (isRecordLike) return memo;
    const isVoid = String(returnType.id) === "2278";
    if (isVoid) return memo;

    // Looks good
    memo.push({ proc, pseudoColumnName, returnType });
    return memo;
  }, []);
}

export default (function PgConditionComputedColumnPlugin(builder) {
  builder.hook(
    "GraphQLInputObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        pgGetGqlInputTypeByTypeIdAndModifier,
        inflection,
        describePgEntity,
      } = build;
      const {
        scope: { isPgCondition, pgIntrospection: table },
        fieldWithHooks,
      } = context;
      if (!isPgCondition || !table || table.kind !== "class") {
        return fields;
      }
      const compatibleComputedColumns = getCompatibleComputedColumns(
        build,
        table
      );
      return extend(
        fields,
        compatibleComputedColumns.reduce((memo, { proc, pseudoColumnName }) => {
          const fieldName = inflection.computedColumn(
            pseudoColumnName,
            proc,
            table
          );
          const Type = pgGetGqlInputTypeByTypeIdAndModifier(
            proc.returnTypeId,
            null
          );
          if (!Type) return memo;
          memo = build.extend(
            memo,
            {
              [fieldName]: fieldWithHooks(
                fieldName,
                {
                  description: build.wrapDescription(
                    `Checks for equality with the object’s \`${fieldName}\` field.`,
                    "field"
                  ),
                  type: Type,
                },
                {
                  isPgConnectionConditionInputField: true,
                  pgFieldIntrospection: proc,
                }
              ),
            },
            `Adding computed column condition argument for ${describePgEntity(
              proc
            )}`
          );
          return memo;
        }, {})
      );
    },
    ["PgConditionComputedColumn"]
  );

  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args, build, context) => {
      const {
        pgSql: sql,
        gql2pg,
        getTypeByName,
        pgGetGqlTypeByTypeIdAndModifier,
        inflection,
        pgOmit: omit,
        graphql: { getNullableType },
      } = build;
      const {
        scope: {
          isPgFieldConnection,
          isPgFieldSimpleCollection,
          pgFieldIntrospection,
          pgFieldIntrospectionTable,
        },
        addArgDataGenerator,
      } = context;

      const shouldAddCondition =
        isPgFieldConnection || isPgFieldSimpleCollection;
      if (!shouldAddCondition) return args;
      if (!args.condition) {
        return args;
      }
      const proc =
        pgFieldIntrospection.kind === "procedure" ? pgFieldIntrospection : null;
      const table =
        pgFieldIntrospection.kind === "class"
          ? pgFieldIntrospection
          : proc
          ? pgFieldIntrospectionTable
          : null;
      if (
        !table ||
        table.kind !== "class" ||
        !table.namespace ||
        omit(table, "filter")
      ) {
        return args;
      }
      const TableType = pgGetGqlTypeByTypeIdAndModifier(table.type.id, null);
      const TableConditionType = getTypeByName(
        inflection.conditionType(TableType.name)
      );
      if (!TableConditionType) {
        return args;
      }
      assert(
        getNullableType(args.condition.type) === TableConditionType,
        "Condition is present, but doesn't match?"
      );

      const compatibleComputedColumns = getCompatibleComputedColumns(
        build,
        table
      ).map(o => {
        const { proc, pseudoColumnName } = o;

        const fieldName = inflection.computedColumn(
          pseudoColumnName,
          proc,
          table
        );
        const sqlFnName = sql.identifier(proc.namespaceName, proc.name);
        return {
          ...o,
          fieldName,
          sqlFnName,
        };
      });
      addArgDataGenerator(function connectionCondition({ condition }) {
        return {
          pgQuery: queryBuilder => {
            if (condition != null) {
              compatibleComputedColumns.forEach(
                ({ fieldName, sqlFnName, returnType }) => {
                  const val = condition[fieldName];
                  const sqlCall = sql.fragment`${sqlFnName}(${queryBuilder.getTableAlias()})`;
                  if (val != null) {
                    queryBuilder.where(
                      sql.fragment`${sqlCall} = ${gql2pg(
                        val,
                        returnType,
                        null
                      )}`
                    );
                  } else if (val === null) {
                    queryBuilder.where(sql.fragment`${sqlCall} IS NULL`);
                  }
                }
              );
            }
          },
        };
      });

      return args;
    },
    ["PgConditionComputedColumn"]
  );
}: Plugin);
