import type { Step } from "grafast";
import { context, each, grafast, makeGrafastSchema, object } from "grafast";
import { resolvePreset } from "graphile-config";
import { Pool } from "pg";
import sql from "pg-sql2";

import { makePgAdaptorWithPgClient } from "../src/adaptors/pg.ts";
import { EXPORTABLE } from "../src/datasource.ts";
import { PgExecutor } from "../src/executor.ts";
import type {
  PgClient,
  PgClientQuery,
  PgCodec,
  PgExecutorContext,
  WithPgClient,
} from "../src/index.ts";
import {
  listOfCodec,
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  recordCodec,
  TYPES,
} from "../src/index.ts";
import { createTestDatabase, dropTestDatabase } from "./sharedHelpers.ts";

/** Every plan node matching `predicate`, at any depth. */
function nodesOf(plan: any, predicate: (node: any) => boolean): any[] {
  const found: any[] = [];
  const visit = (node: any) => {
    if (predicate(node)) found.push(node);
    for (const child of node.Plans ?? []) visit(child);
  };
  visit(plan);
  return found;
}

/**
 * Fetches `items(keys: ...)` from `table`, whose primary key is `key` and
 * which has an `owner_id`, as one batched lookup per key, and returns the
 * result with the text and plan of each batched query.
 */
async function batchedLookup(
  pool: Pool,
  {
    table,
    key,
    keyCodec,
    keyGraphQLType,
    keys,
    pgSettings,
  }: {
    table: string;
    key: string;
    keyCodec: PgCodec;
    keyGraphQLType: string;
    keys: string;
    pgSettings: Record<string, string>;
  },
) {
  const lookups: Array<{ text: string; plan: any }> = [];
  const baseWithPgClient = makePgAdaptorWithPgClient(pool);
  // Explains each batched lookup, in the same transaction and role, before
  // running it.
  const withPgClient: WithPgClient = (pgSettings, callback) =>
    baseWithPgClient(pgSettings, (client) => {
      const explainingClient: PgClient = {
        async query<TData>(opts: PgClientQuery) {
          if (opts.text.includes(" as materialized (")) {
            const { rows } = await client.query<any>({
              text: `explain (format json) ${opts.text}`,
              values: opts.values,
            });
            lookups.push({
              text: opts.text,
              plan: rows[0]["QUERY PLAN"][0].Plan,
            });
          }
          return client.query<TData>(opts);
        },
        withTransaction: (cb) => client.withTransaction(cb),
      };
      return callback(explainingClient as any);
    });

  const executor = EXPORTABLE(
    (PgExecutor, context, object) =>
      new PgExecutor({
        name: "batchedIdentifiersTest",
        context: () => {
          const $context = context();
          return object({
            pgSettings: $context.get("pgSettings"),
            withPgClient: $context.get("withPgClient"),
          }) as Step<PgExecutorContext>;
        },
      }),
    [PgExecutor, context, object],
  );
  const itemCodec = EXPORTABLE(
    (TYPES, executor, key, keyCodec, recordCodec, sql, table) =>
      recordCodec({
        executor,
        name: "items",
        identifier: sql.identifier(table),
        attributes: {
          [key]: { notNull: true, codec: keyCodec },
          owner_id: { notNull: true, codec: TYPES.int },
        },
      }),
    [TYPES, executor, key, keyCodec, recordCodec, sql, table],
  );
  const registry = EXPORTABLE(
    (
      executor,
      itemCodec,
      key,
      makePgResourceOptions,
      makeRegistry,
      makeRegistryBuilder,
      sql,
      table,
    ) =>
      makeRegistry(
        makeRegistryBuilder()
          .addExecutor(executor)
          .addCodec(itemCodec)
          .addResource(
            makePgResourceOptions({
              executor,
              codec: itemCodec,
              from: sql.identifier(table),
              name: "items",
              uniques: [{ attributes: [key], isPrimary: true }],
            }),
          )
          .getRegistryConfig(),
      ),
    [
      executor,
      itemCodec,
      key,
      makePgResourceOptions,
      makeRegistry,
      makeRegistryBuilder,
      sql,
      table,
    ],
  );
  const schema = makeGrafastSchema({
    typeDefs: `
      type Item { ownerId: Int! }
      type Query { items(keys: [${keyGraphQLType}!]!): [Item] }
    `,
    objects: {
      Query: {
        plans: {
          items: EXPORTABLE(
            (each, key, registry) =>
              function items(_, fieldArgs) {
                const $keys = fieldArgs.getRaw("keys");
                return each($keys as any, ($key) =>
                  registry.pgResources.items.get({ [key]: $key }),
                );
              },
            [each, key, registry],
          ),
        },
      },
      Item: {
        plans: {
          ownerId: EXPORTABLE(
            () =>
              function ownerId($item: any) {
                return $item.get("owner_id");
              },
            [],
          ),
        },
      },
    },
  });

  const result = await grafast({
    schema,
    source: `{ items(keys: ${keys}) { ownerId } }`,
    resolvedPreset: resolvePreset({
      grafast: { context: () => ({ pgSettings, withPgClient }) },
    }),
    requestContext: {},
  });
  return { result, lookups };
}

