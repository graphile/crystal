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
  PgExecutorContext,
  WithPgClient,
} from "../src/index.ts";
import {
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

    const plans: any[] = [];
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
              plans.push(rows[0]["QUERY PLAN"][0].Plan);
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
          name: "rlsBatchedLookupTest",
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
      (TYPES, executor, recordCodec, sql) =>
        recordCodec({
          executor,
          name: "rlsItems",
          identifier: sql`rls_items`,
          attributes: {
            id: { notNull: true, codec: TYPES.int },
            owner_id: { notNull: true, codec: TYPES.int },
          },
        }),
      [TYPES, executor, recordCodec, sql],
    );
    const registry = EXPORTABLE(
      (
        executor,
        itemCodec,
        makePgResourceOptions,
        makeRegistry,
        makeRegistryBuilder,
        sql,
      ) =>
        makeRegistry(
          makeRegistryBuilder()
            .addExecutor(executor)
            .addCodec(itemCodec)
            .addResource(
              makePgResourceOptions({
                executor,
                codec: itemCodec,
                from: sql`rls_items`,
                name: "rls_items",
                uniques: [{ attributes: ["id"], isPrimary: true }],
              }),
            )
            .getRegistryConfig(),
        ),
      [
        executor,
        itemCodec,
        makePgResourceOptions,
        makeRegistry,
        makeRegistryBuilder,
        sql,
      ],
    );
    const schema = makeGrafastSchema({
      typeDefs: `
        type Item { id: Int!, ownerId: Int! }
        type Query { items(ids: [Int!]!): [Item] }
      `,
      objects: {
        Query: {
          plans: {
            items: EXPORTABLE(
              (each, registry) =>
                function items(_, fieldArgs) {
                  const $ids = fieldArgs.getRaw("ids");
                  return each($ids as any, ($id) =>
                    registry.pgResources.rls_items.get({ id: $id }),
                  );
                },
              [each, registry],
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
      source: "{ items(ids: [7, 107, 207, 8]) { id ownerId } }",
      resolvedPreset: resolvePreset({
        grafast: {
          context: () => ({
            pgSettings: {
              role: "postgraphile_test_visitor",
              "jwt.claims.owner_id": "7",
            },
            withPgClient,
          }),
        },
      }),
      requestContext: {},
    });

    expect(result).toEqual({
      data: {
        items: [
          { id: 7, ownerId: 7 },
          { id: 107, ownerId: 7 },
          { id: 207, ownerId: 7 },
          null,
        ],
      },
    });
    expect(plans).toHaveLength(1);
    // The identifiers are estimated at the batch's real size.
    const identifiers = nodesOf(
      plans[0],
      (node) => node["Node Type"] === "CTE Scan",
    );
    expect(identifiers).toHaveLength(1);
    expect(identifiers[0]["Plan Rows"]).toEqual(4);
    const scans = nodesOf(
      plans[0],
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
