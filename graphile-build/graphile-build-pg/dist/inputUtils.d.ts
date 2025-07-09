import "graphile-build";
import type { PgCodec } from "@dataplan/pg";
/**
 * Metadata for a specific PgCodec
 */
export interface PgCodecMeta {
    /**
     * Given a `situation` such as 'input', 'output', 'patch', etc. returns the
     * name of the GraphQL type to use for this PgCodec.
     */
    typeNameBySituation: {
        [situation: string]: string;
    };
}
/**
 * A map from PgCodec to its associated metadata.
 */
export type PgCodecMetaLookup = Map<PgCodec, PgCodecMeta>;
/**
 * Creates an empty meta object for the given codec.
 */
export declare function makePgCodecMeta(_codec: PgCodec): PgCodecMeta;
/**
 * Given the input object, this function walks through all the pgResources and
 * all their codecs and relations and extracts the full set of reachable
 * codecs.
 *
 * Memoized for performance, using a WeakMap.
 */
export declare function getCodecMetaLookupFromInput(input: GraphileBuild.BuildInput): PgCodecMetaLookup;
//# sourceMappingURL=inputUtils.d.ts.map