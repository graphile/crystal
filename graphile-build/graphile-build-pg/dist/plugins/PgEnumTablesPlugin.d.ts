import type { PgEnumCodec } from "@dataplan/pg";
import type { Introspection, PgAttribute, PgClass, PgConstraint } from "pg-introspection";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgEnumTablesPlugin: true;
        }
        interface GatherHelpers {
            pgEnumTables: {
                isEnumConstraint(pgConstraint: PgConstraint): boolean;
                getIntrospectionData(serviceName: string, pgClass: PgClass, attributes: PgAttribute[]): Promise<readonly Record<string, string>[]>;
                processIntrospection(event: {
                    serviceName: string;
                    introspection: Introspection;
                }): Promise<void>;
                enumCodecForConstraint(pgConstraint: PgConstraint): PgEnumCodec<string, string> | undefined;
            };
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            /**
             * Name of the _GraphQL enum_ used to represent an enum table in the
             * schema.
             */
            enumTableEnum(this: Inflection, details: {
                serviceName: string;
                pgClass: PgClass;
                pgConstraint: PgConstraint;
            }): string;
            /**
             * Name of the _codec_ used to represent an enum table as an enum. You
             * probably want `enumTableEnum` instead.
             */
            enumTableCodec(this: Inflection, details: {
                serviceName: string;
                pgClass: PgClass;
                pgConstraint: PgConstraint;
            }): string;
        }
    }
}
export declare const PgEnumTablesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgEnumTablesPlugin.d.ts.map