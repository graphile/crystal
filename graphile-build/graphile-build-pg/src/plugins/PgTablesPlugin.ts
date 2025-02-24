import type {
  PgCodec,
  PgCodecAttribute,
  PgResource,
  PgResourceOptions,
  PgResourceUnique,
} from "@dataplan/pg";
import { assertPgClassSingleStep, makePgResourceOptions } from "@dataplan/pg";
import { object } from "grafast";
import {
  EXPORTABLE,
  EXPORTABLE_OBJECT_CLONE,
  gatherConfig,
} from "graphile-build";
import type { PgClass, PgConstraint, PgNamespace } from "pg-introspection";

import { exportNameHint } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface BehaviorStrings {
      table: true;
      "resource:select": true;
      "resource:insert": true;
      "resource:update": true;
      "resource:delete": true;
    }
    interface SchemaOptions {
      /**
       * If true, setof functions cannot return null, so our list and
       * connection types can use GraphQLNonNull in more places.
       */
      pgForbidSetofFunctionsToReturnNull?: boolean;
    }

    interface Inflection {
      /**
       * A PgResource represents a single way of getting a number of values of
       * `resource.codec` type. It doesn't necessarily represent a table directly
       * (although it can) - e.g. it might be a function that returns records
       * from a table, or it could be a "sub-selection" of a table, e.g.
       * "admin_users" might be "users where admin is true".  This inflector
       * gives a name to this resource, it's primarily used when naming _fields_
       * in the GraphQL schema (as opposed to `_codecName` which typically
       * names _types_.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _resourceName(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;

      /**
       * Takes a `_sourceName` and singularizes it.
       */
      _singularizedResourceName(
        this: Inflection,
        resource: PgResource<any, any, any, any, any>,
      ): string;

      /**
       * When you're using multiple databases and/or schemas, you may want to
       * prefix various type names/field names with an identifier for these
       * DBs/schemas.
       */
      _schemaPrefix(
        this: Inflection,
        details: {
          serviceName: string;
          pgNamespace: PgNamespace;
        },
      ): string;

      /**
       * The name of the PgResource for a table/class
       */
      tableResourceName(
        this: Inflection,
        details: {
          serviceName: string;
          pgClass: PgClass;
        },
      ): string;

      /**
       * A PgCodec may represent any of a wide range of PostgreSQL types;
       * this inflector gives a name to this codec, it's primarily used when
       * naming _types_ in the GraphQL schema (as opposed to `_sourceName`
       * which typically names _fields_).
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _codecName(
        this: Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;

      /**
       * Takes a `_codecName` and singularizes it. This is also a good place to
       * try and avoid potential conflicts, e.g. for a table `foo` a `Foo` and
       * `FooInput` and `FooPatch` type might be generated. So a `foo_input`
       * table could potentially cause conflicts. The default inflector would
       * turn `foo_input` into `FooInputRecord`.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _singularizedCodecName(
        this: Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;

      /**
       * Appends '_record' to a name that ends in `_input`, `_patch`, `Input`
       * or `Patch` to avoid naming conflicts.
       */
      dontEndInInputOrPatch(this: Inflection, text: string): string;

      /**
       * The name of the GraphQL Object Type that's generated to represent a
       * specific table (more specifically a PostgreSQL "pg_class" which is
       * represented as a certain PgCodec)
       */
      tableType(
        this: GraphileBuild.Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;

      tableConnectionType(
        this: GraphileBuild.Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;

      tableEdgeType(
        this: GraphileBuild.Inflection,
        codec: PgCodec<any, any, any, any, any, any, any>,
      ): string;

      patchType(this: GraphileBuild.Inflection, typeName: string): string;
      baseInputType(this: GraphileBuild.Inflection, typeName: string): string;
    }

    interface ScopeObject {
      pgCodec?: PgCodec<any, any, any, any, any, any, any>;
      isPgClassType?: boolean;
      isPgConnectionRelated?: true;
    }
    interface ScopeObjectFieldsField {
      pgFieldResource?: PgResource<any, any, any, any, any>;
      pgFieldCodec?: PgCodec<any, any, any, any, any, any, any>;
      pgFieldAttribute?: PgCodecAttribute<any>;
      isPgFieldConnection?: boolean;
      isPgFieldSimpleCollection?: boolean;
    }
    interface ScopeInterfaceFieldsField {
      pgFieldResource?: PgResource<any, any, any, any, any>;
      pgFieldCodec?: PgCodec<any, any, any, any, any, any, any>;
      pgFieldAttribute?: PgCodecAttribute<any>;
      isPgFieldConnection?: boolean;
      isPgFieldSimpleCollection?: boolean;
    }
  }

  namespace GraphileConfig {
    interface Plugins {
      PgTablesPlugin: true;
    }

    interface GatherHelpers {
      pgTables: {
        getResourceOptions(
          serviceName: string,
          pgClass: PgClass,
        ): Promise<PgResourceOptions | null>;
      };
    }

    interface GatherHooks {
      /**
       * Determines the uniques to include in a PgResourceOptions when it is built
       */
      pgTables_unique(event: {
        serviceName: string;
        pgClass: PgClass;
        pgConstraint: PgConstraint;
        unique: PgResourceUnique;
      }): void | Promise<void>;
      /**
       * Passed the PgResourceOptions before it's added to the PgRegistryBuilder.
       */
      pgTables_PgResourceOptions(event: {
        serviceName: string;
        pgClass: PgClass;
        resourceOptions: PgResourceOptions;
      }): void | Promise<void>;
      pgTables_PgResourceOptions_relations(event: {
        serviceName: string;
        pgClass: PgClass;
        resourceOptions: PgResourceOptions;
      }): Promise<void> | void;
      pgTables_PgResourceOptions_relations_post(event: {
        serviceName: string;
        pgClass: PgClass;
        resourceOptions: PgResourceOptions;
      }): Promise<void> | void;
    }
  }
  namespace DataplanPg {
    interface PgResourceExtensions {
      /** Checks capabilities of this resource to see if INSERT is even possible */
      isInsertable?: boolean;
      /** Checks capabilities of this resource to see if UPDATE is even possible */
      isUpdatable?: boolean;
      /** Checks capabilities of this resource to see if DELETE is even possible */
      isDeletable?: boolean;
    }
  }
}

