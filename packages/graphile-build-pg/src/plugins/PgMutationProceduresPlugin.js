// @flow
import type { Plugin } from "graphile-build";

export default (function PgMutationProceduresPlugin(builder) {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
      inflection,
      pgMakeProcField: makeProcField,
      pgOmit: omit,
      swallowError,
      describePgEntity,
      sqlCommentByAddingTags,
    } = build;
    const {
      scope: { isRootMutation },
      fieldWithHooks,
    } = context;

    if (!isRootMutation) {
      return fields;
    }

    return extend(
      fields,
      introspectionResultsByKind.procedure.reduce((memo, proc) => {
        // PERFORMANCE: These used to be .filter(...) calls
        if (proc.isStable) return memo;
        if (!proc.namespace) return memo;
        if (omit(proc, "execute")) return memo;

        const fieldName = inflection.functionMutationName(proc);
        try {
          memo = extend(
            memo,
            {
              [fieldName]: makeProcField(fieldName, proc, build, {
                fieldWithHooks,
                isMutation: true,
              }),
            },
            `Adding mutation field for ${describePgEntity(
              proc
            )}. You can rename this field with:\n\n  ${sqlCommentByAddingTags(
              proc,
              {
                name: "newNameHere",
              }
            )}`
          );
        } catch (e) {
          swallowError(e);
        }
        return memo;
      }, {}),
      `Adding mutation procedure to root Mutation field`
    );
  });
}: Plugin);
