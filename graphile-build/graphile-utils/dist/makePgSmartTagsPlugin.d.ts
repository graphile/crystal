import type { PgAttribute, PgClass, PgConstraint, PgNamespace, PgProc, PgType } from "graphile-build-pg/pg-introspection";
type PromiseOrDirect<T> = Promise<T> | T;
type ThunkOrDirect<T> = (() => T) | T;
type PgEntityByKind = {
    class: PgClass;
    attribute: PgAttribute;
    constraint: PgConstraint;
    procedure: PgProc;
    type: PgType;
    namespace: PgNamespace;
};
type PgSmartTagSupportedKinds = keyof PgEntityByKind;
type PgEntity = PgEntityByKind[PgSmartTagSupportedKinds];
export type PgSmartTagFilterFunction<TEntity extends PgEntity> = (input: TEntity) => boolean;
export type PgSmartTagTags = {
    [tagName: string]: null | true | string | string[];
};
export interface PgSmartTagRule<TKind extends PgSmartTagSupportedKinds = PgSmartTagSupportedKinds> {
    serviceName?: string;
    kind: TKind;
    match: string | PgSmartTagFilterFunction<PgEntityByKind[TKind]>;
    tags?: PgSmartTagTags;
    description?: string;
}
export type UpdatePgSmartTagRulesCallback = (ruleOrRules: PgSmartTagRule | PgSmartTagRule[] | null) => void;
export type SubscribeToPgSmartTagUpdatesCallback = (cb: UpdatePgSmartTagRulesCallback | null) => PromiseOrDirect<void>;
export declare function makePgSmartTagsPlugin(initialRules: ThunkOrDirect<PromiseOrDirect<PgSmartTagRule | PgSmartTagRule[] | null>>, subscribeToUpdatesCallback?: SubscribeToPgSmartTagUpdatesCallback | null, details?: {
    name?: string;
    description?: string;
    version?: string;
}): GraphileConfig.Plugin;
/**
 * JSON (or JSON5) description of the tags to add to various entities, e.g.
 *
 * ```js
 * {
 *   version: 1,
 *   tags: {
 *     class: {
 *       my_table: {
 *         tags: {omit: "create,update,delete"},
 *         description: "You can overwrite the description too",
 *         attribute: {
 *           my_private_field: {tags: {omit: true}}
 *         },
 *         constraint: {
 *           my_constraint: {tags: {omit: true}}
 *         }
 *       },
 *       "my_schema.myOtherTable": {
 *         description: "If necessary, add your schema to the table name to prevent multiple being matched"
 *       }
 *     },
 *     procedure: {
 *       "my_schema.my_function_name": {
 *         tags: {sortable: true, filterable: true}
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type JSONPgSmartTags = {
    version: 1;
    config: {
        [kind in PgSmartTagSupportedKinds]?: {
            [identifier: string]: {
                tags?: PgSmartTagTags;
                description?: string;
                attribute?: {
                    [attributeName: string]: {
                        tags?: PgSmartTagTags;
                        description?: string;
                    };
                };
                constraint?: {
                    [constraintName: string]: {
                        tags?: PgSmartTagTags;
                        description?: string;
                    };
                };
            };
        };
    };
};
export declare function pgSmartTagRulesFromJSON(json: JSONPgSmartTags | null): PgSmartTagRule[];
export type UpdateJSONPgSmartTagsCallback = (json: JSONPgSmartTags | null) => void;
export type SubscribeToJSONPgSmartTagsUpdatesCallback = (cb: UpdateJSONPgSmartTagsCallback | null) => void | Promise<void>;
export declare function makeJSONPgSmartTagsPlugin(jsonOrThunk: ThunkOrDirect<PromiseOrDirect<JSONPgSmartTags | null>>, subscribeToJSONUpdatesCallback?: SubscribeToJSONPgSmartTagsUpdatesCallback | null, details?: {
    name?: string;
    description?: string;
    version?: string;
}): GraphileConfig.Plugin;
export declare const makePgSmartTagsFromFilePlugin: (tagsFile?: string, name?: keyof GraphileConfig.Plugins) => GraphileConfig.Plugin;
export declare const TagsFilePlugin: GraphileConfig.Plugin;
declare global {
    namespace GraphileConfig {
        interface Plugins {
            TagsFilePlugin: true;
        }
    }
}
export {};
//# sourceMappingURL=makePgSmartTagsPlugin.d.ts.map