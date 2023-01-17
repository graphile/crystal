import dyk, { DYK } from "../dist";

const evilString = "'\"` \\'\\\"\\` ${foo}\\${foo}\\\\${foo}";

const testCases: Array<[DYK, string]> = [
  [
    dyk`const foo = 7; return "abc${dyk.substring(evilString, '"')}123"`,
    `abc` + evilString + `123`,
  ],
  [
    dyk`const foo = 7; return 'abc${dyk.substring(evilString, "'")}123'`,
    `abc` + evilString + `123`,
  ],
  [
    dyk`const foo = 7; return \`abc${dyk.substring(evilString, "`")}123\``,
    `abc` + evilString + `123`,
  ],
];

it.each(testCases)("foo", (dykNode, expected) => {
  const compiled = dyk.compile(dykNode);
  expect(compiled.refs).toEqual({});
  const result = dyk.run(dykNode);
  expect(result).toEqual(expected);
});
