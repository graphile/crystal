import subscribeToLogicalDecoding from "../src/index";
import { DATABASE_URL, withClient } from "./helpers";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test("gets expected data, cleans up, doesn't receive data after cleanup", async () => {
  const mockCallback = jest.fn();
  const sub = await subscribeToLogicalDecoding(DATABASE_URL, mockCallback, {
    temporary: true,
    sleepDuration: 50,
    slotName: "index_test_slot",
  });
  await withClient(DATABASE_URL, async pgClient => {
    const {
      rows: [{ id }],
    } = await pgClient.query(
      "insert into app_public.foo(name) values ('temp') returning id"
    );
    await sleep(100);
    await pgClient.query(
      "update app_public.foo set name = 'Bar' where id = $1",
      [id]
    );
    await sleep(100);
    await pgClient.query("delete from app_public.foo where id = $1", [id]);
    await sleep(100);
  });
  await sub.close();
  expect(mockCallback).toHaveBeenCalledTimes(4);
  // Now run a new mutation, and expect the mockCallback not to have been called
  await withClient(DATABASE_URL, pgClient =>
    pgClient.query(
      "insert into app_public.foo(name) values ('temp') returning id"
    )
  );
  expect(mockCallback).toHaveBeenCalledTimes(4);

  const {
    mock: { calls },
  } = mockCallback;
  calls.forEach(call => {
    expect(Array.isArray(call)).toBe(true);
    const o = call[0];
    expect(o.schema).toEqual("app_public");
    expect(o.table).toEqual("foo");
  });
  const [insertC, update, updateC, del] = calls.map(c => c[0]);

  expect(insertC._).toEqual("insertC");
  expect(insertC.data.name).toEqual("temp");

  expect(update._).toEqual("update");
  expect(update.keys[0]).toEqual(insertC.data.id);
  expect(update.data.name).toEqual("Bar");

  expect(updateC._).toEqual("updateC");
  expect(updateC.data.name).toEqual("Bar");

  expect(del._).toEqual("delete");
  expect(del.keys[0]).toEqual(insertC.data.id);
});
