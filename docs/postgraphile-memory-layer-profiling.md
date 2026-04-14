# PostGraphile Memory Layer Profiling

## Purpose

We want to understand whether a PostGraphile instance can be split into:

- a smaller reusable "core" that is expensive to initialize, and
- a lighter "runtime shell" that can be recreated on demand

The immediate motivation is multi-tenant caching. Today, an application such as Constructive keeps full PostGraphile instances in memory to preserve low latency. This works for latency, but it increases memory footprint. Before changing cache design, we need data from Crystal itself.

This document defines how to measure:

- which layer takes the most initialization time
- which layer retains the most memory
- which layer has a clean reuse boundary

This investigation should not assume the answer in advance.

## Research Questions

1. Which phase of `postgraphile(...)` contributes the most wall-clock initialization time?
2. Which phase contributes the most retained memory?
3. Is there a layer boundary that is both:
   - expensive enough to keep cached
   - independent enough to be safely reused
4. Which parts are effectively "shell" and therefore not worth caching?

## Scope

The initial scope is limited to the main lifecycle inside Crystal:

- preset resolution
- schema construction
- grafserv creation
- grafserv runtime initialization

Application-level concerns such as request routing, tenant selection, and cache eviction policy are intentionally out of scope for this document.

## Candidate Layers

The current lifecycle suggests the following measurement boundaries.

### Layer 1: Preset Resolution

Relevant code:

- `/Users/zeta/Projects/interweb/src/agents/crystal/postgraphile/postgraphile/src/index.ts`
- `/Users/zeta/Projects/interweb/src/agents/crystal/graphile-build/graphile-build/src/index.ts`

Main operations:

- `resolvePreset(preset)`
- `buildInflection(resolvedPreset)`

Questions:

- Is preset resolution materially expensive?
- Does it retain meaningful memory?
- Can it be safely reused across repeated builds for the same tenant/schema fingerprint?

### Layer 2: Schema Construction

Relevant code:

- `/Users/zeta/Projects/interweb/src/agents/crystal/graphile-build/graphile-build/src/index.ts`

Main operations:

- `gather(resolvedPreset, shared)`
- `buildSchema(resolvedPreset, input, shared)`
- `makeSchema(preset)`
- `watchSchema(...)`

Questions:

- How much time is spent in `gather` versus `buildSchema`?
- How much memory is retained by the resulting `SchemaResult` and `GraphQLSchema`?
- Is this the real "core" that should be cached?

### Layer 3: PostGraphile Instance Assembly

Relevant code:

- `/Users/zeta/Projects/interweb/src/agents/crystal/postgraphile/postgraphile/src/index.ts`

Main operations:

- `postgraphile(preset)`
- storage of `resolvedPreset`
- storage of `schemaResult`

Questions:

- How much memory belongs to the `PostGraphileInstance` wrapper itself?
- Is this layer mostly references to heavier objects from lower layers?

### Layer 4: Grafserv Creation

Relevant code:

- `/Users/zeta/Projects/interweb/src/agents/crystal/postgraphile/postgraphile/src/index.ts`
- `/Users/zeta/Projects/interweb/src/agents/crystal/grafast/grafserv/src/core/base.ts`

Main operations:

- `createServ(grafserv)`
- `new grafserv({ preset, schema })`

Questions:

- What is the time and memory delta of creating a serv from an existing core?
- Is this layer cheap enough to recreate every time?
- Is it structurally reusable?

Important current constraint:

- `createServ()` is currently single-use per `PostGraphileInstance`

That means this is a likely reuse boundary in theory, but not yet in the current API.

### Layer 5: Runtime Handler Initialization

Relevant code:

- `/Users/zeta/Projects/interweb/src/agents/crystal/grafast/grafserv/src/core/base.ts`

Main operations:

- constructor setup
- `setPreset(...)`
- `setSchema(...)`
- `refreshHandlers()`
- `ready()`

Questions:

- Is runtime handler setup materially expensive?
- Does it retain meaningful memory?
- Is it only shell?

## Instrumentation Strategy

Instrumentation should be added behind a debug-only environment flag, for example:

- `GRAPHILE_STAGE_PROFILE=1`

Optional stronger mode:

- `GRAPHILE_STAGE_PROFILE=heap`

