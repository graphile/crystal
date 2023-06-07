import "graphile-config";

import type {
  PgCodec,
  PgRegistry,
  PgResource,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
} from "@dataplan/pg";
import { pgUnionAll } from "@dataplan/pg";
import { connection } from "grafast";
import { EXPORTABLE } from "graphile-build";
import type { GraphQLInterfaceType, GraphQLObjectType } from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface Inflection {
      /**
       * The field name for a Cursor Connection field that returns all rows
       * from the given `@interface mode:union` codec.
       */
      allInterfaceModeUnionRowsConnection(
        this: Inflection,
        codec: PgCodec,
      ): string;

      /**
       * The field name for a List field that returns all rows from the given
       * `@interface mode:union` codec.
       */
      allInterfaceModeUnionRowsList(this: Inflection, codec: PgCodec): string;
    }
  }
}

export const PgInterfaceModeUnionAllRowsPlugin: GraphileConfig.Plugin = {
  name: "PgInterfaceModeUnionAllRowsPlugin",
  version,

  inflection: {
    add: {
      allInterfaceModeUnionRowsConnection(options, codec) {
        return this.connectionField(
          this.camelCase(
            `all-${this.pluralize(this._singularizedCodecName(codec))}`,
          ),
        );
      },
      allInterfaceModeUnionRowsList(options, codec) {
        return this.listField(
          this.camelCase(
            `all-${this.pluralize(this._singularizedCodecName(codec))}`,
          ),
        );
      },
    },
  },

  schema: {
    entityBehavior: {
      pgCodec: {
        provides: ["default"],
        before: ["inferred", "override"],
        callback(behavior, entity) {
          if (entity.polymorphism?.mode === "union") {
            return ["connection -list", behavior];
          } else {
            return behavior;
          }
        },
      },
    },
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          inflection,
          input,
          graphql: { GraphQLList, GraphQLNonNull },
        } = build;
        const {
          scope: { isRootQuery },
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }

        const pgRegistry = input.pgRegistry as PgRegistry;

        const resourcesByPolymorphicTypeName: {
          [polymorphicTypeName: string]: {
            resources: PgResource[];
            type: "union" | "interface";
          };
        } = Object.create(null);

        const allResources = Object.values(pgRegistry.pgResources);
        for (const resource of allResources) {
          if (resource.parameters) continue;
          if (typeof resource.from === "function") continue;
          if (!resource.codec.extensions?.tags) continue;
          const { implements: implementsTag } = resource.codec.extensions.tags;
          /*
          const { unionMember } = resource.codec.extensions.tags;
          if (unionMember) {
            const unions = Array.isArray(unionMember)
              ? unionMember
              : [unionMember];
            for (const union of unions) {
              if (!resourcesByPolymorphicTypeName[union]) {
                resourcesByPolymorphicTypeName[union] = {
                  resources: [resource as PgResource],
                  type: "union",
                };
              } else {
                if (resourcesByPolymorphicTypeName[union].type !== "union") {
                  throw new Error(`Inconsistent polymorphism`);
                }
                resourcesByPolymorphicTypeName[union].resources.push(
                  resource as PgResource,
                );
              }
            }
          }
          */
          if (implementsTag) {
            const interfaces = Array.isArray(implementsTag)
              ? implementsTag
              : [implementsTag];
            for (const interfaceName of interfaces) {
              if (!resourcesByPolymorphicTypeName[interfaceName]) {
                resourcesByPolymorphicTypeName[interfaceName] = {
                  resources: [resource as PgResource],
                  type: "interface",
                };
              } else {
                if (
                  resourcesByPolymorphicTypeName[interfaceName].type !==
                  "interface"
                ) {
                  throw new Error(`Inconsistent polymorphism`);
                }
                resourcesByPolymorphicTypeName[interfaceName].resources.push(
                  resource as PgResource,
                );
              }
            }
          }
        }

        const interfaceCodecs: { [polymorphicTypeName: string]: PgCodec } =
          Object.create(null);
        for (const codec of Object.values(pgRegistry.pgCodecs)) {
          if (!codec.polymorphism) continue;
          if (codec.polymorphism.mode !== "union") continue;

          const interfaceTypeName = inflection.tableType(codec);
          interfaceCodecs[interfaceTypeName] = codec;

          // Explicitly allow zero implementations.
          if (!resourcesByPolymorphicTypeName[interfaceTypeName]) {
            resourcesByPolymorphicTypeName[interfaceTypeName] = {
              resources: [],
              type: "interface",
            };
          }
        }

        for (const [polymorphicTypeName, spec] of Object.entries(
          resourcesByPolymorphicTypeName,
        )) {
          if (spec.type === "union") {
            // We can't add a root field for a basic union because there's
            // nothing to order it by - we wouldn't be able to reliably
            // paginate.
          } else if (spec.type === "interface") {
            const interfaceCodec = interfaceCodecs[polymorphicTypeName];
            if (!interfaceCodec) {
              console.warn(
                `A number of resources claim to implement '${polymorphicTypeName}', but we couldn't find the definition for that type so we won't add a root field for it. (Perhaps you implemented it in makeExtendSchemaPlugin?) Affected resources: ${spec.resources
                  .map((r) => r.name)
                  .join(", ")}`,
              );
              continue;
            }
            if (interfaceCodec.polymorphism?.mode !== "union") {
              // 'single' and 'relational' are already handled by PgAllRowsPlugin
              continue;
            }

            const makeField = (useConnection: boolean): void => {
              if (!interfaceCodec.polymorphism) return;

              const type = build.getTypeByName(
                build.inflection.tableType(interfaceCodec),
              ) as GraphQLInterfaceType | undefined;
              if (!type) return;

              const fieldType = useConnection
                ? (build.getTypeByName(
                    build.inflection.tableConnectionType(interfaceCodec),
                  ) as GraphQLObjectType | undefined)
                : // TODO: nullability.
                  new GraphQLList(new GraphQLNonNull(type));
              if (!fieldType) return;

              const fieldName = useConnection
                ? inflection.allInterfaceModeUnionRowsConnection(interfaceCodec)
                : inflection.allInterfaceModeUnionRowsList(interfaceCodec);

              if (!interfaceCodec.attributes) return;
              const attributes: PgUnionAllStepConfigAttributes<string> =
                interfaceCodec.attributes;
              const resourceByTypeName: Record<string, PgResource> =
                Object.create(null);
              const members: PgUnionAllStepMember<string>[] = [];
              for (const resource of spec.resources) {
                const typeName = inflection.tableType(resource.codec);
                resourceByTypeName[typeName] = resource;
                members.push({
                  resource,
                  typeName,
                });
              }
              build.extend(
                fields,
                {
                  [fieldName]: fieldWithHooks(
                    {
                      fieldName,
                      isPgFieldConnection: useConnection,
                      isPgFieldSimpleCollection: !useConnection,
                      pgFieldCodec: interfaceCodec,
                    },
                    {
                      type: fieldType,
                      plan: EXPORTABLE(
                        (
                          attributes,
                          connection,
                          members,
                          pgUnionAll,
                          resourceByTypeName,
                          useConnection,
                        ) => {
                          return function plan() {
                            const $list = pgUnionAll({
                              attributes,
                              resourceByTypeName,
                              members,
                            });
                            return useConnection ? connection($list) : $list;
                          };
                        },
                        [
                          attributes,
                          connection,
                          members,
                          pgUnionAll,
                          resourceByTypeName,
                          useConnection,
                        ],
                      ),
                    },
                  ),
                },
                `Adding polymorphic "all rows" ${
                  useConnection ? "connection" : "list"
                } field for ${interfaceCodec.name} to the root query`,
              );
            };
            if (
              build.behavior.pgCodecMatches(
                interfaceCodec,
                "query:interface:connection",
              )
            ) {
              makeField(true);
            }
            if (
              build.behavior.pgCodecMatches(
                interfaceCodec,
                "query:interface:list",
              )
            ) {
              makeField(false);
            }
          } else {
            const never: never = spec.type;
            console.warn(
              `GraphileInternalError<f107e83d-087e-4116-8aaf-15da83f76f88>: Internal consistency issue: ${never} unhandled`,
            );
          }
        }

        return fields;
      },
    },
  },
};
