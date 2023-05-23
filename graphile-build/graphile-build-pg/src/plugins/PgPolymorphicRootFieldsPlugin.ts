import "graphile-config";
import { version } from "../version.js";
import {
  PgCodec,
  PgRegistry,
  PgResource,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  pgUnionAll,
} from "@dataplan/pg";
import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { EXPORTABLE } from "graphile-build";
import { connection } from "grafast";

interface AllPolymorphicRowsDetails {
  codec: PgCodec;
}

declare global {
  namespace GraphileBuild {
    interface Inflection {
      /**
       * The field name for a Cursor Connection field that returns all rows
       * from the given resource.
       */
      allPolymorphicRowsConnection(
        this: Inflection,
        details: AllPolymorphicRowsDetails,
      ): string;

      /**
       * The field name for a List field that returns all rows from the given
       * resource.
       */
      allPolymorphicRowsList(
        this: Inflection,
        details: AllPolymorphicRowsDetails,
      ): string;
    }
  }
}

export const PgPolymorphicRootFieldsPlugin: GraphileConfig.Plugin = {
  name: "PgPolymorphicRootFieldsPlugin",
  version,

  inflection: {
    add: {
      allPolymorphicRowsConnection(options, { codec }) {
        return this.connectionField(
          this.camelCase(
            `all-${this.pluralize(this._singularizedCodecName(codec))}`,
          ),
        );
      },
      allPolymorphicRowsList(options, { codec }) {
        return this.listField(
          this.camelCase(
            `all-${this.pluralize(this._singularizedCodecName(codec))}`,
          ),
        );
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const { inflection, input, pgGetBehavior: getBehavior } = build;
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
          const { unionMember, implements: implementsTag } =
            resource.codec.extensions.tags;
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

        // const polymorphicCodecs = Object.values(pgRegistry.pgCodecs).filter(
        //   (c) => c.polymorphism,
        // );
        const interfaceCodecs: { [polymorphicTypeName: string]: PgCodec } =
          Object.create(null);
        for (const codec of Object.values(pgRegistry.pgCodecs)) {
          if (!codec.polymorphism) continue;
          switch (codec.polymorphism.mode) {
            case "single":
            case "relational":
            case "union": {
              const interfaceTypeName = inflection.tableType(codec);
              interfaceCodecs[interfaceTypeName] = codec;
              break;
            }
            default: {
              const never: never = codec.polymorphism;
              console.warn(
                `Polymorphism mode ${(never as any).mode} not understood`,
              );
            }
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
            console.log(
              `${polymorphicTypeName} (${interfaceCodec.name}[${
                interfaceCodec.polymorphism!.mode
              }]): ${spec.resources.map((r) => r.name)}`,
            );

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
                ? inflection.allPolymorphicRowsConnection({
                    codec: interfaceCodec,
                  })
                : inflection.allPolymorphicRowsList({
                    codec: interfaceCodec,
                  });

              switch (interfaceCodec.polymorphism.mode) {
                case "single":
                case "relational": {
                  // TODO: Select the underlying (or root) table
                  break;
                }
                case "union": {
                  if (!interfaceCodec.attributes) break;
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
                          plan: EXPORTABLE(() => {
                            return function plan() {
                              const $list = pgUnionAll({
                                attributes,
                                resourceByTypeName,
                                members,
                              });
                              return useConnection ? connection($list) : $list;
                            };
                          }, []),
                        },
                      ),
                    },
                    `Adding polymorphic "all rows" ${
                      useConnection ? "connection" : "list"
                    } field for ${interfaceCodec.name} to the root query`,
                  );
                  break;
                }
                default: {
                  const never: never = interfaceCodec.polymorphism;
                  console.warn(
                    `Polymorphism mode ${(never as any)?.mode} not understood`,
                  );
                }
              }
            };
            const behavior = getBehavior([interfaceCodec.extensions]);
            const defaultBehavior = "connection -list";
            if (
              build.behavior.matches(
                behavior,
                "query:interface:list",
                defaultBehavior,
              )
            ) {
              makeField(false);
            }
            if (
              build.behavior.matches(
                behavior,
                "query:interface:connection",
                defaultBehavior,
              )
            ) {
              makeField(true);
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
