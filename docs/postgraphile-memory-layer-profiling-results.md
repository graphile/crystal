# PostGraphile Memory Layer Profiling — Results

## Test Environment

- **Node.js**: v22.12.0 (with `--expose-gc`)
- **PostgreSQL**: 14
- **Profiling mode**: `GRAPHILE_STAGE_PROFILE=heap` (forced GC between phases)
- **Iterations**: 5 full PostGraphile lifecycles
- **Schema**: 5 tables, 2 functions, foreign-key relations, seed data
  (realistic small-to-medium schema producing 97 GraphQL types)

## Results Table

| Layer | Avg Init Time | P95 Init Time | Avg Retained Heap | Peak Retained Heap | Reusable Boundary Today |
| --- | --- | --- | --- | --- | --- |
| makeSchema (total) | 290.9 ms | 329.0 ms | 3.06 MB | 4.78 MB | Yes |
| makeSchema.resolvePreset | 2.3 ms | 4.2 ms | 4.2 KB (post-GC) | 9.2 KB (post-GC) | Yes — pure, stateless |
| buildInflection | 0.8 ms | 1.6 ms | 30.2 KB (post-GC) | 64.7 KB (post-GC) | Yes — pure, stateless |
| gather | 62.2 ms | 79.4 ms | 1.88 MB (post-GC) | 2.48 MB (post-GC) | Yes — input to buildSchema |
| buildSchema | 84.4 ms | 135.8 ms | 1.13 MB (post-GC) | 2.18 MB (post-GC) | Yes — produces GraphQLSchema |
| postgraphile() wrapper | 102.6 ms | 114.2 ms | 81.2 KB (post-GC) | 205.2 KB (post-GC) | Yes — mostly references |
| postgraphile.createServ | 95.9 ms | 101.3 ms | 12.4 KB (post-GC) | 39.5 KB (post-GC) | No — single-use today |
| grafserv.constructor | 59.7 ms | 64.7 ms | 8.6 KB (post-GC) | 30.8 KB (post-GC) | No — coupled to schema |
| grafserv.setPreset | 142.4 ms | 148.9 ms | ~0 (negative, GC reclaimed) | 14.7 KB (post-GC) | Shell — cheap to recreate |
| grafserv.setSchema | 34.8 ms | 40.3 ms | 1.2 KB (post-GC) | 2.2 KB (post-GC) | Shell — cheap to recreate |
| grafserv.refreshHandlers | 0.1 ms | 0.4 ms | 0.7 KB (post-GC) | 2.8 KB (post-GC) | Shell — cheap to recreate |
| postgraphile.release | 0.1 ms | 0.2 ms | 1.2 KB (post-GC) | 2.0 KB (post-GC) | N/A |

> "Retained Heap" values use post-GC deltas where available, showing
> true retained memory rather than transient allocations.

## Analysis by Research Question

### 1. Which phase contributes the most wall-clock initialization time?

**`makeSchema` dominates at ~291 ms average** (P95: 329 ms), comprising:

- `gather`: ~62 ms (21%) — database introspection, plugin state init
- `buildSchema`: ~84 ms (29%) — GraphQL type construction and plugin hooks
- Overhead (resolvePreset + buildInflection): ~3 ms (1%)

Outside `makeSchema`, `grafserv.setPreset` is surprisingly expensive at
~142 ms, but this runs asynchronously after the constructor returns and
its cost is middleware resolution, not schema work.

The `postgraphile()` wrapper itself is ~103 ms, but this is measured
before `makeSchema` completes (it returns synchronously while schema
builds asynchronously). Its direct contribution is minimal.

### 2. Which phase contributes the most retained memory?

**`gather` and `buildSchema` are the heaviest retained-memory phases.**

After forced GC:

- `gather` retains ~1.9 MB (post-GC average) — this is the
  introspection result, plugin state, and `BuildInput` objects.
- `buildSchema` retains ~1.1 MB (post-GC average) — the
  `GraphQLSchema` object with all its types, fields, and plan resolvers.
- Combined `makeSchema` retains ~3.1 MB (post-GC average).

