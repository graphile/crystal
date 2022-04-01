import "graphile-build";

import type {
  PgSource,
  PgSourceParameter,
  PgSourceRelation,
  PgTypeCodec,
  PgTypeColumns,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";

import type { PgSourceUnique } from "../../../node_modules/@dataplan/pg/src/datasource";

export interface PgTypeCodecMeta {
  typeNameBySituation: {
    [situation: string]: string;
  };
}

export type PgTypeCodecMetaLookup = Map<
  PgTypeCodec<any, any, any>,
  PgTypeCodecMeta
>;

export function makePgTypeCodecMeta(
  _codec: PgTypeCodec<any, any, any>,
): PgTypeCodecMeta {
  return {
    typeNameBySituation: {},
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

function resolveSource<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  source:
    | PgSource<TColumns, TUniques, TRelations, TParameters>
    | PgSourceBuilder<TColumns, TUniques, TParameters>,
): PgSource<TColumns, TUniques, TRelations, TParameters> {
  return source instanceof PgSourceBuilder ? source.get() : source;
}
