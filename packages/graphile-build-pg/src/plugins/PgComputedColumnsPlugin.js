// @flow
import type { Plugin } from "graphile-build";

export default (function PgComputedColumnsPlugin(
  builder,
  { pgSimpleCollections }
) {
  const hasConnections = pgSimpleCollections !== "only";
  const hasSimpleCollections =
    pgSimpleCollections === "only" || pgSimpleCollections === "both";
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
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
    const tableType = introspectionResultsByKind.type.filter(
      type =>
        type.type === "c" &&
        type.namespaceId === table.namespaceId &&
        type.classId === table.id
    )[0];
    if (!tableType) {
      throw new Error("Could not determine the type for this table");
    }
    return extend(
      fields,
      introspectionResultsByKind.procedure
        .filter(proc => proc.isStable)
        .filter(proc => proc.namespaceId === table.namespaceId)
        .filter(proc => proc.name.startsWith(`${table.name}_`))
        .filter(proc => proc.argTypeIds.length > 0)
        .filter(proc => proc.argTypeIds[0] === tableType.id)
        .filter(proc => !omit(proc, "execute"))
        .reduce((memo, proc) => {
          /*
            proc =
              { kind: 'procedure',
                name: 'integration_webhook_secret',
                description: null,
                namespaceId: '6484381',
                isStrict: false,
                returnsSet: false,
                isStable: true,
                returnTypeId: '2950',
                argTypeIds: [ '6484569' ],
                argNames: [ 'integration' ],
                argDefaultsNum: 0 }
            */
          const argTypes = proc.argTypeIds.reduce(
            (prev, typeId, idx) =>
              proc.argModes.length === 0 || // all args are `in`
              proc.argModes[idx] === "i" || // this arg is `in`
              proc.argModes[idx] === "b" // this arg is `inout`
                ? [...prev, introspectionResultsByKind.typeById[typeId]]
                : prev,
            []
          );
          if (
            argTypes
              .slice(1)
              .some(
                type =>
                  type.type === "c" && type.class && type.class.isSelectable
              )
          ) {
            // Accepts two input tables? Skip.
            return memo;
          }

          const pseudoColumnName = proc.name.substr(table.name.length + 1);
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
  });
}: Plugin);
