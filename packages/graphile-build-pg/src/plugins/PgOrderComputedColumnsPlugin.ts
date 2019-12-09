import { Plugin } from "graphile-build";
import { getComputedColumnDetails } from "./PgComputedColumnsPlugin";
import { PgProc, PgEntityKind } from "./PgIntrospectionPlugin";
import QueryBuilder, { SQL } from "../QueryBuilder";

export default (function PgOrderComputedColumnsPlugin(builder) {
  builder.hook(
    "GraphQLEnumType:values",
    (values, build, context) => {
      const {
        extend,
        inflection,
        pgOmit: omit,
        describePgEntity,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgSql: sql,
      } = build;
      const {
        scope: { isPgRowSortEnum, pgIntrospection: table },
      } = context;
      if (!isPgRowSortEnum || !table || table.kind !== PgEntityKind.CLASS) {
        return values;
      }

      const compatibleComputedColumns = introspectionResultsByKind.procedure.reduce(
        (memo, proc) => {
          /* ALSO SEE PgConditionComputedColumnPlugin */
          // Must be marked @sortable
          if (!proc.tags.sortable) return memo;

          // Must not be omitted
          if (omit(proc, "execute")) return memo;

          // Must be a computed column
          const computedColumnDetails = getComputedColumnDetails(
            build,
            table,
            proc
          );

          if (!computedColumnDetails) return memo;
          const { pseudoColumnName } = computedColumnDetails;

          // Must have only one required argument
          const nonOptionalArgumentsCount =
            proc.inputArgsCount - proc.argDefaultsNum;
          if (nonOptionalArgumentsCount > 1) {
            return memo;
          }

          // Must return a scalar
          if (proc.returnsSet) return memo;
          const returnType =
            introspectionResultsByKind.typeById[proc.returnTypeId];
          if (returnType.isPgArray) return memo;
          const returnTypeTable = returnType.classId
            ? introspectionResultsByKind.classById[returnType.classId]
            : null;
          if (returnTypeTable) return memo;
          const isRecordLike = returnType.id === "2249";
          if (isRecordLike) return memo;
          const isVoid = String(returnType.id) === "2278";
          if (isVoid) return memo;

          // Looks good
          memo.push({ proc, pseudoColumnName });
          return memo;
        },
        [] as { proc: PgProc; pseudoColumnName: string }[]
      );

      return extend(
        values,
        compatibleComputedColumns.reduce(
          (memo, { proc, pseudoColumnName }) => {
            const ascFieldName = inflection.orderByComputedColumnEnum(
              pseudoColumnName,
              proc,
              table,
              true
            );

            const descFieldName = inflection.orderByComputedColumnEnum(
              pseudoColumnName,
              proc,
              table,
              false
            );

            const unique = !!proc.tags.isUnique;

            const functionCall = ({
              queryBuilder,
            }: {
              queryBuilder: QueryBuilder;
            }): SQL =>
              sql.fragment`(${sql.identifier(
                proc.namespaceName,
                proc.name
              )}(${queryBuilder.getTableAlias()}))`;

            memo = extend(
              memo,
              {
                [ascFieldName]: {
                  value: {
                    alias: ascFieldName.toLowerCase(),
                    specs: [[functionCall, true]],
                    unique,
                  },
                },
              },

              `Adding ascending orderBy enum value for ${describePgEntity(
                proc
              )}. You can rename this field by removing the '@sortable' smart comment from the function.`
            );

            memo = extend(
              memo,
              {
                [descFieldName]: {
                  value: {
                    alias: descFieldName.toLowerCase(),
                    specs: [[functionCall, false]],
                    unique,
                  },
                },
              },

              `Adding descending orderBy enum value for ${describePgEntity(
                proc
              )}. You can rename this field by removing the '@sortable' smart comment from the function.`
            );

            return memo;
          },
          {} as import("graphql").GraphQLEnumValueConfigMap
        ),
        `Adding order values from table '${table.name}'`
      );
    },
    ["PgOrderComputedColumns"]
  );
} as Plugin);
