import { PgSource } from "@dataplan/pg";
import "graphile-build";
import "./PgTablesPlugin";

import type { Plugin } from "graphile-plugin";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      allRowsConnection(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;
      allRowsList(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;
    }
  }
}

export const PgAllRowsPlugin: Plugin = {
  name: "PgAllRowsPlugin",
  description: "Adds 'all rows' accessors for all tables.",
  version: version,
  // TODO: Requires PgTablesPlugin
  schema: {
    hooks: {
      inflection(inflection, build) {
        return build.extend<
          typeof inflection,
          Partial<GraphileEngine.Inflection>
        >(
          inflection,
          {
            allRowsConnection(source) {
              return this.camelCase(
                `all-${this.pluralize(this._singularizedTableName(source))}`,
              );
            },
            allRowsList(source) {
              return this.camelCase(
                `all-${this.pluralize(
                  this._singularizedTableName(source),
                )}-list`,
              );
            },
          },
          "Adding inflectors from PgAllRowsPlugin",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        if (!context.scope.isRootQuery) {
          return fields;
        }
        for (const source of build.input.pgSources) {
          const type = build.getTypeByName(build.inflection.tableType(source));
          if (!type) {
            continue;
          }
          fields = build.extend(
            fields,
            {
              [build.inflection.allRowsConnection(source)]: {
                type,
              },
            },
            `Adding 'all rows' field for PgSource ${source}`,
          );
        }
        return fields;
      },
    },
  },
};
