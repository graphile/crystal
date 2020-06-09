// IMPORTANT: after editing this file, you must run `yarn jest --clearCache`
// because the transformed code gets cached.
const { basename } = require("path");

exports.process = (src, path) => {
  return `\
const { testGraphQL } = require("./_test");

const query = ${JSON.stringify(src)};
const path = ${JSON.stringify(path)};

it('execute', () => {
  testGraphQL(query, path);
});
`;
};
