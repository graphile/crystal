#!/usr/bin/env node --expose-gc --experimental-strip-types
/**
 * PostGraphile Memory Layer Profiling Script
 *
 * Usage:
 *   GRAPHILE_STAGE_PROFILE=1 node --expose-gc --experimental-strip-types scripts/profile-memory-layers.mts
 *   GRAPHILE_STAGE_PROFILE=heap node --expose-gc --experimental-strip-types scripts/profile-memory-layers.mts
 *
 * Requires a running PostgreSQL instance. Configure via DATABASE_URL env var
 * or defaults to postgres://graphilecrystaltest:test@localhost/graphile_profiling
 *
 * The script:
 *   1. Creates a test schema with several tables, relations, and functions.
 *   2. Runs the full PostGraphile lifecycle N times (default 5).
 *   3. Collects profiling NDJSON from stderr.
 *   4. Writes a summary table to stdout.
 */

import { Client } from "pg";
import * as adaptor from "@dataplan/pg/adaptors/pg";

// Dynamically import postgraphile (uses the local build)
const { postgraphile } = await import(
  "../postgraphile/postgraphile/dist/index.js"
);

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://graphilecrystaltest:test@localhost/graphile_profiling";

const ITERATIONS = parseInt(process.env.PROFILE_ITERATIONS ?? "5", 10);

// ── helpers ──────────────────────────────────────────────────────────────────

async function setupSchema() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  await client.query(`
    DROP SCHEMA IF EXISTS profiling CASCADE;
    CREATE SCHEMA profiling;

    CREATE TABLE profiling.users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT,
      bio TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE profiling.posts (
      id SERIAL PRIMARY KEY,
      author_id INT NOT NULL REFERENCES profiling.users(id),
      title TEXT NOT NULL,
      body TEXT,
      published BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE profiling.comments (
      id SERIAL PRIMARY KEY,
      post_id INT NOT NULL REFERENCES profiling.posts(id),
      author_id INT NOT NULL REFERENCES profiling.users(id),
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE profiling.tags (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE profiling.post_tags (
      post_id INT NOT NULL REFERENCES profiling.posts(id),
      tag_id INT NOT NULL REFERENCES profiling.tags(id),
      PRIMARY KEY (post_id, tag_id)
    );

    CREATE FUNCTION profiling.current_user_id() RETURNS INT AS $$
      SELECT 1;
    $$ LANGUAGE sql STABLE;

    CREATE FUNCTION profiling.search_posts(query TEXT)
      RETURNS SETOF profiling.posts AS $$
      SELECT * FROM profiling.posts
      WHERE title ILIKE ('%' || query || '%')
         OR body  ILIKE ('%' || query || '%');
    $$ LANGUAGE sql STABLE;

    -- Seed some data
    INSERT INTO profiling.users (username, email) VALUES
      ('alice', 'alice@example.com'),
      ('bob', 'bob@example.com'),
      ('charlie', 'charlie@example.com');

    INSERT INTO profiling.posts (author_id, title, body, published) VALUES
      (1, 'Hello World', 'First post body', true),
      (1, 'GraphQL Tips', 'Useful tips', true),
      (2, 'Draft Post', 'Not published yet', false),
      (3, 'Another Post', 'Some content here', true);

    INSERT INTO profiling.comments (post_id, author_id, body) VALUES
      (1, 2, 'Great post!'),
      (1, 3, 'Thanks for sharing'),
      (2, 3, 'Very helpful');

    INSERT INTO profiling.tags (name) VALUES ('graphql'), ('postgres'), ('typescript');
    INSERT INTO profiling.post_tags (post_id, tag_id) VALUES (1,1),(1,2),(2,1),(2,3),(4,2);
  `);
  await client.end();
}

async function teardownSchema() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  await client.query("DROP SCHEMA IF EXISTS profiling CASCADE;");
  await client.end();
}

// ── grafserv stub ────────────────────────────────────────────────────────────

