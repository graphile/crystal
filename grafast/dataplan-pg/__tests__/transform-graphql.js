/*
 * This file is critical to how the dataplan-pg integration tests work.
 *
 * We create `.test.graphql` GraphQL documents and these are then "transformed"
 * into standard Jest tests (see below). At the top of these .test.graphql files
 * a number of checks/configurations can be specified:
 *
 * - Lines starting `##` are where our assertions are added; these are useful to
 *   ensure that anything that wants a concrete assertion (i.e. not a snapshot
 *   that can be overwritten) can be checked.
 * - Lines starting `#>` are configurations, we expect `<key>: <value>` where
 *   `key` is a plain string and value is a JSON5 value
 *   - `directPg`: use a direct connection to PG rather than our helper which tracks queries
 *   - `checkErrorSnapshots`: if set `false` then we'll not test the errors
 * - Lines starting `#!` are to be added to the "callback", this is typically
 *   useful for subscription tests that need to trigger events, etc
 */

// IMPORTANT: after editing this file, you must run `yarn jest --clearCache`
// because the transformed code gets cached.

const JSON5 = require("json5");

exports.makeProcess =
  (options = { includeDeoptimize: true, includeStringified: true }) =>
  (src, path) => {
    const lines = src.split("\n");
    const config = Object.create(null);
    config.checkErrorSnapshots = true;
    const assertions = [];
    const documentLines = [];
    const scripts = [];
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
        const assertion = line.substr(2);
        assertions.push(assertion);
        if (/expect\(errors\).toBeFalsy\(\)/.test(assertion)) {
          config.checkErrorSnapshots = false;
        }
      } else if (line.startsWith("#!")) {
        scripts.push(line.substr(2));
      } else if (line.match(/^#\s*expect\(/)) {
        throw new Error(
          "Found line that looks like an assertion, but isn't in a '##' comment: '${line}'",
        );
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
    return {
      code: `\
const { assertSnapshotsMatch, assertResultsMatch, assertErrorsMatch, runTestQuery } = require("../_test");

const document = ${JSON.stringify(document)};
const path = ${JSON.stringify(path)};
const config = ${JSON.stringify(config)};

let result1;
let result2;
let result3;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitFor = async (conditionCallback, max = 5000) => {
  let start = Date.now();
  while (!conditionCallback()) {
    if (Date.now() >= start + max) {
      throw new Error(\`Waited \${max}ms but condition does not pass\`);
    }
    await sleep(10);
  }
}

const callback = ${
        scripts.length
          ? `async (pgClient, payloads) => {
  ${scripts.join("\n  ")}
}`
          : `null`
      };

beforeAll(() => {
  result1 =
    runTestQuery(document, config, { callback, path });
  // Always run result2 after result1 finishes
  result2 = ${
    options.includeDeoptimize
      ? `result1.then(() => {}, () => {}).then(() =>
    runTestQuery(document, config, { callback, path, deoptimize: true })
  )`
      : `result1.then(() => {}, () => {})`
  }
  // Always run result3 after result2 finishes
  result3 = ${
    options.includeStringified
      ? `result2.then(() => {}, () => {}).then(() =>
    runTestQuery(document, config, { callback, path, ${
      options.includeDeoptimize ? `deoptimize: true, ` : ``
    }outputDataAsString: true })
  )`
      : `result2.then(() => {}, () => {})`
  };
  // Wait for these promises to resolve, even if it's with errors.
  return Promise.all([result1.catch(e => {}), result2.catch(e => {}), result3.catch(e => {})]);
}, 30000);

afterAll(() => {
  result1 = result2 = result3 = null;
});

${assertions
  .map((assertion) => {
    return `\
it(${JSON.stringify(assertion.trim())}, async () => {
  const { data, payloads, errors, queries } = await result1;
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

it('matches plan (mermaid) snapshots', () => assertSnapshotsMatch('mermaid', {
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

if (config.checkErrorSnapshots) {
  it('matches errors snapshot', () => assertSnapshotsMatch('errors', {
    document,
    path,
    config,
    result: result1,
  }));
}

${
  options.includeDeoptimize
    ? `
it('returns same data for optimized vs deoptimized', () => assertResultsMatch(result1, result2, { config }));
it('returns same errors for optimized vs deoptimized', () => assertErrorsMatch(result1, result2, { config }));
`
    : ``
}
${
  options.includeStringified
    ? `
it('returns same data for optimized vs stringified${
        options.includeDeoptimize ? ` deoptimized` : ``
      }', () => assertResultsMatch(result1, result3, { config }));
it('returns same errors for optimized vs stringified${
        options.includeDeoptimize ? ` deoptimized` : ``
      }', () => assertErrorsMatch(result1, result3, { config }));
      `
    : ``
}

${
  options.includeDeoptimize
    ? `
it('matches SQL snapshots with inlining disabled', () => assertSnapshotsMatch('sql', {
  document,
  path,
  config,
  result: result2,
  ext: ".deopt",
}));

it('matches plan (mermaid) snapshots with inlining disabled', () => assertSnapshotsMatch('mermaid', {
  document,
  path,
  config,
  result: result2,
  ext: ".deopt",
}));
`
    : ``
}
`,
    };
  };

exports.process = exports.makeProcess();
