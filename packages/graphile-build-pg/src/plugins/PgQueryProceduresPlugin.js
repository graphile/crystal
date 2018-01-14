// @flow
import type { Plugin } from "graphile-build";
import makeProcField from "./makeProcField";
import debugFactory from "debug";
import chalk from "chalk";

const debugWarn = debugFactory("graphile-build-pg:warn");

export default (function PgQueryProceduresPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, { scope: { isRootQuery }, fieldWithHooks }) => {
      if (!isRootQuery) {
        return fields;
      }
      const {
        extend,
        pgInflection: inflection,
        pgIntrospectionResultsByKind: introspectionResultsByKind,
      } = build;
      return extend(
        fields,
        introspectionResultsByKind.procedure
          .filter(proc => proc.isStable)
          .filter(proc => !!proc.namespace)
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
              argTypes.some(
                type =>
                  type.type === "c" && type.class && type.class.isSelectable
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

            const fieldName = inflection.functionName(
              proc.name,
              proc.namespace.name
            );
            try {
              memo[fieldName] = makeProcField(fieldName, proc, build, {
                fieldWithHooks,
              });
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn(
                chalk.bold.yellow(
                  `Failed to add function '${proc.namespace.name}.${
                    proc.name
                  }'; run with 'DEBUG="graphile-build-pg:warn"' to view the error`
                )
              );
              debugWarn(e);
            }
            return memo;
          }, {})
      );
    }
  );
}: Plugin);