In profile mode, Crystal should emit newline-delimited JSON logs.

## Log Format

Each record should have a stable structure:

```json
{
  "at": "2026-04-07T12:34:56.789Z",
  "label": "tenant-or-schema-fingerprint",
  "phase": "makeSchema.gather",
  "event": "start",
  "seq": 12,
  "ms": 0,
  "mem": {
    "rss": 0,
    "heapUsed": 0,
    "heapTotal": 0,
    "external": 0,
    "arrayBuffers": 0
  }
}
```

For end events, include:

- `ms`
- `memDelta`
- `gcMemDelta` if forced GC is available

Suggested extra fields:

- `instanceId`
- `schemaFingerprint`
- `watchMode`
- `phaseStatus`

## What To Measure Per Phase

For each layer, capture:

1. Start timestamp
2. End timestamp
3. `process.memoryUsage()` before and after
4. Optional `global.gc?.()` before and after in controlled test runs
5. Optional heap snapshot path in "heap" mode

The main per-phase output should be:

- elapsed time
- raw memory delta
- post-GC memory delta

## Phase Boundaries To Instrument

### In `graphile-build/src/index.ts`

Instrument:

- `resolvePreset`
- `buildInflection`
- `gather`
- `buildSchema`
- total `makeSchema`

This is the most important file for identifying the expensive core.

### In `postgraphile/src/index.ts`

Instrument:

- total `postgraphile(...)`
- `makeSchema` or `watchSchema` handoff
- `createServ(...)`
- `release()`

This identifies how much cost belongs to the outer wrapper versus the schema core.

### In `grafserv/src/core/base.ts`

Instrument:

- constructor
- `setPreset(...)`
- `setSchema(...)`
- `refreshHandlers()`
- `ready()`

This identifies whether runtime/handler setup is materially heavy.

## How To Judge Reusability

Logging alone cannot prove reusability. We need two checks:

1. Cost profile
2. Lifecycle/API boundary

A layer is a realistic reuse candidate only if:

- it has meaningful init cost or retained memory
- and it can be independently held and reattached without violating lifecycle guarantees

Current expectations should not be treated as conclusions. The API boundary must be read from code and validated in experiments.

Examples:

- `SchemaResult` may be a reuse candidate if it is both heavy and stable
- `createServ()` is a boundary, but currently single-use
- handler refresh logic may be cheap enough to ignore even if technically separable

## Controlled Test Procedure

1. Build Crystal with instrumentation enabled.
2. Point Constructive to the local Crystal fork.
3. Run a controlled 10-minute pressure test.
4. Collect:
   - Crystal stage logs
   - process memory samples
   - request latency summary
   - heap snapshots if enabled
5. Aggregate by:
   - phase
   - tenant/schema fingerprint
   - cache hit versus cache miss paths

## Output We Want From The First Round

The first round should produce a table like this:

| Layer | Avg Init Time | P95 Init Time | Avg Retained Heap | Peak Retained Heap | Reusable Boundary Today |
| --- | --- | --- | --- | --- | --- |
| resolvePreset | | | | | |
| buildInflection | | | | | |
| gather | | | | | |
| buildSchema | | | | | |
| createServ | | | | | |
| setPreset/refreshHandlers | | | | | |

This table is the basis for deciding whether cache splitting is worth pursuing.

## Decision Rules

After the first profiling round:

- If a layer is cheap in both time and memory, it should not be cached.
- If a layer is heavy but cannot be safely reused, it becomes a library design problem.
- If a layer is heavy and independently reusable, it becomes a strong cache-splitting candidate.

## Non-Goals

This document does not yet define:

- the final cache architecture
- the final public API shape
- whether Crystal should support multiple `createServ()` calls
- tenant routing strategy in applications

Those should be decided only after profiling data is available.

## Next Step

Implement debug-only instrumentation in:

- `/Users/zeta/Projects/interweb/src/agents/crystal/graphile-build/graphile-build/src/index.ts`
- `/Users/zeta/Projects/interweb/src/agents/crystal/postgraphile/postgraphile/src/index.ts`
- `/Users/zeta/Projects/interweb/src/agents/crystal/grafast/grafserv/src/core/base.ts`

Then run a 10-minute pressure test and summarize the data by phase.
