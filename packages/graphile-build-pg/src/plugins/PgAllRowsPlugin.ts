import "graphile-build";

import type { Plugin } from "graphile-plugin";

import { version } from "../index";

export const PgAllRowsPlugin: Plugin = {
  name: "PgAllRowsPlugin",
  description: "Adds 'all rows' accessors for all tables.",
  version: version,
  schema: {
    hooks: {
      "GraphQLObjectType:fields"(fields, build, context) {
        if (!context.scope.isRootQuery) {
          return fields;
        }
        return build.extend(
          fields,
          {
            [build.inflection.builtin("allFoos")]: {
              type: build.getTypeByName("T"),
            },
          },
          "Adding T",
        );
      },
    },
  },
};
