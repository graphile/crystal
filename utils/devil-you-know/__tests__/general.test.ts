import dyk from "../dist";

it("basic", () => {
  expect(dyk.compile(dyk`return 1`)).toMatchInlineSnapshot(`
    Object {
      "refs": Object {},
      "string": "return 1",
    }
  `);
});

const COMPLEX_OBJECT = { a: 1, b: { c: 3 } };
const AWKWARD_STRING = "string\"'`$\\";

it("a few refs", () => {
  const frag = dyk`return [
  ${dyk.ref(-Number.MAX_SAFE_INTEGER)},
  ${dyk.ref(-Number.MAX_VALUE)},
  ${dyk.ref(Number.MIN_VALUE)},
  ${dyk.ref("")},
  ${dyk.ref(AWKWARD_STRING)},
  ${dyk.ref(true)},
  ${dyk.ref(false)},
  ${dyk.ref(null)},
  ${dyk.ref(undefined)},
  ${dyk.ref(COMPLEX_OBJECT)}
]`;
  expect(dyk.compile(frag)).toMatchInlineSnapshot(`
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
  const val = dyk.run(frag);
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
  const frag = dyk`return [
  ${dyk.lit(-Number.MAX_SAFE_INTEGER)},
  ${dyk.lit(-Number.MAX_VALUE)},
  ${dyk.lit(Number.MIN_VALUE)},
  ${dyk.lit("")},
  ${dyk.lit(AWKWARD_STRING)},
  ${dyk.lit(true)},
  ${dyk.lit(false)},
  ${dyk.lit(null)},
  ${dyk.lit(undefined)},
  ${dyk.lit(COMPLEX_OBJECT)}
]`;
  expect(dyk.compile(frag)).toMatchInlineSnapshot(`
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
  const val = dyk.run(frag);
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
  const inner = dyk`[
  ${dyk.lit(-Number.MAX_SAFE_INTEGER)},
  ${dyk.lit(-Number.MAX_VALUE)},
  ${dyk.lit(Number.MIN_VALUE)},
  ${dyk.lit("")},
  ${dyk.lit(AWKWARD_STRING)},
  ${dyk.lit(true)},
  ${dyk.lit(false)},
  ${dyk.lit(null)},
  ${dyk.ref(undefined)},
  ${dyk.ref(COMPLEX_OBJECT)}
]`;
  const key = dyk.lit(9);
  const frag = dyk`return ${inner}[${key}];`;
  expect(dyk.compile(frag)).toMatchInlineSnapshot(`
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
  const val = dyk.run(frag);
  expect(val).toStrictEqual(COMPLEX_OBJECT);
});
