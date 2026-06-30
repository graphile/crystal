import type { TE } from "../dist/index.js";
import te from "../dist/index.js";

// Make the string longer so it goes through the non-optimized path
const long = "a".repeat(2000);

const testStrings = [
  "",
  "a",
  "abcdefghijklmnopqrstuvwxyz",
  "\\",
  "'",
  "\\'",
  "\\\\'",
  '"',
  '\\"',
  '\\\\"',
  "`",
  "\\`",
  "\\\\`",
  "aaa${a}aaa",
  "aaa\\${a}aaa",
  "aaa\\\\${a}aaa",
  "aaa$${a}aaa",
  "aaa$\\${a}aaa",
  "aaa\\$${a}aaa",
  "aaa\\$\\${a}aaa",
  "'\"` \\'\\\"\\` ${foo}\\${foo}\\\\${foo}",
];

const testCases: Array<[TE, string]> = testStrings.flatMap((evilString) => [
  [
    te`const foo = 7; return "abc${te.substring(evilString, '"')}123"`,
    `abc` + evilString + `123`,
  ],
  [
    te`const foo = 7; return 'abc${te.substring(evilString, "'")}123'`,
    `abc` + evilString + `123`,
  ],
  [
    te`const foo = 7; return \`abc${te.substring(evilString, "`")}123\``,
    `abc` + evilString + `123`,
  ],
  [
    te`const foo = 7; return "abc${te.substring(long + evilString, '"')}123"`,
    `abc` + long + evilString + `123`,
  ],
  [
    te`const foo = 7; return 'abc${te.substring(long + evilString, "'")}123'`,
    `abc` + long + evilString + `123`,
  ],
  [
    te`const foo = 7; return \`abc${te.substring(long + evilString, "`")}123\``,
    `abc` + long + evilString + `123`,
  ],
]);

it.each(testCases)("foo", (teNode, expected) => {
  const compiled = te.compile(teNode);
  expect(compiled.refs).toEqual({});
  const result = te.run(teNode);
  expect(result).toEqual(expected);
});
