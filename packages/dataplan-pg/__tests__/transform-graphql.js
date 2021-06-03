// IMPORTANT: after editing this file, you must run `yarn jest --clearCache`
// because the transformed code gets cached.
const { basename } = require("path");
const JSON5 = require("json5");

exports.process = (src, path) => {
  const lines = src.split("\n");
  const config = {};
  const assertions = [];
  const documentLines = [];
  for (const line of lines) {
    if (line.startsWith("#>")) {
      const colon = line.indexOf(":");
      if (colon < 0) {
        throw new Error(
          `Invalid query configuration '${line}' - expected colon.`,
        );
      }
      const key = line.substr(2, colon - 2).trim();
      const value = JSON5.parse(line.substr(colon + 1));
      config[key] = value;
    } else if (line.startsWith("##")) {
      assertions.push(line.substr(2));
    } else {
      documentLines.push(line);
    }
  }
  const document = documentLines.join("\n");

  return `\
const { testGraphQL } = require("../_test");

const document = ${JSON.stringify(document)};
const path = ${JSON.stringify(path)};

it('execute', () => testGraphQL({
  document,
  path,
  assertions: async (result) => {
    const { data, queries } = result;
    ${assertions.join("\n    ")}
  },
  config: ${JSON.stringify(config)},
}));
`;
};
