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
      introspectionResultsByKind.procedure
        .filter(proc => !proc.isStable)
        .filter(proc => !!proc.namespace)
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
