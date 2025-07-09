import "graphile-config";
import "./PgCodecsPlugin.js";
import "./PgProceduresPlugin.js";
import "./PgRelationsPlugin.js";
import "./PgTablesPlugin.js";
import type { PgCodec, PgCodecPolymorphism, PgCodecPolymorphismSingleTypeAttributeSpec, PgResource } from "@dataplan/pg";
import type { ExecutableStep, Maybe } from "grafast";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgPolymorphismPlugin: true;
        }
        interface GatherHelpers {
            pgPolymorphism: Record<string, never>;
        }
    }
    namespace GraphileBuild {
        interface Build {
            pgResourcesByPolymorphicTypeName: {
                [polymorphicTypeName: string]: {
                    resources: PgResource[];
                    type: "union" | "interface";
                };
            };
            pgCodecByPolymorphicUnionModeTypeName: {
                [polymorphicTypeName: string]: PgCodec;
            };
            nodeIdHelpersForCodec(codec: PgCodec<any, any, any, any, any, any, any>): {
                getSpec: ($nodeId: ExecutableStep<Maybe<string>>) => {
                    [key: string]: ExecutableStep<any>;
                };
                getIdentifiers: (nodeId: Maybe<string>) => null | readonly any[];
            } | null;
            nodeIdSpecForCodec(codec: PgCodec<any, any, any, any, any, any, any>): (($nodeId: ExecutableStep<Maybe<string>>) => {
                [key: string]: ExecutableStep<any>;
            }) | null;
        }
        interface ScopeInterface {
            pgCodec?: PgCodec<any, any, any, any, any, any, any>;
            isPgPolymorphicTableType?: boolean;
            pgPolymorphism?: PgCodecPolymorphism<string>;
        }
        interface ScopeObject {
            pgPolymorphism?: PgCodecPolymorphism<string>;
            pgPolymorphicSingleTableType?: {
                typeIdentifier: string;
                name: string;
                attributes: ReadonlyArray<PgCodecPolymorphismSingleTypeAttributeSpec>;
            };
            pgPolymorphicRelationalType?: {
                typeIdentifier: string;
                name: string;
            };
            isPgUnionMemberUnionConnection?: boolean;
        }
        interface ScopeEnum {
            pgPolymorphicSingleTableType?: {
                typeIdentifier: string;
                name: string;
                attributes: ReadonlyArray<PgCodecPolymorphismSingleTypeAttributeSpec>;
            };
        }
        interface ScopeUnion {
            isPgUnionMemberUnion?: boolean;
        }
    }
    namespace DataplanPg {
        interface PgCodecExtensions {
            relationalInterfaceCodecName?: string;
        }
    }
}
export declare const PgPolymorphismPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgPolymorphismPlugin.d.ts.map