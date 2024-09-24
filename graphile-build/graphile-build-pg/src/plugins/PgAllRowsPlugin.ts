import "./PgTablesPlugin.js";
import "graphile-config";

import type { PgResource } from "@dataplan/pg";
import { connection } from "grafast";
import type { GraphQLObjectType, GraphQLOutputType } from "grafast/graphql";
import { EXPORTABLE } from "graphile-build";

import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      PgAllRowsPlugin: true;
    }
  }

  namespace GraphileBuild {
    interface BehaviorStrings {
      "query:resource:connection": true;
      "query:resource:list": true;
    }

    interface Inflection {
      /**
       * The base inflector used by `allRowsConnection` and `allRowsList`.
       */
      _allRows(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
      /**
       * The field name for a Cursor Connection field that returns all rows
       * from the given resource.
       */
      allRowsConnection(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;

      /**
       * The field name for a List field that returns all rows from the given
       * resource.
       */
      allRowsList(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;
    }
  }
}

export const PgAllRowsPlugin: GraphileConfig.Plugin = {
  name: "PgAllRowsPlugin",
  description: "Adds 'all rows' accessors for all table-like datasources.",
  version: version,
  after: ["PgTablesPlugin"],

  inflection: {
    add: {
      _allRows(options, resource) {
        return this.camelCase(
          `all-${this.pluralize(this._singularizedResourceName(resource))}`,
        );
      },
      allRowsConnection(options, resource) {
        return this.connectionField(this._allRows(resource));
      },
      allRowsList(options, resource) {
        return this.listField(this._allRows(resource));
      },
    },
  },

  schema: {
    behaviorRegistry: {
      add: {
        "query:resource:connection": {
          description:
            '"connection" field for a resource at the root Query level',
          entities: ["pgCodec", "pgResource", "pgResourceUnique"],
        },
        "query:resource:list": {
          description: '"list" field for a resource at the root Query level',
          entities: ["pgCodec", "pgResource", "pgResourceUnique"],
        },
      },
    },
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLList, GraphQLNonNull },
        } = build;
        const { fieldWithHooks } = context;
        if (!context.scope.isRootQuery) {
          return fields;
        }
        for (const resource of Object.values(
          build.input.pgRegistry.pgResources,
        )) {
          if (resource.parameters) {
            // Skip functions
            continue;
          }
          if (!resource.find || resource.isVirtual) {
            continue;
          }
          const type = build.getTypeByName(
            build.inflection.tableType(resource.codec),
          );
          if (!type) {
            continue;
          }

          if (
            build.behavior.pgResourceMatches(resource, "query:resource:list")
          ) {
            const fieldName = build.inflection.allRowsList(resource);
            fields = build.extend(
              fields,
              {
                [fieldName]: fieldWithHooks(
                  {
                    fieldName,
                    fieldBehaviorScope: `query:resource:list`,
                    isPgFieldSimpleCollection: true,
                    pgFieldResource: resource,
                  },
                  () => ({
                    type: new GraphQLList(
                      new GraphQLNonNull(type),
                    ) as GraphQLOutputType,
                    description: `Reads a set of \`${build.inflection.tableType(
                      resource.codec,
                    )}\`.`,
                    deprecationReason: tagToString(
                      resource.extensions?.tags?.deprecated,
                    ),
                    plan: EXPORTABLE(
                      (resource) =>
                        function plan() {
                          return resource.find();
                        },
                      [resource],
                    ),
                  }),
                ),
              },
              `Adding 'all rows' list field for PgResource ${resource}`,
            );
          }

          if (
            build.behavior.pgResourceMatches(
              resource,
              "query:resource:connection",
            )
          ) {
            const fieldName = build.inflection.allRowsConnection(resource);
            const connectionType = build.getTypeByName(
              build.inflection.tableConnectionType(resource.codec),
            ) as GraphQLObjectType | undefined;
            if (connectionType) {
              fields = build.extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      fieldBehaviorScope: `query:resource:connection`,
                      isPgFieldConnection: true,
                      pgFieldResource: resource,
                    },
                    () => ({
                      type: connectionType,
                      description: `Reads and enables pagination through a set of \`${build.inflection.tableType(
                        resource.codec,
                      )}\`.`,
                      deprecationReason: tagToString(
                        resource.extensions?.tags?.deprecated,
                      ),
                      plan: EXPORTABLE(
                        (connection, resource) =>
                          function plan() {
                            return connection(resource.find());
                          },
                        [connection, resource],
                      ),
                    }),
                  ),
                },
                `Adding 'all rows' connection field for PgResource ${resource}`,
              );
            }
          }
        }
        return fields;
      },
    },
  },
};
