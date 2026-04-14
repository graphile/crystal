/**
 * Debug-only stage profiling for Crystal lifecycle phases.
 *
 * Activated by setting `GRAPHILE_STAGE_PROFILE=1` (timing + memory deltas)
 * or `GRAPHILE_STAGE_PROFILE=heap` (also forces GC between phases).
 *
 * Emits newline-delimited JSON to stderr.
 *
 * @internal
 */

const PROFILE_MODE = process.env.GRAPHILE_STAGE_PROFILE;

/** Whether profiling is enabled at all. */
export const profilingEnabled = !!PROFILE_MODE;

/** Whether forced-GC / heap mode is enabled. */
export const profilingHeapMode: boolean = PROFILE_MODE === "heap";

let seq = 0;

interface MemSnapshot {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

function memSnapshot(): MemSnapshot {
  const m = process.memoryUsage();
  return {
    rss: m.rss,
    heapUsed: m.heapUsed,
    heapTotal: m.heapTotal,
    external: m.external,
    arrayBuffers: m.arrayBuffers,
  };
}

function memDelta(before: MemSnapshot, after: MemSnapshot): MemSnapshot {
  return {
    rss: after.rss - before.rss,
    heapUsed: after.heapUsed - before.heapUsed,
    heapTotal: after.heapTotal - before.heapTotal,
    external: after.external - before.external,
    arrayBuffers: after.arrayBuffers - before.arrayBuffers,
  };
}

function emit(record: Record<string, unknown>): void {
  process.stderr.write(JSON.stringify(record) + "\n");
}

function tryGC(): void {
  if (typeof globalThis.gc === "function") {
    globalThis.gc();
  }
}

export interface PhaseHandle {
  end(): void;
}

/**
 * Mark the start of a profiling phase. Returns a handle whose `.end()` method
 * emits the corresponding end record with timing and memory deltas.
 *
 * If profiling is disabled this is a no-op that returns a dummy handle.
 */
export function phaseStart(
  phase: string,
  label?: string,
): PhaseHandle {
  if (!profilingEnabled) {
    return { end() {} };
  }

  if (profilingHeapMode) {
    tryGC();
  }

  const startSeq = ++seq;
  const startMem = memSnapshot();
  const startMs = performance.now();

  emit({
    at: new Date().toISOString(),
    label: label ?? "",
    phase,
    event: "start",
    seq: startSeq,
    ms: 0,
    mem: startMem,
  });

  return {
    end() {
      const elapsedMs = performance.now() - startMs;
      const endMem = memSnapshot();
      const delta = memDelta(startMem, endMem);

      let gcDelta: MemSnapshot | undefined;
      if (profilingHeapMode) {
        tryGC();
        const gcMem = memSnapshot();
        gcDelta = memDelta(startMem, gcMem);
      }

      const record: Record<string, unknown> = {
        at: new Date().toISOString(),
        label: label ?? "",
        phase,
        event: "end",
        seq: startSeq,
        ms: Math.round(elapsedMs * 1000) / 1000,
        mem: endMem,
        memDelta: delta,
      };
      if (gcDelta) {
        record.gcMemDelta = gcDelta;
      }
      emit(record);
    },
  };
}

/**
 * Async variant: wraps an async function so that the phase is automatically
 * ended when the promise settles.
 */
export async function profileAsync<T>(
  phase: string,
  fn: () => Promise<T>,
  label?: string,
): Promise<T> {
  const handle = phaseStart(phase, label);
  try {
    return await fn();
  } finally {
    handle.end();
  }
}
