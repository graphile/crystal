import dyk from "../dist";

it("allows normal keys", () => {
  const frag = dyk`return { ${dyk.dangerousKey("a")}: 1, ${dyk.dangerousKey(
    "monkey",
  )}: 2 }`;
  expect(dyk.compile(frag).string).toMatchInlineSnapshot(
    `"return { a: 1, monkey: 2 }"`,
  );
  const val = dyk.run(frag);
  expect(val).toEqual({
    a: 1,
    monkey: 2,
  });
});

it("allows awkward keys", () => {
  const frag = dyk`return { ${dyk.dangerousKey("1")}: 1, ${dyk.dangerousKey(
    "_1frog",
  )}: 2 }`;
  expect(dyk.compile(frag).string).toMatchInlineSnapshot(
    `"return { \\"1\\": 1, _1frog: 2 }"`,
  );
  const val = dyk.run(frag);
  expect(val).toEqual({
    1: 1,
    _1frog: 2,
  });
});

it("forbids __proto__", () => {
  expect(() => {
    dyk`return { ${dyk.dangerousKey("__proto__")}: {a: 1} }`;
  }).toThrowErrorMatchingInlineSnapshot(
    `"Forbidden object key: \\"__proto__\\"; consider using 'Object.create(null)' and assigning properties using dyk.lit."`,
  );
});
