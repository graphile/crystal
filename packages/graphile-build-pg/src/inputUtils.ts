import "graphile-build";

import type {
  PgSource,
  PgSourceColumns,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";

export interface PgTypeCodecMeta {
  typeNameByVariant: {
    [variant: string]: string;
  };
}

export type PgTypeCodecMetaLookup = Map<
  PgTypeCodec<any, any, any>,
  PgTypeCodecMeta
>;

function makePgTypeCodecMeta(
  _codec: PgTypeCodec<any, any, any>,
): PgTypeCodecMeta {
  return {
    typeNameByVariant: {},
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
  input: GraphileEngine.BuildInput,
): PgTypeCodecMetaLookup {
  const metaLookup: PgTypeCodecMetaLookup = new Map();
  const seenSources = new Set<PgSource<any, any, any, any>>();
  for (const source of input.pgSources) {
    walkSource(resolveSource(source), metaLookup, seenSources);
  }
  return metaLookup;
}

/**
 * @internal
 */
function walkSource(
  source: PgSource<any, any, any, any>,
  metaLookup: PgTypeCodecMetaLookup,
  seenSources: Set<PgSource<any, any, any, any>>,
): void {
  if (seenSources.has(source)) {
    return;
  }
  seenSources.add(source);
  if (!metaLookup.has(source.codec)) {
    walkCodec(source.codec, metaLookup);
  }
  const relations = source.getRelations();
  if (relations) {
    for (const relationshipName in relations) {
      walkSource(
        resolveSource(relations[relationshipName].source),
        metaLookup,
        seenSources,
      );
    }
  }
}

/**
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
}

function resolveSource<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends { [key: string]: any } | never = never,
>(
  source:
    | PgSource<TColumns, TUniques, TRelations, TParameters>
    | PgSourceBuilder<TColumns, TUniques, TParameters>,
): PgSource<TColumns, TUniques, TRelations, TParameters> {
  return source instanceof PgSourceBuilder ? source.get() : source;
}