interface State {
  resourceOptionsByPgClassByService: Map<
    string,
    Map<PgClass, Promise<PgResourceOptions | null>>
  >;
  resourceByResourceOptions: Map<PgResourceOptions, Promise<PgResource | null>>;
  detailsByResourceOptions: Map<
    PgResourceOptions,
    { serviceName: string; pgClass: PgClass }
  >;
}

const EMPTY_OBJECT = Object.freeze({});

export const PgTablesPlugin: GraphileConfig.Plugin = {
  name: "PgTablesPlugin",
  description:
    "Spots pg_class entries that looks like tables/views/materialized views (but not partitions!) and registers them as sources",
  version: version,
  after: ["PgIntrospectionPlugin"],

  inflection: {
    add: {
      _schemaPrefix(options, { pgNamespace, serviceName }) {
        const pgService = options.pgServices?.find(
          (db) => db.name === serviceName,
        );
        const databasePrefix = serviceName === "main" ? "" : `${serviceName}_`;
        const schemaPrefix =
          pgNamespace.nspname === pgService?.schemas?.[0]
            ? ""
            : `${pgNamespace.nspname}_`;
        return `${databasePrefix}${schemaPrefix}`;
      },

      tableResourceName(options, { pgClass, serviceName }) {
        const typeTags = pgClass.getType()!.getTags();
        const classTags = pgClass.getTags();
        if (typeof typeTags?.name === "string") {
          return typeTags.name;
        }
        if (typeof classTags?.name === "string") {
          return classTags.name;
        }
        const pgNamespace = pgClass.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ pgNamespace, serviceName });
        return `${schemaPrefix}${pgClass.relname}`;
      },

      _codecName(options, codec) {
        return this.coerceToGraphQLName(codec.name);
      },

      _singularizedCodecName(options, codec) {
        return this.dontEndInInputOrPatch(
          this.singularize(this._codecName(codec)),
        );
      },

      dontEndInInputOrPatch(options, text) {
        return text.replace(
          /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
          "$&_record",
        );
      },

      _resourceName(options, resource) {
        return this.coerceToGraphQLName(
          resource.extensions?.tags?.name ?? resource.name,
        );
      },

      _singularizedResourceName(options, resource) {
        return this.dontEndInInputOrPatch(
          this.singularize(this._resourceName(resource)),
        );
      },

      tableType(options, codec) {
        return this.upperCamelCase(this._singularizedCodecName(codec));
      },

      tableConnectionType(options, codec) {
        return this.connectionType(this.tableType(codec));
      },

      tableEdgeType(options, codec) {
        return this.edgeType(this.tableType(codec));
      },

      patchType(options, typeName) {
        return this.upperCamelCase(`${typeName}-patch`);
      },
      baseInputType(options, typeName) {
        return this.upperCamelCase(`${typeName}-base-input`);
      },
    },
  },

  gather: gatherConfig({
    namespace: "pgTables",
    initialCache() {
      return EMPTY_OBJECT;
    },
    helpers: {
      getResourceOptions(info, serviceName, pgClass) {
        let resourceOptionsByPgClass =
          info.state.resourceOptionsByPgClassByService.get(serviceName);
        if (!resourceOptionsByPgClass) {
          resourceOptionsByPgClass = new Map();
          info.state.resourceOptionsByPgClassByService.set(
            serviceName,
            resourceOptionsByPgClass,
          );
        }
        let resourceOptions = resourceOptionsByPgClass.get(pgClass);
        if (resourceOptions) {
          return resourceOptions;
        }
        resourceOptions = (async () => {
          const pgService = info.resolvedPreset.pgServices?.find(
            (db) => db.name === serviceName,
          );
          if (!pgService) {
            throw new Error(`Could not find '${serviceName}' in 'pgServices'`);
          }
          const schemas = pgService.schemas ?? ["public"];

          const namespace = pgClass.getNamespace();
          if (!namespace) {
            return null;
          }

          if (!schemas.includes(namespace.nspname)) {
            return null;
          }

          // TODO: check compatibility with 'foreign' tables
          if (
            !["r", "v", "m", "f", "p", "c"].includes(pgClass.relkind) ||
            pgClass.relispartition
          ) {
            return null;
          }

          const attributes =
            await info.helpers.pgIntrospection.getAttributesForClass(
              serviceName,
              pgClass._id,
            );

          const codec = await info.helpers.pgCodecs.getCodecFromClass(
            serviceName,
            pgClass._id,
          );
          if (!codec) {
            return null;
          }

          const directConstraints =
            await info.helpers.pgIntrospection.getConstraintsForClass(
              serviceName,
              pgClass._id,
            );

          const inheritance =
            await info.helpers.pgIntrospection.getInheritedForClass(
              serviceName,
              pgClass._id,
            );

          const inheritedConstraints = await Promise.all(
            inheritance.map((inh) => {
              return info.helpers.pgIntrospection.getConstraintsForClass(
                serviceName,
                inh.inhparent,
              );
            }),
          );
          const constraints = [
            // TODO: handle multiple inheritance
            ...inheritedConstraints.flatMap((list) => list),
            ...directConstraints,
          ];
          const uniqueAttributeOnlyConstraints = constraints.filter(
            (c) =>
              ["u", "p"].includes(c.contype) && c.conkey?.every((k) => k > 0),
          );
          const idx = uniqueAttributeOnlyConstraints.findIndex(
            (c) => c.contype === "p",
          );

          if (idx > 0) {
            // Primary key was found, but wasn't in initial position; let's
            // move it to the front
            uniqueAttributeOnlyConstraints.unshift(
              ...uniqueAttributeOnlyConstraints.splice(idx, 1),
            );
          }

          const uniques = await Promise.all(
            uniqueAttributeOnlyConstraints.map(async (pgConstraint) => {
              const { tags, description } =
                pgConstraint.getTagsAndDescription();
              const unique: PgResourceUnique = {
                isPrimary: pgConstraint.contype === "p",
                attributes: pgConstraint.conkey!.map(
                  (k) => attributes.find((att) => att.attnum === k)!.attname,
                ),
                description,
                extensions: {
                  tags,
                },
              };
              await info.process("pgTables_unique", {
                serviceName,
                pgClass,
                pgConstraint,
                unique,
              });
              return unique;
            }),
          );

          const executor =
            info.helpers.pgIntrospection.getExecutorForService(serviceName);
          const name = info.inflection.tableResourceName({
            serviceName,
            pgClass,
          });
          exportNameHint(uniques, `${name}Uniques`);
          const identifier = `${serviceName}.${namespace.nspname}.${pgClass.relname}`;

          const { tags, description } = pgClass.getTagsAndDescription();

          const mask = pgClass.updatable_mask ?? 2 ** 8 - 1;
          const isInsertable = (mask & (1 << 3)) > 0;
          const isUpdatable = (mask & (1 << 2)) > 0;
          const isDeletable = (mask & (1 << 4)) > 0;

          const isVirtual = !["r", "v", "m", "f", "p"].includes(
            pgClass.relkind,
          );
          const extensions: DataplanPg.PgResourceExtensions = {
            description,
            pg: {
              serviceName,
              schemaName: pgClass.getNamespace()!.nspname,
              name: pgClass.relname,
              ...(pgClass.relpersistence !== "p"
                ? {
                    persistence: pgClass.relpersistence,
                  }
                : null),
            },
            isInsertable,
            isUpdatable,
            isDeletable,
            tags: {
              ...tags,
            },
          } as const;
          const options = {
            executor,
            name,
            identifier,
            from: codec.sqlType,
            codec,
            uniques,
            isVirtual,
            description,
            extensions,
          } as const;

          await info.process("pgTables_PgResourceOptions", {
            serviceName,
            pgClass,
            resourceOptions: options,
          });

          // Need to mark this exportable to avoid out-of-order access to
          // variables in the export
          const finalOptions = EXPORTABLE_OBJECT_CLONE(options);

          const resourceOptions = EXPORTABLE(
            (finalOptions, makePgResourceOptions) =>
              makePgResourceOptions(finalOptions),
            [finalOptions, makePgResourceOptions],
          );

          const registryBuilder =
            await info.helpers.pgRegistry.getRegistryBuilder();
          if (!resourceOptions.isVirtual) {
            registryBuilder.addResource(resourceOptions);
          }

          info.state.detailsByResourceOptions.set(resourceOptions, {
            serviceName,
            pgClass,
          });

          return resourceOptions;
        })();
        resourceOptionsByPgClass.set(pgClass, resourceOptions);
        return resourceOptions;
      },
    },
    initialState: (): State => ({
      resourceOptionsByPgClassByService: new Map(),
      resourceByResourceOptions: new Map(),
      detailsByResourceOptions: new Map(),
    }),
    hooks: {
      async pgIntrospection_class({ helpers }, event) {
        const { entity: pgClass, serviceName } = event;
        helpers.pgTables.getResourceOptions(serviceName, pgClass);
      },

      async pgRegistry_PgRegistryBuilder_pgRelations(info, _event) {
        // Ensure introspection has occurred, to ensure that
        // `pgIntrospection_class` above is called before this.
        await info.helpers.pgIntrospection.getIntrospection();

        const toProcess: Array<{
          resourceOptions: PgResourceOptions;
          pgClass: PgClass;
          serviceName: string;
        }> = [];
        for (const [
          serviceName,
          resourceOptionsByPgClass,
        ] of info.state.resourceOptionsByPgClassByService.entries()) {
          for (const [
            pgClass,
            resourceOptionsPromise,
          ] of resourceOptionsByPgClass.entries()) {
            const resourceOptions = await resourceOptionsPromise;
            if (resourceOptions) {
              const entry = { resourceOptions, pgClass, serviceName };
              await info.process("pgTables_PgResourceOptions_relations", entry);
              toProcess.push(entry);
            }
          }
        }
        for (const entry of toProcess) {
          await info.process(
            "pgTables_PgResourceOptions_relations_post",
            entry,
          );
        }
      },
    },
  }),

  schema: {
    behaviorRegistry: {
      add: {
        "resource:select": {
          description: "can select rows from this resource",
          entities: ["pgCodec", "pgResource"],
        },
        "resource:insert": {
          description: "can insert into this resource",
          entities: ["pgCodec", "pgResource"],
        },
        "resource:update": {
          description: "can update a record in this resource",
          entities: ["pgCodec", "pgResource"],
        },
        "resource:delete": {
          description: "can delete a record in this resource",
          entities: ["pgCodec", "pgResource"],
        },
        table: {
          description: "is this codec table-like?",
          entities: ["pgCodec"],
        },
      },
    },
    entityBehavior: {
      pgCodec: {
        inferred: {
          provides: ["default"],
          before: ["inferred", "override"],
          callback(behavior, codec) {
            if (codec.attributes) {
              return [
                "resource:select",
                "table",
                ...((!codec.isAnonymous
                  ? ["resource:insert", "resource:update", "resource:delete"]
                  : []) as GraphileBuild.BehaviorString[]),
                ...unloggedOrTempBehaviors(codec.extensions, behavior, null),
              ];
            } else {
              return [behavior];
            }
          },
        },
      },
      pgResource: {
        inferred: {
          provides: ["default"],
          before: ["inferred", "override"],
          callback(behavior, resource) {
            const ext = resource.extensions;
            return [
              ...(ext?.isInsertable === false ? ["-resource:insert"] : []),
              ...(ext?.isUpdatable === false ? ["-resource:update"] : []),
              ...(ext?.isDeletable === false ? ["-resource:delete"] : []),
              ...unloggedOrTempBehaviors(ext, behavior, resource),
            ] as GraphileBuild.BehaviorString[];
          },
        },
      },
      pgResourceUnique: {
        inferred: {
          provides: ["default"],
          before: ["inferred", "override"],
          callback(behavior, [resource, _unique]) {
            return unloggedOrTempBehaviors(
              resource.extensions,
              behavior,
              resource,
            );
          },
        },
      },
    },
    hooks: {
      init(_, build, _context) {
        const {
          inflection,
          options: { pgForbidSetofFunctionsToReturnNull },
          setGraphQLTypeForPgCodec,
        } = build;
        for (const codec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            if (!codec.attributes) {
              // Only apply to codecs that define attributes
              return;
            }
            if (codec.polymorphism) {
              // Don't build polymorphic types as objects
              return;
            }

            const tableTypeName = inflection.tableType(codec);

            const isTable = build.behavior.pgCodecMatches(codec, "table");
            if (!isTable) {
              return;
            }

            if (isTable) {
              build.registerObjectType(
                tableTypeName,
                {
                  pgCodec: codec,
                  isPgClassType: true,
                },
                () => ({
                  assertStep: assertPgClassSingleStep,
                  description: codec.description,
                }),
                `PgTablesPlugin table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["output"], tableTypeName);
            }

            if (
              !codec.isAnonymous
              // Even without the 'insert' behavior we may still need the input type
              // && build.behavior.pgCodecMatches(codec, "insert")
            ) {
              const inputTypeName = inflection.inputType(tableTypeName);
              build.registerInputObjectType(
                inputTypeName,
                {
                  pgCodec: codec,
                  isInputType: true,
                  isPgRowType: isTable,
                  isPgCompoundType: !isTable,
                },
                () => ({
                  description: `An input for mutations affecting \`${tableTypeName}\``,
                  extensions: {
                    grafast: {
                      baked: EXPORTABLE(
                        () =>
                          function baked() {
                            return Object.create(null);
                          },
                        [],
                      ),
                    },
                  },
                }),
                `PgTablesPlugin input table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["input"], inputTypeName);
            }

            if (
              !codec.isAnonymous
              // Even without the 'update' behavior we may still need the input type
              // && build.behavior.pgCodecMatches(codec, "update")
            ) {
              const patchTypeName = inflection.patchType(tableTypeName);
              build.registerInputObjectType(
                patchTypeName,
                {
                  pgCodec: codec,
                  isPgPatch: true,
                  isPgRowType: isTable,
                  isPgCompoundType: !isTable,
                },
                () => ({
                  description: `Represents an update to a \`${tableTypeName}\`. Fields that are set will be updated.`,
                  extensions: {
                    grafast: {
                      baked: EXPORTABLE(
                        () =>
                          function baked() {
                            return Object.create(null);
                          },
                        [],
                      ),
                    },
                  },
                }),
                `PgTablesPlugin patch table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["patch"], patchTypeName);
            }

            if (!codec.isAnonymous) {
              const baseTypeName = inflection.baseInputType(tableTypeName);
              build.registerInputObjectType(
                baseTypeName,
                {
                  pgCodec: codec,
                  isPgBaseInput: true,
                  isPgRowType: isTable,
                  isPgCompoundType: !isTable,
                },
                () => ({
                  description: `An input representation of \`${tableTypeName}\` with nullable fields.`,
                  extensions: {
                    grafast: {
                      baked: EXPORTABLE(
                        () =>
                          function baked() {
                            return Object.create(null);
                          },
                        [],
                      ),
                    },
                  },
                }),
                `PgTablesPlugin base table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["base"], baseTypeName);
            }

            if (
              isTable &&
              !codec.isAnonymous
              // Even without the 'connection' behavior we may still need the connection type in specific circumstances
              // && build.behavior.pgCodecMatches(codec, "*:connection")
            ) {
              // Register edges
              build.registerCursorConnection({
                typeName: tableTypeName,
                connectionTypeName: inflection.tableConnectionType(codec),
                edgeTypeName: inflection.tableEdgeType(codec),
                scope: {
                  isPgConnectionRelated: true,
                  pgCodec: codec,
                },
                nonNullNode: pgForbidSetofFunctionsToReturnNull,
              });
            }
          });
        }
        return _;
      },
    },
  },
};

function unloggedOrTempBehaviors(
  extensions:
    | Partial<DataplanPg.PgCodecExtensions>
    | Partial<DataplanPg.PgResourceExtensions>
    | undefined,
  behavior: GraphileBuild.BehaviorString,
  resource: PgResource | null,
): GraphileBuild.BehaviorString[] {
  const isUnloggedOrTemp =
    extensions?.pg?.persistence === "u" || extensions?.pg?.persistence === "t";
  return [
    ...(resource && !resource.parameters ? ["resource:select" as const] : []),
    behavior,
    ...(isUnloggedOrTemp
      ? ([
          "-resource:select",
          "-resource:connection",
          "-resource:list",
          "-resource:array",
          "-resource:single",
          "-resource:insert",
          "-resource:update",
          "-resource:delete",
        ] as const)
      : []),
  ];
}
