import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodec, PgCodecRelation, PgCodecWithAttributes, PgRefDefinition, PgResource, PgResourceUnique } from "@dataplan/pg";
import type { GraphQLType } from "grafast/graphql";
import type { SQL } from "pg-sql2";
import type sql from "pg-sql2";
import { getBehavior } from "../behavior.js";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgBasicsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BuildVersions {
            "graphile-build-pg": string;
            "@dataplan/pg": string;
        }
        interface BehaviorStrings {
            select: true;
            insert: true;
            update: true;
            delete: true;
            base: true;
            filter: true;
            filterBy: true;
            order: true;
            orderBy: true;
            "resource:connection": true;
            "resource:list": true;
            "resource:array": true;
            "resource:single": true;
        }
        type HasGraphQLTypeForPgCodec = (codec: PgCodec<any, any, any, any, any, any, any>, situation?: string) => boolean;
        type GetGraphQLTypeByPgCodec = (codec: PgCodec<any, any, any, any, any, any, any>, situation: string) => GraphQLType | null;
        type GetGraphQLTypeNameByPgCodec = (codec: PgCodec<any, any, any, any, any, any, any>, situation: string) => string | null;
        type SetGraphQLTypeForPgCodec = (codec: PgCodec<any, any, any, any, any, any, any>, situations: string | string[], typeName: string) => void;
        interface Build {
            /**
             * A copy of `import * from "@dataplan/pg"` so that plugins don't need to
             * import it directly.
             */
            dataplanPg: typeof import("@dataplan/pg");
            /**
             * Do we already have a GraphQL type to use for the given codec in the
             * given situation?
             */
            hasGraphQLTypeForPgCodec: HasGraphQLTypeForPgCodec;
            /**
             * Get the GraphQL type for the given codec in the given situation.
             */
            getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
            /**
             * Get the GraphQL type name (string) for the given codec in the given
             * situation.
             */
            getGraphQLTypeNameByPgCodec: GetGraphQLTypeNameByPgCodec;
            /**
             * Set the GraphQL type to use for the given codec in the given
             * situation. If this has already been set, will throw an error.
             */
            setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec;
            /**
             * pg-sql2 access on Build to avoid duplicate module issues.
             */
            sql: typeof sql;
            pgGetBehavior: typeof getBehavior;
            /**
             * Get a table-like resource for the given codec, assuming exactly one exists.
             */
            pgTableResource<TCodec extends PgCodecWithAttributes>(codec: TCodec, strict?: boolean): PgResource<string, TCodec, ReadonlyArray<PgResourceUnique>, undefined> | null;
        }
        interface BehaviorEntities {
            pgCodec: PgCodec;
            pgCodecAttribute: [codec: PgCodecWithAttributes, attributeName: string];
            pgResource: PgResource<any, any, any, any, any>;
            pgResourceUnique: [
                resource: PgResource<any, any, any, any, any>,
                unique: PgResourceUnique
            ];
            pgCodecRelation: PgCodecRelation;
            pgCodecRef: [codec: PgCodec, refName: string];
            pgRefDefinition: PgRefDefinition;
        }
        interface GatherOptions {
            /** Set to 'unqualified' to omit the schema name from table, function, and type identifiers */
            pgIdentifiers?: "qualified" | "unqualified";
        }
    }
    namespace GraphileConfig {
        interface GatherHelpers {
            pgBasics: {
                /**
                 * Create an SQL identifier from the given parts; skipping the very
                 * first part (schema) if pgIdentifiers is set to 'unqualified'
                 */
                identifier(...parts: string[]): SQL;
            };
        }
    }
}
export declare const PgBasicsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgBasicsPlugin.d.ts.map