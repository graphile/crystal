import "graphile-build";

import type {
  PgSource,
  PgSourceColumns,
  PgSourceRelation,
  PgTypeCodec,
} from "@dataplan/pg";
import { PgSourceBuilder } from "@dataplan/pg";

const getCodecsFromInputMemo = new WeakMap<
  GraphileEngine.BuildInput,
  PgTypeCodec<any, any, any>[]
>();

/**
 * Given the input object, this function walks through all the pgSources and
 * all their codecs and relations and extracts the full set of reachable
 * codecs.
 *
 * Memoized for performance, using a WeakMap.
 */
export function getCodecsFromInput(
  input: GraphileEngine.BuildInput,
): PgTypeCodec<any, any, any>[] {
  const cached = getCodecsFromInputMemo.get(input);
  if (cached) {
    return cached;
  }
  const codecs = new Set<PgTypeCodec<any, any, any>>();
  const seenSources = new Set<PgSource<any, any, any, any>>();
  for (const source of input.pgSources) {
    walkSource(resolveSource(source), codecs, seenSources);
  }
  const result = [...codecs];
  getCodecsFromInputMemo.set(input, result);
  return result;
}

/**
 * @internal
 */
function walkSource(
  source: PgSource<any, any, any, any>,
  codecs: Set<PgTypeCodec<any, any, any>>,
  seenSources: Set<PgSource<any, any, any, any>>,
): void {
  if (seenSources.has(source)) {
    return;
  }
  seenSources.add(source);
  if (!codecs.has(source.codec)) {
    walkCodec(source.codec, codecs);
  }
  const relations = source.getRelations();
  if (relations) {
    for (const relationshipName in relations) {
      walkSource(
        resolveSource(relations[relationshipName].source),
        codecs,
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
  codecs: Set<PgTypeCodec<any, any, any>>,
): void {
  if (codecs.has(codec)) {
    return;
  }
  codecs.add(codec);
  if (codec.columns) {
    for (const columnName in codec.columns) {
      walkCodec(codec.columns[columnName].codec, codecs);
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
