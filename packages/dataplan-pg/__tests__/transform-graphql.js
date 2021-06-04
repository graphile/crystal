// IMPORTANT: after editing this file, you must run `yarn jest --clearCache`
// because the transformed code gets cached.
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

  // NOTE: technically JSON.stringify is not safe for producing JavaScript
  // code, this could be a security vulnerability in general. However, in this
  // case all the data that we're converting to code is controlled by us, so
  // we'd only be attacking ourselves, therefore we'll allow it rather than
  // bringing in an extra dependency.
  return `\
const { assertSnapshotsMatch, assertResultsMatch, runTestQuery } = require("../_test");

const document = ${JSON.stringify(document)};
const path = ${JSON.stringify(path)};
const config = ${JSON.stringify(config)};

let result1;
let result2;

beforeAll(() => {
  result1 = runTestQuery(document, config.variables, {});
  result2 = runTestQuery(document, config.variables, { deoptimize: true });
  // Wait for these promises to resolve, even if it's with errors.
  return Promise.all([result1.catch(e => {}), result2.catch(e => {})]);
});

${assertions
  .map((assertion) => {
    return `\
it(${JSON.stringify(assertion.trim())}, async () => {
  const { data, queries } = await result1;
  ${assertion}
});`;
  })
  .join("\n\n")}

it('matches SQL snapshots', () => assertSnapshotsMatch('sql', {
  document,
  path,
  config,
  result: result1,
}));

it('matches data snapshot', () => assertSnapshotsMatch('result', {
  document,
  path,
  config,
  result: result1,
}));

it('returns same data for optimized vs deoptimized', () => assertResultsMatch(result1, result2));

it('matches SQL snapshots with inlining disabled', () => assertSnapshotsMatch('sql', {
  document,
  path,
  config,
  result: result2,
  ext: ".deopt",
}));
`;
};
