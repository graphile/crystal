import "graphile-build";

import type { PgSource, PgSourceRelation, PgTypeCodec } from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";
import { ExecutablePlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import type { Plugin, PluginGatherConfig, PluginHook } from "graphile-plugin";
import type { PgClass, PgNamespace } from "pg-introspection";

import { getBehavior } from "../behavior";
import { version } from "../index";

declare global {
  namespace GraphileEngine {
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
       * The name of the GraphQL Object Type that's generated to represent a
       * specific table (more specifically a PostgreSQL "pg_class" which is
       * represented as a certain PgTypeCodec)
       */
      tableType(
        this: GraphileEngine.Inflection,
        codec: PgTypeCodec<any, any, any>,
      ): string;

      patchType(this: GraphileEngine.Inflection, typeName: string): string;
    }

    interface ScopeGraphQLObjectType {
      pgCodec?: PgTypeCodec<any, any, any>;
      // TODO: rename this to isPgClassType?
      isPgTableType?: boolean;
      isPgConnectionRelated?: true;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      pgSource?: PgSource<any, any, any, any>;
      isPgFieldConnection?: boolean;
      isPgFieldSimpleCollection?: boolean;
    }
  }
}

type PgSourceRelations = {
  [identifier: string]: PgSourceRelation<any, any>;
};

declare module "graphile-plugin" {
  /** @notExported */
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

  /** @notExported */
  interface GatherHooks {
    pgTables_PgSourceBuilder_relations: PluginHook<
      (event: {
        sourceBuilder: PgSourceBuilder<any, any, any>;
        pgClass: PgClass;
        databaseName: string;
        relations: PgSourceRelations;
      }) => Promise<void>
    >;
    pgTables_PgSource: PluginHook<
      (event: {
        source: PgSource<any, any, any, any>;
        pgClass: PgClass;
        databaseName: string;
      }) => Promise<void>
    >;
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
export const PgTablesPlugin: Plugin = {
  name: "PgTablesPlugin",
  description:
    "Spots pg_class entries that looks like tables/views/materialized views (but not partitions!) and registers them as sources",
  version: version,

  inflection: {
    add: {
      _schemaPrefix(options, { pgNamespace, databaseName }) {
        const database = options.gather?.pgDatabases.find(
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
        const pgNamespace = pgClass.getNamespace()!;
        const schemaPrefix = this._schemaPrefix({ pgNamespace, databaseName });
        return this.camelCase(`${schemaPrefix}${pgClass.relname}`);
      },

      _codecName(options, codec) {
        return this.coerceToGraphQLName(codec.name);
      },

      _singularizedCodecName(options, codec) {
        return this.singularize(this._codecName(codec)).replace(
          /.(?:(?:[_-]i|I)nput|(?:[_-]p|P)atch)$/,
          "$&_record",
        );
      },

      tableType(options, codec) {
        return this.upperCamelCase(this._singularizedCodecName(codec));
      },

      patchType(options, typeName) {
        return this.upperCamelCase(`${typeName}-patch`);
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
          const relations: PgSourceRelations = {};
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
          await info.process("pgTables_PgSource", {
            source,
            pgClass,
            databaseName,
          });
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
          const database = info.options.pgDatabases.find(
            (db) => db.name === databaseName,
          )!;
          const schemas = database.schemas;

          const namespace = pgClass.getNamespace();
          if (!namespace) {
            return null;
          }

          if (!schemas.includes(namespace.nspname)) {
            return null;
          }

          if (
            !["r", "v", "m", "p", "c"].includes(pgClass.relkind) ||
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

          const constraints =
            await info.helpers.pgIntrospection.getConstraintsForClass(
              databaseName,
              pgClass._id,
            );
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

          const uniques = uniqueColumnOnlyConstraints.map((c) => ({
            isPrimary: c.contype === "p",
            columns: c.conkey!.map(
              (k) => attributes.find((att) => att.attnum === k)!.attname,
            ),
            extensions: {},
          }));

          const executor =
            info.helpers.pgIntrospection.getExecutorForDatabase(databaseName);
          const name = info.inflection.tableSourceName({
            databaseName,
            pgClass,
          });
          const identifier = `${databaseName}.${namespace.nspname}.${pgClass.relname}`;

          const sourceBuilder = EXPORTABLE(
            (PgSourceBuilder, codec, executor, identifier, name, uniques) =>
              new PgSourceBuilder({
                executor,
                name,
                identifier,
                source: codec.sqlType,
                codec,
                uniques,
                extensions: {
                  tags: {
                    // TODO
                  },
                },
              }),
            [PgSourceBuilder, codec, executor, identifier, name, uniques],
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
      for (const [
        ,
        sourceBuilderByPgClass,
      ] of info.state.sourceBuilderByPgClassByDatabase.entries()) {
        for (const [
          ,
          sourceBuilderPromise,
        ] of sourceBuilderByPgClass.entries()) {
          const sourceBuilder = await sourceBuilderPromise;
          if (!sourceBuilder) {
            continue;
          }
          const source = await info.helpers.pgTables.getSource(sourceBuilder);
          if (source) {
            output.pgSources!.push(source);
          }
        }
      }
    },
  } as PluginGatherConfig<"pgTables", State, Cache>,

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

            const tableTypeName = inflection.tableType(codec);
            const behavior = getBehavior(codec.extensions) ?? [
              "selectable",
              ...(!codec.isAnonymous ? ["insert", "update"] : []),
              ...(simpleCollections === "both"
                ? ["connection", "list"]
                : simpleCollections === "only"
                ? ["list"]
                : ["connection"]),
            ];
            // TODO: is 'selectable' the right behavior? What if you can only see
            // it in a subscription? What if only on a mutation payload? More
            // like "viewable"?
            const selectable = !behavior || behavior.includes("selectable");
            if (selectable) {
              build.registerObjectType(
                tableTypeName,
                {
                  pgCodec: codec,
                  isPgTableType: true,
                },
                // TODO: we actually allow a number of different plans; should we make this an array? See: PgClassSinglePlan
                ExecutablePlan, // PgClassSinglePlan<any, any, any, any>
                () => ({}),
                `PgTablesPlugin table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["output"], tableTypeName);
            }

            if (
              (!behavior && !codec.isAnonymous) ||
              behavior?.includes("insert")
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
                () => ({}),
                `PgTablesPlugin input table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["input"], inputTypeName);
            }

            if (
              (!behavior && !codec.isAnonymous) ||
              behavior?.includes("update")
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
                () => ({}),
                `PgTablesPlugin patch table type for ${codec.name}`,
              );
              setGraphQLTypeForPgCodec(codec, ["patch"], patchTypeName);
            }

            if (!behavior || behavior.includes("connection")) {
              // Register edges
              build.registerCursorConnection({
                typeName: tableTypeName,
                scope: {
                  isPgConnectionRelated: true,
                  pgCodec: codec,
                },
                nonNullNode: !pgForbidSetofFunctionsToReturnNull,
              });
            }
          });
        }
        return _;
      },
    },
  },
};
