import type { PgCodec, PgCodecAnyScalar, PgCodecAttribute, PgEnumCodec, PgRecordTypeCodecSpec } from "@dataplan/pg";
import type { PgAttribute, PgClass, PgType } from "pg-introspection";
declare global {
    namespace GraphileBuild {
        interface Inflection {
            classCodecName(details: {
                pgClass: PgClass;
                serviceName: string;
            }): string;
            typeCodecName(details: {
                pgType: PgType;
                serviceName: string;
            }): string;
            scalarCodecTypeName(this: Inflection, codec: PgCodecAnyScalar): string;
            enumType(this: Inflection, codec: PgEnumCodec<string, any>): string;
            enumValue(this: Inflection, value: string, codec: PgEnumCodec<string, any>): string;
            rangeBoundType(input: {
                codec: PgCodecAnyScalar;
                underlyingTypeName: string;
            }): string;
            rangeType(input: {
                codec: PgCodecAnyScalar;
                underlyingTypeName: string;
            }): string;
        }
        interface Build {
            allPgCodecs: Set<PgCodec>;
        }
        interface ScopeObject {
            isPgRangeType?: boolean;
            isPgRangeBoundType?: boolean;
        }
        interface ScopeInputObject {
            isPgRangeInputType?: boolean;
            isPgRangeBoundInputType?: boolean;
            pgCodec?: PgCodec;
        }
    }
    namespace GraphileConfig {
        interface Plugins {
            PgCodecsPlugin: true;
        }
        interface Provides {
            PgCodecs: true;
        }
        interface GatherHelpers {
            pgCodecs: {
                getCodecFromClass(serviceName: string, pgClassId: string): Promise<PgCodec | null>;
                getCodecFromType(serviceName: string, pgTypeId: string, pgTypeModifier?: string | number | null): Promise<PgCodec | null>;
            };
        }
        interface GatherHooks {
            pgCodecs_findPgCodec(event: {
                serviceName: string;
                pgCodec: PgCodec | null;
                pgType: PgType;
                typeModifier: string | number | null | undefined;
            }): Promise<void> | void;
            pgCodecs_PgCodec(event: {
                serviceName: string;
                pgCodec: PgCodec;
                pgClass?: PgClass;
                pgType: PgType;
            }): Promise<void> | void;
            pgCodecs_attribute(event: {
                serviceName: string;
                pgClass: PgClass;
                pgAttribute: PgAttribute;
                attribute: PgCodecAttribute<any>;
            }): Promise<void> | void;
            pgCodecs_recordType_spec(event: {
                serviceName: string;
                pgClass: PgClass;
                spec: PgRecordTypeCodecSpec<string, any>;
            }): Promise<void> | void;
            pgCodecs_enumType_extensions(event: {
                serviceName: string;
                pgType: PgType;
                extensions: any;
            }): Promise<void> | void;
            pgCodecs_rangeOfCodec_extensions(event: {
                serviceName: string;
                pgType: PgType;
                innerCodec: PgCodec;
                extensions: any;
            }): Promise<void> | void;
            pgCodecs_domainOfCodec_extensions(event: {
                serviceName: string;
                pgType: PgType;
                innerCodec: PgCodec;
                extensions: any;
            }): Promise<void> | void;
            pgCodecs_listOfCodec_extensions(event: {
                serviceName: string;
                pgType: PgType;
                innerCodec: PgCodec;
                extensions: any;
            }): Promise<void> | void;
        }
    }
    namespace DataplanPg {
        interface PgCodecRelationExtensions {
            originalName?: string;
        }
        interface PgCodecAttributeExtensions {
            /** Checks capabilities of this attribute to see if INSERT is even possible */
            isInsertable?: boolean;
            /** Checks capabilities of this attribute to see if UPDATE is even possible */
            isUpdatable?: boolean;
        }
    }
}
export declare const PgCodecsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgCodecsPlugin.d.ts.map