import type { PgRefDefinition, PgRefDefinitions } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgRefsPlugin: true;
        }
        interface GatherHelpers {
            pgRefs: Record<string, never>;
        }
    }
    namespace GraphileBuild {
        interface Inflection {
            refSingle(this: Inflection, details: {
                refDefinition: PgRefDefinition;
                identifier: string;
            }): string;
            refList(this: Inflection, details: {
                refDefinition: PgRefDefinition;
                identifier: string;
            }): string;
            refConnection(this: Inflection, details: {
                refDefinition: PgRefDefinition;
                identifier: string;
            }): string;
        }
    }
    namespace DataplanPg {
        interface PgCodecExtensions {
            /**
             * References between codecs (cannot be implemented directly, but sources
             * may implement them).
             */
            refDefinitions?: PgRefDefinitions;
        }
        interface PgRefDefinitionExtensions {
            /** @experimental Need to define its own TypeScript type. */
            tags?: {
                behavior?: string | string[];
            };
            via?: string;
        }
    }
}
export declare const PgRefsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRefsPlugin.d.ts.map