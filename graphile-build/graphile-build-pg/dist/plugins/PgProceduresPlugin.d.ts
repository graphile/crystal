import type { PgFunctionResourceOptions, PgResourceOptions } from "@dataplan/pg";
import type { PgProc } from "pg-introspection";
declare global {
    namespace GraphileBuild {
        interface BehaviorStrings {
            "resource:connection:backwards": true;
        }
        interface Inflection {
            functionResourceName(this: Inflection, details: {
                serviceName: string;
                pgProc: PgProc;
            }): string;
            functionRecordReturnCodecName(this: Inflection, details: {
                serviceName: string;
                pgProc: PgProc;
            }): string;
        }
        interface GatherOptions {
            /**
             * If true, we'll treat all arguments that don't have defaults as being
             * required.
             */
            pgStrictFunctions?: boolean;
        }
    }
    namespace DataplanPg {
        interface PgCodecAttributeExtensions {
            argIndex?: number;
            argName?: string;
        }
    }
    namespace GraphileConfig {
        interface Plugins {
            PgProceduresPlugin: true;
        }
        interface GatherHelpers {
            pgProcedures: {
                getResourceOptions(serviceName: string, pgProc: PgProc): Promise<PgResourceOptions | null>;
            };
        }
        interface GatherHooks {
            pgProcedures_functionResourceOptions(event: {
                serviceName: string;
                pgProc: PgProc;
                baseResourceOptions: Pick<PgResourceOptions, "codec" | "executor"> & Partial<Omit<PgResourceOptions, "codec" | "executor">>;
                functionResourceOptions: PgFunctionResourceOptions;
            }): void | Promise<void>;
            pgProcedures_PgResourceOptions(event: {
                serviceName: string;
                pgProc: PgProc;
                resourceOptions: PgResourceOptions;
            }): void | Promise<void>;
        }
    }
}
export declare const PgProceduresPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgProceduresPlugin.d.ts.map