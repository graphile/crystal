import te from "../dist/index.js";

it("basic", () => {
  expect(te.compile(te`return 1`)).toMatchInlineSnapshot(`
    {
      "refs": {},
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
    {
      "refs": {
        "_$$_ref_1": -9007199254740991,
        "_$$_ref_10": {
          "a": 1,
          "b": {
            "c": 3,
          },
        },
        "_$$_ref_2": -1.7976931348623157e+308,
        "_$$_ref_3": 5e-324,
        "_$$_ref_4": "",
        "_$$_ref_5": "string"'\`$\\",
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
    [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string"'\`$\\",
      true,
      false,
      null,
      undefined,
      {
        "a": 1,
        "b": {
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
    {
      "refs": {
        "_$$_ref_1": {
          "a": 1,
          "b": {
            "c": 3,
          },
        },
      },
      "string": "return [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string\\"'\`$\\\\",
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
    [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string"'\`$\\",
      true,
      false,
      null,
      undefined,
      {
        "a": 1,
        "b": {
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
    {
      "refs": {
        "_$$_ref_1": undefined,
        "_$$_ref_2": {
          "a": 1,
          "b": {
            "c": 3,
          },
        },
      },
      "string": "return [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string\\"'\`$\\\\",
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

it("throws on forbidden identifiers", () => {
  expect(() => te.identifier("null")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid identifier name 'null'"`,
  );
  expect(() => te.ref(null, "null")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid variable name 'null'"`,
  );

  expect(() => te.identifier("true")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid identifier name 'true'"`,
  );
  expect(() => te.ref(true, "true")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid variable name 'true'"`,
  );

  expect(() => te.identifier("false")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid identifier name 'false'"`,
  );
  expect(() => te.ref(false, "false")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid variable name 'false'"`,
  );

  expect(() => te.identifier("debugger")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid identifier name 'debugger'"`,
  );
  expect(() => te.ref(null, "debugger")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid variable name 'debugger'"`,
  );

  expect(() => te.identifier("undefined")).toThrowErrorMatchingInlineSnapshot(
    `"Invalid identifier name 'undefined'"`,
  );
  expect(() =>
    te.ref(undefined, "undefined"),
  ).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name 'undefined'"`);
});

it("named refs", () => {
  const frag = te`return [
  ${te.ref(-Number.MAX_SAFE_INTEGER, "maxSafeInt")},
  ${te.ref(-Number.MAX_VALUE, "maxValue")},
  ${te.ref(Number.MIN_VALUE, "minValue")},
  ${te.ref("", "empty")},
  ${te.ref(AWKWARD_STRING, "awkward")},
  ${te.ref(true, "trueVal")},
  ${te.ref(false, "falseVal")},
  ${te.ref(null, "nullVal")},
  ${te.ref(undefined, "undefinedVal")},
  ${te.ref(COMPLEX_OBJECT, "complex")}
]`;
  expect(te.compile(frag)).toMatchInlineSnapshot(`
    {
      "refs": {
        "awkward": "string"'\`$\\",
        "complex": {
          "a": 1,
          "b": {
            "c": 3,
          },
        },
        "empty": "",
        "falseVal": false,
        "maxSafeInt": -9007199254740991,
        "maxValue": -1.7976931348623157e+308,
        "minValue": 5e-324,
        "nullVal": null,
        "trueVal": true,
        "undefinedVal": undefined,
      },
      "string": "return [
      maxSafeInt,
      maxValue,
      minValue,
      empty,
      awkward,
      trueVal,
      falseVal,
      nullVal,
      undefinedVal,
      complex
    ]",
    }
  `);
  const val = te.run<any[]>(frag);
  expect(val[4]).toStrictEqual(AWKWARD_STRING);
  expect(val[9]).toStrictEqual(COMPLEX_OBJECT);
  expect(val).toMatchInlineSnapshot(`
    [
      -9007199254740991,
      -1.7976931348623157e+308,
      5e-324,
      "",
      "string"'\`$\\",
      true,
      false,
      null,
      undefined,
      {
        "a": 1,
        "b": {
          "c": 3,
        },
      },
    ]
  `);
});
