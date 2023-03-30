import "graphile-build";

import type { PgCodec, PgCodecRelation, PgResource } from "@dataplan/pg";

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
export type PgCodecMetaLookup = Map<PgCodec<any, any, any>, PgCodecMeta>;

/**
 * Creates an empty meta object for the given codec.
 */
export function makePgCodecMeta(_codec: PgCodec<any, any, any>): PgCodecMeta {
  return {
    typeNameBySituation: Object.create(null),
  };
}

/**
 * Given the input object, this function walks through all the pgResources and
 * all their codecs and relations and extracts the full set of reachable
 * codecs.
 *
 * Memoized for performance, using a WeakMap.
 */
export function getCodecMetaLookupFromInput(
  input: GraphileBuild.BuildInput,
): PgCodecMetaLookup {
  const metaLookup: PgCodecMetaLookup = new Map();
  const seenResources = new Set<PgResource<any, any, any, any, any>>();
  for (const codec of Object.values(input.pgRegistry.pgCodecs)) {
    walkCodec(codec, metaLookup);
  }
  for (const source of Object.values(input.pgRegistry.pgResources)) {
    walkResource(source, metaLookup, seenResources);
  }
  return metaLookup;
}

/**
 * Walks the given source's codecs/relations and pushes all discovered codecs
 * into `metaLookup`
 *
 * @internal
 */
function walkResource(
  resource: PgResource<any, any, any, any, any>,
  metaLookup: PgCodecMetaLookup,
  seenResources: Set<PgResource<any, any, any, any, any>>,
): void {
  if (seenResources.has(resource)) {
    return;
  }
  seenResources.add(resource);
  if (!metaLookup.has(resource.codec)) {
    walkCodec(resource.codec, metaLookup);
  }
  const relations = resource.getRelations() as {
    [relationName: string]: PgCodecRelation<any, any>;
  };
  if (relations) {
    for (const relationshipName in relations) {
      walkResource(
        relations[relationshipName].remoteResource,
        metaLookup,
        seenResources,
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
  codec: PgCodec<any, any, any>,
  metaLookup: PgCodecMetaLookup,
): void {
  if (metaLookup.has(codec)) {
    return;
  }
  metaLookup.set(codec, makePgCodecMeta(codec));
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
