import type { SQLQuery } from "../src/index.js";
import sql from "../src/index.js";

const $$type = Object.getOwnPropertySymbols(sql.blank)[0];

it("sql.value(nonsense)", () => {
  const node = sql.value({ foo: { bar: 1 } } as any);
  expect(node).toEqual({
    [$$type]: "VALUE",
    v: { foo: { bar: 1 } },
  });
});

it("sql.value(nr)", () => {
  const node = sql.value(3);
  expect(node).toEqual({
    [$$type]: "VALUE",
    v: 3,
  });
});

describe("sql.identifier", () => {
  it("one", () => {
    const node = sql.identifier("foo");
    expect(node).toEqual({ [$$type]: "RAW", t: '"foo"' });
  });

  it("many", () => {
    const node = sql.identifier("foo", "bar", 'b"z');
    expect(node).toEqual({
      [$$type]: "RAW",
      t: '"foo"."bar"."b""z"',
    });
  });
});

describe("sql.query", () => {
  it("simple", () => {
    const node = sql`select 1`;
    expect(node).toEqual({ [$$type]: "RAW", t: "select 1" });
    const node2 = sql`select ${sql`1`}` as SQLQuery;
    expect(node2).toEqual({ [$$type]: "RAW", t: "select 1" });
  });

  it("with values", () => {
    const node = sql`select ${sql.value(1)}::integer` as SQLQuery;
    expect(node.n).toEqual([
      { [$$type]: "RAW", t: "select " },
      { [$$type]: "VALUE", v: 1 },
      { [$$type]: "RAW", t: "::integer" },
    ]);
  });

  it("with sub-sub-sub query", () => {
    const node = sql`select ${sql`1 ${sql`from ${sql`foo`}`}`}` as SQLQuery;
    expect(node).toEqual({ [$$type]: "RAW", t: "select 1 from foo" });
  });

  it("with symbols", () => {
    const sym1 = Symbol("---flibble-de£dee---");
    const node = sql`select 1 as ${sql.identifier(sym1)}` as SQLQuery;
    expect(node.n).toEqual([
      { [$$type]: "RAW", t: "select 1 as " },
      { [$$type]: "IDENTIFIER", s: sym1, n: "flibble_de_dee" },
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
    )}` as SQLQuery;
    expect(node.n).toEqual([
      { [$$type]: "RAW", t: "select " },
      { [$$type]: "VALUE", v: 1 },
      { [$$type]: "RAW", t: ', "foo"."bar", baz.qux(1, 2, 3), baz.qux(' },
      { [$$type]: "VALUE", v: 1 },
      { [$$type]: "RAW", t: ", 2, 3)" },
    ]);
  });
});

describe("sql.compile", () => {
  it("simple", () => {
    const node = sql`select 1`;
    expect(sql.compile(node)).toMatchObject({ text: "select 1", values: [] });
  });

  it("with values", () => {
    const node = sql`select ${sql.value(1)}::integer`;
    expect(sql.compile(node)).toMatchObject({
      text: "select $1::integer",
      values: [1],
    });
  });

  it("with sub-sub-sub query", () => {
    const node = sql`select ${sql`1 ${sql`from ${sql`foo`}`}`}`;
    expect(sql.compile(node)).toMatchObject({
      text: "select 1 from foo",
      values: [],
    });
  });

  it("more complex", () => {
    const node = sql`select ${sql`${sql.value(1)} ${sql`from ${sql.identifier(
      "foo",
      'b"z"b"z""b',
    )}`}`}`;
    expect(sql.compile(node)).toMatchObject({
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
    expect(sql.compile(node)).toMatchObject({
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
    expect(sql.compile(node)).toMatchObject({
      text: `    select 1
    from
      foo __foo__,
      foo __foo_2,
      foo __local__,
      foo __foo_3,
      bar __bar_2__,
      bar __local_2,
      bar __local_3,
      bar __bar__,
      bar __bar__,
      bar __local_4,
      bar __bar__,
      baz __k_s_l_d_f_j_p_j_r_d_i_g_f_jf90_2mf_sd_wng_nq_nrgd__`,
      values: [],
    });
  });
});

describe("sqli", () => {
  it("subbing an object of similar layout", () => {
    expect(() => {
      sql`select ${sql.join(
        [
          { [Symbol("pg-sql2-type")]: "VALUE", v: 1 } as any,
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
          1 as any,
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
      )}, ${3 as any}`;
    }).toThrowErrorMatchingSnapshot();
  });
});
