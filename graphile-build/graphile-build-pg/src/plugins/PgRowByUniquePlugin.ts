import "graphile-config";

import type { PgCodec, PgResource, PgResourceUnique } from "@dataplan/pg";
import type { FieldArgs } from "grafast";
import { EXPORTABLE } from "graphile-export";
import te, { isSafeObjectPropertyName } from "tamedevil";

import { getBehavior } from "../behavior.js";
import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      rowByUnique(
        this: Inflection,
        details: {
          unique: PgResourceUnique;
          resource: PgResource<any, any, any, any, any>;
        },
      ): string;
    }
    interface ScopeObjectFieldsField {
      isPgRowByUniqueConstraintField?: boolean;
    }
  }
}

export const PgRowByUniquePlugin: GraphileConfig.Plugin = {
  name: "PgRowByUniquePlugin",
  description:
    "Adds accessors for rows by their unique constraints (technically the @dataplan/pg resources' 'uniques' property)",
  version: version,

  inflection: {
    add: {
      rowByUnique(options, { unique, resource }) {
        if (typeof unique.extensions?.tags?.fieldName === "string") {
          return unique.extensions?.tags?.fieldName;
        }
        const uniqueKeys = unique.columns;
        return this.camelCase(
          // TODO: should this use the _resource_ rather than the _codec_ in case the same codec is used across multiple resources?
          `${this.tableType(resource.codec)}-by-${this._joinColumnNames(
            resource.codec,
            uniqueKeys,
          )}`,
        );
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLNonNull, GraphQLObjectType },
        } = build;
        const {
          scope: { isRootQuery },
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }

        const resources = Object.values(
          build.input.pgRegistry.pgResources,
        ).filter((resource) => {
          if (resource.parameters) return false;
          if (!resource.codec.columns) return false;
          if (!resource.uniques || resource.uniques.length < 1) return false;
          return true;
        });

        return resources.reduce(
          (outerMemo, resource) =>
            build.recoverable(outerMemo, () =>
              (resource.uniques as PgResourceUnique[]).reduce(
                (memo, unique) => {
                  const uniqueKeys = unique.columns as string[];
                  const fieldName = build.inflection.rowByUnique({
                    unique,
                    resource,
                  });

                  const type = build.getTypeByName(
                    build.inflection.tableType(resource.codec),
                  );
                  if (!type || !(type instanceof GraphQLObjectType)) {
                    return memo;
                  }

                  const detailsByColumnName: {
                    [columnName: string]: {
                      graphqlName: string;
                      codec: PgCodec<any, any, any, any>;
                    };
                  } = Object.create(null);
                  uniqueKeys.forEach((columnName) => {
                    const column = resource.codec.columns![columnName];
                    const columnArgName = build.inflection.column({
                      columnName,
                      codec: resource.codec,
                    });
                    detailsByColumnName[columnName] = {
                      graphqlName: columnArgName,
                      codec: column.codec,
                    };
                  });

                  const columnNames = Object.keys(detailsByColumnName);
                  const clean = columnNames.every(
                    (key) =>
                      isSafeObjectPropertyName(key) &&
                      isSafeObjectPropertyName(
                        detailsByColumnName[key].graphqlName,
                      ),
                  );
                  const plan = clean
                    ? /*
                       * Since all the identifiers are nice and clean we can use
                       * an optimized function that doesn't loop over the
                       * attributes and just builds the object directly.  This is
                       * more performant, but it also makes the code nicer to
                       * read in the exported code.
                       */
                      // eslint-disable-next-line graphile-export/exhaustive-deps
                      EXPORTABLE(
                        te.run`\
return function (resource) {
  return (_$root, args) => resource.get({ ${te.join(
    columnNames.map(
      (columnName) =>
        te`${te.dangerousKey(columnName)}: args.get(${te.lit(
          detailsByColumnName[columnName].graphqlName,
        )})`,
    ),
    ", ",
  )} });
}` as any,
                        [resource],
                      )
                    : EXPORTABLE(
                        (detailsByColumnName, resource) =>
                          function plan(_$root: any, args: FieldArgs) {
                            const spec = Object.create(null);
                            for (const columnName in detailsByColumnName) {
                              spec[columnName] = args.get(
                                detailsByColumnName[columnName].graphqlName,
                              );
                            }
                            return resource.get(spec);
                          },
                        [detailsByColumnName, resource],
                      );

                  const behavior = getBehavior([
                    resource.codec.extensions,
                    resource.extensions,
                    unique.extensions,
                  ]);
                  const fieldBehaviorScope = "query:source:single";
                  if (
                    !build.behavior.matches(
                      behavior,
                      fieldBehaviorScope,
                      "single",
                    )
                  ) {
                    return memo;
                  }

                  return build.extend(
                    memo,
                    {
                      [fieldName]: fieldWithHooks(
                        {
                          fieldName,
                          fieldBehaviorScope,
                        },
                        () => ({
                          description: `Get a single \`${type.name}\`.`,
                          deprecationReason: tagToString(
                            resource.extensions?.tags?.deprecated,
                          ),
                          type,
                          args: uniqueKeys.reduce((args, columnName) => {
                            const details = detailsByColumnName[columnName];
                            const columnType = build.getGraphQLTypeByPgCodec(
                              details.codec,
                              "input",
                            );
                            if (!columnType) {
                              throw new Error(
                                `Could not determine type for column`,
                              );
                            }
                            args[details.graphqlName] = {
                              type: new GraphQLNonNull(columnType),
                            };
                            return args;
                          }, Object.create(null)),

                          plan: plan as any,
                        }),
                      ),
                    },
                    `Adding row accessor for ${resource} by unique columns ${uniqueKeys.join(
                      ",",
                    )}`,
                  );
                },
                outerMemo,
              ),
            ),
          fields,
        );
      },
    },
  },
};
