import { LDSLiveSource } from "../src/PgLDSSourcePlugin";
import { DATABASE_URL, query, withLiveSourceAndClient } from "./helpers";

const fooTableSpec = { namespaceName: "app_public", name: "foo" };
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test("cleans up", async () => {
  const l = new LDSLiveSource({
    connectionString: DATABASE_URL,
  });
  await l.init();
  const { rows: initialPgRows } = await query(
    "select * from pg_catalog.pg_replication_slots where slot_name = $1",
    [l.slotName]
  );
  expect(initialPgRows.length).toEqual(1);
  await l.close();
  const { rows: finalPgRows } = await query(
    "select * from pg_catalog.pg_replication_slots where slot_name = $1",
    [l.slotName]
  );
  expect(finalPgRows.length).toEqual(0);
});

test("reports changes", () =>
  withLiveSourceAndClient(async (liveSource, pgClient) => {
    const collectionMockCb = jest.fn();
    const collectionWithPredicateMockCb = jest.fn();
    const recordMockCb = jest.fn();
    liveSource.subscribeCollection(collectionMockCb, fooTableSpec);
    liveSource.subscribeCollection(
      collectionWithPredicateMockCb,
      fooTableSpec,
      d => d.name === "Ciao"
    );
    const {
      rows: [{ id }],
    } = await pgClient.query(
      "insert into app_public.foo (name) values ($1) returning *",
      ["Howdy"]
    );
    liveSource.subscribeRecord(recordMockCb, fooTableSpec, [id]);
    await sleep(100);
    await pgClient.query("update app_public.foo set name = $1 where id = $2", [
      "Ciao",
      id,
    ]);
    await sleep(100);
    expect(collectionMockCb).toHaveBeenCalledTimes(2);
    expect(collectionWithPredicateMockCb).toHaveBeenCalledTimes(1);
    expect(recordMockCb).toHaveBeenCalledTimes(1);
  }));