// We need a minimal grafserv adaptor to exercise createServ.
// Import the real node adaptor if available, otherwise use a trivial stub.
let grafservNode: any;
try {
  grafservNode = await import("@grafserv/node/dist/index.js");
} catch {
  // If @grafserv/node is not available, create a minimal stub
  const { GrafservBase } = await import(
    "../grafast/grafserv/dist/core/base.js"
  );
  grafservNode = {
    grafserv(config: any) {
      return new GrafservBase(config);
    },
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

interface PhaseRecord {
  phase: string;
  event: "start" | "end";
  ms: number;
  mem: MemSnap;
  memDelta?: MemSnap;
  gcMemDelta?: MemSnap;
}

interface MemSnap {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

function collectProfileLines(raw: string): PhaseRecord[] {
  return raw
    .split("\n")
    .filter((l) => l.startsWith("{"))
    .map((l) => {
      try {
        return JSON.parse(l) as PhaseRecord;
      } catch {
        return null;
      }
    })
    .filter((r): r is PhaseRecord => r !== null);
}

interface PhaseSummary {
  phase: string;
  count: number;
  avgMs: number;
  p95Ms: number;
  avgHeapDelta: number;
  peakHeapDelta: number;
  avgHeapAfterGC: number;
  peakHeapAfterGC: number;
}

function summarize(records: PhaseRecord[]): PhaseSummary[] {
  const ends = records.filter((r) => r.event === "end");
  const byPhase = new Map<string, PhaseRecord[]>();
  for (const r of ends) {
    let list = byPhase.get(r.phase);
    if (!list) {
      list = [];
      byPhase.set(r.phase, list);
    }
    list.push(r);
  }

  const summaries: PhaseSummary[] = [];

  // Maintain the order phases appear
  const phaseOrder = [
    "makeSchema",
    "makeSchema.resolvePreset",
    "buildInflection",
    "gather",
    "buildSchema",
    "postgraphile",
    "postgraphile.createServ",
    "grafserv.constructor",
    "grafserv.setPreset",
    "grafserv.setSchema",
    "grafserv.refreshHandlers",
    "postgraphile.release",
  ];

  for (const phase of phaseOrder) {
    const list = byPhase.get(phase);
    if (!list || list.length === 0) continue;
    const times = list.map((r) => r.ms).sort((a, b) => a - b);
    const heapDeltas = list
      .map((r) => r.memDelta?.heapUsed ?? 0)
      .sort((a, b) => a - b);
    const gcHeapDeltas = list
      .map((r) => r.gcMemDelta?.heapUsed ?? r.memDelta?.heapUsed ?? 0)
      .sort((a, b) => a - b);

    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const p95 = (arr: number[]) => arr[Math.floor(arr.length * 0.95)] ?? arr[arr.length - 1];

    summaries.push({
      phase,
      count: list.length,
      avgMs: Math.round(avg(times) * 1000) / 1000,
      p95Ms: Math.round(p95(times) * 1000) / 1000,
      avgHeapDelta: Math.round(avg(heapDeltas)),
      peakHeapDelta: heapDeltas[heapDeltas.length - 1],
      avgHeapAfterGC: Math.round(avg(gcHeapDeltas)),
      peakHeapAfterGC: gcHeapDeltas[gcHeapDeltas.length - 1],
    });
  }
  return summaries;
}

function fmtBytes(b: number): string {
  if (Math.abs(b) < 1024) return `${b} B`;
  const kb = b / 1024;
  if (Math.abs(kb) < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function printTable(summaries: PhaseSummary[]): string {
  const header =
    "| Layer | Avg Init Time | P95 Init Time | Avg Retained Heap | Peak Retained Heap | Reusable Boundary Today |";
  const sep =
    "| --- | --- | --- | --- | --- | --- |";
  const rows = summaries.map((s) => {
    // Determine reusability note
    let reusable = "—";
    if (s.phase === "makeSchema" || s.phase === "buildSchema" || s.phase === "gather") {
      reusable = "Yes — SchemaResult can be held";
    } else if (s.phase === "buildInflection" || s.phase === "makeSchema.resolvePreset") {
      reusable = "Yes — pure, stateless";
    } else if (s.phase === "postgraphile") {
      reusable = "Yes — wrapper is reference-heavy";
    } else if (s.phase === "postgraphile.createServ") {
      reusable = "No — single-use per instance";
    } else if (s.phase === "grafserv.constructor") {
      reusable = "No — tightly coupled to schema";
    } else if (s.phase === "grafserv.setPreset" || s.phase === "grafserv.refreshHandlers") {
      reusable = "Shell — cheap to recreate";
    } else if (s.phase === "grafserv.setSchema") {
      reusable = "Shell — cheap to recreate";
    } else if (s.phase === "postgraphile.release") {
      reusable = "N/A";
    }

    return `| ${s.phase} | ${s.avgMs.toFixed(1)} ms | ${s.p95Ms.toFixed(1)} ms | ${fmtBytes(s.avgHeapDelta)} | ${fmtBytes(s.peakHeapDelta)} | ${reusable} |`;
  });

  return [header, sep, ...rows].join("\n");
}

// ── run ──────────────────────────────────────────────────────────────────────

console.error(`\n=== PostGraphile Memory Layer Profiling ===`);
console.error(`DATABASE_URL: ${DATABASE_URL}`);
console.error(`ITERATIONS: ${ITERATIONS}`);
console.error(`GRAPHILE_STAGE_PROFILE: ${process.env.GRAPHILE_STAGE_PROFILE}`);
console.error(`--expose-gc available: ${typeof globalThis.gc === "function"}`);
console.error("");

await setupSchema();

// Capture stderr from the profiling instrumentation
const allProfileLines: string[] = [];
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = function (chunk: any, ...args: any[]) {
  const str = typeof chunk === "string" ? chunk : chunk.toString();
  if (str.startsWith("{")) {
    allProfileLines.push(str.trimEnd());
  }
  return (originalStderrWrite as any)(chunk, ...args);
};

try {
  for (let i = 0; i < ITERATIONS; i++) {
    console.error(`--- Iteration ${i + 1}/${ITERATIONS} ---`);

    // Force GC before each iteration for clean baselines
    if (typeof globalThis.gc === "function") {
      globalThis.gc();
    }

    const amberMod = await import(
      "../postgraphile/postgraphile/dist/presets/amber.js"
    );
    const AmberPreset =
      amberMod.PostGraphileAmberPreset ?? amberMod.default ?? amberMod;
    const preset: any = {
      extends: [AmberPreset],
      pgServices: [
        {
          adaptor,
          name: "main",
          withPgClientKey: "withPgClient",
          pgSettingsKey: "pgSettings",
          schemas: ["profiling"],
          adaptorSettings: {
            connectionString: DATABASE_URL,
          },
        },
      ],
    };

    const instance = postgraphile(preset);

    // Wait for schema to be ready
    const schemaResult = await instance.getSchemaResult();
    console.error(
      `  Schema ready. Types: ${Object.keys(
        (schemaResult as any).schema?.getTypeMap?.() ?? {},
      ).length}`,
    );

    // Create a grafserv instance
    const grafservFn = grafservNode.grafserv ?? grafservNode.default?.grafserv;
    if (grafservFn) {
      const serv = instance.createServ(grafservFn);
      await serv.ready();
      console.error(`  Grafserv ready.`);
    } else {
      console.error(`  Skipping grafserv (no adaptor available).`);
    }

    // Release
    await instance.release();
    console.error(`  Released.\n`);
  }
} finally {
  // Restore stderr
  process.stderr.write = originalStderrWrite;
}

await teardownSchema();

// Parse & summarize
const records = collectProfileLines(allProfileLines.join("\n"));
const summaries = summarize(records);

console.log("\n## Raw NDJSON Record Count");
console.log(`Total records: ${records.length}`);
console.log(`End records: ${records.filter((r) => r.event === "end").length}`);
console.log(`Iterations: ${ITERATIONS}\n`);

console.log("## Results Table\n");
console.log(printTable(summaries));

// Also output the raw NDJSON to a file
const fs = await import("node:fs");
const ndjsonPath = "docs/postgraphile-memory-layer-profiling-raw.ndjson";
fs.writeFileSync(ndjsonPath, allProfileLines.join("\n") + "\n");
console.log(`\nRaw NDJSON written to ${ndjsonPath}`);

// Output JSON summary for programmatic use
const jsonPath = "docs/postgraphile-memory-layer-profiling-summary.json";
fs.writeFileSync(jsonPath, JSON.stringify(summaries, null, 2) + "\n");
console.log(`Summary JSON written to ${jsonPath}`);
