import "graphile-build";

import type { PgCodecRelation, PgResource, PgTypeCodec } from "@dataplan/pg";

/**
 * Metadata for a specific PgTypeCodec
 */
export interface PgTypeCodecMeta {
  /**
   * Given a `situation` such as 'input', 'output', 'patch', etc. returns the
   * name of the GraphQL type to use for this PgTypeCodec.
   */
  typeNameBySituation: {
    [situation: string]: string;
  };
}

/**
 * A map from PgTypeCodec to its associated metadata.
 */
export type PgTypeCodecMetaLookup = Map<
  PgTypeCodec<any, any, any>,
  PgTypeCodecMeta
>;

/**
 * Creates an empty meta object for the given codec.
 */
export function makePgTypeCodecMeta(
  _codec: PgTypeCodec<any, any, any>,
): PgTypeCodecMeta {
  return {
    typeNameBySituation: Object.create(null),
  };
}

/**
 * Given the input object, this function walks through all the pgSources and
 * all their codecs and relations and extracts the full set of reachable
 * codecs.
 *
 * Memoized for performance, using a WeakMap.
 */
export function getCodecMetaLookupFromInput(
  input: GraphileBuild.BuildInput,
): PgTypeCodecMetaLookup {
  const metaLookup: PgTypeCodecMetaLookup = new Map();
  const seenSources = new Set<PgResource<any, any, any, any, any>>();
  for (const codec of Object.values(input.pgRegistry.pgCodecs)) {
    walkCodec(codec, metaLookup);
  }
  for (const source of Object.values(input.pgRegistry.pgSources)) {
    walkSource(source, metaLookup, seenSources);
  }
  return metaLookup;
}

/**
 * Walks the given source's codecs/relations and pushes all discovered codecs
 * into `metaLookup`
 *
 * @internal
 */
function walkSource(
  source: PgResource<any, any, any, any, any>,
  metaLookup: PgTypeCodecMetaLookup,
  seenSources: Set<PgResource<any, any, any, any, any>>,
): void {
  if (seenSources.has(source)) {
    return;
  }
  seenSources.add(source);
  if (!metaLookup.has(source.codec)) {
    walkCodec(source.codec, metaLookup);
  }
  const relations = source.getRelations() as {
    [relationName: string]: PgCodecRelation<any, any>;
  };
  if (relations) {
    for (const relationshipName in relations) {
      walkSource(
        relations[relationshipName].remoteSource,
        metaLookup,
        seenSources,
      );
    }
  }
}

/**
 * Adds the given codec to `metaLookup` and also walks the related codecs (for
 * columns, and inner-codecs).
 *
 * @internal
 */
function walkCodec(
  codec: PgTypeCodec<any, any, any>,
  metaLookup: PgTypeCodecMetaLookup,
): void {
  if (metaLookup.has(codec)) {
    return;
  }
  metaLookup.set(codec, makePgTypeCodecMeta(codec));
  if (codec.columns) {
    for (const columnName in codec.columns) {
      walkCodec(codec.columns[columnName].codec, metaLookup);
    }
  }
  if (codec.arrayOfCodec) {
    walkCodec(codec.arrayOfCodec, metaLookup);
  }
  if (codec.domainOfCodec) {
    walkCodec(codec.domainOfCodec, metaLookup);
  }
  if (codec.rangeOfCodec) {
    walkCodec(codec.rangeOfCodec, metaLookup);
  }
}
