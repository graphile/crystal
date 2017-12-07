const { parseTags } = require("../src/utils");
  
test('tags are removed correctly', () => {
  expect(parseTags(`@deprecated Persons now have first and last name\nThe person's name`).text).toBe(`The person's name`)
  expect(parseTags(`@deprecated Persons now have first and last name`).text).toBe(``)
  expect(parseTags(`@foo\n@bar\nBaz`).text).toBe(`Baz`)
  expect(parseTags(` @foo @bar\nBaz`).text).toBe(` @foo @bar\nBaz`)
  expect(parseTags(`@foo\n @bar\nBaz`).text).toBe(` @bar\nBaz`)
  expect(parseTags(`@foo@bar Baz`).text).toBe(`@foo@bar Baz`)
  expect(parseTags(`Blah blah @deprecated`).text).toBe(`Blah blah @deprecated`)
  expect(parseTags(`Blah blah\n@deprecated`).text).toBe(`Blah blah\n@deprecated`)
  expect(parseTags(`@jsonField date timestamp\n@jsonField name text\n@jsonField episode enum ONE=1 TWO=2\nBaz`).text).toBe(`Baz`)
});

test('tags are extracted correctly', () => {
  expect(parseTags(`@deprecated Persons now have first and last name\nThe person's name`).tags).toEqual({deprecated: "Persons now have first and last name"})
  expect(parseTags(`@deprecated Persons now have first and last name`).tags).toEqual({deprecated: "Persons now have first and last name"})
  expect(parseTags(`@foo\n@bar\nBaz`).tags).toEqual({foo: true, bar: true})
  expect(parseTags(` @foo @bar\nBaz`).tags).toEqual({})
  expect(parseTags(`@foo\n @bar\nBaz`).tags).toEqual({foo: true})
  expect(parseTags(`@foo@bar Baz`).tags).toEqual({})
  expect(parseTags(`Blah blah @deprecated`).tags).toEqual({})
  expect(parseTags(`Blah blah\n@deprecated`).tags).toEqual({})
  expect(parseTags(`@jsonField date timestamp\n@jsonField name text\n@jsonField episode enum ONE=1 TWO=2\nBaz`).tags).toEqual({jsonField: ["date timestamp", "name text", "episode enum ONE=1 TWO=2"]})
});