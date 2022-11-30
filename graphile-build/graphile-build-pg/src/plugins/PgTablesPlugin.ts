import "graphile-build";

import type {
  PgSource,
  PgSourceOptions,
  PgSourceRelation,
  PgSourceUnique,
  PgTypeCodec,
  PgTypeColumn,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { ExecutableStep, object } from "grafast";
import type { PluginHook } from "graphile-config";
import { EXPORTABLE } from "graphile-export";
import type { PgClass, PgConstraint, PgNamespace } from "pg-introspection";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import { addBehaviorToTags } from "../utils.js";

type PgSourceBuilderOptions = Omit<
  PgSourceOptions<any, any, any, any>,
  "relations"
>;

declare global {
  namespace GraphileBuild {
    interface GraphileBuildSchemaOptions {
      /**
       * If true, setof functions cannot return null, so our list and
       * connection types can use GraphQLNonNull in more places.
       */
      pgForbidSetofFunctionsToReturnNull?: boolean;
    }

    interface BuildInput {
      pgSources: PgSource<any, any, any, any>[];
    }

    interface Inflection {
      /**
       * A PgSource represents a single way of getting a number of values of
       * `source.codec` type. It doesn't necessarily represent a table directly
       * (although it can) - e.g. it might be a function that returns records
       * from a table, or it could be a "sub-selection" of a table, e.g.
       * "admin_users" might be "users where admin is true".  This inflector
       * gives a name to this source, it's primarily used when naming _fields_
       * in the GraphQL schema (as opposed to `_codecName` which typically
       * names _types_.
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _sourceName(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;

      /**
       * Takes a `_sourceName` and singularizes it.
       */
      _singularizedSourceName(
        this: Inflection,
        source: PgSource<any, any, any, any>,
      ): string;

      /**
       * When you're using multiple databases and/or schemas, you may want to
       * prefix various type names/field names with an identifier for these
       * DBs/schemas.
       */
      _schemaPrefix(
        this: Inflection,
        details: {
          databaseName: string;
          pgNamespace: PgNamespace;
        },
      ): string;

      /**
       * The name of the PgSource for a table/class
       */
      tableSourceName(
        this: Inflection,
        details: {
          databaseName: string;
          pgClass: PgClass;
        },
      ): string;

      /**
       * A PgTypeCodec may represent any of a wide range of PostgreSQL types;
       * this inflector gives a name to this codec, it's primarily used when
       * naming _types_ in the GraphQL schema (as opposed to `_sourceName`
       * which typically names _fields_).
       *
       * @remarks The method beginning with `_` implies it's not ment to
       * be called directly, instead it's called from other inflectors to give
       * them common behavior.
       */
      _codecName(this: Inflection, codec: PgTypeCodec<any, any, any>): string;

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
        codec: PgTypeCodec<any, any, any>,
      ): string;

      /**
       * Appends '_record' to a name that ends in `_input`, `_patch`, `Input`
       * or `Patch` to avoid naming conflicts.
       */
      dontEndInInputOrPatch(this: Inflection, text: string): string;

      /**
       * The name of the GraphQL Object Type that's generated to represent a
       * specific table (more specifically a PostgreSQL "pg_class" which is
       * represented as a certain PgTypeCodec)
       */
      tableType(
        this: GraphileBuild.Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;

      tableConnectionType(
        this: GraphileBuild.Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;

      tableEdgeType(
        this: GraphileBuild.Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;

      patchType(this: GraphileBuild.Inflection, typeName: string): string;
      baseInputType(this: GraphileBuild.Inflection, typeName: string): string;
    }

    interface ScopeObject {
      pgCodec?: PgTypeCodec<any, any, any>;
      // TODO: rename this to isPgClassType?
      isPgTableType?: boolean;
      isPgConnectionRelated?: true;
    }
    interface ScopeObjectFieldsField {
      // TODO: put 'field' into all these names?
      pgSource?: PgSource<any, any, any, any>;
      pgFieldCodec?: PgTypeCodec<any, any, any>;
      pgColumn?: PgTypeColumn<any, any>;
      isPgFieldConnection?: boolean;
      isPgFieldSimpleCollection?: boolean;
    }
    interface ScopeInterfaceFieldsField {
      // TODO: put 'field' into all these names?
      pgSource?: PgSource<any, any, any, any>;
      pgFieldCodec?: PgTypeCodec<any, any, any>;
      pgColumn?: PgTypeColumn<any, any>;
      isPgFieldConnection?: boolean;
      isPgFieldSimpleCollection?: boolean;
    }
  }
}

declare global {
  namespace GraphileConfig {
    type PgTablesPluginSourceRelations = {
      [identifier: string]: PgSourceRelation<any, any>;
    };

    interface GatherHelpers {
      pgTables: {
        getSourceBuilder(
          databaseName: string,
          pgClass: PgClass,
        ): Promise<PgSourceBuilder<any, any, any> | null>;
        getSource(
          sourceBuilder: PgSourceBuilder<any, any, any>,
        ): Promise<PgSource<any, any, any, any> | null>;
      };
    }

    interface GatherHooks {
      pgTables_PgSourceBuilder_relations: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          sourceBuilder: PgSourceBuilder<any, any, any>;
          relations: PgTablesPluginSourceRelations;
        }) => Promise<void> | void
      >;
      pgTables_PgSource: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          source: PgSource<any, any, any>;
          relations: PgTablesPluginSourceRelations;
        }) => Promise<void> | void
      >;
      pgTables_PgSourceBuilder_options: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          options: PgSourceBuilderOptions;
        }) => void | Promise<void>
      >;
      pgTables_unique: PluginHook<
        (event: {
          databaseName: string;
          pgClass: PgClass;
          pgConstraint: PgConstraint;
          unique: PgSourceUnique;
        }) => void | Promise<void>
      >;
    }
  }
}

