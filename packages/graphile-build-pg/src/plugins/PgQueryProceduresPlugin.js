// @flow
import type { Plugin } from "graphile-build";
import makeProcField from "./makeProcField";
import debugFactory from "debug";
import chalk from "chalk";
import omit from "../omit";

const debugWarn = debugFactory("graphile-build-pg:warn");

export default (function PgQueryProceduresPlugin(
  builder,
  { pgSimpleCollections }
) {
  const hasConnections = pgSimpleCollections !== "only";
  const hasSimpleCollections =
    pgSimpleCollections === "only" || pgSimpleCollections === "both";
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      extend,
      inflection,
      pgIntrospectionResultsByKind: introspectionResultsByKind,
    } = build;
    const { scope: { isRootQuery }, fieldWithHooks } = context;
    if (!isRootQuery) {
      return fields;
    }
    return extend(
      fields,
      introspectionResultsByKind.procedure
        .filter(proc => proc.isStable)
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
          const argTypes = proc.argTypeIds.map(
            typeId => introspectionResultsByKind.typeById[typeId]
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
              memo[fieldName] = makeProcField(fieldName, proc, build, {
                fieldWithHooks,
                forceList,
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
          }
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
  });
}: Plugin);
