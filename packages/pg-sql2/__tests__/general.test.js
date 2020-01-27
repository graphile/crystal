const sql = require("../src");

function sansSymbols(obj) {
  if (obj && typeof obj === "object") {
    return Object.keys(obj).reduce((memo, key) => {
      memo[key] = obj[key];
      return memo;
    }, {});
  } else {
    return obj;
  }
}

it("sql.value", () => {
  const node = sql.value({ foo: { bar: 1 } });
  expect(sansSymbols(node)).toEqual({
    type: "VALUE",
    value: { foo: { bar: 1 } },
  });
});

describe("sql.identifier", () => {
  it("one", () => {
    const node = sql.identifier("foo");
    expect(sansSymbols(node)).toEqual({ type: "IDENTIFIER", names: ["foo"] });
  });

  it("many", () => {
    const node = sql.identifier("foo", "bar", 'b"z');
    expect(sansSymbols(node)).toEqual({
      type: "IDENTIFIER",
      names: ["foo", "bar", 'b"z'],
    });
  });
});

describe("sql.query", () => {
  it("simple", () => {
    const node = sql.query`select 1`;
    expect(node.map(sansSymbols)).toEqual([{ type: "RAW", text: "select 1" }]);
  });

  it("with values", () => {
    const node = sql.query`select ${sql.value(1)}::integer`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "VALUE", value: 1 },
      { type: "RAW", text: "::integer" },
    ]);
  });

  it("with sub-sub-sub query", () => {
    const node = sql.query`select ${sql.query`1 ${sql.query`from ${sql.query`foo`}`}`}`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "RAW", text: "1 " },
      { type: "RAW", text: "from " },
      { type: "RAW", text: "foo" },
    ]);
  });
});

describe("sql.join", () => {
  it("various sub-parts", () => {
    const node = sql.query`select ${sql.join(
      [
        sql.value(1),
        sql.identifier("foo", "bar"),
        sql.query`baz.qux(1, 2, 3)`,
        sql.query`baz.qux(${sql.value(1)}, ${sql.query`2`}, 3)`,
      ],
      ", "
    )}`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "VALUE", value: 1 },
      { type: "RAW", text: ", " },
      { type: "IDENTIFIER", names: ["foo", "bar"] },
      { type: "RAW", text: ", " },
      { type: "RAW", text: "baz.qux(1, 2, 3)" },
      { type: "RAW", text: ", " },
      { type: "RAW", text: "baz.qux(" },
      { type: "VALUE", value: 1 },
      { type: "RAW", text: ", " },
      { type: "RAW", text: "2" },
      { type: "RAW", text: ", 3)" },
    ]);
  });
});

describe("sql.compile", () => {
  it("simple", () => {
    const node = sql.query`select 1`;
    expect(sql.compile(node)).toEqual({ text: "select 1", values: [] });
  });

  it("with values", () => {
    const node = sql.query`select ${sql.value(1)}::integer`;
    expect(sql.compile(node)).toEqual({
      text: "select $1::integer",
      values: [1],
    });
  });

  it("with sub-sub-sub query", () => {
    const node = sql.query`select ${sql.query`1 ${sql.query`from ${sql.query`foo`}`}`}`;
    expect(sql.compile(node)).toEqual({
      text: "select 1 from foo",
      values: [],
    });
  });

  it("more complex", () => {
    const node = sql.query`select ${sql.query`${sql.value(
      1
    )} ${sql.query`from ${sql.identifier("foo", 'b"z"b"z""b')}`}`}`;
    expect(sql.compile(node)).toEqual({
      text: 'select $1 from "foo"."b""z""b""z""""b"',
      values: [1],
    });
  });

  it("including a join", () => {
    const node = sql.query`select ${sql.join(
      [
        sql.value(1),
        sql.identifier("foo", "bar"),
        sql.query`baz.qux(1, 2, 3)`,
        sql.query`baz.qux(${sql.value(1)}, ${sql.query`2`}, 3)`,
      ],
      ", "
    )}`;
    expect(sql.compile(node)).toEqual({
      text: 'select $1, "foo"."bar", baz.qux(1, 2, 3), baz.qux($2, 2, 3)',
      values: [1, 1],
    });
  });
});

describe("sqli", () => {
  it("subbing an object of similar layout", () => {
    expect(() => {
      sql.query`select ${sql.join(
        [
          { type: "VALUE", value: 1 },
          sql.identifier("foo", "bar"),
          sql.query`baz.qux(1, 2, 3)`,
          sql.query`baz.qux(${sql.value(1)}, ${sql.query`2`}, 3)`,
        ],
        ", "
      )}`;
    }).toThrowErrorMatchingSnapshot();
  });

  it("including a join", () => {
    expect(() => {
      sql.query`select ${sql.join(
        [
          sql.value(1),
          sql.identifier("foo", "bar"),
          sql.query`baz.qux(1, 2, 3)`,
          sql.query`baz.qux(${sql.value(1)}, ${sql.query`2`}, 3)`,
        ],
        ", "
      )}, ${3}`;
    }).toThrowErrorMatchingSnapshot();
  });
});
