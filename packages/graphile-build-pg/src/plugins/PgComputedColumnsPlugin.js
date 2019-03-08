// @flow
import type { Plugin, Build } from "graphile-build";
import type { PgClass, PgProc } from "./PgIntrospectionPlugin";

// This interface is not official yet, don't rely on it.
export const getComputedColumnDetails = (
  build: Build,
  table: PgClass,
  proc: PgProc
) => {
  if (!proc.isStable) return null;
  if (proc.namespaceId !== table.namespaceId) return null;
  if (!proc.name.startsWith(`${table.name}_`)) return null;
  if (proc.argTypeIds.length < 1) return null;
  if (proc.argTypeIds[0] !== table.type.id) return null;

  const argTypes = proc.argTypeIds.reduce((prev, typeId, idx) => {
    if (
      proc.argModes.length === 0 || // all args are `in`
      proc.argModes[idx] === "i" || // this arg is `in`
      proc.argModes[idx] === "b" // this arg is `inout`
    ) {
      prev.push(build.pgIntrospectionResultsByKind.typeById[typeId]);
    }
    return prev;
  }, []);
  if (
    argTypes
      .slice(1)
      .some(type => type.type === "c" && type.class && type.class.isSelectable)
  ) {
    // Accepts two input tables? Skip.
    return null;
  }

  const pseudoColumnName = proc.name.substr(table.name.length + 1);
  return { argTypes, pseudoColumnName };
};

export default (function PgComputedColumnsPlugin(
  builder,
  { pgSimpleCollections }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        scope: {
          isPgRowType,
          isPgCompoundType,
          isInputType,
          pgIntrospection: table,
        },
        fieldWithHooks,
        Self,
      } = context;

      if (
        isInputType ||
        !(isPgRowType || isPgCompoundType) ||
        !table ||
        table.kind !== "class" ||
        !table.namespace
      ) {
        return fields;
      }

      const {
        extend,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        inflection,
        pgOmit: omit,
        pgMakeProcField: makeProcField,
        swallowError,
        describePgEntity,
        sqlCommentByAddingTags,
      } = build;
      const tableType = table.type;
      if (!tableType) {
        throw new Error("Could not determine the type for this table");
      }
      return extend(
        fields,
        introspectionResultsByKind.procedure.reduce((memo, proc) => {
          if (omit(proc, "execute")) return memo;
          const computedColumnDetails = getComputedColumnDetails(
            build,
            table,
            proc
          );
          if (!computedColumnDetails) return memo;
          const { pseudoColumnName } = computedColumnDetails;
          function makeField(forceList) {
            const fieldName = forceList
              ? inflection.computedColumnList(pseudoColumnName, proc, table)
              : inflection.computedColumn(pseudoColumnName, proc, table);
            try {
              memo = extend(
                memo,
                {
                  [fieldName]: makeProcField(fieldName, proc, build, {
                    fieldWithHooks,
                    computed: true,
                    forceList,
                  }),
                },
                `Adding computed column for ${describePgEntity(
                  proc
                )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
                  proc,
                  {
                    fieldName: "newNameHere",
                  }
                )}`
              );
            } catch (e) {
              swallowError(e);
            }
          }
          const simpleCollections =
            proc.tags.simpleCollections || pgSimpleCollections;
          const hasConnections = simpleCollections !== "only";
          const hasSimpleCollections =
            simpleCollections === "only" || simpleCollections === "both";
          if (!proc.returnsSet || hasConnections) {
            makeField(false);
          }
          if (proc.returnsSet && hasSimpleCollections) {
            makeField(true);
          }
          return memo;
        }, {}),
        `Adding computed column to '${Self.name}'`
      );
    },
    ["PgComputedColumns"]
  );
}: Plugin);
