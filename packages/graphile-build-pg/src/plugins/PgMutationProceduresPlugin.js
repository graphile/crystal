// @flow
import type { Plugin } from "graphile-build";
import makeProcField from "./makeProcField";
import omit from "../omit";

export default (function PgMutationProceduresPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, { scope: { isRootMutation }, fieldWithHooks }) => {
      if (!isRootMutation) {
        return fields;
      }
      const {
        extend,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
        inflection,
      } = build;
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
            memo[fieldName] = makeProcField(fieldName, proc, build, {
              fieldWithHooks,
              isMutation: true,
            });
            return memo;
          }, {}),
        `Adding mutation procedure to root Mutation field`
      );
    }
  );
}: Plugin);
