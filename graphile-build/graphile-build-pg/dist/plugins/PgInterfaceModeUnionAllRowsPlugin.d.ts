import "graphile-config";
import type { PgCodec } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgInterfaceModeUnionAllRowsPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "query:interface:connection": true;
            "query:interface:list": true;
        }
        interface Inflection {
            /**
             * The base inflector used by allInterfaceModeUnionRowsConnection and
             * allInterfaceModeUnionRowsList.
             */
            _allInterfaceModeUnionRows(this: Inflection, codec: PgCodec): string;
            /**
             * The field name for a Cursor Connection field that returns all rows
             * from the given `@interface mode:union` codec.
             */
            allInterfaceModeUnionRowsConnection(this: Inflection, codec: PgCodec): string;
            /**
             * The field name for a List field that returns all rows from the given
             * `@interface mode:union` codec.
             */
            allInterfaceModeUnionRowsList(this: Inflection, codec: PgCodec): string;
        }
    }
}
export declare const PgInterfaceModeUnionAllRowsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgInterfaceModeUnionAllRowsPlugin.d.ts.map