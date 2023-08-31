import te from "../dist/index.js";

it("gives simple access to simple string prop", () => {
  const untrustedInput = "frogs";
  const result = te.compile(te`return (obj) => obj${te.get(untrustedInput)}`);
  expect(result.refs).toEqual({});
  expect(result.string).toMatchInlineSnapshot(`"return (obj) => obj.frogs"`);
});

it("gives simple access to dangerous string prop", () => {
  // NOTE: accessing __proto__ is not seen as a vulnerability in this project,
  // it's up to your code to check that this is safe. Typically with
  // null-prototype objects it's fine, but for more complex objects you should
  // access more caution.
  const untrustedInput = "__proto__";
  const result = te.compile(te`return (obj) => obj${te.get(untrustedInput)}`);
  expect(result.refs).toEqual({});
  expect(result.string).toMatchInlineSnapshot(
    `"return (obj) => obj.__proto__"`,
  );
});

it("gives bracketed access to simple number prop", () => {
  const untrustedInput = 27;
  const result = te.compile(te`return (obj) => obj${te.get(untrustedInput)}`);
  expect(result.refs).toEqual({});
  expect(result.string).toMatchInlineSnapshot(`"return (obj) => obj[27]"`);
});

it("gives bracketed access to simple symbol prop", () => {
  const untrustedInput = Symbol("some_symbol");
  const result = te.compile(te`return (obj) => obj${te.get(untrustedInput)}`);
  expect(result.refs).toMatchInlineSnapshot(`
    {
      "_$$_ref_1": Symbol(some_symbol),
    }
  `);
  expect(result.string).toMatchInlineSnapshot(
    `"return (obj) => obj[_$$_ref_1]"`,
  );
});
