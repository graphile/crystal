import "./PgTablesPlugin.js";
import "graphile-config";
import type { PgCodec, PgCodecAttribute, PgCodecWithAttributes } from "@dataplan/pg";
import type { GraphQLOutputType } from "grafast/graphql";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgAttributesPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            "condition:attribute:filterBy": true;
            "attribute:select": true;
            "attribute:base": true;
            "attribute:insert": true;
            "attribute:update": true;
            "attribute:filterBy": true;
            "attribute:orderBy": true;
        }
        interface Build {
            pgResolveOutputType(codec: PgCodec, notNull?: boolean): [baseCodec: PgCodec, resolvedType: GraphQLOutputType] | null;
        }
        interface Inflection {
            /**
             * Given a attributeName on a PgCodec's attributes, should return the field
             * name to use to represent this attribute (both for input and output).
             *
             * @remarks The method beginning with `_` implies it's not ment to
             * be called directly, instead it's called from other inflectors to give
             * them common behavior.
             */
            _attributeName(this: GraphileBuild.Inflection, details: {
                codec: PgCodecWithAttributes;
                attributeName: string;
                skipRowId?: boolean;
            }): string;
            /**
             * Takes a codec and the list of attribute names from that codec and turns
             * it into a joined list.
             */
            _joinAttributeNames(this: GraphileBuild.Inflection, codec: PgCodecWithAttributes, names: readonly string[]): string;
            /**
             * The field name for a given attribute on that pg_class' table type. May
             * also be used in other places (e.g. the Input or Patch type associated
             * with the table).
             */
            attribute(this: GraphileBuild.Inflection, details: {
                attributeName: string;
                codec: PgCodecWithAttributes;
            }): string;
        }
        interface ScopeInputObject {
            isInputType?: boolean;
            isPgPatch?: boolean;
            isPgBaseInput?: boolean;
            isPgRowType?: boolean;
            isPgCompoundType?: boolean;
            pgAttribute?: PgCodecAttribute;
        }
    }
}
export declare const PgAttributesPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgAttributesPlugin.d.ts.map