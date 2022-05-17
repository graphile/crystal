import "graphile-config";

import type { PgSource, PgSourceUnique, PgTypeCodec } from "@dataplan/pg";
import type { TrackedArguments } from "dataplanner";
import { EXPORTABLE, isSafeIdentifier } from "graphile-export";
import type { GraphQLObjectType } from "graphql";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      rowByUniqueKeys(
        this: Inflection,
        details: { uniqueKeys: string[]; source: PgSource<any, any, any, any> },
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
    "Adds accessors for rows by their unique constraints (technically the @dataplan/pg data sources' 'uniques' property)",
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
              (source.uniques as PgSourceUnique[]).reduce((memo, unique) => {
                const uniqueKeys = unique.columns as string[];
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

                const columnNames = Object.keys(detailsByColumnName);
                const clean = columnNames.every(
                  (key) =>
                    isSafeIdentifier(key) &&
                    isSafeIdentifier(detailsByColumnName[key].graphqlName),
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
                      new Function(
                        "source",
                        `return (_$root, args) => source.get({ ${columnNames
                          .map(
                            (columnName) =>
                              `${columnName}: args.${detailsByColumnName[columnName].graphqlName}`,
                          )
                          .join(", ")} })`,
                      ) as any,
                      [source],
                    )
                  : EXPORTABLE(
                      (detailsByColumnName, source) =>
                        function plan(
                          _$root: any,
                          args: TrackedArguments<any>,
                        ) {
                          const spec = {};
                          for (const columnName in detailsByColumnName) {
                            spec[columnName] =
                              args[detailsByColumnName[columnName].graphqlName];
                          }
                          return source.get(spec);
                        },
                      [detailsByColumnName, source],
                    );

                const behavior = getBehavior([
                  source.extensions,
                  unique.extensions,
                ]);
                const fieldBehaviorScope = "query:single";
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

                        plan: plan as any,
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
