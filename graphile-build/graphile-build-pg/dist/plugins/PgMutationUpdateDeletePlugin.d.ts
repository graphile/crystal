import "graphile-config";
import type { PgResource, PgResourceUnique } from "@dataplan/pg";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgMutationUpdateDeletePlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "constraint:resource:update": true;
            "constraint:resource:delete": true;
            "nodeId:resource:update": true;
            "nodeId:resource:delete": true;
            "update:resource:select": true;
            "delete:resource:nodeId": true;
            "delete:resource:select": true;
        }
        interface ScopeObject {
            isPgUpdatePayloadType?: boolean;
            isPgDeletePayloadType?: boolean;
            pgTypeResource?: PgResource<any, any, any, any, any>;
        }
        interface ScopeObjectFieldsField {
            isPgMutationPayloadDeletedNodeIdField?: boolean;
        }
        interface ScopeInputObject {
            isPgUpdateInputType?: boolean;
            isPgUpdateByKeysInputType?: boolean;
            isPgUpdateNodeInputType?: boolean;
            isPgDeleteInputType?: boolean;
            isPgDeleteByKeysInputType?: boolean;
            isPgDeleteNodeInputType?: boolean;
            pgResource?: PgResource<any, any, any, any, any>;
            pgResourceUnique?: PgResourceUnique;
        }
        interface Inflection {
            updatePayloadType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
            }): string;
            deletePayloadType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
            }): string;
            updateNodeField(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            updateNodeInputType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            deletedNodeId(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
            }): string;
            deleteNodeField(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            deleteNodeInputType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            updateByKeysField(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            updateByKeysInputType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            deleteByKeysField(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            deleteByKeysInputType(this: Inflection, details: {
                resource: PgResource<any, any, any, any, any>;
                unique: PgResourceUnique;
            }): string;
            patchField(this: Inflection, fieldName: string): string;
        }
    }
}
export declare const PgMutationUpdateDeletePlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgMutationUpdateDeletePlugin.d.ts.map