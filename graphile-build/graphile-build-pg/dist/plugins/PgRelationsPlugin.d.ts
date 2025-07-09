import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodecRef, PgCodecRelationConfig, PgCodecWithAttributes, PgRegistry, PgResourceOptions } from "@dataplan/pg";
import type { PgAttribute, PgClass, PgConstraint } from "pg-introspection";
declare global {
    namespace GraphileBuild {
        interface BehaviorStrings {
            "singularRelation:resource:single": true;
            "singularRelation:resource:list": true;
            "singularRelation:resource:connection": true;
            "manyRelation:resource:list": true;
            "manyRelation:resource:connection": true;
        }
        interface SchemaOptions {
            pgMutationPayloadRelations?: boolean;
        }
        interface PgRelationsPluginRelationDetails {
            registry: PgRegistry;
            codec: PgCodecWithAttributes;
            relationName: string;
        }
        interface PgRelationsPluginRefDetails {
            registry: PgRegistry;
            codec: PgCodecWithAttributes;
            ref: PgCodecRef;
        }
        interface ScopeObjectFieldsField {
            isPgSingleRelationField?: boolean;
            isPgManyRelationConnectionField?: boolean;
            isPgManyRelationListField?: boolean;
            pgRelationDetails?: PgRelationsPluginRelationDetails;
            /** @experimental */
            pgRefDetails?: PgRelationsPluginRefDetails;
        }
        interface Inflection {
            resourceRelationName(this: Inflection, details: {
                serviceName: string;
                pgConstraint: PgConstraint;
                localClass: PgClass;
                localAttributes: PgAttribute[];
                foreignClass: PgClass;
                foreignAttributes: PgAttribute[];
                isUnique: boolean;
                isReferencee: boolean;
            }): string;
            _singleRelationRaw(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            singleRelation(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            _singleRelationBackwardsRaw(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            singleRelationBackwards(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            _manyRelationRaw(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            _manyRelation(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            manyRelationConnection(this: Inflection, details: PgRelationsPluginRelationDetails): string;
            manyRelationList(this: Inflection, details: PgRelationsPluginRelationDetails): string;
        }
    }
    namespace DataplanPg {
        interface PgCodecRelationExtensions {
            /** The (singular) forward relation name */
            fieldName?: string;
            /** The (singular) backward relation name for a FK against a unique combo */
            foreignSingleFieldName?: string;
            /** The (plural) backward relation name for a FK when exposed as a list (rather than a connection) */
            foreignSimpleFieldName?: string;
            /** The (generally plural) backward relation name, also used as a fallback from foreignSimpleFieldName, foreignSingleFieldName */
            foreignFieldName?: string;
        }
    }
    namespace GraphileConfig {
        interface Plugins {
            PgRelationsPlugin: true;
        }
        interface GatherHelpers {
            pgRelations: {
                addRelation(event: {
                    pgClass: PgClass;
                    serviceName: string;
                    resourceOptions: PgResourceOptions;
                }, pgConstraint: PgConstraint, isReferencee?: boolean): Promise<void>;
            };
        }
        interface GatherHooks {
            pgRelations_relation(event: {
                serviceName: string;
                pgClass: PgClass;
                pgConstraint: PgConstraint;
                relation: PgCodecRelationConfig;
            }): Promise<void> | void;
        }
    }
}
export declare const PgRelationsPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRelationsPlugin.d.ts.map