import { modifiedCodec, TYPES } from "../dist/index.js";

test("creates a modified codec from a base codec", () => {
  const fromPg = (value: string) => value.toUpperCase();
  const codec = modifiedCodec(TYPES.text, {
    name: "modifiedText",
    description: "Modified text",
    extensions: { typeModifier: 42 },
    fromPg,
  });

  expect(codec).toMatchObject({
    name: "modifiedText",
    baseCodec: TYPES.text,
    sqlType: TYPES.text.sqlType,
    description: "Modified text",
    extensions: { typeModifier: 42 },
    fromPg,
  });
  expect(codec.toPg).toBe(TYPES.text.toPg);
});

test("does not modify a modified codec", () => {
  const codec = modifiedCodec(TYPES.text, { name: "modifiedText" });

  expect(() => modifiedCodec(codec, { name: "twiceModifiedText" })).toThrow(
    "Cannot modify a codec that has already been modified",
  );
});