test("a batched lookup beneath row-level security probes the primary key", async () => {
  const { connectionString, databaseName } = await createTestDatabase();
  const pool = new Pool({ connectionString });
  try {
    // A policy that calls a function the planner can't see into, as most
    // real policies do. The planner prices such a policy as cheap, so with
    // identifiers estimated at 100 rows it scans a table of a few hundred
    // wide rows once rather than probe it a hundred times, and the policy
    // then runs for every row. A much larger table is probed either way.
    await pool.query(`
      create table rls_items (
        id int primary key,
        owner_id int not null,
        body text not null
      );
      insert into rls_items (id, owner_id, body)
        select n, n % 100, repeat('x', 400) from generate_series(1, 400) n;
      create function rls_items_readable(owner_id int) returns boolean as $$
      begin
        return owner_id = current_setting('jwt.claims.owner_id')::int;
      end;
      $$ language plpgsql stable;
      alter table rls_items enable row level security;
      create policy rls_items_select on rls_items for select
        using (rls_items_readable(owner_id));
      grant select on rls_items to postgraphile_test_visitor;
      grant execute on function rls_items_readable(int) to postgraphile_test_visitor;
      analyze rls_items;
    `);

    const { result, lookups } = await batchedLookup(pool, {
      table: "rls_items",
      key: "id",
      keyCodec: TYPES.int,
      keyGraphQLType: "Int",
      keys: "[7, 107, 207, 8]",
      pgSettings: {
        role: "postgraphile_test_visitor",
        "jwt.claims.owner_id": "7",
      },
    });

    expect(result).toEqual({
      data: {
        items: [{ ownerId: 7 }, { ownerId: 7 }, { ownerId: 7 }, null],
      },
    });
    expect(lookups).toHaveLength(1);
    // The identifiers are estimated at the batch's real size.
    const identifiers = nodesOf(
      lookups[0].plan,
      (node) => node["Node Type"] === "CTE Scan",
    );
    expect(identifiers).toHaveLength(1);
    expect(identifiers[0]["Plan Rows"]).toEqual(4);
    const scans = nodesOf(
      lookups[0].plan,
      (node) => node["Relation Name"] === "rls_items",
    );
    expect(scans.length).toBeGreaterThan(0);
    for (const scan of scans) {
      expect(scan["Node Type"]).toEqual("Index Scan");
      expect(scan["Index Name"]).toEqual("rls_items_pkey");
    }
  } finally {
    await pool.end();
    await dropTestDatabase(databaseName);
  }
});

test("a batched lookup by an array identifier keeps each array whole", async () => {
  const { connectionString, databaseName } = await createTestDatabase();
  const pool = new Pool({ connectionString });
  try {
    await pool.query(`
      create table tagged_items (
        tags int[] primary key,
        owner_id int not null
      );
      insert into tagged_items (tags, owner_id) values
        ('{1,2}', 1), ('{3,4}', 2), ('{1,2,3}', 3);
      grant select on tagged_items to postgraphile_test_visitor;
    `);

    // Unnesting these as one int[] would flatten them, or reject them for
    // their differing lengths.
    const { result, lookups } = await batchedLookup(pool, {
      table: "tagged_items",
      key: "tags",
      keyCodec: listOfCodec(TYPES.int),
      keyGraphQLType: "[Int!]",
      keys: "[[1, 2], [3, 4], [1, 2, 3], [9]]",
      pgSettings: { role: "postgraphile_test_visitor" },
    });

    expect(result).toEqual({
      data: {
        items: [{ ownerId: 1 }, { ownerId: 2 }, { ownerId: 3 }, null],
      },
    });
    expect(lookups).toHaveLength(1);
    expect(lookups[0].text).toContain("json_to_recordset");
    expect(lookups[0].text).not.toContain("unnest");
  } finally {
    await pool.end();
    await dropTestDatabase(databaseName);
  }
});
