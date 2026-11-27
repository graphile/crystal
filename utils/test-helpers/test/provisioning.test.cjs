const assert = require("node:assert/strict");
const { test } = require("node:test");
const { Client } = require("pg");

const { createTestDatabase } = require("../dist/index.js");

test("closes a failed connection before retrying database creation", async (t) => {
  const events = [];
  t.mock.method(Client.prototype, "connect", async function () {
    events.push(["connect", this]);
    if (events.length === 1) {
      throw Object.assign(new Error("connection reset"), {
        code: "ECONNRESET",
      });
    }
  });
  t.mock.method(Client.prototype, "query", async function () {
    events.push(["query", this]);
  });
  t.mock.method(Client.prototype, "end", async function () {
    events.push(["end", this]);
  });

  await createTestDatabase();
  assert.deepEqual(
    events.map(([action]) => action),
    ["connect", "end", "connect", "query", "end"],
  );
  assert.equal(events[0][1], events[1][1]);
  assert.equal(events[2][1], events[4][1]);
});
