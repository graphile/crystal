// @flow
import makeProcField from "./makeProcField";

import type { Plugin } from "graphile-build";

export default (function PgComputedColumnsPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (
      fields,
      build,
      {
        scope: {
          isPgRowType,
          isPgCompoundType,
          isInputType,
          pgIntrospection: table,
        },
        fieldWithHooks,
      }
    ) => {
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
        pgInflection: inflection,
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
            const argTypes = proc.argTypeIds.map(
              typeId => introspectionResultsByKind.typeById[typeId]
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
            const fieldName = inflection.column(
              pseudoColumnName,
              table.name,
              table.namespace.name
            );
            memo[fieldName] = makeProcField(fieldName, proc, build, {
              fieldWithHooks,
              computed: true,
            });
            return memo;
          }, {})
      );
    }
  );
}: Plugin);