interface State {
  sourceBuilderByPgClassByDatabase: Map<
    string,
    Map<PgClass, Promise<PgSourceBuilder<any, any, any> | null>>
  >;
  sourceBySourceBuilder: Map<
    PgSourceBuilder<any, any, any>,
    Promise<PgSource<any, any, any, any> | null>
  >;
  detailsBySourceBuilder: Map<
    PgSourceBuilder<any, any, any>,
    { databaseName: string; pgClass: PgClass }
  >;
}
interface Cache {}

// TODO: rename to "PgClassesPlugin"? This coverse more than just tables.
export const PgTablesPlugin: GraphileConfig.Plugin = {
  name: "PgTablesPlugin",
  description:
    "Spots pg_class entries that looks like tables/views/materialized views (but not partitions!) and registers them as sources",
  version: version,
  after: ["PgIntrospectionPlugin"],

  inflection: {
    add: {
      _schemaPrefix(options, { pgNamespace, databaseName }) {
        const database = options.pgSources?.find(
          (db) => db.name === databaseName,
        );
        const databasePrefix =
          databaseName === database?.name ? "" : `${databaseName}-`;
        const schemaPrefix =
          pgNamespace.nspname === database?.schemas?.[0]
            ? ""
            : `${pgNamespace.nspname}-`;
        return `${databasePrefix}${schemaPrefix}`;
      },

      tableSourceName(options, { pgClass, databaseName }) {
        const typeTags = pgClass.getType()!.getTagsAndDescription().tags;
        const classTags = pgClass.getTagsAndDescription().tags;
        if (typeof typeTags?.name === "string") {
          return typeTags.name;
        }
        if (typeof classTags?.name === "string") {
          return classTags.name;
        }
        const pgNamespace = pgClass.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ pgNamespace, databaseName });
        return this.camelCase(`${schemaPrefix}${pgClass.relname}`);
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

      _sourceName(options, source) {
        return this.coerceToGraphQLName(
          source.extensions?.tags?.name ?? source.name,
        );
      },

      _singularizedSourceName(options, source) {
        return this.dontEndInInputOrPatch(
          this.singularize(this._sourceName(source)),
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

  gather: {
    namespace: "pgTables",
    helpers: {
      getSource(info, sourceBuilder) {
        let source = info.state.sourceBySourceBuilder.get(sourceBuilder);
        if (source) {
          return source;
        }
        source = (async () => {
          const relations: GraphileConfig.PgTablesPluginSourceRelations = {};
          const { pgClass, databaseName } =
            info.state.detailsBySourceBuilder.get(sourceBuilder)!;
          await info.process("pgTables_PgSourceBuilder_relations", {
            sourceBuilder,
            pgClass,
            relations,
            databaseName,
          });
          const source = EXPORTABLE(
            (relations, sourceBuilder) => sourceBuilder.build({ relations }),
            [relations, sourceBuilder],
          );
          return source;
        })();
        info.state.sourceBySourceBuilder.set(sourceBuilder, source);
        return source;
      },
      getSourceBuilder(info, databaseName, pgClass) {
        let sourceBuilderByPgClass =
          info.state.sourceBuilderByPgClassByDatabase.get(databaseName);
        if (!sourceBuilderByPgClass) {
          sourceBuilderByPgClass = new Map();
          info.state.sourceBuilderByPgClassByDatabase.set(
            databaseName,
            sourceBuilderByPgClass,
          );
        }
        let sourceBuilder = sourceBuilderByPgClass.get(pgClass);
        if (sourceBuilder) {
          return sourceBuilder;
        }
        sourceBuilder = (async () => {
          const database = info.resolvedPreset.pgSources?.find(
            (db) => db.name === databaseName,
          );
          if (!database) {
            throw new Error(`Could not find '${databaseName}' in 'pgSources'`);
          }
          const schemas = database.schemas ?? ["public"];

          const namespace = pgClass.getNamespace();
          if (!namespace) {
            return null;
          }

          if (!schemas.includes(namespace.nspname)) {
            return null;
          }

          // TODO: better support for partitioned tables
          // TODO: check compatibility with 'foreign' tables
          if (
            !["r", "v", "m", "f", "p", "c"].includes(pgClass.relkind) ||
            pgClass.relispartition
          ) {
            return null;
          }

          const attributes =
            await info.helpers.pgIntrospection.getAttributesForClass(
              databaseName,
              pgClass._id,
            );

          const codec = await info.helpers.pgCodecs.getCodecFromClass(
            databaseName,
            pgClass._id,
          );
          if (!codec) {
            return null;
          }

          const directConstraints =
            await info.helpers.pgIntrospection.getConstraintsForClass(
              databaseName,
              pgClass._id,
            );

          const inheritance =
            await info.helpers.pgIntrospection.getInheritedForClass(
              databaseName,
              pgClass._id,
            );

          const inheritedConstraints = await Promise.all(
            inheritance.map((inh) => {
              return info.helpers.pgIntrospection.getConstraintsForClass(
                databaseName,
                inh.inhparent,
              );
            }),
          );
          const constraints = [
            // TODO: handle multiple inheritance
            ...inheritedConstraints.flatMap((list) => list),
            ...directConstraints,
          ];
          const uniqueColumnOnlyConstraints = constraints.filter(
            (c) =>
              ["u", "p"].includes(c.contype) && c.conkey?.every((k) => k > 0),
          );
          const idx = uniqueColumnOnlyConstraints.findIndex(
            (c) => c.contype === "p",
          );

          if (idx > 0) {
            // Primary key was found, but wasn't in initial position; let's
            // move it to the front
            uniqueColumnOnlyConstraints.unshift(
              ...uniqueColumnOnlyConstraints.splice(idx, 1),
            );
          }

          const uniques = await Promise.all(
            uniqueColumnOnlyConstraints.map(async (pgConstraint) => {
              const unique: PgSourceUnique = {
                isPrimary: pgConstraint.contype === "p",
                columns: pgConstraint.conkey!.map(
                  (k) => attributes.find((att) => att.attnum === k)!.attname,
                ),
              };
              await info.process("pgTables_unique", {
                databaseName,
                pgClass,
                pgConstraint,
                unique,
              });
              return unique;
            }),
          );

          const executor =
            info.helpers.pgIntrospection.getExecutorForDatabase(databaseName);
          const name = info.inflection.tableSourceName({
            databaseName,
            pgClass,
          });
          const identifier = `${databaseName}.${namespace.nspname}.${pgClass.relname}`;

          const { tags } = pgClass.getTagsAndDescription();

          const mask = pgClass.updatable_mask ?? 2 ** 8 - 1;
          const isInsertable = mask & (1 << 3);
          const isUpdatable = mask & (1 << 2);
          const isDeletable = mask & (1 << 4);
          if (!isInsertable) {
            addBehaviorToTags(tags, "-insert");
          }
          if (!isUpdatable) {
            addBehaviorToTags(tags, "-update");
          }
          if (!isDeletable) {
            addBehaviorToTags(tags, "-delete");
          }

          const options: PgSourceBuilderOptions = {
            executor,
            name,
            identifier,
            source: codec.sqlType,
            codec,
            uniques,
            isVirtual: !["r", "v", "m", "f", "p"].includes(pgClass.relkind),
            extensions: {
              tags: {
                ...tags,
                originalName: pgClass.relname,
              },
            },
          };

          await info.process("pgTables_PgSourceBuilder_options", {
            databaseName,
            pgClass,
            options,
          });

          const sourceBuilder = EXPORTABLE(
            (PgSourceBuilder, options) => new PgSourceBuilder(options),
            [PgSourceBuilder, options],
          );
          info.state.detailsBySourceBuilder.set(sourceBuilder, {
            databaseName,
            pgClass,
          });

          return sourceBuilder;
        })();
        sourceBuilderByPgClass.set(pgClass, sourceBuilder);
        return sourceBuilder;
      },
    },
    initialState: () => ({
      sourceBuilderByPgClassByDatabase: new Map(),
      sourceBySourceBuilder: new Map(),
      detailsBySourceBuilder: new Map(),
    }),
    hooks: {
      async pgIntrospection_class({ helpers }, event) {
        const { entity: pgClass, databaseName } = event;
        helpers.pgTables.getSourceBuilder(databaseName, pgClass);
      },
    },

    async main(output, info) {
      if (!output.pgSources) {
        output.pgSources = [];
      }
      const toProcess: Array<{
        source: PgSource<any, any, any, any>;
        pgClass: PgClass;
        databaseName: string;
      }> = [];
      for (const [
        databaseName,
        sourceBuilderByPgClass,
      ] of info.state.sourceBuilderByPgClassByDatabase.entries()) {
        for (const [
          pgClass,
          sourceBuilderPromise,
        ] of sourceBuilderByPgClass.entries()) {
          const sourceBuilder = await sourceBuilderPromise;
          if (!sourceBuilder) {
            continue;
          }
          const source = await info.helpers.pgTables.getSource(sourceBuilder);
          if (source && !source.isVirtual) {
            output.pgSources!.push(source);
          }
          if (source) {
            toProcess.push({ source, pgClass, databaseName });
          }
        }
      }

      for (const entry of toProcess) {
        await info.process("pgTables_PgSource", {
          ...entry,
          relations: entry.source.getRelations(),
        });
      }
    },
  } as GraphileConfig.PluginGatherConfig<"pgTables", State, Cache>,

  schema: {
    hooks: {
      init(_, build, _context) {
        const {
          inflection,
          options: { pgForbidSetofFunctionsToReturnNull, simpleCollections },
          setGraphQLTypeForPgCodec,
        } = build;
        for (const codec of build.pgCodecMetaLookup.keys()) {
          build.recoverable(null, () => {
            if (!codec.columns) {
              // Only apply to codecs that define columns
              return;
            }
            if (codec.polymorphism) {
              // Don't build polymorphic types as objects
              return;
            }

            const tableTypeName = inflection.tableType(codec);
            const behavior = getBehavior(codec.extensions);
            const defaultBehavior = [
              "select",
              "table",
              ...(!codec.isAnonymous ? ["insert", "update"] : []),
              ...(simpleCollections === "both"
                ? ["connection", "list"]
                : simpleCollections === "only"
                ? ["list"]
                : ["connection"]),
            ].join(" ");

            const isTable = build.behavior.matches(
              behavior,
              "table",
              defaultBehavior,
            );
            if (!isTable) {
              return;
            }

            const selectable = build.behavior.matches(
              behavior,
              "select",
              defaultBehavior,
            );

            if (selectable) {
              build.registerObjectType(
                tableTypeName,
                {
                  pgCodec: codec,
                  isPgTableType: true,
                },
                // TODO: we actually allow a number of different plans; should we make this an array? See: PgClassSingleStep
                ExecutableStep, // PgClassSingleStep<any, any, any, any>
                () => ({
                  description: codec.extensions?.description,
                }),
                `PgTablesPlugin table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["output"], tableTypeName);
            }

            if (
              !codec.isAnonymous
              // Even without the 'insert' behavior we may still need the input type
              // && build.behavior.matches(behavior, "insert", defaultBehavior)
            ) {
              const inputTypeName = inflection.inputType(tableTypeName);
              build.registerInputObjectType(
                inputTypeName,
                {
                  pgCodec: codec,
                  isInputType: true,
                  isPgRowType: selectable,
                  isPgCompoundType: !selectable,
                },
                () => ({
                  description: `An input for mutations affecting \`${tableTypeName}\``,
                  extensions: {
                    graphile: {
                      inputPlan() {
                        return object({});
                      },
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
              // && build.behavior.matches(behavior, "update", defaultBehavior)
            ) {
              const patchTypeName = inflection.patchType(tableTypeName);
              build.registerInputObjectType(
                patchTypeName,
                {
                  pgCodec: codec,
                  isPgPatch: true,
                  isPgRowType: selectable,
                  isPgCompoundType: !selectable,
                },
                () => ({
                  description: `Represents an update to a \`${tableTypeName}\`. Fields that are set will be updated.`,
                  extensions: {
                    graphile: {
                      inputPlan() {
                        return object({});
                      },
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
                  isPgRowType: selectable,
                  isPgCompoundType: !selectable,
                },
                () => ({
                  description: `An input representation of \`${tableTypeName}\` with nullable fields.`,
                  extensions: {
                    graphile: {
                      inputPlan() {
                        return object({});
                      },
                    },
                  },
                }),
                `PgTablesPlugin base table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["base"], baseTypeName);
            }

            if (
              !codec.isAnonymous
              // Even without the 'connection' behavior we may still need the connection type in specific circumstances
              // && build.behavior.matches(behavior, "*:connection", defaultBehavior)
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
