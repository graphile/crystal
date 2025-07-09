import type { PgCodec, PgCodecAttribute, PgResource, PgResourceOptions, PgResourceUnique } from "@dataplan/pg";
import type { PgClass, PgConstraint, PgNamespace } from "pg-introspection";
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
            _resourceName(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            /**
             * Takes a `_sourceName` and singularizes it.
             */
            _singularizedResourceName(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            /**
             * When you're using multiple databases and/or schemas, you may want to
             * prefix various type names/field names with an identifier for these
             * DBs/schemas.
             */
            _schemaPrefix(this: Inflection, details: {
                serviceName: string;
                pgNamespace: PgNamespace;
            }): string;
            /**
             * The name of the PgResource for a table/class
             */
            tableResourceName(this: Inflection, details: {
                serviceName: string;
                pgClass: PgClass;
            }): string;
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
            _codecName(this: Inflection, codec: PgCodec<any, any, any, any, any, any, any>): string;
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
            _singularizedCodecName(this: Inflection, codec: PgCodec<any, any, any, any, any, any, any>): string;
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
            tableType(this: GraphileBuild.Inflection, codec: PgCodec<any, any, any, any, any, any, any>): string;
            tableConnectionType(this: GraphileBuild.Inflection, codec: PgCodec<any, any, any, any, any, any, any>): string;
            tableEdgeType(this: GraphileBuild.Inflection, codec: PgCodec<any, any, any, any, any, any, any>): string;
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
                getResourceOptions(serviceName: string, pgClass: PgClass): Promise<PgResourceOptions | null>;
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
export declare const PgTablesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgTablesPlugin.d.ts.map