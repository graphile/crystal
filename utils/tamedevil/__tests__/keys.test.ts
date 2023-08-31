import te from "../dist/index.js";

it("allows normal keys", () => {
  const frag = te`return { ${te.safeKeyOrThrow("a")}: 1, ${te.safeKeyOrThrow(
    "monkey",
  )}: 2 }`;
  expect(te.compile(frag).string).toMatchInlineSnapshot(
    `"return { a: 1, monkey: 2 }"`,
  );
  const val = te.run(frag);
  expect(val).toEqual({
    a: 1,
    monkey: 2,
  });
});

it("allows awkward keys", () => {
  const frag = te`return { ${te.safeKeyOrThrow("1")}: 1, ${te.safeKeyOrThrow(
    "_1frog",
  )}: 2 }`;
  expect(te.compile(frag).string).toMatchInlineSnapshot(
    `"return { "1": 1, _1frog: 2 }"`,
  );
  const val = te.run(frag);
  expect(val).toEqual({
    1: 1,
    _1frog: 2,
  });
});

it("forbids __proto__", () => {
  expect(() => {
    te`return { ${te.safeKeyOrThrow("__proto__")}: {a: 1} }`;
  }).toThrowErrorMatchingInlineSnapshot(
    `"Forbidden object key: "__proto__"; consider using 'Object.create(null)' and assigning properties using te.lit."`,
  );
});
