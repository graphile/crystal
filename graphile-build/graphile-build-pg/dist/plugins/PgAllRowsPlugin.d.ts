import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgResource } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgAllRowsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "query:resource:connection": true;
            "query:resource:list": true;
        }
        interface Inflection {
            /**
             * The base inflector used by `allRowsConnection` and `allRowsList`.
             */
            _allRows(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            /**
             * The field name for a Cursor Connection field that returns all rows
             * from the given resource.
             */
            allRowsConnection(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
            /**
             * The field name for a List field that returns all rows from the given
             * resource.
             */
            allRowsList(this: Inflection, resource: PgResource<any, any, any, any, any>): string;
        }
    }
}
export declare const PgAllRowsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgAllRowsPlugin.d.ts.map