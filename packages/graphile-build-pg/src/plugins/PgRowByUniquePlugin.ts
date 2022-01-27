import type { PgSource, PgTypeCodec } from "@dataplan/pg";
import type { TrackedArguments } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLObjectType } from "graphql";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      rowByUniqueKeys(
        this: Inflection,
        details: { uniqueKeys: string[]; source: PgSource<any, any, any, any> },
      ): string;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgRowByUniqueConstraintField?: boolean;
    }
  }
}

export const PgRowByUniquePlugin: Plugin = {
  name: "PgRowByUniquePlugin",
  description: "Adds accessors for rows by uniques",
  version: version,

  inflection: {
    add: {
      rowByUniqueKeys(options, { uniqueKeys, source }) {
        return this.camelCase(
          // TODO: should this use the _source_ rather than the _codec_ in case the same codec is used across multiple sources?
          `${this.tableType(source.codec)}-by-${uniqueKeys.join("-and-")}`,
        );
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLNonNull },
        } = build;
        const {
          scope: { isRootQuery },
          Self,
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }

        const sources = build.input.pgSources.filter((source) => {
          if (source.parameters) return false;
          if (!source.codec.columns) return false;
          if (!source.uniques || source.uniques.length < 1) return false;
          return true;
        });

        return sources.reduce(
          (outerMemo, source) =>
            build.recoverable(outerMemo, () =>
              // TODO: by having 'uniques' be a simple array, we can't add 'behaviour' extensions.
              (source.uniques as string[][]).reduce((memo, uniqueKeys) => {
                const fieldName = build.inflection.rowByUniqueKeys({
                  uniqueKeys,
                  source,
                });

                const type = build.getOutputTypeByName(
                  build.inflection.tableType(source.codec),
                ) as GraphQLObjectType;
                if (!type) {
                  return memo;
                }

                const detailsByColumnName: {
                  [columnName: string]: {
                    graphqlName: string;
                    codec: PgTypeCodec<any, any, any, any>;
                  };
                } = Object.create(null);
                uniqueKeys.forEach((columnName) => {
                  const column = source.codec.columns[columnName];
                  const columnArgName = build.inflection.column({
                    columnName,
                    column,
                    codec: source.codec,
                  });
                  detailsByColumnName[columnName] = {
                    graphqlName: columnArgName,
                    codec: column.codec,
                  };
                });

                return build.extend(
                  memo,
                  {
                    [fieldName]: fieldWithHooks(
                      {
                        fieldName,
                      },
                      () => ({
                        description: `Get a single \`${type.name}\`.`,
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
                        }, {}),
                        plan: EXPORTABLE(
                          (detailsByColumnName, source) =>
                            function plan(
                              _$root: any,
                              args: TrackedArguments<any>,
                            ) {
                              const spec = {};
                              for (const columnName in detailsByColumnName) {
                                spec[columnName] =
                                  args[
                                    detailsByColumnName[columnName].graphqlName
                                  ];
                              }
                              return source.get(spec);
                            },
                          [detailsByColumnName, source],
                        ) as any,
                      }),
                    ),
                  },
                  `Adding row accessor for ${source} by unique columns ${uniqueKeys.join(
                    ",",
                  )}`,
                );
              }, outerMemo),
            ),
          fields,
        );
      },
    },
  },
};
