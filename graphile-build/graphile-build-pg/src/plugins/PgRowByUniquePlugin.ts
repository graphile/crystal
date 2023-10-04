import "graphile-config";

import type {
  DefaultPgCodec,
  DefaultPgResource,
  DefaultPgResourceUnique,
} from "@dataplan/pg";
import type { FieldArgs } from "grafast";
import { EXPORTABLE } from "graphile-build";
import te, { isSafeObjectPropertyName } from "tamedevil";

import { tagToString } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      rowByUnique(
        this: Inflection,
        details: {
          unique: DefaultPgResourceUnique;
          resource: DefaultPgResource;
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
        const uniqueKeys = unique.attributes;
        return this.camelCase(
          // NOTE: If your schema uses the same codec for multiple resources,
          // you should probably change this to use the resource name.
          `${this.tableType(resource.codec)}-by-${this._joinAttributeNames(
            resource.codec,
            uniqueKeys,
          )}`,
        );
      },
    },
  },

  schema: {
    entityBehavior: {
      pgResourceUnique: "single",
    },
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
          if (!resource.codec.attributes) return false;
          if (!resource.uniques || resource.uniques.length < 1) return false;
          return true;
        });

        return resources.reduce(
          (outerMemo, rawResource) =>
            build.recoverable(outerMemo, () =>
              rawResource.uniques.reduce((memo, unique) => {
                const resource = rawResource;
                const uniqueKeys = unique.attributes;
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

                const detailsByAttributeName: {
                  [attributeName: string]: {
                    graphqlName: string;
                    codec: DefaultPgCodec;
                  };
                } = Object.create(null);
                uniqueKeys.forEach((attributeName) => {
                  const attribute = resource.codec.attributes![attributeName];
                  const attributeArgName = build.inflection.attribute({
                    attributeName,
                    codec: resource.codec,
                  });
                  detailsByAttributeName[attributeName] = {
                    graphqlName: attributeArgName,
                    codec: attribute.codec,
                  };
                });

                const attributeNames = Object.keys(detailsByAttributeName);
                const clean = attributeNames.every(
                  (key) =>
                    isSafeObjectPropertyName(key) &&
                    isSafeObjectPropertyName(
                      detailsByAttributeName[key].graphqlName,
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
    attributeNames.map(
      (attributeName) =>
        te`${te.safeKeyOrThrow(attributeName)}: args.get(${te.lit(
          detailsByAttributeName[attributeName].graphqlName,
        )})`,
    ),
    ", ",
  )} });
}` as any,
                      [resource],
                    )
                  : EXPORTABLE(
                      (detailsByAttributeName, resource) =>
                        function plan(_$root: any, args: FieldArgs) {
                          const spec = Object.create(null);
                          for (const attributeName in detailsByAttributeName) {
                            spec[attributeName] = args.get(
                              detailsByAttributeName[attributeName].graphqlName,
                            );
                          }
                          return resource.get(spec);
                        },
                      [detailsByAttributeName, resource],
                    );

                const fieldBehaviorScope = "query:resource:single";
                if (
                  !build.behavior.pgResourceUniqueMatches(
                    [resource, unique],
                    fieldBehaviorScope,
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
                        args: uniqueKeys.reduce((args, attributeName) => {
                          const details = detailsByAttributeName[attributeName];
                          const attributeType = build.getGraphQLTypeByPgCodec(
                            details.codec,
                            "input",
                          );
                          if (!attributeType) {
                            throw new Error(
                              `Could not determine type for attribute`,
                            );
                          }
                          args[details.graphqlName] = {
                            type: new GraphQLNonNull(attributeType),
                          };
                          return args;
                        }, Object.create(null)),

                        plan: plan as any,
                      }),
                    ),
                  },
                  `Adding row accessor for ${resource} by unique attributes ${uniqueKeys.join(
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
