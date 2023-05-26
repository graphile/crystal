#!/usr/bin/env node
const pg = require("pg");
const fsp = require("fs").promises;
const child_process = require("child_process");
const { PgSimplifyInflectionPreset } = require("./dist/index.js");
const { makeSchema } = require("postgraphile");
const { makePgService } = require("@dataplan/pg/adaptors/pg");
const { postgraphilePresetAmber } = require("postgraphile/presets/amber");
const { makeV4Preset } = require("postgraphile/presets/v4");
const { printSchema, lexicographicSortSchema } = require("graphql");
const { parse: parseConnectionString } = require("pg-connection-string");
const assert = require("assert");

/**
 * We go beyond what Jest snapshots allow; so we have to manage it ourselves.
 * If UPDATE_SNAPSHOTS is set then we'll write updated snapshots, otherwise
 * we'll do the default behaviour of comparing to existing snapshots.
 */
const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === "1";

const ROOT_CONNECTION_STRING = process.env.ROOT_DATABASE_URL || "postgres";
const CONNECTION_STRING =
  process.env.TEST_SIMPLIFY_DATABASE_URL ||
  "postgres:///pg_simplify_inflectors";
const DATABASE_NAME = parseConnectionString(CONNECTION_STRING).database;
const ROOT = `${__dirname}/tests`;

const withPool = async (connectionString, cb) => {
  const pool = new pg.Pool({
    connectionString,
  });
  try {
    return await cb(pool);
  } finally {
    pool.end();
  }
};

const withClient = async (pool, cb) => {
  const client = await pool.connect();
  try {
    return await cb(client);
  } finally {
    try {
      // Just in case there's any shenanigans
      await client.query("ROLLBACK");
      await client.query("RESET ALL");
    } catch (e) {
      /* IGNORE */
    }

    await client.release();
  }
};

const escapeIdentifier = (str) => `"${str.replace(/"/g, '""')}"`;

async function withCleanDb(cb) {
  await withPool(ROOT_CONNECTION_STRING, async (pool) => {
    await pool.query(
      `DROP DATABASE IF EXISTS ${escapeIdentifier(DATABASE_NAME)};`,
    );
    await pool.query(`CREATE DATABASE ${escapeIdentifier(DATABASE_NAME)};`);
  });
  await withPool(CONNECTION_STRING, async (pool) => cb(pool));
}

async function getSettings(dir) {
  try {
    const json = await fsp.readFile(`${ROOT}/${dir}/settings.json`, "utf8");
    return JSON.parse(json);
  } catch {
    return {};
  }
}

async function getSchema(client, withSimplify, settings) {
  const pgServices = [
    makePgService({
      connectionString: CONNECTION_STRING,
      schemas: ["app_public"],
    }),
  ];
  const result = await makeSchema({
    extends: [
      postgraphilePresetAmber,
      makeV4Preset({
        simpleCollections: "both",
        ...settings,
      }),
      ...(withSimplify ? [PgSimplifyInflectionPreset] : []),
    ],
    pgServices,
  });
  // TODO: solve this better!
  // Hack to release the pool
  pgServices[0].adaptorSettings.pool.end();
  return result.schema;
}

async function runTests(pool, dir) {
  const schema = await fsp.readFile(`${ROOT}/${dir}/schema.sql`, "utf8");
  const settings = await getSettings(dir);
  await withClient(pool, async (client) => {
    await client.query(`
      set search_path to public;
      create extension if not exists pgcrypto;

      drop schema if exists app_public cascade;
      create schema app_public;
      set search_path to app_public, public;
    `);
    await client.query(schema);

    const before = await getSchema(client, false, settings);
    const after = await getSchema(client, true, settings);
    const beforePath = `${ROOT}/${dir}/schema.unsimplified.graphql`;
    const afterPath = `${ROOT}/${dir}/schema.simplified.graphql`;
    const diffPath = `${ROOT}/${dir}/schema.graphql.diff`;
    await snapshot(printSchema(lexicographicSortSchema(before)), beforePath);
    await snapshot(printSchema(lexicographicSortSchema(after)), afterPath);

    const diff = await new Promise((resolve, reject) => {
      const child = child_process.spawn(
        "diff",
        [
          "-u",
          "--label",
          "unsimplified",
          beforePath,
          "--label",
          "simplified",
          afterPath,
        ],
        {
          stdio: "pipe",
        },
      );
      const buffers = [];

      child.stdout.on("data", (data) => {
        buffers.push(data);
      });

      child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      child.on("close", (code) => {
        const data = Buffer.concat(buffers).toString("utf8");
        if (data.length) {
          resolve(data);
        } else {
          reject(new Error(`child process exited with code ${code}`));
        }
      });
    });

    await snapshot(diff, diffPath);
  });
}

/**
 * If UPDATE_SNAPSHOTS is set then wrotes the given snapshot to the given
 * filePath, otherwise it asserts that the snapshot matches the previous
 * snapshot.
 */
async function snapshot(actual, filePath) {
  let expected = null;
  try {
    expected = await fsp.readFile(filePath, "utf8");
  } catch (e) {
    /* noop */
  }
  if (expected == null || UPDATE_SNAPSHOTS) {
    if (expected !== actual) {
      console.warn(`Updated snapshot in '${filePath}'`);
      await fsp.writeFile(filePath, actual);
    }
  } else {
    assert.equal(actual, expected);
  }
}

async function main() {
  const specified = process.argv[2];
  const dirs = specified ? [specified] : await fsp.readdir(ROOT);
  for (const dir of dirs) {
    const stat = await fsp.stat(`${ROOT}/${dir}`);
    if (stat.isDirectory()) {
      if (/^[a-z0-9_]+$/.test(dir)) {
        console.log(dir);
        await withCleanDb((pool) => runTests(pool, dir));
      } else {
        console.warn(
          `Skipping '${dir}' because it does not adhere to the naming convention`,
        );
      }
    }
  }
}

withPool("postgres", main).catch((e) => {
  console.error(e);
  process.exit(1);
});
