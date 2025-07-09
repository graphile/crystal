import type { PgCodec, PgCodecPolymorphismRelationalTypeSpec } from "@dataplan/pg";
import type { GraphileConfig } from "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgPolymorphismOnlyArgumentPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            pgPolymorphismEnumType(pgCodec: PgCodec): string;
            pgPolymorphismOnlyArgument(pgCodec: PgCodec): string;
        }
        interface ScopeEnum {
            pgPolymorphismEnumForInterfaceSpec?: Build["pgResourcesByPolymorphicTypeName"] extends Record<any, infer U> ? U : never;
            pgPolymorphismEnumForRelationalTypes?: {
                [typeKey: string]: PgCodecPolymorphismRelationalTypeSpec;
            };
        }
    }
}
export declare const PgPolymorphismOnlyArgumentPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgPolymorphismOnlyArgumentPlugin.d.ts.map