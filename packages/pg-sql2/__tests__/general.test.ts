import sql from "../src";

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
    expect(sansSymbols(node)).toEqual({ type: "IDENTIFIER", names: ['"foo"'] });
  });

  it("many", () => {
    const node = sql.identifier("foo", "bar", 'b"z');
    expect(sansSymbols(node)).toEqual({
      type: "IDENTIFIER",
      names: ['"foo"', '"bar"', '"b""z"'],
    });
  });
});

describe("sql.query", () => {
  it("simple", () => {
    const node = sql`select 1`;
    expect(sansSymbols(node)).toEqual({ type: "RAW", text: "select 1" });
    const node2 = sql`select ${sql`1`}`;
    expect(node2.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "RAW", text: "1" },
    ]);
  });

  it("with values", () => {
    const node = sql`select ${sql.value(1)}::integer`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "VALUE", value: 1 },
      { type: "RAW", text: "::integer" },
    ]);
  });

  it("with sub-sub-sub query", () => {
    const node = sql`select ${sql`1 ${sql`from ${sql`foo`}`}`}`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "RAW", text: "1 " },
      { type: "RAW", text: "from " },
      { type: "RAW", text: "foo" },
    ]);
  });

  it("with symbols", () => {
    const sym1 = Symbol("---flibble-de£dee---");
    const node = sql`select 1 as ${sql.identifier(sym1)}`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select 1 as " },
      { type: "IDENTIFIER", names: [{ s: sym1, n: "flibble_de_dee" }] },
    ]);
  });
});

describe("sql.join", () => {
  it("various sub-parts", () => {
    const node = sql`select ${sql.join(
      [
        sql.value(1),
        sql.identifier("foo", "bar"),
        sql`baz.qux(1, 2, 3)`,
        sql`baz.qux(${sql.value(1)}, ${sql`2`}, 3)`,
      ],
      ", ",
    )}`;
    expect(node.map(sansSymbols)).toEqual([
      { type: "RAW", text: "select " },
      { type: "VALUE", value: 1 },
      { type: "RAW", text: ", " },
      { type: "IDENTIFIER", names: ['"foo"', '"bar"'] },
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
    const node = sql`select 1`;
    expect(sql.compile(node)).toEqual({ text: "select 1", values: [] });
  });

  it("with values", () => {
    const node = sql`select ${sql.value(1)}::integer`;
    expect(sql.compile(node)).toEqual({
      text: "select $1::integer",
      values: [1],
    });
  });

  it("with sub-sub-sub query", () => {
    const node = sql`select ${sql`1 ${sql`from ${sql`foo`}`}`}`;
    expect(sql.compile(node)).toEqual({
      text: "select 1 from foo",
      values: [],
    });
  });

  it("more complex", () => {
    const node = sql`select ${sql`${sql.value(1)} ${sql`from ${sql.identifier(
      "foo",
      'b"z"b"z""b',
    )}`}`}`;
    expect(sql.compile(node)).toEqual({
      text: 'select $1 from "foo"."b""z""b""z""""b"',
      values: [1],
    });
  });

  it("including a join", () => {
    const node = sql`select ${sql.join(
      [
        sql.value(1),
        sql.identifier("foo", "bar"),
        sql`baz.qux(1, 2, 3)`,
        sql`baz.qux(${sql.value(1)}, ${sql`2`}, 3)`,
      ],
      ", ",
    )}`;
    expect(sql.compile(node)).toEqual({
      text: 'select $1, "foo"."bar", baz.qux(1, 2, 3), baz.qux($2, 2, 3)',
      values: [1, 1],
    });
  });

  it("handles symbols", () => {
    const barSym = Symbol("bar");
    const node = sql`\
    select 1
    from
      foo ${sql.identifier(Symbol("foo"))},
      foo ${sql.identifier(Symbol("foo"))},
      foo ${sql.identifier(Symbol())},
      foo ${sql.identifier(Symbol("foo"))},
      bar ${sql.identifier(Symbol("bar_2"))},
      bar ${sql.identifier(Symbol())},
      bar ${sql.identifier(Symbol())},
      bar ${sql.identifier(barSym)},
      bar ${sql.identifier(barSym)},
      bar ${sql.identifier(Symbol())},
      bar ${sql.identifier(barSym)},
      baz ${sql.identifier(
        Symbol(
          "KSLDFJP(J£_RDIGFJf90-2mf)sd_(wng)*nq£(nrgd_f(gkw)dfksdfg)*hd)(jq£_)jermg)ieng_q£j_fopkgpejgt@£lvi:hwn*(twe):jhwoy£@(:iowrljw*yr(ehgso:dihgf(weygpsrhgowev(&",
        ),
      )}`;
    expect(sql.compile(node)).toEqual({
      text: `    select 1
    from
      foo __foo_1__,
      foo __foo_2__,
      foo __local_1__,
      foo __foo_3__,
      bar __bar_2_1__,
      bar __local_2__,
      bar __local_3__,
      bar __bar_1__,
      bar __bar_1__,
      bar __local_4__,
      bar __bar_1__,
      baz __k_s_l_d_f_j_p_j_r_d_i_g_f_jf90_2mf_sd_wng_nq_nrgd_1__`,
      values: [],
    });
  });
});

describe("sqli", () => {
  it("subbing an object of similar layout", () => {
    expect(() => {
      sql`select ${sql.join(
        [
          { type: "VALUE", value: 1 },
          sql.identifier("foo", "bar"),
          sql`baz.qux(1, 2, 3)`,
          sql`baz.qux(${sql.value(1)}, ${sql`2`}, 3)`,
        ],
        ", ",
      )}`;
    }).toThrowErrorMatchingSnapshot();
  });

  it("subbing in a scalar", () => {
    expect(() => {
      sql`select ${sql.join(
        [
          1,
          sql.identifier("foo", "bar"),
          sql`baz.qux(1, 2, 3)`,
          sql`baz.qux(${sql.value(1)}, ${sql`2`}, 3)`,
        ],
        ", ",
      )}`;
    }).toThrowErrorMatchingSnapshot();
  });

  it("including a join", () => {
    expect(() => {
      sql`select ${sql.join(
        [
          sql.value(1),
          sql.identifier("foo", "bar"),
          sql`baz.qux(1, 2, 3)`,
          sql`baz.qux(${sql.value(1)}, ${sql`2`}, 3)`,
        ],
        ", ",
      )}, ${3}`;
    }).toThrowErrorMatchingSnapshot();
  });
});
