// BELOW HERE, IMPORTS ARE ONLY TYPES (not values)
import { SQL } from "graphile-build-pg";
import { Build, Plugin } from "graphile-build";

type OrderSpec = [string | SQL, boolean] | [string | SQL, boolean, boolean];
export interface MakeAddPgTableOrderByPluginOrders {
  [orderByEnumValue: string]: {
    value: {
      alias?: string;
      specs: Array<OrderSpec>;
      unique: boolean;
    };
  };
}

export default function makeAddPgTableOrderByPlugin(
  schemaName: string,
  tableName: string,
  ordersGenerator: (build: Build) => MakeAddPgTableOrderByPluginOrders,
  hint = `Adding orders with makeAddPgTableOrderByPlugin to "${schemaName}"."${tableName}"`
) {
  const displayName = `makeAddPgTableOrderByPlugin_${schemaName}_${tableName}`;
  const plugin: Plugin = builder => {
    builder.hook("GraphQLEnumType:values", (values, build, context) => {
      const { extend } = build;
      const {
        scope: { isPgRowSortEnum, pgIntrospection: table },
      } = context;

      if (
        !isPgRowSortEnum ||
        !table ||
        table.kind !== "class" ||
        table.namespaceName !== schemaName ||
        table.name !== tableName
      ) {
        return values;
      }
      const newValues = ordersGenerator(build);

      return extend(values, newValues, hint);
    });
  };
  plugin.displayName = displayName;
  return plugin;
}

export function orderByAscDesc(
  baseName: string,
  columnOrSqlFragment: string | SQL,
  unique = false
): MakeAddPgTableOrderByPluginOrders {
  return {
    [`${baseName}_ASC`]: {
      value: {
        alias: `${baseName}_ASC`,
        specs: [[columnOrSqlFragment, true]],
        unique,
      },
    },
    [`${baseName}_DESC`]: {
      value: {
        alias: `${baseName}_DESC`,
        specs: [[columnOrSqlFragment, false]],
        unique,
      },
    },
  };
}
