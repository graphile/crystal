import te from "../dist/index.js";

it("basic", () => {
  expect(te.compile(te`return 1`)).toMatchInlineSnapshot(`
    Object {
      "refs": Object {},
      "string": "return 1",
    }
  `);
});

const COMPLEX_OBJECT = { a: 1, b: { c: 3 } };
const AWKWARD_STRING = "string\"'`$\\";

it("a few refs", () => {
  const frag = te`return [
  ${te.ref(-Number.MAX_SAFE_INTEGER)},
  ${te.ref(-Number.MAX_VALUE)},
  ${te.ref(Number.MIN_VALUE)},
  ${te.ref("")},
  ${te.ref(AWKWARD_STRING)},
  ${te.ref(true)},
  ${te.ref(false)},
  ${te.ref(null)},
  ${te.ref(undefined)},
  ${te.ref(COMPLEX_OBJECT)}
]`;
  expect(te.compile(frag)).toMatchInlineSnapshot(`
    Object {
      "refs": Object {
        "_$$_ref_1": -9007199254740991,
        "_$$_ref_10": Object {
          "a": 1,
          "b": Object {
            "c": 3,
          },
        },
        "_$$_ref_2": -1.7976931348623157e+308,
        "_$$_ref_3": 5e-324,
        "_$$_ref_4": "",
        "_$$_ref_5": "string\\"'\`$\\\\",
        "_$$_ref_6": true,
        "_$$_ref_7": false,
        "_$$_ref_8": null,
        "_$$_ref_9": undefined,
      },
      "string": "return [
      _$$_ref_1,
      _$$_ref_2,
      _$$_ref_3,
      _$$_ref_4,
      _$$_ref_5,
      _$$_ref_6,
      _$$_ref_7,
      _$$_ref_8,
      _$$_ref_9,
      _$$_ref_10
    ]",
    }
  `);
  const val = te.run<any[]>(frag);
  expect(val[4]).toStrictEqual(AWKWARD_STRING);
  expect(val[9]).toStrictEqual(COMPLEX_OBJECT);
  expect(val).toMatchInlineSnapshot(`
    Array [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string\\"'\`$\\\\",
      true,
      false,
      null,
      undefined,
      Object {
        "a": 1,
        "b": Object {
          "c": 3,
        },
      },
    ]
  `);
});

it("a few lits", () => {
  const frag = te`return [
  ${te.lit(-Number.MAX_SAFE_INTEGER)},
  ${te.lit(-Number.MAX_VALUE)},
  ${te.lit(Number.MIN_VALUE)},
  ${te.lit("")},
  ${te.lit(AWKWARD_STRING)},
  ${te.lit(true)},
  ${te.lit(false)},
  ${te.lit(null)},
  ${te.lit(undefined)},
  ${te.lit(COMPLEX_OBJECT)}
]`;
  expect(te.compile(frag)).toMatchInlineSnapshot(`
    Object {
      "refs": Object {
        "_$$_ref_1": Object {
          "a": 1,
          "b": Object {
            "c": 3,
          },
        },
      },
      "string": "return [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      \\"\\",
      \\"string\\\\\\"'\`$\\\\\\\\\\",
      true,
      false,
      null,
      undefined,
      _$$_ref_1
    ]",
    }
  `);
  const val = te.run<any[]>(frag);
  expect(val[4]).toStrictEqual(AWKWARD_STRING);
  expect(val[9]).toStrictEqual(COMPLEX_OBJECT);
  expect(val).toMatchInlineSnapshot(`
    Array [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string\\"'\`$\\\\",
      true,
      false,
      null,
      undefined,
      Object {
        "a": 1,
        "b": Object {
          "c": 3,
        },
      },
    ]
  `);
});

it("mixture", () => {
  const inner = te`[
  ${te.lit(-Number.MAX_SAFE_INTEGER)},
  ${te.lit(-Number.MAX_VALUE)},
  ${te.lit(Number.MIN_VALUE)},
  ${te.lit("")},
  ${te.lit(AWKWARD_STRING)},
  ${te.lit(true)},
  ${te.lit(false)},
  ${te.lit(null)},
  ${te.ref(undefined)},
  ${te.ref(COMPLEX_OBJECT)}
]`;
  const key = te.lit(9);
  const frag = te`return ${inner}[${key}];`;
  expect(te.compile(frag)).toMatchInlineSnapshot(`
    Object {
      "refs": Object {
        "_$$_ref_1": undefined,
        "_$$_ref_2": Object {
          "a": 1,
          "b": Object {
            "c": 3,
          },
        },
      },
      "string": "return [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      \\"\\",
      \\"string\\\\\\"'\`$\\\\\\\\\\",
      true,
      false,
      null,
      _$$_ref_1,
      _$$_ref_2
    ][9];",
    }
  `);
  const val = te.run(frag);
  expect(val).toStrictEqual(COMPLEX_OBJECT);
});

it("te.run`return ${te.lit(1)}+${te.ref(2)}`", () => {
  expect(te.run`return ${te.lit(1)}+${te.ref(2)}`).toEqual(3);
});