Everything below `makeSchema` in the stack is negligible:

- `postgraphile()` wrapper: ~81 KB (mostly references to the above)
- `grafserv` constructor + handlers: < 15 KB each
- `setPreset` actually shows *negative* delta (GC reclaims intermediate
  objects from preset resolution)

### 3. Is there a layer boundary that is both expensive and reusable?

**Yes: the `SchemaResult` (output of `makeSchema`) is the clear
cache-splitting boundary.**

Evidence:

- **Cost**: ~291 ms init time + ~3.1 MB retained memory per instance
- **Independence**: `SchemaResult` contains `{ schema, resolvedPreset }`
  which are pure data objects with no runtime side effects or mutable
  external state
- **Stability**: For a given preset + database schema fingerprint, the
  `SchemaResult` is deterministic and safe to reuse

The `resolvePreset` and `buildInflection` phases are also safe to cache
but contribute negligible cost (~3 ms, ~34 KB), so caching them
independently provides minimal benefit.

### 4. Which parts are effectively "shell" and not worth caching?

**Everything below `makeSchema` is shell:**

| Phase | Time | Memory | Verdict |
| --- | --- | --- | --- |
| `postgraphile()` wrapper | ~103 ms | ~81 KB | Shell — just wires schema to serv |
| `createServ` / `grafserv.constructor` | ~96 ms / ~60 ms | < 15 KB | Shell — instantiation cost |
| `grafserv.setPreset` | ~142 ms | ~0 | Shell — middleware setup, GC-reclaimable |
| `grafserv.setSchema` | ~35 ms | ~1 KB | Shell — validation + handler wiring |
| `grafserv.refreshHandlers` | < 1 ms | < 1 KB | Shell — trivial |
| `postgraphile.release` | < 1 ms | < 1 KB | Teardown — trivial |

These phases are cheap enough to recreate on every request or tenant
switch, especially compared to the ~291 ms `makeSchema` cost.

## Conclusions

1. **`makeSchema` is the expensive core.** It accounts for virtually all
   meaningful initialization time (~291 ms) and retained memory (~3 MB).
   Within it, `gather` (database introspection) and `buildSchema`
   (GraphQL construction) are the two dominant sub-phases.

2. **`SchemaResult` is the natural cache boundary.** It is:
   - expensive to produce (291 ms, 3 MB)
   - deterministic for a given preset + DB schema
   - a clean data object with no lifecycle coupling

3. **Everything else is shell.** The `postgraphile()` wrapper,
   `createServ`, and `grafserv` setup collectively add ~200 ms of
   wall-clock time but retain almost no memory. They exist to wire the
   cached core to a live HTTP handler and can be recreated cheaply.

4. **Current API constraint**: `createServ()` is single-use per
   `PostGraphileInstance`. To support cache splitting in production, the
   API would need to allow either:
   - multiple `createServ()` calls per instance, or
   - a way to inject a pre-built `SchemaResult` into a new
     `PostGraphileInstance` without re-running `makeSchema`

5. **Recommended next step**: Prototype a `PostGraphileInstance` variant
   that accepts an existing `SchemaResult` (or a cache lookup function)
   instead of always calling `makeSchema`. This would let applications
   like Constructive cache `SchemaResult` per tenant/schema fingerprint
   and only pay the shell cost (~200 ms, < 100 KB) on cache hits.

## Methodology Notes

- All measurements used `--expose-gc` with `GRAPHILE_STAGE_PROFILE=heap`
  to force garbage collection between phases, yielding true retained
  memory rather than transient allocation noise.
- Each iteration created a fresh `postgraphile()` instance, built the
  schema, created a grafserv instance, waited for ready, then released.
- The test schema (5 tables, 2 functions, FK relations) is intentionally
  modest. Production schemas with hundreds of tables would show
  proportionally larger `gather` and `buildSchema` costs, strengthening
  the case for caching `SchemaResult`.
- Raw NDJSON data is available in
  `docs/postgraphile-memory-layer-profiling-raw.ndjson`.
- Machine-readable summary is in
  `docs/postgraphile-memory-layer-profiling-summary.json`.
