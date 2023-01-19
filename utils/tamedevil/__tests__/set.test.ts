import te from "../dist/index.js";

const symbol = Symbol("symbol");

const testCases: Array<
  [string | symbol | number, ReturnType<typeof te.compile>]
> = [
  ["foo", { refs: {}, string: "obj.foo" }],
  ["1foo", { refs: {}, string: `obj["1foo"]` }],
  [
    '1foo"]; process.exit(1); //',
    { refs: {}, string: `obj["1foo\\"]; process.exit(1); //"]` },
  ],
  ["__proto__", { refs: {}, string: "obj.__proto__" }],
  ["constructor", { refs: {}, string: "obj.constructor" }],
  [1, { refs: {}, string: `obj[1]` }],
  [symbol, { refs: { _$$_ref_1: symbol }, string: `obj[_$$_ref_1]` }],
];

it.each(testCases)("set on Object.create(null)", (val, expected) => {
  expect(te.compile(te`obj${te.set(val, true)}`)).toEqual(expected);
});

it("works on 'frogs' if non-null prototype", () => {
  expect(te.compile(te`obj${te.set("frogs")}`)).toEqual({
    refs: {},
    string: "obj.frogs",
  });
});
it("throws on '__proto__' if non-null prototype", () => {
  expect(() =>
    te.compile(te`obj${te.set("__proto__")}`),
  ).toThrowErrorMatchingInlineSnapshot(
    `"Attempted to set '__proto__' on an object that isn't declared as having a null prototype. This could be unsafe."`,
  );
});
it("throws on 'constructor' if non-null prototype", () => {
  expect(() =>
    te.compile(te`obj${te.set("constructor")}`),
  ).toThrowErrorMatchingInlineSnapshot(
    `"Attempted to set 'constructor' on an object that isn't declared as having a null prototype. This could be unsafe."`,
  );
});
