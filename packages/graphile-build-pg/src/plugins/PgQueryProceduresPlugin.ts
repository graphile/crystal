import { Plugin } from "graphile-build";
import { PgType } from "./PgIntrospectionPlugin";

export default (function PgQueryProceduresPlugin(
  builder,
  { pgSimpleCollections }
) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const {
        extend,
        inflection,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        pgMakeProcField: makeProcField,
        pgOmit: omit,
        describePgEntity,
        sqlCommentByAddingTags,
        swallowError,
      } = build;
      const {
        scope: { isRootQuery },
        fieldWithHooks,
      } = context;

      if (!isRootQuery) {
        return fields;
      }

      return extend(
        fields,
        introspectionResultsByKind.procedure.reduce((memo, proc) => {
          // PERFORMANCE: These used to be .filter(...) calls
          if (!proc.isStable) return memo;
          if (!proc.namespace) return memo;
          if (omit(proc, "execute")) return memo;

          const argTypes = proc.argTypeIds.reduce(
            (prev, typeId, idx) => {
              if (
                proc.argModes.length === 0 || // all args are `in`
                proc.argModes[idx] === "i" || // this arg is `in`
                proc.argModes[idx] === "b" // this arg is `inout`
              ) {
                prev.push(introspectionResultsByKind.typeById[typeId]);
              }
              return prev;
            },
            [] as PgType[]
          );
          if (
            argTypes.some(
              type => type.type === "c" && type.class && type.class.isSelectable
            )
          ) {
            // Selects a table, ignore!
            return memo;
          }
          const firstArgType = argTypes[0];
          if (
            firstArgType &&
            firstArgType.type === "c" &&
            firstArgType.class &&
            firstArgType.namespaceId === proc.namespaceId &&
            proc.name.startsWith(`${firstArgType.name}_`)
          ) {
            // It's a computed field, skip
            return memo;
          }

          function makeField(forceList) {
            const fieldName = forceList
              ? inflection.functionQueryNameList(proc)
              : inflection.functionQueryName(proc);
            try {
              memo = extend(
                memo,
                {
                  [fieldName]: makeProcField(fieldName, proc, build, {
                    fieldWithHooks,
                    forceList,
                  }),
                },

                `Adding query field for ${describePgEntity(
                  proc
                )}. You can rename this field with a 'Smart Comment':\n\n  ${sqlCommentByAddingTags(
                  proc,
                  {
                    name: "newNameHere",
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
        `Adding query procedures to root Query type`
      );
    },
    ["PgQueryProcedures"]
  );
} as Plugin);
