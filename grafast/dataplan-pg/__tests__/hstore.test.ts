import { parseHstore, stringifyHstore } from "../dist/codecUtils/hstore.js";

test("parses simple hstore pairs", () => {
  expect(parseHstore('"a" => "b", "c" => "d"')).toEqual({
    a: "b",
    c: "d",
  });
});

test("parses NULL values", () => {
  expect(parseHstore('"a" => NULL, "b" => "NULL"')).toEqual({
    a: null,
    b: "NULL",
  });
});

test("parses escaped quotes and backslashes", () => {
  expect(parseHstore('"a\\"b" => "c\\\\d"')).toEqual({
    'a"b': "c\\d",
  });
});

test("supports __proto__ key without prototype pollution", () => {
  const result = parseHstore('"__proto__" => "polluted"');
  expect(result["__proto__"]).toEqual("polluted");
  expect(Object.prototype).not.toHaveProperty("polluted");
});

test("stringifies with nulls and escapes", () => {
  expect(stringifyHstore({ a: "b", c: null, 'a"b': "c\\d" })).toEqual(
    '"a" => "b", "c" => NULL, "a\\"b" => "c\\\\d"',
  );
});

test("roundtrips parse/stringify for simple values", () => {
  const input = '"a" => "b", "c" => NULL';
  expect(stringifyHstore(parseHstore(input))).toEqual(input);
});
